import { Icon } from "@/components/Icon"
import { designDNA, type DesignPack } from "@/lib/design-dna"
import { toBespokeIcon } from "@/lib/icon-map"

/**
 * IconChip, the ONE containered icon treatment.
 *
 * A square chip on the radius token with a centered glyph at half the chip
 * size. The pack decides the glyph tier (2B E1):
 *
 *   Camp A (owner-authority, commercial-authority, family-owned,
 *   industrial-contractor, storm-response) = bespoke duotone set. The chip
 *   carries the chip-ink-* context class (globals.css) which sets the duo
 *   ink contract: light chip = primary-dark ink + accent duo; dark/accent
 *   chip = white ink + white/35 duo. Names with no bespoke mapping (the
 *   micro-utility tier: arrows, check, etc.) stay Lucide in the same chip.
 *
 *   luxury-premium = thin 1.5px Lucide line glyphs in a 1px-bordered chip
 *   (its signature is near-icon-free restraint, Camp B).
 *
 *   modern-corporate = icon-free by pack routing (arrow coin + 6px dot are
 *   its icon language); wherever a routed variant still asks for a chip it
 *   keeps the standard Lucide treatment.
 *
 * Container sizes (E2): 40/48 feature chips (inline-sized), 72 step tile,
 * 128 crescendo tile, 140 storm stacked tile (the --tile-* tokens). Squares
 * always; circles are reserved for meta elements per the E2 lint.
 *
 * Three fill inversions, mirroring the Button surfaces:
 *   on light  = accent tint fill
 *   on dark   = solid accent fill
 *   on accent = translucent white fill
 *
 * B4 flip hook: every chip carries the .icon-chip marker class. Inside a
 * .card-flip (the polarity-flipped index-0 card), globals.css remaps the chip
 * to the dark contract (solid accent fill + white ink + white/35 duo) whatever
 * its own surface prop was, so a flipped card inverts cleanly through tokens.
 */

type ChipSurface = "light" | "dark" | "accent"

interface IconChipProps {
  name: string
  surface?: ChipSurface
  size?: 40 | 48 | 72 | 128 | 140
  className?: string
}

/** Camp A packs render the bespoke duotone set bespoke-first. */
const BESPOKE_PACKS: ReadonlySet<DesignPack> = new Set<DesignPack>([
  "owner-authority",
  "commercial-authority",
  "family-owned",
  "industrial-contractor",
  "storm-response",
])

const SURFACE_FILL: Record<ChipSurface, string> = {
  light: "bg-accent/10",
  dark: "bg-accent",
  accent: "bg-white/15",
}

/** Lucide tint per surface (standard tier + micro/unmapped fallbacks). */
const SURFACE_TEXT: Record<ChipSurface, string> = {
  light: "text-accent",
  dark: "text-[var(--color-on-accent)]",
  accent: "text-white",
}

/** Duo ink contract (E1), via the chip-ink-* context classes in globals.css. */
const SURFACE_INK: Record<ChipSurface, string> = {
  light: "chip-ink-light",
  dark: "chip-ink-dark",
  accent: "chip-ink-accent",
}

/** Luxury thin-line chip: transparent fill + 1px border (Camp B). */
const SURFACE_LINE: Record<ChipSurface, string> = {
  light: "border border-primary-dark/20 bg-transparent text-accent",
  dark: "border border-white/30 bg-transparent text-white",
  accent: "border border-white/40 bg-transparent text-white",
}

/** Tokenized tile sizes (E2): width/height come from the --tile-* tokens. */
const TILE_CLASS: Partial<Record<number, string>> = {
  72: "icon-tile-step",
  128: "icon-tile-crescendo",
  140: "icon-tile-crescendo-stack",
}

export function IconChip({
  name,
  surface = "light",
  size = 48,
  className = "",
}: IconChipProps) {
  const pack = designDNA.pack
  const line = pack === "luxury-premium"
  const bespoke = BESPOKE_PACKS.has(pack) ? toBespokeIcon(name) : null

  const surfaceClass = line
    ? SURFACE_LINE[surface]
    : bespoke
      ? `${SURFACE_FILL[surface]} ${SURFACE_INK[surface]}`
      : `${SURFACE_FILL[surface]} ${SURFACE_TEXT[surface]}`

  const tileClass = TILE_CLASS[size]

  return (
    <div
      className={`icon-chip grid shrink-0 place-items-center rounded-[var(--radius-lg)] ${tileClass ?? ""} ${surfaceClass} ${className}`}
      style={tileClass ? undefined : { width: size, height: size }}
    >
      <Icon
        name={bespoke ?? name}
        size={size * 0.5}
        strokeWidth={line ? 1.5 : undefined}
      />
    </div>
  )
}
