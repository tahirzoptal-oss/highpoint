import { designDNA, type DesignPack } from "@/lib/design-dna"
import type { PatternMotif } from "@/components/BandPattern"

/**
 * Pattern slot map (2B C1/C3), the C3 pack motif map made concrete.
 *
 * The ruling budget (Juan, calibrated middle, 2026-07-03) is max 3 patterned
 * bands per PAGE: up to 2 dark bands at 0.04-0.08 plus up to 1 light band at
 * 0.05-0.08, motif fixed per pack, never on the hero and never on the accent
 * crescendo band. Because a page renders each section once, the budget is
 * held STRUCTURALLY here: every pack maps at most two dark section slots and
 * one light section slot, and a band variant only asks for its own section's
 * slot. A seeded variant swap that lands a light variant in a patterned slot
 * simply renders no pattern (under budget is always legal).
 *
 * C3 map (phase2b-craft-research):
 *   owner-authority        none (photography carries texture)
 *   commercial-authority   blueprint-grid 0.06 on the cta dark band (its one
 *                          allotted dark pattern band, the signature grid)
 *   family-owned           shingle 0.05 on one warm-tint band (services)
 *   industrial-contractor  blade-shards (cta dark band) + facet-mesh (footer),
 *                          the 2-dark-band budget
 *   luxury-premium         blade-shards dark-on-dark on one band (serviceAreas
 *                          dark-map); the C3 0.03 clamps up to the ruling
 *                          minimum 0.04
 *   storm-response         none (fast flat ping-pong is the signature; the
 *                          allowed chevron override has no plumbing yet)
 *   modern-corporate       dot-grid on one tinted sheet (faq); the C3 0.04
 *                          clamps up to the light minimum 0.05
 */

export interface PatternSlotSpec {
  motif: PatternMotif
  band: "dark" | "light"
  opacity: number
}

export type PatternSlotSection =
  | "services"
  | "faq"
  | "cta"
  | "footer"
  | "serviceAreas"

const PACK_PATTERN_SLOTS: Record<
  DesignPack,
  Partial<Record<PatternSlotSection, PatternSlotSpec>>
> = {
  "owner-authority": {},
  "commercial-authority": {
    cta: { motif: "blueprint-grid", band: "dark", opacity: 0.12 },
  },
  "family-owned": {
    services: { motif: "shingle", band: "light", opacity: 0.10 },
  },
  "industrial-contractor": {
    cta: { motif: "blade-shards", band: "dark", opacity: 0.12 },
    footer: { motif: "facet-mesh", band: "dark", opacity: 0.10 },
  },
  "luxury-premium": {
    serviceAreas: { motif: "blade-shards", band: "dark", opacity: 0.11 },
  },
  "storm-response": {},
  "modern-corporate": {
    faq: { motif: "dot-grid", band: "light", opacity: 0.11 },
  },
  "tactical-tech": {
    cta: { motif: "blade-shards", band: "dark", opacity: 0.10 },
  },
  "editorial-monochrome": {},
}

/**
 * The pattern spec for a section slot under the current pack, or null.
 * Callers render <BandPattern> only on a matching band surface (dark spec on
 * a dark band variant, light spec on a tinted one); hero and the crescendo
 * never call this.
 */
export function getPatternSlot(
  section: PatternSlotSection
): PatternSlotSpec | null {
  return PACK_PATTERN_SLOTS[designDNA.pack][section] ?? null
}
