import fs from "node:fs"
import path from "node:path"
import { designDNA } from "@/lib/design-dna"

/**
 * Brand glyph plumbing (2B E4), SERVER-ONLY (reads the filesystem at build
 * time; importing this from a "use client" component is a build error by
 * design).
 *
 * The build bridge derives public/brand/glyph.svg from the harvested client
 * logo (tools/derive-brand-glyph.py, hard-skip on any gate failure). When the
 * file exists, consumer slots recycle the mark as punctuation:
 *   - BrandMarquee ticker separator (16px at 60% opacity), every pack
 *   - list bullet in About/WhyChooseUs feature lists (20px, accent ink on
 *     light bands / white on dark), restraint packs excluded
 * Zero-data guard: no glyph file = every slot keeps its existing default
 * separator/bullet. A substitute glyph never renders. The glyph is always
 * decorative (aria-hidden) and never touches the 6 locked CRO phrases.
 *
 * The derivation tool emits exactly one <path fill="currentColor"> with an
 * evenodd fill, so only the path data is read out of the file and re-rendered
 * as real JSX (no raw-HTML injection surface).
 */

/** Packs whose icon-restraint signature limits E4 to the marquee slot only. */
const MARQUEE_ONLY_PACKS = new Set<string>(["luxury-premium", "modern-corporate"])

/** Path data may only contain SVG path commands, digits and separators. */
const SAFE_PATH = /^[MLHVCSQTAZmlhvcsqtaz0-9 ,.-]+$/

let cached: string | null | undefined

/** The glyph's path data (24x24 viewBox, evenodd) or null when absent. */
export function getBrandGlyphPath(): string | null {
  if (cached !== undefined) return cached
  cached = null
  try {
    const p = path.join(process.cwd(), "public", "brand", "glyph.svg")
    const raw = fs.readFileSync(p, "utf8")
    if (raw.includes('fill="currentColor"')) {
      const d = raw.match(/<path[^>]*\sd="([^"]+)"/)?.[1] ?? ""
      if (d && SAFE_PATH.test(d)) cached = d
    }
  } catch {
    cached = null
  }
  return cached
}

/** The glyph for bullet slots, or null for the marquee-only restraint packs. */
export function getBrandGlyphPathForBullets(): string | null {
  if (MARQUEE_ONLY_PACKS.has(designDNA.pack)) return null
  return getBrandGlyphPath()
}

interface BrandGlyphProps {
  /** Path data from getBrandGlyphPath / getBrandGlyphPathForBullets. */
  d: string
  /** Render size in px (16 marquee separator, 20 list bullet). */
  size?: number
  className?: string
}

/** Inline renderer: fill is currentColor, so band ink rules (white on dark,
 * accent on light) apply through the wrapper's text color with zero extra
 * plumbing. */
export function BrandGlyph({ d, size = 16, className = "" }: BrandGlyphProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`.trim()}
    >
      <path fill="currentColor" fillRule="evenodd" d={d} />
    </svg>
  )
}
