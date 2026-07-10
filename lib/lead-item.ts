// B05: "the first item" is one named decision, shared across the repeating-set
// components so exactly one item per set reads active (first FAQ open, first
// process step solid, first card ringed, first city chip active).
export const LEAD_INDEX = 0

export function isLead(i: number): boolean {
  return i === LEAD_INDEX
}
