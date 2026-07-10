import { BadgeCheck, Clock, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutTruckAuthority() {
  const owner = owners[0]

  // No real project photo, no visual column. Placeholder art never ships.
  // #4: distinct About slot so this band never repeats the WhyChooseUs photo.
  const featureImage = sectionPhoto("about")

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:px-8 ${
          featureImage ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={featureImage ? halfDirection("left") : "up"}
          className={`flex flex-col justify-center ${featureImage ? "reveal-follow" : ""}`}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            Local Roofing Team
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("Built like a *local* contractor, run like a professional team")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p key={i} className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {para}
            </p>
          ))}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-5">
              <Star className="mb-4 size-6 fill-star text-star" />
              <div className="text-3xl font-black text-primary-dark">
                {siteConfig.reviews.googleRating.toFixed(1)}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-muted">Rating</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-5">
              <Clock className="mb-4 size-6 text-accent" />
              <div className="text-3xl font-black text-primary-dark">Same</div>
              <div className="text-xs font-black uppercase tracking-widest text-muted">Day Estimates</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-5">
              <BadgeCheck className="mb-4 size-6 text-accent" />
              <div className="text-3xl font-black text-primary-dark">100%</div>
              <div className="text-xs font-black uppercase tracking-widest text-muted">Local</div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the team link kept as the secondary action. */}
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="light" size="lg">
              Meet Our Team
            </Button>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
              <ShieldCheck className="size-5 text-accent" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>

        {featureImage && (
          <Reveal
            direction={halfDirection("right")}
            className="relative min-h-[560px]"
          >
            <div className="absolute inset-0">
              <Photo
                src={featureImage}
                alt={`${siteConfig.name} roofing project`}
                fill
                sizes="680px"
                scrim="bottom"
                className="h-full"
              />
            </div>

            {(owner || siteConfig.founder.quote) && (
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white p-6 shadow-2xl">
                {owner && (
                  <>
                    <div className="text-xl font-black uppercase text-primary-dark">
                      {owner.name}
                    </div>
                    <div className="text-sm font-semibold text-primary-dark/60">
                      {owner.title}
                    </div>
                  </>
                )}
                {siteConfig.founder.quote ? (
                  <p className="mt-3 leading-relaxed text-muted">
                    {siteConfig.founder.quote}
                  </p>
                ) : null}
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
