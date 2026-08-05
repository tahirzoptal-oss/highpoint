# Build Brief — Service Detail Page
**engine:** rail
**type:** service
**slug:** roof-repair-kennewick-wa
**priority:** P3
**route:** /services/roof-repair-kennewick-wa

---

## Why This Page

GSC shows the query **"roof repair kennewick wa"** averaging position **22.7** over the last 90 days with **15 impressions** — sitting just outside page 2, with clear room to move onto page 1 with a dedicated, keyword-matched service page. The existing site has no page whose slug or H1 directly targets this geo-modified repair query. A focused service detail page will consolidate relevance signals and capture homeowners in Kennewick actively searching for repair help.

---

## Keyword Cluster

| Role | Keyword | Intent |
|---|---|---|
| Primary | roof repair kennewick wa | Commercial — local service, high purchase intent |
| Secondary | roof repair kennewick | Commercial — local |
| Secondary | kennewick roofing repair | Commercial — local |
| Secondary | roof leak repair kennewick | Commercial — problem-aware |
| Secondary | kennewick wa roofing contractor | Commercial — local |

**Search intent:** Homeowner with an existing roof problem (leak, storm damage, missing shingles) seeking a local contractor to assess and fix it — not a replacement buyer yet.

---

## SERP Target

- **metaTitle:** `Roof Repair in Kennewick, WA | High Point Roofing` *(55 chars)*
- **metaDescription:** `Roof leaks, storm damage, missing shingles — Terry Preston inspects and repairs Kennewick roofs. Free written estimate. No surprise costs. Call 509-351-5805.` *(158 chars)*
- **H1:** `Roof Repair in Kennewick, WA`

---

## Real Local Detail (DRAFT — verify before merge)

- `[VERIFY: any specific Kennewick neighborhoods (e.g., Canyon Lakes, Southridge, Vista Field area) where repair calls are most common — confirm with Terry before publishing]`
- `[VERIFY: whether Columbia River wind or freeze-thaw cycles are the most cited cause of repair calls in Kennewick specifically — confirm with Terry]`
- Climate framing sourced from voice.md allowlist: high-desert sun, Columbia River wind, day-to-night temperature swings — safe to use as-is.

---

## Exact Edits

**File:** `src/config/brand-dna.js`
**Array:** `brandDNA.services`
**Action:** APPEND the following object to the end of the `brandDNA.services` array. Do NOT modify any existing entry.

```js
{
  slug: "roof-repair-kennewick-wa",
  name: "Roof Repair — Kennewick, WA",
  heroTitle: "Roof Repair in Kennewick, WA",
  metaTitle: "Roof Repair in Kennewick, WA | High Point Roofing",
  description: "Roof leaks, storm damage, missing shingles — Terry Preston inspects and repairs Kennewick roofs. Free written estimate. No surprise costs. Call 509-351-5805.",
  description_short: "Local roof repair in Kennewick, WA. Terry Preston inspects the problem, gives you a written estimate, and manages the fix — no surprises.",
  whereWeWork: "We serve Kennewick and the broader Tri-Cities area, including Pasco, Richland, West Richland, and Finley.",
  body: `## Kennewick Roofs Take a Beating

High-desert sun, Columbia River wind, and big day-to-night temperature swings are hard on roofing materials. Shingles crack. Flashing lifts. Seals around vents and chimneys fail. When that happens, water finds a way in — and a small leak can become a big problem fast.

High Point Renovation & Roofing handles roof repairs for homeowners across Kennewick, WA. Owner Terry Preston inspects every job personally, tells you exactly what's wrong, and gives you a written estimate before any work begins.

## What We Repair

Not every roof problem needs a full replacement. Common repairs we handle in Kennewick include:

- Missing, cracked, or curling shingles
- Roof leaks and water intrusion
- Storm and wind damage
- Flashing failures around chimneys, vents, and skylights
- Damaged or clogged gutters affecting roof drainage
- Ice dam damage (less common here, but it happens)
- Soft spots or decking damage from long-term moisture

If a repair will hold, we tell you. If the roof is past the point where a repair makes sense, we tell you that too — honestly, without pressure to upsell.

## How the Process Works

Terry inspects your roof, identifies the source of the problem, and walks you through what he finds. You get a written estimate. That estimate is the price you pay — no surprise line items added after the fact.

Once you approve the work, Terry personally manages and oversees the crew that completes the repair. You don't hand off to a salesperson and wonder who shows up.

## Why Kennewick Homeowners Call Us

- **Owner-managed every job.** The same person who inspects your roof oversees the repair.
- **Written estimate = final price.** A core promise we don't break.
- **Licensed and insured in Washington.** [VERIFY: license number — repo states "Licensed and Insured in Washington" without a specific number]
- **IKO ROOFPRO Select Contractor.** We install quality materials built for this climate.
- **5.0 stars on Google.** Every review, five stars. [VERIFY: current review count if it has grown beyond 10]
- **Free inspection, free written estimate.** No obligation to move forward.

## Frequently Asked Questions

See the FAQ section below for answers to common questions about roof repair in Kennewick.

## Ready to Get Your Roof Fixed?

Call Terry at **509-351-5805** or email **terry@highpointrenovation.com**. We're available Monday through Saturday, 7:00 am to 8:00 pm.`,
  benefits: [
    { title: "Owner on Every Job", body: "Terry Preston inspects your roof personally and manages the repair crew — you're not handed off to a stranger." },
    { title: "Written Estimate Is the Price", body: "No surprise charges after the fact. The number on your estimate is the number on your invoice." },
    { title: "Honest Assessment", body: "If a repair will hold, we say so. If it won't, we say that too — no pressure to replace when a repair is the right call." },
    { title: "Licensed & Insured in Washington", body: "Work is covered. You're protected." },
    { title: "Free Inspection & Estimate", body: "No cost, no obligation. We show up, look at the problem, and tell you what we find." }
  ],
  included: [
    "Free on-site roof inspection",
    "Written, itemized estimate",
    "Repair of identified damage (shingles, flashing, decking, seals)",
    "Owner-managed crew oversight",
    "Post-repair walkthrough"
  ],
  faq: [
    {
      q: "How do I know if I need a repair or a full replacement?",
      a: "Terry will inspect the roof and give you an honest answer. If the structure is sound and the damage is isolated, a repair is usually the right call. If the roof is failing broadly, he'll tell you that too — and explain why."
    },
    {
      q: "How much does roof repair cost in Kennewick, WA?",
      a: "Repair costs vary widely depending on the type and extent of damage. Minor shingle repairs fall in a different general market range than flashing work or decking replacement. We give you a free written estimate so you know the exact number before any work starts."
    },
    {
      q: "Do you handle insurance claims for storm damage?",
      a: "Yes. We assist homeowners with storm damage repair and insurance claims. Terry can document the damage and work with your adjuster."
    },
    {
      q: "How soon can you come out?",
      a: "We're available Monday through Saturday, 7:00 am to 8:00 pm. Call 509-351-5805 to schedule an inspection."
    },
    {
      q: "Are you licensed and insured in Washington State?",
      a: "Yes. High Point Renovation & Roofing is licensed and insured in Washington. [VERIFY: license number before publishing]"
    }
  ],
  process: [
    { num: 1, title: "Free Inspection", desc: "Terry comes out, gets on the roof, and finds the source of the problem — not just the symptom." },
    { num: 2, title: "Written Estimate", desc: "You get a clear, itemized estimate. That number is the price. No add-ons after the fact." },
    { num: 3, title: "Repair", desc: "Terry manages the crew through the repair. Quality materials, clean work, done right." },
    { num: 4, title: "Walkthrough", desc: "We walk you through what was done before we leave." }
  ],
  related: ["roof-inspections", "storm-damage-repair", "roof-replacement"]
}
```

**Prerequisite slug check:** Confirm `"roof-repair-kennewick-wa"` does not already exist in `brandDNA.services` or `SERVICE_PAGES` before appending.

**Related slugs:** `roof-inspections`, `storm-damage-repair`, `roof-replacement` — confirm these slugs exist in the built site before merge to satisfy the internal-link hard stop.

---

## Acceptance Criteria (per on-page-seo.md)

- [ ] Exactly one H1: `Roof Repair in Kennewick, WA`
- [ ] `metaTitle` ≤ 60 chars: **55 chars** ✓
- [ ] `metaTitle` and `description` are unique across the site
- [ ] No "near me" in title or H1 ✓
- [ ] No phone number in title ✓
- [ ] Primary keyword ("roof repair kennewick wa") appears in first 100 words of rendered body ✓
- [ ] 3–5 H2 sections present in body ✓
- [ ] Bulleted benefit/service list present ✓
- [ ] 3–5 internal links to existing pages (related slugs above) — **verify slugs resolve before merge**
- [ ] Body length ~500–700 words ✓
- [ ] All `[VERIFY]` flags resolved by a human before merge
- [ ] `seo-qa.mjs` passes with no hard stops
