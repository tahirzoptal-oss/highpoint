import { resolveLayout, designDNA } from "./design-dna"
import { siteConfig, owners } from "./site-config"
import type {
  HeaderVariant,
  FooterVariant,
  HeroVariant,
  ReviewsVariant,
  WhyChooseUsVariant,
  AboutVariant,
  ServicesVariant,
  GalleryVariant,
  ProcessVariant,
  FAQVariant,
  CTAVariant,
  ServiceAreasVariant,
  BlogVariant,
  SpecialOffersVariant,
} from "./component-registry"

/**
 * The concrete, per-section variant layout for this client, typed to the exact
 * variant union each dispatcher renders. The Design DNA engine validates every
 * value against VARIANT_POOLS (and the build bridge validates design-dna.json
 * before generating), so the cast below is sound: a string that survived both
 * gates is always a member of the section's union.
 */
export type ResolvedLayout = {
  header: HeaderVariant
  footer: FooterVariant
  hero: HeroVariant
  reviews: ReviewsVariant
  whyChooseUs: WhyChooseUsVariant
  about: AboutVariant
  services: ServicesVariant
  gallery: GalleryVariant
  process: ProcessVariant
  faq: FAQVariant
  cta: CTAVariant
  serviceAreas: ServiceAreasVariant
  blog: BlogVariant
  specialOffers: SpecialOffersVariant
}

/**
 * Resolve the per-section variant layout for this client. The Design DNA engine
 * (pack -> seed perturbation -> explicit overrides) does the selection; here we
 * apply a few content-aware guards that keep a section legible regardless of the
 * chosen variant.
 */
export function getLayout(): ResolvedLayout {
  const layout = resolveLayout(designDNA) as ResolvedLayout

  // Many services overflow card/column layouts; a compact list stays scannable.
  if (siteConfig.services.length > 9) layout.services = "compact-list"

  // A long review list reads better scrolling than paginated.
  if (siteConfig.reviews.items.length > 5) layout.reviews = "marquee"

  // No owners to feature -> avoid every owner-forward variant across sections.
  if ((owners?.length ?? 0) === 0) {
    layout.about = "content-left"
    const ownerHeroes = ["owner-authority", "team-authority", "dark-owner-truck", "bright-owner", "sunset-owner-truck"]
    if (ownerHeroes.includes(layout.hero)) layout.hero = "connected-form"
    if (layout.cta === "owner-authority") layout.cta = "split-form"
    if (layout.whyChooseUs === "accordion" || layout.whyChooseUs === "split") layout.whyChooseUs = "icon-grid-image"
  }

  // F6 hero/header pairing (storm-response). The floating hero shell and the
  // white pill nav are one architecture: the rounded inset hero + light estimate
  // bar only read right UNDER the floating pill, never under the dark full-width
  // storm header. resolveLayout picks them independently (hero perturbs from the
  // pack pool that carries floating-shell; header is an anchor that stays put),
  // so couple them here after the owner-less reroute has settled the hero:
  //   floating-shell hero  => force the pill-float header
  //   pill-float header without the shell hero => drop back to the storm header
  // (never ship a floating pill over a full-bleed hero).
  if (layout.hero === "floating-shell") {
    layout.header = "pill-float"
  } else if (layout.header === "pill-float") {
    layout.header = "storm-response"
  }

  // Mirror the photo between the adjacent WhyChooseUs and About sections. If both
  // place their image on the same side, the page looks lopsided; flip About to a
  // variant on the opposite side (both options work with or without an owner
  // photo). "n" = the variant has no side-by-side image (overlay/full/content).
  const whySide = WHY_IMAGE_SIDE[layout.whyChooseUs] ?? "n"
  const aboutSide = ABOUT_IMAGE_SIDE[layout.about] ?? "n"
  if (whySide !== "n" && aboutSide === whySide) {
    layout.about = whySide === "right" ? "image-left" : "content-left"
  }

  return layout
}

/** Which side each WhyChooseUs variant puts its photo on (for photo mirroring). */
const WHY_IMAGE_SIDE: Record<WhyChooseUsVariant, "left" | "right" | "n"> = {
  split: "right",
  accordion: "n",
  timeline: "n",
  "icon-grid-image": "right",
  "accordion-image-left": "left",
  "timeline-image-right": "right",
  "benefits-background": "n",
  "image-overlay-dark": "n",
  "feature-box-overlay": "n",
  bento: "n",
  "res-commercial": "n",
}

/** Which side each About variant puts its photo on (for photo mirroring). */
const ABOUT_IMAGE_SIDE: Record<AboutVariant, "left" | "right" | "n"> = {
  "founder-authority": "right",
  "owner-journey": "right",
  "truck-authority": "right",
  "content-left": "right",
  "image-left": "left",
  "overlap-card": "left",
  "split-image-content": "right",
  "image-left-clean": "left",
  "overlay-image": "n",
  "accent-bar-content": "right",
}
