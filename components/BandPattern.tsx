/**
 * BandPattern, the ONE background-pattern treatment (2B C1). Server component.
 *
 * Renders the motif SVG from /public/patterns/ as an absolutely-positioned
 * tiled overlay inside its band (the parent MUST be position: relative; keep
 * the band's content in a sibling with position relative + z-index above the
 * overlay). Mechanism ported from the main factory's BackgroundPattern:
 * background-image url + background-repeat, one SVG file serving light and
 * dark bands via the currentColor trick.
 *
 * BUDGET (Juan's calibrated-middle ruling, 2026-07-03), enforced by the
 * dispatchers + taste gate against PATTERN_BUDGET below:
 *   - max 3 patterned bands per page: up to 2 dark bands (opacity 0.04-0.08)
 *     plus up to 1 light band (opacity 0.05-0.08); this component clamps the
 *     opacity prop into the band's range
 *   - motif is pack-fixed (design-dna override slot only), never free per
 *     client
 *   - NEVER on the hero (photography is the hero texture) and NEVER on the
 *     accent crescendo band (6/6 corpus shows it flat)
 *
 * Zero-data guard: an unknown motif renders nothing (no surprise fallback
 * pattern ever ships). The main-factory CornerOverlay is deliberately NOT
 * ported (0/6 in the corpus).
 */

export const PATTERN_MOTIFS = [
  "polygon",
  "triangle",
  "wave",
  "arc",
  "dot-grid",
  "hexagon",
  "chevron",
  "diamond",
  "cross-hatch",
  "mountain",
  "shingle",
  "blueprint-grid",
  "topographic",
  "herringbone",
  "blade-shards",
  "facet-mesh",
  "swoosh-arc",
] as const

export type PatternMotif = (typeof PATTERN_MOTIFS)[number]

/** The ruling budget, exported for the dispatchers and the taste gate. */
export const PATTERN_BUDGET = {
  /** Max patterned bands per page (calibrated-middle ruling). */
  maxPerPage: 3,
  /** Of those, at most 2 dark bands and 1 light band. */
  maxDarkBands: 2,
  maxLightBands: 1,
  darkOpacity: { min: 0.06, max: 0.13 },
  lightOpacity: { min: 0.07, max: 0.12 },
} as const

type PatternBand = "dark" | "light"

interface BandPatternProps {
  /** Pack-fixed motif; unknown values render nothing (zero-data guard). */
  motif: string
  /** Which band class this overlay sits on; sets the opacity clamp range. */
  band?: PatternBand
  /** Clamped into the band's ruling range; defaults to the range minimum. */
  opacity?: number
  className?: string
}

export function BandPattern({
  motif,
  band = "dark",
  opacity,
  className = "",
}: BandPatternProps) {
  if (!(PATTERN_MOTIFS as readonly string[]).includes(motif)) return null

  const range =
    band === "light" ? PATTERN_BUDGET.lightOpacity : PATTERN_BUDGET.darkOpacity
  const clamped = Math.min(range.max, Math.max(range.min, opacity ?? range.min))

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
      style={{
        backgroundImage: `url('/patterns/${motif}.svg')`,
        backgroundRepeat: "repeat",
        opacity: clamped,
        color: "currentColor",
      }}
    />
  )
}
