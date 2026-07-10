import { Phone, ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { TrustBadges } from "@/components/TrustBadges"
import { ContactForm } from "@/components/ContactForm"

interface HeroProps {
  headline: string
  subheadline: string
  showForm?: boolean
  showPhone?: boolean
  showLicense?: boolean
  badge?: string
}

export function Hero({
  headline,
  subheadline,
  showForm = false,
  showPhone = false,
  showLicense = true,
  badge,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary-dark pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent)_0%,_transparent_50%)] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-secondary-light)_0%,_transparent_50%)] opacity-[0.08]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showForm ? (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              {badge && (
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                  {badge}
                </span>
              )}

              {showLicense && (
                <p className="text-sm text-white/50 uppercase tracking-widest font-medium mb-3">
                  Licensed &amp; Insured, Missouri Contractor
                </p>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading text-white leading-[1.1] mb-6">
                {headline}
              </h1>

              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
                {subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <span className="size-2.5 rounded-full bg-success animate-pulse-dot" />
                  <Phone className="size-5" />
                  {siteConfig.phone}
                </a>
              </div>

              <TrustBadges variant="light" />
            </div>

            <div className="lg:mt-4">
              <ContactForm />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            {badge && (
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                {badge}
              </span>
            )}

            {showLicense && (
              <p className="text-sm text-white/50 uppercase tracking-widest font-medium mb-3">
                Licensed &amp; Insured, Missouri Contractor
              </p>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading text-white leading-[1.1] mb-6">
              {headline}
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {showPhone && (
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <span className="size-2.5 rounded-full bg-success animate-pulse-dot" />
                  <Phone className="size-5" />
                  {siteConfig.phone}
                </a>
              )}

              <a
                href="#estimate-form"
                className="inline-flex items-center justify-center gap-2 bg-accent text-primary-dark font-bold rounded-xl py-4 px-8 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
              >
                Get My Free Estimate
                <ArrowRight className="size-5" />
              </a>
            </div>

            <TrustBadges variant="light" />
          </div>
        )}
      </div>
    </section>
  )
}
