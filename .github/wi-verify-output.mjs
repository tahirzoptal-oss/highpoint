#!/usr/bin/env node
// BUG-100: the OUTPUT gate for WI fixes, run in CI AFTER `npm run build`. `npm run build` proves the
// code compiles; this proves the edit actually reached the RENDERED page. It reads the fix claim
// (.github/wi-verify-claim.json), locates the built HTML for each target page in the static output
// (dist/ | build/ | out/), and asserts the targeted field now carries the proposed value. A dead fix
// (unchanged/absent output - the whole BUG-100 defect: dead code builds green) exits 1 -> the
// wi-verify check goes red -> the reconciler closes the PR (retryable).
//
// Self-contained (no deps) because it runs in the CLIENT repo. Stack-agnostic on STATIC output; when
// no static output dir exists (a pure-SSR Next app) or the page HTML is not found, it SKIPS that
// claim (exit 0) - the dashboard's Vercel-preview crawl covers those. Run `node wi-verify-output.mjs
// --selftest` to exercise the pure extract/assert logic without a build.

import { readFile, stat } from "node:fs/promises"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim().toLowerCase()
const normUrl = (s) => norm(s).replace(/\/+$/, "")

// --- extractors (mirror the dashboard's crawl.ts; quote-aware per BUG-93) --------------------------
export function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html ?? ""))
  return m ? m[1].replace(/\s+/g, " ").trim() : ""
}
export function extractMetaDescription(html) {
  const h = String(html ?? "")
  const a = /<meta[^>]+name=["']description["'][^>]+content=(["'])([\s\S]*?)\1/i.exec(h)
  if (a) return a[2].trim()
  const b = /<meta[^>]+content=(["'])([\s\S]*?)\1[^>]+name=["']description["']/i.exec(h)
  return b ? b[2].trim() : ""
}
export function extractCanonical(html) {
  const h = String(html ?? "")
  const a = /<link[^>]+rel=["']canonical["'][^>]+href=(["'])([\s\S]*?)\1/i.exec(h)
  if (a) return a[2].trim()
  const b = /<link[^>]+href=(["'])([\s\S]*?)\1[^>]+rel=["']canonical["']/i.exec(h)
  return b ? b[2].trim() : ""
}
export function extractSchemaTypes(html) {
  const out = []
  for (const m of String(html ?? "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of String(m[1] ?? "").matchAll(/"@type"\s*:\s*"([^"]+)"/g)) out.push(t[1])
  }
  return out
}
export function atTypeOf(jsonLd) {
  try {
    const p = JSON.parse(jsonLd); const first = Array.isArray(p) ? p[0] : p; const t = first?.["@type"]
    if (typeof t === "string") return t
    if (Array.isArray(t) && typeof t[0] === "string") return t[0]
  } catch { /* fall through */ }
  const m = /"@type"\s*:\s*"([^"]+)"/.exec(String(jsonLd ?? "")); return m ? m[1] : null
}

// --- pure verdict (same rules as fix-output-assess.ts) --------------------------------------------
export function assess(html, kind, proposed) {
  switch (kind) {
    case "meta_description": return norm(extractMetaDescription(html)) === norm(proposed) ? "verified" : "dead"
    case "meta_title": return norm(extractTitle(html)) === norm(proposed) ? "verified" : "dead"
    case "canonical": return normUrl(extractCanonical(html)) === normUrl(proposed) ? "verified" : "dead"
    case "schema": {
      const want = atTypeOf(proposed); if (!want) return "skip"
      return extractSchemaTypes(html).some(t => norm(t) === norm(want)) ? "verified" : "dead"
    }
    default: return "skip" // body_keyword / copy / other on an HTML page: no single-field rendered signal
  }
}

// BUG-136: a static SEO file (/llms.txt, /robots.txt, /sitemap.xml, ...) is served verbatim, so it IS
// verifiable even though its claim kind is `other`. Rather than refuse the agent an unverifiable kind
// (a capability loss - it should still be able to fix llms.txt), verify the SERVED file's bytes.
const STATIC_FILE_RE = /\.(txt|xml|json|md|webmanifest)$/i
export function isStaticFilePath(path) {
  return STATIC_FILE_RE.test(String(path ?? "").split("?")[0])
}
// The proposed content reached the served file when the file now contains it (whitespace/case-
// insensitive). #34 wrote llms.txt content into the WRONG file, so the served /llms.txt was unchanged
// and this returns "dead" - the exact miss the old `other -> skip` hid.
export function assessStaticFile(content, proposed) {
  return norm(content).includes(norm(proposed)) ? "verified" : "dead"
}

// --- CI runner ------------------------------------------------------------------------------------
const OUTPUT_DIRS = ["dist", "build", "out"]
async function exists(p) { try { await stat(p); return true } catch { return false } }

async function findStaticDir() {
  for (const d of OUTPUT_DIRS) if (await exists(d)) return d
  return null
}
// Map a URL path to the built HTML file within the static output dir.
async function htmlForPath(dir, urlPath) {
  const p = String(urlPath || "/").split("?")[0].replace(/\/+$/, "") || "/"
  const candidates = p === "/"
    ? [join(dir, "index.html")]
    : [join(dir, `${p}.html`), join(dir, p, "index.html")]
  for (const c of candidates) if (await exists(c)) return c
  return null
}
// Locate a served static file: the built output copy (dist/build/out) first, then the repo's public/.
async function staticFileForPath(dir, urlPath) {
  const rel = String(urlPath ?? "").split("?")[0].replace(/^\/+/, "")
  if (!rel) return null
  for (const c of [join(dir, rel), join("public", rel)]) if (await exists(c)) return c
  return null
}

// BUG-136: parse our OWN claim file. Missing/invalid is an upstream bug (the dashboard always writes
// this file when it opens a fix PR), never an environment absence. Pure so it is unit-testable.
export function parseClaims(raw) {
  try {
    const parsed = JSON.parse(raw)
    return { ok: true, claims: Array.isArray(parsed) ? parsed : [parsed] }
  } catch {
    return { ok: false }
  }
}

// BUG-136: verdict tally -> exit code + a summary that never lets "I could not check" read as "I
// checked and it is fine". Fails on any DEAD fix or MALFORMED claim entry (our output); a run that only
// SKIPPED (pure-SSR pages / kinds the gate cannot verify) stays green but is reported distinctly.
export function summarizeVerification({ verified, dead, skipped, invalid }) {
  const line = `verified: ${verified}, skipped: ${skipped}, dead: ${dead}${invalid ? `, malformed: ${invalid}` : ""}.`
  const code = dead > 0 || invalid > 0 ? 1 : 0
  return { line, code }
}

async function main() {
  // BUG-136: a missing or unparseable claim is OUR output, not an environment absence - fail loudly
  // rather than green a PR the gate never examined (winterhillroofing#34 was merged on such a green).
  let claimRaw
  try {
    claimRaw = await readFile(".github/wi-verify-claim.json", "utf8")
  } catch {
    console.error("::error::wi-verify-output: claim file .github/wi-verify-claim.json is MISSING. The dashboard writes it on every fix PR, so its absence is a bug on our side - failing rather than greening an unchecked PR (BUG-136).")
    return 1
  }
  const parsed = parseClaims(claimRaw)
  if (!parsed.ok) {
    console.error("::error::wi-verify-output: claim file is not valid JSON. The applier produced malformed output - failing rather than greening an unchecked PR (BUG-136).")
    return 1
  }
  const claims = parsed.claims

  const dir = await findStaticDir()
  if (!dir) {
    console.log("wi-verify-output: no static output dir (dist/build/out) - pure-SSR app; the preview crawl covers this. SKIPPED (nothing verified here).")
    return 0
  }

  let verified = 0, dead = 0, skipped = 0, invalid = 0
  for (const c of claims) {
    if (!c || !c.path || !c.kind || c.proposed == null) {
      invalid++
      console.error(`::error::wi-verify-output: malformed claim entry (missing path/kind/proposed): ${JSON.stringify(c)}.`)
      continue
    }
    // BUG-136: a static SEO file (llms.txt/robots.txt/sitemap.xml/...) is served verbatim, so verify
    // its bytes directly instead of skipping it as an unverifiable `other`.
    if (isStaticFilePath(c.path)) {
      const sfile = await staticFileForPath(dir, c.path)
      if (!sfile) {
        skipped++
        console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: no served static file found (preview crawl covers it).`)
        continue
      }
      const verdict = assessStaticFile(await readFile(sfile, "utf8"), String(c.proposed))
      if (verdict === "dead") { dead++; console.error(`::error::wi-verify-output: DEAD - ${c.kind} on ${c.path} did not reach ${sfile} (served file unchanged/absent).`) }
      else { verified++; console.log(`wi-verify-output: verified - ${c.kind} on ${c.path} (static file).`) }
      continue
    }

    const file = await htmlForPath(dir, c.path)
    if (!file) {
      // Line-100 skip kept: a pure-SSR page has no built HTML and is genuinely out of scope (preview
      // crawl covers it). Now COUNTED + reported so "0 verified, N skipped" cannot read like a pass.
      skipped++
      console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: no built HTML in ${dir}/ (preview crawl covers it).`)
      continue
    }
    const html = await readFile(file, "utf8")
    const verdict = assess(html, c.kind, String(c.proposed))
    if (verdict === "dead") {
      dead++
      console.error(`::error::wi-verify-output: DEAD - ${c.kind} on ${c.path} did not reach ${file} (rendered value unchanged/absent).`)
    } else if (verdict === "verified") {
      verified++
      console.log(`wi-verify-output: verified - ${c.kind} on ${c.path}.`)
    } else {
      skipped++
      console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: this kind has no single rendered field the gate can verify.`)
    }
  }

  const { line, code } = summarizeVerification({ verified, dead, skipped, invalid })
  if (code === 0) console.log(`\nwi-verify-output: ${line} No dead fixes.`)
  else console.error(`\n::error::wi-verify-output: ${line} Failing the build.`)
  return code
}

function selftest() {
  let fail = 0
  const ok = (c, m) => { if (c) console.log("ok:", m); else { console.error("FAIL:", m); fail++ } }
  const withMeta = (v) => `<html><head><meta name="description" content="${v}"><title>T</title></head></html>`
  ok(assess(withMeta("A gate-clean 146 char description."), "meta_description", "A gate-clean 146 char description.") === "verified", "meta match -> verified")
  ok(assess(withMeta("old value"), "meta_description", "new value") === "dead", "meta unchanged -> dead")
  ok(assess("<html><head></head></html>", "meta_description", "x") === "dead", "meta absent -> dead")
  ok(assess('<script type="application/ld+json">{"@type":"FAQPage"}</script>', "schema", '{"@type":"FAQPage"}') === "verified", "schema @type present -> verified")
  ok(assess('<script type="application/ld+json">{"@type":"RoofingContractor"}</script>', "schema", '{"@type":"FAQPage"}') === "dead", "schema @type absent -> dead")
  ok(assess("<html></html>", "body_keyword", "x") === "skip", "body_keyword -> skip")
  ok(extractCanonical('<link rel="canonical" href="https://x.com/p">') === "https://x.com/p", "canonical extracted")
  // BUG-136: exit-code logic - our own bad output fails; a skip-only run stays green but reads distinctly.
  ok(summarizeVerification({ verified: 2, dead: 0, skipped: 0, invalid: 0 }).code === 0, "verified>0, no dead -> pass")
  ok(summarizeVerification({ verified: 0, dead: 1, skipped: 0, invalid: 0 }).code === 1, "a dead fix -> fail")
  ok(summarizeVerification({ verified: 0, dead: 0, skipped: 3, invalid: 0 }).code === 0, "all-skipped stays green")
  ok(/verified: 0, skipped: 3/.test(summarizeVerification({ verified: 0, dead: 0, skipped: 3, invalid: 0 }).line), "all-skipped reports distinctly (not 'all checked')")
  ok(summarizeVerification({ verified: 1, dead: 0, skipped: 0, invalid: 2 }).code === 1, "a malformed claim entry -> fail")
  ok(parseClaims('[{"path":"/","kind":"meta_description","proposed":"x"}]').ok === true, "valid claim parses")
  ok(parseClaims('[{"path":"/llms.txt","proposed":"a" "path":"/"').ok === false, "the #34 malformed claim -> not ok")
  // BUG-136: static SEO files are verifiable (other is no longer an unconditional skip).
  ok(isStaticFilePath("/llms.txt") === true && isStaticFilePath("/service-areas/orlando") === false, "static-file path detection")
  ok(assessStaticFile("# Header\n\nnew content here", "new content here") === "verified", "served static file contains proposed -> verified")
  ok(assessStaticFile("unchanged old file", "the brand new llms.txt content") === "dead", "served static file unchanged (#34) -> dead")
  console.log(fail ? `\n${fail} FAILED` : "\nwi-verify-output selftest OK")
  process.exit(fail ? 1 : 0)
}

// Run ONLY as a CLI (node wi-verify-output.mjs [--selftest]); importing the module (e.g. a unit test)
// must not execute main() / exit the process.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (process.argv.includes("--selftest")) selftest()
  // BUG-136: keep the fail-safe for a GENUINE unexpected crash (never block on our own bug in the
  // checker), but log it as an error annotation so it is noticed rather than buried in a green run.
  else main().then(code => process.exit(code)).catch(e => { console.error(`::error::wi-verify-output CRASHED (fail-safe, not blocking the build): ${e?.message ?? e}`); process.exit(0) })
}
