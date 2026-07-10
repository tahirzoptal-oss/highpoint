import { RecentWorkSlider } from "@/components/gallery/RecentWorkSlider"
import { GalleryMosaicSlider } from "@/components/gallery/GalleryMosaicSlider"
import { GalleryFilmstrip } from "@/components/gallery/GalleryFilmstrip"
import { GalleryEdgeFilmstrip } from "@/components/gallery/GalleryEdgeFilmstrip"
import { GalleryCenterFocus } from "@/components/gallery/GalleryCenterFocus"
import { GalleryGridSlider } from "@/components/gallery/GalleryGridSlider"
import { GalleryTwoUp } from "@/components/gallery/GalleryTwoUp"
import { realGalleryImages } from "@/components/gallery/gallery-images"

import type { GalleryVariant } from "@/lib/component-registry"

export function Gallery({
  variant = "carousel",
}: {
  variant?: GalleryVariant
}) {
  // Zero-data guard: fewer than 2 real photos = no section, 2 or 3 = the
  // designed two-up grid, 4+ = the full variant. Placeholder art never ships,
  // and no variant may ever repeat the same photo to fill a slot: a client
  // with too few photos falls to a sparser designed layout, never round-robin.
  const images = realGalleryImages()

  if (images.length < 2) return null
  if (images.length < 4) return <GalleryTwoUp images={images} />

  switch (variant) {
    case "masonry":
      // The mosaic needs 5 distinct photos for its 5 tiles. With exactly 4
      // real photos the grid slider shows the real four instead of repeating.
      return images.length >= 5 ? <GalleryMosaicSlider /> : <GalleryGridSlider />

    case "edge-filmstrip":
      // 2B F1: the edge-bleed filmstrip. Real photos only, no round-robin,
      // CLS-safe fixed-aspect tiles, A5 arrows drive the .bleed-row scroll.
      return <GalleryEdgeFilmstrip />

    case "full-width-slider":
      return <GalleryFilmstrip />

    case "featured-project":
      return <GalleryCenterFocus />

    case "grid-slider":
      return <GalleryGridSlider />

    case "carousel":
    default:
      return <RecentWorkSlider />
  }
}
