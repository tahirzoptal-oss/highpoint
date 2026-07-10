import Link from "next/link"
import { ArrowRight, CheckCircle, ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"

export function ServicesCompactList() {
  const services = siteConfig.services

  if (services.length === 0) return null

  const categories = Array.from(
    new Set(services.map((service) => service.category || "Other Services"))
  )

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the category list trailing 120ms. */}
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal direction={halfDirection("left")}>
            <SectionHeading
              centered={false}
              eyebrow="Our Services"
              title="*Roofing* services & repairs"
              subtitle="Everything your roof needs, from one trusted local contractor."
            />

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
              <div className="text-4xl font-black text-primary-dark">
                {services.length}+
              </div>
              <div className="mt-1 text-xs font-black uppercase tracking-widest text-muted">
                Services Available
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Organized by category so homeowners can quickly find the right solution.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#estimate-form" surface="light" size="lg">
                Get My Free Estimate
              </Button>

              <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="light" size="lg">
                Call Now
              </Button>
            </div>
          </Reveal>

          <Reveal
            direction={halfDirection("right")}
            className="reveal-follow space-y-8"
          >
            {categories.map((category) => {
              const categoryServices = services.filter(
                (service) => (service.category || "Other Services") === category
              )

              return (
                <div key={category} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                    <h3 className="text-2xl font-black uppercase text-primary-dark">
                      {category}
                    </h3>

                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
                      <ShieldCheck className="size-4" />
                      Licensed & Warranty Backed
                    </span>
                  </div>

                  <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {categoryServices.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="group flex items-center justify-between gap-4 border-b border-black/8 py-3"
                      >
                        <span className="flex items-center gap-3 font-black text-primary-dark transition group-hover:text-accent">
                          <CheckCircle className="size-5 shrink-0 text-accent" />
                          {service.title}
                        </span>

                        <ArrowRight className="size-4 shrink-0 text-primary-dark/30 transition group-hover:translate-x-1 group-hover:text-accent" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
