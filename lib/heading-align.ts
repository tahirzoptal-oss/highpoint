import { PACK_POOLS, type DesignPack, type SectionKey } from "@/lib/design-dna"

/**
 * B09: which section variants render a SPLIT SectionHeading (headline left,
 * subtitle right) versus the default centered/stacked cadence. Sourced from the
 * `layout="split"` call sites. Everything not listed here is centered.
 *
 * The determinism problem: if a pack's PACK_POOLS pool for a section holds both
 * a split and a centered variant, a seeded anti-duplicate swap flips the heading
 * alignment between two clients on the same pack, so the pack "reads as a
 * sequence of templates rather than one grid". The assertion below fails the
 * build closed if any pool mixes alignment, so the pools stay homogeneous by
 * construction; a client that genuinely wants the odd variant still reaches it
 * through an explicit design-dna.sections override (which resolves off the
 * global VARIANT_POOLS, not the pack pool).
 */
const SPLIT_VARIANTS = new Set<string>(["bento"])

export function variantAlignment(variant: string): "split" | "centered" {
  return SPLIT_VARIANTS.has(variant) ? "split" : "centered"
}

/**
 * B09 named build-time executor: throws if any pack's PACK_POOLS section pool
 * mixes split and centered heading variants. Runs on the server during
 * `next build` (skipped in the browser bundle) via the side-effect import in
 * SectionRenderer, so a mixed pool aborts the build rather than shipping drift.
 */
export function assertPoolAlignmentHomogeneous(): void {
  for (const pack of Object.keys(PACK_POOLS) as DesignPack[]) {
    const pools = PACK_POOLS[pack]
    for (const section of Object.keys(pools) as SectionKey[]) {
      const variants = pools[section] ?? []
      if (variants.length < 2) continue
      const aligns = new Set(variants.map(variantAlignment))
      if (aligns.size > 1) {
        throw new Error(
          `[heading-align] ${pack}.${String(section)} pool mixes heading alignment ` +
            `(split + centered): ${variants.join(", ")}. Curate the pool so a seeded ` +
            `swap cannot flip alignment.`,
        )
      }
    }
  }
}

if (typeof window === "undefined") {
  assertPoolAlignmentHomogeneous()
}
