# Keyword clusters + build queue — High Point Renovation & Roofing (highpointrenovation.com)

Refreshed 2026-08 from live GSC. Replaces the installer stub. Rail appends to
`brandDNA.services`, `brandDNA.location_pages` (+ the city string in `brandDNA.serviceAreas`),
and `brandDNA.blog_posts`. Only queue rows with a brief in `seo/build-briefs/` build.
**New site (founded 2022, low authority)** — mostly pos 15–90; rankings build with depth + time.

## GSC baseline

Ranking queries surfaced by the brain-feeder this refresh:

- "gutter repair near me" - pos 28.2, 21 impressions (90d)
- "affordable roofing services high point" - pos 28.5, 11 impressions (90d)
- "roof repair services" - pos 26.4, 10 impressions (90d)

## Clusters (hub → spokes)
- **Tri-Cities cities (core)** — `/service-areas/:slug` → `[service] [city] wa`; priority: **Richland (new)**, Kennewick (improve), then Pasco/West Richland/Benton City/Finley; plus Walla Walla, Yakima.
- **Residential repair & replacement** — hubs `/services/roof-repairs`, `/services/roof-replacement` → by city.
- **Cost & financing (budget tagline)** — `/financing` + cost blog → new roof cost, roof financing, Improvifi, payment plans.
- **Storm / wind / insurance** — `/services/storm-damage-repair`, `/services/insurance-claims` → wind/storm damage, claim help (Tri-Cities).
- **(Secondary) siding & renovation** — GC upside; not the roofing rail's focus, flag for human.

## Build queue (ranked)
Only rows with a brief in `seo/build-briefs/` are eligible.

- **P1 (location):** `richland` — core Tri-City, in `served_cities`, no page, real demand. Brief ✅ (add "Richland" to `serviceAreas` + a `location_pages` entry.)
- **P2 (blog):** `roof-financing-tri-cities` — Improvifi + the "fits your budget" tagline + `roofing companies near me that finance`. Brief ✅
- **P2 (blog):** `roofing-in-yakima-what-to-know` — supports the big-but-weak Yakima cluster. Brief ✅
- **P3 (needs brief):** `finley` location (small, completes Tri-Cities coverage); a siding/renovation page (human decision — GC upside beyond the roofing mandate).


### P3 (brain-refresh 2026-09)
- **gutter** (service) - gutter repair near me (pos 28.2) [brain-refresh 2026-09; verify before merge]
- **affordable-roofing-services-high-point** (blog) - affordable roofing services high point (pos 28.5) [brain-refresh 2026-09; verify before merge]
- **roof-repair-services** (blog) - roof repair services (pos 26.4) [brain-refresh 2026-09; verify before merge]
## Not rail — dashboard/human (edit)
- **Improve the existing weak pages:** `/service-areas/yakima` (pos 65) and `/service-areas/kennewick` — add depth, internal links, schema.
- Decide whether to lean into the **siding/renovation** GC demand (ranks pos 1–5 already) — beyond the roofing scope but a real opportunity.
