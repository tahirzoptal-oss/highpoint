#!/usr/bin/env node
/**
 * seo-qa.mjs — on-page SEO self-check gate for the agentic rail.
 *
 * Reads the built dist/ HTML (run `npm run build` first) and enforces the [QA]
 * markers in seo/on-page-seo.md. Hard failures exit 1 (block the PR); softer
 * issues print as warnings and exit 0.
 *
 * CHG-68: the value-level rules (title, meta description, "near me", H1/title
 * overlap, schema presence, phone numbers) are a byte-for-byte re-implementation
 * of src/lib/seo-rules.ts in the KCA dashboard — SAME numbers, SAME rule ids.
 * The dashboard's `npm run test:seo-rules` runs the shared FIXTURES through BOTH
 * this file's evaluateFields() and seo-rules.ts validatePageFields() and asserts
 * identical verdicts, so the two copies cannot drift. If you change a threshold
 * here, change it there (and vice versa) or CI fails.
 *
 * Rules locked by Mark + Juan 2026-08-06 (SEO Agent Enforcement Brief 2.1).
 *
 * STRUCTURAL (this file only, exit 1): not exactly one <h1>; duplicate <title>;
 *   duplicate meta description; JSON-LD that doesn't parse; an internal <a href>
 *   pointing at a path that wasn't built.
 *
 * ponytail: regex over the HTML, not a parser dependency. Good enough for a
 * self-check on our own prerendered output; swap in node-html-parser only if the
 * markup ever gets adversarial. Run `node scripts/seo-qa.mjs --selftest` to test
 * the helpers without a build.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const WORKED_LOG = resolve(ROOT, "seo/worked-log.csv");
// BUG-92: optional per-kind component floor. Opt-in - absent file means no floor gate,
// so rails whose adapters have not declared one are unaffected.
const COMPONENT_FLOOR = resolve(ROOT, "seo/component-floor.json");

// CHG-76 (ruled option 1): the URL paths of pages CHANGED THIS RUN. Derived the SAME way as the
// scoped-lint step - from `git diff HEAD` (the agent's edits are uncommitted at QA time). The
// worked-log rows the agent flipped to 'built' this run name the routes. seo-qa hard-fails ONLY
// these pages; the full-site scan still runs but pre-existing debt on OTHER pages is a WARNING -
// the add-only agent can't fix a legacy page, so failing on it would block EVERY build (even a
// no-op). Empty (no build this run, or git unavailable) -> everything is a warning -> exit GREEN.
const normUrl = (u) => String(u || "").trim().toLowerCase().replace(/\/+$/, "") || "/";
// Pure: parse the built-this-run routes from a worked-log `git diff` + its header line. Exported
// so --selftest can exercise the scoping's new logic without a git repo.
export function parseBuiltPaths(diff, headerLine) {
  const header = String(headerLine || "").split(",").map((h) => h.trim().toLowerCase());
  const ui = header.indexOf("url"), si = header.indexOf("status");
  const out = new Set();
  if (ui < 0 || si < 0) return out;
  for (const line of String(diff || "").split(/\r?\n/)) {
    if (!line.startsWith("+") || line.startsWith("+++")) continue; // added/updated worked-log rows only
    const c = line.slice(1).split(",");
    if (String(c[si]).trim().toLowerCase() === "built" && c[ui]) out.add(normUrl(c[ui]));
  }
  return out;
}
async function changedThisRunPaths() {
  let csv;
  try { csv = await readFile(WORKED_LOG, "utf8"); } catch { return new Set(); }
  let diff = "";
  try { diff = execSync("git diff HEAD -- seo/worked-log.csv", { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return new Set(); }
  return parseBuiltPaths(diff, csv.split(/\r?\n/)[0] || "");
}

// BUG-92: the per-kind component floor, or null when the repo has not declared one.
// Absent file -> opt-in no-op (green). Present-but-invalid -> warn + no-op (a broken
// floor file must not silently look enforced, but must not block a clean build either).
async function loadComponentFloor() {
  let raw;
  try { raw = await readFile(COMPONENT_FLOOR, "utf8"); } catch { return null; }
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : null;
  } catch {
    console.warn("WARN  seo/component-floor.json is present but not valid JSON - floor gate skipped.");
    return null;
  }
}

// ---- shared on-page rules (mirror of src/lib/seo-rules.ts) -----------------
// Phone: the three-three-four digit pattern with separators, plus the (xxx) xxx-xxxx form.
export const PHONE_RE = /(\(\d{3}\)\s*|\b\d{3}[-.\s])\d{3}[-.\s]\d{4}\b/;
export const hasPhone = (text) => PHONE_RE.test(String(text ?? ""));

const tokens = (s) =>
  String(s ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

// Title: missing = fail; over 60 chars = fail; a phone number = fail.
export const checkTitle = (title) => {
  const t = String(title ?? "").trim();
  if (!t) return [{ rule: "title_missing", severity: "fail", message: "missing title" }];
  const out = [];
  if (t.length > 60) out.push({ rule: "title_length", severity: "fail", message: `title ${t.length} chars (>60)` });
  if (hasPhone(t)) out.push({ rule: "title_phone", severity: "fail", message: "phone number in title" });
  return out;
};

// Meta description: missing = fail; over 160 = fail; under 150 = warn (target 150-155); phone = fail.
export const checkMetaDescription = (desc) => {
  const d = String(desc ?? "").trim();
  if (!d) return [{ rule: "desc_missing", severity: "fail", message: "missing meta description" }];
  const out = [];
  if (d.length > 160) out.push({ rule: "desc_length_max", severity: "fail", message: `meta description ${d.length} chars (>160)` });
  else if (d.length < 150) out.push({ rule: "desc_length_min", severity: "warn", message: `meta description ${d.length} chars (<150; target 150-155)` });
  if (hasPhone(d)) out.push({ rule: "desc_phone", severity: "fail", message: "phone number in meta description" });
  return out;
};

// "near me" in the TITLE of a /services/ or /service-areas/ page = fail.
export const checkNearMe = (title, kind) => {
  if ((kind === "service" || kind === "city") && /\bnear me\b/i.test(String(title ?? "")))
    return [{ rule: "near_me_title", severity: "fail", message: `"near me" in ${kind}-page title` }];
  return [];
};

// H1 vs title token-set overlap >= 0.80 = fail (duplicate H1/title).
export const checkH1TitleRatio = (h1, title) => {
  const hSet = new Set(tokens(h1));
  const tArr = tokens(title);
  if (hSet.size === 0 || tArr.length === 0) return [];
  const overlap = tArr.filter((t) => hSet.has(t)).length;
  const ratio = overlap / Math.max(hSet.size, tArr.length);
  if (ratio >= 0.8) return [{ rule: "h1_title_dup", severity: "fail", message: `H1/title token overlap ${ratio.toFixed(2)} (>=0.80)` }];
  return [];
};

export const jsonLdParses = (block) => {
  try { JSON.parse(block); return true; } catch { return false; }
};

// Schema presence per page type: service => Service + Breadcrumb; city => Breadcrumb; blog => Article.
export const checkSchemaPresence = (types, kind) => {
  const set = new Set((types ?? []).map((t) => String(t ?? "").toLowerCase()));
  const hasBreadcrumb = set.has("breadcrumb") || set.has("breadcrumblist");
  const need =
    kind === "service" ? [["Service", set.has("service")], ["Breadcrumb", hasBreadcrumb]]
      : kind === "city" ? [["Breadcrumb", hasBreadcrumb]]
        : kind === "blog" ? [["Article", set.has("article") || set.has("blogposting")]]
          : [];
  return need.filter(([, present]) => !present).map(([name]) => ({ rule: "schema_missing", severity: "fail", message: `${kind} page missing ${name} schema` }));
};

export const pageKindFromUrl = (url) => {
  const u = String(url ?? "");
  if (/\/services\//.test(u)) return "service";
  if (/\/service-areas\/|\/locations\//.test(u)) return "city";
  if (/\/blog\//.test(u)) return "blog";
  // NEW-31: root-level long-form reviews/articles (e.g. /<tool>-estimator-tool-review) map to
  // "other" ON PURPOSE - title/meta rules still apply, schema-presence QA is skipped (the
  // template owns the schema), and BUG-92's design gate guarantees parity with the site's
  // existing same-type pages while the orphan gate guarantees the listing link.
  return "other";
};

/** Full-page validation — the shape seo-rules.ts validatePageFields must agree with (CHG-68 sync). */
export const evaluateFields = (f) => {
  const kind = f.kind ?? "other";
  return [
    ...checkTitle(f.title ?? ""),
    ...checkMetaDescription(f.metaDescription ?? ""),
    ...checkNearMe(f.title ?? "", kind),
    ...(f.h1 != null ? checkH1TitleRatio(f.h1, f.title ?? "") : []),
    ...(f.schemaTypes != null ? checkSchemaPresence(f.schemaTypes, kind) : []),
  ];
};

const failsOnly = (issues) => issues.filter((i) => i.severity === "fail");

// ---- HTML extractors (covered by --selftest) -------------------------------
export const toUrlPath = (file) => {
  let p = "/" + file.replace(/\\/g, "/");
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p || "/";
};
// Visible text only: strip HTML comments, script/style CONTENT, then tags. The naive
// tag-strip alone leaks comment interiors - a comment containing a ">" (example markup
// like <link> inside factory template commentary) splits mid-comment and its tail counts
// as page copy. WH proof: 12 em-dashes in index.html's comment blocks flagged 46/48
// pages and hard-failed both danvers builds while the agent's copy was clean.
export const visibleText = (html) =>
  String(html ?? "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
export const countH1 = (html) => (html.match(/<h1[\s>]/gi) || []).length;
export const getTitle = (html) => (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
export const getMetaDesc = (html) =>
  (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] || "").trim();
export const getH1 = (html) =>
  (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, "").trim();
export const hasCanonical = (html) => /<link[^>]+rel="canonical"/i.test(html);
export const isNoindex = (html) => /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
export const getJsonLd = (html) =>
  [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
export const getInternalLinks = (html) =>
  [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)/gi)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith("//") && !h.startsWith("/studio") && !/\.[a-z0-9]{2,5}$/i.test(h))
    .map((h) => (h.length > 1 ? h.replace(/\/$/, "") : h));

// BUG-92 orphan gate (pure, --selftest-covered). Build the inbound-link index across every
// built page: Map<normalized target path -> Set of source paths that link to it>. Self-links
// (a breadcrumb to itself, or a city listing itself among adjacent cities) are excluded - they
// do not make a page reachable. `docs` is [{ path, html }]. A page with no entry (or an empty
// set) has zero inbound internal links, i.e. it is an orphan not wired into nav/footer/index.
export function buildInboundIndex(docs) {
  const inbound = new Map();
  for (const d of docs || []) {
    const src = normUrl(d.path);
    for (const link of getInternalLinks(String(d.html ?? ""))) {
      const tgt = normUrl(link);
      if (tgt === src) continue;
      if (!inbound.has(tgt)) inbound.set(tgt, new Set());
      inbound.get(tgt).add(src);
    }
  }
  return inbound;
}

// BUG-92 component floor (pure, --selftest-covered). Given a page's HTML, its kind, and the
// loaded floor object ({ service: ["marker", ...], city: [...], blog: [...] }), return the
// markers this page is MISSING. Each marker is tried as a case-insensitive regex; if it is not
// a valid regex it falls back to a case-insensitive substring test. No markers for a kind -> [].
export function missingFloor(html, kind, floor) {
  const markers = (floor && Array.isArray(floor[kind])) ? floor[kind] : [];
  const h = String(html ?? "");
  const miss = [];
  for (const m of markers) {
    let hit;
    try { hit = new RegExp(m, "i").test(h); }
    catch { hit = h.toLowerCase().includes(String(m).toLowerCase()); }
    if (!hit) miss.push(m);
  }
  return miss;
}

// BUG-92 follow-up (design conformance, pure + --selftest-covered). On a rail site every page
// of a type renders through ONE shared styled template (Horizon: /service-areas/:slug ->
// LocationDetailPage), so the template owns the styling and a wired page CANNOT be unstyled -
// unless it did not render through that template at all (the danvers "no service-area styling"
// case). We detect that WITHOUT per-site config by comparing a built page against the design
// SIGNATURE its own same-kind siblings share.

/** Every class token on the page (quote-aware, BUG-93). */
export function classTokens(html) {
  const out = new Set();
  for (const m of String(html ?? "").matchAll(/class=(["'])([\s\S]*?)\1/gi)) {
    for (const tok of m[2].split(/\s+/)) if (tok) out.add(tok);
  }
  return out;
}

/**
 * The template signature = the INTERSECTION of class tokens across the given same-kind pages.
 * Content-driven utility classes vary page to page and drop out of the intersection, leaving the
 * template's structural/design-system tokens (layout, hero, design-system classes) that every
 * page of that type shares. Needs >=2 references to tell template from content; fewer -> empty
 * (no signal), which callers treat as "do not check".
 */
export function templateSignature(htmls) {
  const sets = (htmls || []).map(classTokens).filter(s => s.size > 0);
  if (sets.length < 2) return new Set();
  let sig = null;
  for (const s of sets) {
    if (sig === null) { sig = new Set(s); continue; }
    for (const t of [...sig]) if (!s.has(t)) sig.delete(t);
  }
  return sig ?? new Set();
}

/**
 * True if `pageHtml` shares at least `minShare` of the template `signature` its siblings share -
 * i.e. it rendered through the same styled template. An empty signature (no reference) returns
 * true (do not fail). A bare/placeholder page shares ~none and fails; a legitimately THIN but
 * templated page still shares the wrapper tokens and passes (content volume is not the signal).
 */
export function conformsToTemplate(pageHtml, signature, minShare = 0.5) {
  if (!signature || signature.size === 0) return true;
  const got = classTokens(pageHtml);
  const shared = [...signature].filter(t => got.has(t)).length;
  return shared / signature.size >= minShare;
}

// Collect every @type string across all (parseable) JSON-LD blocks, walking @graph and arrays.
export const getSchemaTypes = (html) => {
  const out = [];
  const visit = (node) => {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (node && typeof node === "object") {
      const t = node["@type"];
      if (typeof t === "string") out.push(t);
      else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && out.push(x));
      for (const k of Object.keys(node)) visit(node[k]);
    }
  };
  for (const block of getJsonLd(html)) {
    try { visit(JSON.parse(block)); } catch { /* structural JSON-LD failure caught in main() */ }
  }
  return out;
};

async function walk(dir, rel = "") {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...(await walk(join(dir, ent.name), r)));
    else if (ent.name.endsWith(".html")) out.push(r);
  }
  return out;
}

async function main() {
  let files;
  try {
    files = await walk(DIST);
  } catch {
    console.error(`seo-qa: no dist/ at ${DIST}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const hard = [];
  const warn = [];
  const titles = new Map();
  const descs = new Map();
  const builtPaths = new Set(files.map(toUrlPath));
  const changedThisRun = await changedThisRunPaths(); // CHG-76: hard-fail is scoped to these routes

  // BUG-92: read every built page once, then build the inbound-link index. The orphan check needs
  // the whole set before the per-page loop, so it is order-independent. Noindex pages are still
  // valid link SOURCES (the footer/nav render on them too), so they count toward inbound.
  const docs = [];
  for (const f of files) docs.push({ path: toUrlPath(f), html: await readFile(join(DIST, f), "utf8") });
  const inbound = buildInboundIndex(docs);
  const floor = await loadComponentFloor(); // BUG-92 component floor, or null when not declared

  // BUG-92 follow-up (design conformance): derive a per-kind template signature from the EXISTING
  // (not-changed-this-run) pages, so a page built this run must render through the same styled
  // template as its siblings. Tunable: WI_DESIGN_MIN_SHARE (default 0.5), WI_DESIGN_GATE_WARN=1
  // downgrades the gate to a warning (for a wave or two of threshold tuning).
  const DESIGN_MIN_SHARE = Math.min(0.95, Math.max(0.1, Number(process.env.WI_DESIGN_MIN_SHARE) || 0.5));
  const DESIGN_WARN_ONLY = /^(1|true|warn)$/i.test(process.env.WI_DESIGN_GATE_WARN || "");
  const refHtmlByKind = new Map();
  for (const d of docs) {
    if (changedThisRun.has(normUrl(d.path))) continue; // references are the pages NOT built this run
    const k = pageKindFromUrl(d.path);
    if (k === "other") continue; // home/about/contact are one-offs, not a templated page family
    if (!refHtmlByKind.has(k)) refHtmlByKind.set(k, []);
    refHtmlByKind.get(k).push(d.html);
  }
  const signatureByKind = new Map();
  for (const [k, hs] of refHtmlByKind) signatureByKind.set(k, templateSignature(hs));

  for (const { path, html } of docs) {
    if (isNoindex(html)) continue;
    // CHG-76 (ruled option 1): hard-fail is SCOPED to pages changed this run. `fail()` routes a
    // finding to a hard failure on a changed page, else to a warning (the full-site debt stays
    // visible in the summary, but the add-only agent's clean run is never blocked by legacy debt).
    const isChanged = changedThisRun.has(normUrl(path));
    const fail = (m) => { if (isChanged) hard.push(m); else warn.push(`${m} [pre-existing - not this build]`); };

    // BUG-92 orphan gate: a page built THIS run must be reachable - at least one inbound internal
    // link from the rest of the built site (navbar / footer / service-areas index). Zero = orphan.
    if (isChanged && (inbound.get(normUrl(path))?.size ?? 0) === 0) {
      hard.push(`${path}: orphan page - no inbound internal link (not wired into nav/footer/index). Append it to the nav/index array named in seo/site-adapter.md, then rebuild.`);
    }

    // ── structural checks (this file only) ──
    const h1s = countH1(html);
    if (h1s !== 1) fail(`${path}: expected exactly one <h1>, found ${h1s}`);

    const title = getTitle(html);
    if (title) {
      if (titles.has(title)) fail(`${path}: duplicate <title> (also ${titles.get(title)})`);
      else titles.set(title, path);
    }
    const desc = getMetaDesc(html);
    if (desc) {
      if (descs.has(desc)) fail(`${path}: duplicate meta description (also ${descs.get(desc)})`);
      else descs.set(desc, path);
    }
    if (!hasCanonical(html)) warn.push(`${path}: missing canonical`);

    for (const block of getJsonLd(html)) {
      if (!jsonLdParses(block)) fail(`${path}: invalid JSON-LD`);
    }

    for (const link of getInternalLinks(html)) {
      if (!builtPaths.has(link)) fail(`${path}: internal link to unbuilt path ${link}`);
    }

    // CHG-74: em-dash ban in the rendered copy (checked on the VISIBLE text only -
    // comments and script/style content are not page copy, see visibleText()).
    if (/—/.test(visibleText(html))) fail(`${path}: em-dash in page copy (banned - use a hyphen or restructure)`);

    // ── shared value rules (seo-rules.ts parity) ──
    const kind = pageKindFromUrl(path);

    // BUG-92 component floor: a page built this run missing a component its kind declares fails.
    // Opt-in - `floor` is null unless the repo ships seo/component-floor.json.
    if (isChanged && floor) {
      for (const m of missingFloor(html, kind, floor)) {
        hard.push(`${path}: missing required component matching /${m}/ for a ${kind} page (component floor, seo/component-floor.json).`);
      }
    }

    // BUG-92 follow-up (design conformance): a page built this run must render through the same
    // styled template as its same-kind siblings (share the template signature). Needs >=2 refs;
    // otherwise the signature is empty and this is a no-op warning. This catches the danvers case
    // (page rendered a bare/placeholder path with none of the service-area styling).
    if (isChanged && kind !== "other") {
      const sig = signatureByKind.get(kind);
      if (!sig || sig.size === 0) {
        warn.push(`${path}: no design reference (need >=2 existing ${kind} pages) - design conformance not checked`);
      } else if (!conformsToTemplate(html, sig, DESIGN_MIN_SHARE)) {
        const msg = `${path}: does not match the ${kind}-page template - shares too little of the design signature its siblings share (likely rendered a bare/placeholder path, not the styled template).`;
        if (DESIGN_WARN_ONLY) warn.push(msg); else fail(msg);
      }
    }

    const fields = {
      title,
      metaDescription: desc,
      h1: getH1(html),
      schemaTypes: kind === "other" ? undefined : getSchemaTypes(html),
      kind,
    };
    for (const issue of evaluateFields(fields)) {
      if (issue.severity === "fail") fail(`${path}: ${issue.message} [${issue.rule}]`);
      else warn.push(`${path}: ${issue.message} [${issue.rule}]`);
    }

    // CHG-74: 3-5 IN-COPY internal links (Mark's standard). Distinguishing an in-copy link from a
    // template city/service grid is heuristic, so this WARNS (the drafter prompt + on-page-seo.md
    // carry the hard requirement): count internal <a href="/..."> that sit inside a <p> prose block.
    if (kind !== "other") {
      const proseLinks = (html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [])
        .flatMap((p) => p.match(/<a\b[^>]+href=["']\/(?!\/)[^"']*["']/gi) || []).length;
      if (proseLinks < 3) warn.push(`${path}: only ${proseLinks} in-copy internal link(s) in <p> prose (target 3-5, Mark's standard)`);
    }
  }

  for (const w of warn) console.warn("WARN  " + w);
  for (const h of hard) console.error("FAIL  " + h);
  console.log(`\nseo-qa: ${builtPaths.size} pages checked, ${warn.length} warning(s), ${hard.length} failure(s).`);
  process.exit(hard.length ? 1 : 0);
}

function selftest() {
  const ok = (c, m) => { if (!c) { console.error("selftest FAIL: " + m); process.exit(1); } };
  // extractors
  ok(toUrlPath("index.html") === "/", "root");
  ok(toUrlPath("services/driveway-pavers/index.html") === "/services/driveway-pavers", "nested");
  ok(countH1("<h1>a</h1><h1 class=x>b</h1>") === 2, "h1 count");
  ok(getTitle("<title> Hi </title>") === "Hi", "title trim");
  ok(getMetaDesc('<meta name="description" content="d">') === "d", "desc");
  ok(getH1("<h1 class=x>Roof <span>Repair</span></h1>") === "Roof Repair", "h1 text");
  ok(isNoindex('<meta name="robots" content="noindex, nofollow">'), "noindex");
  ok(getJsonLd('<script type="application/ld+json">{"a":1}</script>').length === 1, "jsonld");
  ok(getSchemaTypes('<script type="application/ld+json">{"@graph":[{"@type":"Service"},{"@type":"BreadcrumbList"}]}</script>').sort().join() === "BreadcrumbList,Service", "schema types");
  ok(getInternalLinks('<a href="/contact">x</a><a href="/x.webp">y</a><a href="#q">z</a>').join() === "/contact", "links filter");
  // shared rules (must mirror seo-rules.ts exactly)
  ok(pageKindFromUrl("/services/roof-repair") === "service", "kind service");
  ok(pageKindFromUrl("/service-areas/orlando") === "city", "kind city");
  ok(hasPhone("Call 612-749-6778") && hasPhone("(612) 749-6778"), "phone forms");
  ok(failsOnly(checkTitle("Roof Repair | Call 612-749-6778")).some((i) => i.rule === "title_phone"), "title phone fail");
  ok(checkTitle("R".repeat(61)).some((i) => i.rule === "title_length"), "title len fail");
  ok(checkMetaDescription("d".repeat(161)).some((i) => i.rule === "desc_length_max"), "desc max fail");
  ok(checkMetaDescription("d".repeat(120))[0].severity === "warn", "desc short warn");
  ok(checkMetaDescription("d".repeat(152)).length === 0, "desc in band ok");
  ok(checkNearMe("Roof Repair Near Me", "service").length === 1, "near me service");
  ok(checkNearMe("Best Roofer Near Me", "blog").length === 0, "near me blog ok");
  ok(checkH1TitleRatio("Roof Repair Orlando FL", "Roof Repair Orlando FL").length === 1, "h1 dup");
  ok(checkH1TitleRatio("Fast Reliable Storm Damage Help", "Roof Repair Orlando FL").length === 0, "h1 distinct ok");
  ok(checkSchemaPresence(["Service"], "service").length === 1, "service missing breadcrumb");
  ok(checkSchemaPresence(["Service", "BreadcrumbList"], "service").length === 0, "service schema ok");
  ok(checkSchemaPresence(["BreadcrumbList"], "blog").length === 1, "blog missing Article");
  // acceptance: the phone-title fixture cannot pass
  ok(failsOnly(evaluateFields({ title: "Roof Repair | Call 612-749-6778", kind: "service", metaDescription: "d".repeat(155) })).length > 0, "acceptance phone-title rejected");
  // CHG-76: the changed-route parser that scopes the hard-fail (drift here would silently
  // un-scope the gate, re-blocking every rail build on pre-existing debt).
  const H = "slug,page_type,url,status,date_worked,notes";
  ok(parseBuiltPaths("+n,service_area,/service-areas/boxford,built,2026-08-10,x", H).has("/service-areas/boxford"), "CHG-76 parse: built row -> route");
  ok(parseBuiltPaths("+n,service,/services/x,queued,,y", H).size === 0, "CHG-76 parse: queued row ignored");
  ok(parseBuiltPaths("+++ b/seo/worked-log.csv\n-o,service,/services/y,queued,,z", H).size === 0, "CHG-76 parse: +++ header and removed lines ignored");
  // visibleText: comment interiors are NOT page copy, even when the comment contains a ">"
  // (the leak that hard-failed both danvers builds); script/style content is not copy either.
  ok(!/—/.test(visibleText('<html><!-- preload the hero — see <link rel="preload"> notes — honest --><body>Real copy.</body></html>')), "visibleText: em-dash inside a >-bearing comment ignored");
  ok(!/—/.test(visibleText('<script>const s = "data — dash";</script><style>/* a — b */</style><p>Clean.</p>')), "visibleText: script/style content ignored");
  ok(/—/.test(visibleText("<p>Visible — copy.</p>")), "visibleText: em-dash in real copy still caught");
  // BUG-92 orphan gate: the inbound index + the reachability decision it drives.
  const site = [
    { path: "/", html: '<a href="/service-areas/danvers">Danvers</a><a href="/services/pavers">Pavers</a>' }, // home footer/nav
    { path: "/service-areas/danvers", html: '<a href="/service-areas/danvers">self breadcrumb</a><a href="/services/pavers">Pavers</a>' },
    { path: "/service-areas/salem", html: "<p>No inbound links point here.</p>" }, // orphan fixture
  ];
  const idx = buildInboundIndex(site);
  ok((idx.get("/service-areas/danvers")?.size ?? 0) === 1, "orphan gate: wired page has an inbound link (home -> danvers)");
  ok(!idx.has("/") || idx.get("/").size === 0, "orphan gate: nothing links to home in this fixture");
  ok((idx.get("/service-areas/salem")?.size ?? 0) === 0, "orphan gate: a page with zero inbound links is an orphan (FAIL condition)");
  ok(!(idx.get("/service-areas/danvers")?.has("/service-areas/danvers")), "orphan gate: a self-link does not count as inbound");
  // BUG-92 component floor: markers (regex, i-flag) missing from the page are reported; opt-in.
  const floorDecl = { city: ["<h1", "faq", "adjacent-cities"], service: ["<h1"] };
  ok(missingFloor('<h1>Danvers</h1><section class="faq"></section><nav class="adjacent-cities"></nav>', "city", floorDecl).length === 0, "component floor: a page carrying every declared component passes");
  ok(missingFloor("<h1>Danvers</h1><p>thin</p>", "city", floorDecl).sort().join() === "adjacent-cities,faq", "component floor: a page missing components reports exactly them");
  ok(missingFloor("<p>anything</p>", "blog", floorDecl).length === 0, "component floor: a kind with no declared floor is a no-op");
  ok(missingFloor("<p>anything</p>", "city", null).length === 0, "component floor: null floor (not declared) is a no-op");
  // BUG-92 follow-up (design conformance). Fixtures use Horizon's REAL design-system tokens
  // (rounded-ds-md, font-heading, font-body, bg-ink-900, theme-keep-dark, tracking-eyebrow) that
  // its LocationDetailPage/SiloLayout emit on every service-area page, plus per-page content tokens.
  const TPL = "rounded-ds-md font-heading font-body bg-ink-900 theme-keep-dark tracking-eyebrow leading-body";
  const refOrlando = `<main><section class="${TPL} theme-orlando"><h1 class="font-heading">Orlando</h1><div class="rounded-ds-md">copy</div></section></main>`;
  const refTampa = `<main><section class="${TPL} theme-tampa"><h1 class="font-heading">Tampa</h1><div class="rounded-ds-md">copy</div></section></main>`;
  const sig = templateSignature([refOrlando, refTampa]);
  ok(sig.has("rounded-ds-md") && sig.has("font-heading") && sig.has("bg-ink-900"), "design: signature keeps the shared template tokens");
  ok(!sig.has("theme-orlando") && !sig.has("theme-tampa"), "design: signature drops per-page content tokens (intersection)");
  // A new page rendered through the SAME template (shares the signature) conforms.
  ok(conformsToTemplate(`<main><section class="${TPL} theme-danvers"><h1 class="font-heading">Danvers</h1></section></main>`, sig) === true, "design: templated page conforms");
  // The danvers case: a bare/placeholder page with NONE of the template's styling is refused.
  ok(conformsToTemplate("<main><h1>Danvers</h1><p>We serve Danvers.</p></main>", sig) === false, "design: bare/unstyled page fails (the danvers case)");
  // A legitimately THIN but templated page (less content, same wrapper tokens) still conforms.
  ok(conformsToTemplate(`<main><section class="${TPL}"><h1 class="font-heading">Danvers</h1></section></main>`, sig) === true, "design: thin-but-templated page still conforms (content volume is not the signal)");
  // Fewer than 2 references -> empty signature -> no-op (never blocks a first-of-its-kind page).
  ok(templateSignature([refOrlando]).size === 0 && conformsToTemplate("<main>anything</main>", templateSignature([refOrlando])) === true, "design: <2 references is a no-op");
  console.log("selftest OK");
}

if (process.argv.includes("--selftest")) selftest();
else main();
