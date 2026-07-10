import { Check, MapPin, ShieldCheck } from "lucide-react"
import { isLead } from "@/lib/lead-item"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { TownGrid, getMapEmbedUrl } from "@/components/service-areas/TownGrid"
import { renderAccent } from "@/lib/accent"
import { serviceAreas, siteConfig } from "@/lib/site-config"

export function ServiceAreasSplit() {
  const primary = serviceAreas.primary
  const secondary = serviceAreas.secondary
  const cities = [...primary, ...secondary]
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
        {renderAccent(`Serving *${siteConfig.city}* & surrounding areas`)}
      </h2>

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        We proudly provide roofing, storm damage, siding and gutter services throughout the {siteConfig.city} metro area.
      </p>
    </>
  )

  const trustLine = (
    <div className="mt-8 flex flex-wrap items-center gap-6">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/70">
        {/* E2 check-bullet: solid-circle + contrast-check standard (accent
         * circle + white check on this light band). */}
        <span className="check-bullet">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        Free Inspections
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/70">
        <ShieldCheck className="size-5 text-accent" />
        {siteConfig.license}
      </span>
    </div>
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
    <section className="relative overflow-hidden bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {mapUrl ? (
          /* A2 split choreography: halves slide from their own sides in the
           * directional packs, the text half trailing 120ms. */
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal direction={halfDirection("left")} className="reveal-follow">
              {intro}

              <div className="mt-8 flex flex-wrap gap-2.5">
                {cities.map((city, i) => (
                  <span
                    key={city}
                    className={`inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-[var(--color-surface-light)] py-1.5 pl-1.5 pr-4 text-sm font-bold text-primary-dark transition hover:border-accent hover:bg-white hover:shadow-md${isLead(i) ? " lead-chip" : ""}`}
                  >
                    {/* E3 city chip: a leading map-pin roundel (circle is a meta
                     * element, so the E2 lint allows it). Accent roundel on this
                     * light band. */}
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

              {trustLine}
              {ctas}
            </Reveal>

            <Reveal
              direction={halfDirection("right")}
              className="relative min-h-[600px] overflow-hidden rounded-2xl shadow-2xl"
            >
              <iframe
                title={`${siteConfig.name} service area map`}
                src={mapUrl}
                className="h-full min-h-[600px] w-full border-0"
                loading="lazy"
              />

              <div className="absolute left-8 top-8 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)] shadow-lg">
                {siteConfig.city} Metro
              </div>
            </Reveal>
          </div>
        ) : (
          <>
            <div className="max-w-3xl">{intro}</div>
            <TownGrid tone="light" className="mt-10" />
            {trustLine}
            {ctas}
          </>
        )}
      </div>
    </section>
  )
}
