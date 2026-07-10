import { AboutFounderAuthority } from "./about/AboutFounderAuthority"
import { AboutOwnerJourney } from "./about/AboutOwnerJourney"
import { AboutTruckAuthority } from "./about/AboutTruckAuthority"

import { AboutContentLeft } from "./about/AboutContentLeft"
import { AboutImageLeft } from "./about/AboutImageLeft"
import { AboutOverlapCard } from "./about/AboutOverlapCard"

import { AboutSplitImageContent } from "./about/AboutSplitImageContent"
import { AboutImageLeftClean } from "./about/AboutImageLeftClean"
import { AboutOverlayImage } from "./about/AboutOverlayImage"

import { AboutAccentBarContent } from "./about/AboutAccentBarContent"

import { whyChooseUsPullsSeam } from "@/components/why-choose-us/seam"
import type { AboutVariant } from "@/lib/component-registry"

export function About({
  variant = "founder-authority",
}: {
  variant?: AboutVariant
}) {
  /* F2 receiving band: when the WhyChooseUs section above welds its photo
   * across the seam (photo-across-seam, commercial-authority/bento), the About
   * band absorbs the overshoot by padding its own top via .overlap-receive-seam
   * so the photo lands inside this band, not a neutral gap. The three variants
   * commercial-authority can resolve to (founder-authority, content-left,
   * split-image-content) accept the flag; every other pack keeps pullsSeam
   * false, so no About band ever carries dead compensation padding. */
  const receiveSeam = whyChooseUsPullsSeam()

  switch (variant) {
    case "owner-journey":
      return <AboutOwnerJourney />

    case "truck-authority":
      return <AboutTruckAuthority />

    case "content-left":
      return <AboutContentLeft receiveSeam={receiveSeam} />

    case "image-left":
      return <AboutImageLeft />

    case "overlap-card":
      return <AboutOverlapCard />

    case "split-image-content":
      return <AboutSplitImageContent receiveSeam={receiveSeam} />

    case "image-left-clean":
      return <AboutImageLeftClean />

    case "overlay-image":
      return <AboutOverlayImage />

    case "accent-bar-content":
      return <AboutAccentBarContent />

    case "founder-authority":
    default:
      return <AboutFounderAuthority receiveSeam={receiveSeam} />
  }
}