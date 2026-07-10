import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { SectionHeading } from "@/components/SectionHeading"
import { CTABanner } from "@/components/CTABanner"
import { Photo } from "@/components/Photo"
import { realGalleryImages } from "@/components/gallery/gallery-images"
import { serviceAreas, siteConfig } from "@/lib/site-config"
import { heroImage } from "@/lib/hero-image"

export const metadata: Metadata = {
  title: `Roofing Project Gallery | ${siteConfig.name}`,
  description: `Browse completed roofing projects from ${siteConfig.name}. Roof replacements, storm damage repairs, siding, and gutters across ${siteConfig.city} and the surrounding ${siteConfig.region}.`,
  alternates: { canonical: "/gallery" },
}

// Project locations are drawn from the client's real service area, with the
// state from the brand address, so the gallery never shows another market.
const areaCities = serviceAreas.primary.length ? serviceAreas.primary : [siteConfig.city]
const st = siteConfig.address.state ? `, ${siteConfig.address.state}` : ""
const cityAt = (i: number) => `${areaCities[i % areaCities.length]}${st}`

const projectDetails = [
  {
    type: "Roof Replacement",
    city: cityAt(0),
    description: "Full architectural shingle replacement after hail damage.",
  },
  {
    type: "Storm Damage",
    city: cityAt(1),
    description: "Emergency tarp and full roof restoration following severe storms.",
  },
  {
    type: "Roof Replacement",
    city: cityAt(2),
    description: "Complete tear-off and re-roof with upgraded ventilation system.",
  },
  {
    type: "Siding & Gutters",
    city: cityAt(3),
    description: "Siding replacement with seamless gutter installation.",
  },
  {
    type: "Storm Damage",
    city: cityAt(4),
    description: "Insurance-covered roof and gutter replacement after wind damage.",
  },
  {
    type: "Roof Replacement",
    city: cityAt(5),
    description: "Premium dimensional shingle upgrade with ridge vent installation.",
  },
]

// Real photography only. Each captioned card pairs a harvested project photo
// with its details; a card without a photo never renders, and photos beyond
// the captioned six flow into the field grid below. Placeholder art is
// impossible on this page.
const images = realGalleryImages()
const projects = projectDetails
  .slice(0, images.length)
  .map((detail, i) => ({ ...detail, image: images[i] }))
const extraImages = images.slice(projectDetails.length)

export default function GalleryPage() {
  return (
    <>
      <PageHero
        image={heroImage("gallery")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Gallery" }]} />}
        eyebrow="Our Work"
        title="Recent Roofing Projects"
        subtitle={`A look at completed roofing and renovation work across ${siteConfig.city} and the ${siteConfig.region}.`}
      />

      {projects.length > 0 && (
        <section className="section-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Completed Projects"
              title="Recent Work"
              subtitle="Each project includes a thorough inspection, detailed documentation, professional installation, and a final walkthrough."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.image}
                  className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-accent/30 transition-colors"
                >
                  <div className="relative">
                    <Photo
                      src={project.image}
                      alt={`${project.type} in ${project.city}`}
                      aspect="4/3"
                      fill
                      sizes="600px"
                    />
                    <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-white bg-primary-dark/85 border border-white/20 rounded-full px-3 py-1">
                      {project.type}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-1 font-heading">
                      {project.type}
                    </h3>
                    <p className="text-sm text-accent mb-3">{project.city}</p>
                    <p className="text-muted text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {extraImages.length >= 2 && (
        <section className="section-y bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="From The Field"
              title="More Completed Projects"
              subtitle={`Every photo here is a real project completed by ${siteConfig.shortName} for a local property owner.`}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {extraImages.map((image, i) => (
                <Photo
                  key={image}
                  src={image}
                  alt={`Completed roofing project ${projectDetails.length + i + 1} by ${siteConfig.shortName}`}
                  aspect="4/3"
                  fill
                  sizes="400px"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner variant="split-form" />
    </>
  )
}
