#!/usr/bin/env node
/**
 * seo-audit.mjs — postbuild SEO gate.
 *
 * Runs after `vite-react-ssg build` (npm `postbuild` hook), so it runs both
 * locally and on Vercel / CI, and reads the ACTUAL prerendered HTML in dist/ —
 * the same output crawlers see, so it can never drift from the shipped tags.
 *
 * It enforces, across every indexable page (noindex pages are skipped, exactly
 * like gen-discovery.mjs):
 *   - ERROR: a <title> longer than MAX_TITLE (55) characters   → fails the build
 *   - ERROR: a missing/empty <title> or meta description       → fails the build
 *   - ERROR: the same meta description used on more than one page (duplicates)
 *   - WARN : a meta description outside the 50–160 char sweet spot
 *   - WARN : the same <title> used on more than one page
 *
 * A non-zero exit code stops the deploy, so a future build can never publish an
 * over-length title or a duplicate meta description. Because this file lives in
 * the site template, every future site inherits the same gate.
 *
 * Lengths are measured on DECODED text (&amp; -> &, etc.) so an ampersand counts
 * as one character, matching how Google and SEMrush count.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

const MAX_TITLE = 55;      // hard limit (task requirement)
const DESC_MAX = 160;      // recommended upper bound (warning only)
const DESC_MIN = 50;       // recommended lower bound (warning only)

// Decode the handful of HTML entities the prerenderer emits, so character
// counts reflect real text, not escaped markup.
const decode = (s) =>
  String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;|&apos;/gi, "'");

async function walk(dir, rel = "") {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...(await walk(join(dir, ent.name), r)));
    else if (ent.name.endsWith(".html")) out.push(r);
  }
  return out;
}

const toUrlPath = (file) => {
  let p = "/" + file;
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p || "/";
};

const files = await walk(DIST);
const pages = [];
for (const f of files) {
  const html = await readFile(join(DIST, f), "utf8");
  // Skip noindex pages (thank-you, 404): search engines ignore them, so they
  // are out of scope for duplicate-description and title-length checks.
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) continue;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i
  );
  pages.push({
    url: toUrlPath(f),
    title: titleMatch ? decode(titleMatch[1].trim()) : "",
    description: descMatch ? decode(descMatch[1].trim()) : "",
  });
}

const errors = [];
const warnings = [];

// Per-page title + description sanity.
for (const p of pages) {
  if (!p.title) errors.push(`${p.url} — missing <title>`);
  else if (p.title.length > MAX_TITLE)
    errors.push(`${p.url} — title is ${p.title.length} chars (max ${MAX_TITLE}): "${p.title}"`);

  if (!p.description) errors.push(`${p.url} — missing meta description`);
  else if (p.description.length > DESC_MAX)
    warnings.push(`${p.url} — description is ${p.description.length} chars (recommended <= ${DESC_MAX})`);
  else if (p.description.length < DESC_MIN)
    warnings.push(`${p.url} — description is only ${p.description.length} chars (recommended >= ${DESC_MIN})`);
}

// Duplicate detection.
const groupBy = (key) => {
  const map = new Map();
  for (const p of pages) {
    const v = p[key];
    if (!v) continue;
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(p.url);
  }
  return map;
};

for (const [desc, list] of groupBy("description")) {
  if (list.length > 1)
    errors.push(`duplicate meta description on ${list.length} pages (${list.join(", ")}): "${desc}"`);
}
for (const [title, list] of groupBy("title")) {
  if (list.length > 1)
    warnings.push(`duplicate <title> on ${list.length} pages (${list.join(", ")}): "${title}"`);
}

// Report.
for (const w of warnings) console.warn(`  [seo-audit] WARN  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  [seo-audit] ERROR ${e}`);
  console.error(
    `\nseo-audit: FAILED — ${errors.length} error(s) across ${pages.length} indexable page(s). ` +
      `Fix the titles/descriptions above before deploying.`
  );
  process.exit(1);
}

console.log(
  `seo-audit: OK — ${pages.length} indexable page(s); all titles <= ${MAX_TITLE} chars and every meta description unique` +
    (warnings.length ? ` (${warnings.length} warning(s))` : "")
);
