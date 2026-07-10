import { MapPin } from "lucide-react"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { TownGrid, getMapEmbedUrl } from "@/components/service-areas/TownGrid"
import { renderAccent } from "@/lib/accent"
import { serviceAreas, siteConfig } from "@/lib/site-config"

export function ServiceAreasMapRight() {
  const cities = [...serviceAreas.primary, ...serviceAreas.secondary]
  const mapUrl = getMapEmbedUrl()

  if (!cities.length) return null

  const intro = (
    <>
      <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
        <span aria-hidden="true" className="eyebrow-mark" />
        Service Areas
      </p>

      <h2
        data-scale="utility"
        className="mt-4 font-black uppercase text-primary-dark"
      >
        {renderAccent(`Proudly serving *${siteConfig.city}* & nearby areas`)}
      </h2>

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        We provide roofing, storm restoration, siding and gutter services
        throughout the {siteConfig.city} metro.
      </p>
    </>
  )

  const ctas = (
    <div className="mt-8 flex flex-wrap gap-4">
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
    </div>
  )

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {mapUrl ? (
          /* A2 split choreography: halves slide from their own sides in the
           * directional packs, the text half trailing 120ms. */
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal direction={halfDirection("left")} className="reveal-follow">
              {intro}

              <div className="mt-8 flex flex-wrap gap-2.5">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[var(--color-surface-light)] py-1.5 pl-1.5 pr-4 text-sm font-bold text-primary-dark"
                  >
                    {/* E3 city chip: a leading map-pin roundel (meta circle,
                     * allowed by the E2 lint). Accent roundel on this light
                     * band. */}
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 text-accent"
                    >
                      <MapPin className="size-3.5" />
                    </span>
                    {city}
                  </span>
                ))}
              </div>

              {ctas}
            </Reveal>

            <Reveal
              direction={halfDirection("right")}
              className="min-h-[560px] overflow-hidden rounded-2xl shadow-2xl"
            >
              <iframe
                title={`${siteConfig.name} service area map`}
                src={mapUrl}
                className="h-[560px] w-full border-0"
                loading="lazy"
              />
            </Reveal>
          </div>
        ) : (
          <>
            <div className="max-w-3xl">{intro}</div>
            <TownGrid tone="light" className="mt-10" />
            {ctas}
          </>
        )}
      </div>
    </section>
  )
}
