import { ShieldCheck, Star } from "lucide-react"
import { siteConfig, owners } from "@/lib/site-config"
import { getOverlapMoments, statsCountUp } from "@/lib/design-dna"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { SectionHeading } from "@/components/SectionHeading"
import { StatNumeral } from "@/components/StatNumeral"
import { getWhyStats } from "@/components/why-choose-us/why-stats"
import { sectionPhoto } from "@/components/about/section-photo"

export function WhyChooseUsSplit() {
  const items = siteConfig.whyChooseUs
  const owner = owners[0]
  // #4: distinct WhyChooseUs slot so this photo never repeats the About photo.
  const projectImage: string | null = sectionPhoto("why")
  const ratingStars = Math.round(siteConfig.reviews.googleRating)

  /* Overlap moment "stat-badge-photo" (spec 2.5): a StatNumeral badge breaks
   * the photo's bottom-right corner via .overlap-badge-corner. It REPLACES the
   * floating quote card so the corner carries exactly one overlap element.
   * Guarded: no real stat, no badge (the quote card stays). */
  const overlapMoments: readonly string[] = getOverlapMoments()
  const stats = getWhyStats()
  const overlapStat =
    overlapMoments.includes("stat-badge-photo") && stats.length > 0 ? stats[0] : null
  // A3: count-up the badge numeral on the pack set that specifies it.
  const countUp = statsCountUp()

  if (items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-white section-y">
      {projectImage && (
        <>
          <div className="absolute left-0 top-0 h-full w-[35%] bg-[var(--color-surface-dark)]" />
          <div className="absolute left-[33%] top-0 hidden h-full w-3 rotate-[7deg] bg-accent/70 lg:block" />
        </>
      )}

      <div
        className={`relative z-10 mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:px-8 ${
          projectImage ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        {projectImage && (
          <Reveal
            direction={halfDirection("left")}
            className="relative min-h-[560px]"
          >
            <div className="absolute inset-0 shadow-2xl">
              <Photo
                src={projectImage}
                alt={`${siteConfig.name} completed roofing project`}
                fill
                scrim="bottom"
                className="h-full w-full"
                sizes="620px"
              />
            </div>

            {overlapStat ? (
              <div className="overlap-badge-corner w-max rounded-2xl bg-white p-5 shadow-2xl">
                <StatNumeral
                  value={overlapStat.value}
                  label={overlapStat.label}
                  countUp={countUp}
                  className="text-primary-dark [&_.stat-label]:text-primary-dark/60"
                />
              </div>
            ) : (
              <div className="absolute -right-8 bottom-8 w-[340px] rounded-2xl bg-white p-6 shadow-2xl">
                {ratingStars > 0 && (
                  <div className="mb-3 flex items-center gap-2 text-star">
                    {Array.from({ length: ratingStars }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                )}
                <p className="text-lg font-black leading-tight text-primary-dark">
                  Built by local owners who stand behind the work.
                </p>
                {owner && (
                  <div className="mt-4 border-t border-black/10 pt-4">
                    <div className="font-black uppercase text-primary-dark">{owner.name}</div>
                    <div className="text-sm font-semibold text-primary-dark/60">{owner.title}</div>
                  </div>
                )}
              </div>
            )}

            <div className="absolute left-6 top-6 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)]">
              {siteConfig.region} Roofing
            </div>
          </Reveal>
        )}

        <Reveal
          direction={projectImage ? halfDirection("right") : "up"}
          className={`flex flex-col justify-center ${projectImage ? "reveal-follow" : ""}`}
        >
          {/* Heading map row (spec 2.1/2.4): feature scale. The headline stays
           * stacked-left INSIDE the content column because the split header
           * would collide with the decorative dark slab behind the photo. */}
          <SectionHeading
            eyebrow="Why Choose Us"
            title={`What makes ${siteConfig.shortName} *different*`}
            subtitle="Most contractors say the same things. We built our process around clear communication, owner accountability, and work that is backed long after the job is done."
            centered={false}
            scale="feature"
          />

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              /* B3 depth: token two-layer shadow + asymmetric hover lift, on
               * top of the existing surface recolor on hover. */
              <div
                key={item.title}
                className="hover-card group relative w-full overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-5 transition hover:border-accent hover:bg-white"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-accent" />

                <div className="flex gap-4">
                  <IconChip name="circle-check" surface="light" size={48} />

                  <div>
                    <h3 className="text-lg font-black text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
              <ShieldCheck className="size-5 text-accent" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
