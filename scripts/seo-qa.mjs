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

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");

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

  for (const f of files) {
    const html = await readFile(join(DIST, f), "utf8");
    if (isNoindex(html)) continue;
    const path = toUrlPath(f);

    // ── structural checks (this file only) ──
    const h1s = countH1(html);
    if (h1s !== 1) hard.push(`${path}: expected exactly one <h1>, found ${h1s}`);

    const title = getTitle(html);
    if (title) {
      if (titles.has(title)) hard.push(`${path}: duplicate <title> (also ${titles.get(title)})`);
      else titles.set(title, path);
    }
    const desc = getMetaDesc(html);
    if (desc) {
      if (descs.has(desc)) hard.push(`${path}: duplicate meta description (also ${descs.get(desc)})`);
      else descs.set(desc, path);
    }
    if (!hasCanonical(html)) warn.push(`${path}: missing canonical`);

    for (const block of getJsonLd(html)) {
      if (!jsonLdParses(block)) hard.push(`${path}: invalid JSON-LD`);
    }

    for (const link of getInternalLinks(html)) {
      if (!builtPaths.has(link)) hard.push(`${path}: internal link to unbuilt path ${link}`);
    }

    // ── shared value rules (seo-rules.ts parity) ──
    const kind = pageKindFromUrl(path);
    const fields = {
      title,
      metaDescription: desc,
      h1: getH1(html),
      schemaTypes: kind === "other" ? undefined : getSchemaTypes(html),
      kind,
    };
    for (const issue of evaluateFields(fields)) {
      (issue.severity === "fail" ? hard : warn).push(`${path}: ${issue.message} [${issue.rule}]`);
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
  console.log("selftest OK");
}

if (process.argv.includes("--selftest")) selftest();
else main();
