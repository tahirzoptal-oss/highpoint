"use client"

import { type LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import { lazy, Suspense, type ComponentType } from "react"

import { isBespokeIcon, type BespokeIconName } from "@/lib/icon-map"

/* The 24 bespoke duotone glyphs (2B E1). Each is a static SVG component:
 * 24x24 viewBox, filled geometry only, class "icon-duotone", exactly two
 * fill layers (path.duo behind path.ink). globals.css supplies the inks
 * (ink = currentColor, duo = var(--icon-duo)); the chip-ink-* context
 * classes on the consumer set both. Static imports keep the primary tier
 * synchronous (no lazy flash); Lucide stays lazy as the fallback tier. */
import { IconCalendarBooking } from "@/components/icons/IconCalendarBooking"
import { IconChimney } from "@/components/icons/IconChimney"
import { IconClipboardEstimate } from "@/components/icons/IconClipboardEstimate"
import { IconDollarFinancing } from "@/components/icons/IconDollarFinancing"
import { IconHammerNail } from "@/components/icons/IconHammerNail"
import { IconHandshake } from "@/components/icons/IconHandshake"
import { IconHardHat } from "@/components/icons/IconHardHat"
import { IconHouseCheck } from "@/components/icons/IconHouseCheck"
import { IconInsulationRoll } from "@/components/icons/IconInsulationRoll"
import { IconLadder } from "@/components/icons/IconLadder"
import { IconLightningBolt } from "@/components/icons/IconLightningBolt"
import { IconMagnifierInspection } from "@/components/icons/IconMagnifierInspection"
import { IconMapPinService } from "@/components/icons/IconMapPinService"
import { IconMedalCertified } from "@/components/icons/IconMedalCertified"
import { IconPhoneCallback } from "@/components/icons/IconPhoneCallback"
import { IconRainGutter } from "@/components/icons/IconRainGutter"
import { IconRoofFlat } from "@/components/icons/IconRoofFlat"
import { IconRoofPitched } from "@/components/icons/IconRoofPitched"
import { IconShieldWarranty } from "@/components/icons/IconShieldWarranty"
import { IconShingleStack } from "@/components/icons/IconShingleStack"
import { IconSkylight } from "@/components/icons/IconSkylight"
import { IconStarReview } from "@/components/icons/IconStarReview"
import { IconStormCloudHail } from "@/components/icons/IconStormCloudHail"
import { IconTruckCrew } from "@/components/icons/IconTruckCrew"

interface IconProps extends Omit<LucideProps, "ref"> {
  name: string
  className?: string
  size?: number
}

/** Bespoke-first registry: kebab glyph name -> duotone component. */
const BESPOKE_REGISTRY: Record<BespokeIconName, ComponentType> = {
  "roof-pitched": IconRoofPitched,
  "roof-flat": IconRoofFlat,
  "shingle-stack": IconShingleStack,
  "hammer-nail": IconHammerNail,
  ladder: IconLadder,
  "house-check": IconHouseCheck,
  "storm-cloud-hail": IconStormCloudHail,
  "lightning-bolt": IconLightningBolt,
  "rain-gutter": IconRainGutter,
  chimney: IconChimney,
  skylight: IconSkylight,
  "insulation-roll": IconInsulationRoll,
  "truck-crew": IconTruckCrew,
  "hard-hat": IconHardHat,
  "clipboard-estimate": IconClipboardEstimate,
  "magnifier-inspection": IconMagnifierInspection,
  "shield-warranty": IconShieldWarranty,
  "medal-certified": IconMedalCertified,
  handshake: IconHandshake,
  "phone-callback": IconPhoneCallback,
  "calendar-booking": IconCalendarBooking,
  "dollar-financing": IconDollarFinancing,
  "map-pin-service": IconMapPinService,
  "star-review": IconStarReview,
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

/**
 * Icon: bespoke-first, Lucide-fallback.
 *
 * An exact bespoke glyph name (any casing) renders the duotone set on ANY
 * pack; the pack-tier mapping (Lucide name -> bespoke) happens in IconChip
 * so luxury-premium keeps its thin-line Lucide glyphs and modern-corporate
 * stays icon-free by pack routing. Everything else resolves against the
 * installed Lucide set (long-term that path is for the micro-utility tier
 * only: chevrons, arrows, check, phone, star, pin). Unknown names render an
 * empty sized box (the existing zero-data guard).
 */
export function Icon({ name, className, size = 24, ...props }: IconProps) {
  const kebab = toKebabCase(name)

  if (isBespokeIcon(kebab)) {
    const Glyph = BESPOKE_REGISTRY[kebab]
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 [&_svg]:h-full [&_svg]:w-full ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <Glyph />
      </span>
    )
  }

  const lucideKey = kebab as keyof typeof dynamicIconImports

  if (!dynamicIconImports[lucideKey]) {
    return <div className={className} style={{ width: size, height: size }} />
  }

  const LucideIcon = lazy(dynamicIconImports[lucideKey])

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <LucideIcon className={className} size={size} {...props} />
    </Suspense>
  )
}
