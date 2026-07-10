import { ShieldCheck, Star } from "lucide-react"
import { BrandGlyph, getBrandGlyphPath } from "@/components/brand-glyph"

interface BrandMarqueeProps {
  text?: string
  /** B06: multi-phrase cycle. The glyph separator sits between distinct phrases. */
  phrases?: string[]
  variant?: "dark" | "light" | "accent"
  icon?: "shield" | "star" | "none"
  /** B06: subtle two-tone rhythm via currentColor alpha, never a second hue. */
  twoTone?: boolean
}

export function BrandMarquee({
  text = "Licensed • Insured • Warranty Backed",
  phrases,
  variant = "dark",
  icon = "shield",
  twoTone = false,
}: BrandMarqueeProps) {
  const list = phrases && phrases.length > 0 ? phrases : [text]
  const Icon = icon === "star" ? Star : ShieldCheck
  // Stars are always rating-star gold, on every band; shields key to the band.
  const iconClass = icon === "star" ? "fill-current text-star" : ""

  /* E4 brand glyph as the ticker separator (the V6 signature detail): when the
   * build derived a safe glyph, it replaces the Lucide separator at 16px and
   * 60% opacity, inheriting the band ink via currentColor. Zero-data guard:
   * no glyph = the existing shield/star separator stays. */
  const glyphPath = getBrandGlyphPath()

  const styles = {
    dark: {
      wrapper: "bg-primary-dark text-white border-y border-accent",
      icon: "text-white",
    },
    light: {
      wrapper: "bg-white text-primary-dark border-y border-accent",
      icon: "text-accent",
    },
    accent: {
      wrapper: "bg-accent text-[var(--color-on-accent)]",
      icon: "text-[var(--color-on-accent)]",
    },
  }

  const current = styles[variant]
  // B06: enough segments that every phrase appears equally often within a track,
  // so there is no seam at the loop restart.
  const items = Array.from({ length: Math.max(12, list.length * 4) }, (_, index) => index)

  const separator = glyphPath ? (
    <BrandGlyph d={glyphPath} size={16} className={`opacity-60 ${current.icon}`} />
  ) : icon !== "none" ? (
    <Icon className={`size-5 shrink-0 ${iconClass || current.icon}`} />
  ) : null

  const renderSeg = (item: number) => (
    <div
      key={item}
      className={`flex shrink-0 items-center gap-8 px-10${twoTone && item % 2 ? " opacity-70" : ""}`}
    >
      {separator}
      <span className="text-lg font-black uppercase tracking-[0.22em]">
        {list[item % list.length]}
      </span>
    </div>
  )

  return (
    <section className={`relative overflow-hidden ${current.wrapper}`}>
      <div className="flex whitespace-nowrap py-4">
        <div className="flex min-w-max animate-marquee items-center">
          {items.map(renderSeg)}
        </div>

        <div
          aria-hidden="true"
          className="flex min-w-max animate-marquee items-center"
        >
          {items.map(renderSeg)}
        </div>
      </div>
    </section>
  )
}
