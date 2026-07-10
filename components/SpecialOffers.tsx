import { SpecialOffersCards } from "@/components/special-offers/SpecialOffersCards"
import { SpecialOffersSplit } from "@/components/special-offers/SpecialOffersSplit"
import { SpecialOffersCrescendo } from "@/components/special-offers/SpecialOffersCrescendo"
import { resolveSpecialOffersVariant } from "@/components/special-offers/offers-data"
import type { SpecialOffersVariant } from "@/lib/component-registry"

/**
 * SpecialOffers dispatcher. All routing lives in
 * resolveSpecialOffersVariant (offers-data.ts) so this switch, the offers
 * variants and the gallery overlap guard always agree:
 *   - zero-data guard: no real offers and no financing -> renders nothing
 *   - "banner" -> the D2 accent crescendo band (luxury-premium keeps split,
 *     its signature has no accent bands)
 *   - sparse cards (one offer + financing) -> the balanced two-up split
 */
export function SpecialOffers({
  variant,
}: {
  variant?: SpecialOffersVariant
}) {
  const resolved = resolveSpecialOffersVariant(variant)
  if (!resolved) return null

  switch (resolved) {
    case "split":
      return <SpecialOffersSplit />
    case "crescendo":
      return <SpecialOffersCrescendo />
    case "cards":
    default:
      return <SpecialOffersCards />
  }
}
