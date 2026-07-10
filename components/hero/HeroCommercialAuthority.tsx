import Image from "next/image"
import { Building2, CheckCircle, ShieldCheck, Star } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { getOverlapMoments } from "@/lib/design-dna"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { hasRealRating, yearsInBusiness } from "@/components/hero/HeroReviewBadges"

/**
 * Commercial-authority hero. Photo-aware: when a hero image exists it carries the
 * frame under layered gradients; when none exists (common before Stage 9 hero gen)
 * it renders a DESIGNED dark treatment (gradient mesh + accent glow + blueprint
 * grid + diagonal accent), not a flat colour block. Strong type hierarchy + the
 * lead form above the fold.
 *
 * Overlap moment (spec 2.5): when the resolver grants hero-into-trust AND this
 * is the home hero (overlap prop from SectionRenderer), the form card breaks one
 * --overlap-pull into the TrustLogos band (.overlap-pull-into-next); TrustLogos
 * compensates with .overlap-receive on the same signal.
 */
export function HeroCommercialAuthority({ overlap = false }: { overlap?: boolean }) {
  const rawBg = siteConfig.hero.backgroundImage || siteConfig.projectImages[0] || ""
  // Placeholder art must be impossible: placeholder paths fall to the designed
  // dark treatment, same as no image at all.
  const bg = rawBg.includes("placeholder") ? "" : rawBg
  const rating = siteConfig.reviews.googleRating
  const showRating = hasRealRating(rating, siteConfig.reviews.googleCount)
  const stars = Math.round(rating)
  const years = yearsInBusiness()
  const pullsIntoTrust = overlap && getOverlapMoments().includes("hero-into-trust")

  return (
    /* z-20 so the pulled form card paints above the z-10 TrustLogos band. The
     * decorative glows are clipped by the background wrapper below (not the
     * section), so the card can hang across the seam without clipping. */
    <section
      className={`relative z-20 bg-[var(--color-surface-dark)] pt-28 md:pt-12 ${
        pullsIntoTrust ? "pb-0" : "pb-16 md:pb-24"
      }`}
    >
      {/* layered background: when a real photo exists it is the FOCAL POINT
       * (near-full opacity) with only a left-anchored scrim behind the headline;
       * when none exists we fall back to the designed dark treatment (mesh +
       * glow + blueprint grid + diagonal accent). */}
      <div className="absolute inset-0 overflow-hidden">
        {bg ? (
          <>
            {/* deep base so letterbox edges are never raw black */}
            <div className="absolute inset-0 bg-[var(--color-ink)]" />
            <Image src={bg} alt={`${siteConfig.name} roofing project`} fill priority sizes="100vw" className="graded-media object-cover object-center opacity-95" />
            {/* targeted readability scrim: dark on the LEFT (the copy column),
             * clearing to transparent past the midpoint so the photo/truck on
             * the right stays clean. White headline stays AA-legible on the left. */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/85 via-[var(--color-ink)]/40 to-transparent" />
            {/* faint bottom seat into the dark section base (no full wash) */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-surface-dark)]/55 to-transparent" />
          </>
        ) : (
          <>
            {/* designed dark treatment (no photo): mesh + glow + grid + diagonal */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-dark)] via-[var(--color-primary)] to-[var(--color-ink)]" />
            <div className="absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-accent/20 blur-[130px]" />
            <div className="absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-white/5 blur-[120px]" />
            <div
              className="absolute inset-0 text-white opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute right-0 top-0 hidden h-full w-[44%] bg-black/25 lg:block [clip-path:polygon(22%_0,100%_0,100%_100%,12%_100%)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-transparent" />
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          {/* When the form pulls across the seam the section drops its bottom
           * padding, so the text column carries its own. */}
          <div className={pullsIntoTrust ? "pb-16 md:pb-24" : ""}>
            <div className="mb-5 flex flex-wrap gap-3">
              {siteConfig.license && (
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-on-accent)]">
                  <ShieldCheck className="size-4" />
                  {siteConfig.license}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <Building2 className="size-4" />
                {siteConfig.hero.badge}
              </span>
            </div>

            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1 data-scale="display" className="font-black uppercase tracking-tight text-white [&_.text-accent]:text-accent-light">
              {renderAccent(siteConfig.hero.headline)}
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-white/75 md:text-xl">
              {siteConfig.hero.subheadline}
            </p>

            {/* D4: trust capsule under the subheadline, above the trust bullets.
             * Renders ONLY with real ratings (zero-data guard). Platform roundel
             * + gold stars + rating + caption, white text on the translucent ink
             * pill. */}
            {showRating && (
              <div className="trust-capsule mt-6">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/google-logo.svg"
                    alt="Google"
                    width={14}
                    height={14}
                    className="size-3.5 object-contain"
                  />
                </span>
                <span className="trust-capsule-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < stars ? "fill-current" : "fill-transparent opacity-40"}`}
                    />
                  ))}
                </span>
                <span className="text-sm font-black leading-none">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs font-medium leading-none text-white/70">
                  {siteConfig.reviews.googleCount}+ Google reviews
                </span>
              </div>
            )}

            {/* Two-up only when the count is even, else a single stacked
             * column, so an odd count never orphans an empty grid cell. */}
            <ul
              className={`mt-7 grid gap-2.5 ${
                siteConfig.hero.bullets.length % 2 === 0 ? "sm:grid-cols-2" : ""
              }`}
            >
              {siteConfig.hero.bullets.map((item) => (
                <li key={item} className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/90">
                  <CheckCircle className="size-4 shrink-0 text-white" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                intent="phone"
                surface="dark"
                size="lg"
              >
                {siteConfig.phone}
              </Button>
              {/* Years fallback only when there is no real rating; the rating
               * itself is carried by the D4 trust capsule above, not duplicated
               * here. */}
              {!showRating && years > 0 ? (
                <span className="text-sm font-bold text-white/80">
                  {years}+ years of commercial roofing experience
                </span>
              ) : null}
            </div>
          </div>

          {/* Integrated form panel (D3): NOT a floating white card. A tinted,
           * bordered panel that belongs to the hero, the mesh + photo reading
           * through it. An accent top-hairline welds it into the hero's accent
           * language; a soft accent glow seats it in the composition. The form
           * itself (hero-integrated variant) carries the accent-word heading,
           * the trailing input glyphs, and every locked phrase verbatim.
           *
           * The column stays vertically centred in the grid (items-center); when
           * the resolver grants hero-into-trust it also breaks one --overlap-pull
           * into the TrustLogos band via .overlap-pull-into-next. */}
          <div
            className={`flex flex-col items-end gap-4 ${
              pullsIntoTrust ? "overlap-pull-into-next" : ""
            }`}
          >
            <div className="relative w-full">
              <div className="pointer-events-none absolute -inset-3 rounded-[calc(var(--radius-2xl)+0.75rem)] bg-accent/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-white/15 bg-[var(--color-ink)]/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                {/* accent top-hairline: the seam that connects the panel to the hero */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
                <ContactForm variant="hero-integrated" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
