import { MapPin, ShieldCheck } from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { getPatternSlot } from "@/components/pattern-slots"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { TownGrid, getMapEmbedUrl } from "@/components/service-areas/TownGrid"
import { stripAccent } from "@/lib/accent"
import { serviceAreas, siteConfig } from "@/lib/site-config"

export function ServiceAreasDarkMap() {
  const cities = [...serviceAreas.primary, ...serviceAreas.secondary]
  const mapUrl = getMapEmbedUrl()

  /* C1/C3 pattern slot: luxury-premium's one faint dark-on-dark blade-shards
   * band (the C3 map). Other packs get null and the band stays flat. */
  const pattern = getPatternSlot("serviceAreas")

  if (!cities.length) return null

  return (
    <section className="relative overflow-hidden bg-primary-dark section-y text-white">
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Service Areas
            </p>

            <h2 data-scale="utility" className="mt-4 font-black uppercase">
              {stripAccent("Local roofing service across the metro")}
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-white/65 lg:ml-auto">
            Our local team serves homeowners across {siteConfig.city} and surrounding
            communities with fast inspections and warranty-backed work.
          </p>
        </div>

        {mapUrl ? (
          /* A2 split choreography: each half slides from its own side in the
           * directional packs, the content half trailing 120ms; calm packs
           * fade up. */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal
              direction={halfDirection("left")}
              /* B6 F3c map block (sharp packs only): the octagon blade mask cuts
               * the TL + BR corners. .blade-frame is scoped to
               * html[data-corner="sharp"] in globals.css, so it is a no-op on
               * rounded packs (the rounded-2xl container stays). */
              className="blade-frame min-h-[520px] overflow-hidden rounded-2xl"
            >
              <iframe
                title={`${siteConfig.name} service area map`}
                src={mapUrl}
                className="h-[520px] w-full border-0 grayscale"
                loading="lazy"
              />
            </Reveal>

            <Reveal
              direction={halfDirection("right")}
              className="reveal-follow rounded-2xl bg-white/5 p-8"
            >
              <h3 className="text-2xl font-black uppercase">
                Areas We Serve
              </h3>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm font-bold text-white/80"
                  >
                    {/* E3 city chip: a leading map-pin roundel (meta circle,
                     * allowed by the E2 lint). White-on-dark roundel on this
                     * dark band (accent FILL only, never accent text on dark). */}
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-white"
                    >
                      <MapPin className="size-3.5" />
                    </span>
                    {city}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <ShieldCheck className="size-5 text-accent-light" />
                  {siteConfig.license}
                </div>

                <Button
                  href="#estimate-form"
                  surface="dark"
                  size="lg"
                  className="w-full"
                >
                  Get My Free Estimate
                </Button>

                <Button
                  href={`tel:${siteConfig.phoneRaw}`}
                  intent="phone"
                  surface="dark"
                  size="lg"
                  className="w-full"
                >
                  {siteConfig.phone}
                </Button>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-8">
            <h3 className="text-2xl font-black uppercase">
              Areas We Serve
            </h3>

            <TownGrid tone="dark" className="mt-6" />

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-3 text-white/70">
                <ShieldCheck className="size-5 text-accent-light" />
                {siteConfig.license}
              </span>

              <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile>
                Get My Free Estimate
              </Button>

              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                intent="phone"
                surface="dark"
                size="lg"
              >
                {siteConfig.phone}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
