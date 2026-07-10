import {
  FooterAuthority,
  FooterCommercial,
  FooterFamily,
  FooterPremium,
  FooterStorm,
} from "@/components/footer/FooterVariants"

import type { FooterVariant } from "@/lib/component-registry"

export function Footer({
  variant = "authority",
}: {
  variant?: FooterVariant
}) {
  switch (variant) {
    case "commercial":
      return <FooterCommercial />
    case "family":
      return <FooterFamily />
    case "premium":
      return <FooterPremium />
    case "storm":
      return <FooterStorm />
    case "authority":
    default:
      return <FooterAuthority />
  }
}