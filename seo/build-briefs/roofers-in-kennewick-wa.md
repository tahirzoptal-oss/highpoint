# Build Brief — roofers-in-kennewick-wa

## Header
- **engine:** rail
- **page-type:** service (location-flavored service detail)
- **array:** `brandDNA.location_pages` in `src/config/brand-dna.js`
- **route:** `/service-areas/kennewick`
- **priority:** P3
- **why:** GSC shows "roofers in kennewick wa" ranking at position 15.1 with 620 impressions over 90 days — a high-volume, high-commercial-intent query sitting just outside the top-10 where a dedicated, keyword-matched location page can capture clicks currently going to competitors. A Kennewick-specific page does not yet exist in `brandDNA.location_pages`.

---

## Cluster

| Role | Keyword |
|---|---|
| Primary | roofers in kennewick wa |
| Secondary | roofing contractor kennewick wa |
| Secondary | kennewick wa roofing company |
| Secondary | roof repair kennewick wa |
| Secondary | roof replacement kennewick wa |
| Secondary | kennewick roofing services |

**Intent:** Commercial / local — homeowner actively shopping for a roofing contractor in Kennewick.

---

## SERP Target
- **Competing URLs to displace:** Local map-pack listings and generic directory pages (Angi, HomeAdvisor) currently occupying positions 1–14 for this query.
- **Target position:** Top 10 (≤ 10) within 90 days of publish.
- **Featured-snippet opportunity:** FAQ answer for "How much does a new roof cost in Kennewick WA?" (general market range framing only — no specific price quote per voice.md).

---

## Real Local Detail *(all items flagged — verify before merge)*

- `[VERIFY: specific Kennewick neighborhoods served, e.g. Canyon Lakes, Southridge, Creekstone — confirm with Terry before naming]`
- `[VERIFY: any Kennewick-specific permit or inspection requirements Terry has encountered]`
- `[VERIFY: current Google review count if it has grown beyond 10]`
- Climate references (high-desert sun, Columbia River wind, day-to-night temperature swings) are confirmed in voice.md and may be used freely.
- Address (8350 W Grandridge Blvd, Ste200 #463, Kennewick, WA 99336) is confirmed in voice.md.

---

## Exact Edits

### Prerequisite check
Confirm `"Kennewick"` (or `"KENNEWICK"`) already exists in `brandDNA.serviceAreas`. If not, append it before adding the `location_pages` entry so `getStaticPaths` prerenders the route.

### Append to `brandDNA.location_pages`

```js
{
  slug: "kennewick",
  city: "Kennewick",
  headline: "Roofers in Kennewick, WA — High Point Renovation & Roofing",
  subheadline: "Owner-operated roofing in Kennewick. Free inspection, written estimate, no surprise costs.",
  body: `## Roofing Built for Kennewick's Climate

Kennewick sits in the heart of the Tri-Cities, where high-desert sun, Columbia River wind, and sharp day-to-night temperature swings put real stress on roofing materials year-round. At High Point Renovation & Roofing, we understand what local roofs go through — because we live and work here too.

Owner Terry Preston personally inspects every roof and manages every crew. The same person who walks your roof is the one who oversees the work from start to finish.

## Roofing Services We Offer in Kennewick

- **Roof Inspections** — Free, no-obligation inspection to tell you exactly what's going on up there.
- **Roof Repairs** — From a handful of missing shingles to flashing leaks, we fix what needs fixing and nothing more.
- **Roof Replacement** — Full tear-off and installation using quality materials including Owens Corning shingles.
- **Storm Damage Repair** — Wind and hail move fast in Eastern Washington. We help you document damage and work through the insurance claims process.
- **Insurance Claims Assistance** — We'll walk you through the claim so you're not navigating it alone.

## What to Expect When You Call

1. We schedule a free roof inspection at a time that works for you (Mon–Sat, 7 am–8 pm).
2. Terry walks the roof and gives you a straight assessment — if a repair will hold, we say so; if it won't, we say that too.
3. You receive a written estimate. That number is the price you pay — no surprise line items at the end of the job.
4. Work begins when you're ready. No pressure to move forward.

## Why Kennewick Homeowners Choose High Point

High Point Renovation & Roofing is an IKO ROOFPRO Select Contractor, licensed and insured in Washington. We carry a 5.0 Google rating — every review five stars. Payment plans are available subject to credit approval.

We're not a large franchise. Terry runs a focused operation where your project doesn't get handed off to someone who's never met you.

## Serving All of Kennewick and the Tri-Cities

We work throughout Kennewick and the surrounding Tri-Cities area, including Pasco, Richland, West Richland, Finley, Benton City, Walla Walla, and Yakima. [VERIFY: specific Kennewick neighborhoods such as Canyon Lakes, Southridge, or Creekstone — confirm with Terry before publishing.]

Ready to get started? Call **509-351-5805** or reach out at terry@highpointrenovation.com. Free inspection, free written estimate, no obligation.`,
  faq: [
    {
      q: "How much does a new roof cost in Kennewick, WA?",
      a: "Roof replacement costs vary based on the size of your home, the pitch of the roof, and the materials selected. In the general market, homeowners in the Kennewick area typically see a range that reflects those variables. The best way to get an accurate number is a free inspection and written estimate — that written number is the price you pay, with no surprise additions."
    },
    {
      q: "Do you offer free roof inspections in Kennewick?",
      a: "Yes. Terry will come out, walk the roof, and give you an honest assessment at no charge and with no obligation to move forward. We're available Monday through Saturday, 7 am to 8 pm."
    },
    {
      q: "Are you licensed and insured to work in Kennewick, WA?",
      a: "Yes. High Point Renovation & Roofing is licensed and insured in Washington State. We're also an IKO ROOFPRO Select Contractor."
    },
    {
      q: "Can you help with a storm damage insurance claim in Kennewick?",
      a: "Absolutely. We help homeowners document damage and navigate the insurance claims process so you're not doing it alone. Call us after a wind or hail event and we'll start with a free inspection."
    },
    {
      q: "How soon can you start a roofing project in Kennewick?",
      a: "Scheduling depends on current workload and weather, but we move as quickly as we can. Call 509-351-5805 or email terry@highpointrenovation.com to get on the schedule."
    }
  ],
  adjacent_cities: ["pasco", "richland", "west-richland", "benton-city", "finley"]
}
```

### Fields used for SEO rendering
```js
metaTitle:   "Roofers in Kennewick, WA | High Point Renovation",   // 54 chars ✓
description: "Owner-operated roofing in Kennewick, WA. Free inspection, written estimate, no surprise costs. Call Terry Preston at 509-351-5805.",
```
*(These fields are rendered by `LocationDetailPage.jsx` from `headline` / `subheadline` if the template does not expose separate `metaTitle`/`description` fields — confirm template wiring and add explicit fields if needed.)*

---

## Acceptance Criteria (per on-page-seo.md)

- [ ] Exactly one `<h1>` rendered from `headline` field: "Roofers in Kennewick, WA — High Point Renovation & Roofing"
- [ ] `metaTitle` ≤ 60 characters: "Roofers in Kennewick, WA | High Point Renovation" = 49 chars ✓
- [ ] Meta description unique across site; 140–165 chars target
- [ ] Primary keyword "roofers in kennewick wa" appears within first 100 words of rendered body
- [ ] No "near me" in title or H1
- [ ] No phone number in `<title>`
- [ ] 3–5 H2 sections present in body ✓ (5 H2s)
- [ ] Internal links to `/services/roof-repairs`, `/services/roof-installation`, `/services/roof-inspections`, and at least one adjacent city page (e.g. `/service-areas/richland`) resolve to built paths — confirm slugs exist before merge
- [ ] BreadcrumbList JSON-LD emitted by template; FAQPage schema emitted if template wires `faq` array
- [ ] `slug: "kennewick"` is unique in `brandDNA.location_pages`
- [ ] `"Kennewick"` present in `brandDNA.serviceAreas` (add if missing)
- [ ] `node scripts/seo-qa.mjs` passes with no hard-stop errors
- [ ] All `[VERIFY: ...]` flags resolved or removed before merge
