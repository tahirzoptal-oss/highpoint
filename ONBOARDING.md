# Website Factory v2, New Client Onboarding

This template renders a complete roofing site through the Design DNA engine. To
spin up a new client you change three config files, then build. The conversion
structure (section order, CRO, lead form) never changes. Only paint, content,
and section layout change per client.

## The three per-client files (the only things you edit)

1. `lib/brand-dna.ts` , the paint and the facts.
   - `palette`: every colour is a token. Set these and the whole site re-themes.
     Nothing in the components hardcodes a colour.
   - `fonts`: heading + body family names and the Google Fonts `googleHref`.
   - `themeMode`: `"light"` or `"dark"`.
   - `company`: name, shortName, phone, email, city, region, license, address.

2. `lib/design-dna.ts` , the layout choices (the engine).
   - `pack`: one of the 7 packs:
     `owner-authority`, `commercial-authority`, `family-owned`,
     `industrial-contractor`, `luxury-premium`, `storm-response`, `modern-corporate`.
   - `seed`: the client slug. Same pack + different seed = a different mix of the
     non-anchor sections, so two clients never look identical (anti-duplicate).
   - `sections` (optional): override any single section, e.g.
     `sections: { hero: "owner-authority", gallery: "masonry" }`.
     Overrides win over the pack and the seed. Allowed values per section are in
     `VARIANT_POOLS` in the same file.

3. `lib/site-config.ts` , all the content (copy, services, reviews, FAQs, blog,
   service areas, owners). This is the per-client content payload. In the full
   pipeline it is produced by the existing KCA content stages (intake , research ,
   copy). Identity fields here (name, shortName, city, phone, email) are what the
   components display, so keep them consistent with `brand-dna.company`.

## Build and preview

```
cd "templates/v2"
npm install        # first time only
npm run dev        # dev server with hot reload
# open http://localhost:3000
```

`npm run build` produces a fully static site in `out/` (static export). Deploy
`out/` to any static host (Vercel, Netlify, S3), or preview locally with any
static server, e.g. `cd out && python3 -m http.server 3000`.

## Client assets

Drop the client's images under `public/` at these paths (missing images degrade
to initials/placeholders, so the site still builds):

- `public/images/hero/` , hero background(s)
- `public/images/team/` , owner/team photos (filenames must match `site-config.owners`)
- `public/images/gallery/` , project gallery photos
- `public/images/logos/` , review/trust platform logos
- `public/images/logo.png` , client logo; `public/images/og.jpg` , social share image

Also set `site-config.website` to the production domain (drives canonical tags +
sitemap) and `site-config.leadWebhook` (or `NEXT_PUBLIC_LEAD_WEBHOOK`) to the lead
destination.

## Rules that keep it clean

- Components use theme tokens only: `bg-accent`, `bg-surface-dark`,
  `text-foreground`, `font-heading`, etc. Never hardcode a hex colour or a
  brand name in a component; put colours in `brand-dna.palette` and identity in
  `site-config`.
- No em-dashes or en-dashes in copy (global rule). Use commas or hyphens.
- The locked conversion elements (lead form, sticky CTA, section order) are not
  per-client. Leave them.

## Worked example

The repo currently ships configured as **Summit Ridge Roofing** (Denver,
`luxury-premium`) to demonstrate a non-default client. To see a different look,
change `pack` in `design-dna.ts` (try `storm-response` or `owner-authority`) and
rebuild, or swap the palette in `brand-dna.ts`.

## Not done yet (see DESIGN-DNA-V2-BUILD-PLAN.md, Phase 3 and 4)

- SEO: per-page canonical tags and LocalBusiness + FAQ JSON-LD are not wired yet
  (the homepage has titles + a sitemap/robots stub only).
- Static export (`output: export`) + the lead form posting to a webhook, for the
  same static-hosting model as v1.
- Per-pack hero imagery (owner cutout, before/after, etc.) still comes from the
  asset pipeline, which needs pack-aware additions.
- Deep content (service pages, blog bodies) is still placeholder until the content
  pipeline fills `site-config`.
