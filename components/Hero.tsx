import { HeroProjectShowcase } from "@/components/hero/HeroProjectShowcase"
import { HeroOwnerAuthority } from "@/components/hero/HeroOwnerAuthority"
import { HeroCommercialAuthority } from "@/components/hero/HeroCommercialAuthority"
import { HeroTeamAuthority } from "@/components/hero/HeroTeamAuthority"
import { HeroConnectedForm } from "@/components/hero/HeroConnectedForm"
import { HeroFloatingShell } from "@/components/hero/HeroFloatingShell"
import { HeroDefault } from "@/components/hero/HeroDefault"
import {
  HeroDarkOwnerTruck,
  HeroBrightOwner,
  HeroSunsetOwnerTruck,
} from "@/components/hero/HeroConnectedOverlapVariants"

import type { HeroVariant } from "@/lib/component-registry"

export function Hero({
  variant = "project-showcase",
  overlap = false,
}: {
  variant?: HeroVariant
  /** True only when rendered by SectionRenderer on the home page, where the
   * TrustLogos band below can receive a hero-into-trust pull (spec 2.5).
   * Inner pages hard-code hero variants and never pass it, so the pull and
   * the receive always read the same signal. */
  overlap?: boolean
}) {
  switch (variant) {
    case "project-showcase":
      return <HeroProjectShowcase overlap={overlap} />

    case "owner-authority":
      return <HeroOwnerAuthority />

    case "commercial-authority":
      return <HeroCommercialAuthority overlap={overlap} />

    case "team-authority":
      return <HeroTeamAuthority />

    case "connected-form":
      return <HeroConnectedForm />

    case "floating-shell":
      return <HeroFloatingShell />

    case "dark-owner-truck":
      return <HeroDarkOwnerTruck overlap={overlap} />

    case "bright-owner":
      return <HeroBrightOwner overlap={overlap} />

    case "sunset-owner-truck":
      return <HeroSunsetOwnerTruck overlap={overlap} />

    case "default":
    default:
      return <HeroDefault />
  }
}
