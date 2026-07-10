"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { SectionHeading } from "@/components/SectionHeading"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

const projectAlts = [
  "Completed roofing project",
  "Roofing project exterior",
  "Roof repair project",
  "Roofing crew working",
  "Roof installation work",
  "Storm damage repair",
]

const galleryImages = realGalleryImages()

// One tile per REAL photo (alt copy cycles; photos never do). The 5-tile
// mosaic window stays distinct because the dispatcher only routes here with
// 5+ real photos; sparser clients fall to the grid/two-up guard paths.
const projects = galleryImages.map((image, index) => ({
  image,
  alt: projectAlts[index % projectAlts.length],
}))

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryMosaicSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = () => setActive((prev) => (prev + 1) % projects.length)
  const prev = () => setActive((prev) => (prev - 1 + projects.length) % projects.length)

  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      next()
    }, 3500)

    return () => clearInterval(timer)
  }, [paused])

  const getProject = (offset: number) => {
    return projects[(active + offset + projects.length) % projects.length]
  }

  const mosaic = [
    getProject(0),
    getProject(1),
    getProject(2),
    getProject(3),
    getProject(4),
  ]

  // Zero-data guard: the 5-tile mosaic needs 5+ real photos so no photo ever
  // repeats; the Gallery dispatcher routes sparser clients to the grid
  // slider, the two-up grid, or nothing.
  if (galleryImages.length < 5) return null

  return (
    <section
      className={`surface-band relative overflow-hidden bg-[var(--color-surface)] section-y${
        RECEIVE_OVERLAP ? " overlap-receive" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in srgb, var(--color-accent) 12%, transparent),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Past Work"
          title="Real *value* shows after the job is done"
          subtitle="Every project shown here was completed for a real homeowner who needed more than a quick fix, they needed a roofing contractor they could trust."
          scale="feature"
          layout="split"
        />

        <div
          className="grid grid-cols-1 gap-4 lg:grid-cols-[0.72fr_1.35fr_0.72fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid gap-4">
            <Photo
              src={mosaic[0].image}
              alt={mosaic[0].alt}
              fill
              sizes="360px"
              className="h-[230px] shadow-xl"
            />

            <Photo
              src={mosaic[1].image}
              alt={mosaic[1].alt}
              fill
              sizes="360px"
              className="h-[230px] shadow-xl"
            />
          </div>

          {/* B6: the mosaic centrepiece is the one gallery photo that takes the
           * octagon blade mask + detached corner brackets under sharp mode. Both
           * .blade-frame and .corner-brackets are NO-OPS outside html[data-corner
           * ="sharp"] (globals.css scopes them), so rounded packs render the plain
           * framed feature photo. Budget: this is the second bracketed frame on the
           * page (About carries the first), inside the max-2-per-page limit. */}
          <Photo
            src={mosaic[2].image}
            alt={mosaic[2].alt}
            fill
            sizes="720px"
            bladeFrame
            className="corner-brackets h-full min-h-[476px] shadow-2xl"
          />

          <div className="grid gap-4">
            <Photo
              src={mosaic[3].image}
              alt={mosaic[3].alt}
              fill
              sizes="360px"
              className="h-[230px] shadow-xl"
            />

            <Photo
              src={mosaic[4].image}
              alt={mosaic[4].alt}
              fill
              sizes="360px"
              className="h-[230px] shadow-xl"
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={prev}
            className="grid size-14 place-items-center rounded-full border border-black/20 bg-white text-primary-dark transition hover:border-accent hover:bg-accent hover:text-[var(--color-on-accent)]"
            aria-label="Previous project"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  active === index ? "w-10 bg-accent" : "w-2.5 bg-black/20"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="grid size-14 place-items-center rounded-full border border-black/20 bg-white text-primary-dark transition hover:border-accent hover:bg-accent hover:text-[var(--color-on-accent)]"
            aria-label="Next project"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <Button href="/gallery" surface="light" size="lg">
            See More Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
