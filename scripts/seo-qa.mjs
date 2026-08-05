#!/usr/bin/env node
/**
 * seo-qa.mjs — on-page SEO self-check gate for the agentic rail.
 *
 * Reads the built dist/ HTML (run `npm run build` first) and enforces the [QA]
 * markers in seo/on-page-seo.md. Hard failures exit 1 (block the PR); softer
 * issues print as warnings and exit 0.
 *
 * HARD (exit 1):  not exactly one <h1>; duplicate <title>; duplicate meta
 *   description; JSON-LD that doesn't parse; "near me" in a /services/ title or
 *   h1; an internal <a href> pointing at a path that wasn't built.
 * WARN (exit 0):  title > 60 chars; meta description missing or outside 140-165;
 *   missing canonical.
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

// ---- pure helpers (covered by --selftest) ---------------------------------
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
export const hasCanonical = (html) => /<link[^>]+rel="canonical"/i.test(html);
export const isNoindex = (html) => /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
export const getJsonLd = (html) =>
  [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
export const getInternalLinks = (html) =>
  [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)/gi)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith("//") && !h.startsWith("/studio") && !/\.[a-z0-9]{2,5}$/i.test(h))
    .map((h) => (h.length > 1 ? h.replace(/\/$/, "") : h));

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

    const h1s = countH1(html);
    if (h1s !== 1) hard.push(`${path}: expected exactly one <h1>, found ${h1s}`);

    const title = getTitle(html);
    if (!title) hard.push(`${path}: missing <title>`);
    else {
      if (titles.has(title)) hard.push(`${path}: duplicate <title> (also ${titles.get(title)})`);
      else titles.set(title, path);
      if (title.length > 60) warn.push(`${path}: title ${title.length} chars (>60): "${title}"`);
    }

    const desc = getMetaDesc(html);
    if (!desc) warn.push(`${path}: missing meta description`);
    else {
      if (descs.has(desc)) hard.push(`${path}: duplicate meta description (also ${descs.get(desc)})`);
      else descs.set(desc, path);
      if (desc.length < 140 || desc.length > 165) warn.push(`${path}: meta description ${desc.length} chars (want 140-165)`);
    }

    if (!hasCanonical(html)) warn.push(`${path}: missing canonical`);

    for (const block of getJsonLd(html)) {
      try { JSON.parse(block); } catch { hard.push(`${path}: invalid JSON-LD`); }
    }

    if (path.startsWith("/services/")) {
      const h1text = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, "");
      if (/near me/i.test(title) || /near me/i.test(h1text))
        hard.push(`${path}: "near me" in service-page title/h1`);
    }

    for (const link of getInternalLinks(html)) {
      if (!builtPaths.has(link)) hard.push(`${path}: internal link to unbuilt path ${link}`);
    }
  }

  for (const w of warn) console.warn("WARN  " + w);
  for (const h of hard) console.error("FAIL  " + h);
  console.log(`\nseo-qa: ${builtPaths.size} pages checked, ${warn.length} warning(s), ${hard.length} failure(s).`);
  process.exit(hard.length ? 1 : 0);
}

function selftest() {
  const ok = (c, m) => { if (!c) { console.error("selftest FAIL: " + m); process.exit(1); } };
  ok(toUrlPath("index.html") === "/", "root");
  ok(toUrlPath("services/driveway-pavers/index.html") === "/services/driveway-pavers", "nested");
  ok(countH1("<h1>a</h1><h1 class=x>b</h1>") === 2, "h1 count");
  ok(getTitle("<title> Hi </title>") === "Hi", "title trim");
  ok(getMetaDesc('<meta name="description" content="d">') === "d", "desc");
  ok(isNoindex('<meta name="robots" content="noindex, nofollow">'), "noindex");
  ok(getJsonLd('<script type="application/ld+json">{"a":1}</script>').length === 1, "jsonld");
  ok(getInternalLinks('<a href="/contact">x</a><a href="/x.webp">y</a><a href="#q">z</a>').join() === "/contact", "links filter");
  console.log("selftest OK");
}

if (process.argv.includes("--selftest")) selftest();
else main();
