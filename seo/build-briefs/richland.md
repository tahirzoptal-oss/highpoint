# Build Brief — Richland (location page)

- **engine:** rail
- **page type:** location
- **slug:** richland
- **url:** /service-areas/richland
- **priority:** P1
- **status:** ready-to-build

## Why this page (GSC evidence)
Richland is one of the three Tri-Cities and is in `served_cities`, but has **no page**:
`roof repair richland wa` (55), `roof leak repair richland wa`, `residential roofing`
demand across the metro. West Richland (adjacent) already has a page; core Richland doesn't.
Clearest local gap.

## Cluster
- **Primary:** roofing richland wa
- **Secondary:** roof repair richland wa, roof replacement richland wa, roofing contractor richland wa, residential roofing richland wa
- **Intent:** commercial (local hire)

## SERP target
`headline` (H1) "ROOFING IN RICHLAND, WA" · `subheadline` · `body` 400–600 words, 2–3 `##`
sections + service bullets · `faq` 3–4 · `adjacent_cities: ["Kennewick","Pasco","West Richland"]`
(all existing). Unique copy — do NOT clone the Kennewick/West Richland pages (avoid doorway/duplicate).

## Real local detail *(verify before merge)*
Richland: Tri-Cities on the Columbia, high-desert sun + river wind + big temp swings (shingle
stress). Owner-operator Terry (30 yrs), written estimate = final price, IKO ROOFPRO SELECT,
Improvifi financing. voice.md facts only; no firm price quotes; no review-count claims.

## Exact edits (add-only)
1. Ensure the string **"Richland"** is in `brandDNA.serviceAreas` (route prerenders from it).
2. Append ONE object to `brandDNA.location_pages` in `src/config/brand-dna.js` per site-adapter §2
(slug `richland`, city, headline, subheadline, body, faq, adjacent_cities). Add `metaTitle`/`metaDescription`. Never edit existing entries.

## Acceptance
slug == slugify("Richland") == `richland` · metaTitle/description unique · one H1 · primary kw
in first 100 words · adjacent links resolve · `npm run build` + `node scripts/seo-qa.mjs` exit 0.
