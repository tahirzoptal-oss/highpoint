"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ChevronDown, ShieldCheck, Star, Users } from "lucide-react"
import { services, siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"

const panelImage: string | null =
  siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null

const STAT_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
}

export function ServicesBrandPanelAccordion() {
  const [active, setActive] = useState(0)

  const { googleRating, googleCount } = siteConfig.reviews
  const yearsExperience = Number(siteConfig.founder.yearsExperience) || 0

  if (services.length === 0) return null

  const stats: { key: string; value: string; label: string; icon: "shield" | "star" | "users" }[] = []
  if (yearsExperience > 0) {
    stats.push({ key: "years", value: `${yearsExperience}+`, label: "Years Experience", icon: "shield" })
  }
  if (googleRating > 0) {
    stats.push({ key: "rating", value: googleRating.toFixed(1), label: "Google Rating", icon: "star" })
  }
  if (googleCount > 0) {
    stats.push({ key: "reviews", value: `${googleCount}+`, label: "Customer Reviews", icon: "users" })
  }

  const hasPanel = Boolean(panelImage) || stats.length > 0

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] overflow-hidden rounded-2xl bg-white shadow-2xl ${
          hasPanel ? "lg:grid-cols-[0.82fr_1.18fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        <Reveal
          direction={hasPanel ? halfDirection("left") : "up"}
          className={`p-8 md:p-12 ${hasPanel ? "reveal-follow" : ""}`}
        >
          <SectionHeading
            centered={false}
            eyebrow="Built On Trust"
            title="A team you can *count on*"
            subtitle="We treat your home like our own. Quality, integrity and customer satisfaction are our promise."
          />

          <div className="space-y-3">
            {services.slice(0, 6).map((service, index) => {
              const open = active === index

              return (
                <div key={service.title} className="overflow-hidden rounded-2xl border border-black/10">
                  <button
                    onClick={() => setActive(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block font-black text-primary-dark">{service.title}</span>
                      {!open && (
                        <span className="mt-1 block truncate text-sm font-medium text-muted">
                          {service.description}
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`size-5 shrink-0 text-accent transition ${open ? "rotate-180" : ""}`} />
                  </button>

                  {open && (
                    <div className="border-t border-black/10 px-5 py-4 text-muted">
                      <p>{service.description}</p>
                      <Link href={service.href} className="mt-3 inline-flex items-center gap-2 font-black uppercase text-accent">
                        Learn More <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        {hasPanel && (
          <Reveal
            direction={halfDirection("right")}
            className="bg-primary-dark text-white"
          >
            {panelImage && (
              <div className="px-6 pt-6">
                <Photo
                  src={panelImage}
                  alt={`${siteConfig.name} service team`}
                  fill
                  aspect="16/10"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            )}

            {stats.length > 0 && (
              <div className={`grid gap-4 p-8 text-center ${STAT_COLS[stats.length]}`}>
                {stats.map((stat) => (
                  <div key={stat.key}>
                    {stat.icon === "shield" && <ShieldCheck className="mx-auto size-7 text-white" />}
                    {stat.icon === "star" && <Star className="mx-auto size-7 fill-current text-star" />}
                    {stat.icon === "users" && <Users className="mx-auto size-7 text-white" />}
                    <div className="mt-3 text-2xl font-black">{stat.value}</div>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
