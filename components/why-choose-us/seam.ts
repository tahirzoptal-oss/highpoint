import { getOverlapMoments } from "@/lib/design-dna"
import { getLayout } from "@/lib/get-layout"
import { siteConfig } from "@/lib/site-config"

/**
 * F2 seam-weld predicate (2B). True when the resolved WhyChooseUs section welds
 * a section-scale photo across the band seam into the About band below it.
 *
 * Both sides consult this ONE helper so they never drift apart:
 *   - WhyChooseUsBento renders the .overlap-photo-across-seam band-break photo
 *     and drops its own bottom padding + overflow clip so the overshoot escapes.
 *   - the receiving About variant applies .overlap-receive-seam so its band
 *     absorbs the overshoot (the photo reads as a foreground object between the
 *     two bands, not a hang over a neutral gap).
 *
 * Conditions, all required:
 *   1. the resolver granted the photo-across-seam overlap moment (the
 *      commercial-authority CRS pack signature),
 *   2. the resolved WhyChooseUs variant is one that actually docks a
 *      section-scale photo at the band edge (today: bento, the wired host),
 *   3. a real project photo exists (zero-data guard: no photo, no pull, no
 *      receive padding, so a placeholder never welds a seam).
 *
 * The bento is left UNWRAPPED by SectionRenderer's existing seam exemption, so
 * the pulled photo's z-index is not trapped by a Reveal will-change stacking
 * context. When that exemption is not in force the weld still renders; the
 * z-index simply competes at the root, which the bento's own dropped wrapper
 * (it renders its coarse section directly) already allows.
 */
const SEAM_PULLING_WHY = new Set<string>(["bento"])

export function whyChooseUsPullsSeam(): boolean {
  return (
    getOverlapMoments().includes("photo-across-seam") &&
    SEAM_PULLING_WHY.has(getLayout().whyChooseUs) &&
    siteConfig.projectImages.length > 0
  )
}
