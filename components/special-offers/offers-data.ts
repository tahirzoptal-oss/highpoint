import { siteConfig } from "@/lib/site-config"
import { designDNA, getOverlapMoments } from "@/lib/design-dna"
import { getLayout } from "@/lib/get-layout"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import type { SpecialOffersData, SpecialOffersVariant } from "@/lib/component-registry"

/**
 * Shared data guards for the SpecialOffers family (mirrors
 * components/gallery/gallery-images.ts). The offers dispatcher, the offers
 * variants and the gallery variants all consult these, so the two sides of
 * the offer-over-gallery seam can never disagree about whether the moment is
 * live, and the dispatcher and the overlap guard can never disagree about
 * which variant actually renders.
 */

export function specialOffersData(): SpecialOffersData | undefined {
  return siteConfig.specialOffers as SpecialOffersData | undefined
}

/** True when the client has real offers or financing (the zero-data guard). */
export function specialOffersRenders(): boolean {
  const so = specialOffersData()
  return (so?.offers?.length ?? 0) > 0 || Boolean(so?.financing?.headline)
}

export type ResolvedSpecialOffersVariant = "cards" | "split" | "crescendo"

/**
 * The variant that actually renders, after every routing rule (2B D2):
 *
 * 1. Zero-data guard: no real offers and no financing -> null, the section
 *    renders nothing (no placeholder promotions, ever).
 * 2. The "banner" pool entry now renders as the D2 accent crescendo band.
 *    luxury-premium keeps split instead: its signature has ZERO accent bands
 *    (the per-pack matrix row "NO accent band, split offer, gold accents").
 * 3. Sparse-cards guard (v2 invariant 8): a single offer alongside financing
 *    would leave dead cells in the cards grid, so cards routes to the
 *    balanced two-up split. The crescendo needs no such guard: its tile row
 *    is data-counted (2 facts = 2 tiles, fewer = no tiles), never filler.
 *
 * Pass the dispatcher's variant prop when there is one; parameterless calls
 * (the overlap guard below) resolve from the layout engine, which is the
 * same source SectionRenderer reads.
 */
export function resolveSpecialOffersVariant(
  variant?: SpecialOffersVariant
): ResolvedSpecialOffersVariant | null {
  if (!specialOffersRenders()) return null
  const so = specialOffersData()
  const offerCount = so?.offers?.length ?? 0
  const hasFinancing = Boolean(so?.financing?.headline)

  let v: SpecialOffersVariant = variant ?? getLayout().specialOffers
  if (v === "banner" && designDNA.pack === "luxury-premium") v = "split"
  if (v === "cards" && offerCount <= 1 && hasFinancing) v = "split"
  return v === "banner" ? "crescendo" : v
}

/**
 * Overlap moment 2.5, "offer-over-gallery": true only when the resolver
 * granted the moment for this pack AND the rendered variant is one of the
 * card anatomies (cards/split hang their card row over the seam) AND the
 * gallery has 2+ real photos. The crescendo band never hangs: it is a
 * full-bleed flat accent surface with hard cuts and no card anatomy, so
 * when it renders, the gallery side must not reserve receive padding.
 */
export function offerOverGalleryActive(): boolean {
  const resolved = resolveSpecialOffersVariant()
  return (
    getOverlapMoments().includes("offer-over-gallery") &&
    (resolved === "cards" || resolved === "split") &&
    realGalleryImages().length >= 2
  )
}
