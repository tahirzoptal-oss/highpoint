"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { statsCountUp } from "@/lib/design-dna"
import { StatNumeral } from "@/components/StatNumeral"
import { getReviewStatChips } from "@/components/reviews/stat-chips"

const PLATFORM_LOGOS: Record<string, string> = {
  Google: "/images/google-logo.svg",
  Facebook: "/images/facebook-logo.svg",
  BBB: "/images/bbb-logo.svg",
}

function RatingStars({ rating, className = "size-5" }: { rating: number; className?: string }) {
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

export function ReviewsSlider() {
  const reviews = siteConfig.reviews.items
  const chips = getReviewStatChips()
  // A3: count-up the review stat numerals on the pack set that specifies it.
  const countUp = statsCountUp()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = () => setActive((prev) => (prev + 1) % reviews.length)
  const prev = () => setActive((prev) => (prev - 1 + reviews.length) % reviews.length)

  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      next()
    }, 4000)

    return () => clearInterval(timer)
  }, [paused, reviews.length])

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 18%, transparent),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            {/* Dark band: heading map (feature scale) applied via the
             * data-scale token directly. SectionHeading emits light-band
             * colors, which the v2 contrast invariant bans here. */}
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Verified Reviews
            </p>

            <h2 data-scale="feature" className="mt-4 font-black uppercase">
              Homeowners trust {siteConfig.shortName}
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              Real feedback from {siteConfig.city} homeowners who trusted {siteConfig.shortName} with roof repairs,
              storm restoration and replacement projects.
            </p>

            {chips.length > 0 && (
              <div className="mt-8 flex max-w-xl flex-wrap items-stretch gap-4">
                {chips.map((chip) => (
                  <div
                    key={chip.kind}
                    /* #20: centered flex column + stretched row so a numeral chip
                     * and a license chip share one vertical baseline. */
                    className="flex min-w-[140px] flex-1 flex-col justify-center rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-md"
                  >
                    {chip.kind === "license" ? (
                      /* License strings are credentials, not numerals; they
                       * keep the small treatment. #3: a generic license is
                       * self-describing, so its caption is empty and only the
                       * single value line renders (no duplicate phrase). */
                      <>
                        <div className="text-lg font-black leading-snug text-white">
                          {chip.value}
                        </div>
                        {chip.label && (
                          <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">
                            {chip.label}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Stats render as designed typography (spec 2.2). Dark
                       * band, so the numeral and label stay white/NN via the
                       * .stat-label hook. */
                      <StatNumeral
                        value={chip.value}
                        label={chip.label}
                        countUp={countUp}
                        className="text-white [&_.stat-label]:text-white/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <article
                  key={`${review.reviewer}-${index}`}
                  className="w-full shrink-0 px-2"
                >
                  {/* #13: flex column with the quote block as flex-1. The card
                   * keeps a consistent height (a carousel must not jump between
                   * slides), but a short review is vertically centered in the
                   * middle instead of top-anchored with a dead gap below. */}
                  <div className="relative flex min-h-[410px] flex-col rounded-2xl border border-white/10 bg-white p-8 text-primary-dark shadow-2xl md:p-10">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          {PLATFORM_LOGOS[review.platform] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={PLATFORM_LOGOS[review.platform]}
                              alt={`${review.platform} review`}
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                            />
                          )}
                          <span className="text-xs font-black uppercase tracking-[0.24em] text-accent">
                            {review.platform} Review
                          </span>
                        </div>

                        <div className="mt-3 flex text-star">
                          <RatingStars rating={review.rating} />
                        </div>
                      </div>

                      <Quote className="size-14 text-primary-dark/10" />
                    </div>

                    {/* #13: flex-1 + centered so a short quote sits in the
                     * vertical middle of the reserved space, not top-anchored. */}
                    <p className="mt-8 flex flex-1 items-center text-2xl font-bold leading-relaxed text-primary-dark/85">
                      “{review.quote}”
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-base font-black text-accent"
                        >
                          {review.reviewer.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                        <div>
                          <div className="text-xl font-black">{review.reviewer}</div>
                          <div className="text-sm font-semibold text-primary-dark/55">
                            {review.location}
                          </div>
                        </div>
                      </div>

                      {/* A5 carousel arrow hardware: the arrows sit on the
                       * WHITE review card, so prev is the outline circle with
                       * an ink arrow (no .on-dark) and next is the solid accent
                       * circle. The single child transitions its transform on
                       * hover (direction-aware nudge). */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prev}
                          className="carousel-arrow carousel-arrow-prev"
                          aria-label="Previous review"
                        >
                          <ChevronLeft className="size-5" />
                        </button>

                        <button
                          type="button"
                          onClick={next}
                          className="carousel-arrow carousel-arrow-next"
                          aria-label="Next review"
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active === index ? "w-10 bg-accent" : "w-2.5 bg-white/25"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
