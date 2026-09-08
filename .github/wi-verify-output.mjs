#!/usr/bin/env node
// BUG-100: the OUTPUT gate for WI fixes, run in CI AFTER `npm run build`. `npm run build` proves the
// code compiles; this proves the edit actually reached the RENDERED page. It reads the fix claim
// (BUG-143: the per-branch .github/wi-verify-claims/<branch>.json, WI_CLAIM_BRANCH), locates the built HTML for each target page in the static output
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

// BUG-155 follow-up: decode HTML entities before comparing. React escapes text as it renders, so an
// apostrophe becomes &#x27;, & becomes &amp;, " becomes &quot; - the built page carries
// "America&#x27;s" while the claim's proposed is the raw "America's". Without decoding, that comparison
// can NEVER match and a correct H1/title/meta fix reads DEAD (worse than the old skip: a false DEAD
// looks like a real failure). Mirrors crawl.ts decodeEntities so this gate and the dashboard crawl
// agree. One left-to-right pass over named + decimal (&#NN;) + hex (&#xNN;) entities, so a
// double-escaped &amp;lt; decodes exactly one level (to &lt;) and unknown entities pass through.
const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }
export function decodeEntities(s) {
  return String(s ?? "").replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/gi, (m, ent) => {
    if (ent[0] === "#") {
      const cp = ent[1] === "x" || ent[1] === "X" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10)
      return Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m
    }
    const hit = NAMED_ENTITIES[ent.toLowerCase()]
    return hit === undefined ? m : hit
  })
}

// --- extractors (mirror the dashboard's crawl.ts; quote-aware per BUG-93; entity-decoded per the
//     BUG-155 follow-up so an escaped apostrophe/ampersand does not read as a mismatch) -------------
export function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html ?? ""))
  return m ? decodeEntities(m[1].replace(/\s+/g, " ").trim()) : ""
}
export function extractMetaDescription(html) {
  const h = String(html ?? "")
  const a = /<meta[^>]+name=["']description["'][^>]+content=(["'])([\s\S]*?)\1/i.exec(h)
  if (a) return decodeEntities(a[2].trim())
  const b = /<meta[^>]+content=(["'])([\s\S]*?)\1[^>]+name=["']description["']/i.exec(h)
  return b ? decodeEntities(b[2].trim()) : ""
}
export function extractCanonical(html) {
  const h = String(html ?? "")
  const a = /<link[^>]+rel=["']canonical["'][^>]+href=(["'])([\s\S]*?)\1/i.exec(h)
  if (a) return decodeEntities(a[2].trim())
  const b = /<link[^>]+href=(["'])([\s\S]*?)\1[^>]+rel=["']canonical["']/i.exec(h)
  return b ? decodeEntities(b[2].trim()) : ""
}
// BUG-155: every rendered <h1>'s text (tags stripped, whitespace collapsed, entities decoded). An H1
// is the most verifiable field on the page - one canonical element, plain text, already in the
// prerendered HTML - so it must NOT be skipped like body_keyword/copy. Returns all H1s so the gate
// can also flag >1.
export function extractH1s(html) {
  return [...String(html ?? "").matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()))
    .filter(Boolean)
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
// BUG-147: the raw JSON text of every JSON-LD block, so the field-level gate can PARSE the
// rendered object (not just scrape @type). extractSchemaTypes stays for the simple case.
export function extractSchemaBlocks(html) {
  const out = []
  for (const m of String(html ?? "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    out.push(String(m[1] ?? "").trim())
  }
  return out
}

// CHG-101 item 3: verify a SIBLING route for a dynamic-template schema ADD. A shared-template change ships
// on every route it renders, so the block of the proposed @type must (a) be PRESENT on the sibling (the
// builder rendered there) and (b) NOT carry the TARGET route's own city/service token - a FIXED node would
// ship the target's value on every sibling, which is exactly the defect the builder replaces. "verified" |
// "dead". Presence alone is insufficient (a fixed node is present everywhere too); the token check is what
// proves the node is data-driven.
export function siblingSchemaVerdict(html, proposed, targetToken) {
  const wantType = atTypeOf(String(proposed))
  if (!wantType) return "verified" // nothing to assert
  const block = extractSchemaBlocks(html).find(b => { const n = parseJsonLd(b, wantType); return n && typeMatches(n["@type"], wantType) })
  if (!block) return "dead" // the builder did not render this @type on the sibling
  const tok = String(targetToken ?? "").trim().toLowerCase()
  if (tok && block.toLowerCase().includes(tok)) return "dead" // a FIXED node shipped the target's value here
  return "verified"
}

// --- BUG-147 field-level schema logic (mirror of src/lib/website-intelligence/schema-diff.ts;
//     inlined because this file ships to the client repo with no deps) -------------------------
function typeMatches(t, want) {
  const w = norm(want)
  if (typeof t === "string") return norm(t) === w
  if (Array.isArray(t)) return t.some(x => typeof x === "string" && norm(x) === w)
  return false
}
function pickNode(nodes, wantType) {
  if (!nodes.length) return null
  if (wantType) { const hit = nodes.find(n => typeMatches(n["@type"], wantType)); if (hit) return hit }
  return nodes[0]
}
export function parseJsonLd(raw, wantType) {
  let parsed
  try { parsed = JSON.parse(raw) } catch { return null }
  if (Array.isArray(parsed)) return pickNode(parsed.filter(n => n && typeof n === "object"), wantType ?? null)
  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed["@graph"])) return pickNode(parsed["@graph"].filter(n => n && typeof n === "object"), wantType ?? null) ?? parsed
    return parsed
  }
  return null
}
function canon(v) {
  if (Array.isArray(v)) return `[${v.map(canon).sort().join(",")}]`
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map(k => `${norm(k)}:${canon(v[k])}`).join(",")}}`
  return norm(v)
}
const valuesEqual = (a, b) => canon(a) === canon(b)

// BUG-169: select the block(s) the CLAIM applies to, not the FIRST by position. A page can carry more
// than one block of the same @type (Capstone: a React-rendered RoofingContractor from PageSEO AND the
// full static index.html one), and judging the wrong one fails a correct in-place edit as DEAD. The
// claim keys are `previousKeys` for a merge, the proposed props for an ADD, or none (presence-only). A
// block that contains every claim key is a full match; if any exist, judge them all (pass only when each
// satisfies the claim); if none does, judge the single best-covering block so a GENUINE dropped field is
// still named. Pure + exported so the selection is unit-tested directly.
export function selectSchemaBlocks(html, proposed, previousKeys = [], isAdd = false) {
  const wantType = atTypeOf(proposed)
  if (!wantType) return { wantType: null, candidates: [], targets: [], count: 0 }
  const proposedObj = parseJsonLd(proposed, wantType)
  const candidates = []
  for (const b of extractSchemaBlocks(html)) {
    const o = parseJsonLd(b, wantType)
    if (o && typeMatches(o["@type"], wantType)) candidates.push(o)
  }
  const claimKeys = previousKeys.length
    ? previousKeys
    : isAdd && proposedObj
      ? Object.keys(proposedObj).filter(k => { const kl = k.toLowerCase(); return kl !== "@context" && kl !== "@type" })
      : []
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  const score = o => claimKeys.filter(k => has(o, k)).length
  let targets = []
  if (candidates.length) {
    const full = candidates.filter(o => score(o) === claimKeys.length)
    targets = full.length ? full : [candidates.reduce((a, b) => (score(b) > score(a) ? b : a), candidates[0])]
  }
  return { wantType, candidates, targets, count: candidates.length }
}

// Field-level verdict for ONE block: dead on a silently-dropped undeclared field, a declared removal
// that did not take, or an added property missing/with a wrong value; verified otherwise.
function judgeSchemaBlock(rendered, proposedObj, previousKeys, removals, isAdd) {
  const renderedKeys = new Set(Object.keys(rendered))
  const removalSet = new Set(removals)
  const lost = previousKeys.filter(k => !renderedKeys.has(k) && !removalSet.has(k))
  if (lost.length) { console.error(`::error::wi-verify-output: schema fix silently dropped undeclared field(s): ${lost.join(", ")}.`); return "dead" }
  const notRemoved = removals.filter(k => renderedKeys.has(k))
  if (notRemoved.length) { console.error(`::error::wi-verify-output: declared removal(s) still present: ${notRemoved.join(", ")}.`); return "dead" }
  // CHG-94: a TRUE ADD (isAdd) has no previousKeys, but every proposed property IS a new addition, so
  // value-check them all - confirm the new node reached the page WITH THE PROPOSED VALUES, not just the
  // @type. A MERGE keeps the previousKeys>0 path; a partial-MERGE (BUG-156, not an add) stays
  // presence-only so a preserved-but-degraded value is not false-flagged.
  if (proposedObj && (previousKeys.length > 0 || isAdd)) {
    const prev = new Set(previousKeys)
    for (const [k, v] of Object.entries(proposedObj)) {
      if (prev.has(k) || removalSet.has(k)) continue
      if (!renderedKeys.has(k)) { console.error(`::error::wi-verify-output: added property ${k} did not reach the rendered block.`); return "dead" }
      if (!valuesEqual(rendered[k], v)) { console.error(`::error::wi-verify-output: added property ${k} rendered with a different value than proposed.`); return "dead" }
    }
  }
  return "verified"
}

export function schemaVerdict(html, proposed, previousKeys = [], removals = [], isAdd = false) {
  const wantType = atTypeOf(proposed)
  if (!wantType) return "skip"
  const proposedObj = parseJsonLd(proposed, wantType)
  const { candidates, targets, count } = selectSchemaBlocks(html, proposed, previousKeys, isAdd)
  if (candidates.length === 0) {
    // No PARSEABLE block matched. Fall back to @type-presence (the pre-BUG-147 behavior) so a
    // hand-written, non-JSON JSON-LD block is not falsely failed - we just cannot field-check it.
    const typePresent = extractSchemaTypes(html).some(t => norm(t) === norm(wantType))
    if (!typePresent) return "dead"
    if (previousKeys.length || removals.length || isAdd) console.log(`wi-verify-output: NOTE - @type ${wantType} present but the block is not valid JSON; field-level preservation could not be checked.`)
    return "verified"
  }
  // BUG-169: a duplicate-entity defect on the page (>1 block of the claimed @type) is surfaced, not
  // silently used to steer the verdict - the claim-selected block(s) are judged either way.
  if (count > 1) console.log(`wi-verify-output: NOTE - ${count} "${wantType}" blocks on the page; judging the ${targets.length > 1 ? "blocks" : "block"} the claim applies to (a duplicate-entity defect on the page is worth a look).`)
  // Judge every claim-selected block; pass only when EACH satisfies the claim.
  for (const rendered of targets) {
    if (judgeSchemaBlock(rendered, proposedObj, previousKeys, removals, isAdd) === "dead") return "dead"
  }
  return "verified"
}

// --- pure verdict (same rules as fix-output-assess.ts) --------------------------------------------
export function assess(html, kind, proposed) {
  switch (kind) {
    case "meta_description": return norm(extractMetaDescription(html)) === norm(proposed) ? "verified" : "dead"
    case "meta_title": return norm(extractTitle(html)) === norm(proposed) ? "verified" : "dead"
    case "canonical": return normUrl(extractCanonical(html)) === normUrl(proposed) ? "verified" : "dead"
    // BUG-155: an H1 is a single canonical rendered element - verified when ANY rendered H1 matches
    // the proposed text (parity with the dashboard's assessFixOutput), dead on mismatch/absence. The
    // >1-H1 finding is surfaced by the runner (it re-extracts for the count).
    case "h1": return extractH1s(html).some(h => norm(h) === norm(proposed)) ? "verified" : "dead"
    // BUG-147: schema is field-level. assess() has no claim context (no previousKeys/removals),
    // so it runs the block-render + @type check; main() calls schemaVerdict with the claim's
    // previousKeys + removals to also catch silently-dropped fields.
    case "schema": return schemaVerdict(html, proposed)
    // Skipped kinds, each for a REAL reason (BUG-155 audit) - not inherited caution:
    //   body_keyword: a secondary keyword woven into prose has no single rendered element to read.
    //   copy: free-form body copy edit - no one canonical field to compare.
    //   other: the catch-all kind carries no field contract (a static-file `other` is handled by the
    //          assessStaticFile path in main(), not here).
    default: return "skip"
  }
}

// BUG-136: a static SEO file (/llms.txt, /robots.txt, /sitemap.xml, ...) is served verbatim, so it IS
// verifiable even though its claim kind is `other`. Rather than refuse the agent an unverifiable kind
// (a capability loss - it should still be able to fix llms.txt), verify the SERVED file's bytes.
const STATIC_FILE_RE = /\.(txt|xml|json|md|webmanifest)$/i
export function isStaticFilePath(path) {
  return STATIC_FILE_RE.test(String(path ?? "").split("?")[0])
}
// BUG-154: verify a static file as a LINE SET, not a contiguous blob. The claim's `proposed` is the
// WHOLE file (robots.txt / llms.txt), so the old `includes` broke the instant a reviewer inserted or
// reordered one line - the fix had landed, the file was BETTER than claimed, yet the gate said DEAD
// and "did not reach" pointed the reviewer at the wrong problem. Now: every non-comment directive in
// the claim must be present as a line in the served file; extra lines the reviewer added are a PASS
// (logged as additions), not a failure. Returns { verdict, missing, added }:
//   - verified: every claimed directive is present (served file may be a strict superset).
//   - drifted:  SOME claimed directives are present but at least one is missing (a directive
//               regressed, or the branch was hand-amended and the claim is stale - resync it).
//   - dead:     NONE of the claimed directives are present - the edit never reached the file (#34).
// A claim with no directive lines (only comments/blank) falls back to contiguous containment.
const directiveLines = (s) =>
  String(s ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => norm(l))

export function assessStaticFile(content, proposed) {
  const want = directiveLines(proposed)
  if (want.length === 0) {
    return { verdict: norm(content).includes(norm(proposed)) ? "verified" : "dead", missing: [], added: [] }
  }
  const have = new Set(directiveLines(content))
  const wantSet = new Set(want)
  const missing = want.filter((l) => !have.has(l))
  const added = [...have].filter((l) => !wantSet.has(l))
  if (missing.length === 0) return { verdict: "verified", missing: [], added }
  if (missing.length === want.length) return { verdict: "dead", missing, added }
  return { verdict: "drifted", missing, added }
}

// BUG-162: /robots.txt on a Next App Router site is served by app/robots.ts, NOT public/robots.txt
// (which is dead). Verifying a robots claim against the public/ file (or skipping it on a pure-SSR app)
// greens a change the site never serves - exactly how Camelback shipped "green" with zero harvester
// blocks live. When a route handler exists, verify the HANDLER SOURCE (the served source of truth)
// blocks every bulk harvester the claim requires. The harvester list comes from the claim's own
// proposed robots.txt (its Disallow groups), so this never drifts from the SOP the applier wrote.
const isRobotsPath = (p) => /\/robots\.txt$/i.test(String(p ?? "").split("?")[0])
const isSitemapPath = (p) => /\/sitemap(_index)?\.xml$/i.test(String(p ?? "").split("?")[0])

/** The user-agents the claim's robots.txt puts under a `Disallow: /` (the bulk harvesters). Pure. */
export function robotsHarvesterAgents(proposed) {
  const agents = new Set()
  let current = []
  let sawRule = false
  for (const raw of String(proposed ?? "").split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim()
    if (!line) continue
    const ua = /^user-agent:\s*(.+)$/i.exec(line)
    if (ua) { if (sawRule) { current = []; sawRule = false } current.push(ua[1].trim()); continue }
    const dis = /^disallow:\s*(\S+)/i.exec(line)
    if (dis) { sawRule = true; if (dis[1] === "/") for (const a of current) if (a !== "*") agents.add(a); continue }
    if (/^allow:/i.test(line)) sawRule = true
  }
  return [...agents]
}

/** Verify a robots route handler's SOURCE blocks every claimed harvester. verified/drifted/dead, or
 * skipped when the claim names no harvesters (nothing to assert). Pure. */
export function assessRobotsRoute(handlerSource, agents) {
  if (!agents || agents.length === 0) return { verdict: "skipped", missing: [] }
  const lower = String(handlerSource ?? "").toLowerCase()
  const missing = agents.filter((a) => !lower.includes(String(a).toLowerCase()))
  if (!/disallow/.test(lower) || missing.length === agents.length) return { verdict: "dead", missing: agents }
  if (missing.length === 0) return { verdict: "verified", missing: [] }
  return { verdict: "drifted", missing }
}

// --- CI runner ------------------------------------------------------------------------------------
// BUG-174: the static output root, first that exists. `.next/server/app` is Next.js App Router's
// prerender dir (route /services -> .next/server/app/services.html); without it an App Router rail
// (Camelback) found no dir, skipped every claim, and greened - shipping BUG-173's doubled title.
export const OUTPUT_DIRS = ["dist", "build", "out", ".next/server/app"]
async function exists(p) { try { await stat(p); return true } catch { return false } }

// BUG-162: the Next route handler that GENERATES a served path in this repo (fs check), or null. The
// public/ twin is dead when one exists, so wi-verify must not verify against it.
async function findRouteHandler(bases) {
  const exts = ["ts", "tsx", "js", "jsx"]
  for (const b of bases) for (const e of exts) { const p = `${b}.${e}`; if (await exists(p)) return p }
  return null
}
const findRobotsRouteHandler = () => findRouteHandler(["app/robots", "src/app/robots", "app/robots.txt/route", "src/app/robots.txt/route", "pages/robots.txt", "src/pages/robots.txt"])
const findSitemapRouteHandler = () => findRouteHandler(["app/sitemap", "src/app/sitemap", "app/sitemap.xml/route", "src/app/sitemap.xml/route", "pages/sitemap.xml", "src/pages/sitemap.xml"])

async function findStaticDir() {
  for (const d of OUTPUT_DIRS) if (await exists(d)) return d
  return null
}
// BUG-174: the candidate built-HTML files for a URL path within an output dir, in priority order. Pure
// (no fs) so the App Router mapping is unit-testable: `.next/server/app` + /services -> .next/server/app/
// services.html (candidate #1), matching how Next writes a prerendered route.
export function htmlCandidatesForPath(dir, urlPath) {
  const p = String(urlPath || "/").split("?")[0].replace(/\/+$/, "") || "/"
  const rel = p.replace(/^\/+/, "")
  return p === "/" ? [join(dir, "index.html")] : [join(dir, `${rel}.html`), join(dir, rel, "index.html")]
}
// Map a URL path to the built HTML file within the static output dir (dist/build/out/.next/server/app).
async function htmlForPath(dir, urlPath) {
  for (const c of htmlCandidatesForPath(dir, urlPath)) if (await exists(c)) return c
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

// BUG-143: the claim lives at a per-BRANCH path (.github/wi-verify-claims/<branch>.json) so a merge
// from main can never union-corrupt it. Resolve which file to read: this branch's file first (from
// WI_CLAIM_BRANCH = github.ref_name), then the legacy shared path for branches installed before the
// per-branch scheme. Pure so the selftest can exercise it.
export function wiClaimReadPaths(branch) {
  const out = []
  const b = String(branch ?? "").trim()
  if (b) out.push(`.github/wi-verify-claims/${b}.json`)
  out.push(".github/wi-verify-claim.json") // legacy fallback (pre-BUG-143 branches)
  return out
}

// BUG-136/174: verdict tally -> exit code + a summary that never lets "I could not check" read as "I
// checked and it is fine". Fails on any DEAD fix or MALFORMED claim entry (our output). BUG-174: a run
// that verified NOTHING but skipped something also fails - a gate that checked nothing must not look like
// a gate that passed (Camelback #43 skipped its only claim on an App Router output the gate could not read
// and greened, shipping a doubled title). A truly empty run (no claims at all) still passes.
export function summarizeVerification({ verified, dead, skipped, invalid }) {
  const allSkipped = verified === 0 && skipped > 0
  const line = `verified: ${verified}, skipped: ${skipped}, dead: ${dead}${invalid ? `, malformed: ${invalid}` : ""}${allSkipped ? " - checked nothing (nothing could be read)" : ""}.`
  const code = dead > 0 || invalid > 0 || allSkipped ? 1 : 0
  return { line, code }
}

async function main() {
  // BUG-136: a missing or unparseable claim is OUR output, not an environment absence - fail loudly
  // rather than green a PR the gate never examined (winterhillroofing#34 was merged on such a green).
  const candidates = wiClaimReadPaths(process.env.WI_CLAIM_BRANCH)
  let claimRaw = null
  let claimPath = null
  for (const p of candidates) {
    try { claimRaw = await readFile(p, "utf8"); claimPath = p; break } catch { /* try the next candidate */ }
  }
  if (claimRaw == null) {
    console.error(`::error::wi-verify-output: no claim file found (looked for ${candidates.join(", ")}). The dashboard writes a per-branch claim on every fix PR, so its absence is a bug on our side - failing rather than greening an unchecked PR (BUG-136).`)
    return 1
  }
  const parsed = parseClaims(claimRaw)
  if (!parsed.ok) {
    // BUG-143: name the real cause. The claim was valid when the applier wrote it; historically a git
    // merge from main into the fix branch union-corrupted the SHARED claim file into invalid JSON. The
    // claim is now per-branch (this path can no longer collide); a legacy shared file that is still
    // corrupt is fixed by re-running the fix to regenerate a clean per-branch claim.
    console.error(`::error::wi-verify-output: the claim file ${claimPath} is not valid JSON. It was valid when written; a git merge could corrupt the old SHARED claim file (BUG-143, now per-branch). Re-run the fix to regenerate a clean claim - this is not an applier bug.`)
    return 1
  }
  const claims = parsed.claims

  let verified = 0, dead = 0, skipped = 0, invalid = 0

  // BUG-162: verify a route-handler-served /robots.txt against the HANDLER SOURCE (the served source of
  // truth), independent of the static-output dir - a pure-SSR app has no dir but the handler is still
  // the file that serves robots. Do this pre-pass first; the rest go through the static-output gate.
  const robotsRoute = await findRobotsRouteHandler()
  const sitemapRoute = await findSitemapRouteHandler()
  const rest = []
  for (const c of claims) {
    if (!c || !c.path || !c.kind || c.proposed == null) {
      invalid++
      console.error(`::error::wi-verify-output: malformed claim entry (missing path/kind/proposed): ${JSON.stringify(c)}.`)
      continue
    }
    if (isRobotsPath(c.path) && robotsRoute) {
      const agents = robotsHarvesterAgents(String(c.proposed))
      const res = assessRobotsRoute(await readFile(robotsRoute, "utf8"), agents)
      if (res.verdict === "verified") {
        verified++
        console.log(`wi-verify-output: verified - ${c.kind} on ${c.path}: route handler ${robotsRoute} blocks all ${agents.length} bulk harvester(s).`)
      } else if (res.verdict === "skipped") {
        skipped++
        console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: the claim names no harvesters to assert against ${robotsRoute}.`)
      } else {
        dead++
        console.error(`::error::wi-verify-output: ${res.verdict === "drifted" ? "DRIFTED" : "DEAD"} - ${c.kind} on ${c.path}: route handler ${robotsRoute} does not block harvester(s): ${res.missing.slice(0, 10).join(", ")}. public/robots.txt is dead on this stack - the fix must edit ${robotsRoute} (BUG-162).`)
      }
      continue
    }
    rest.push(c)
  }

  const dir = await findStaticDir()
  if (!dir) {
    // BUG-174: no dist/build/out AND no .next/server/app prerenders. This is a real "could not read the
    // built output", not a clean pass - the all-skipped tally below now fails rather than greens.
    if (rest.length) { skipped += rest.length; console.log(`::warning::wi-verify-output: no static output dir (dist/build/out/.next/server/app) - could not read the built HTML for ${rest.length} claim(s). SKIPPED (BUG-174).`) }
    const { line, code } = summarizeVerification({ verified, dead, skipped, invalid })
    if (code === 0) console.log(`\nwi-verify-output: ${line} No dead fixes.`)
    else console.error(`\n::error::wi-verify-output: ${line} Failing the build.`)
    return code
  }

  for (const c of rest) {
    // BUG-136: a static SEO file (llms.txt/robots.txt/sitemap.xml/...) is served verbatim, so verify
    // its bytes directly instead of skipping it as an unverifiable `other`.
    if (isStaticFilePath(c.path)) {
      // BUG-162: a route handler serves this path -> the public/ twin is dead; never green against it.
      if (isSitemapPath(c.path) && sitemapRoute) {
        skipped++
        console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: served by the route handler ${sitemapRoute} (dynamic); the preview crawl covers the served response, not the dead public/ twin.`)
        continue
      }
      const sfile = await staticFileForPath(dir, c.path)
      if (!sfile) {
        skipped++
        console.log(`wi-verify-output: SKIPPED - ${c.kind} on ${c.path}: no served static file found (preview crawl covers it).`)
        continue
      }
      const res = assessStaticFile(await readFile(sfile, "utf8"), String(c.proposed))
      if (res.verdict === "verified") {
        verified++
        // BUG-154: a strict superset is a pass; log what the reviewer added so it is visible.
        const note = res.added.length ? ` (+${res.added.length} reviewer addition(s): ${res.added.slice(0, 5).join(" | ")})` : ""
        console.log(`wi-verify-output: verified - ${c.kind} on ${c.path} (static file, line-set)${note}.`)
      } else if (res.verdict === "drifted") {
        // BUG-154: the fix mostly landed but a claimed directive is missing - a real failure, but NOT
        // "did not reach". Name the missing line(s) and tell the reviewer how to clear it.
        dead++
        console.error(`::error::wi-verify-output: DRIFTED - ${c.kind} on ${c.path}: served ${sfile} is missing claimed directive(s): ${res.missing.slice(0, 10).join(" | ")}. Either a directive regressed, or the branch was hand-amended and the claim is stale - resync the claim's "proposed" to the shipped file.`)
      } else {
        dead++
        console.error(`::error::wi-verify-output: DEAD - ${c.kind} on ${c.path} did not reach ${sfile} (served file unchanged/absent).`)
      }
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
    // BUG-147: schema uses the field-level verdict with the claim's declared removals + the old
    // block's keys, so a regeneration that dropped an undeclared field fails here.
    const verdict = c.kind === "schema"
      ? schemaVerdict(html, String(c.proposed), Array.isArray(c.previousKeys) ? c.previousKeys : [], Array.isArray(c.removals) ? c.removals : [], c.add === true)
      : assess(html, c.kind, String(c.proposed))
    if (verdict === "dead") {
      dead++
      console.error(`::error::wi-verify-output: DEAD - ${c.kind} on ${c.path} did not reach ${file} (rendered value unchanged/absent).`)
    } else if (verdict === "verified") {
      verified++
      console.log(`wi-verify-output: verified - ${c.kind} on ${c.path}.`)
      // BUG-155: a page should have exactly one <h1>; surface >1 as a finding (extraction is free).
      if (c.kind === "h1") {
        const n = extractH1s(html).length
        if (n > 1) console.log(`::warning::wi-verify-output: ${c.path} has ${n} <h1> elements (expected 1) - the H1 fix verified, but the extra headings are worth a look.`)
      }
      // CHG-101 item 3: a dynamic-template schema ADD ships on every sibling; verify one sibling renders
      // the block WITHOUT the target route's own value (proving the builder is data-driven, not fixed).
      if (c.kind === "schema" && c.siblingPath) {
        const sfile = await htmlForPath(dir, c.siblingPath)
        if (!sfile) {
          console.log(`wi-verify-output: SKIPPED sibling - schema on ${c.siblingPath}: no built HTML (preview crawl covers it).`)
        } else {
          const shtml = await readFile(sfile, "utf8")
          const token = (String(c.path).split("/").filter(Boolean).pop() ?? "").replace(/[-_]+/g, " ")
          const sv = siblingSchemaVerdict(shtml, String(c.proposed), token)
          if (sv === "verified") {
            console.log(`wi-verify-output: verified sibling - schema ${atTypeOf(String(c.proposed))} renders on ${c.siblingPath} without the ${c.path} value (data-driven, not a fixed node).`)
          } else {
            dead++
            console.error(`::error::wi-verify-output: DEAD - schema on ${c.path} did not render correctly on sibling ${c.siblingPath}: the block is missing there, or carries the ${c.path} value (a fixed node ships on every route) - CHG-101.`)
          }
        }
      }
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
  // BUG-155: H1 is verifiable, not skipped.
  ok(assess("<h1>Roofing Marketing Agency</h1>", "h1", "Roofing Marketing Agency") === "verified", "h1 match -> verified")
  ok(assess("<h1><span>Roofing</span> Agency</h1>", "h1", "Roofing Agency") === "verified", "h1 tags stripped -> verified")
  ok(assess("<h1>Old heading</h1>", "h1", "New heading") === "dead", "h1 mismatch -> dead")
  ok(assess("<html><body>no heading</body></html>", "h1", "New heading") === "dead", "h1 absent -> dead")
  ok(extractH1s("<h1>A</h1><h1>B</h1>").length === 2, "extractH1s counts multiple H1s")
  // BUG-155 follow-up: React escapes text, so a correct H1 fix carried &#x27; and read a false DEAD.
  // The real kingcontractorwebsite#25 string: rendered with a hex-escaped apostrophe, claimed raw.
  ok(assess('<h1 class="hp-h1">America&#x27;s #1 AI Agency for Home</h1>', "h1", "America's #1 AI Agency for Home") === "verified", "h1 &#x27; (React apostrophe) -> verified")
  ok(assess("<h1>Roofing &amp; Restoration</h1>", "h1", "Roofing & Restoration") === "verified", "h1 &amp; -> verified")
  ok(assess("<h1>Minnesota&#39;s Best</h1>", "h1", "Minnesota's Best") === "verified", "h1 &#39; (decimal) -> verified")
  ok(assess("<h1>The Twin Cities&apos; Roofer</h1>", "h1", "The Twin Cities' Roofer") === "verified", "h1 &apos; -> verified")
  ok(extractH1s("<h1>A&#x27;s &amp; B&#39;s</h1>")[0] === "A's & B's", "extractH1s decodes hex + named + decimal in one pass")
  ok(decodeEntities("&amp;lt;") === "&lt;", "decodeEntities is single-level (no over-decode of &amp;lt;)")
  ok(decodeEntities("&copy; &unknown;") === "&copy; &unknown;", "unknown entities pass through unchanged")
  // The sibling extractors share the decoder: an escaped char in a title/meta/canonical must not fail.
  ok(assess(withMeta("America&#x27;s roofing &amp; restoration experts"), "meta_description", "America's roofing & restoration experts") === "verified", "meta_description entity-decoded -> verified")
  ok(assess("<html><head><title>Denver&#x27;s Roofing &amp; Repair</title></head></html>", "meta_title", "Denver's Roofing & Repair") === "verified", "meta_title entity-decoded -> verified")
  ok(assess('<link rel="canonical" href="https://x.com/?a=1&amp;b=2">', "canonical", "https://x.com/?a=1&b=2") === "verified", "canonical &amp; in query decoded -> verified")
  ok(assess('<script type="application/ld+json">{"@type":"FAQPage"}</script>', "schema", '{"@type":"FAQPage"}') === "verified", "schema @type present -> verified")
  ok(assess('<script type="application/ld+json">{"@type":"RoofingContractor"}</script>', "schema", '{"@type":"FAQPage"}') === "dead", "schema @type absent -> dead")
  // BUG-147: field-level schema gate.
  const sc = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
  const oldBlock = { "@type": "RoofingContractor", name: "Altus", telephone: "+16127496778", email: "d@altusmn.com", aggregateRating: { ratingValue: "5" } }
  const proposedBlock = { "@type": "RoofingContractor", name: "Altus", hasCredential: "MN-1" }
  const prevKeys = Object.keys(oldBlock)
  // Silent drop of an undeclared field (telephone) -> dead, even though @type still renders.
  const droppedRender = sc({ "@type": "RoofingContractor", name: "Altus", email: "d@altusmn.com", hasCredential: "MN-1" })
  ok(schemaVerdict(droppedRender, JSON.stringify(proposedBlock), prevKeys, ["aggregateRating"]) === "dead", "schema field-level: undeclared drop (telephone) -> dead")
  // Correct merge: NAP preserved, rating removed (declared), credential added -> verified.
  const goodRender = sc({ "@type": "RoofingContractor", name: "Altus", telephone: "+16127496778", email: "d@altusmn.com", hasCredential: "MN-1" })
  ok(schemaVerdict(goodRender, JSON.stringify(proposedBlock), prevKeys, ["aggregateRating"]) === "verified", "schema field-level: preserved + declared removal + addition -> verified")
  // Declared removal that did NOT take -> dead.
  const stillRated = sc({ "@type": "RoofingContractor", name: "Altus", telephone: "+16127496778", email: "d@altusmn.com", hasCredential: "MN-1", aggregateRating: { ratingValue: "5" } })
  ok(schemaVerdict(stillRated, JSON.stringify(proposedBlock), prevKeys, ["aggregateRating"]) === "dead", "schema field-level: declared removal still present -> dead")
  // Non-parseable hand-written block (trailing comma) with the right @type still verifies (no false fail).
  ok(schemaVerdict('<script type="application/ld+json">{"@type":"RoofingContractor","name":"Altus",}</script>', '{"@type":"RoofingContractor"}', [], []) === "verified", "schema field-level: non-JSON block with @type -> verified (fallback)")
  ok(assess("<html></html>", "body_keyword", "x") === "skip", "body_keyword -> skip")
  ok(extractCanonical('<link rel="canonical" href="https://x.com/p">') === "https://x.com/p", "canonical extracted")
  // BUG-136/174: exit-code logic - our own bad output fails; a run that verified NOTHING but skipped
  // something also fails (a gate that checked nothing is not a pass); a truly empty run still passes.
  ok(summarizeVerification({ verified: 2, dead: 0, skipped: 0, invalid: 0 }).code === 0, "verified>0, no dead -> pass")
  ok(summarizeVerification({ verified: 0, dead: 1, skipped: 0, invalid: 0 }).code === 1, "a dead fix -> fail")
  ok(summarizeVerification({ verified: 0, dead: 0, skipped: 3, invalid: 0 }).code === 1, "BUG-174: all-skipped FAILS (checked nothing)")
  ok(summarizeVerification({ verified: 1, dead: 0, skipped: 2, invalid: 0 }).code === 0, "verified>0 with some skips still passes")
  ok(summarizeVerification({ verified: 0, dead: 0, skipped: 0, invalid: 0 }).code === 0, "a truly empty run passes")
  ok(/verified: 0, skipped: 3/.test(summarizeVerification({ verified: 0, dead: 0, skipped: 3, invalid: 0 }).line), "all-skipped reports distinctly (not 'all checked')")
  ok(summarizeVerification({ verified: 1, dead: 0, skipped: 0, invalid: 2 }).code === 1, "a malformed claim entry -> fail")
  // BUG-174: App Router output resolution.
  ok(OUTPUT_DIRS.join(",") === "dist,build,out,.next/server/app", "output dirs include .next/server/app after dist/build/out")
  ok(htmlCandidatesForPath(".next/server/app", "/services")[0] === ".next/server/app/services.html", "App Router /services -> .next/server/app/services.html")
  ok(parseClaims('[{"path":"/","kind":"meta_description","proposed":"x"}]').ok === true, "valid claim parses")
  ok(parseClaims('[{"path":"/llms.txt","proposed":"a" "path":"/"').ok === false, "the #34 malformed claim -> not ok")
  // BUG-143: per-branch claim path resolution (this branch's file first, legacy shared path as fallback).
  ok(wiClaimReadPaths("seo-fix/schema-123")[0] === ".github/wi-verify-claims/seo-fix/schema-123.json", "per-branch path first")
  ok(wiClaimReadPaths("seo-fix/schema-123")[1] === ".github/wi-verify-claim.json", "legacy shared path is the fallback")
  ok(wiClaimReadPaths("")[0] === ".github/wi-verify-claim.json" && wiClaimReadPaths("").length === 1, "no branch -> only the legacy path")
  // BUG-136: static SEO files are verifiable (other is no longer an unconditional skip).
  ok(isStaticFilePath("/llms.txt") === true && isStaticFilePath("/service-areas/orlando") === false, "static-file path detection")
  ok(assessStaticFile("# Header\n\nnew content here", "new content here").verdict === "verified", "served static file contains proposed -> verified")
  ok(assessStaticFile("unchanged old file", "the brand new llms.txt content").verdict === "dead", "served static file unchanged (#34) -> dead")
  // BUG-154: line-set. A superset (reviewer added a line) passes and reports the addition; a missing
  // claimed directive drifts (fail, named); all claimed lines missing is dead.
  {
    const claim = "User-agent: *\nDisallow: /admin\nSitemap: https://x.com/sitemap.xml"
    const superset = "User-agent: *\nDisallow: /admin\nDisallow: /thank-you\nSitemap: https://x.com/sitemap.xml"
    const sup = assessStaticFile(superset, claim)
    ok(sup.verdict === "verified" && sup.added.some((l) => l.includes("thank-you")), "BUG-154: reviewer addition (/thank-you) -> verified + logged")
    const dropped = "User-agent: *\nSitemap: https://x.com/sitemap.xml" // Disallow: /admin removed
    const dr = assessStaticFile(dropped, claim)
    ok(dr.verdict === "drifted" && dr.missing.some((l) => l.includes("disallow: /admin")), "BUG-154: a removed claimed directive -> drifted + named")
    ok(assessStaticFile("# comments only\n\n", claim).verdict === "dead", "BUG-154: none of the claimed directives present -> dead")
  }
  // BUG-162: robots served by a route handler is verified against the handler source (harvesters
  // blocked), not the dead public/ file. Harvesters come from the claim's own robots.txt Disallow groups.
  {
    const sop = "User-agent: GPTBot\nAllow: /\n\n# harvesters\nUser-agent: Bytespider\nDisallow: /\nUser-agent: Scrapy\nDisallow: /\n\nUser-agent: *\nAllow: /\n"
    const agents = robotsHarvesterAgents(sop)
    ok(agents.length === 2 && agents.includes("Bytespider") && agents.includes("Scrapy") && !agents.includes("*"), "BUG-162: harvester agents parsed from Disallow groups")
    ok(robotsHarvesterAgents("User-agent: GPTBot\nAllow: /\n").length === 0, "BUG-162: an all-allow robots names no harvesters")
    const blocked = "rules: [{ userAgent: ['Bytespider','Scrapy'], disallow: '/' }, { userAgent: '*', allow: '/' }]"
    ok(assessRobotsRoute(blocked, agents).verdict === "verified", "BUG-162: handler blocks all harvesters -> verified")
    const minimal = "return { rules: { userAgent: '*', allow: '/' } }"
    ok(assessRobotsRoute(minimal, agents).verdict === "dead", "BUG-162: minimal handler (no blocks) -> dead")
    ok(assessRobotsRoute("rules: [{ userAgent: ['Bytespider'], disallow: '/' }]", agents).verdict === "drifted", "BUG-162: some harvesters missing -> drifted")
    ok(assessRobotsRoute(minimal, []).verdict === "skipped", "BUG-162: no harvesters claimed -> skipped")
  }
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
