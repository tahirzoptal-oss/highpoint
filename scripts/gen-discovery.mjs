#!/usr/bin/env node
/**
 * gen-discovery.mjs — postbuild discovery + AEO file generator.
 *
 * Runs after `vite-react-ssg build` (npm `postbuild` hook), so it runs both
 * locally and on Vercel. Reads the prerendered routes in dist/ plus brand-dna,
 * then writes into dist/:
 *   - sitemap.xml                         sitemap index
 *   - sitemap-{core,services,cities,blog}.xml   per-category url sets (non-empty only)
 *   - robots.txt                          references the sitemap index
 *   - llms.txt                            llmstxt.org crawl guidance
 *   - llms-ctx.txt                        verified brand facts for answer engines
 *
 * Generating the sitemap from the actual dist/ HTML guarantees it can never list
 * a URL that was not built (no drift), and noindex routes (thank-you, 404) are
 * excluded automatically by reading each page's robots meta.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const BRAND_DNA = resolve(ROOT, "src/config/brand-dna.js");

// pathToFileURL, not the bare path: on Windows an absolute path starts "c:\",
// which the ESM loader reads as an unsupported URL scheme.
const { brandDNA } = await import(pathToFileURL(BRAND_DNA).href);
const base = String(brandDNA.company?.url || "").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

const xmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// serviceAreas may be plain strings ("KANSAS CITY") or objects ({name, slug}).
const areaName = (a) => (typeof a === "string" ? a : a.name || a.city || a.slug || "");
const areaSlug = (a) => (typeof a === "string" ? slugify(a) : a.slug || slugify(areaName(a)));

// ----- enumerate indexable routes from dist -------------------------------
async function walk(dir, rel = "") {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...(await walk(join(dir, ent.name), r)));
    else if (ent.name.endsWith(".html")) out.push(r);
  }
  return out;
}

function toUrlPath(file) {
  let p = "/" + file;
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p || "/";
}

const htmlFiles = await walk(DIST);
const indexable = [];
for (const f of htmlFiles) {
  const html = await readFile(join(DIST, f), "utf8");
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) continue;
  indexable.push(toUrlPath(f));
}
const urls = [...new Set(indexable)].sort();
const urlSet = new Set(urls);

// ----- sitemaps -----------------------------------------------------------
const category = (u) =>
  u.startsWith("/services/") ? "services"
  : u.startsWith("/service-areas/") ? "cities"
  : u.startsWith("/blog/") ? "blog"
  : "core";

const groups = { core: [], services: [], cities: [], blog: [] };
for (const u of urls) groups[category(u)].push(u);

const urlsetXml = (list) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  list.map((u) => `  <url><loc>${xmlEscape(base + u)}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;

// The blog sub-sitemap is the one set that changes without a deploy: a
// scheduled post goes live on the wall clock, so a file written here would keep
// advertising the pre-publish set for the life of the deployment. It is served
// per request by api/sitemap-blog.js instead, via the /sitemap-blog.xml rewrite
// in vercel.json. Deliberately NOT written to dist/ — Vercel checks the
// filesystem before applying rewrites, so a static file of that name would
// shadow the function. It is still listed in the index below.
const DYNAMIC_SITEMAPS = new Set(["blog"]);

const subSitemaps = [];
for (const [name, list] of Object.entries(groups)) {
  const fname = `sitemap-${name}.xml`;
  if (DYNAMIC_SITEMAPS.has(name)) {
    subSitemaps.push(fname);
    continue;
  }
  if (!list.length) continue;
  await writeFile(join(DIST, fname), urlsetXml(list));
  subSitemaps.push(fname);
}
const indexXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  subSitemaps.map((s) => `  <sitemap><loc>${xmlEscape(base + "/" + s)}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n") +
  `\n</sitemapindex>\n`;
await writeFile(join(DIST, "sitemap.xml"), indexXml);

// ----- robots.txt ---------------------------------------------------------
await writeFile(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

// ----- llms.txt (crawl guidance, llmstxt.org) -----------------------------
const services = brandDNA.services || [];
const areas = brandDNA.serviceAreas || brandDNA.service_areas || brandDNA.locations || [];
const reviews = brandDNA.reviews || {};
const reviewCount = reviews.totalReviewCount || reviews.googleCount;
const summary = String(brandDNA.company?.description || brandDNA.meta?.description || "").trim();

const linkIfBuilt = (name, path, note) => {
  const tail = note ? `: ${note}` : "";
  return urlSet.has(path) ? `- [${name}](${base + path})${tail}` : `- ${name}${tail}`;
};

const llms = [`# ${brandDNA.company?.name || ""}`, ""];
if (summary) llms.push(`> ${summary}`, "");
if (services.length) {
  llms.push("## Services");
  for (const s of services) {
    const nm = s.name || s.title || s.slug;
    const note = s.blurb || (s.description ? String(s.description).split(". ")[0] : "");
    llms.push(s.slug ? linkIfBuilt(nm, `/services/${s.slug}`, note) : `- ${nm}${note ? ": " + note : ""}`);
  }
  llms.push("");
}
if (areas.length) {
  llms.push("## Service Areas");
  for (const a of areas) {
    const nm = areaName(a);
    const slug = areaSlug(a);
    llms.push(slug ? linkIfBuilt(nm, `/service-areas/${slug}`) : `- ${nm}`);
  }
  llms.push("");
}
const about = [];
if (reviewCount) about.push(`- Reviews: ${reviews.rating}/5 across ${reviewCount} reviews`);
if (brandDNA.team?.founder?.name) about.push(`- Founder: ${brandDNA.team.founder.name}`);
if (brandDNA.company?.licenseNumber) about.push(`- License: ${brandDNA.company.licenseNumber}`);
if (about.length) llms.push("## About", ...about, "");
const contact = [];
if (brandDNA.contact?.phone) contact.push(`- Phone: ${brandDNA.contact.phone}`);
if (brandDNA.contact?.email) contact.push(`- Email: ${brandDNA.contact.email}`);
if (urlSet.has("/contact")) contact.push(`- [Contact / Free Quote](${base}/contact)`);
if (contact.length) llms.push("## Contact", ...contact, "");
llms.push(`<!-- last-updated: ${today} -->`);
await writeFile(join(DIST, "llms.txt"), llms.join("\n") + "\n");

// ----- llms-ctx.txt (verified brand facts) --------------------------------
const ctx = [`# ${brandDNA.company?.name || ""} — Verified Business Facts`, "", `Last updated: ${today}`, ""];
if (summary) ctx.push(summary, "");
ctx.push("## Business");
if (brandDNA.company?.serviceRegion) ctx.push(`- Service region: ${brandDNA.company.serviceRegion}`);
if (brandDNA.address?.full) ctx.push(`- Address: ${brandDNA.address.full}`);
if (brandDNA.contact?.phone) ctx.push(`- Phone: ${brandDNA.contact.phone}`);
if (brandDNA.contact?.email) ctx.push(`- Email: ${brandDNA.contact.email}`);
if (brandDNA.company?.licenseNumber) ctx.push(`- License: ${brandDNA.company.licenseNumber}`);
if (brandDNA.team?.founder?.name) ctx.push(`- Founder: ${brandDNA.team.founder.name}`);
if (reviewCount) ctx.push(`- Rating: ${reviews.rating}/5 across ${reviewCount} reviews`);
ctx.push("");
if (brandDNA.hours?.display?.length) {
  ctx.push("## Hours");
  for (const h of brandDNA.hours.display) ctx.push(`- ${h.label}: ${h.value}`);
  ctx.push("");
}
if (services.length) {
  ctx.push("## Services");
  for (const s of services) {
    const nm = s.name || s.title || s.slug;
    const desc = s.blurb || s.description || "";
    ctx.push(`- ${nm}${desc ? ": " + desc : ""}`);
  }
  ctx.push("");
}
if (areas.length) {
  ctx.push("## Service Areas", areas.map(areaName).filter(Boolean).join(", "), "");
}
await writeFile(join(DIST, "llms-ctx.txt"), ctx.join("\n") + "\n");

console.log(
  `gen-discovery: ${urls.length} url(s) across ${subSitemaps.length} sub-sitemap(s); wrote sitemap.xml, robots.txt, llms.txt, llms-ctx.txt`
);
