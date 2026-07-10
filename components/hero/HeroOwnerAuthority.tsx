import Image from "next/image"
import { CheckCircle, Star, ShieldCheck } from "lucide-react"
import { siteConfig, owners } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { HeroReviewBadges, hasRealRating } from "@/components/hero/HeroReviewBadges"

export function HeroOwnerAuthority() {
  const owner = owners[0]
  // Placeholder art must be impossible: a missing or placeholder owner photo
  // falls to the designed initial-letter treatment below.
  const ownerImage =
    owner?.image && !owner.image.includes("placeholder") ? owner.image : ""
  const showRating = hasRealRating(
    siteConfig.reviews.googleRating,
    siteConfig.reviews.googleCount,
  )
  const ratingStars = Math.round(siteConfig.reviews.googleRating)

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-surface-dark)] pt-24 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in srgb, var(--color-accent) 25%, transparent),transparent_30%),linear-gradient(120deg,var(--color-ink)_0%,var(--color-primary-dark)_48%,var(--color-primary)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[720px] items-end gap-8 lg:grid-cols-[1.05fr_0.9fr_430px]">

          <div className="pb-8 lg:pb-20">
            <span className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent-light">
              {siteConfig.hero.badge}
            </span>

            {siteConfig.license && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/65">
                <ShieldCheck className="size-4 text-white" />
                {siteConfig.license}
              </div>
            )}

            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1 data-scale="display" className="mt-5 max-w-3xl font-black tracking-tight text-white [&_.text-accent]:text-accent-light">
              {renderAccent(siteConfig.hero.headline)}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              {siteConfig.hero.subheadline}
            </p>

            <ul className="mt-8 flex flex-col gap-2.5">
              {siteConfig.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                  <CheckCircle className="size-4 shrink-0 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 max-w-xl">
              <HeroReviewBadges />
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                intent="phone"
                surface="dark"
                size="lg"
              >
                {siteConfig.phone}
              </Button>
              <p className="text-sm font-semibold text-white/50">
                Speak directly with our local team.
              </p>
            </div>
          </div>

          {owner && (
            <div className="relative hidden h-[720px] self-end lg:block">
              <div className="absolute bottom-0 left-1/2 h-[640px] w-[440px] -translate-x-1/2 rounded-t-[240px] bg-accent/15 ring-1 ring-accent/25" />

              <div className="absolute bottom-0 left-1/2 h-[680px] w-[460px] -translate-x-1/2 overflow-hidden rounded-t-[240px]">
                {ownerImage ? (
                  <Image
                    src={ownerImage}
                    alt={owner.name}
                    fill
                    priority
                    sizes="460px"
                    className="graded-media object-cover object-top"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-accent/20 text-8xl font-black text-white">
                    {owner.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="absolute bottom-8 left-1/2 w-[370px] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/65 p-5 text-white shadow-2xl backdrop-blur-md">
                {showRating && (
                  <div className="flex items-center gap-2 text-star">
                    {Array.from({ length: ratingStars }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                )}
                <p className="mt-3 text-sm font-semibold text-white/85">
                  “We stand behind every roof we install.”
                </p>
                <div className="mt-4">
                  <div className="font-black">{owner.name}</div>
                  <div className="text-sm text-white/55">{owner.title}</div>
                </div>
              </div>
            </div>
          )}

          <div className="relative pb-8 lg:pb-20">
            <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <ContactForm />

              {owner && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white lg:hidden">
                  <div className="relative size-14 overflow-hidden rounded-full bg-accent/20">
                    {ownerImage ? (
                      <Image
                        src={ownerImage}
                        alt={owner.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-items-center font-bold">
                        {owner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold">{owner.name}</div>
                    <div className="text-sm text-white/60">{owner.title}</div>
                    <div className="mt-1 text-xs text-white/60">
                      We stand behind every roof we install.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
