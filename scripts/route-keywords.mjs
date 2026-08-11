#!/usr/bin/env node
/**
 * VENDORED - do NOT edit here. Source of truth:
 *   King-Contractor-Agency/Content-Agent-Keyword-Router  route-keywords.mjs (main @ bc67009).
 *   IN SYNC with upstream as of 2026-08-10: COA-09 (containment/no-mint/geo, brand-subset
 *   -> review, generic -> /services hub) and COA-10 (ranking-URL awareness + cutoff 1-25)
 *   are landed there. The ONLY intended difference is this header block; the router body
 *   is byte-identical. Change the rules UPSTREAM first, then re-vendor.
 *   `npm run test:keyword-router` (the 47-case --selftest + import-safety) is wired into
 *   `npm run build` so drift fails CI.
 * COA-07 Phase A: the dashboard feeder imports { classify, route } from this copy so
 * the SAME rules run in the feeder as in each client rail (single source of truth, one
 * copy). This file is eslint-ignored (verbatim third-party style); keep it byte-identical.
 *
 * route-keywords.mjs — deterministic keyword → page-type router for the SEO brain.
 *
 * Fixes the "why is the agent confusing these" problem: page-type is decided by
 * RULES here, not by the LLM at brief time. The agent then only WRITES the page.
 *
 * For every keyword it outputs one of:
 *   service       -> commercial service term, no city / primary city  -> /services/:slug
 *   service_area  -> service + a SERVED city/neighborhood             -> /service-areas/:citySlug
 *   blog          -> informational / question / plural-list / cost    -> /blog/:slug
 *   drop          -> junk: brand/company name, jobs, DIY, out-of-area, zero volume
 *   review        -> ambiguous or a POSSIBLE competitor brand name (human decides)
 *
 * ...then cross-references worked-log.csv so each row is BUILD (needs a page) or
 * HAS_PAGE (already exists → improve via the edit engine, don't build a dup).
 *
 * Usage:
 *   node scripts/route-keywords.mjs keywords.csv --out seo/routed-keywords.csv \
 *        --config seo/keyword-routing.config.json --worklog seo/worked-log.csv
 *   node scripts/route-keywords.mjs --selftest        # no files needed
 *
 * CSV in: any columns; must include a `keyword` (or `Keyword`) column. Optional
 *         volume/kd/cpc/intent columns are carried through if present.
 *
 * ponytail: pure string rules over a small config, no deps. Deterministic +
 * testable (--selftest). Precedence order is the whole design — see classify().
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

// ─── universal signal word-lists (niche-agnostic) ───────────────────────────
const JUNK = [
  "job", "jobs", "salary", "hiring", "career", "careers", "apprentice",
  "training", "school", "course", "how to become", "certification", "license class",
  "wholesale", "for sale", "supplier", "manufacturer", "distributor", "warehouse",
  "home depot", "lowes", "amazon", "wikipedia", "meaning of", "definition of",
];
// informational / list / comparison → blog. PLURAL provider nouns matter most.
const INFO = [
  "how ", "what ", "why ", "when ", "where ", "which ", "who ", "how much", "how long",
  "how many", "do i ", "do you ", "does ", "can i", "should i", "is it", "are ",
  "cost", "costs", "price", "prices", "pricing", "estimate cost", "average",
  "vs", "versus", " or ", "difference", "compare", "comparison",
  "best", "top ", "cheapest", "reviews", "review", "rating", "ratings",
  "guide", "tips", "ideas", "types of", "kinds of", "signs", "problem", "problems",
  "worth it", "diy", "yourself", "how to",
];
// plural provider/list nouns → blog (a searcher wanting a LIST, not one provider)
const PLURAL_LIST = /\b(companies|contractors|roofers|installers|builders|services|quotes|estimates|options|providers)\b/;
// niche service-modifiers now live in config (cfg.service_modifiers) so this is
// niche-agnostic — see DEFAULT_CONFIG for the roofing example set.
// generic adjectives / directions that precede a provider noun (NOT brands)
const GENERIC_LEADERS = [
  "affordable", "cheap", "budget", "local", "professional", "quality", "reliable",
  "licensed", "insured", "trusted", "expert", "experienced", "family", "small",
  "north", "south", "east", "west", "downtown", "central", "greater", "the",
  "24 hour", "24/7", "same day", "free", "quote", "estimate",
];

// ─── ROOFING defaults — work for EVERY KCA roofing client out of the box.
// Per client you only override: primary_city, served_cities, own_brand, and
// competitor_brands (pass --config json and/or --from-brand-dna to auto-fill
// cities + services from that client's brand-dna). The roofing service_terms /
// provider_nouns / service_modifiers below rarely need touching.
export const DEFAULT_CONFIG = {
  niche: "roofing",
  primary_city: "",
  served_cities: [],                // ← derive from brand-dna serviceAreas/location_pages
  provider_nouns: ["roofing", "roofer", "roofers", "roof", "construction", "exteriors"],
  service_terms: [                  // ← the services the client actually offers (from brand-dna.services)
    "roof repair", "roof replacement", "roof installation", "new roof", "reroof", "re-roof",
    "metal roof", "metal roofing", "shingle roof", "tile roof", "flat roof", "commercial roof",
    "roof inspection", "roof leak", "storm damage", "hail damage", "emergency roof",
    "gutter", "gutters", "siding", "soffit", "fascia", "skylight", "roof coating", "roof sealing",
  ],
  service_modifiers: [              // niche adjectives that precede the provider noun (NOT brands)
    "metal", "flat", "tile", "slate", "shingle", "asphalt", "epdm", "tpo", "pvc",
    "commercial", "residential", "industrial", "emergency", "storm", "hail", "wind",
    "leak", "repair", "replacement", "new", "low slope", "standing seam",
  ],
  own_brand: [],                    // ← client's brand tokens (from brand-dna company.name)
  competitor_brands: [],            // ← seed from SEMrush competitor list, e.g. ["apex roofing","xyz exteriors"]
  min_volume: 10,                   // below this → drop (unless strategic)
  ranking_url_max_position: 25,     // COA-10: ride an EXISTING ranking page only when it ranks this well or better; a weaker ranking still gets its own page. (Mark's ruling 2026-08-10: "only edit if within postion 25-position 1 so its terms that actually have a chance at ranking/improving".)
};

// ─── helpers ────────────────────────────────────────────────────────────────
const norm = (s) => String(s || "").toLowerCase().replace(/[^\w\s/&+-]/g, " ").replace(/\s+/g, " ").trim();
const kebab = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const has = (hay, needles) => needles.some((n) => (n.endsWith(" ") || n.startsWith(" ") ? hay.includes(n) : new RegExp(`(^|\\W)${escapeRe(n)}(\\W|$)`).test(hay)));
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// find the longest served city present in the keyword
const findCity = (kw, cities) => {
  let best = "";
  for (const c of cities) { const lc = norm(c); if (lc && new RegExp(`(^|\\W)${escapeRe(lc)}(\\W|$)`).test(kw) && lc.length > best.length) best = lc; }
  return best;
};
const cityDisplay = (lc, cities) => cities.find((c) => norm(c) === lc) || lc;

// ─── the classifier (precedence order IS the design) ─────────────────────────
export function classify(rawKeyword, cfg = DEFAULT_CONFIG, volume = null) {
  let kw = norm(rawKeyword);
  if (!kw || kw.length < 3) return { page_type: "drop", reason: "empty/too short", geo: "" };

  // 0. volume floor (only if we were given a number)
  if (volume != null && volume !== "" && Number(volume) < (cfg.min_volume ?? 0))
    return { page_type: "drop", reason: `low volume (<${cfg.min_volume})`, geo: "" };

  // 1. JUNK (jobs / DIY-supply / retailers / dictionary)
  if (has(kw, JUNK)) return { page_type: "drop", reason: "junk (job/DIY/retail/dictionary)", geo: "" };

  // 2. BRAND / company name  ← the "picking company keyword names" fix
  const brands = [...(cfg.own_brand || []), ...(cfg.competitor_brands || [])].map(norm).filter(Boolean);
  if (brands.some((b) => kw.includes(b)))
    return { page_type: "drop", reason: "brand/company name (own or competitor)", geo: "" };
  // COA-09 B2: brand token-SUBSET. Distinctive brand tokens = brand words minus provider
  // nouns and generic/service modifiers (so a GENERIC like "brick pavers" is not mistaken
  // for the brand "horizon brick paver"). If the keyword's distinctive tokens — minus the
  // served city, provider nouns, and generics — are non-empty AND every one is a brand
  // token, route it to REVIEW (Mark 2026-08-10: a fuzzy brand-subset is not a certain
  // brand, so nothing brand-shaped disappears without human eyes; the EXACT-brand rule
  // above still drops). Catches "horizon pavers" (own_brand "horizon brick paver") without
  // touching the served city "Horizon West".
  {
    const providerSet = new Set((cfg.provider_nouns || []).map(norm));
    const genericSet = new Set([...GENERIC_LEADERS, ...(cfg.service_modifiers || [])].map(norm));
    const brandTokens = new Set(brands.flatMap((b) => b.split(" ")).filter((t) => t && !providerSet.has(t) && !genericSet.has(t)));
    const geoB2 = findCity(kw, cfg.served_cities || []);
    const kwDistinct = kw.replace(geoB2, "").split(" ").filter((t) => t && !STOP.has(t) && !providerSet.has(t) && !genericSet.has(t));
    if (brandTokens.size && kwDistinct.length && kwDistinct.every((t) => brandTokens.has(t)))
      return { page_type: "review", reason: "brand token-subset (possible own/competitor brand) → review (human decides; Mark B2)", geo: "" };
  }

  const geoLc = findCity(kw, cfg.served_cities || []);
  const geo = geoLc ? cityDisplay(geoLc, cfg.served_cities) : "";

  // 3. INFORMATIONAL / plural-list / cost / comparison → BLOG
  //    (this beats geo, so "kennewick roofing companies" = blog, not a service)
  if (PLURAL_LIST.test(kw) || has(kw, INFO))
    return { page_type: "blog", reason: PLURAL_LIST.test(kw) ? "plural/list intent (comparison) → blog" : "informational/question/cost → blog", geo };

  // strip "near me" — never a page target string; evaluate the rest
  const kwNoNear = kw.replace(/\bnear me\b/g, "").replace(/\s+/g, " ").trim();
  const nearMe = kw !== kwNoNear;

  const hasService = has(kwNoNear, cfg.service_terms) ||
    // a provider noun with a service-ish or generic leader (e.g. "metal roofing", "roof repair")
    (new RegExp(`\\b(${(cfg.provider_nouns || []).map(escapeRe).join("|")})\\b`).test(kwNoNear));

  // 4. POSSIBLE COMPETITOR BRAND: "[unknown-word] roofing/roofers/exteriors"
  //    where the leading word isn't a city, service modifier, or generic adjective.
  const providerRe = new RegExp(`\\b([a-z][a-z'&.-]+)\\s+(${(cfg.provider_nouns || []).map(escapeRe).join("|")})\\b`);
  const m = kwNoNear.match(providerRe);
  if (m && !geoLc) {
    const leader = m[1];
    const known = [...(cfg.service_modifiers || []), ...GENERIC_LEADERS, ...cfg.service_terms.flatMap((t) => t.split(" "))].map(norm);
    const leaderIsCity = (cfg.served_cities || []).some((c) => norm(c).split(" ").includes(leader));
    if (!known.includes(leader) && !leaderIsCity && leader.length > 2 && !PLURAL_LIST.test(kwNoNear))
      return { page_type: "review", reason: `possible competitor brand ("${leader} ${m[2]}") — verify before building`, geo };
  }

  // 5. SERVICE + SERVED CITY → SERVICE-AREA page (city page absorbs it)
  if (geoLc && hasService) {
    if (cfg.primary_city && norm(cfg.primary_city) === geoLc)
      return { page_type: "service", reason: "primary-city service query → rides the /services page (not a new city page — avoids cannibalizing it)", geo };
    return { page_type: "service_area", reason: `service in served city "${geo}" → service-area page`, geo };
  }

  // 6. SERVICE term, no city (or 'near me') → SERVICE page
  if (hasService)
    return { page_type: "service", reason: nearMe ? "service + 'near me' → service page (drop 'near me' from target)" : "commercial service term → service page", geo };

  // 7. a served city but no clear service term → service-area (city page catch-all)
  if (geoLc) return { page_type: "service_area", reason: `served city "${geo}", generic → service-area page`, geo };

  // 8. nothing matched → review
  return { page_type: "review", reason: "no service/geo/info signal — human decides", geo };
}

// ─── slug + existing-page cross-reference ────────────────────────────────────
// COA-09 A3: all 50 USPS state codes (+ dc) join the stopwords so a trailing state
// abbreviation never survives into a slug ("roofing mn" must not mint "roofing-mn").
const STATE_CODES = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "dc", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy"];
const STOP = new Set(["in", "the", "a", "for", "of", "and", "to", "my", "your", "best", "near", "me", ...STATE_CODES]);
const slugTokens = (slug) => String(slug || "").split("-").filter((t) => t && !STOP.has(t));

// COA-09 A1: does the keyword's service target already exist? CONTAINMENT match — the
// candidate tokens and an existing slug's tokens match when EITHER set contains the other;
// highest token overlap wins, tie-break the longest existing slug. So "roof-installation"
// resolves onto an existing "new-roof-installation" page instead of minting a duplicate.
function matchExistingService(candTokens, set) {
  const cand = (candTokens || []).filter((t) => t && !STOP.has(t));
  if (!cand.length) return "";
  let best = "", bestScore = 0, bestLen = -1;
  for (const slug of set) {
    const et = slugTokens(slug);
    if (!et.length) continue;
    const exSet = new Set(et), candSet = new Set(cand);
    const overlap = cand.filter((t) => exSet.has(t)).length;
    if (!overlap) continue;
    if (!(cand.every((t) => exSet.has(t)) || et.every((t) => candSet.has(t)))) continue; // either contains the other
    if (overlap > bestScore || (overlap === bestScore && slug.length > bestLen)) { best = slug; bestScore = overlap; bestLen = slug.length; }
  }
  return best;
}
// COA-09 A1 (city side): an existing location slug that EQUALS, STARTS WITH, or CONTAINS
// kebab(geo) is the page (ledger slugs are often state-suffixed: grain-valley → grain-valley-mo).
function matchExistingCity(citySlug, set) {
  if (!citySlug) return "";
  for (const slug of set) if (slug === citySlug || slug.startsWith(citySlug + "-") || citySlug.startsWith(slug + "-") || slug.includes(citySlug)) return slug;
  return "";
}

// known service vocabulary for a client: provider nouns + service-term words + modifiers.
const serviceVocab = (cfg) => new Set([
  ...(cfg.provider_nouns || []),
  ...(cfg.service_modifiers || []),
  ...(cfg.service_terms || []).flatMap((t) => norm(t).split(" ")),
].map(norm).filter(Boolean));

// COA-09 A2: an exact configured service term (or per-client service_aliases override) →
// its slug; NO fallback minting. A keyword with no configured service term returns "" so
// route() rides an existing page or sends it to review — never a fabricated,
// order-dependent slug like "roofing-mn" / "mn-roofing".
function serviceSlug(kw, cfg) {
  const n = norm(kw);
  const aliases = cfg.service_aliases || {};
  for (const [phrase, slug] of Object.entries(aliases)) if (n.includes(norm(phrase))) return kebab(slug);
  const hit = (cfg.service_terms || []).slice().sort((a, b) => b.length - a.length).find((t) => n.includes(norm(t)));
  return hit ? kebab(hit) : "";
}
// the keyword's KNOWN service tokens (provider nouns / service words), used to match an
// existing page when there is no configured service term (bare "roofing", "roofer x").
function serviceMatchTokens(kw, cfg) {
  const vocab = serviceVocab(cfg);
  const geoLc = findCity(norm(kw), cfg.served_cities || []);
  return norm(kw).replace(geoLc, "").split(" ").filter((w) => vocab.has(w));
}
// COA-09 C: blog slugs/titles are TOPIC slugs — strip "near me", state codes, and filler
// (STOP now includes all state codes + "in"/etc), so a raw query like
// "roofers in kennewick wa" becomes /blog/roofers-kennewick, not /blog/roofers-in-kennewick-wa.
function blogSlug(kw) {
  const n = norm(kw).replace(/\bnear me\b/g, " ");
  return kebab(n.split(" ").filter((w) => w && !STOP.has(w)).join(" "));
}
// COA-09 A3: leftover tokens that are neither service vocab, served city, generic leader,
// nor a stopword/state code — a proxy for an OUT-OF-AREA place name (Mark's flag 7 → drop).
function unknownGeoTokens(kw, cfg) {
  const vocab = serviceVocab(cfg);
  const gen = new Set(GENERIC_LEADERS.map(norm));
  const geoLc = findCity(norm(kw), cfg.served_cities || []);
  return norm(kw).replace(geoLc, "").split(" ").filter((w) => w && w.length > 2 && !STOP.has(w) && !vocab.has(w) && !gen.has(w));
}

// COA-10: the path of a ranking URL on the client's own site (the caller only ever passes
// own-site URLs - GSC page + SEMrush domain_organic Ur are both domain-scoped). Full URL or a
// bare path both accepted; homepage -> "/"; empty/invalid -> "" (falls back to slug matching).
const pathFromUrl = (u) => {
  const s = String(u || "").trim();
  if (!s) return "";
  try {
    const raw = s.includes("://") ? new URL(s).pathname : s;
    return (raw.replace(/\/+$/, "") || "/").toLowerCase();
  } catch { return ""; }
};
// COA-10: map a ranking path to the router's page_type by prefix ("" -> keep classify's).
const kindFromPath = (p) => p.startsWith("/service-areas/") ? "service_area" : p.startsWith("/services/") ? "service" : p.startsWith("/blog/") ? "blog" : "";

export function route(rows, cfg, existing) {
  const svc = existing?.service || new Set();
  const city = existing?.service_area || new Set();
  const blog = existing?.blog || new Set();
  // 1. classify + resolve each keyword to its ONE target page + action.
  const items = rows.map((r) => {
    const c = classify(r.keyword, cfg, r.volume);
    let target = "", action = "", pageType = c.page_type, reason = c.reason;
    // COA-10: if the client's OWN site already ranks for this keyword (GSC page / SEMrush
    // Ur), ride the page that ranks - the PRIMARY build-vs-add signal - and never build a
    // competitor. drop/review (brand, junk, ambiguous) still fall through to classify; slug
    // matching below is the fallback for a keyword with no ranking URL.
    const rankPath = (c.page_type !== "drop" && c.page_type !== "review") ? pathFromUrl(r.ranking_url) : "";
    const rankPos = Number(r.ranking_position);
    const rankCutoff = cfg.ranking_url_max_position ?? Infinity;
    // COA-10: ride the ranking page only when the ranking is DECENT (position within the
    // cutoff); a weak ranking (e.g. 26th via the homepage) still builds its own page. An
    // unknown position rides (the keyword is already a striking-distance candidate).
    const rode = !!rankPath && (!Number.isFinite(rankPos) || rankPos <= rankCutoff);
    if (rode) {
      target = rankPath; action = "add_to_existing"; pageType = kindFromPath(rankPath) || c.page_type;
      reason = `ranking URL on own site (pos ${Number.isFinite(rankPos) ? rankPos : "?"}) → ride the page that already ranks (COA-10)`;
    } else if (c.page_type === "service") {
      const slug = serviceSlug(r.keyword, cfg);
      if (slug) {
        // Specific service keyword (Mark B1): A1 containment against existing service pages,
        // else build its own page.
        const matched = matchExistingService(slugTokens(slug), svc);
        if (matched) { target = "/services/" + matched; action = "add_to_existing"; }
        else { target = "/services/" + slug; action = "build_new"; }
      } else {
        // Bare GENERIC term (no specific service). B1 (Mark 2026-08-10): ride the /services
        // HUB - replaces the old closest-specific-page / review behaviour, and never mints. A
        // purely out-of-area generic (no related service page AND an unserved trailing geo)
        // still drops (A3, Mark's flag 7). `relates` decides drop-vs-hub; the target is always
        // the hub, never the matched page.
        const relates = matchExistingService(serviceMatchTokens(r.keyword, cfg), svc);
        if (!relates && unknownGeoTokens(r.keyword, cfg).length) {
          pageType = "drop"; action = "drop"; reason = "out-of-area (unknown geo, no related service) → drop";
        } else {
          target = "/services"; action = "add_to_existing"; reason = "bare generic service term → /services hub (Mark B1)";
        }
      }
    } else if (c.page_type === "service_area") {
      const cs = kebab(c.geo);
      const matched = matchExistingCity(cs, city);
      if (matched) { target = "/service-areas/" + matched; action = "add_to_existing"; }
      else { target = "/service-areas/" + cs; action = "build_new"; }
    } else if (c.page_type === "blog") {
      const s = blogSlug(r.keyword); target = "/blog/" + s; action = blog.has(s) ? "add_to_existing" : "build_new";
    } else if (c.page_type === "drop") { action = "drop"; }
    else { action = "review"; }
    // COA-09 B3 (cross-type dedupe): a plural-list blog naming a served city whose LOCATION
    // page already exists rides that page instead of building a duplicate blog. (Plural=blog
    // classification otherwise stays per B4 / Mark's default when no page exists.)
    if (!rode && pageType === "blog" && c.geo && PLURAL_LIST.test(norm(r.keyword))) {
      const cityHit = matchExistingCity(kebab(c.geo), city);
      if (cityHit) { pageType = "service_area"; target = "/service-areas/" + cityHit; action = "add_to_existing"; reason = "cross-type dedupe: plural list for a served city with an existing location page → ride it"; }
    }
    return { ...r, page_type: pageType, geo: c.geo, reason, target_page: target, action };
  });
  // 2. CONSOLIDATE: many keywords → one page. Group service + service_area by target;
  //    highest-volume keyword is the page's PRIMARY, the rest SECONDARY (same page).
  const groups = {};
  for (const it of items)
    if ((it.page_type === "service" || it.page_type === "service_area") && it.target_page)
      (groups[it.target_page] ||= []).push(it);
  for (const g of Object.values(groups)) {
    g.sort((a, b) => (Number(b.volume) || 0) - (Number(a.volume) || 0));
    g.forEach((it, i) => (it.role = i === 0 ? "primary" : "secondary"));
  }
  // 3. roles for the non-consolidated types.
  for (const it of items) {
    if (it.action === "drop") it.role = "";
    else if (it.action === "review") it.role = it.role || "";
    else if (it.page_type === "blog") it.role = "primary";
    else it.role = it.role || "primary";
  }
  return items;
}

// ─── minimal CSV ─────────────────────────────────────────────────────────────
function parseCSV(text) {
  const rows = []; let i = 0, field = "", row = [], q = false;
  const push = () => { row.push(field); field = ""; };
  const end = () => { push(); rows.push(row); row = []; };
  while (i < text.length) {
    const ch = text[i++];
    if (q) { if (ch === '"') { if (text[i] === '"') { field += '"'; i++; } else q = false; } else field += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") push();
    else if (ch === "\n") end();
    else if (ch === "\r") {} else field += ch;
  }
  if (field.length || row.length) end();
  const header = rows.shift().map((h) => h.trim().toLowerCase());
  const ki = header.findIndex((h) => h === "keyword");
  const vi = header.findIndex((h) => ["volume", "search volume", "nq", "vol"].includes(h));
  const kdi = header.findIndex((h) => ["kd", "keyword difficulty", "difficulty"].includes(h));
  const cpi = header.findIndex((h) => ["cpc", "cost per click"].includes(h));
  const ui = header.findIndex((h) => ["ranking_url", "page", "ur", "url"].includes(h)); // COA-10: the own-site page that ranks
  return rows.filter((r) => r[ki]).map((r) => ({
    keyword: r[ki], volume: vi >= 0 ? r[vi] : "", kd: kdi >= 0 ? r[kdi] : "", cpc: cpi >= 0 ? r[cpi] : "", ranking_url: ui >= 0 ? r[ui] : "",
  }));
}
const csvCell = (v) => /[",\n]/.test(String(v ?? "")) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? "");
const toCSV = (rows) => {
  const cols = ["keyword", "volume", "kd", "cpc", "page_type", "action", "role", "geo", "target_page", "reason"];
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n";
};

async function loadExisting(path) {
  const out = { service: new Set(), service_area: new Set(), blog: new Set() };
  if (!path || !existsSync(path)) return out;
  const rows = parseCSVRaw(await readFile(path, "utf8"));
  for (const r of rows) {
    const type = (r.page_type || "").trim(); const slug = (r.slug || "").trim();
    if (type === "service") out.service.add(slug);
    else if (type === "service_area" || type === "location" || type === "city") out.service_area.add(slug);
    else if (type === "blog") out.blog.add(slug);
  }
  return out;
}
function parseCSVRaw(text) { // worked-log has named cols slug,page_type,url,status,...
  const lines = text.split(/\r?\n/).filter(Boolean); const h = lines.shift().split(",").map((x) => x.trim().toLowerCase());
  return lines.map((l) => { const c = l.split(","); const o = {}; h.forEach((k, i) => (o[k] = c[i])); return o; });
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
  const input = args.find((a) => !a.startsWith("--") && a.endsWith(".csv"));
  if (!input) { console.error("usage: node scripts/route-keywords.mjs keywords.csv [--out routed.csv] [--config cfg.json] [--worklog seo/worked-log.csv]"); process.exit(1); }
  let cfg = { ...DEFAULT_CONFIG };
  const cfgPath = opt("--config");
  if (cfgPath && existsSync(cfgPath)) cfg = { ...cfg, ...JSON.parse(await readFile(cfgPath, "utf8")) };
  // --from-brand-dna: auto-derive served_cities / service_terms / own_brand from
  // the client's own brain, so this runs on ANY client with zero manual config.
  const bdPath = opt("--from-brand-dna");
  if (bdPath && existsSync(bdPath)) {
    const { brandDNA } = await import(pathToFileURL(bdPath).href);
    cfg.primary_city = cfg.primary_city || brandDNA.address?.city || brandDNA.company?.city || "";
    const cities = new Set(cfg.served_cities || []);
    (brandDNA.serviceAreas || brandDNA.service_areas || []).forEach((a) => cities.add(typeof a === "string" ? a : a.name || a.city));
    (brandDNA.location_pages || []).forEach((l) => l.city && cities.add(l.city));
    cfg.served_cities = [...cities].filter(Boolean);
    const terms = new Set(cfg.service_terms || []);
    (brandDNA.services || []).forEach((s) => (s.name || s.title) && terms.add(String(s.name || s.title).toLowerCase()));
    cfg.service_terms = [...terms];
    if (brandDNA.company?.name) cfg.own_brand = [...(cfg.own_brand || []), String(brandDNA.company.name).toLowerCase()];
    console.log(`config: derived from brand-dna — ${cfg.served_cities.length} served cities, ${cfg.service_terms.length} service terms`);
  }
  const rows = parseCSV(await readFile(input, "utf8"));
  const existing = await loadExisting(opt("--worklog", "seo/worked-log.csv"));
  const routed = route(rows, cfg, existing);
  const out = opt("--out", "seo/routed-keywords.csv");
  await writeFile(out, toCSV(routed));
  const tally = routed.reduce((m, r) => ((m[r.action] = (m[r.action] || 0) + 1), m), {});
  console.log(`route-keywords: ${routed.length} keyword(s) → ${out}`);
  for (const [k, v] of Object.entries(tally).sort()) console.log(`  ${String(k).padEnd(16)} ${v}`);
  // page plan: consolidate service/service_area keywords by their ONE target page
  const pages = {};
  for (const r of routed) if ((r.page_type === "service" || r.page_type === "service_area") && r.target_page) {
    (pages[r.target_page] ||= { action: r.action, primary: "", secondary: [] });
    if (r.role === "primary") pages[r.target_page].primary = r.keyword; else pages[r.target_page].secondary.push(r.keyword);
  }
  const plan = Object.entries(pages);
  const news = plan.filter(([, p]) => p.action === "build_new");
  const adds = plan.filter(([, p]) => p.action === "add_to_existing");
  const blogsNew = routed.filter((r) => r.page_type === "blog" && r.action === "build_new");
  console.log(`\nBUILD NEW (${news.length} pages + ${blogsNew.length} blogs):`);
  for (const [url, p] of news) console.log(`  ${url}  [primary: ${p.primary}]${p.secondary.length ? ` +${p.secondary.length} kw` : ""}`);
  for (const b of blogsNew) console.log(`  ${b.target_page}  [blog]`);
  console.log(`\nADD KEYWORDS TO EXISTING PAGES (${adds.length}) — edit engine, do NOT rebuild:`);
  for (const [url, p] of adds) console.log(`  ${url}  ← ${[p.primary, ...p.secondary].filter(Boolean).join(", ")}`);
}

// ─── selftest (covers Mark's exact cases) ────────────────────────────────────
function selftest() {
  const cfg = {
    ...DEFAULT_CONFIG, primary_city: "Orlando",
    served_cities: ["Orlando", "Winter Park", "Kennewick", "Richland", "Pasco"],
    own_brand: ["horizon roofing"], competitor_brands: ["apex roofing", "titan exteriors"],
  };
  const eq = (kw, type, vol = null) => { const c = classify(kw, cfg, vol); if (c.page_type !== type) { console.error(`FAIL: "${kw}" → ${c.page_type} (${c.reason}), expected ${type}`); process.exit(1); } };
  eq("kennewick roofing companies", "blog");        // ← Mark's case: plural/list wins over geo
  eq("roofing companies", "blog");                  // plural list, no geo
  eq("kennewick roofing", "service_area");          // service + served city
  eq("roof repair richland", "service_area");       // service + served city
  eq("roof repair", "service");                     // commercial, no geo
  eq("metal roofing", "service");                   // service modifier, not a brand
  eq("roof repair near me", "service");             // near-me stripped
  eq("roof replacement cost", "blog");              // cost → informational
  eq("how much does a new roof cost", "blog");      // question
  eq("best roofer in kennewick", "blog");           // "best" list intent
  eq("roofing jobs kennewick", "drop");             // job junk
  eq("apex roofing", "drop");                        // competitor brand
  eq("horizon roofing", "drop");                     // own brand
  eq("smith roofing", "review");                     // possible unknown brand → review
  eq("roof repair orlando", "service");             // primary city → service page
  eq("roofing shingles for sale", "drop");          // retail junk
  eq("metal vs shingle roof", "blog");              // comparison
  eq("roof leak repair", "service", 5000);          // has volume, service
  eq("roof repair", "drop", 3);                      // below volume floor
  // routing: consolidation + existing-page detection (Mark's exact cases)
  const routed = route([
    { keyword: "roof repair", volume: 1000 },
    { keyword: "roof repair orlando", volume: 60 },    // primary city → rides the roof-repair SERVICE page
    { keyword: "roof repair richland", volume: 140 },  // Richland page EXISTS → add keyword, don't build
    { keyword: "roofer richland", volume: 50 },         // same Richland page (secondary)
    { keyword: "kennewick roofing", volume: 210 },      // Kennewick page does NOT exist → build ONE page
    { keyword: "metal roof kennewick", volume: 40 },    // rides that same new Kennewick page (secondary)
  ], cfg, { service: new Set(["roof-repair"]), service_area: new Set(["richland"]), blog: new Set() });
  const chk = (kw, action, role, target) => { const r = routed.find((x) => x.keyword === kw); if (r.action !== action || r.role !== role || (target && r.target_page !== target)) { console.error(`FAIL routing: "${kw}" → ${r.action}/${r.role}/${r.target_page}`); process.exit(1); } };
  chk("roof repair", "add_to_existing", "primary", "/services/roof-repair");
  chk("roof repair orlando", "add_to_existing", "secondary", "/services/roof-repair"); // consolidated, not its own page
  chk("roof repair richland", "add_to_existing", "primary", "/service-areas/richland"); // EXISTS → add, not build
  chk("roofer richland", "add_to_existing", "secondary", "/service-areas/richland");     // same page
  chk("kennewick roofing", "build_new", "primary", "/service-areas/kennewick");          // new city → build ONE
  chk("metal roof kennewick", "build_new", "secondary", "/service-areas/kennewick");     // rides the new page
  // ── COA-09 Phase 1: containment (A1) + no-mint (A2) + geo hygiene (A3) ──
  const cfg9 = { ...cfg, served_cities: [...cfg.served_cities, "Grain Valley"] };
  const ex9 = { service: new Set(["new-roof-installation", "commercial-roofing", "roof-repair"]), service_area: new Set(["grain-valley-mo", "richland"]), blog: new Set() };
  const r9 = route([
    { keyword: "roof installation", volume: 300 },        // A1: rides existing new-roof-installation (exact-slug miss)
    { keyword: "grain valley roofing", volume: 90 },      // A1 city: rides state-suffixed grain-valley-mo
    { keyword: "roofing st louis park mn", volume: 40 },  // A2/B1: bare generic → /services HUB, NEVER mints roofing-mn
    { keyword: "roofer theba", volume: 30 },              // A3: out-of-area drop (Theba not served, nothing relates)
    { keyword: "exteriors", volume: 20 },                 // B1: bare generic → /services hub (was review)
    { keyword: "roofing", volume: 300 },                  // B1 (Mark): bare general term → /services hub
    { keyword: "roofing company", volume: 100 },          // B1 (Mark): bare general term → /services hub
  ], cfg9, ex9);
  const c9 = (kw, action, target) => { const r = r9.find((x) => x.keyword === kw); if (!r || r.action !== action || (target && r.target_page !== target)) { console.error(`FAIL COA-09: "${kw}" → ${r && r.action}/${r && r.target_page} (${r && r.reason})`); process.exit(1); } };
  c9("roof installation", "add_to_existing", "/services/new-roof-installation");
  c9("grain valley roofing", "add_to_existing", "/service-areas/grain-valley-mo");
  c9("roofing st louis park mn", "add_to_existing", "/services"); // B1: hub, not a minted or closest page
  c9("roofer theba", "drop");
  c9("exteriors", "add_to_existing", "/services");                // B1: generic → hub (Mark)
  c9("roofing", "add_to_existing", "/services");                  // B1: bare general term → hub
  c9("roofing company", "add_to_existing", "/services");          // B1: bare general term → hub
  // ── COA-09 Phase 2: brand token-subset (B2) + cross-type dedupe (B3) ──
  const cfgP = { ...DEFAULT_CONFIG, provider_nouns: ["paver", "pavers", "hardscaping", "hardscape"], service_modifiers: ["brick", "travertine", "concrete", "stone"], own_brand: ["horizon brick paver"], competitor_brands: [], served_cities: ["Orlando", "Horizon West"] };
  const eqP = (kw, type) => { const c = classify(kw, cfgP); if (c.page_type !== type) { console.error(`FAIL B2: "${kw}" → ${c.page_type} (${c.reason}), expected ${type}`); process.exit(1); } };
  eqP("horizon pavers", "review");          // B2 (Mark): {horizon} ⊆ brand tokens → review (not silent drop)
  eqP("horizon brick pavers", "drop");      // B2: exact-ish brand
  eqP("brick pavers", "service");           // GENERIC (brick is a modifier) → NOT the brand
  eqP("horizon west pavers", "service_area"); // Horizon West is a SERVED CITY → not the brand (rides its page)
  // B3: a plural-list blog for a served city whose LOCATION page exists rides that page
  const r3 = route([
    { keyword: "roofing contractors nolanville tx", volume: 50 },
  ], { ...cfg, served_cities: [...cfg.served_cities, "Nolanville"] }, { service: new Set(), service_area: new Set(["nolanville-tx"]), blog: new Set() });
  const b3 = r3.find((x) => x.keyword === "roofing contractors nolanville tx");
  if (!b3 || b3.action !== "add_to_existing" || b3.target_page !== "/service-areas/nolanville-tx") { console.error(`FAIL B3: → ${b3 && b3.action}/${b3 && b3.target_page} (${b3 && b3.reason})`); process.exit(1); }
  // ── COA-09 Phase 3: blog TOPIC slug hygiene (C) — strip state code / "near me" / filler ──
  const rC = route([
    { keyword: "roofers in kennewick wa", volume: 30 },   // HighPoint: topic slug, no state code / "in"
    { keyword: "best roofer near me", volume: 40 },        // near-me stripped
  ], cfg, { service: new Set(), service_area: new Set(), blog: new Set() });
  const cC = (kw, target) => { const r = rC.find((x) => x.keyword === kw); if (!r || r.target_page !== target) { console.error(`FAIL C: "${kw}" → ${r && r.target_page}`); process.exit(1); } };
  cC("roofers in kennewick wa", "/blog/roofers-kennewick");
  cC("best roofer near me", "/blog/roofer");
  // ── COA-10: ranking-URL awareness — the page that ALREADY ranks (WITHIN the cutoff) wins ──
  const r10 = route([
    { keyword: "roof repair", volume: 200, ranking_url: "https://acme.com/", ranking_position: 6 },              // ranks WELL via HOMEPAGE → ride "/", never build
    { keyword: "roof installation", volume: 90, ranking_url: "https://acme.com/services/new-roof-installation", ranking_position: 12 }, // slug-mismatch but ranks well → ride the ranking page
    { keyword: "metal roof", volume: 80, ranking_url: "https://acme.com/", ranking_position: 26 },               // ranks WEAKLY (26 > cutoff 25) via homepage → still BUILDS its own page
    { keyword: "gutter guards", volume: 70, ranking_url: "https://acme.com/services/gutters", ranking_position: 22 }, // INSIDE Mark's 1-25 band (21-25 edge) → ride the ranking page, never build
    { keyword: "acme roofing", volume: 50, ranking_url: "https://acme.com/services/roofing", ranking_position: 4 }, // own brand still DROPS despite a good ranking URL
  ], { ...cfg, own_brand: ["acme roofing"] }, { service: new Set(), service_area: new Set(), blog: new Set() });
  const c10 = (kw, action, target) => { const r = r10.find((x) => x.keyword === kw); if (!r || r.action !== action || (target !== undefined && r.target_page !== target)) { console.error(`FAIL COA-10: "${kw}" → ${r && r.action}/${r && r.target_page} (${r && r.reason})`); process.exit(1); } };
  c10("roof repair", "add_to_existing", "/");                                     // good homepage ranking → ride, never build
  c10("roof installation", "add_to_existing", "/services/new-roof-installation"); // ranking URL wins over slug-mismatch
  c10("metal roof", "build_new", "/services/metal-roof");                         // weak ranking (> cutoff) → build its own page
  c10("gutter guards", "add_to_existing", "/services/gutters");                   // 22 is INSIDE 1-25 → ride, never build (locks Mark's cutoff against a regression to 20)
  c10("acme roofing", "drop");                                                    // brand drop NOT overridden by a ranking URL
  console.log("selftest OK — 47 checks: page-type rules + consolidation + build-vs-add + COA-09 containment/no-mint/geo + brand-subset→review + generic→hub + cross-type + blog-topic-slug + COA-10 ranking-URL+cutoff(1-25)");
}

// Run the CLI only when executed directly (node route-keywords.mjs ...), NOT when
// imported for its { classify, route } exports — otherwise `import` would trigger
// main()/selftest() and process.exit(1) in the importing process.
const isMain = import.meta.url === pathToFileURL(process.argv[1] || "").href;
if (isMain) { if (args_has("--selftest")) selftest(); else main(); }
function args_has(f) { return process.argv.slice(2).includes(f); }
