import { Star, Award, ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/**
 * Zero-data guard: a platform rating chip renders ONLY with real proof, a real
 * rating (> 0) AND at least MIN_REVIEWS reviews. Below that the strip falls
 * back to a years-in-business chip, then a license chip, then nothing.
 * A "0+" or "0.0" chip is impossible.
 */
const MIN_REVIEWS = 5

export function hasRealRating(rating: number, count: number): boolean {
  return rating > 0 && count >= MIN_REVIEWS
}

/** Parses a years value like "12" (or "12+") to a number; 0 when absent. */
export function yearsInBusiness(): number {
  return Number.parseInt(siteConfig.founder.yearsExperience, 10) || 0
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${i < filled ? "fill-star text-star" : "fill-transparent text-star/40"}`}
        />
      ))}
    </span>
  )
}

export function HeroReviewBadges() {
  const { googleUrl, facebookUrl, googleRating, googleCount, facebookRating, facebookCount } =
    siteConfig.reviews

  const platforms = [
    { name: "Google", logo: "/images/google-logo.svg", url: googleUrl, rating: googleRating, count: googleCount },
    { name: "Facebook", logo: "/images/facebook-logo.svg", url: facebookUrl, rating: facebookRating, count: facebookCount },
  ].filter((p) => hasRealRating(p.rating, p.count))

  if (platforms.length > 0) {
    return (
      <div className="flex flex-row flex-nowrap gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            className="flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} width={14} height={14} className="size-3.5 object-contain" />
              {p.name}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Stars rating={p.rating} />
              <strong>{p.rating.toFixed(1)}</strong>
            </div>
            <div className="text-xs text-white/60">{p.count}+ reviews</div>
          </a>
        ))}
      </div>
    )
  }

  const years = yearsInBusiness()

  if (years > 0) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
        <Award className="size-4 shrink-0 text-white" />
        <span className="text-sm font-bold">{years}+ Years in Business</span>
      </div>
    )
  }

  if (siteConfig.license) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
        <ShieldCheck className="size-4 shrink-0 text-white" />
        <span className="text-sm font-bold">{siteConfig.license}</span>
      </div>
    )
  }

  return null
}
