// HERO

export type HeroVariant =
  | "project-showcase"
  | "owner-authority"
  | "connected-form"
  | "commercial-authority"
  | "team-authority"
  | "dark-owner-truck"
  | "bright-owner"
  | "sunset-owner-truck"
  | "floating-shell"
  | "default"

// REVIEWS

export type ReviewsVariant =
  | "slider"
  | "marquee"
  | "wall"

// WHY CHOOSE US

export type WhyChooseUsVariant =
  | "split"
  | "accordion"
  | "timeline"
  | "icon-grid-image"
  | "accordion-image-left"
  | "timeline-image-right"
  | "benefits-background"
  | "image-overlay-dark"
  | "feature-box-overlay"
  | "bento"
  | "res-commercial"

// ABOUT

export type AboutVariant =
  | "founder-authority"
  | "owner-journey"
  | "truck-authority"
  | "content-left"
  | "image-left"
  | "overlap-card"
  | "split-image-content"
  | "image-left-clean"
  | "overlay-image"
  | "accent-bar-content"

// SERVICES

export type ServicesVariant =
  | "category-columns"
  | "listing-grid"
  | "compact-list"
  | "category-cards"
  | "accordion-image-split"
  | "brand-panel-accordion"
  | "pills-image-accordion"
  | "modern-iconbox-accordion"
  | "card-in-card"

// GALLERY

export type GalleryVariant =
  | "center-focus"
  | "mosaic-slider"
  | "filmstrip"
  | "edge-filmstrip"
  | "featured-project"
  | "grid-slider"
  | "carousel"
  | "masonry"
  | "full-width-slider"

// PROCESS

export type ProcessVariant =
  | "timeline"
  | "split-accordion"
  | "horizontal-timeline"
  | "zigzag-images"
  | "number-cards"
  | "image-split"
  | "circular"
  | "vertical-flow"

// FAQ

export type FAQVariant =
  | "accordion"
  | "side-info"
  | "centered"
  | "image-split"
  | "two-column-cta"
  | "contact-cta"

// CTA

export type CTAVariant =
  | "split-form"
  | "owner-authority"
  | "compact-form"
  | "connected-form"
  | "background-image-form"
  | "commercial-authority"
  | "closer"

// BLOG

export type BlogVariant =
  | "slider"
  | "featured"
  | "dark-cards"
  | "featured-split"
  | "magazine-grid"

// SERVICE AREAS

export type ServiceAreasVariant =
  | "split"
  | "city-grid"
  | "map-right"
  | "dark-map"

// SPECIAL OFFERS

export type SpecialOffersVariant =
  | "cards"
  | "split"
  | "banner"

export type Offer = { title: string; description: string; badge?: string; expires?: string }
export type SpecialOffersData = {
  eyebrow?: string
  heading?: string
  subheading?: string
  offers?: Offer[]
  financing?: { headline: string; body: string } | null
}

// HEADER

export type HeaderVariant =
  | "authority"
  | "commercial"
  | "center-authority"
  | "storm-response"
  | "kca-roofing"
  | "pill-float"

// FOOTER

export type FooterVariant =
  | "authority"
  | "commercial"
  | "family"
  | "premium"
  | "storm"

// MASTER REGISTRY

export const componentRegistry = {
  hero: [
    "project-showcase",
    "owner-authority",
    "connected-form",
    "commercial-authority",
    "team-authority",
     "dark-owner-truck",
 "bright-owner",
 "sunset-owner-truck",
 "floating-shell",
  ],

  reviews: [
    "slider",
    "marquee",
    "wall",
  ],

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

  gallery: [
    "center-focus",
    "mosaic-slider",
    "filmstrip",
    "edge-filmstrip",
    "featured-project",
    "grid-slider",
    "carousel",
    "masonry",
    "full-width-slider",
  ],

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

  faq: [
    "accordion",
    "side-info",
    "centered",
    "image-split",
    "two-column-cta",
    "contact-cta",
  ],

  cta: [
    "split-form",
    "owner-authority",
    "compact-form",
    "connected-form",
    "background-image-form",
    "commercial-authority",
    "closer",
  ],

  blog: [
    "slider",
    "featured",
    "dark-cards",
    "featured-split",
    "magazine-grid",
  ],

  serviceAreas: [
    "split",
    "city-grid",
    "map-right",
    "dark-map",
  ],

  specialOffers: [
    "cards",
    "split",
    "banner",
  ],

  header: [
    "authority",
    "commercial",
    "center-authority",
    "storm-response",
    "kca-roofing",
    "pill-float",
  ],

  footer: [
    "authority",
    "commercial",
    "family",
    "premium",
    "storm",
  ],
} as const