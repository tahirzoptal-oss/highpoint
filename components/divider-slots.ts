import { designDNA, type DesignPack } from "@/lib/design-dna"

/**
 * Roof-ridge divider slot map (B04). Mirrors pattern-slots.ts. The ridge is a
 * thin top-edge SEAM (not a body fill), so it may coexist with a band's pattern
 * texture. Assigned per pack to at most DIVIDER_BUDGET.maxPerPage sections. A
 * named build-time assertion (assertDividerSlots, run below during `next build`)
 * fails the build closed if any pack exceeds the budget.
 */

export const DIVIDER_SHAPES = ["ridge", "gable"] as const
export type DividerShape = (typeof DIVIDER_SHAPES)[number]

export const DIVIDER_BUDGET = {
  maxPerPage: 2,
  tintOpacity: { min: 0.1, max: 0.12 },
} as const

export type DividerSlotSection = "services" | "faq" | "cta" | "serviceAreas"

export interface DividerSlotSpec {
  shape: DividerShape
  edge: "top" | "bottom"
  opacity: number
}

/**
 * Per-pack ridge. Landed on the closer CTA band (a universal, relative-
 * positioned band across every pack), shape and opacity varied for character:
 * heavier gable for the family/heritage register, tighter ridge elsewhere.
 */
export const PACK_DIVIDERS: Record<
  DesignPack,
  Partial<Record<DividerSlotSection, DividerSlotSpec>>
> = {
  "owner-authority": { cta: { shape: "ridge", edge: "top", opacity: 0.11 } },
  "commercial-authority": { cta: { shape: "ridge", edge: "top", opacity: 0.1 } },
  "family-owned": { cta: { shape: "gable", edge: "top", opacity: 0.12 } },
  "industrial-contractor": { cta: { shape: "ridge", edge: "top", opacity: 0.12 } },
  "luxury-premium": { cta: { shape: "ridge", edge: "top", opacity: 0.1 } },
  "storm-response": { cta: { shape: "ridge", edge: "top", opacity: 0.11 } },
  "modern-corporate": { cta: { shape: "ridge", edge: "top", opacity: 0.1 } },
  "tactical-tech": { cta: { shape: "ridge", edge: "top", opacity: 0.12 } },
  "editorial-monochrome": { cta: { shape: "ridge", edge: "top", opacity: 0.1 } },
}

export function getDividerSlot(section: DividerSlotSection): DividerSlotSpec | null {
  return PACK_DIVIDERS[designDNA.pack][section] ?? null
}

/**
 * B04 named build-time executor: fail the build if any pack exceeds the ridge
 * budget. Runs on the server during `next build` (skipped in the browser
 * bundle), so a bad slot map aborts the build rather than shipping.
 */
export function assertDividerSlots(): void {
  for (const pack of Object.keys(PACK_DIVIDERS) as DesignPack[]) {
    const n = Object.keys(PACK_DIVIDERS[pack]).length
    if (n > DIVIDER_BUDGET.maxPerPage) {
      throw new Error(
        `[divider-slots] ${pack} exceeds maxPerPage (${n} > ${DIVIDER_BUDGET.maxPerPage})`,
      )
    }
  }
}

if (typeof window === "undefined") {
  assertDividerSlots()
}
