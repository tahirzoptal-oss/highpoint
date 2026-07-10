import { renderAccent } from "@/lib/accent"

/**
 * SectionHeading, the ONE locked section-header cadence sitewide:
 * accent eyebrow (with the 6px micro-mark shared with the Button hardware)
 * + display heading + muted body.
 *
 * Three-step scale (spec 2.1) kills the one-volume monotone: sizes come from
 * the --h1-display / --h2-feature / --h2-utility tokens in globals.css,
 * applied via [data-scale] so they win over the legacy .section-y h2 size.
 *
 * Two layouts (spec 2.4): centered (default, stacked; card grids) and split
 * (headline left, muted subtitle paragraph right, shared baseline; media
 * splits and gallery sections). The legacy centered prop keeps working for
 * left-aligned stacked headers.
 *
 * The title passes through renderAccent(): ONE *marked* word or phrase per
 * headline renders as text-accent (spec 2.3, render side).
 */

type HeadingScale = "display" | "feature" | "utility"
type HeadingLayout = "centered" | "split"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Legacy alignment flag for the stacked layout. Ignored when layout="split". */
  centered?: boolean
  /** Three-step type scale. Default feature (the standard section H2). */
  scale?: HeadingScale
  /** Semantic heading level; visual size comes from scale, not the tag. */
  as?: "h1" | "h2"
  /** centered = stacked; split = headline left, subtitle right on md+. */
  layout?: HeadingLayout
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
  scale = "feature",
  as = "h2",
  layout = "centered",
}: SectionHeadingProps) {
  const Tag = as
  const centerText = layout === "centered" && centered

  const eyebrowEl = eyebrow ? (
    <p
      className={`eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-accent ${
        centerText ? "justify-center" : ""
      }`}
    >
      <span aria-hidden="true" className="eyebrow-mark" />
      {eyebrow}
    </p>
  ) : null

  const titleEl = (
    <Tag
      data-scale={scale}
      className="font-heading font-bold tracking-tight text-foreground"
    >
      {renderAccent(title)}
    </Tag>
  )

  if (layout === "split") {
    return (
      <div className="mb-12 grid gap-6 text-left md:mb-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-12">
        <div>
          {eyebrowEl}
          {titleEl}
        </div>
        {subtitle && (
          <p className="section-subhead max-w-xl text-lg text-muted md:justify-self-end md:pb-1">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`mb-12 md:mb-16 ${centerText ? "text-center" : "text-left"}`}>
      {eyebrowEl}
      {titleEl}
      {subtitle && (
        <p className={`section-subhead mt-4 text-lg text-muted max-w-2xl ${centerText ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
