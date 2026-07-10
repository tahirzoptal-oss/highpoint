import { WhyChooseUsAccordion } from "@/components/why-choose-us/WhyChooseUsAccordion"
import { WhyChooseUsBento } from "@/components/why-choose-us/WhyChooseUsBento"
import { WhyChooseUsSplit } from "@/components/why-choose-us/WhyChooseUsSplit"
import { WhyChooseUsTimeline } from "@/components/why-choose-us/WhyChooseUsTimeline"
import { WhyChooseUsResCommercial } from "@/components/why-choose-us/WhyChooseUsResCommercial"

import {
  WhyChooseUsIconGridImage,
  WhyChooseUsAccordionImageLeft,
  WhyChooseUsTimelineImageRight,
  WhyChooseUsBenefitsBackground,
  WhyChooseUsImageOverlayDark,
  WhyChooseUsFeatureBoxOverlay,
} from "@/components/why-choose-us/WhyChooseUsExtraVariants"

import type { WhyChooseUsVariant } from "@/lib/component-registry"

export function WhyChooseUs({
  variant = "split",
}: {
  variant?: WhyChooseUsVariant
}) {
  switch (variant) {
    case "accordion":
      return <WhyChooseUsAccordion />

    case "bento":
      return <WhyChooseUsBento />

    case "timeline":
      return <WhyChooseUsTimeline />

    case "icon-grid-image":
      return <WhyChooseUsIconGridImage />

    case "accordion-image-left":
      return <WhyChooseUsAccordionImageLeft />

    case "timeline-image-right":
      return <WhyChooseUsTimelineImageRight />

    case "benefits-background":
      return <WhyChooseUsBenefitsBackground />

    case "image-overlay-dark":
      return <WhyChooseUsImageOverlayDark />

    case "feature-box-overlay":
      return <WhyChooseUsFeatureBoxOverlay />

    case "res-commercial":
      return <WhyChooseUsResCommercial />

    case "split":
    default:
      return <WhyChooseUsSplit />
  }
}