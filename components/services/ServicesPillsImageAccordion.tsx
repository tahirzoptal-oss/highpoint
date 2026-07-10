import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"

const pillsImage: string | null =
  siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null

export function ServicesPillsImageAccordion() {
  const services = siteConfig.services

  if (services.length === 0) return null

  const categories = Array.from(
    new Set(services.map((service) => service.category || "Other Services"))
  )

  return (
    <section className="section-y bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 gap-12 items-stretch ${pillsImage ? "lg:grid-cols-2" : ""}`}>

          {/* A2 split choreography: halves slide from their own sides in the
           * directional packs, the accordion half trailing 120ms. */}
          <Reveal
            direction={pillsImage ? halfDirection("left") : "up"}
            className={pillsImage ? "reveal-follow" : ""}
          >
            <SectionHeading
              centered={false}
              eyebrow="Our Services"
              title="*Complete* roofing solutions"
              subtitle="From inspections and repairs to full replacements, we handle every part of your roofing project."
            />

            <div className="space-y-4">
              {categories.map((category, index) => {
                const categoryServices = services.filter(
                  (service) =>
                    (service.category || "Other Services") === category
                )

                return (
                  <details
                    key={category}
                    open={index === 0}
                    className="group border rounded-xl overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none p-5">
                      <span className="flex items-center justify-between gap-4 font-bold text-primary-dark">
                        {category}
                        <ChevronDown className="size-5 shrink-0 text-accent transition group-open:rotate-180" />
                      </span>
                      <span className="mt-1 block line-clamp-1 text-sm text-muted group-open:hidden">
                        {categoryServices.map((service) => service.title).join(", ")}
                      </span>
                    </summary>

                    <div className="px-5 pb-5 flex flex-wrap gap-3">
                      {categoryServices.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="px-4 py-2 rounded-full border text-sm font-medium text-primary-dark transition hover:border-accent hover:text-accent"
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </Reveal>

          {pillsImage && (
            <Reveal direction={halfDirection("right")} className="h-full">
              <Photo
                src={pillsImage}
                alt={`${siteConfig.name} roofing services`}
                fill
                className="h-full w-full min-h-[650px]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          )}

        </div>
      </div>
    </section>
  )
}
