import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
 * category-cards, the merchandised services default (spec 2.6).
 *
 * One card per service: a graded photo header (the Photo component carries
 * the sitewide grade and frame), the category as a caption plate, the
 * service name, a one-line hook and an arrow affordance echoing the button
 * coin hardware. Real service data + real project photos only. Zero-data
 * guards: no services renders nothing; zero photos drops the photo header
 * on EVERY card (clean icon-chip treatment instead), never a placeholder.
 */

const projectImages = siteConfig.projectImages

function cardImage(index: number): string | null {
  if (projectImages.length === 0) return null
  return projectImages[index % projectImages.length]
}

export function ServicesCategoryCards() {
  const services = siteConfig.services

  /* C1/C3 pattern slot: family-owned textures this warm-tint band with
   * shingle at whisper opacity (its one light pattern band per the C3 map).
   * Other packs get null and the band stays flat. */
  const pattern = getPatternSlot("services")

  if (services.length === 0) return null

  // Count-adaptive columns so no card is stranded alone on its own row.
  // 4 services -> 2x2 at desktop (matches the md rhythm, no orphan).
  // 3/5/6 keep the 3-up rhythm (3 = 3x1, 5 = 3+2, 6 = 3x3) - none strand a card.
  const gridCols =
    services.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"

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

        <div className={`grid gap-6 ${gridCols}`}>
          {services.map((service, index) => {
            const image = cardImage(index)

            return (
              /* A2 grid choreography: row-major card stagger (index caps at 4
               * inside Reveal, so long grids never feel sluggish). */
              <Reveal key={service.href} index={index} className="h-full">
                <Link
                  href={service.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition duration-[var(--motion-duration-base)] ease-[var(--motion-ease)] hover:-translate-y-1 hover:shadow-xl"
                >
                {image && (
                  <div className="px-3 pt-3">
                    <Photo
                      src={image}
                      alt={service.title}
                      fill
                      aspect="16/10"
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                      caption={service.category}
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {!image && (
                    <IconChip
                      name={resolveServiceIcon(service.title, service.icon)}
                      surface="light"
                      className="mb-4"
                    />
                  )}

                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>

                  <span className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-sm font-bold text-foreground">
                      Learn More
                    </span>

                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/10 text-accent transition duration-[var(--motion-duration-fast)] group-hover:bg-accent group-hover:text-[var(--color-on-accent)]"
                    >
                      <ArrowRight className="size-4 transition duration-[var(--motion-duration-fast)] group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </div>
                </Link>
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
