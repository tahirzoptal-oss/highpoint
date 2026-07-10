import Image from "next/image"
import { CheckCircle, Star, ShieldCheck, Award } from "lucide-react"
import { siteConfig, owners } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { getOverlapMoments } from "@/lib/design-dna"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { HeroReviewBadges, hasRealRating, yearsInBusiness } from "@/components/hero/HeroReviewBadges"

export function HeroProjectShowcase({ overlap = false }: { overlap?: boolean }) {
  const owner = owners[0]
  // Overlap moment (spec 2.5): the connected form bar breaks into the
  // TrustLogos band only when the resolver grants hero-into-trust AND this
  // render is the home hero (overlap prop from SectionRenderer); TrustLogos
  // pairs this with .overlap-receive, so pull and receive share one signal.
  const pullsIntoTrust = overlap && getOverlapMoments().includes("hero-into-trust")
  // Placeholder art must be impossible: a missing or placeholder owner cutout
  // renders the designed no-photo composition (project photo + credibility cards).
  const ownerCutout =
    owner?.image && !owner.image.includes("placeholder") ? owner.image : ""
  const rawBg = siteConfig.hero.backgroundImage || siteConfig.projectImages[0] || ""
  const bgImage = rawBg.includes("placeholder") ? "" : rawBg
  const rating = siteConfig.reviews.googleRating
  const showRating = hasRealRating(rating, siteConfig.reviews.googleCount)
  const ratingStars = Math.round(rating)
  const years = yearsInBusiness()

  return (
    <section className="relative z-20 overflow-visible bg-[var(--color-surface-dark)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-dark)] via-[var(--color-primary)] to-[var(--color-ink)]">
        {bgImage ? (
          <Image
            src={bgImage}
            alt={`${siteConfig.name} completed roofing project`}
            fill
            priority
            sizes="100vw"
            className="graded-media object-cover object-center"
          />
        ) : null}

        <div className="absolute inset-0 scrim-wedge" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/88 to-[var(--color-ink)]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-black/35" />

        <div className="absolute left-0 top-0 hidden h-full w-[60%] bg-[var(--color-ink)]/92 lg:block [clip-path:polygon(0_0,78%_0,88%_100%,0_100%)]" />

        <div className="absolute left-[47.5%] top-0 hidden h-full w-[10px] rotate-[11deg] bg-accent lg:block" />

        <div className="absolute left-[49%] top-0 hidden h-full w-[3px] rotate-[11deg] bg-white/25 lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1560px] flex-col px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-20 max-w-[780px] py-6">
            {(siteConfig.license || showRating || years > 0) && (
              <div className="mb-5 flex flex-wrap gap-3">
                {siteConfig.license && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-on-accent)]">
                    <ShieldCheck className="size-4" />
                    {siteConfig.license}
                  </span>
                )}

                {showRating ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                    <Award className="size-4 text-white" />
                    {rating.toFixed(1)}-Star Rated Contractor
                  </span>
                ) : years > 0 ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                    <Award className="size-4 text-white" />
                    {years}+ Years of Experience
                  </span>
                ) : null}
              </div>
            )}

            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1 data-scale="display" className="max-w-[780px] font-black uppercase tracking-tight text-white [&_.text-accent]:text-accent-light">
              {renderAccent(siteConfig.hero.headline)}
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-white/78">
              {siteConfig.hero.subheadline}
            </p>

            <ul className="mt-7 flex flex-col gap-2.5">
              {siteConfig.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                  <CheckCircle className="size-4 shrink-0 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 max-w-[620px]">
              <HeroReviewBadges />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                intent="phone"
                surface="dark"
                size="lg"
              >
                {siteConfig.phone}
              </Button>

              <span className="text-sm font-bold text-white/70">
                Fast inspections. Honest answers. No pressure.
              </span>
            </div>
          </div>

          <div className="relative hidden min-h-[560px] lg:block">
            <div className="absolute bottom-10 right-[180px] h-[520px] w-[420px] rounded-full bg-accent/15 blur-[120px]" />

            {ownerCutout && owner && (
              <div className="absolute right-[120px] bottom-0 h-[620px] w-[460px] overflow-visible">
                <Image
                  src={ownerCutout}
                  alt={owner.name}
                  fill
                  priority
                  sizes="460px"
                  className="object-contain object-bottom drop-shadow-[0_40px_90px_rgba(0,0,0,0.85)]"
                />
              </div>
            )}

            {owner && (
              <div className="absolute right-10 bottom-24 w-[300px] rounded-2xl border-t-2 border-accent/70 bg-white/95 p-5 text-primary-dark shadow-2xl backdrop-blur-md">
                <div className="text-lg font-black uppercase">{owner.name}</div>
                <div className="text-xs font-semibold text-primary-dark/65">{owner.title}</div>
                {showRating && (
                  <div className="mt-2 flex items-center gap-1 text-star">
                    {Array.from({ length: ratingStars }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {years > 0 && (
              <div className="absolute right-[430px] top-24 grid size-24 place-items-center rounded-full border-[7px] border-accent bg-black/85 text-center text-white shadow-2xl">
                <div>
                  <div className="text-2xl font-black">{years}+</div>
                  <div className="text-[8px] font-black uppercase leading-tight tracking-widest text-white">
                    Years
                    <br />
                    Experience
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`relative z-40 mx-auto w-full max-w-[var(--container-max)] rounded-2xl bg-white p-5 shadow-2xl ${
            pullsIntoTrust ? "overlap-pull-into-next" : "mb-10"
          }`}
        >
          <h2 className="mb-4 text-center text-xl font-black uppercase tracking-tight text-primary-dark">
            Get My Free Estimate
          </h2>

          <ContactForm variant="hero-connected" />
        </div>
      </div>
    </section>
  )
}
