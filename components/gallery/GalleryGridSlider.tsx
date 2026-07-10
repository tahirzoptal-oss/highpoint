"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { SectionHeading } from "@/components/SectionHeading"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

const projects = realGalleryImages()

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryGridSlider() {
  const [page, setPage] = useState(0)

  const perPage = 6
  const totalPages = Math.ceil(projects.length / perPage)

  const currentProjects = projects.slice(
    page * perPage,
    page * perPage + perPage
  )

  // Zero-data guard: this full variant needs 4+ real photos; the Gallery
  // dispatcher routes sparser clients to the two-up grid or nothing.
  if (projects.length < 4) return null

  return (
    <section
      className={`bg-background section-y${RECEIVE_OVERLAP ? " overlap-receive" : ""}`}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recent Work"
          title="Roofing installations & *repairs*"
          subtitle="Browse recent projects completed by our team throughout the area."
          scale="feature"
          layout="split"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {currentProjects.map((image, index) => (
            <Photo
              key={image}
              src={image}
              alt={`Completed roofing project ${page * perPage + index + 1}`}
              fill
              aspect="4/3"
              sizes="420px"
              /* B6: the lead tile takes the octagon blade mask under sharp mode
               * (no-op on rounded packs) so the gallery renders the V6 grammar
               * even when the sparser grid fallback runs instead of the mosaic.
               * No corner brackets here: the mosaic centrepiece owns the second
               * bracketed frame, holding the max-2-per-page budget. */
              bladeFrame={page === 0 && index === 0}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
            }
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  page === index ? "bg-accent" : "bg-black/15"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
            }
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
