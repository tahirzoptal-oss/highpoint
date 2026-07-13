# Capstone Template — Photo Manifest

Generated during the templatise refactor. Every `<img src=` and `style={{ backgroundImage }}`
reference in Capstone is catalogued here, categorised by source pool. Stage 10.1
(`tools/build-from-template.py`) reads this manifest to know which per-client asset
to swap into each slot.

## Source pools

| Pool | Definition | Per-client source |
|------|------------|-------------------|
| `hero` | The big above-the-fold hero image (desktop + mobile variants) | `Pipeline Data/hero-image/hero-final-{desktop,mobile}.png` (Stage 9 output) |
| `owner` | Founder portrait | `[Client Name] Assets/photos/owner.{jpg,png,webp}` |
| `previous-projects` | In-section photos pulled from the client's project gallery (WhyChooseUs bg, blog covers, OurProcess illustration, OurWork tiles, hero secondary) | `[Client Name] Assets/photos/projects/*` |
| `team` | Optional Team section photos | `[Client Name] Assets/photos/team/*` |
| `badges` | Manufacturer / certification badges | `references/trust-badges/{name}.{png,svg}` looked up via `references/trust-badges/registry.json` against `brandDNA.trust_badges[].filename` |
| `platforms` | Google / Facebook / BBB review pill logos | `references/assets/platforms/{google,facebook,bbb}-logo.svg` (verbatim, never per-client) |
| `pattern` | Background SVG pattern | `templates/capstone/src/assets/bg-patterns/{shape_motif}.svg` selected by `brandDNA.shape_motif` |
| `none` | Section has no photo (SVG/icon only) | n/a |

## Slots (the asset path contract)

Every per-client build writes files at these EXACT paths so component code never changes:

| Path | Pool | Dimension cap | WebP quality | Notes |
|------|------|---------------|--------------|-------|
| `public/logo.svg` (or `.png`) | (logo, special) | n/a | passthrough | SVG preferred. PNG fallback compressed via cwebp. |
| `public/hero-image.webp` | hero | 1920×1080 | 92 | Desktop hero. Set as Schema.org `image`. |
| `public/hero-image-mobile.webp` | hero | 828×1200 | 92 | Mobile hero. Picked via `<picture>` element. |
| `public/owner.webp` | owner | 640×800 | 88 | Founder portrait. |
| `public/badges/{name}.{png,svg}` | badges | passthrough | passthrough (q=92 if rasterised) | Filenames from `brandDNA.trust_badges[].filename`. Files copied from `references/trust-badges/`. Cleaned via `tools/clean-transparent-jpeg.py` if source JPEG had a checker pattern baked in. |
| `public/work/project-{n}.webp` | previous-projects | 1200×800 | 92 | OurWork gallery tiles. n = 1..6 typical. |
| `public/work/action-{n}.webp` | previous-projects | 1200×800 | 92 | Action shots (optional). |
| `public/work/action-video.mp4` | previous-projects (video) | 1280×720 | n/a | Optional video. Skip if client has no video. |
| `public/sections/why-choose-bg.webp` | previous-projects | 1600×900 | 92 | WhyChooseUs background photo. |
| `public/sections/services-bg.webp` | previous-projects | 1600×900 | 92 | Services section background. |
| `public/sections/process-illustration.webp` | previous-projects | 1200×800 | 92 | OurProcess section illustration. |
| `public/sections/blog-cover-{n}.webp` | previous-projects | 800×500 | 92 | Blog post covers (n = 1..6). |
| `public/team/{slug}.webp` | team | 480×600 | 88 | Optional team photos. Slug from `brandDNA.team[].photo_slug`. |
| `public/platforms/google-logo.svg` | platforms | passthrough | passthrough | Verbatim from `references/assets/platforms/`. |
| `public/platforms/facebook-logo.svg` | platforms | passthrough | passthrough | Verbatim. |
| `public/platforms/bbb-logo.svg` | platforms | passthrough | passthrough | Verbatim. |
| `public/patterns/{motif}.svg` | pattern | passthrough | n/a | Selected by `brandDNA.shape_motif` from `templates/capstone/src/assets/bg-patterns/`. |
| `public/favicon.{png,svg}` | (favicon) | 32×32 / 192×192 | passthrough | Generated from logo if missing. |

## Section-by-section reference (current Capstone slots)

| Section | Image refs | Pool | Dimension hint |
|---------|-----------|------|----------------|
| `Hero.jsx` | `/hero-image.png` | hero | landscape, full-width |
| `TopBar.jsx` | (none) | none | |
| `Navbar.jsx` | `/capstone-logo.svg` | logo | square or wide-rect, height ~40px |
| `Layout.jsx` | (none, wraps everything) | none | |
| `TrustStrip.jsx` | `/badges/tamko.png`, `/badges/owens-corning.jpg`, `/badges/owens-corning-platinum.png`, `/badges/certainteed.png`, `/badges/trust-badge-1.png`, `/badges/trust-badge-2.png` | badges | mixed sizes, height ~64-96px |
| `Reviews.jsx` | (none — text + platform logos only) | platforms | platform logos at ~14-16px |
| `Founder.jsx` | `/owner.webp` | owner | portrait 4:5 |
| `Services.jsx` | `/work/gemini2.png` (mobile + desktop) | previous-projects | landscape 16:9 |
| `WhyChooseUs.jsx` | `/work/gemini3.png` (mobile + desktop) | previous-projects | landscape 16:9 |
| `OurWork.jsx` | `/work/action-video.mp4`, `/work/action1.jpg`, `/work/action2.jpg`, `/work/action3.jpg`, `/work/action4.jpg`, `/work/project1.jpg` through `/work/project6.jpg`, `/work/gemini1.png` | previous-projects (mostly), 1 video | mixed; project tiles 4:3, action shots 16:9 |
| `OurProcess.jsx` | `/work/project2.jpg` | previous-projects | landscape 16:9 |
| `SpecialOffers.jsx` | (none — icon SVG inline) | none | |
| `Blog.jsx` | `/work/project1.jpg`, `/work/project3.jpg`, `/work/gemini1.png` | previous-projects | landscape 16:9 |
| `FAQ.jsx` | `/capstone-logo.svg` | logo | |
| `ServiceAreas.jsx` | (Google Maps embed iframe — no img) | none | |
| `CTABanner.jsx` | `/capstone-logo.svg` | logo | |
| `Footer.jsx` | `/capstone-logo.svg` | logo | |
| `MobileCtaBar.jsx` | (none) | none | |
| `Ticker.jsx` | (none — text scroll) | none | |

## Page-level refs

| Page | Image refs | Pool |
|------|-----------|------|
| `pages/HomePage.jsx` | (composes the components above) | n/a |
| `pages/AboutPage.jsx` | `/owner.webp`, `/hero-image.png` | owner, hero |
| `pages/ContactPage.jsx` | `/hero-image.png` | hero |
| `pages/ServicesPage.jsx` | `/hero-image.png`, possibly per-service photos | hero, previous-projects |
| `pages/ServiceDetailPage.jsx` | per-service hero photo | previous-projects |
| `pages/GalleryPage.jsx` | full /work/ pool | previous-projects |
| `pages/ServiceAreasPage.jsx` | (Maps embed) | none |
| `pages/BlogPage.jsx` | blog cover images | previous-projects |
| `pages/BlogPostPage.jsx` | per-post cover | previous-projects |
| `pages/FinancingPage.jsx` | (none) | none |
| `pages/ThankYouPage.jsx` | optional owner video, `/owner.webp` | owner |

## Pattern selection

Background SVG patterns mount via `<BackgroundPattern motif={brandDNA.shape_motif} />` in
sections that currently carry Capstone's polygon backgrounds. Sections affected:

- Hero (subtle navy backdrop pattern)
- TrustStrip (top hairline pattern)
- WhyChooseUs (column-divider pattern)
- OurProcess (timeline rail pattern)
- CTABanner (corner accent pattern)

Pattern files at `templates/capstone/src/assets/bg-patterns/{polygon,triangle,wave,arc,dot-grid,hexagon,chevron,diamond,cross-hatch,mountain,shingle,blueprint-grid,topographic}.svg`.
