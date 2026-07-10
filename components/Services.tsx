import type { ReactNode } from "react"

import { ServicesCategoryColumns } from "@/components/services/ServicesCategoryColumns"
import { ServicesListingGrid } from "@/components/services/ServicesListingGrid"
import { ServicesCompactList } from "@/components/services/ServicesCompactList"
import { ServicesCategoryCards } from "@/components/services/ServicesCategoryCards"
import { ServicesCardInCard } from "@/components/services/ServicesCardInCard"

import { ServicesAccordionImageSplit } from "@/components/services/ServicesAccordionImageSplit"
import { ServicesBrandPanelAccordion } from "@/components/services/ServicesBrandPanelAccordion"
import { ServicesPillsImageAccordion } from "@/components/services/ServicesPillsImageAccordion"
import { ServicesModernIconBoxAccordion } from "@/components/services/ServicesModernIconBoxAccordion"

import type { ServicesVariant } from "@/lib/component-registry"

/**
 * Accordion budget (spec 2.6): FAQ owns the accordion pattern sitewide. A
 * services accordion variant renders only below md as the thumb-friendly
 * mobile fallback; from md up the same page shows the merchandised
 * category cards instead.
 */
function MobileAccordionFallback({ accordion }: { accordion: ReactNode }) {
  return (
    <>
      <div className="md:hidden">{accordion}</div>
      <div className="hidden md:block">
        <ServicesCategoryCards />
      </div>
    </>
  )
}

export function Services({
  variant = "category-cards",
}: {
  variant?: ServicesVariant
}) {
  switch (variant) {
    case "category-columns":
      return <ServicesCategoryColumns />

    case "listing-grid":
      return <ServicesListingGrid />

    case "compact-list":
      return <ServicesCompactList />

    case "card-in-card":
      return <ServicesCardInCard />

    case "accordion-image-split":
      return <MobileAccordionFallback accordion={<ServicesAccordionImageSplit />} />

    case "brand-panel-accordion":
      return <MobileAccordionFallback accordion={<ServicesBrandPanelAccordion />} />

    case "pills-image-accordion":
      return <MobileAccordionFallback accordion={<ServicesPillsImageAccordion />} />

    case "modern-iconbox-accordion":
      return <MobileAccordionFallback accordion={<ServicesModernIconBoxAccordion />} />

    case "category-cards":
    default:
      return <ServicesCategoryCards />
  }
}
