import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { resolveServiceIcon } from "@/lib/icon-map"

export function ServicesListingGrid() {
  const services = siteConfig.services

  if (services.length === 0) return null

  const categories = Array.from(
    new Set(services.map((service) => service.category || "Other Services"))
  )

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Roofing & exterior services built around *your home*"
          subtitle={`From roof repairs and replacements to storm damage, siding and gutters, ${siteConfig.shortName} gives you one trusted team for your exterior project.`}
        />

        <div className="space-y-10">
          {categories.map((category) => {
            const categoryServices = services.filter(
              (service) => (service.category || "Other Services") === category
            )

            return (
              <div key={category}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-primary-dark">
                      {category}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {categoryServices.length} services available
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent">
                    <ShieldCheck className="size-4" />
                    Licensed & Warranty Backed
                  </span>
                </div>

                {/* A2 grid choreography: row-major card stagger. */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service, index) => (
                    <Reveal key={service.href} index={index} className="h-full">
                    <Link
                      href={service.href}
                      className="group flex h-full min-h-[118px] items-center gap-5 rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-5 transition hover:border-accent hover:bg-white hover:shadow-xl"
                    >
                      <IconChip
                        name={resolveServiceIcon(service.title, service.icon)}
                        surface="light"
                        size={48}
                      />

                      <div className="min-w-0">
                        <h4 className="text-xl font-black text-primary-dark">
                          {service.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                          {service.description}
                        </p>
                      </div>

                      <ArrowRight className="ml-auto hidden size-5 shrink-0 text-accent transition group-hover:translate-x-1 md:block" />
                    </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
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
