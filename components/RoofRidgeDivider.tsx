/**
 * RoofRidgeDivider (B04): the roof-ridge (gable-apex zigzag) band seam, the most
 * on-theme roofing device in the reference corpus. Server component, no assets,
 * no JS, no network.
 *
 * Sits BEHIND the band content as an absolutely-positioned top (or bottom) edge
 * overlay: the parent MUST be position: relative and keep its content in a
 * sibling with z-10 above this z-0 layer (the same contract BandPattern uses).
 * It NEVER puts a clip-path on the section, so it can never eat content padding
 * (the next-level-roofing / power-house failure). Accent TINT only, clamped into
 * the ruling range by DIVIDER_BUDGET; never gold; aria-hidden and decorative.
 *
 * Zero-data guard: an unknown shape renders nothing.
 */
import {
  DIVIDER_BUDGET,
  DIVIDER_SHAPES,
  type DividerShape,
} from "@/components/divider-slots"

interface RoofRidgeDividerProps {
  shape?: DividerShape
  /** Clamped into the ruling tint range; defaults to the range minimum. */
  opacity?: number
  edge?: "top" | "bottom"
  className?: string
}

export function RoofRidgeDivider({
  shape = "ridge",
  opacity,
  edge = "top",
  className = "",
}: RoofRidgeDividerProps) {
  if (!(DIVIDER_SHAPES as readonly string[]).includes(shape)) return null

  const range = DIVIDER_BUDGET.tintOpacity
  const clamped = Math.min(range.max, Math.max(range.min, opacity ?? range.min))
  const edgeClass = edge === "bottom" ? "bottom-0 rotate-180" : "top-0"
  const path =
    shape === "gable"
      ? "M0 16 L20 0 L40 16 L60 0 L80 16 L100 0 L120 16 Z"
      : "M0 12 L15 0 L30 12 L45 0 L60 12 L75 0 L90 12 L105 0 L120 12 Z"

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox={shape === "gable" ? "0 0 120 16" : "0 0 120 12"}
      className={`pointer-events-none absolute inset-x-0 z-0 h-4 w-full ${edgeClass} ${className}`.trim()}
      style={{ fill: "var(--color-accent)", opacity: clamped }}
    >
      <path d={path} />
    </svg>
  )
}
