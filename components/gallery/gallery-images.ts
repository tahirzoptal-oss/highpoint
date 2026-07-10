import { siteConfig } from "@/lib/site-config"

/**
 * Real project photography only. A gallery image counts when it comes from
 * siteConfig with a non-placeholder path. The Gallery dispatcher uses the
 * count to pick full variant / two-up / nothing, so placeholder art is
 * impossible in this family.
 */
export function realGalleryImages(): string[] {
  // projectImages is typed string[] in generated site-config, but an empty
  // array literal ([]) narrows to never[] on a client with no photos (e.g.
  // Summit Ridge). The cast keeps the filter callback's `src` a string so the
  // no-image case still compiles.
  const images = (siteConfig.projectImages ?? []) as string[]
  return images.filter(
    (src) => Boolean(src) && !src.toLowerCase().includes("placeholder")
  )
}
