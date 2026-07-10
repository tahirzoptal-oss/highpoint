import { designDNA } from "@/lib/design-dna"
import { siteConfig } from "@/lib/site-config"

/**
 * B07: the seal is a family / heritage / veteran register device. Only these
 * packs get one; every other pack returns null so no stamp ships. The ring text
 * is real (city + trade), never invented.
 */
const SEAL_PACKS = new Set<string>([
  "family-owned",
  "luxury-premium",
  "storm-response",
])

export function packSeal(): { ring: string } | null {
  if (!SEAL_PACKS.has(designDNA.pack)) return null
  const city = (siteConfig.city || "").toUpperCase()
  return { ring: city ? `${city} • ROOFING` : "ROOFING • QUALITY" }
}
