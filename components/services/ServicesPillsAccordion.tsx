import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"

const pillsImage: string | null =
  siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null

export function ServicesPillsAccordion() {
  const services = siteConfig.services

  if (services.length === 0) return null

  const categories = Array.from(
    new Set(services.map((service) => service.category || "Other Services"))
  )

  return (
    <section className="section-y bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-12 items-stretch ${pillsImage ? "lg:grid-cols-2" : ""}`}>

          <div>
            <span className="text-accent font-bold uppercase tracking-[0.2em] text-sm">
              Our Services
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-black text-primary-dark">
              Complete Roofing Solutions
            </h2>

            <p className="mt-6 text-lg text-muted">
              From inspections and repairs to full replacements, we handle
              every part of your roofing project.
            </p>

            <div className="mt-10 space-y-4">
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
          </div>

          {pillsImage && (
            <Photo
              src={pillsImage}
              alt={`${siteConfig.name} roofing services`}
              fill
              className="h-full w-full min-h-[650px]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          )}

        </div>
      </div>
    </section>
  )
}
