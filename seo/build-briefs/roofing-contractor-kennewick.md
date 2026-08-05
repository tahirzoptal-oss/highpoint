# Build Brief — Service Detail Page
**engine:** rail
**type:** service
**slug:** roofing-contractor-kennewick
**route:** /services/roofing-contractor-kennewick
**priority:** P3
**status:** add-only

---

## Why This Page

GSC shows the query **"roofing contractor kennewick"** averaging position **15.6** over the last 90 days with **14 impressions** — sitting just outside page one. A dedicated service page targeting this keyword gives the site a concrete URL to rank for the core commercial intent in High Point's home city. No existing service page in `brandDNA.services` targets this geo-modified contractor query directly.

---

## Keyword Cluster

| Role | Keyword | Intent |
|---|---|---|
| Primary | roofing contractor kennewick | Commercial / transactional |
| Secondary | kennewick roofing company | Commercial |
| Secondary | roof contractor kennewick wa | Transactional |
| Secondary | kennewick wa roofer | Transactional |
| Supporting | roof repair kennewick | Transactional |
| Supporting | roof replacement kennewick | Transactional |

**Search intent:** Homeowner in Kennewick actively looking to hire a roofing contractor — high commercial intent, local modifier.

---

## SERP Target

- **Target position:** ≤ 10 (page one)
- **Competing for:** Local pack + organic blue-link for "roofing contractor kennewick"
- **Differentiator:** Owner-operated, IKO ROOFPRO Select certified, 5.0 Google rating, written estimate = final price

---

## Real Local Detail

> ⚠️ **VERIFY BEFORE MERGE** — The following neighborhood/local references are drafted and must be confirmed with the client before publishing:
> - `[VERIFY: specific Kennewick neighborhoods served, e.g. Canyon Lakes, Southridge, Creekstone — confirm with Terry]`
> - `[VERIFY: any Kennewick-specific permit or inspection requirements Terry routinely handles]`
> - `[VERIFY: current Google review count if it has grown beyond 10]`

Confirmed local facts used freely (from voice.md allowlist):
- Kennewick, WA is High Point's home city and primary service area
- Tri-Cities climate: high-desert sun, Columbia River wind, day-to-night temperature swings
- Owner: Terry Preston, 8350 W Grandridge Blvd, Ste200 #463, Kennewick, WA 99336

---

## Exact Edits

**File:** `src/config/brand-dna.js`
**Array:** `brandDNA.services`
**Operation:** APPEND one new object to the end of the array (add-only; do not modify any existing entry)

```js
{
  slug: "roofing-contractor-kennewick",
  name: "Roofing Contractor in Kennewick, WA",
  metaTitle: "Roofing Contractor Kennewick, WA | High Point",
  description: "High Point Renovation & Roofing is Kennewick's owner-operated roofing contractor. Free inspection, written estimate, no surprise costs. Call Terry at 509-351-5805.",
  heroTitle: "Kennewick's Trusted Roofing Contractor",
  description_short: "Owner-operated roofing in Kennewick, WA. Free inspection, written estimate, no surprise costs. IKO ROOFPRO Select certified.",
  whereWeWork: "We serve Kennewick and the broader Tri-Cities area including Pasco, Richland, West Richland, and Finley. [VERIFY: specific Kennewick neighborhoods such as Canyon Lakes, Southridge, or Creekstone — confirm with Terry before publishing]",
  body: `## A Roofing Contractor Who Shows Up and Stands Behind the Work

Finding a reliable roofing contractor in Kennewick shouldn't be complicated. At High Point Renovation & Roofing, owner Terry Preston inspects your roof, writes your estimate, and personally manages the crew that does the work. One point of contact from the first call to the final walkthrough.

Kennewick's high-desert climate is hard on roofs. Intense summer sun breaks down shingles faster than in wetter climates. Columbia River winds put lateral stress on flashing and ridge caps. Big day-to-night temperature swings cause materials to expand and contract season after season. We know what to look for because we work in this climate every day.

## What We Do

High Point handles the full range of residential roofing work:

- **Roof inspections** — thorough, honest assessment of what's holding and what isn't
- **Roof repairs** — targeted fixes that address the actual problem, not a sales pitch for a full replacement
- **Roof replacement** — complete tear-off and installation when repair no longer makes sense
- **Storm damage repair** — hail, wind, and debris damage assessed and documented
- **Insurance claims assistance** — we work with your adjuster so you don't have to navigate it alone
- **Emergency roofing** — when you can't wait, we move fast

## The Written Estimate Is the Price

Before any work begins, you get a written estimate. That number is what you pay. No surprise line items, no change orders after the fact. If a repair will hold, we tell you. If it won't, we tell you that too — even if that means a smaller job for us.

## IKO ROOFPRO Select Certified

High Point is an IKO ROOFPRO Select Contractor and installs Owens Corning shingles. We are licensed and insured in Washington State. [VERIFY: license number — repo states "Licensed and Insured in Washington" without a specific number]

## Free Inspection, No Obligation

Call Terry at 509-351-5805 or email terry@highpointrenovation.com to schedule a free roof inspection. We're available Monday through Saturday, 7:00 am to 8:00 pm. There's no obligation to move forward — just an honest look at what your roof needs.

[VERIFY: specific Kennewick neighborhoods served — add 1–2 sentences referencing local areas once confirmed with Terry]`,
  benefits: [
    { title: "Owner on Every Job", body: "Terry Preston inspects your roof and personally manages the crew. You're not handed off to a project manager you've never met." },
    { title: "Written Estimate = Final Price", body: "The number on your estimate is the number on your invoice. No surprises." },
    { title: "Honest Assessment", body: "If a repair will hold, we say so. We don't push replacements when a repair is the right call." },
    { title: "IKO ROOFPRO Select Certified", body: "Certified installer of IKO roofing systems and Owens Corning shingles. Licensed and insured in Washington State." },
    { title: "Free Inspection", body: "No cost, no obligation. We show up, take a look, and tell you exactly what we see." },
    { title: "Payment Plans Available", body: "Financing options available subject to credit approval. [VERIFY: financing partner name]" }
  ],
  included: [
    "Free roof inspection and written estimate",
    "Full roof repair and replacement services",
    "Storm damage assessment and documentation",
    "Insurance claims assistance",
    "Emergency roofing response",
    "IKO and Owens Corning material options",
    "Licensed and insured crews supervised by Terry Preston"
  ],
  faq: [
    {
      q: "How do I know if I need a repair or a full roof replacement?",
      a: "Terry will inspect your roof and give you a straight answer. If the structure and most of the shingles are sound, a targeted repair is usually the right call. If the roof has widespread wear or repeated failure points, replacement makes more sense long-term. We'll explain what we find and why."
    },
    {
      q: "Do you work with insurance companies for storm damage claims?",
      a: "Yes. We document the damage, provide a detailed written estimate, and can work directly with your adjuster. We don't promise a specific outcome, but we make sure the adjuster has accurate information about what the roof needs."
    },
    {
      q: "What roofing materials do you install?",
      a: "We install IKO roofing systems and Owens Corning shingles. Terry can walk you through the options that make sense for Kennewick's climate and your budget during the free inspection."
    },
    {
      q: "How long does a roof replacement take?",
      a: "Most residential replacements in Kennewick are completed in one to two days, depending on roof size and complexity. Terry will give you a realistic timeline in your written estimate. [VERIFY: confirm typical timeline with Terry]"
    },
    {
      q: "Are you licensed and insured in Washington State?",
      a: "Yes. High Point Renovation & Roofing is licensed and insured in Washington State. [VERIFY: license number before publishing]"
    },
    {
      q: "What areas do you serve besides Kennewick?",
      a: "We serve the full Tri-Cities area including Pasco, Richland, West Richland, Finley, and surrounding communities in Eastern Washington."
    }
  ],
  related: [
    "roof-inspections",
    "roof-repairs",
    "roof-installation"
  ],
  process: [
    { num: 1, title: "Free Inspection", desc: "Terry comes out, gets on the roof, and gives you an honest assessment of what's there." },
    { num: 2, title: "Written Estimate", desc: "You receive a written estimate before any work is scheduled. That number doesn't change." },
    { num: 3, title: "Scheduled Work", desc: "We schedule at a time that works for you. Terry manages the crew on-site from start to finish." },
    { num: 4, title: "Final Walkthrough", desc: "Terry walks the job with you when it's done. Any questions get answered before we leave." }
  ]
}
```

---

## Acceptance Criteria (per on-page-seo.md)

- [ ] `metaTitle` is ≤ 60 characters — **"Roofing Contractor Kennewick, WA | High Point"** = 46 chars ✓
- [ ] `metaTitle` is unique across `brandDNA.services` slugs
- [ ] `description` (meta description) is unique across the site; length 140–165 chars — current draft: ~155 chars ✓
- [ ] Exactly one H1 rendered by `ServiceDetailPage.jsx` (driven by `heroTitle`) ✓
- [ ] No "near me" in `metaTitle` or `heroTitle` ✓
- [ ] No phone number in `metaTitle` ✓
- [ ] Primary keyword **"roofing contractor kennewick"** appears in first 100 words of `body` ✓
- [ ] 3–5 H2 sections in `body` (4 present) ✓
- [ ] `related` slugs (`roof-inspections`, `roof-repairs`, `roof-installation`) must resolve to existing built paths — confirm these slugs exist in `brandDNA.services` before merge
- [ ] All `[VERIFY: ...]` flags resolved by a human before merge
- [ ] `slug: "roofing-contractor-kennewick"` confirmed unique in `brandDNA.services` before merge
- [ ] `node scripts/seo-qa.mjs` passes with no hard stops after build
