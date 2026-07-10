import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { FilmstripScroller } from "@/components/gallery/FilmstripScroller"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

/**
 * GalleryEdgeFilmstrip, the 2B F1 edge-bleed gallery variant ("edge-filmstrip").
 *
 * The corpus signature (V1 explicit spec, 5/6 mockups): a full-bleed horizontal
 * row of project photos where the first and last images are cropped by the
 * viewport with a sliver peeking, prev/next parked below, centred. Built on the
 * shipped shared layer:
 *   - .bleed-row       breaks the container to 100vw + scroll-snap + hidden
 *                      scrollbar + the edge-sliver padding (globals.css F1).
 *   - FilmstripScroller the A5 carousel-arrow pair driving scrollBy on the row.
 *   - Photo            keeps .photo-frame + grade and a fixed 4/3 aspect box,
 *                      so the strip is CLS-safe; no priority = loading lazy,
 *                      and this section sits deep in the page (below the fold).
 *
 * Real photos only. realGalleryImages() is already placeholder-filtered, and
 * the tiles map ONE photo each with no round-robin: a client with few photos
 * renders a shorter strip, never a repeated tile (the Phase 2 zero-data rule).
 * The dispatcher routes < 4 real photos to the two-up grid before this variant
 * is reached; the internal guard mirrors the sibling full variants.
 *
 * B6 note: gallery photos here are never hero-adjacent (Gallery sits at
 * position 10 in the locked order, after SpecialOffers), so no bladeFrame is
 * applied; the blade-frame moment is reserved for hero-adjacent photos.
 */

const projectAlts = [
  "Completed roofing project",
  "Roof replacement project",
  "Storm restoration project",
  "Roofing crew working",
  "Roof installation work",
  "Roof repair project",
]

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room. The
// crescendo (full-bleed accent) offer band never hangs, so this stays false
// for it and true only for the card/split offer anatomies.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryEdgeFilmstrip() {
  const images = realGalleryImages()

  // Zero-data guard: the full variants need 4+ real photos; the Gallery
  // dispatcher routes sparser clients to the two-up grid or nothing.
  if (images.length < 4) return null

  return (
    <section
      className={`relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white${
        RECEIVE_OVERLAP ? " overlap-receive" : ""
      }`}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* Split header (heading map: Gallery = feature/split). Hand-rolled on
         * this dark band because SectionHeading's accent eyebrow text is banned
         * on dark surfaces; the accent-light eyebrow + eyebrow-mark keep the
         * same family anatomy with dark-safe paint. */}
        <div className="mb-12 grid grid-cols-1 gap-6 text-left md:mb-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Recent Work
            </p>

            <h2 data-scale="feature" className="font-heading">
              See the work before you hire us
            </h2>

            <div className="mt-3 text-sm font-black uppercase tracking-[0.25em] text-accent-light">
              {images.length}+ Completed Projects
            </div>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-white/65 md:justify-self-end md:pb-1">
            Real roof replacements, storm restoration and exterior projects completed for {siteConfig.city} homeowners.
          </p>
        </div>
      </div>

      {/* The scroller island owns the .bleed-row ref + the A5 arrows. The row
       * itself breaks out of the container above to full viewport width, so it
       * lives OUTSIDE the max-width wrapper; the arrows sit back inside a
       * centred wrapper below it. */}
      <FilmstripScroller
        gap={20}
        label="projects"
        between={
          <Button href="/gallery" surface="dark" size="lg">
            View All
          </Button>
        }
        track={images.map((image, index) => (
          <div key={image} className="w-[78vw] sm:w-[420px] lg:w-[460px]">
            <Photo
              src={image}
              alt={projectAlts[index % projectAlts.length]}
              fill
              aspect="4/3"
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 420px, 78vw"
            />
          </div>
        ))}
      />
    </section>
  )
}
