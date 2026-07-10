import { siteConfig } from "@/lib/site-config"

const pool = ((siteConfig as { heroImages?: string[] }).heroImages) ?? []

/**
 * Deterministic cinematic hero background for an interior page, rotated by a
 * stable key (slug or page name) so each page gets a distinct image and the
 * same page always gets the same one across builds. Returns null when the
 * client has no cinematic images, so PageHero falls back to its gradient.
 */
export function heroImage(key: string): string | null {
  if (!pool.length) return null
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return pool[h % pool.length]
}
