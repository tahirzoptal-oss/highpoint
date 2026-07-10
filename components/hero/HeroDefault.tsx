import { CheckCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { HeroReviewBadges } from "@/components/hero/HeroReviewBadges"

export function HeroDefault() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary-dark pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent-light bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">{siteConfig.hero.badge}</span>
            {siteConfig.license && <p className="text-sm text-white/50 uppercase tracking-widest font-medium mb-3">{siteConfig.license}</p>}
            {/* Display scale (spec 2.1) via the --h1-display token; the accent
             * word renders accent-light on this dark band (spec 2.3 + v2
             * contrast invariant). */}
            <h1 data-scale="display" className="font-bold tracking-tight text-white mb-6 [&_.text-accent]:text-accent-light">{renderAccent(siteConfig.hero.headline)}</h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">{siteConfig.hero.subheadline}</p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {siteConfig.hero.bullets.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-white/90"><CheckCircle className="size-4 shrink-0 text-white" />{item}</li>)}
            </ul>
            <div className="mb-8"><HeroReviewBadges /></div>
            <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="dark" size="lg">
              {siteConfig.phone}
            </Button>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
