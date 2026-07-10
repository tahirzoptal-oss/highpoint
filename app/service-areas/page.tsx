import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { SectionHeading } from "@/components/SectionHeading"
import { CTABanner } from "@/components/CTABanner"
import { TownGrid, getMapEmbedUrl } from "@/components/service-areas/TownGrid"
import { brandDNA } from "@/lib/brand-dna"
import { serviceAreas, siteConfig } from "@/lib/site-config"
import { heroImage } from "@/lib/hero-image"
import { MapPin, ShieldCheck, Clock, Users, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: `Service Areas | ${siteConfig.city} Roofing | ${siteConfig.name}`,
  description: `${siteConfig.name} serves ${siteConfig.city} and the surrounding ${siteConfig.region}. Licensed, insured and warranty-backed roofing. Call ${siteConfig.phone}.`,
  alternates: { canonical: "/service-areas" },
}

const localReasons = [
  {
    icon: MapPin,
    title: "We Live Here",
    description: `Our base is in ${siteConfig.city}. We are not a fly-in crew chasing storms, we are your neighbors.`,
  },
  {
    icon: Clock,
    title: "Fast Response Times",
    description:
      "Because we are local, we can inspect your roof within 24 to 48 hours of your call, not weeks.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable & Reachable",
    description:
      "We do not pack up and move to the next city after a storm. Our name, our number, and our reputation stay right here.",
  },
  {
    icon: Users,
    title: "Community Invested",
    description:
      "We support local businesses, first responders, and educators. This is our community and we are here for the long haul.",
  },
]

export default function ServiceAreasPage() {
  const primary = serviceAreas.primary ?? []
  const secondary = serviceAreas.secondary ?? []
  const allCities = [...primary, ...secondary]
  const hqCity = siteConfig.address.city || siteConfig.city
  // Zero-data guard: the map panel renders ONLY with a real embed URL. No
  // key/data means the typeset TownGrid, never a "Coming Soon" placeholder.
  const mapUrl = getMapEmbedUrl()

  return (
    <>
      <PageHero
        image={heroImage("service-areas")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Service Areas" }]} />}
        eyebrow={<><MapPin className="size-4" /> {siteConfig.region}</>}
        title="Areas We Serve"
        subtitle={`Local, owner-led roofing and renovation across ${siteConfig.city} and the surrounding ${siteConfig.region}.`}
      />

      {/* Primary service area */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={`${siteConfig.city} Metro`}
            title="Our Primary Service Area"
            subtitle={`We serve homeowners across ${siteConfig.city} and the surrounding area with our full range of roofing, siding, and gutter services.`}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Always-dark chips: white / white-alpha / accent-light text only
             * (v2 contrast invariant #2). */}
            {primary.map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-primary-dark px-4 py-3 text-sm text-white/80 hover:text-white hover:border-accent/40 transition-colors"
              >
                <MapPin className="size-3.5 text-accent-light shrink-0" />
                <span>
                  {city}
                  {city === hqCity && (
                    <span className="ml-2 text-xs font-semibold text-accent-light bg-accent/15 rounded-full px-2 py-0.5">
                      HQ
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanding coverage (only if there is a secondary list) */}
      {secondary.length > 0 && (
        <section className="section-y bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent mb-3">
                  Expanding Coverage
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading text-foreground mb-6">
                  More Of {siteConfig.region} We Serve
                </h2>
                <div className="space-y-4 text-muted leading-relaxed text-lg">
                  <p>
                    {siteConfig.shortName} brings the same honest inspections, thorough
                    documentation, and quality craftsmanship to homeowners across the
                    wider {siteConfig.region} area.
                  </p>
                  <p>
                    Whether you are dealing with storm damage or planning a full roof
                    replacement, our process is the same: transparent, documented, and
                    warranty-backed.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {secondary.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-sm text-accent font-medium"
                    >
                      <MapPin className="size-3.5" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {mapUrl ? (
                <div className="aspect-square overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title={`${siteConfig.name} service area map`}
                    src={mapUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : (
                <TownGrid
                  tone={brandDNA.themeMode === "dark" ? "dark" : "light"}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why choose local */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Local Matters"
            title="Why Choose a Local Contractor?"
            subtitle={`After every major storm, out-of-state crews flood ${siteConfig.city} with door-to-door sales pitches. Here is why local is better.`}
          />

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {localReasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-border bg-card p-8 hover:border-accent/30 transition-colors"
              >
                <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <reason.icon className="size-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 font-heading">
                  {reason.title}
                </h3>
                <p className="text-muted leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full city grid */}
      <section className="section-y bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Complete Coverage"
            title="All Cities We Serve"
            subtitle="Do not see your city listed? Give us a call, we may still be able to help."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Always-dark chips: white / white-alpha / accent-light text only
             * (v2 contrast invariant #2). */}
            {allCities.map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-primary-dark px-4 py-3 text-sm text-white/80 hover:text-white hover:border-accent/40 transition-colors"
              >
                <MapPin className="size-3.5 text-accent-light shrink-0" />
                {city}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="#estimate-form"
              className="inline-flex items-center gap-2 bg-accent text-primary-dark font-bold rounded-xl py-4 px-8 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              Check Your Area
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner variant="split-form" />
    </>
  )
}
