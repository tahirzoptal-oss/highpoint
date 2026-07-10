import { renderAccent } from "@/lib/accent"
import { ContactForm } from "@/components/ContactForm"
import { BandPattern } from "@/components/BandPattern"
import { getPatternSlot } from "@/components/pattern-slots"
import { getDividerSlot } from "@/components/divider-slots"
import { RoofRidgeDivider } from "@/components/RoofRidgeDivider"

/**
 * Closer CTA (spec 2.7): the conversion crescendo. A centered feature-scale
 * heading over the short "closer" form card: name + phone + optional message,
 * with the display-scale phone numeral and the callback-promise badge living
 * inside the card (see ContactForm variant="closer").
 *
 * Dark band, so every string on the band is white or white/NN and the accent
 * word renders accent-light, never text-accent (v2 contrast invariant).
 */
export function CTACloser() {
  /* C1/C3 pattern slot: commercial-authority textures this dark closer band
   * with its blueprint-grid signature (its one allotted dark pattern band).
   * Null for packs without a cta slot, so the band stays clean. */
  const pattern = getPatternSlot("cta")
  const divider = getDividerSlot("cta")

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in srgb, var(--color-accent) 14%, transparent),transparent_38%)]" />
      {pattern && (
        <BandPattern motif={pattern.motif} band={pattern.band} opacity={pattern.opacity} />
      )}
      {divider && (
        <RoofRidgeDivider shape={divider.shape} edge={divider.edge} opacity={divider.opacity} />
      )}

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow flex items-center justify-center gap-2.5 text-[13px] text-accent-light">
            <span aria-hidden="true" className="eyebrow-mark" />
            Free Estimate
          </p>

          <h2
            data-scale="feature"
            className="mt-3 text-balance font-heading font-bold tracking-tight text-white [&_.text-accent]:text-accent-light"
          >
            {renderAccent("Your *free* estimate is one call away")}
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Tell us where to call. A real member of our local team picks up,
            answers your questions and books your free inspection.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <ContactForm variant="closer" />
        </div>
      </div>
    </section>
  )
}
