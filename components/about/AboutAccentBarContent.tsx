import { Home, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"

export function AboutAccentBarContent() {
  return (
    <section className="bg-white section-y">
      {/* A2 split choreography: the stat rail and the content sheet slide
       * from their own sides in the directional packs, content trailing. */}
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] px-4 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <Reveal direction={halfDirection("left")}>
        <aside className="h-full rounded-2xl bg-primary-dark p-8 text-white">
          <div className="space-y-10 text-center">
            <div>
              <Home className="mx-auto size-8 text-white" />
              <div className="mt-4 text-4xl font-black">
                {siteConfig.founder.yearsExperience}+
              </div>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/55">
                Years In Business
              </p>
            </div>

            <div className="border-y border-white/10 py-10">
              <Star className="mx-auto size-8 fill-star text-star" />
              <div className="mt-4 text-4xl font-black">
                {siteConfig.reviews.googleRating.toFixed(1)}
              </div>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/55">
                Average Rating
              </p>
            </div>

            <div>
              <ShieldCheck className="mx-auto size-8 text-white" />
              <div className="mt-4 text-4xl font-black">
                {siteConfig.reviews.googleCount + siteConfig.reviews.facebookCount}+
              </div>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/55">
                Verified Reviews
              </p>
            </div>
          </div>
        </aside>
        </Reveal>

        <Reveal
          direction={halfDirection("right")}
          className="reveal-follow rounded-2xl bg-[var(--color-surface-light)] p-8 shadow-xl md:p-14"
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            About Us
          </p>

          <h2
            data-scale="feature"
            className="mt-4 max-w-3xl font-black uppercase text-primary-dark"
          >
            {renderAccent("A company built on *trust*")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-5"} max-w-3xl text-lg leading-relaxed text-muted`}
            >
              {para}
            </p>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-5">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the about link kept as the secondary action. */}
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="light" size="lg">
              Learn More About Us
            </Button>

            <div className="inline-flex items-center gap-2 font-bold text-muted">
              <ShieldCheck className="size-5 text-accent" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
