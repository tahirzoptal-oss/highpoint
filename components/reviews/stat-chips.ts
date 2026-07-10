import { siteConfig } from "@/lib/site-config"

/**
 * Source stat chips for the review sections (marquee, wall, slider).
 *
 * Zero-data guard: a review platform earns a chip ONLY when it has at least
 * MIN_SOURCE_COUNT real reviews. Thin or absent sources are substituted with
 * years-in-business and license chips, so no section ever brags about a
 * platform the client barely uses, and placeholder stats are impossible.
 */

export const MIN_SOURCE_COUNT = 5

export interface ReviewStatChip {
  kind: "google-rating" | "google-count" | "facebook-count" | "years" | "license"
  value: string
  /** Caption under the value. Empty for a self-describing license credential
   * (its value already reads "Licensed X Contractor"), so consumers render a
   * single line and never stack a near-duplicate caption. */
  label: string
  logo?: string
  rating?: number
}

/**
 * A "generic" license string is a credential phrase ("Licensed CO Contractor",
 * "Licensed & Insured", "Fully Licensed & Insured") rather than a real number
 * (a license number like "EC13005678" or "CCC1330123"). Generic strings are
 * self-describing, so pairing them with a "Licensed & Insured" caption stacks
 * the same words twice; consumers render them as a single line with no caption.
 * A value carrying a digit is a real license number and keeps its caption.
 */
export function isGenericLicense(value: string): boolean {
  return !/\d/.test(value)
}

export function getReviewStatChips(max = 3): ReviewStatChip[] {
  const { googleRating, googleCount, facebookCount } = siteConfig.reviews
  const chips: ReviewStatChip[] = []

  if (googleCount >= MIN_SOURCE_COUNT) {
    chips.push({
      kind: "google-rating",
      value: googleRating.toFixed(1),
      label: "Google Rating",
      logo: "/images/google-logo.svg",
      rating: googleRating,
    })
    chips.push({
      kind: "google-count",
      value: `${googleCount}+`,
      label: "Google Reviews",
      logo: "/images/google-logo.svg",
    })
  }

  if (facebookCount >= MIN_SOURCE_COUNT) {
    chips.push({
      kind: "facebook-count",
      value: `${facebookCount}+`,
      label: "Facebook Reviews",
      logo: "/images/facebook-logo.svg",
    })
  }

  const years = siteConfig.founder.yearsExperience
  if (chips.length < max && years) {
    chips.push({ kind: "years", value: `${years}+`, label: "Years in Business" })
  }
  if (chips.length < max && siteConfig.license) {
    // #3: a generic license phrase ("Licensed CO Contractor") is self-describing,
    // so it carries NO caption (empty label) and renders one line, never the
    // value stacked over a near-identical "Licensed & Insured" caption. A real
    // license number keeps its "License No." caption. It stays genuine last-resort
    // filler after the numeric chips above, so it never pads a 3-up with a
    // duplicate-text card.
    const generic = isGenericLicense(siteConfig.license)
    chips.push({
      kind: "license",
      value: siteConfig.license,
      label: generic ? "" : "License No.",
    })
  }

  return chips.slice(0, max)
}

/** Review platforms with enough real volume to be claimed in section copy. */
export function qualifiedReviewSources(): ("Google" | "Facebook")[] {
  const sources: ("Google" | "Facebook")[] = []
  if (siteConfig.reviews.googleCount >= MIN_SOURCE_COUNT) sources.push("Google")
  if (siteConfig.reviews.facebookCount >= MIN_SOURCE_COUNT) sources.push("Facebook")
  return sources
}
