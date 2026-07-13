# Capstone Template (per-client base for the website-factory pipeline)

This directory holds the canonical template that Stage 10.1 clones per client.
Refactored from `https://github.com/King-Contractor-Agency/capstoneroofing.git`. Live
reference site: `https://www.roofsbycapstone.com/`.

The template-approach pipeline pivots from "generate fresh per client" to
"clone this template + overlay brand-dna + swap assets". Layout, composition,
and components are LOCKED. Per-client variance is limited to:

- **paint** — palette CSS variables (rewritten by `scripts/inject-theme.mjs` at prebuild time)
- **copy** — every visible string (sourced from `Pipeline Data/copy/copy-deck.md`)
- **photos** — logo, hero (desktop + mobile), owner, projects, team, per-section (see PHOTO-MANIFEST.md)
- **trust badges** — looked up from `references/trust-badges/registry.json` against `brandDNA.trust_badges[].filename`
- **palette + typography** — driven by `brandDNA.palette` + `brandDNA.typography`
- **theme mode** — `brandDNA.theme_mode` ("light" | "dark", single mode, no toggle)
- **background SVG pattern** — `brandDNA.shape_motif` selects from 13 patterns in `src/assets/bg-patterns/`

Nothing else varies.

## Stack

- Vite 8 + React 19.2 + React Router v7
- Tailwind CSS 3.4 (palette mapped to CSS variables in `src/index.css`)
- Plain JavaScript, no TypeScript

## File contract

```
templates/capstone/
├── BRAND-INVENTORY.md           # full inventory of every Capstone-specific value
├── PHOTO-MANIFEST.md            # asset path contract + source pool categorisation
├── README.md                    # this file
├── package.json                 # vite + react + tailwind, prebuild hook wired
├── tailwind.config.js           # palette references CSS variables
├── vite.config.js               # standard vite + react plugin
├── index.html                   # <html data-theme-mode="light"> set by inject-theme.mjs
├── public/                      # per-client assets (logo, hero, badges, work, owner, sections, team, patterns)
├── scripts/
│   └── inject-theme.mjs         # vite prebuild hook: rewrites :root + font imports + html theme attribute
└── src/
    ├── App.jsx                  # router (11 routes)
    ├── main.jsx                 # React DOM entrypoint
    ├── index.css                # tailwind + :root palette (rewritten by prebuild)
    ├── assets/
    │   └── bg-patterns/         # 13 SVG background patterns (polygon, triangle, wave, arc, ...)
    ├── components/              # 19 components (Hero, Navbar, Footer, Reviews, Founder, etc.)
    ├── config/
    │   ├── brand-dna.js                  # per-client config (sentinel placeholders by default)
    │   ├── brand-dna.example-capstone.js # Capstone reference values for smoke test
    │   └── brand-dna.schema.json         # JSON Schema validator (Stage 10.1 enforces)
    └── pages/                   # 11 page-level components (HomePage, ContactPage, BlogPage, ...)
```

## Per-client build flow (Stage 10.1)

`tools/build-from-template.py --client "[Client Name]"`:

1. `cp -R templates/capstone/. clients/[X]/[X] Website/` (no node_modules, no dist)
2. Compose `src/config/brand-dna.js` from the client's pipeline outputs:
   - `Pipeline Data/intake/intake-form.json`
   - `Pipeline Data/research/research.json`
   - `Pipeline Data/strategy/strategy.json`
   - `Pipeline Data/copy/copy-deck.md`
   - `Pipeline Data/brand/brand-dna.json` (palette + typography + theme_mode + shape_motif + voice_register)
   - `Pipeline Data/brand-resonance/resonance.json` (optional, when Stage 7.5 has run)
3. Copy + optimise per-client assets to `public/` (see PHOTO-MANIFEST.md). Hero/owner/project/team/blog covers all WebP-ised via `tools/optimise-image.py`. Trust badges looked up from `references/trust-badges/registry.json`. Platform logos copied verbatim from `references/assets/platforms/`. Selected pattern SVG copied from `src/assets/bg-patterns/{shape_motif}.svg` to `public/patterns/{shape_motif}.svg`.
4. `cd clients/[X]/[X] Website/ && npm install --silent && npm run build`. Vite's `prebuild` hook (`scripts/inject-theme.mjs`) regenerates `:root` palette + Google Fonts imports + `<html data-theme-mode="...">` from `brand-dna.js` BEFORE `vite build` reads them.
5. Validate `dist/`:
   - `index.html` exists and contains the client's company name
   - `assets/*.css` contains the client's palette hex values
   - **Zero forbidden strings** (Capstone, Bekka, Saettone, Capstone-MN address)
   - **Zero `__REQUIRED__` sentinels** in `src/config/brand-dna.js`

## Smoke test (templatise parity)

Confirm the templatise refactor preserved Capstone's live appearance:

```sh
cd templates/capstone
cp src/config/brand-dna.example-capstone.js src/config/brand-dna.js
npm install
npm run build
npm run preview
# open http://localhost:4173 — should match https://www.roofsbycapstone.com/
```

When done, restore the placeholder version: `git checkout src/config/brand-dna.js`.

## Background pattern library

13 SVG tile patterns at `src/assets/bg-patterns/{motif}.svg`. Each is a 200x200
viewBox, uses `currentColor` so the parent's `color` prop tints it, and tiles
via `<pattern patternUnits="userSpaceOnUse">`. The `<BackgroundPattern>` component
mounts them as absolutely-positioned overlays.

| Motif | Visual | Best for |
|-------|--------|----------|
| polygon | Capstone default low-poly | Generic fallback |
| triangle | Sharp triangle grid | Commercial, industrial |
| wave | Sine wave ripples | Family, organic |
| arc | Concentric arc segments | Premium, heritage |
| dot-grid | Clean grid of dots | Tech, minimal |
| hexagon | Honeycomb | Industrial, precision |
| chevron | Forward-pointing chevrons | Action, momentum |
| diamond | Diamond tile | Precision, premium |
| cross-hatch | Diagonal cross | Craft, heritage |
| mountain | Mountain peaks | Rugged, outdoors |
| shingle | Fish-scale roof tiles | Literal roofing reference |
| blueprint-grid | Technical grid w/ dashed midlines | Engineered, technical |
| topographic | Concentric organic curves | Mapped, geographic |

To add a new motif: drop `{name}.svg` into `bg-patterns/`, add `name` to the
`enum` in `brand-dna.schema.json`, and to `VALID_MOTIFS` in `BackgroundPattern.jsx`.

## What changed from the original Capstone repo

This is a structural fork — same component shapes, same routes, same composition
order. The differences:

1. `src/config/brand-dna.js` + schema + example added (was: hardcoded JSX values)
2. `src/index.css` palette moved to CSS variables (was: hex literals in tailwind.config.js)
3. `tailwind.config.js` references CSS variables (was: hex literals)
4. `scripts/inject-theme.mjs` added (was: nothing)
5. `package.json` adds `prebuild` hook + a `validate` script (was: bare scripts)
6. `src/assets/bg-patterns/` library + `<BackgroundPattern>` component added (was: inline polygon SVGs in components)
7. Component refactor: every hardcoded brand value replaced with `brandDNA.*` references (in progress, see BRAND-INVENTORY.md)

## Origin

This template was derived from `https://github.com/King-Contractor-Agency/capstoneroofing.git` on 2026-05-11. The original Capstone Roofing site continues to be deployed at `https://www.roofsbycapstone.com/` independently of this template.
