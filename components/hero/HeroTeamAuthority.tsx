import { Users, CheckCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { ContactForm } from "@/components/ContactForm"
import { HeroReviewBadges } from "@/components/hero/HeroReviewBadges"

export function HeroTeamAuthority() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white font-bold uppercase tracking-widest text-xs"><Users className="size-4" /> {siteConfig.hero.badge}</div>
            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1 data-scale="display" className="mt-6 font-extrabold text-white [&_.text-accent]:text-accent-light">{renderAccent(siteConfig.hero.headline)}</h1>
            <p className="mt-6 text-xl text-white/70 max-w-2xl">{siteConfig.hero.subheadline}</p>
            <ul className="mt-8 flex flex-col gap-2.5">
              {siteConfig.hero.bullets.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-white/90"><CheckCircle className="size-4 shrink-0 text-white" />{item}</li>)}
            </ul>
            <div className="mt-8"><HeroReviewBadges /></div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
