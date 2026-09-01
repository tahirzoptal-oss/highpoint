## Build brief: Affordable Roofing Services in the Tri-Cities (blog)

- engine: rail
- page type: blog
- priority: P3
- why: GSC shows "affordable roofing services high point" at position 28.5 with 11 impressions over 90 days. The query reflects budget-conscious homeowners searching for cost-friendly roofing help. Per voice.md, "High Point" in bare roofing queries is a brand-name geo collision with High Point, NC -- this post anchors to the Tri-Cities, WA market and the "Quality Roofing Solutions That Fit Your Budget" tagline, converting the latent intent without feeding the NC noise.

### Cluster
- Primary: affordable roofing services high point (intent: budget/cost research)
- Secondary: NONE

### SERP target
Informational organic result for budget-roofing queries: an answer-first post that explains how homeowners in the Tri-Cities, WA can find quality roofing at a fair price, covering what drives roofing costs, how Improvifi financing works, and what to look for in a contractor -- matching the research intent behind the query.

### Real local detail (verify before merge)
- Anchor geography to Kennewick, Pasco, Richland, and the broader Tri-Cities, WA -- never to High Point, NC.
- Terry Preston, 30 years construction experience, owner-operator -- confirmed in voice.md.
- Improvifi financing -- confirmed in voice.md; do NOT state specific rates or approval terms beyond "subject to credit approval."
- IKO ROOFPRO SELECT contractor status -- confirmed in voice.md.
- Google 5-star rating -- confirmed in voice.md; [VERIFY: current review count before publishing].
- Founded 2022 -- confirmed in voice.md.
- [VERIFY: WA contractor license # before referencing "licensed" with a number.]
- [VERIFY: workmanship/material warranty terms before stating specifics.]

### Exact edits
- Append ONE new entry to `brandDNA.blog_posts` in `src/config/brand-dna.js`. Never edit an existing entry.
- Required fields:
  ```js
  {
    slug: "affordable-roofing-services-high-point",
    title: "Affordable Roofing in the Tri-Cities: What Homeowners Should Know",
    excerpt: "Quality roofing does not have to break the bank. Here is how Tri-Cities homeowners can get honest pricing, flexible financing, and a roof built to last.",
    date: "September 2026",
    publishedAt: "2026-09-01",
    category: // use an existing brandDNA.blog_categories value -- match exactly; do NOT invent a new category,
    readTime: "5 min read",
    cover: "/work/project1.webp", // use any existing /public/work/ path; verify before merge,
    featured: false,
    content: [
      { type: "p", text: "Finding affordable roofing services in the Tri-Cities, WA starts with knowing what you are actually paying for. Terry Preston, owner of High Point Renovation and Roofing, has spent 30 years in residential and commercial construction -- and his core promise is simple: a written estimate is the price. No surprises, no pressure." },
      { type: "h2", text: "What Drives Roofing Costs in the Tri-Cities?" },
      { type: "p", text: "High-desert sun, Columbia River wind, and wide day-to-night temperature swings put real stress on roofs in Kennewick, Pasco, and Richland. Those conditions affect how long materials last and how much labor a job takes. As a general market range, most residential roof replacements in the region vary based on roof size, pitch, and the materials chosen. IKO asphalt shingles -- the brand High Point Renovation and Roofing installs as an IKO ROOFPRO SELECT contractor -- offer a strong balance of durability and value for the Tri-Cities climate." },
      { type: "h2", text: "Financing That Fits Your Budget" },
      { type: "p", text: "A new roof is a significant investment. High Point Renovation and Roofing is an Improvifi Certified Contractor, which means qualified homeowners can spread the cost over time with a payment plan (subject to credit approval). If you have been putting off a repair or replacement because of the upfront cost, our roof financing options page explains how the process works and what to expect." },
      { type: "h2", text: "Repair Now or Replace? Getting the Honest Answer" },
      { type: "p", text: "Not every leak means a full replacement. Terry inspects every roof personally and will tell you straight: if a targeted repair will hold, that is what he recommends. If the roof is past the point where repairs make sense, he will explain why. Learn more about what goes into a professional roof inspection and what the report covers." },
      { type: "h2", text: "Storm Damage and Insurance Claims" },
      { type: "p", text: "Wind and hail events in the Tri-Cities can cause damage that is not always visible from the ground. If your roof took a hit, High Point Renovation and Roofing provides storm-damage repair and can help you navigate the insurance-claim process -- so you are not leaving money on the table. See how the storm damage and insurance claim assistance service works before you call your adjuster." },
      { type: "h2", text: "How to Choose a Roofing Contractor in the Tri-Cities" },
      { type: "list", items: [
        "Ask for a written estimate -- and confirm it is the final price, not a starting point.",
        "Verify the contractor is licensed and insured in Washington State.",
        "Check for manufacturer certifications (IKO ROOFPRO SELECT, for example) that signal trained installation.",
        "Look at Google reviews and ask for local references.",
        "Make sure the person you talk to is the person overseeing your job."
      ]},
      { type: "p", text: "High Point Renovation and Roofing serves Kennewick, Pasco, Richland, West Richland, Benton City, Finley, Walla Walla, and Yakima. If you are in the Tri-Cities area and want a straight answer on what your roof needs -- and what it will cost -- reach out for a free estimate. No pressure, no upsell." }
    ]
  }
  ```
- metaTitle: "Affordable Roofing in the Tri-Cities: What to Know"
- metaDescription: "Budget-friendly roofing in the Tri-Cities, WA. Learn what drives costs, how Improvifi financing works, and what to ask before hiring a roofer."
- Internal links required in body (3-5, descriptive anchors, woven into prose):
  1. Link to `/financing` -- anchor: "roof financing options page"
  2. Link to `/services/roof-inspections` -- anchor: "professional roof inspection"
  3. Link to `/services/storm-damage-repair` or `/services/insurance-claims` -- anchor: "storm damage and insurance claim assistance service"
  4. Link to `/service-areas/kennewick` or another existing city page -- anchor: descriptive city reference (verify slug exists before merge)
  5. Optional: link to `/services/roof-repairs` -- anchor: "targeted repair"

### Acceptance (per on-page-seo.md)
- metaTitle <= 60 chars, metaDescription 150-160 chars, one H1, no phone in either meta tag, no em-dashes anywhere in the post.
- Page emits Article (or BlogPosting) JSON-LD; add FAQPage JSON-LD if a FAQ section is wired in the BlogPostPage template.
- 3-5 in-copy internal links resolve to built paths -- verify all slugs before merge.
- `featured: false` confirmed.
- `category` value must match an existing `brandDNA.blog_categories` entry exactly -- confirm before merge.
- `cover` image path must exist under `/public/work/` -- confirm before merge.
- Run `grep -rn -- src/config/brand-dna.js` (and any other edited file) to confirm zero em-dashes before committing.
- Run `node scripts/seo-qa.mjs` post-build; build must pass with no hard-stop failures.
