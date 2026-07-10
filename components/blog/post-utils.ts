import { siteConfig } from "@/lib/site-config"

/**
 * Shared post shape + thumbnail guard for the blog section variants.
 *
 * The build bridge may emit posts without real art. A thumbnail only counts
 * when it is a real client asset, never a placeholder path. Cards without one
 * render the designed text-only treatment (headline + excerpt + date), so a
 * grey image slot is impossible.
 */

export type BlogPost = {
  slug?: string
  href?: string
  title: string
  hook?: string
  excerpt?: string
  body?: string
  byline?: string
  category?: string
  date?: string
  image?: string
}

export const blogPosts: readonly BlogPost[] = siteConfig.blogPosts ?? []

// Real harvested project photos, the same pool About/CTA/FAQ/Hero fall back to.
const galleryPool = (siteConfig.projectImages ?? []) as string[]

export function postThumb(post: BlogPost, index = 0): string | null {
  const authored = post.image ?? ""
  if (authored && !authored.toLowerCase().includes("placeholder")) return authored
  // Fallback: reuse a real client project photo, distinct per card, never a
  // placeholder or fabricated asset. Photo-less clients still return null (the
  // designed text-only card renders, so no grey slot ever ships).
  if (galleryPool.length) return galleryPool[index % galleryPool.length]
  return null
}
