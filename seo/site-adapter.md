# Site Adapter — High Point Renovation & Roofing

## Stack & Host
- **Framework:** React 18 + Vite + vite-react-ssg (static-site generation)
- **Router:** React Router v6 (data-router, `src/App.jsx`)
- **Styling:** Tailwind CSS v3 + PostCSS
- **Host:** Static HTML output (Vercel-compatible; `404.html` prerendered)
- **Node:** ≥ 24 (per `package.json` engines)

## Content Source of Truth
**`src/config/brand-dna.js`** — single JS module that exports `brandDNA`. Machine-generated per client. The file also imports and merges `SERVICE_PAGES` from `src/config/service-pages.js` (hand-authored copy decks appended to `brandDNA.services` at the foot of the file).

## Page-Type → Content-Array Mapping

### 1. Service Detail Pages
- **Array:** `brandDNA.services` (in `src/config/brand-dna.js`)
- **Route:** `/services/:slug` → `src/pages/ServiceDetailPage.jsx`
- **Static paths:** `brandDNA.services.map((s) => '/services/' + s.slug)`
- **Slug rule:** kebab-case, lowercase, matches `s.slug` exactly (e.g. `roof-inspections`, `roof-repairs`, `roof-installation`)
- **Required fields per entry:**
  ```js
  {
    slug: string,           // kebab-case, unique
    name: string,           // display name
    description_short: string,  // card blurb / meta description fallback
    body: string,           // markdown-ish long copy (## headings, - bullets)
    benefits: Array<string | { title: string, body: string }>,
    included: Array<string>,
    faq: Array<{ q: string, a: string }>,
    related: Array<string>, // slugs of related services
    // Optional but rendered when present:
    heroTitle: string,
    metaTitle: string,
    description: string,
    whereWeWork: string,
    process: Array<{ num: number, title: string, desc: string }>,
  }
  ```
- **Note:** Four additional services live in `src/config/service-pages.js` (`SERVICE_PAGES`) and are appended to `brandDNA.services` by `brand-dna.js` at import time. New agent-written service entries must go into `brandDNA.services` in `src/config/brand-dna.js` (the array the route reads).

### 2. Location / Service-Area Detail Pages
- **Array:** `brandDNA.location_pages` (in `src/config/brand-dna.js`)
- **Route:** `/service-areas/:slug` → `src/pages/LocationDetailPage.jsx`
- **Static paths:** `(brandDNA.serviceAreas || []).map((a) => '/service-areas/' + slugify(a))`
  - `slugify`: lowercase, non-alphanumeric → `-`, trim leading/trailing `-`
- **Slug rule:** derived from the city name string in `brandDNA.serviceAreas` via the slugify function above (e.g. `"WEST RICHLAND"` → `"west-richland"`). The `location_pages` entry's `slug` field must match this derived value exactly.
- **Required fields per entry:**
  ```js
  {
    slug: string,           // must match slugify(serviceAreas entry)
    city: string,           // display name, title-cased
    headline: string,       // <h1> / SEO title
    subheadline: string,    // subtitle / meta description
    body: string,           // long copy with ## section headings
    faq: Array<{ q: string, a: string }>,
    adjacent_cities: Array<string>,  // slugs of nearby cities
    // Optional SEO overrides (rendered when present):
    metaTitle: string,       // optional; REQUIRED when another entry shares the same city, to avoid a duplicate <title>/<description> (seo-qa hard fail)
    metaDescription: string, // optional; REQUIRED when another entry shares the same city, to avoid a duplicate <title>/<description> (seo-qa hard fail)
  }
  ```
- **Prerequisite:** The city string must also exist in `brandDNA.serviceAreas` for `getStaticPaths` to prerender the route.

### 3. Blog Post Pages
- **Array:** `brandDNA.blog_posts` (in `src/config/brand-dna.js`)
- **Route:** `/blog/:slug` → `src/pages/BlogPostPage.jsx`
- **Static paths:** `publishedPosts(brandDNA.blog_posts).map((p) => '/blog/' + p.slug)` — only posts with a `publishedAt` date ≤ build date are prerendered.
- **Slug rule:** kebab-case, unique.
- **Required fields per entry:**
  ```js
  {
    slug: string,
    title: string,
    excerpt: string,
    date: string,           // display date, e.g. "April 2026"
    category: string,       // must be one of the existing blog_categories values
    readTime: string,
    cover: string,          // path under /public/, e.g. "/work/project1.webp"
    featured: boolean,      // set false unless replacing the current featured post
    content: Array<
      | { type: 'p', text: string }
      | { type: 'h2', text: string }
      | { type: 'list', items: Array<string> }
    >,
  }
  ```

## Routes Summary
| Path | Component | Data source |
|---|---|---|
| `/` | `HomePage` | `brandDNA` (various fields) |
| `/about` | `AboutPage` | `brandDNA.team`, `brandDNA.copy.founder` |
| `/services` | `ServicesPage` | `brandDNA.services` |
| `/services/:slug` | `ServiceDetailPage` | `brandDNA.services` (matched by slug) |
| `/service-areas` | `ServiceAreasPage` | `brandDNA.serviceAreas` |
| `/service-areas/:slug` | `LocationDetailPage` | `brandDNA.location_pages` + `brandDNA.serviceAreas` |
| `/blog` | `BlogPage` | `brandDNA.blog_posts` |
| `/blog/:slug` | `BlogPostPage` | `brandDNA.blog_posts` (matched by slug) |
| `/gallery` | `GalleryPage` | `brandDNA.previous_projects` |
| `/financing` | `FinancingPage` | `brandDNA.copy.offers` |
| `/contact` | `ContactPage` | `brandDNA.contact`, `brandDNA.address` |

## Build Command
```
npm run build
```
(Runs `node scripts/inject-theme.mjs` pre-build, then `vite-react-ssg build`, then `node scripts/gen-discovery.mjs && node scripts/seo-audit.mjs` post-build.)

## QA Command
```
node scripts/seo-qa.mjs
```
(Installed by the rail.)

## Hard Limits
1. **Add-only:** Never remove or modify existing entries in `brandDNA.services`, `brandDNA.location_pages`, or `brandDNA.blog_posts`. Append only.
2. **Slug uniqueness:** Every new slug must be unique across its array. Check existing slugs before writing.
3. **Service slugs must match `serviceAreas`:** A new `location_pages` entry's `slug` must equal `slugify(cityName)` where `cityName` appears verbatim in `brandDNA.serviceAreas`. If the city is not yet in `serviceAreas`, add it there first (the `getStaticPaths` reads that array).
4. **Blog categories:** `category` must be one of the values already present in `brandDNA.blog_categories`. Do not invent new categories.
5. **Image paths:** Use only paths that already exist under `/public/work/` (e.g. `/work/project1.webp` through `/work/project14.webp`). Do not reference images not in that pool.
6. **`featured` flag:** Set `featured: false` on all new blog posts unless explicitly instructed to replace the current featured post.
7. **`blog_posts` scheduling:** The `publishedPosts()` filter gates prerendering. New posts are live on the first build at or after their `publishedAt` date.
8. **No Capstone/template data:** The `brand-dna.example-capstone.js` file is a smoke-test fixture only. Never copy its content into `brand-dna.js`.
9. **`service-pages.js` is hand-authored:** Do not overwrite `SERVICE_PAGES` in `src/config/service-pages.js`. New service entries go into `brandDNA.services` in `src/config/brand-dna.js`.
10. **Written estimate is the price:** Copy must not promise a price range as a quote; use "general market range" framing consistent with existing location page copy.
