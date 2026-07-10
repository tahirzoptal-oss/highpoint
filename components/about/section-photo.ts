import { siteConfig } from "@/lib/site-config"

/**
 * #4 section-image de-duplication.
 *
 * Before this helper every photo-bearing section resolved siteConfig
 * projectImages[0], so the SAME shot filled About, the WhyChooseUs photo, and
 * the first Services card at once (three copies of one crew photo down the
 * page). This helper hands each of the two slots it owns a DISTINCT image and,
 * critically, coordinates with the ONE other fixed-index photo consumer on the
 * page that it cannot edit: ServicesCategorycards.
 *
 * The Services grid is the collision the first pass missed. It renders one card
 * per service and each card reads projectImages[cardIndex % len], so the cards
 * claim the LOW indices 0, 1, 2 ... up the array in service order. A slot here
 * that also resolved to a low index (the old rule handed `why` index 2)
 * therefore landed the exact same shot as the same-numbered Services card
 * (repro: 6 services + 10 photos put project-2 on both the WhyChooseUs slot and
 * the third Services card). Steering the two owned slots to the HIGH end of the
 * array clears the whole Services run in one move:
 *   - Services cards own indices [0 .. serviceCount - 1],
 *   - `about` takes the last image [len - 1], `why` the one before it [len - 2],
 *   so neither slot can share an image with any Services card whenever the photo
 *   budget clears the service run (len > serviceCount), which is the common
 *   case (CRS: 10 photos, 6 services -> why [8], about [9], services [0..5]).
 *
 * When photos are scarce (len <= serviceCount) the pool must wrap and a fully
 * collision-free assignment is not possible, but the two owned slots still
 * differ across the back-to-back About/WhyChooseUs seam (n >= 2 keeps [len - 1]
 * and [len - 2] distinct), which is the guarantee the reader actually sees. It
 * never fabricates an index outside the array.
 *
 * Resolution is a pure function of slot + photo count, so both bands stay in
 * lock-step across every render without shared state. Zero-data guard intact:
 * no photos returns null, so a placeholder is never welded into any slot.
 */
export type SectionPhotoSlot = "why" | "about"

export function sectionPhoto(slot: SectionPhotoSlot): string | null {
  // projectImages is typed string[] in generated site-config, but an empty
  // array literal narrows to never[] on a photo-less client; the cast keeps the
  // index access a string so the no-photo case still compiles.
  const images = (siteConfig.projectImages ?? []) as string[]
  const n = images.length
  if (n === 0) return null
  if (n === 1) return images[0]

  // The Services grid claims the low indices [0 .. serviceCount - 1] (one card
  // per service, each reading projectImages[cardIndex % len]). Park the two
  // owned slots at the TWO HIGHEST indices so they clear that whole run: about
  // = last, why = second last. These two are always distinct from each other
  // because n >= 2 here, and whenever the photo budget outruns the service
  // count (len > serviceCount, the common case) neither can share an image with
  // any Services card. When photos are scarce the pool must wrap and a full
  // clear is impossible, but the two owned slots still differ across the
  // back-to-back About/WhyChooseUs seam, which is the guarantee that matters to
  // the reader.
  return slot === "about" ? images[n - 1] : images[n - 2]
}
