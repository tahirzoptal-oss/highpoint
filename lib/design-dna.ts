/**
 * design-dna.ts, the Design DNA engine.
 *
 * Design DNA decides WHICH section variant renders. It is separate from brand
 * DNA (paint + facts). The conversion structure (section order, CRO, content)
 * is fixed; only the visual variant of each section changes here.
 *
 * Three layers, applied in order by resolveLayout():
 *   1. pack default     , the chosen DESIGN_PACK's preset
 *   2. anti-duplicate   , seeded perturbation of the "variable" sections from
 *                          the pack-scoped PACK_POOLS so two clients on the same
 *                          pack differ structurally without breaking its signature
 *   3. per-section mix  , explicit overrides win over everything (true mixing)
 *
 * VARIANT_POOLS list ONLY the variants each dispatcher actually renders, so the
 * engine never selects an unwired variant that would silently fall to default.
 */

export type SectionKey =
  | "header"
  | "footer"
  | "hero"
  | "reviews"
  | "whyChooseUs"
  | "about"
  | "services"
  | "gallery"
  | "process"
  | "faq"
  | "cta"
  | "serviceAreas"
  | "blog"
  | "specialOffers"

export type DesignPack =
  | "owner-authority"
  | "commercial-authority"
  | "family-owned"
  | "industrial-contractor"
  | "luxury-premium"
  | "storm-response"
  | "modern-corporate"
  | "tactical-tech"
  | "editorial-monochrome"

export type Preset = Record<SectionKey, string>

/** Wired variants per section (must match each dispatcher's switch cases). */
export const VARIANT_POOLS: Record<SectionKey, readonly string[]> = {
  header: ["authority", "commercial", "center-authority", "storm-response", "kca-roofing", "pill-float"],
  footer: ["authority", "commercial", "family", "premium", "storm"],
  hero: [
    "project-showcase",
    "owner-authority",
    "commercial-authority",
    "team-authority",
    "connected-form",
    "dark-owner-truck",
    "bright-owner",
    "sunset-owner-truck",
    "floating-shell",
  ],
  reviews: ["slider", "marquee", "wall"],
  whyChooseUs: [
    "split",
    "accordion",
    "timeline",
    "icon-grid-image",
    "accordion-image-left",
    "timeline-image-right",
    "benefits-background",
    "image-overlay-dark",
    "feature-box-overlay",
    "bento",
    "res-commercial",
  ],
  about: [
    "founder-authority",
    "owner-journey",
    "truck-authority",
    "content-left",
    "image-left",
    "overlap-card",
    "split-image-content",
    "image-left-clean",
    "overlay-image",
    "accent-bar-content",
  ],
  services: [
    "category-columns",
    "listing-grid",
    "compact-list",
    "category-cards",
    "accordion-image-split",
    "brand-panel-accordion",
    "pills-image-accordion",
    "modern-iconbox-accordion",
    "card-in-card",
  ],
  gallery: ["masonry", "full-width-slider", "featured-project", "grid-slider", "carousel", "edge-filmstrip"],
  process: [
    "timeline",
    "split-accordion",
    "horizontal-timeline",
    "zigzag-images",
    "number-cards",
    "image-split",
    "circular",
    "vertical-flow",
  ],
  faq: ["accordion", "side-info", "centered", "image-split", "two-column-cta", "contact-cta"],
  cta: [
    "split-form",
    "owner-authority",
    "compact-form",
    "connected-form",
    "background-image-form",
    "commercial-authority",
    "closer",
  ],
  serviceAreas: ["split", "city-grid", "map-right", "dark-map"],
  blog: ["slider", "featured", "dark-cards", "featured-split", "magazine-grid"],
  specialOffers: ["cards", "split", "banner"],
}

/** The 7 canonical design packs (reconciled to the proposal). Every value below
 * is a wired variant present in VARIANT_POOLS. */
export const DESIGN_PACKS: Record<DesignPack, Preset> = {
  "owner-authority": {
    specialOffers: "cards",
    header: "authority",
    footer: "authority",
    hero: "owner-authority",
    reviews: "slider",
    whyChooseUs: "icon-grid-image",
    about: "truck-authority",
    services: "category-cards",
    gallery: "featured-project",
    process: "image-split",
    faq: "contact-cta",
    cta: "owner-authority",
    serviceAreas: "split",
    blog: "featured-split",
  },
  "commercial-authority": {
    specialOffers: "split",
    header: "commercial",
    footer: "commercial",
    hero: "commercial-authority",
    reviews: "marquee",
    whyChooseUs: "timeline-image-right",
    about: "founder-authority",
    services: "category-cards",
    gallery: "grid-slider",
    process: "horizontal-timeline",
    faq: "image-split",
    cta: "closer",
    serviceAreas: "map-right",
    blog: "magazine-grid",
  },
  "family-owned": {
    specialOffers: "cards",
    header: "center-authority",
    footer: "family",
    hero: "owner-authority",
    reviews: "slider",
    whyChooseUs: "accordion-image-left",
    about: "owner-journey",
    services: "category-cards",
    gallery: "carousel",
    process: "vertical-flow",
    faq: "side-info",
    cta: "owner-authority",
    serviceAreas: "split",
    blog: "featured",
  },
  "industrial-contractor": {
    specialOffers: "banner",
    header: "commercial",
    footer: "commercial",
    hero: "commercial-authority",
    reviews: "marquee",
    whyChooseUs: "image-overlay-dark",
    about: "image-left",
    services: "category-cards",
    gallery: "masonry",
    process: "number-cards",
    faq: "image-split",
    cta: "commercial-authority",
    serviceAreas: "dark-map",
    blog: "dark-cards",
  },
  "luxury-premium": {
    specialOffers: "banner",
    header: "kca-roofing",
    footer: "premium",
    hero: "project-showcase",
    reviews: "marquee",
    whyChooseUs: "feature-box-overlay",
    about: "overlay-image",
    services: "listing-grid",
    gallery: "masonry",
    process: "circular",
    faq: "centered",
    cta: "background-image-form",
    serviceAreas: "dark-map",
    blog: "dark-cards",
  },
  "storm-response": {
    specialOffers: "cards",
    // F6: the floating hero shell + the white pill nav are ONE architecture, so
    // the pack default pairs them. A real storm client renders the floating-shell
    // hero (rounded inset photo + estimate bar) UNDER the pill-float header (white
    // pill, navy links, red filled CTA), never the shell without the pill. The
    // get-layout.ts F6 coupling keeps the pair welded through owner-less reroutes
    // and any seeded/override drift; the light-header lock holds (pill is white).
    header: "pill-float",
    footer: "storm",
    hero: "floating-shell",
    reviews: "slider",
    whyChooseUs: "benefits-background",
    about: "image-left-clean",
    services: "card-in-card",
    gallery: "full-width-slider",
    process: "number-cards",
    faq: "accordion",
    cta: "closer",
    serviceAreas: "city-grid",
    blog: "slider",
  },
  "modern-corporate": {
    specialOffers: "split",
    header: "kca-roofing",
    footer: "premium",
    hero: "project-showcase",
    reviews: "marquee",
    whyChooseUs: "icon-grid-image",
    about: "split-image-content",
    services: "category-columns",
    gallery: "grid-slider",
    process: "horizontal-timeline",
    faq: "two-column-cta",
    cta: "background-image-form",
    serviceAreas: "map-right",
    blog: "magazine-grid",
  },
  // B12: dark neon-on-black young-challenger pack. Angular energy rides additive
  // blade dividers + HUD photo brackets, never the corner token (stays sharp).
  "tactical-tech": {
    specialOffers: "banner",
    header: "storm-response",
    footer: "storm",
    hero: "connected-form",
    reviews: "marquee",
    whyChooseUs: "image-overlay-dark",
    about: "accent-bar-content",
    services: "modern-iconbox-accordion",
    gallery: "edge-filmstrip",
    process: "number-cards",
    faq: "image-split",
    cta: "commercial-authority",
    serviceAreas: "dark-map",
    blog: "dark-cards",
  },
  // B13: achromatic pack. Photography + the gold star are the only colour
  // (accent_strategy=value, B10). Sharp, quiet, the premium ceiling of the corpus.
  "editorial-monochrome": {
    specialOffers: "banner",
    header: "center-authority",
    footer: "premium",
    hero: "project-showcase",
    reviews: "wall",
    whyChooseUs: "feature-box-overlay",
    about: "split-image-content",
    services: "listing-grid",
    gallery: "masonry",
    process: "circular",
    faq: "centered",
    cta: "closer",
    serviceAreas: "map-right",
    blog: "magazine-grid",
  },
}

/** Sections that carry the pack's identity. Never auto-perturbed, so a pack
 * stays recognisable. Hero + CTA are SEMI-anchors: perturbed per client (below)
 * for above-the-fold variety, but from curated pools, not the full set. */
export const ANCHOR_SECTIONS: SectionKey[] = ["header", "footer", "hero", "cta"]

/** Hero variants used for per-client perturbation. Excludes the thinnest heroes
 * (commercial-authority, team-authority) so an auto-selected hero never drops the
 * floor; get-layout.ts reroutes owner-forward picks for owner-less clients.
 * Fallback pool: packs draw their hero from PACK_POOLS[pack].hero first. */
export const HERO_PERTURB_POOL: readonly string[] = [
  "project-showcase",
  "owner-authority",
  "connected-form",
  "dark-owner-truck",
  "bright-owner",
  "sunset-owner-truck",
]

/**
 * PACK_POOLS: pack-compatible variants for the seeded anti-duplicate pass.
 * resolveLayout() perturbs VARIABLE_SECTIONS from PACK_POOLS[pack][sec]
 * (falling back to VARIANT_POOLS[sec] if a section is missing), so a seeded
 * pick can never pull a variant that breaks the pack's visual signature.
 * First entry per section = the pack's DESIGN_PACKS default. Every services
 * pool leads with a merchandised card/grid variant; accordions stay in-pool as
 * non-default options (their components render the accordion mobile-only, so
 * FAQ owns the accordion pattern on desktop).
 * Hero pools are subsets of HERO_PERTURB_POOL, curated per pack signature
 * (pack-signatures.md, 2026-07-02); the seeded hero pick draws from these.
 */
export const PACK_POOLS: Record<
  DesignPack,
  Partial<Record<SectionKey, readonly string[]>>
> = {
  "owner-authority": {
    hero: ["owner-authority", "sunset-owner-truck", "bright-owner"],
    cta: ["owner-authority", "closer", "split-form"],
    reviews: ["slider", "marquee", "wall"],
    whyChooseUs: ["icon-grid-image", "accordion-image-left", "split"],
    about: ["truck-authority", "owner-journey", "overlap-card"],
    services: ["category-cards", "pills-image-accordion", "accordion-image-split"],
    gallery: ["featured-project", "carousel", "grid-slider"],
    process: ["image-split", "vertical-flow", "timeline"],
    faq: ["contact-cta", "side-info", "accordion"],
    serviceAreas: ["split", "city-grid"],
    blog: ["featured-split", "featured", "slider"],
    specialOffers: ["cards", "split"],
  },
  "commercial-authority": {
    hero: ["project-showcase", "connected-form", "dark-owner-truck"],
    cta: ["closer", "split-form", "compact-form"],
    reviews: ["marquee", "slider"],
    whyChooseUs: ["timeline-image-right", "icon-grid-image", "res-commercial"],
    about: ["founder-authority", "content-left", "split-image-content"],
    services: ["category-cards", "category-columns", "listing-grid", "brand-panel-accordion", "card-in-card"],
    gallery: ["grid-slider", "edge-filmstrip", "masonry", "full-width-slider"],
    process: ["horizontal-timeline", "number-cards", "timeline"],
    faq: ["image-split", "two-column-cta", "accordion"],
    serviceAreas: ["map-right", "city-grid"],
    blog: ["magazine-grid", "featured-split"],
    specialOffers: ["split", "banner"],
  },
  "family-owned": {
    hero: ["owner-authority", "bright-owner", "sunset-owner-truck"],
    cta: ["owner-authority", "closer", "connected-form"],
    reviews: ["slider", "marquee", "wall"],
    whyChooseUs: ["accordion-image-left", "split", "timeline"],
    about: ["owner-journey", "founder-authority", "image-left"],
    services: ["category-cards", "pills-image-accordion", "card-in-card"],
    gallery: ["carousel", "featured-project", "masonry"],
    process: ["vertical-flow", "timeline", "zigzag-images"],
    faq: ["side-info", "accordion", "contact-cta"],
    serviceAreas: ["split", "city-grid"],
    blog: ["featured", "slider"],
    specialOffers: ["cards", "split"],
  },
  "industrial-contractor": {
    hero: ["dark-owner-truck", "project-showcase", "connected-form"],
    cta: ["commercial-authority", "background-image-form", "split-form"],
    reviews: ["marquee", "slider"],
    whyChooseUs: ["image-overlay-dark", "feature-box-overlay"],
    about: ["image-left", "accent-bar-content", "split-image-content"],
    services: ["category-cards", "category-columns", "modern-iconbox-accordion"],
    gallery: ["masonry", "edge-filmstrip", "full-width-slider", "grid-slider"],
    process: ["number-cards", "horizontal-timeline", "split-accordion"],
    faq: ["image-split", "accordion", "two-column-cta"],
    serviceAreas: ["dark-map", "city-grid"],
    blog: ["dark-cards", "magazine-grid"],
    specialOffers: ["banner", "split"],
  },
  "luxury-premium": {
    hero: ["project-showcase", "dark-owner-truck", "sunset-owner-truck"],
    cta: ["background-image-form", "commercial-authority", "split-form"],
    reviews: ["marquee", "slider"],
    whyChooseUs: ["feature-box-overlay", "image-overlay-dark", "split"],
    about: ["overlay-image", "founder-authority", "accent-bar-content"],
    services: ["listing-grid", "compact-list", "category-columns"],
    gallery: ["masonry", "featured-project", "full-width-slider"],
    process: ["circular", "horizontal-timeline", "split-accordion"],
    faq: ["centered", "accordion", "side-info"],
    serviceAreas: ["dark-map", "map-right"],
    blog: ["dark-cards", "magazine-grid"],
    specialOffers: ["banner", "split"],
  },
  "storm-response": {
    // F6: floating-shell leads (matches the DESIGN_PACKS default), so the seeded
    // hero perturbation defaults to the shell and get-layout couples the pill nav.
    // connected-form stays in-pool as the non-shell alternative (it drops the pack
    // back to the storm-response header via the get-layout F6 guard).
    hero: ["floating-shell", "connected-form", "project-showcase", "bright-owner"],
    cta: ["closer", "connected-form", "compact-form"],
    reviews: ["slider", "marquee"],
    whyChooseUs: ["benefits-background", "icon-grid-image", "accordion"],
    about: ["image-left-clean", "content-left", "image-left"],
    services: ["card-in-card", "category-cards", "modern-iconbox-accordion"],
    gallery: ["full-width-slider", "edge-filmstrip", "grid-slider", "carousel"],
    process: ["number-cards", "timeline", "horizontal-timeline"],
    faq: ["accordion", "two-column-cta", "contact-cta"],
    serviceAreas: ["city-grid", "split"],
    blog: ["slider", "featured"],
    specialOffers: ["cards", "banner"],
  },
  "modern-corporate": {
    hero: ["project-showcase", "connected-form", "sunset-owner-truck"],
    cta: ["background-image-form", "closer", "split-form"],
    reviews: ["marquee", "slider"],
    whyChooseUs: ["icon-grid-image", "timeline-image-right"],
    about: ["split-image-content", "content-left", "image-left-clean"],
    services: ["category-columns", "listing-grid", "card-in-card"],
    gallery: ["grid-slider", "masonry", "carousel"],
    process: ["horizontal-timeline", "zigzag-images", "circular"],
    faq: ["two-column-cta", "centered", "accordion"],
    serviceAreas: ["map-right", "split"],
    blog: ["magazine-grid", "featured-split"],
    specialOffers: ["split", "cards"],
  },
  "tactical-tech": {
    hero: ["connected-form", "dark-owner-truck", "project-showcase"],
    cta: ["commercial-authority", "background-image-form", "closer"],
    reviews: ["marquee", "slider"],
    whyChooseUs: ["image-overlay-dark", "feature-box-overlay"],
    about: ["accent-bar-content", "image-left", "split-image-content"],
    services: ["modern-iconbox-accordion", "card-in-card", "category-columns"],
    gallery: ["edge-filmstrip", "full-width-slider", "masonry"],
    process: ["number-cards", "horizontal-timeline"],
    faq: ["image-split", "two-column-cta", "accordion"],
    serviceAreas: ["dark-map", "city-grid"],
    blog: ["dark-cards", "magazine-grid"],
    specialOffers: ["banner", "split"],
  },
  "editorial-monochrome": {
    hero: ["project-showcase", "connected-form", "sunset-owner-truck"],
    cta: ["closer", "background-image-form", "split-form"],
    reviews: ["wall", "slider"],
    whyChooseUs: ["feature-box-overlay", "image-overlay-dark", "split"],
    about: ["split-image-content", "content-left", "image-left-clean"],
    services: ["listing-grid", "compact-list", "category-columns"],
    gallery: ["masonry", "featured-project", "full-width-slider"],
    process: ["circular", "horizontal-timeline", "vertical-flow"],
    faq: ["centered", "accordion", "side-info"],
    serviceAreas: ["map-right", "dark-map"],
    blog: ["magazine-grid", "dark-cards"],
    specialOffers: ["banner", "split"],
  },
}

/** The three sanctioned seam-breaking overlap moments (taste rule 11: 1-3 per
 * page, never more). Each names a composition device the section components
 * read, backed by the Phase 2 overlap utilities in globals.css:
 *   "hero-into-trust"    , the hero form card breaks 40-60px into the
 *                          TrustLogos band (.overlap-pull-into-next on the
 *                          hero, .overlap-receive on the trust band)
 *   "stat-badge-photo"   , a stat badge pinned over the About/WhyChooseUs
 *                          photo corner (.overlap-badge-corner)
 *   "offer-over-gallery" , the offer card crosses the gallery band edge
 *                          (.overlap-card-over-gallery)
 *   "photo-across-seam"  , (2B F2) the section photo overshoots its band
 *                          boundary 80-96px into the neighbour and welds two
 *                          bands (.overlap-photo-across-seam on the photo,
 *                          .overlap-receive-seam on the receiving band). The
 *                          Phase 4 cutout-PNG upgrade rides the same slot.
 */
export type OverlapMoment =
  | "hero-into-trust"
  | "stat-badge-photo"
  | "offer-over-gallery"
  | "photo-across-seam"

/**
 * Exactly TWO guaranteed overlap moments per pack (spec 2.5). The two-element
 * tuple type is the structural MAX-2 enforcement: adding a third entry is a
 * compile error, so no pack can ever exceed the overlap budget. Choices are
 * read off each pack's "guaranteed overlaps" signature row in
 * pack-signatures.md (2026-07-02):
 * - owner-authority: HZ/CB dock the promise form over the hero edge and pin
 *   proof cards/badge pills on the About photo composite.
 * - commercial-authority (the CRS pack, chosen deliberately): the V1/V2
 *   signature docks a full-width lead-form bar over the hero bottom edge; its
 *   second guaranteed overlap is the photo-across-seam moment (2B F2), the
 *   section photo welding two bands as a foreground object (the corpus's
 *   strongest depth cue), which answers the vision critique's "single-column
 *   stacked, no compositional tension" note directly. The offer band stays a
 *   full-accent crescendo, never a floating card.
 * - family-owned: WH's About stat chip over the offset-framed photo + the
 *   hero band-boundary break.
 * - industrial-contractor: V3/V6's grammar is band-boundary breaking; the
 *   photo-across-seam moment (2B F2) welds two bands with the section photo,
 *   replacing offer-over-gallery as its second guaranteed overlap.
 * - luxury-premium: gold stat badge over the founder portrait + the inset
 *   sheet-float seam, executed as photo-across-seam (2B F2); no loud dock on
 *   its quiet project-showcase hero.
 * - storm-response: the dark form dock over the hero edge is native to its
 *   connected-form hero; stat tiles straddle photo/card edges.
 * - modern-corporate: the widget card overlapping the hero card edge + a
 *   sheet-gutter float of the offer card over the gallery seam.
 *
 * photo-across-seam is registered per pack (2B F2); it is always a swap for an
 * existing slot, never a third entry (the two-tuple keeps the max-2 budget
 * compile-enforced). commercial-authority (the CRS pack) now carries it as its
 * second guaranteed overlap, so the CRS proof build renders the seam-welding
 * photo moment directly.
 */
const PACK_OVERLAPS: Record<DesignPack, readonly [OverlapMoment, OverlapMoment]> = {
  "owner-authority": ["hero-into-trust", "stat-badge-photo"],
  "commercial-authority": ["hero-into-trust", "photo-across-seam"],
  "family-owned": ["hero-into-trust", "stat-badge-photo"],
  "industrial-contractor": ["hero-into-trust", "photo-across-seam"],
  "luxury-premium": ["stat-badge-photo", "photo-across-seam"],
  "storm-response": ["hero-into-trust", "stat-badge-photo"],
  "modern-corporate": ["hero-into-trust", "offer-over-gallery"],
  "tactical-tech": ["hero-into-trust", "photo-across-seam"],
  "editorial-monochrome": ["stat-badge-photo", "photo-across-seam"],
}

/**
 * The guaranteed overlap moments for the current client. Deterministic per
 * design pack (same pack, same two moments) and structurally capped at 2 by
 * PACK_OVERLAPS' tuple type. Section components consult this before rendering
 * an overlap composition, so a page can never stack more than its two.
 */
export function getOverlapMoments(pack: DesignPack = designDNA.pack): string[] {
  return [...PACK_OVERLAPS[pack]]
}

/**
 * Packs whose stat numerals count up on first intersect (2B A3, spec line 61):
 * the authority/urgency packs where a ticking figure reads as designed rather
 * than gimmicky. The count-up is harmless elsewhere, but only these three are
 * specified, so consumers gate on this set instead of hardcoding true. Every
 * numeral still server-renders its final value (SEO + no-JS correct); the flag
 * only decides whether the animation runs.
 */
const COUNT_UP_PACKS: ReadonlySet<DesignPack> = new Set([
  "commercial-authority",
  "industrial-contractor",
  "storm-response",
])

/** Whether stat numerals in this client's pack animate 0 -> final (A3). */
export function statsCountUp(pack: DesignPack = designDNA.pack): boolean {
  return COUNT_UP_PACKS.has(pack)
}

/** Sections safe to auto-vary for anti-duplicate variety. */
export const VARIABLE_SECTIONS: SectionKey[] = [
  "reviews",
  "whyChooseUs",
  "about",
  "services",
  "gallery",
  "process",
  "faq",
  "serviceAreas",
  "blog",
  "specialOffers",
]

export interface DesignDNA {
  /** The chosen design pack. */
  pack: DesignPack
  /** Explicit per-section overrides (true per-section mixing). Win over all. */
  sections?: Partial<Record<SectionKey, string>>
  /** Anti-duplicate seed (e.g. the client slug). Perturbs the variable sections. */
  seed?: string
  /** Override which sections auto-vary (defaults to VARIABLE_SECTIONS). */
  vary?: SectionKey[]
}

/** Small deterministic string hash (FNV-1a). Same seed -> same layout. */
function hashStr(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function pick(pool: readonly string[], seed: string): string {
  return pool[hashStr(seed) % pool.length]
}

/**
 * Resolve a DesignDNA config to a concrete per-section variant preset.
 * Order: pack default -> seeded anti-duplicate perturbation -> explicit overrides.
 */
export function resolveLayout(dna: DesignDNA): Preset {
  const base: Preset = { ...DESIGN_PACKS[dna.pack] }

  // 2. Anti-duplicate: deterministically vary the non-anchor sections by seed,
  // from the pack-scoped pools so a seeded pick never drifts out of the pack's
  // visual signature. VARIANT_POOLS is the fallback for any missing entry.
  if (dna.seed) {
    const varySet = dna.vary ?? VARIABLE_SECTIONS
    for (const sec of varySet) {
      if (ANCHOR_SECTIONS.includes(sec)) continue
      base[sec] = pick(PACK_POOLS[dna.pack][sec] ?? VARIANT_POOLS[sec], `${dna.seed}:${sec}`)
    }
    // Above-the-fold variety: perturb hero + cta per client so two clients on the
    // same pack stop sharing an identical first impression. Both draw from the
    // pack's curated pools (each leads with the DESIGN_PACKS default, so packs
    // whose signature is the closer crescendo actually get it), never the full
    // lottery. Header + footer hold the pack identity. get-layout.ts reroutes
    // owner-forward picks for owner-less clients; explicit design-dna.sections
    // overrides win below.
    base.hero = pick(PACK_POOLS[dna.pack].hero ?? HERO_PERTURB_POOL, `${dna.seed}:hero`)
    base.cta = pick(PACK_POOLS[dna.pack].cta ?? VARIANT_POOLS.cta, `${dna.seed}:cta`)
  }

  // 3. Explicit per-section overrides always win.
  if (dna.sections) {
    for (const key of Object.keys(dna.sections) as SectionKey[]) {
      const v = dna.sections[key]
      if (v && (VARIANT_POOLS[key] as readonly string[]).includes(v)) {
        base[key] = v
      }
    }
  }

  return base
}

/**
 * The current client's Design DNA. Per-client builds replace this object.
 * Default = the Summit Ridge smoke-test (owner-led roofing company).
 */
export const designDNA: DesignDNA = {
  "pack": "commercial-authority",
  "seed": "high-point-renovation",
  "sections": {
    "hero": "project-showcase",
    "about": "content-left",
    "faq": "image-split"
  }
}
