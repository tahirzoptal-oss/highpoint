import { ArrowRight, ShieldCheck } from "lucide-react"
import { isLead } from "@/lib/lead-item"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { serviceAreas, siteConfig } from "@/lib/site-config"
import { getMapEmbedUrl } from "@/components/service-areas/TownGrid"

export function ServiceAreaCityGrid() {
  const cities = serviceAreas.primary
  const mapUrl = getMapEmbedUrl()

  if (!cities.length) return null

  /* Sparse-data guard: a 4-col grid orphans a lonely trailing card when the
   * count leaves 1 over (5, 9...). Drop to 3 cols so the last row grows past a
   * single stranded card. Otherwise keep the wider 4-col rhythm. */
  const cols = cities.length % 4 === 1 ? 3 : 4
  const lgCols = cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"

  /* A count of 13, 25 ... strands one card again even at 3 cols (13 % 3 === 1):
   * both column choices leave a lone last-row card. Rather than a wider grid
   * (4 is the cap) or a dead filler cell (a placeholder card is banned), center
   * that final card in the middle column so it never reads as stranded. The
   * offset is lg-only, so the sm 2-col stack (never orphaned) is untouched, and
   * it shifts an existing card (no new cell), so there is no layout shift. */
  const centerLastCard = cities.length >= 2 && cities.length % cols === 1

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Service Areas"
          title={`Roofing services across *${siteConfig.city}*`}
          subtitle={`We proudly serve homeowners throughout the ${siteConfig.city} metro area with roofing, siding, gutters and storm restoration.`}
          scale="utility"
        />

        {/* Service-area map (keyless embed). Renders only when the per-client
         * config carries a real embed URL (getMapEmbedUrl guard), so a client
         * without one keeps the pure city-card grid. */}
        {mapUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 shadow-2xl">
            <iframe
              title={`${siteConfig.name} service area map`}
              src={mapUrl}
              className="h-[420px] w-full border-0"
              loading="lazy"
            />
          </div>
        )}

        {/* A2 grid choreography: row-major city-card stagger. */}
        <div className={`${mapUrl ? "mt-10 " : ""}grid gap-4 sm:grid-cols-2 ${lgCols}`}>
          {cities.map((city, index) => (
            <Reveal
              key={city}
              index={index}
              /* B3 depth: token two-layer shadow + asymmetric hover lift. B6:
               * .blade-card notches the service-area card TL+BR under sharp
               * corner mode (no-op elsewhere; the hairline border it takes there
               * replaces the clipped shadow). The lone trailing card (when the
               * count strands one at 3 cols) is nudged to the middle column on
               * lg so it sits centred, not stranded at the left edge. */
              className={`hover-card blade-card group h-full rounded-2xl border border-black/10 bg-white p-6 transition hover:border-accent${
                isLead(index) ? " lead-frame" : ""
              }${
                centerLastCard && index === cities.length - 1 ? " lg:col-start-2" : ""
              }`}
            >
              <IconChip name="MapPin" surface="light" className="mb-5" />

              <h3 className="text-xl font-black text-primary-dark">
                {city}
              </h3>

              {/* #26 no per-city body copy is available here (only the city
               * name), so the identical repeated description line is dropped
               * rather than echoed on every card. */}

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-accent">
                View Area
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>

          <Button
            href={`tel:${siteConfig.phoneRaw}`}
            intent="phone"
            surface="light"
            size="lg"
          >
            Call Now
          </Button>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
            <ShieldCheck className="size-5 text-accent" />
            {siteConfig.license}
          </span>
        </div>
      </div>
    </section>
  )
}
