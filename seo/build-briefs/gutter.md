## Build brief: Gutter Repair Service Page (service)

- engine: rail
- page type: service
- priority: P3
- why: GSC shows "gutter repair near me" at position 28.2 with 21 impressions over 90 days and no dedicated gutter repair service page yet. The site already surfaces for this query; a focused service entry in `brandDNA.services` gives the route a proper landing target and captures low-volume but relevant demand. As a general contractor, High Point does renovation and repair work beyond roofing - gutters are a natural adjacency. Note: volume is modest (P3); this page builds topical depth rather than driving immediate traffic.

### Cluster
- Primary: gutter repair near me (intent: local service, transactional)
- Secondary: NONE

### SERP target
Local organic for "gutter repair near me" and related Tri-Cities gutter queries: an answer-first opening that names the service, the region, and a clear CTA, matching the intent of the existing service detail pages on the site.

### Real local detail (verify before merge)
- High Point Renovation & Roofing is a licensed general contractor in Kennewick, WA serving the Tri-Cities region (Kennewick, Pasco, Richland, West Richland, Benton City, Finley) plus Walla Walla and Yakima. Reference the Tri-Cities region and the high-desert climate context (sun, wind, temperature swings) in the body.
- Owner Terry Preston has 30 years of construction experience and personally oversees every project. Name Terry in the copy.
- [VERIFY: confirm gutter repair is explicitly offered as a service before merge - voice.md lists it as a GC adjacency but does not enumerate it in the confirmed services list. Confirm with Terry.]
- [VERIFY: WA contractor license #]
- [VERIFY: current Google review count]
- [VERIFY: workmanship/material warranty terms for gutter work]
- Do NOT state any license number, review count, or years in business beyond what voice.md confirms (30 years construction experience, founded 2022).

### Exact edits
- Append ONE new entry to `brandDNA.services` in `src/config/brand-dna.js` (the array `ServiceDetailPage` reads via `/services/:slug`). Do NOT edit `src/config/service-pages.js`.
- Slug: `gutter-repair` (kebab-case, unique - verify no existing entry uses this slug before writing).
- Required fields:
  ```js
  {
    slug: "gutter-repair",
    name: "Gutter Repair",
    heroTitle: "Gutter Repair in the Tri-Cities, WA",
    metaTitle: "Gutter Repair in the Tri-Cities, WA | High Point",
    description: "Owner-led gutter repair for Kennewick, Richland, Pasco, and the wider Tri-Cities area. Terry Preston oversees every job. Get a free written estimate.",
    description_short: "Owner-led gutter repair across the Tri-Cities. Terry Preston oversees every job and backs the work with a written estimate that is the price.",
    body: "400+ words, answer-first, in the client voice from voice.md. See body guidance below.",
    benefits: [...],
    included: [...],
    faq: [...],
    related: ["roof-repairs", "storm-damage-repair", "roof-inspections"],
    process: [...],
    whereWeWork: "We serve Kennewick, Richland, Pasco, West Richland, Benton City, Finley, Walla Walla, and Yakima.",
  }
  ```
- metaTitle: `Gutter Repair in the Tri-Cities, WA | High Point`
- metaDescription: `Owner-led gutter repair in Kennewick, Richland, Pasco, and the Tri-Cities. Terry Preston oversees every job. Free written estimate - no pressure.`

#### Body guidance (400+ words, answer-first, no em-dashes, plain-spoken Terry voice)
- Open with the primary keyword and the region in the first 100 words. Example framing: "If you need gutter repair in the Tri-Cities, you want someone who will tell you straight whether a patch will hold or whether the whole run needs replacing..."
- Explain why gutters matter in the high-desert climate: wind-driven debris, big temperature swings, and the Columbia River corridor conditions that stress seams and hangers.
- Name Terry Preston and the owner-operator model: the person who inspects is the person who oversees the fix.
- Use "general market range" framing for cost; never quote a firm price.
- Mention Improvifi financing as an option (subject to credit approval).
- Include 3-5 in-copy internal links with descriptive anchor text to related existing pages:
  1. Link to `/services/roof-repairs` with anchor text such as "roof repair service" (gutters and rooflines are connected; a failing gutter can mask a roof leak).
  2. Link to `/services/storm-damage-repair` with anchor text such as "storm and wind damage repair" (Tri-Cities wind events stress gutter hangers and seams).
  3. Link to `/services/roof-inspections` with anchor text such as "roof inspection" (a full inspection covers the roofline and gutter attachment points together).
  4. Link to `/service-areas/kennewick` with anchor text such as "Kennewick roofing and repair" (HQ city, existing page).
  5. Link to `/service-areas/richland` with anchor text such as "Richland service area" (core Tri-City; confirm this page is built before merge - it is P1 in the build queue).
- Close with a CTA directing homeowners to request a free written estimate.
- No superlatives, no invented urgency, no Owens Corning references, no em-dashes.

#### FAQ (suggested starters - verify facts before merge)
- Q: "How do I know if my gutters need repair or full replacement?" A: honest, non-upsell answer in Terry's voice.
- Q: "Do you repair gutters on all home types?" A: confirm scope with Terry before merge.
- Q: "Can I finance gutter repair?" A: yes, Improvifi payment plans are available, subject to credit approval.

### Acceptance (per on-page-seo.md)
- metaTitle <= 60 characters, metaDescription 150-160 characters, one H1, no phone number in either meta tag, no "near me" in the metaTitle, no em-dashes anywhere in the page copy.
- Page emits Service + BreadcrumbList JSON-LD (required for service page type per on-page-seo.md hard stops). Add FAQPage JSON-LD if the FAQ section is rendered.
- 3-5 in-copy internal links resolve to built paths (confirm `/service-areas/richland` is live before merge, or swap to an already-built city page).
- Slug `gutter-repair` is unique in `brandDNA.services` - verify before writing.
- Do NOT modify any existing entry in `brandDNA.services` or `src/config/service-pages.js`.
- Run `grep -rn - <changed files>` before merge to confirm zero em-dashes.
- Run `node scripts/seo-qa.mjs` post-build; build must pass with no hard-stop failures.
