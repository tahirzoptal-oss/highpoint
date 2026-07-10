"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

const projectAlts = [
  "Completed roofing project",
  "Roof replacement project",
  "Storm restoration project",
  "Roofing crew working",
  "Roof installation work",
  "Roof repair project",
]

const galleryImages = realGalleryImages()

// One tile per real project photo so the count and filmstrip reflect reality,
// cycling the alt copy when there are more photos than labels.
const projects = galleryImages.map((image, index) => ({
  image,
  alt: projectAlts[index % projectAlts.length],
}))

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryFilmstrip() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = () => setActive((prev) => (prev + 1) % projects.length)
  const prev = () => setActive((prev) => (prev - 1 + projects.length) % projects.length)

  useEffect(() => {
    if (paused) return
    // B30 motion guard: never autoplay for a reduced-motion visitor.
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = setInterval(next, 2000)
    return () => clearInterval(timer)
  }, [paused])

  const activeProject = projects[active]

  // Zero-data guard: this full variant needs 4+ real photos; the Gallery
  // dispatcher routes sparser clients to the two-up grid or nothing.
  if (projects.length < 4) return null

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
        <div className="mb-12 grid grid-cols-1 gap-6 text-left md:mb-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Past Work
            </p>

            <h2 data-scale="feature" className="font-heading">
              See the work before you hire us
            </h2>

            <div className="mt-3 text-sm font-black uppercase tracking-[0.25em] text-accent-light">
              {projects.length}+ Completed Projects
            </div>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-white/65 md:justify-self-end md:pb-1">
            Real roof replacements, repairs and exterior projects completed for local homeowners.
          </p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative mx-auto h-[560px] max-w-[1280px]">
            <Photo
              src={activeProject.image}
              alt={activeProject.alt}
              fill
              sizes="1120px"
              className="h-full shadow-2xl"
            />

            <button
              type="button"
              onClick={prev}
              className="absolute left-6 top-1/2 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-white text-primary-dark transition hover:bg-accent hover:text-[var(--color-on-accent)]"
              aria-label="Previous project"
            >
              <ChevronLeft className="size-6" />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-6 top-1/2 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-accent text-[var(--color-on-accent)] transition hover:brightness-95"
              aria-label="Next project"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          <div className="mx-auto mt-5 max-w-[1280px] overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {projects.map((project, index) => {
                const isActive = active === index

                return (
                  <button
                    key={project.image}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`relative h-24 w-40 shrink-0 rounded-[var(--photo-radius)] transition ${
                      isActive ? "scale-105 shadow-xl ring-4 ring-accent" : "opacity-55 hover:opacity-100"
                    }`}
                    aria-label={`View project ${index + 1}`}
                  >
                    <Photo
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="180px"
                      className="h-full"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-9 text-center">
            <Button href="/gallery" surface="dark" size="lg">
              See More Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
