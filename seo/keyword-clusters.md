# Keyword clusters + build queue — High Point Renovation & Roofing (highpointrenovation.com)

Refreshed 2026-08 from live GSC. Replaces the installer stub. Rail appends to
`brandDNA.services`, `brandDNA.location_pages` (+ the city string in `brandDNA.serviceAreas`),
and `brandDNA.blog_posts`. Only queue rows with a brief in `seo/build-briefs/` build.
**New site (founded 2022, low authority)** — mostly pos 15–90; rankings build with depth + time.

## GSC baseline
- **Brand landing:** `high point renovation & roofing` pos ~2 (22 clicks), `highpoint roofing llc` pos 2, `high point renovations` pos 4.
- **The core-city gap — Richland has demand and NO page:** `roof repair richland wa` (55), `roof leak repair richland wa`, `roof repair west richland wa` (adjacent). Richland is one of the three Tri-Cities and is in `served_cities`, but there's no `/service-areas/richland`. **Biggest local gap.**
- **Kennewick (HQ) — real market, improvable:** `roofing kennewick` (21), `roofers in kennewick wa` (16), `roofing companies in kennewick wa` (17.5), `roofing contractor kennewick` (15.5), `roof repair kennewick wa` (21). Page exists (pos ~20) — improve.
- **Yakima — big cluster, weak (pos 65–91):** `best roofing companies in yakima washington`, `roofing contractors yakima wa`, `roofers yakima`, `best roofers in yakima`, `residential roofing yakima`. Page exists but weak — support it with content.
- **Pasco / West Richland / Walla Walla / Benton City:** pages exist, mid positions; `roofing companies walla walla` pos 1.
- **Cost & budget/financing (on-brand tagline):** `new roof cost kennewick` blog ranks **pos 7**, `roof replacement cost`, `how much does a roof cost`, `roofing companies near me that finance`. They offer **Improvifi** financing — under-leveraged.
- **Storm / wind / insurance (Tri-Cities climate):** `roof repair for storm and wind damage`, `wind damage roof repair`, storm blog + insurance-claims service exist.
- **GC/renovation side (strong, secondary):** `siding repair` pos 1, `renovation` pos 1, `siding installation` (5), `reconstruction remodel kennewick`, waterproofing-contractor-kennewick — real GC demand; keep roofing-first but note the siding/renovation upside.

### Ignore (off-strategy noise)
- **High Point, NC brand collision** (the big one): `roofing high point`, `storm/wind damage roof repair high point` (pos 9), `roofers high point`, `high point roof replacement`, etc. — that's **North Carolina**, not WA. Do NOT target bare "high point [service]"; anchor to Kennewick/Tri-Cities. See voice.md.
- **Out-of-area programmatic:** Deer Park / Cheney / Clarkston / Sandpoint (Spokane & N-Idaho area, far from Tri-Cities), and OH/IL/PA/ID/CA ("central ohio", "cincinnati", "champaign il", "limerick pa", "preston id", "citrus heights ca", "fort washington"). Not their market.

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

## Not rail — dashboard/human (edit)
- **Improve the existing weak pages:** `/service-areas/yakima` (pos 65) and `/service-areas/kennewick` — add depth, internal links, schema.
- Decide whether to lean into the **siding/renovation** GC demand (ranks pos 1–5 already) — beyond the roofing scope but a real opportunity.
