## Build brief: What Are Roof Repair Services? A Homeowner's Guide (blog)

- engine: rail
- page type: blog
- priority: P3
- why: GSC shows "roof repair services" at position 26.4 with 10 impressions over 90 days. No dedicated blog post targets this informational query. A well-structured guide can pull the page into striking distance and support the existing service pages.

### Cluster
- Primary: roof repair services (intent: informational / top-of-funnel)
- Secondary: NONE

### SERP target
Informational organic result for "roof repair services": an answer-first guide that explains what roof repair services include, when to call a roofer, and how to choose one in the Tri-Cities, WA area. Matches the research intent of a homeowner who is not yet ready to buy but is evaluating options.

### Real local detail (verify before merge)
- Reference the Tri-Cities, WA region (Kennewick, Richland, Pasco) as the service area per voice.md.
- Owner Terry Preston, 30 years construction experience, owner-operator - cite freely per voice.md.
- IKO ROOFPRO SELECT contractor status - cite freely per voice.md.
- Improvifi financing - cite freely per voice.md.
- Do NOT state any license number, exact review count, or warranty terms not confirmed in voice.md.
- High-desert climate detail (sun, Columbia River wind, day-to-night temperature swings) - cite freely per voice.md.

### Exact edits
- Append ONE new entry to `brandDNA.blog_posts` in `src/config/brand-dna.js`. Never edit an existing entry.
- Required fields:
  ```js
  {
    slug: "roof-repair-services",
    title: "Roof Repair Services: What Tri-Cities Homeowners Need to Know",
    excerpt: "Not sure what roof repair services actually cover? Terry Preston breaks down the most common repairs, when to call a roofer, and what to expect from the process in Kennewick, Richland, and Pasco.",
    date: "September 2026",
    publishedAt: "2026-09-01",
    category: // use an existing brandDNA.blog_categories value - do NOT invent a new one
    readTime: "5 min read",
    cover: "/work/project1.webp", // use any existing /public/work/ path
    featured: false,
    content: [
      { type: "p", text: "Roof repair services cover a wide range of fixes - from patching a single cracked shingle to resealing flashing around a chimney or skylight. If you're a homeowner in the Tri-Cities area, knowing what's included (and what isn't) helps you ask the right questions and avoid surprises." },
      { type: "h2", text: "What Do Roof Repair Services Include?" },
      { type: "p", text: "Most residential roof repair services fall into a few categories: leak diagnosis and patching, shingle replacement, flashing repair, valley repair, and ventilation fixes. A good roofer will inspect the full roof before quoting - not just the spot that's dripping." },
      { type: "list", items: [
        "Leak detection and patching",
        "Shingle repair or spot replacement",
        "Flashing repair around chimneys, vents, and skylights",
        "Valley and ridge repair",
        "Fascia and soffit repair where water has caused rot",
        "Storm and wind damage repair"
      ]},
      { type: "h2", text: "When Should You Call a Roofer?" },
      { type: "p", text: "The Tri-Cities climate is hard on roofs. High-desert sun degrades shingles faster than mild climates, Columbia River wind can lift edges and loosen flashing, and the big day-to-night temperature swings cause materials to expand and contract year-round. If you see water stains on a ceiling, missing shingles after a windstorm, or granules collecting in your gutters, it's time to get an inspection. Waiting usually makes the repair larger and more expensive." },
      { type: "p", text: "Our roof inspections page explains what Terry looks for during a full inspection - it's a good starting point if you're not sure whether you need a repair or a full replacement." },
      { type: "h2", text: "Repair vs. Replacement: How to Tell the Difference" },
      { type: "p", text: "Not every damaged roof needs to be replaced. If the damage is isolated - a few shingles, a section of flashing, a small leak - a targeted repair is often the right call. Terry's approach is honest: if a repair will hold, he'll say so. If the roof is past the point where repairs make sense, he'll tell you that too, and walk you through what a roof replacement involves." },
      { type: "p", text: "For homeowners weighing the options, our roof repairs service page and our roof replacement service page lay out what each process looks like and what to expect." },
      { type: "h2", text: "What to Expect From the Process" },
      { type: "p", text: "At High Point Renovation and Roofing, the process starts with Terry coming out to look at the roof himself. He'll give you a written estimate - that number is the price, not a starting point for negotiation. Work is scheduled, handled by trusted crews Terry oversees directly, and cleaned up when it's done. No surprises." },
      { type: "p", text: "If the repair follows storm or wind damage, we can also help with the insurance-claim process. See our insurance claims assistance page for how that works." },
      { type: "h2", text: "Financing for Roof Repairs" },
      { type: "p", text: "Unexpected repairs can strain a budget. As an Improvifi Certified Contractor, High Point offers payment plan options (subject to credit approval) so you can get the work done without waiting. Visit our financing page to learn more about how Improvifi works." },
      { type: "h2", text: "Serving Kennewick, Richland, Pasco, and the Tri-Cities" },
      { type: "p", text: "High Point Renovation and Roofing serves homeowners across the Tri-Cities - Kennewick, Richland, Pasco, West Richland, Benton City, Finley, Walla Walla, and Yakima. Terry Preston has 30 years in residential and commercial construction and personally oversees every project. If you have questions about your roof, reach out for a free estimate." },
    ]
  }
  ```
- metaTitle: Roof Repair Services: A Guide for Tri-Cities Homeowners
- metaDescription: Learn what roof repair services cover, when to call a roofer, and what to expect in Kennewick, Richland, and Pasco. Honest advice from Terry Preston.
- Internal links required in body (3-5, descriptive anchors, woven into prose):
  1. Roof inspections service page (`/services/roof-inspections`) - anchor: "our roof inspections page"
  2. Roof repairs service page (`/services/roof-repairs`) - anchor: "our roof repairs service page"
  3. Roof replacement service page (`/services/roof-replacement`) - anchor: "our roof replacement service page"
  4. Insurance claims service page (`/services/insurance-claims`) - anchor: "our insurance claims assistance page"
  5. Financing page (`/financing`) - anchor: "our financing page"

### Acceptance (per on-page-seo.md)
- metaTitle <= 60 chars, metaDescription 150-160 chars, one H1, no phone in either meta tag, no em-dashes anywhere in the page.
- Page emits Article (or BlogPosting) JSON-LD. No FAQ section in this post, so FAQPage schema is not required.
- 3-5 in-copy internal links resolve to built paths.
- `category` must match an existing value in `brandDNA.blog_categories` - verify before merge.
- `featured: false`.
- `cover` path must exist under `/public/work/` - verify before merge.
