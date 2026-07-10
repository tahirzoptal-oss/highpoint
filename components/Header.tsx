import {
  HeaderAuthority,
  HeaderCenterAuthority,
  HeaderCommercial,
  HeaderKCARoofing,
  HeaderPillFloat,
  HeaderStormResponse,
} from "@/components/header/HeaderVariants"

import type { HeaderVariant } from "@/lib/component-registry"

export function Header({
  variant = "authority",
}: {
  variant?: HeaderVariant
}) {
  switch (variant) {
    case "kca-roofing":
      return <HeaderKCARoofing />
    case "commercial":
      return <HeaderCommercial />
    case "center-authority":
      return <HeaderCenterAuthority />
    case "storm-response":
      return <HeaderStormResponse />
    case "pill-float":
      return <HeaderPillFloat />
    case "authority":
    default:
      return <HeaderAuthority />
  }
}