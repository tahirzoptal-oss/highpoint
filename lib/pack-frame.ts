import { designDNA } from "@/lib/design-dna"

/**
 * B11: the per-pack signature FEATURE-photo frame. Only the packs whose corpus
 * signature is offset-block depth get the hard slab; the rest render the plain
 * framed photo (their signature lives in the seal, blade or bracket instead).
 * tactical-tech and editorial-monochrome extend this in B12/B13.
 */
const PACK_FRAME: Record<string, "slab" | "circle" | undefined> = {
  "commercial-authority": "slab",
  "industrial-contractor": "slab",
  "storm-response": "slab",
}

export function packFrame(): "slab" | "circle" | undefined {
  return PACK_FRAME[designDNA.pack]
}
