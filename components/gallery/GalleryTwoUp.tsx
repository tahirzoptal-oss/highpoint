import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { SectionHeading } from "@/components/SectionHeading"
import { siteConfig } from "@/lib/site-config"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

/**
 * Designed fallback for clients with only 2 or 3 real project photos.
 * Two photos sit side by side; a third (when present) leads as a wide
 * feature above them. Rendered by the Gallery dispatcher; the full
 * variants need 4+ real images.
 */

interface GalleryTwoUpProps {
  images: string[]
}

// Overlap moment 2.5 (receive side): when the offer card hangs over this
// band's top edge, .overlap-receive restores the content breathing room.
const RECEIVE_OVERLAP = offerOverGalleryActive()

export function GalleryTwoUp({ images }: GalleryTwoUpProps) {
  const hasFeature = images.length >= 3
  const feature = hasFeature ? images[0] : null
  const pair = hasFeature ? images.slice(1, 3) : images.slice(0, 2)

  return (
    <section
      className={`bg-background section-y${RECEIVE_OVERLAP ? " overlap-receive" : ""}`}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recent Work"
          title={`*Real* projects completed across ${siteConfig.city}`}
          subtitle={`Every photo here is a real project completed by ${siteConfig.shortName} for a local homeowner.`}
          scale="feature"
          layout="split"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {feature && (
            <Photo
              src={feature}
              alt={`Completed roofing project by ${siteConfig.shortName}`}
              aspect="16/9"
              fill
              sizes="1200px"
              className="md:col-span-2"
            />
          )}

          {pair.map((image, index) => (
            <Photo
              key={image}
              src={image}
              alt={`Roofing project ${index + 1} by ${siteConfig.shortName}`}
              aspect="4/3"
              fill
              sizes="600px"
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/gallery" surface="light" size="lg">
            View More Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
