"use client"

import { useState } from "react"
import { ChevronDown, ShieldCheck, Star } from "lucide-react"
import { siteConfig, owners } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { sectionPhoto } from "@/components/about/section-photo"

export function WhyChooseUsAccordion() {
  const items = siteConfig.whyChooseUs
  const owner = owners[0]
  // #4: distinct WhyChooseUs slot so this photo never repeats the About photo.
  const projectImage: string | null = sectionPhoto("why")
  const ratingStars = Math.round(siteConfig.reviews.googleRating)
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 16%, transparent),transparent_30%)]" />

      <div
        className={`relative z-10 mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:px-8 ${
          projectImage ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        {projectImage && (
          <Reveal
            direction={halfDirection("left")}
            className="relative min-h-[580px]"
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

            <div className="absolute left-6 top-6 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)]">
              {siteConfig.region} Roofing
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/10 bg-primary-dark/80 p-6 shadow-2xl backdrop-blur-md">
              {ratingStars > 0 && (
                <div className="mb-3 flex items-center gap-2 text-star">
                  {Array.from({ length: ratingStars }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
              )}

              <p className="text-xl font-black leading-tight">
                “Built by local owners who stand behind the work.”
              </p>

              {owner && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="font-black uppercase">{owner.name}</div>
                  <div className="text-sm font-semibold text-white/55">{owner.title}</div>
                </div>
              )}
            </div>
          </Reveal>
        )}

        <Reveal
          direction={projectImage ? halfDirection("right") : "up"}
          className={`flex flex-col justify-center ${projectImage ? "reveal-follow" : ""}`}
        >
          {/* Dark band: heading map applied via the data-scale token directly.
           * SectionHeading emits light-band colors (text-foreground title,
           * text-accent eyebrow), which the v2 contrast invariant bans here. */}
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
            <span aria-hidden="true" className="eyebrow-mark" />
            Why Choose Us
          </p>

          <h2 data-scale="feature" className="mt-4 max-w-3xl font-black uppercase">
            What makes {siteConfig.shortName} different
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Clear communication, owner accountability, and roofing work that is backed long
            after the job is done.
          </p>

          <div className="mt-9 divide-y divide-white/10 border-y border-white/10">
            {items.map((item, index) => {
              const isActive = activeIndex === index

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                  className="group w-full py-5 text-left"
                >
                  <div className="flex items-center gap-5">
                    <IconChip name="circle-check" surface="dark" size={48} />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-black">{item.title}</h3>

                      {!isActive && (
                        <p className="mt-1 line-clamp-1 text-sm text-white/55">
                          {item.description}
                        </p>
                      )}

                      <div
                        className={`grid transition-all duration-300 ${
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-3 max-w-2xl leading-relaxed text-white/65">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      className={`size-5 shrink-0 text-white transition ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-white/60">
              <ShieldCheck className="size-5 text-white" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
