import { ServiceAreasSplit } from "@/components/service-areas/ServiceAreasSplit"
import { ServiceAreaCityGrid } from "@/components/service-areas/ServiceAreaCityGrid"
import { ServiceAreasMapRight } from "@/components/service-areas/ServiceAreasMapRight"
import { ServiceAreasDarkMap } from "@/components/service-areas/ServiceAreasDarkMap"


import type { ServiceAreasVariant } from "@/lib/component-registry"

export function ServiceAreas({
  variant = "split",
}: {
  variant?: ServiceAreasVariant
}) {
  switch (variant) {
    case "city-grid":
      return <ServiceAreaCityGrid />

    case "map-right":
      return <ServiceAreasMapRight />

    case "dark-map":
      return <ServiceAreasDarkMap />

    case "split":
    default:
      return <ServiceAreasSplit />
  }
}