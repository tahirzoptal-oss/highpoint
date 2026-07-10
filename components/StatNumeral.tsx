/**
 * StatNumeral, the ONE way stats render sitewide (spec 2.2).
 *
 * Stats are typography, not icon-blurb rows: an oversized tabular numeral
 * over a small tracked-caps label. Sizes come from the --stat-* tokens in
 * globals.css (md = 48-56px, lg = 56-72px, ghost = 96-160px). The numeral
 * weight varies per pack via --stat-weight keyed off html[data-hardware],
 * the same pack token pattern Button.tsx uses, so the markup never changes
 * per pack.
 *
 * ghost renders a decorative low-opacity background numeral (aria-hidden,
 * no label): position it with the overlap utilities or absolute placement
 * from the consumer. The numeral color inherits from the consumer; on dark
 * surfaces keep it white or white/NN per the v2 contrast invariant. Label
 * and sublabel default to the muted token via a @layer base rule in
 * globals.css (suits light bands); dark consumers override it with
 * [&_.stat-label]:text-white/NN, which wins from the utilities layer.
 *
 * countUp (2B A3): opt in per consumer. When true (and the size is not ghost),
 * the numeral value is wrapped in <CountUp>, which server-renders the final
 * value (SEO + no-JS correct) and animates 0 -> final over 900ms on first
 * intersect, tabular-nums (zero CLS), skipped under reduced motion. Ghost
 * numerals are decorative (aria-hidden) and never count up.
 */

import { CountUp } from "@/components/CountUp"

type StatSize = "md" | "lg" | "ghost"

/**
 * A "contact-shaped" value is a long formatted string (a US phone like
 * "(720) 927-9055") rather than a compact count ("500+", "4.9", "$2,500",
 * "24/7"). It carries a space or a parenthesis, which a count never does. Such
 * values are ~14 glyphs wide, so at lg they overrun a narrow form card and wrap
 * mid-number; we render them at the tighter --stat-contact size instead. Counts
 * (the count-up path) never match, so their display scale is untouched.
 */
export function isContactValue(value: string): boolean {
  return /[()\s]/.test(value)
}

interface StatNumeralProps {
  value: string
  label?: string
  sublabel?: string
  size?: StatSize
  /** Animate the numeral from 0 to its final value on first intersect (A3). */
  countUp?: boolean
  className?: string
}

export function StatNumeral({
  value,
  label,
  sublabel,
  size = "md",
  countUp = false,
  className = "",
}: StatNumeralProps) {
  if (size === "ghost") {
    return (
      <span
        aria-hidden="true"
        className={`stat-numeral stat-ghost pointer-events-none select-none ${className}`}
      >
        {value}
      </span>
    )
  }

  // A contact-shaped value (a formatted phone) renders at the tighter
  // --stat-contact size and never counts up (ticking a phone number is
  // meaningless and would break its grouping mid-animation).
  const contact = isContactValue(value)
  const sizeClass = contact ? "stat-contact" : size === "lg" ? "stat-lg" : "stat-md"

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`stat-numeral ${sizeClass}`}>
        {countUp && !contact ? <CountUp value={value} /> : value}
      </span>
      {label && (
        <span className="stat-label mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="stat-sublabel mt-1 text-sm">{sublabel}</span>
      )}
    </div>
  )
}
