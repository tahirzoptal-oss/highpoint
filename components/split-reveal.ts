import { designDNA } from "@/lib/design-dna"

/**
 * Split-half entrance directions (2B A2).
 *
 * The report choreography: in a two-half (photo/content) section, each half
 * slides in from ITS OWN side and the text half trails 120ms (.reveal-follow).
 * Only the directional packs get horizontal axes; every other pack keeps the
 * calm fade-up (direction "up"), matching the per-pack motion profiles in the
 * 2B matrix. The same pack set drives SectionRenderer's coarse section
 * entrances, so the fine and coarse choreography always agree.
 */

export type HalfDirection = "up" | "left" | "right"

const DIRECTIONAL_PACKS = new Set<string>([
  "commercial-authority",
  "industrial-contractor",
  "storm-response",
])

/** Direction for the half sitting on `side` of the split (desktop order). */
export function halfDirection(side: "left" | "right"): HalfDirection {
  return DIRECTIONAL_PACKS.has(designDNA.pack) ? side : "up"
}
