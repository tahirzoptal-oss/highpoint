import { Star, Quote } from "lucide-react"

interface TestimonialCardProps {
  name: string
  location: string
  rating: number
  text: string
  /**
   * B4 polarity flip: exactly ONE card per repeated row inverts its full token
   * scheme (index 0 / the active card). .card-flip remaps the surface, text,
   * muted and card tokens wholesale; .card-on-dark keeps the flipped (always
   * dark) card separated by a tonal step on a LIGHT band (clip/flip drops the
   * shadow). The E3 quote medallion switches ink circle to accent circle when
   * flipped, both AA-safe (white quote glyph on either).
   */
  flip?: boolean
}

export function TestimonialCard({
  name,
  location,
  rating,
  text,
  flip = false,
}: TestimonialCardProps) {
  // B3 depth: a card on a LIGHT band takes the two-layer ambient shadow + the
  // asymmetric hover lift. B6: .blade-card is a no-op unless data-corner=sharp,
  // where it notches TL+BR and drops the shadow (border/tonal-step covers it).
  // B4: the flipped card is always dark, so it never carries a light shadow.
  const cardClass = flip
    ? "card-flip card-on-dark hover-card blade-card"
    : "hover-card blade-card"

  return (
    <div
      className={`${cardClass} rounded-2xl border border-border bg-card p-6 md:p-8 relative`}
    >
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-5 ${
              i < rating ? "fill-current text-star" : "fill-muted/30 text-muted/30"
            }`}
          />
        ))}
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6">{text}</p>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted">{location}</p>
        </div>

        {/* E3 quote medallion: the tokenized .quote-medallion (clamp 56-64px
         * ink circle, white double-quote glyph) bottom of the card. It auto-swaps
         * its ink fill to accent inside the B4 .card-flip wrapper, so no flip
         * conditional is needed here. Circles are META here (a quote medallion),
         * so the E2 circle-for-meta lint allows it. */}
        <span aria-hidden="true" className="quote-medallion">
          <Quote className="size-6 fill-current" />
        </span>
      </div>
    </div>
  )
}
