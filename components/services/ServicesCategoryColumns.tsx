import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { resolveServiceIcon } from "@/lib/icon-map"

export function ServicesCategoryColumns() {
  const services = siteConfig.services

  if (services.length === 0) return null

  const categories = Array.from(
    new Set(services.map((service) => service.category || "Other Services"))
  )

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* Slim full-width intro banner: heading + tagline on the left, the two
         * proof stats on the right. The service cards span the full width below,
         * so nothing is squeezed into a side column. */}
        <Reveal className="rounded-[var(--radius-2xl)] bg-[var(--color-surface-dark)] p-8 text-white lg:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-white/80">
                <span aria-hidden="true" className="eyebrow-mark" />
                Our Services
              </p>

              <h2 data-scale="feature" className="font-heading font-bold tracking-tight">
                Complete exterior solutions
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
                From residential roof replacements to storm restoration and exterior upgrades,
                {` ${siteConfig.shortName}`} gives you one trusted contractor for the whole project.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/65">
                <ShieldCheck className="size-5 text-white" />
                Licensed, insured and warranty-backed.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <div className="text-3xl font-black text-white">{services.length}+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/55">
                  Core Services
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <div className="text-3xl font-black text-white">{categories.length}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/55">
                  Service Categories
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Full-width service grid: each service is its OWN card (small icon in
         * the top-left next to the title, full description below), no category
         * grouping and no truncation. */}
        <Reveal className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group flex flex-col rounded-[var(--radius-2xl)] border border-black/10 bg-[var(--color-surface-light)] p-6 transition hover:border-accent hover:bg-white hover:shadow-2xl"
            >
              <div className="flex items-center gap-3.5">
                <IconChip
                  name={resolveServiceIcon(service.title, service.icon)}
                  surface="light"
                  size={48}
                />
                <h3 className="font-black leading-tight text-primary-dark transition group-hover:text-accent">
                  {service.title}
                </h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </Link>
          ))}
        </Reveal>

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
