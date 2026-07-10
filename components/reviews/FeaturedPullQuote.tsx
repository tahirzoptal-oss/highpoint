import { Quote, Star } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/**
 * E3 featured pull-quote: ONE large, display-scale real review rendered as a
 * visceral social-proof moment (the vision critique's "add real customer review
 * quotes as large pull-quote typography, make social proof visceral" fix). It
 * elevates the first REAL review item to feature scale via the tokenized
 * .pull-quote type + the .quote-medallion mark.
 *
 * Real data only: the copy is siteConfig.reviews.items[0], never fabricated.
 * Zero-data guard: renders nothing when the client has no review items, so no
 * placeholder testimonial ever ships.
 *
 * Light band, dark text (the v2 contrast invariant): .pull-quote inherits the
 * foreground color here, so no accent text ever lands on a dark surface. The
 * medallion is the ink circle (E3), decorative + aria-hidden; the review text
 * carries the meaning. Static geometry, content visible without JS, zero CLS.
 */
export function FeaturedPullQuote() {
  const featured = siteConfig.reviews.items[0]
  if (!featured) return null

  const filled = Math.round(featured.rating)

  // #9: step the pull-quote face DOWN as the review grows, so a longer quote
  // never becomes a 20-line wall at feature scale. The bridge already caps the
  // featured item (~34 words); this is the belt-and-braces guard for a borderline
  // one. Character count is the cheap proxy: feature scale for a punchy line,
  // utility for a paragraph, the smaller body face beyond that.
  const len = featured.quote.length
  const sizeClass =
    len > 220 ? "pull-quote-sm" : len > 120 ? "pull-quote-md" : ""

  return (
    <section className="bg-[var(--color-surface-light)] section-y text-foreground">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span aria-hidden="true" className="quote-medallion mx-auto">
          <Quote className="size-6 fill-current" />
        </span>

        <blockquote className="mt-8">
          <p className={`pull-quote text-balance text-primary-dark ${sizeClass}`}>
            &ldquo;{featured.quote}&rdquo;
          </p>
        </blockquote>

        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="inline-flex text-star" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-5 ${i <= filled ? "fill-current" : "fill-transparent opacity-30"}`}
              />
            ))}
          </span>
          <div>
            <span className="font-black uppercase tracking-wide text-primary-dark">
              {featured.reviewer}
            </span>
            <span className="mx-2 text-primary-dark/30" aria-hidden="true">
              &bull;
            </span>
            <span className="text-primary-dark/60">{featured.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
