import { siteConfig } from "@/lib/site-config"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { getPatternSlot } from "@/components/pattern-slots"
import { resolveServiceIcon } from "@/lib/icon-map"

/**
 * card-in-card, the V4 service showcase (spec F5).
 *
 * Each service is a rounded photo card (4/3, the sitewide .photo-frame + grade)
 * with a SEPARATE dark info card overlapping the photo's lower edge. Anatomy is
 * fixed by the report:
 *   - Info card pulled up by margin-top -64px, z-index 10, 16px inset each side,
 *     radius var(--radius-lg), surface var(--color-surface-dark). It carries
 *     .card-on-dark for the B3 one-luminance-step separation (a clipped/flipped
 *     dark card never takes a light-band shadow) and .hover-card for the B3
 *     lift-on-hover token pair. Text is ALWAYS white (the always-dark-card rule,
 *     AA holds regardless of theme_mode).
 *   - Contents: a 48px E2 icon chip (surface="dark" => bespoke white ink +
 *     white/35 duo on Camp A), a condensed uppercase title (the section-scoped
 *     --heading-case + client rhythm drive the case/weight; line-clamp 2), and a
 *     full-width Button min-height 48px in the pack hardware, a fixed "Learn More"
 *     CTA (never the title, which the card already shows) + the shared arrow coin.
 *     The 6 locked CRO phrases stay on the section-end CTAs, NOT on these per-card
 *     buttons.
 *   - Grid 3-up desktop, 1-up mobile, A1 row-major stagger via Reveal.
 *
 * Rounded packs only: the rounded photo card IS the device. Sharp packs keep
 * the B6 blade grammar and never route here (design-dna pools own that).
 *
 * Zero-data guards: no services renders nothing; a service with no available
 * project photo falls back to a graded brand panel behind the same overlap, so
 * the info card always has a card to overlap and no placeholder ships.
 */

const projectImages = siteConfig.projectImages

function cardImage(index: number): string | null {
  if (projectImages.length === 0) return null
  return projectImages[index % projectImages.length]
}

export function ServicesCardInCard() {
  const services = siteConfig.services

  /* C1/C3 pattern slot: family-owned textures this warm-tint band with shingle
   * at whisper opacity (its one light pattern band). Other packs get null and
   * the band stays flat. */
  const pattern = getPatternSlot("services")

  if (services.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="*Complete* roofing & restoration services"
          subtitle={`Whether you need a repair, a full roof replacement, storm restoration, siding or gutters, ${siteConfig.shortName} gives you one trusted team for the whole project.`}
        />

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const image = cardImage(index)

            return (
              /* A1 grid choreography: row-major card stagger (index caps at 4
               * inside Reveal, so long grids never feel sluggish). */
              <Reveal key={service.href} index={index} className="h-full">
                <div className="flex h-full flex-col">
                  {/* Rounded photo card: 4/3, the sitewide frame + grade. When a
                   * client has no project photos, a graded brand panel stands in
                   * so the overlap device still reads (never a placeholder image). */}
                  {image ? (
                    <Photo
                      src={image}
                      alt={service.title}
                      fill
                      aspect="4/3"
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="photo-frame relative bg-[var(--color-surface-dark)]"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  )}

                  {/* Dark info card overlapping the photo's lower edge. 16px
                   * inset each side (mx-4), pulled up -64px, above the photo. */}
                  <div className="card-on-dark hover-card relative z-10 -mt-16 mx-4 flex flex-1 flex-col rounded-[var(--radius-lg)] p-6 text-white">
                    <IconChip
                      name={resolveServiceIcon(service.title, service.icon)}
                      surface="dark"
                      size={48}
                      className="mb-4"
                    />

                    <h3 className="font-heading text-lg font-bold leading-snug">
                      <span className="line-clamp-2 block">{service.title}</span>
                    </h3>

                    <div className="mt-auto pt-6">
                      <Button
                        href={service.href}
                        surface="dark"
                        size="md"
                        className="min-h-12 w-full"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href="#estimate-form" surface="light" size="lg">
            Get My Free Estimate
          </Button>

          <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="light" size="lg">
            Call {siteConfig.phone}
          </Button>
        </div>
      </div>
    </section>
  )
}
