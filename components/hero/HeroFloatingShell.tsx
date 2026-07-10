import Image from "next/image"
import { CheckCircle, ShieldCheck, Zap } from "lucide-react"
import { siteConfig, owners } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { HeroReviewBadges } from "@/components/hero/HeroReviewBadges"

/**
 * HeroFloatingShell, the storm-response floating hero architecture (2B F6).
 *
 * Anatomy (V4/V5, adapted LIGHT per the locked header rule): the hero photo
 * sits inside an inset rounded container (.hero-shell) instead of full-bleed,
 * and the estimate form dock (.hero-estimate-bar) overlaps the shell's bottom
 * edge by 48px with a soft shadow. The pill nav ships as its own header variant
 * (pill-float); this component owns the shell + the estimate bar only.
 *
 * ABOVE THE FOLD: nothing here is wrapped in a Reveal. The hero photo stays the
 * priority-loaded LCP element and is never motion-gated (spec F6 LCP safety).
 * The shell is pure CSS (margins + radius via .hero-shell) so there is zero CLS
 * and zero JS on the critical path.
 *
 * All six locked CRO phrases render exactly as today; the form markup does not
 * change (ContactForm variant="hero-connected" owns #estimate-form). The
 * estimate-bar heading renders "Get My Free Estimate" verbatim and unstyled
 * (locked phrase, no knockout span).
 */
export function HeroFloatingShell() {
  const owner = owners[0]
  // Zero-data guard: a missing or placeholder hero photo renders the designed
  // gradient treatment inside the shell, never a broken image.
  const rawBg = siteConfig.hero.backgroundImage || siteConfig.projectImages[0] || ""
  const bgImage = rawBg.includes("placeholder") ? "" : rawBg

  return (
    <section className="relative z-20 bg-background pt-6 md:pt-8">
      {/* Inset rounded hero shell: the photo lives here, not full-bleed. The
       * TopBar / pill nav stay above, full width, unchanged. */}
      <div className="hero-shell relative isolate min-h-[560px] bg-[var(--color-surface-dark)] md:min-h-[620px]">
        {bgImage ? (
          <Image
            src={bgImage}
            alt={`${siteConfig.name} roofing project`}
            fill
            priority
            sizes="100vw"
            className="graded-media object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,color-mix(in srgb, var(--color-accent) 20%, transparent),transparent_38%),linear-gradient(135deg,var(--color-ink)_0%,var(--color-primary-dark)_55%,var(--color-primary)_100%)]" />
        )}

        <div aria-hidden="true" className="absolute inset-0 scrim-left" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-black/35"
        />

        <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-6 py-16 sm:px-10 md:py-20 lg:px-14">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-on-accent)]">
              <Zap className="size-4" />
              {siteConfig.hero.badge}
            </span>

            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1
              data-scale="display"
              className="mt-6 font-black uppercase tracking-tight text-white [&_.text-accent]:text-accent-light"
            >
              {renderAccent(siteConfig.hero.headline)}
            </h1>

            <p className="mt-5 max-w-xl text-lg font-semibold leading-relaxed text-white/80 md:text-xl">
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

            <div className="mt-7 max-w-md">
              <HeroReviewBadges />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                intent="phone"
                surface="dark"
                size="lg"
              >
                {siteConfig.phone}
              </Button>
              {siteConfig.license && (
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white/70">
                  <ShieldCheck className="size-4 shrink-0 text-white" />
                  {siteConfig.license}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estimate bar: overlaps the shell's bottom edge by 48px (.hero-estimate-bar
       * margin-top -48px), white card, soft shadow. Sits inside the shell's
       * horizontal inset so it reads as one floating unit. The heading is the
       * LOCKED phrase, rendered verbatim and unstyled. */}
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="hero-estimate-bar mx-auto rounded-2xl p-5 md:p-7">
          <h2 className="mb-4 text-center text-xl font-black uppercase tracking-tight text-primary-dark md:text-2xl">
            Get My Free Estimate
          </h2>

          <ContactForm variant="hero-connected" />

          {owner && (
            <p className="mt-4 text-center text-xs font-semibold text-primary-dark/60">
              {owner.name}, {owner.title}. We stand behind every roof we install.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
