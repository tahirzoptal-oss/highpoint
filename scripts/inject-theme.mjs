#!/usr/bin/env node
/**
 * inject-theme.mjs
 *
 * Vite prebuild hook. Reads `src/config/brand-dna.js`, then rewrites the
 * `:root` palette + `@import url('https://fonts.googleapis.com/...')` lines
 * + `<html data-theme-mode="...">` attribute so per-client palette + fonts
 * + theme mode land in the bundle BEFORE `vite build` reads them.
 *
 * No runtime toggle. No flash. Per-client values frozen at build time.
 *
 * Triggered by `npm run prebuild` (configured in package.json).
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const INDEX_CSS = resolve(ROOT, "src/index.css");
const INDEX_HTML = resolve(ROOT, "index.html");
const BRAND_DNA = resolve(ROOT, "src/config/brand-dna.js");

const FORBIDDEN_SENTINELS = ["__REQUIRED__"];

function hexToRgbTriplet(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`inject-theme: invalid hex color ${hex}`);
  const v = m[1];
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ].join(" ");
}

/* Pick a text color that passes WCAG AA against a solid accent-colored bg.
   Used for components like the Founder stat chip whose background is the
   brand accent gradient — dark text reads on gold-ish brands, white reads on
   blue/navy-ish brands. Picks whichever has higher contrast. */
function pickOnAccent(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "15 23 42"; // safe default = dark navy
  const v = m[1];
  const rgb = [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
  const sRGBtoLin = (c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * sRGBtoLin(rgb[0]) + 0.7152 * sRGBtoLin(rgb[1]) + 0.0722 * sRGBtoLin(rgb[2]);
  // contrast against white (lum=1) vs dark (lum≈0.011)
  const cWhite = (1.0 + 0.05) / (lum + 0.05);
  const cDark = (lum + 0.05) / (0.011 + 0.05);
  return cWhite > cDark ? "255 255 255" : "15 23 42";
}

async function loadBrandDNA() {
  const mod = await import(BRAND_DNA);
  const brandDNA = mod.brandDNA;
  if (!brandDNA) {
    throw new Error("inject-theme: src/config/brand-dna.js does not export `brandDNA`");
  }
  return brandDNA;
}

function findSentinels(obj, path = "") {
  const hits = [];
  if (typeof obj === "string") {
    if (FORBIDDEN_SENTINELS.includes(obj)) hits.push(path);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => hits.push(...findSentinels(v, `${path}[${i}]`)));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      hits.push(...findSentinels(v, path ? `${path}.${k}` : k));
    }
  }
  return hits;
}

function buildRootBlock(palette, themeMode, onAccentOverride) {
  // Light-mode primary CSS variables. The dark-mode block follows in :root[data-theme-mode="dark"].
  const lightVars = Object.entries(palette).map(([k, v]) => `  --${k.replace(/_/g, "-")}: ${hexToRgbTriplet(v)};`).join("\n");
  // Auto-compute --on-accent so any component painting on the accent gradient
  // gets a text color that passes WCAG AA. Gold/yellow brands get dark text;
  // royal-blue/navy/red brands get white text. A client can override the
  // computed value via brand-dna `on_accent` (RGB triplet string).
  const onAccent = onAccentOverride || (palette.accent ? pickOnAccent(palette.accent) : "15 23 42");
  return `:root {\n${lightVars}\n  --on-accent: ${onAccent};\n}\n`;
}

function normaliseGoogleFontUrl(value) {
  if (!value) return null;
  const v = String(value).trim();
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  // Brand-dna schema specifies URL fragment (e.g. 'Oswald:wght@400;500;600;700').
  // Wrap in canonical Google Fonts CSS2 endpoint with display=swap.
  return `https://fonts.googleapis.com/css2?family=${v}&display=swap`;
}

function buildFontImports({ headingFontUrl, bodyFontUrl }) {
  const heading = normaliseGoogleFontUrl(headingFontUrl);
  const body = normaliseGoogleFontUrl(bodyFontUrl);
  const lines = [];
  if (heading) lines.push(`@import url('${heading}');`);
  if (body && body !== heading) lines.push(`@import url('${body}');`);
  return lines.join('\n') + '\n';
}

async function injectCss(brandDNA) {
  let css = await readFile(INDEX_CSS, "utf8");

  // Replace existing @import url(...) lines for Google Fonts.
  css = css.replace(/^@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);\s*\n?/gm, "");
  const fontImports = buildFontImports(brandDNA.typography);

  // Replace the existing :root { ... } block. If none exists, prepend.
  const rootBlock = buildRootBlock(brandDNA.palette, brandDNA.theme_mode, brandDNA.on_accent);
  const rootRegex = /:root\s*\{[^}]*\}\s*\n?/;
  if (rootRegex.test(css)) {
    css = css.replace(rootRegex, rootBlock);
  } else {
    css = rootBlock + css;
  }

  // Per-client dark surface override (opt-in via brand-dna.dark_surface).
  // The template ships a static :root[data-theme-mode="dark"] block tuned for
  // navy brands. A client whose dark surfaces should be a different hue (e.g. a
  // neutral-black + gold brand) sets `dark_surface` and this appended block wins
  // by source order. Clients without the field are unaffected.
  if (brandDNA.theme_mode === "dark" && brandDNA.dark_surface) {
    const ds = brandDNA.dark_surface;
    const darkMap = {
      "primary": ds.primary,
      "primary-dark": ds.primary_dark,
      "primary-slate": ds.primary_slate,
      "fade-navy": ds.fade_navy || ds.primary,
      "fade-navy-slate": ds.fade_navy_slate || ds.primary_slate,
    };
    const darkLines = Object.entries(darkMap)
      .filter(([, v]) => v)
      .map(([k, v]) => `  --${k}: ${hexToRgbTriplet(v)};`)
      .join("\n");
    if (darkLines) css += `\n:root[data-theme-mode="dark"] {\n${darkLines}\n}\n`;
  }

  // Opt-in CTA text fix: the template hardcodes white btn-gold labels (good on a
  // dark orange accent). A brand with a light accent (gold/tan/yellow) sets
  // `on_accent` and this appended rule restores the WCAG-aware --on-accent color
  // for the CTA labels, out-specifying the static white hardcode. Other clients
  // keep the white default untouched.
  if (brandDNA.on_accent) {
    css += `\n:root[data-theme-mode="dark"] .btn-gold,\n:root[data-theme-mode="dark"] .btn-gold.text-navy,\n:root[data-theme-mode="dark"] .btn-gold .text-navy {\n  color: rgb(var(--on-accent));\n}\n`;
  }

  // Move font imports to the very top (Vite requires @import at the start of the file).
  // Strip any existing @tailwind directives, then re-prepend in correct order.
  const tailwindDirectives = [];
  css = css.replace(/^@tailwind\s+[^;]+;\s*\n?/gm, (m) => {
    tailwindDirectives.push(m.trim());
    return "";
  });

  const finalCss = fontImports + tailwindDirectives.join("\n") + "\n" + css.trimStart();
  await writeFile(INDEX_CSS, finalCss, "utf8");
  return finalCss.length;
}

async function injectHtml(brandDNA) {
  let html = await readFile(INDEX_HTML, "utf8");
  // Set <html data-theme-mode="..."> only. Per-route <title>, meta, canonical,
  // OG, and JSON-LD are owned by src/components/SEO.jsx and baked into each
  // prerendered route by vite-react-ssg, so index.html keeps a minimal head and
  // we never ship duplicate title/meta tags.
  if (/<html\b[^>]*\bdata-theme-mode=/.test(html)) {
    html = html.replace(/(<html\b[^>]*\bdata-theme-mode=")[^"]*(")/, `$1${brandDNA.theme_mode}$2`);
  } else {
    html = html.replace(/<html\b/, `<html data-theme-mode="${brandDNA.theme_mode}"`);
  }
  await writeFile(INDEX_HTML, html, "utf8");
}

async function main() {
  const brandDNA = await loadBrandDNA();

  // Fail closed on surviving sentinels.
  const sentinels = findSentinels(brandDNA);
  if (sentinels.length > 0) {
    console.error("inject-theme: __REQUIRED__ sentinels survived in brand-dna.js:");
    for (const p of sentinels) console.error(`  - ${p}`);
    console.error("Run Stage 10.1 (build-from-template) to compose a valid brand-dna.js from pipeline data.");
    process.exit(1);
  }

  const cssLen = await injectCss(brandDNA);
  await injectHtml(brandDNA);
  console.log(`inject-theme: wrote index.css (${cssLen} bytes) and updated index.html theme_mode=${brandDNA.theme_mode}`);
}

main().catch((err) => {
  console.error("inject-theme: failed");
  console.error(err);
  process.exit(1);
});
