"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { SectionHeading } from "@/components/SectionHeading"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

const projectLocation = `${siteConfig.city}, ${siteConfig.address.state}`

const projectTitles = [
  "Roof Replacement",
  "Storm Restoration",
  "Shingle Roof Installation",
  "Exterior Roofing Work",
  "Roof Repair Project",
]

const galleryImages = realGalleryImages()

// One project per REAL photo (title copy cycles; photos never do), so the
// 3-card focus window is always three distinct photos. Sparser clients fall
// to the dispatcher's two-up/null guard paths.
const projects = galleryImages.map((image, index) => ({
  title: projectTitles[index % projectTitles.length],
  location: projectLocation,
  image,
}))

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryCenterFocus() {
  const [active, setActive] = useState(1)
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

  const visibleProjects = [
    { project: getProject(-1), position: "left" },
    { project: getProject(0), position: "center" },
    { project: getProject(1), position: "right" },
  ]

  // Zero-data guard: this full variant needs 4+ real photos; the Gallery
  // dispatcher routes sparser clients to the two-up grid or nothing.
  if (galleryImages.length < 4) return null

  return (
    <section
      className={`relative overflow-hidden bg-background section-y${
        RECEIVE_OVERLAP ? " overlap-receive" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in srgb, var(--color-accent) 12%, transparent),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Past Work"
          title={`Roof installations & *repairs* across ${siteConfig.city}`}
          subtitle="We do not just say we do quality work. We show it through real projects completed for local homeowners."
          scale="feature"
          layout="split"
        />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center justify-center gap-6 overflow-hidden">
            {visibleProjects.map(({ project, position }) => {
              const isCenter = position === "center"

              return (
                <div
                  key={`${project.image}-${position}`}
                  className={`relative shrink-0 transition-all duration-500 ${
                    isCenter
                      ? "h-[430px] w-[620px] opacity-100"
                      : "h-[340px] w-[420px] opacity-70"
                  }`}
                >
                  <Photo
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={isCenter ? "620px" : "420px"}
                    className={`h-full w-full ${isCenter ? "shadow-2xl" : "shadow-xl"}`}
                  />
                </div>
              )
            })}
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
      </div>
    </section>
  )
}
