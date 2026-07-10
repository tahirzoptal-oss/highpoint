"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

const projectLocation = `${siteConfig.city}, ${siteConfig.address.state}`

const projectDetails = [
  { title: "Full Roof Replacement", type: "Residential Roofing" },
  { title: "Storm Damage Restoration", type: "Storm Restoration" },
  { title: "Shingle Roof Replacement", type: "Roof Replacement" },
  { title: "Siding & Gutter Install", type: "Exterior Services" },
]

const galleryImages = realGalleryImages()

// One card per REAL photo, capped at the four detail slots. Never round-robin
// a photo to fill a slot: with fewer than 4 real photos the dispatcher routes
// to the two-up/null guard path instead.
const projects = galleryImages
  .slice(0, projectDetails.length)
  .map((image, index) => ({
    ...projectDetails[index],
    location: projectLocation,
    image,
  }))

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function RecentWorkSlider() {
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

  const activeProject = projects[active]

  // Zero-data guard: this full variant needs 4+ real photos; the Gallery
  // dispatcher routes sparser clients to the two-up grid or nothing.
  if (galleryImages.length < 4) return null

  return (
    <section
      className={`relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white${
        RECEIVE_OVERLAP ? " overlap-receive" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 14%, transparent),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* Split header (heading map: Gallery = feature/split). Hand-rolled on
         * this dark band because SectionHeading's accent eyebrow text is banned
         * on dark surfaces; the accent-light eyebrow + eyebrow-mark keep the
         * same family anatomy with dark-safe paint. */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Recent Work
            </p>

            <h2 data-scale="feature" className="font-heading">
              Real roofing projects completed across {siteConfig.city}
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-lg leading-relaxed text-white/65">
              Browse real roof replacements, storm restoration projects and exterior upgrades completed by {siteConfig.shortName}.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={prev}
                className="grid size-12 place-items-center rounded-xl bg-white text-primary-dark transition hover:bg-accent hover:text-[var(--color-on-accent)]"
                aria-label="Previous project"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={next}
                className="grid size-12 place-items-center rounded-xl bg-accent text-[var(--color-on-accent)] transition hover:brightness-95"
                aria-label="Next project"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[560px]">
            <Photo
              src={activeProject.image}
              alt={activeProject.title}
              fill
              sizes="760px"
              scrim="bottom"
              className="h-full min-h-[560px] shadow-2xl"
            />

            <div className="absolute left-6 top-6 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)]">
              {activeProject.type}
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-4xl font-black uppercase leading-tight">
                {activeProject.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-white/75">
                <MapPin className="size-5 text-white/75" />
                <span className="font-bold">{activeProject.location}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {projects.map((project, index) => {
              const isActive = active === index

              return (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`group flex gap-4 rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-accent bg-white text-primary-dark"
                      : "border-white/15 bg-white/10 text-white hover:border-accent"
                  }`}
                >
                  <div className="relative h-24 w-32 shrink-0">
                    <Photo
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="128px"
                      className="h-full"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-accent" : "text-white/70"}`}>
                      {project.type}
                    </div>
                    <div className="mt-1 text-lg font-black">{project.title}</div>
                    <div className={`mt-1 flex items-center gap-1 text-sm ${isActive ? "text-primary-dark/55" : "text-white/70"}`}>
                      <MapPin className={`size-4 ${isActive ? "text-accent" : "text-white/70"}`} />
                      {project.location}
                    </div>
                  </div>
                </button>
              )
            })}

            <Button href="/gallery" surface="dark" size="lg" className="mt-2">
              View More Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
