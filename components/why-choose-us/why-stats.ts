import { siteConfig } from "@/lib/site-config"
import { MIN_SOURCE_COUNT } from "@/components/reviews/stat-chips"

/**
 * Guarded stat source for the WhyChooseUs stat moments (spec 2.2 anchor tile
 * figure, spec 2.5 photo-corner overlap badge).
 *
 * Zero-data guard: only real client facts qualify. Years in business leads,
 * then the Google rating and review count, each gated on real review volume
 * (same MIN_SOURCE_COUNT rule the review stat chips use). An empty array means
 * no figure and no badge render; nothing placeholder ever ships.
 */

export interface WhyStat {
  value: string
  label: string
}

export function getWhyStats(): WhyStat[] {
  const stats: WhyStat[] = []

  const years = siteConfig.founder.yearsExperience
  if (years) {
    stats.push({ value: `${years}+`, label: "Years in Business" })
  }

  const { googleRating, googleCount } = siteConfig.reviews
  if (googleCount >= MIN_SOURCE_COUNT) {
    stats.push({ value: googleRating.toFixed(1), label: "Google Rating" })
    stats.push({ value: `${googleCount}+`, label: "Google Reviews" })
  }

  return stats
}
