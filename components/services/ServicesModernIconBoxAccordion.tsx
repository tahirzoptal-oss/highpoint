import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { resolveServiceIcon } from "@/lib/icon-map"

export function ServicesModernIconBoxAccordion() {
  const services = siteConfig.services

  if (services.length === 0) return null

  return (
    <section className="section-y bg-[var(--color-surface-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">

          <Reveal
            direction={halfDirection("left")}
            className="bg-primary-dark text-white rounded-3xl p-8"
          >

            {/* Dark-surface header: heading map row applied via data-scale +
              * the shared eyebrow hardware. SectionHeading itself is not
              * dark-surface safe (accent text), so white text stays manual. */}
            <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-white/80">
              <span aria-hidden="true" className="eyebrow-mark" />
              Why Choose Us
            </p>

            <h2 data-scale="feature" className="font-heading font-bold tracking-tight">
              Built on trust, backed by experience
            </h2>

            <p className="mt-6 text-white/70">
              Professional roofing solutions delivered with honesty,
              communication and accountability.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex gap-3">
                <IconChip name="shield-check" surface="dark" size={40} />
                <div>
                  <div className="font-bold">Quality Work</div>
                  <div className="text-sm text-white/60">
                    Premium materials and installation.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <IconChip name="badge-check" surface="dark" size={40} />
                <div>
                  <div className="font-bold">Licensed &amp; Insured</div>
                  <div className="text-sm text-white/60">
                    Fully protected professionals.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <IconChip name="award" surface="dark" size={40} />
                <div>
                  <div className="font-bold">Customer Focused</div>
                  <div className="text-sm text-white/60">
                    Satisfaction comes first.
                  </div>
                </div>
              </div>

            </div>

            <Button href="#estimate-form" surface="dark" size="lg" className="mt-10">
              Get My Free Estimate
            </Button>

          </Reveal>

          <Reveal
            direction={halfDirection("right")}
            className="reveal-follow space-y-4"
          >

            {services.map((service) => (
              <details
                key={service.title}
                className="group bg-white border rounded-xl open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <IconChip
                      name={resolveServiceIcon(service.title, service.icon)}
                      surface="light"
                      size={40}
                    />

                    <div className="min-w-0">
                      <div className="font-bold text-primary-dark">{service.title}</div>
                      <p className="line-clamp-1 text-sm text-muted group-open:hidden">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <ChevronDown className="size-5 shrink-0 text-accent transition group-open:rotate-180" />
                </summary>

                <div className="px-5 pb-5 text-muted">
                  <p>{service.description}</p>
                  <Link
                    href={service.href}
                    className="mt-3 inline-flex items-center gap-2 font-bold uppercase text-accent"
                  >
                    Learn More <ArrowRight className="size-4" />
                  </Link>
                </div>
              </details>
            ))}

          </Reveal>

        </div>

      </div>
    </section>
  )
}
