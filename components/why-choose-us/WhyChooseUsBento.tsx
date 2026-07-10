import { siteConfig } from "@/lib/site-config"
import { getOverlapMoments, statsCountUp } from "@/lib/design-dna"
import { whyChooseUsPullsSeam } from "@/components/why-choose-us/seam"
import { sectionPhoto } from "@/components/about/section-photo"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { StatNumeral } from "@/components/StatNumeral"
import { getWhyStats } from "@/components/why-choose-us/why-stats"

/* Generic benefit icons cycled by index. Same approved micro set the other
 * WhyChooseUs variants use; all are valid Lucide kebab names. */
const ICON_NAMES = ["shield-check", "users", "award", "clock", "hammer", "house"]

/**
 * WhyChooseUs bento variant (spec 2.6): an irregular tile grid with exactly
 * ONE inverted (dark) active tile, per reference rule 12 (in any row of like
 * cards, at most one renders inverted; siblings stay quiet). The inverted
 * anchor tile carries the StatNumeral figure (spec 2.2) and, being a dark
 * surface, every string inside it is white or white/NN.
 *
 * When the resolver's overlap moments include "stat-badge-photo" (spec 2.5),
 * a StatNumeral badge breaks the photo tile's bottom-right corner via
 * .overlap-badge-corner. The badge uses the SECOND guarded stat so it never
 * duplicates the anchor figure; with only one real stat, the badge is skipped.
 *
 * F2 band-break (2B): when the resolver grants "photo-across-seam" (the
 * commercial-authority CRS pack signature, whyChooseUsPullsSeam), the in-grid
 * photo tile is replaced by a full-width, cinematic, section-scale photo strip
 * BELOW the grid that overshoots the band boundary into the About band via
 * .overlap-photo-across-seam. It reads as one foreground object welding two
 * bands (the corpus's strongest depth cue), answering the vision critique's
 * "single-column stacked, no compositional tension" note. The receiving About
 * band adds .overlap-receive-seam so the overshoot lands inside its band, not a
 * neutral gap. Zero-data guard: no real project photo means no strip and no
 * pull (whyChooseUsPullsSeam is false), so a placeholder never welds a seam.
 */
export function WhyChooseUsBento() {
  const items = siteConfig.whyChooseUs
  // #4: distinct WhyChooseUs slot so the in-grid tile and the band-break strip
  // never repeat the About photo (or the crew shot the Services card carries).
  const image: string | null = sectionPhoto("why")
  const stats = getWhyStats()
  const anchorStat = stats.length > 0 ? stats[0] : null
  const overlapMoments: readonly string[] = getOverlapMoments()
  const badgeStat =
    overlapMoments.includes("stat-badge-photo") && stats.length > 1 ? stats[1] : null
  // A3: count-up the bento stat numerals only on the pack set that specifies it
  // (commercial-authority / industrial-contractor / storm-response). Both
  // numerals still server-render their final value; the flag only runs the
  // animation.
  const countUp = statsCountUp()

  // F2: does this bento weld its photo across the seam into About? When it
  // does, the wide band-break strip below carries the photo, so the in-grid
  // tile is dropped (no duplicate image) and the grid reflows anchor + tiles.
  const pullsSeam = whyChooseUsPullsSeam()
  const gridImage = pullsSeam ? null : image

  if (items.length === 0) return null

  const anchor = items[0]
  const rest = items.slice(1, 6)

  // #6 orphan-cell guard (lg 3-col grid). The tiles do not tile cleanly on their
  // own: the anchor spans rows, the in-grid photo spans 2 columns, and the quiet
  // tiles are 1 cell each, so most real counts (4, 5, 6 differentiators, on both
  // the pull and non-pull paths) leave one or two DEAD cells in the last row.
  // The first pass sized the anchor's row-span from a raw cell count, which the
  // col-span-2 photo tile breaks, so the holes survived.
  //
  // Fix in two moves, both a pure function of the counts (no shared state, no
  // layout shift, content preserved, no placeholder cell):
  //   1. anchorSpansTwo: the anchor spans two rows only when the non-anchor
  //      tiles actually back both rows of columns 2-3 (>= 4 backing cells).
  //   2. lastTileSpan: whatever trailing gap the auto-flow leaves on the last
  //      row is absorbed by widening the LAST quiet tile (the final grid child)
  //      to fill it. gap = (3 - total % 3) % 3, where total is every cell the
  //      grid places; it is always 0, 1 or 2, so the last tile grows to at most
  //      col-span-3. No quiet tile means nothing renders past the anchor, so the
  //      lone-anchor case widens the anchor itself instead.
  const gridPhotoCells = gridImage ? 2 : 0
  const anchorSpansTwo = gridPhotoCells + rest.length >= 4
  const anchorCells = anchorSpansTwo ? 2 : 1
  const totalCells = anchorCells + gridPhotoCells + rest.length
  const trailingGap = (3 - (totalCells % 3)) % 3
  // Absorb the gap into the last quiet tile when one exists; otherwise the
  // anchor is the only tile on its row, so it stretches to fill the width.
  const lastTileSpanClass =
    trailingGap === 2 ? "lg:col-span-3" : trailingGap === 1 ? "lg:col-span-2" : ""
  const anchorFullWidth = rest.length === 0 && gridPhotoCells === 0

  return (
    /* F2 seam geometry: on the pull path the section's bottom padding is zeroed
     * inline (inline style beats the unlayered .section-y rule at every
     * breakpoint) so the .overlap-photo-across-seam photo sits flush at the
     * section edge and its -5.5rem margin overshoots cleanly into About, which
     * pads its own top via .overlap-receive-seam to receive it. overflow-hidden
     * is also dropped so the clip never swallows the overshoot; the bento tiles
     * are fade-up only (no horizontal slide), so nothing needs the clip. */
    <section
      className={`bg-[var(--color-surface-light)] section-y ${
        pullsSeam ? "" : "overflow-hidden"
      }`}
      style={pullsSeam ? { paddingBottom: 0 } : undefined}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={`What makes ${siteConfig.shortName} *different*`}
          subtitle="Most contractors say the same things. Our process is built around clear communication, owner accountability, and work that is backed long after the job is done."
          scale="feature"
          layout="split"
        />

        {/* A2 grid choreography: row-major tile stagger across the bento. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* B4 one-inverted-card: the anchor tile is the single polarity flip
           * in this grid. .card-flip remaps the card/foreground/muted tokens
           * wholesale (nested text inverts through text-foreground/text-muted,
           * the stat label via the .card-flip stat-label rule), so it exercises
           * the shared B4 token contract, not a parallel hardcoded dark tile.
           * .card-on-dark holds the tonal-step separation on this light band. */}
          <Reveal
            index={0}
            className={`card-flip card-on-dark flex flex-col justify-between rounded-2xl p-7 ${
              anchorSpansTwo ? "lg:row-span-2" : ""
            } ${anchorFullWidth ? "lg:col-span-3" : ""}`}
          >
            <div>
              {anchorStat && (
                <StatNumeral
                  value={anchorStat.value}
                  label={anchorStat.label}
                  size="lg"
                  countUp={countUp}
                  className="text-foreground"
                />
              )}
              <h3 className={`text-2xl font-black text-foreground ${anchorStat ? "mt-8" : ""}`}>
                {anchor.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{anchor.description}</p>
            </div>

            <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile className="mt-8 self-start">
              Get My Free Estimate
            </Button>
          </Reveal>

          {gridImage && (
            <Reveal
              index={1}
              className="relative min-h-[280px] lg:col-span-2"
            >
              <div className="absolute inset-0">
                <Photo
                  src={gridImage}
                  alt={`${siteConfig.name} completed roofing project`}
                  fill
                  className="h-full w-full"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>

              {badgeStat && (
                <div className="overlap-badge-corner w-max rounded-2xl bg-white p-5 shadow-2xl">
                  <StatNumeral
                    value={badgeStat.value}
                    label={badgeStat.label}
                    countUp={countUp}
                    className="text-primary-dark [&_.stat-label]:text-primary-dark/60"
                  />
                </div>
              )}
            </Reveal>
          )}

          {rest.map((item, index) => (
            /* B3 depth: token two-layer shadow + asymmetric lift. The single
             * polarity flip in this grid is the dark anchor tile above (B4's
             * one-inverted-card rule), so the quiet tiles only take the shadow.
             * The final quiet tile absorbs any trailing gap (lastTileSpanClass)
             * so the last row is always full and no dead cell is left. */
            <Reveal
              key={item.title}
              index={index + 2}
              className={`hover-card rounded-2xl border border-black/10 bg-white p-6 transition hover:border-accent ${
                index === rest.length - 1 ? lastTileSpanClass : ""
              }`}
            >
              <IconChip name={ICON_NAMES[index % ICON_NAMES.length]} surface="light" size={48} />
              <h3 className="mt-4 font-black text-primary-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </Reveal>
          ))}
        </div>

        {/* F2 band-break: the section-scale cinematic photo welds this band to
         * the About band below. .overlap-photo-across-seam overshoots the band
         * boundary (z-index above the receiving band, which pads its top via
         * .overlap-receive-seam). Wide crop, large. NOT Reveal-wrapped (the
         * hidden state's will-change would trap the overshoot's z-index); the
         * section itself is left unwrapped by SectionRenderer for the same
         * reason. Guarded on a real project photo. */}
        {pullsSeam && image && (
          <div className="overlap-photo-across-seam mt-12">
            {/* Wide cinematic band-break asset. Same zero-CLS pattern as the
             * bento's original photo tile: a relative box with a responsive
             * fixed height reserves the space at build, and the fill Photo sits
             * absolute inset-0 (its own frame aspect is overridden by the
             * inset), so the crop stays wide and short on desktop without any
             * layout shift. rounded-2xl overflow-hidden matches the section card
             * radius so this strip is not the one sharp-cornered element beside
             * the rounded tiles (#17, one-corner decision). */}
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl lg:h-[420px]">
              <div className="absolute inset-0">
                <Photo
                  src={image}
                  alt={`${siteConfig.name} completed roofing project`}
                  fill
                  scrim="bottom"
                  className="h-full w-full"
                  sizes="(min-width: 1024px) 1120px, 100vw"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
