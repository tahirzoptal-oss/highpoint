import { Star } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { TestimonialCard } from "@/components/TestimonialCard"
import {
  getReviewStatChips,
  qualifiedReviewSources,
  type ReviewStatChip,
} from "@/components/reviews/stat-chips"

function RatingStars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-5 ${i <= filled ? "fill-current" : "fill-transparent opacity-30"}`}
        />
      ))}
    </span>
  )
}

// Chip values sit on WHITE chips, so their color keys to the card, never the
// theme (text-foreground goes invisible on white in dark mode).
function chipValueClass(kind: ReviewStatChip["kind"]): string {
  if (kind === "license") return "text-lg font-black text-primary-dark"
  if (kind === "google-count" || kind === "facebook-count") return "text-2xl font-black text-accent"
  return "text-2xl font-black text-primary-dark"
}

export function ReviewsWall() {
  const reviews = siteConfig.reviews.items
  const chips = getReviewStatChips()
  const sources = qualifiedReviewSources()

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-black uppercase tracking-[0.28em] text-accent">
            Customer Reviews
          </span>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-primary-dark md:text-5xl">
            What Homeowners Say About Us
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-primary-dark/70">
            Real reviews from homeowners who trusted us with their roofing,
            siding and storm restoration projects.
          </p>
        </div>

        {chips.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {chips.map((chip) => (
              <div
                key={chip.kind}
                className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-lg"
              >
                {chip.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={chip.logo}
                    alt={chip.label}
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                )}

                {chip.kind === "google-rating" && chip.rating !== undefined && (
                  <div className="flex text-star">
                    <RatingStars rating={chip.rating} />
                  </div>
                )}

                <div>
                  <div className={chipValueClass(chip.kind)}>{chip.value}</div>
                  {/* #3: an empty label (self-describing generic license) renders
                   * no caption, so the value never stacks over a near-duplicate. */}
                  {chip.label && (
                    <div className="text-xs font-bold uppercase tracking-wider text-primary-dark/60">
                      {chip.label}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* #13: items-start so each card sizes to its own content instead of the
         * grid stretching short reviews to the tallest card's height, which left
         * a dead gap under the quote. */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <TestimonialCard
              key={index}
              name={review.reviewer}
              text={review.quote}
              rating={review.rating}
              location={review.location}
              /* B4: exactly one card per repeated row flips its polarity. */
              flip={index === 0}
            />
          ))}
        </div>

        {/* #12: single review CTA. SeeAllReviews (from Reviews.tsx, below this
         * section) carries the per-platform buttons whenever a platform has real
         * volume. This in-section button is the fallback ONLY when none qualify,
         * so the two never stack into a redundant double CTA. */}
        {sources.length === 0 && (
          <div className="mt-12 text-center">
            <Button
              href={siteConfig.socialLinks.google}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              surface="light"
            >
              Read More Reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
