"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { services, siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"

const splitImage: string | null =
  siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null

export function ServicesAccordionImageSplit() {
  const [active, setActive] = useState(0)

  if (services.length === 0) return null

  return (
    <section className="bg-white section-y">
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:items-center lg:px-8 ${
          splitImage ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        <Reveal
          direction={splitImage ? halfDirection("left") : "up"}
          className={splitImage ? "reveal-follow" : ""}
        >
          <SectionHeading
            centered={false}
            eyebrow="What We Do"
            title="Our roofing *services*"
            subtitle="From minor repairs to full roof replacements, we deliver quality workmanship and reliable service you can count on."
          />

          <div className="space-y-3">
            {services.slice(0, 6).map((service, index) => {
              const open = active === index

              return (
                <div key={service.title} className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                  <button
                    onClick={() => setActive(open ? -1 : index)}
                    className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left ${
                      open ? "bg-primary-dark text-white" : "text-primary-dark"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block font-black">{service.title}</span>
                      {!open && (
                        <span className="mt-1 block truncate text-sm font-medium text-muted">
                          {service.description}
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`size-5 shrink-0 transition ${open ? "rotate-180 text-white" : "text-accent"}`} />
                  </button>

                  {open && (
                    <div className="px-6 py-5 text-muted">
                      <p>{service.description}</p>
                      <Link href={service.href} className="mt-4 inline-flex items-center gap-2 font-black uppercase text-accent">
                        Learn More <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        {splitImage && (
          <Reveal direction={halfDirection("right")}>
            <Photo
              src={splitImage}
              alt={`${siteConfig.name} roofing services`}
              fill
              aspect="4/5"
              className="min-h-[620px]"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
