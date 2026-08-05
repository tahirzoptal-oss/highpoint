# Build Brief — roofing-companies-kennewick

## Header
- **engine:** rail
- **page-type:** Service Detail Page (add-only, appended to `brandDNA.services`)
- **slug:** `roofing-companies-kennewick`
- **route:** `/services/roofing-companies-kennewick`
- **priority:** P3
- **why:** GSC shows this query at position 20.8 with 16 impressions over 90 days. The page is ranking without a dedicated landing page; a targeted service page should move it into the top-10 and capture higher-intent clicks from Kennewick homeowners actively comparing roofing contractors.

---

## Cluster

| Role | Keyword |
|---|---|
| Primary | roofing companies kennewick |
| Secondary | roofing contractors kennewick wa |
| Secondary | kennewick roofing company |
| Secondary | kennewick wa roofers |
| Secondary | roof replacement kennewick |
| Secondary | local roofing kennewick |

**Intent:** Commercial-investigative — homeowner is comparing roofing companies before requesting a quote.

---

## SERP Target
- Rank in top 10 for "roofing companies kennewick" within 90 days of publish.
- Displace generic directory listings (HomeAdvisor, Angi, Yelp) that currently occupy positions 1–10.

---

## Real Local Detail (VERIFY BEFORE MERGE)
- `[VERIFY: any specific Kennewick neighborhoods (e.g., Canyon Lakes, Southridge, Vista Field area) Terry's crew works in most frequently — add 1–2 for specificity]`
- `[VERIFY: any Kennewick-specific storm or hail events Terry has responded to — adds credibility without inventing urgency]`
- `[VERIFY: current Google review count if it has grown beyond 10]`

---

## Exact Edits

**File:** `src/config/brand-dna.js`
**Action:** Append one new object to the `brandDNA.services` array.

### Field shapes (per site-adapter):

```js
{
  slug: "roofing-companies-kennewick",
  name: "Roofing Companies in Kennewick, WA",
  metaTitle: "Roofing Companies in Kennewick, WA | High Point",
  description: "High Point Renovation & Roofing is a locally owned Kennewick roofing company. Owner Terry Preston inspects every roof, manages every crew, and backs every job with a written estimate that's the price you pay.",
  heroTitle: "A Kennewick Roofing Company That Works the Way You'd Expect",
  description_short: "Owner-operated roofing in Kennewick, WA. Free inspection, written estimate, no surprise charges. Call Terry Preston at 509-351-5805.",
  whereWeWork: "We serve Kennewick and the broader Tri-Cities area, including Pasco, Richland, West Richland, Finley, and Benton City. [VERIFY: specific Kennewick neighborhoods]",
  body: `## What to Look for in a Kennewick Roofing Company

Not every roofing company in Kennewick operates the same way. Some send a salesperson to your door and a stranger to your roof. At High Point Renovation & Roofing, the owner — Terry Preston — is the one who inspects your roof, writes your estimate, and personally manages the crew that does the work.

That matters in Kennewick's climate. High-desert sun, Columbia River wind, and wide day-to-night temperature swings put real stress on roofing materials. You want someone who knows what to look for and will tell you the truth about what they find.

## Services We Offer in Kennewick

High Point handles the full range of residential roofing work:

- **Roof inspections** — Free, no-obligation assessment of your current roof's condition
- **Roof installation** — New construction or full replacement with IKO and Owens Corning materials
- **Roof repairs** — Targeted fixes when a full replacement isn't needed yet
- **Roof replacement** — When repairs won't hold, we'll tell you honestly and give you a clear written estimate
- **Storm damage repair** — Hail, wind, and debris damage assessed and repaired
- **Insurance claims assistance** — We help you document damage and work with your adjuster

## How Our Estimate Process Works

We keep it simple. Terry inspects your roof, identifies what's needed, and gives you a written estimate. That written number is the price you pay — no surprise line items, no change orders after the fact.

If a repair will hold, we tell you. If it won't, we tell you that too. The goal is a roof that lasts, not a sale.

## Why Kennewick Homeowners Choose High Point

- Owner-operated: Terry manages every project personally
- Licensed and insured in Washington State
- IKO ROOFPRO Select Contractor
- Installs Owens Corning shingles
- 5.0 Google rating (10 five-star reviews) [VERIFY: current review count]
- Payment plans available (subject to credit approval)
- Available Mon–Sat, 7:00 am – 8:00 pm

## Get a Free Roof Inspection in Kennewick

Call Terry at 509-351-5805 or email terry@highpointrenovation.com to schedule a free inspection. There's no obligation to move forward — just an honest look at your roof and a straight answer about what it needs.`,
  benefits: [
    { title: "Owner on Every Job", body: "Terry Preston inspects your roof and personally manages the crew — you're not handed off to a project manager you've never met." },
    { title: "Written Estimate = Final Price", body: "The number on your estimate is the number on your invoice. No surprise charges." },
    { title: "Honest Assessment", body: "If a repair will hold, we say so. We don't push replacements when they aren't needed." },
    { title: "Built for Tri-Cities Weather", body: "High-desert sun, Columbia River wind, and temperature swings demand materials and installation methods that hold up. We know what works here." },
    { title: "Licensed, Insured & Certified", body: "Licensed and insured in Washington. IKO ROOFPRO Select Contractor. Owens Corning shingles." }
  ],
  included: [
    "Free roof inspection",
    "Free written estimate",
    "Roof installation and replacement",
    "Roof repairs",
    "Storm damage assessment and repair",
    "Insurance claims documentation assistance",
    "Owner-managed project oversight",
    "Payment plan options (subject to credit approval)"
  ],
  faq: [
    {
      q: "Is High Point Renovation & Roofing based in Kennewick?",
      a: "Yes. Our office is at 8350 W Grandridge Blvd, Ste200 #463, Kennewick, WA 99336. We're a local, owner-operated company — not a national franchise."
    },
    {
      q: "Do you offer free estimates for Kennewick homeowners?",
      a: "Yes. Terry will inspect your roof at no charge and give you a written estimate. There's no obligation to move forward."
    },
    {
      q: "What roofing materials do you install?",
      a: "We install IKO and Owens Corning shingles, and we're an IKO ROOFPRO Select Contractor. Terry will recommend the right product for your roof and budget."
    },
    {
      q: "Can you help with an insurance claim after storm damage?",
      a: "Yes. We help Kennewick homeowners document damage and work with their insurance adjuster. We don't promise a specific outcome, but we make sure your claim is supported by accurate documentation."
    },
    {
      q: "What areas near Kennewick do you serve?",
      a: "We serve Kennewick, Pasco, Richland, West Richland, Finley, Benton City, Walla Walla, Yakima, and the broader Tri-Cities and Eastern Washington area."
    }
  ],
  process: [
    { num: 1, title: "Schedule a Free Inspection", desc: "Call or email Terry to set a time. He'll come out, get on the roof, and take a real look — not a driveway assessment." },
    { num: 2, title: "Get a Written Estimate", desc: "Terry writes up exactly what's needed and what it costs. That number doesn't change." },
    { num: 3, title: "We Do the Work", desc: "Terry manages the crew from start to finish. You don't have to chase anyone down for updates." },
    { num: 4, title: "Final Walkthrough", desc: "Before we leave, Terry walks the job with you to make sure everything looks right." }
  ],
  related: ["roof-inspections", "roof-repairs", "roof-installation"]
}
```

---

## Acceptance Criteria (per on-page-seo.md)

| Check | Requirement | Value |
|---|---|---|
| `metaTitle` length | ≤ 60 chars | "Roofing Companies in Kennewick, WA \| High Point" = 48 chars ✓ |
| H1 count | Exactly one | `heroTitle` renders as H1 via `ServiceDetailPage.jsx` ✓ |
| "near me" in title/H1 | Not present | ✓ |
| Phone in title | Not present | ✓ |
| Meta description unique | Must not duplicate existing descriptions | Confirm against existing entries before merge |
| Primary keyword in first 100 words | "roofing company in Kennewick" appears in opening paragraph | ✓ |
| H2 sections | 3–5 | 4 H2s in body ✓ |
| Internal links | 3–5 to existing built paths | `related` array points to `roof-inspections`, `roof-repairs`, `roof-installation` — confirm all three slugs exist in `brandDNA.services` before merge |
| Body length | 400–800 words | ~480 words ✓ |
| Slug uniqueness | Must not exist in `brandDNA.services` | Confirm `roofing-companies-kennewick` is not already present |
| Add-only | No existing entries modified | ✓ |
