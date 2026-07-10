import { Star, Quote } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { brandDNA } from "@/lib/brand-dna"
import { statsCountUp } from "@/lib/design-dna"
import { Button } from "@/components/Button"
import { SectionHeading } from "@/components/SectionHeading"
import { StatNumeral } from "@/components/StatNumeral"
import { FeaturedPullQuote } from "@/components/reviews/FeaturedPullQuote"
import {
  getReviewStatChips,
  qualifiedReviewSources,
} from "@/components/reviews/stat-chips"

const PLATFORM_LOGOS: Record<string, string> = {
  Google: "/images/google-logo.svg",
  Facebook: "/images/facebook-logo.svg",
  BBB: "/images/bbb-logo.svg",
}

function RatingStars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  const filled = Math.round(rating)
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${i <= filled ? "fill-current" : "fill-transparent opacity-30"}`}
        />
      ))}
    </span>
  )
}

export function ReviewsMarquee() {
  const reviews = siteConfig.reviews.items
  const loopReviews = [...reviews, ...reviews, ...reviews]
  const { googleRating, facebookRating } = siteConfig.reviews
  const isDark = brandDNA.themeMode === "dark"
  const chips = getReviewStatChips()
  const sources = qualifiedReviewSources()
  // A3: count-up the review stat numerals only on the pack set that specifies it
  // (commercial-authority / industrial-contractor / storm-response). Each numeral
  // still server-renders its final value; the flag only runs the animation.
  const countUp = statsCountUp()

  // Only claim the platforms that actually have review volume behind them.
  const ratedLine =
    sources.length === 2
      ? `Rated ${googleRating.toFixed(1)} stars across Google and Facebook by ${siteConfig.city} homeowners.`
      : sources[0] === "Google"
        ? `Rated ${googleRating.toFixed(1)} stars on Google by ${siteConfig.city} homeowners.`
        : sources[0] === "Facebook"
          ? `Rated ${facebookRating.toFixed(1)} stars on Facebook by ${siteConfig.city} homeowners.`
          : `Real reviews from ${siteConfig.city} homeowners.`

  return (
    <>
      {/* E3 visceral social-proof moment: ONE large real-review pull-quote at
       * feature scale, its own light band above the ticker. Zero-data guarded
       * inside the component, so it self-hides when the client has no reviews. */}
      <FeaturedPullQuote />

      <section className="surface-band overflow-hidden bg-[var(--color-surface)] section-y text-foreground">
        <div className="mx-auto max-w-[var(--container-max)] px-4 text-center sm:px-6 lg:px-8">
        {/* Heading map row (spec 2.1/2.4): Reviews = feature scale, centered
         * over the card grid. */}
        <SectionHeading
          eyebrow="Customer Reviews"
          title={`Homeowners *trust* ${siteConfig.shortName}`}
          subtitle={ratedLine}
          scale="feature"
          layout="centered"
        />

        {chips.length > 0 && (
          <div className="flex flex-wrap items-stretch justify-center gap-4">
            {chips.map((chip) => (
              <div
                key={chip.kind}
                /* #20: each chip is a centered flex column and the row stretches
                 * them to a shared height, so a stars-only chip, a numeral chip
                 * and a license chip share one vertical baseline. */
                className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-white px-6 py-4 shadow-sm"
              >
                {chip.kind === "google-rating" && chip.rating !== undefined && (
                  <div className="flex justify-center text-star">
                    <RatingStars rating={chip.rating} />
                  </div>
                )}
                {chip.kind === "license" ? (
                  /* License strings are credentials, not numerals; small
                   * treatment, keyed to the WHITE chip card, never the theme.
                   * #3: a generic license is self-describing, so its caption is
                   * empty and only the single value line renders (no duplicate). */
                  <>
                    <div className="text-lg font-black text-primary-dark">{chip.value}</div>
                    {chip.label && (
                      <div className="text-xs uppercase tracking-widest text-primary-dark/70">
                        {chip.label}
                      </div>
                    )}
                  </>
                ) : (
                  /* Stats render as designed typography (spec 2.2). Colors key
                   * to the white chip card via the wrapper and the .stat-label
                   * hook, never the theme. */
                  <StatNumeral
                    value={chip.value}
                    label={chip.label}
                    countUp={countUp}
                    className={`${chip.kind === "google-rating" ? "mt-1 " : ""}${
                      chip.kind === "google-count" || chip.kind === "facebook-count"
                        ? "text-accent"
                        : "text-primary-dark"
                    } [&_.stat-label]:text-primary-dark/70`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-14 overflow-hidden">
        <div className="flex w-max animate-review-marquee gap-6">
          {loopReviews.map((review, index) => (
            <article
              key={`${review.reviewer}-${index}`}
              /* B3 depth: token-based two-layer card shadow (the marquee loops
               * the set, so no single card flips; B4 stays out of the ticker).
               * #14: on a ~390px phone a fixed 420px card overran the viewport and
               * clipped BOTH neighbours mid-word. Size to ~90vw on mobile so one
               * card reads with a small single-side peek; caps at 420px on wider
               * screens. */
              className="hover-card w-[90vw] max-w-[420px] shrink-0 rounded-2xl border border-black/5 bg-white p-7 sm:w-[420px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {PLATFORM_LOGOS[review.platform] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={PLATFORM_LOGOS[review.platform]}
                        alt={`${review.platform} review`}
                        width={18}
                        height={18}
                        className="size-[18px] object-contain"
                      />
                    )}
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                      {review.platform} Review
                    </span>
                  </div>
                  <div className="mt-2 flex text-star">
                    <RatingStars rating={review.rating} />
                  </div>
                </div>
                {/* E3 quote medallion: the tokenized .quote-medallion (ink
                 * circle, white double-quote glyph), replacing the old faint
                 * text-accent/20 Quote so the marquee card carries the same
                 * corpus testimonial mark the TestimonialCard uses. The ticker
                 * loops the set (no B4 flip in the marquee), so the ink fill
                 * stays; the glyph is decorative (aria-hidden), the review text
                 * carries the meaning. */}
                <span aria-hidden="true" className="quote-medallion">
                  <Quote className="size-6 fill-current" />
                </span>
              </div>

              <p className="mt-5 min-h-[120px] text-lg font-medium leading-relaxed text-primary-dark/85">
                “{review.quote}”
              </p>

              <div className="mt-6 border-t border-black/10 pt-5">
                <div className="font-black text-primary-dark">{review.reviewer}</div>
                <div className="text-sm text-primary-dark/60">{review.location}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* #12: single review CTA. SeeAllReviews (rendered by Reviews.tsx below
       * this section) already carries the per-platform review buttons whenever a
       * platform has real volume (sources.length > 0). This in-section button is
       * the fallback ONLY when no platform qualifies, so the two never stack. */}
      {sources.length === 0 && (
        <div className="mt-12 text-center">
          <Button
            href={siteConfig.socialLinks.google}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            surface={isDark ? "dark" : "light"}
          >
            View Verified Reviews
          </Button>
        </div>
      )}
      </section>
    </>
  )
}
