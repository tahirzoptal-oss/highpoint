import {
  ShieldCheck,
  Factory,
  BadgeCheck,
  MapPin,
  CloudLightning,
  FileCheck,
} from "lucide-react"
import { siteConfig, trustBadges } from "@/lib/site-config"
import { MIN_SOURCE_COUNT } from "@/components/reviews/stat-chips"

// Real platform logos (live in public/images). Used wherever a platform badge
// belongs, instead of a generic star icon.
const platformLogos: Record<string, string> = {
  "Google Reviews": "/images/google-logo.svg",
  "Facebook Reviews": "/images/facebook-logo.svg",
  "BBB Accredited": "/images/bbb-logo.svg",
}

const badgeIcons: Record<string, React.ReactNode> = {
  "Fully Insured": <ShieldCheck className="size-4 shrink-0" />,
  "Licensed & Insured": <ShieldCheck className="size-4 shrink-0" />,
  "Manufacturer Approved": <Factory className="size-4 shrink-0" />,
  "Warranty Backed": <BadgeCheck className="size-4 shrink-0" />,
  "Locally Owned & Operated": <MapPin className="size-4 shrink-0" />,
  "Storm Restoration": <CloudLightning className="size-4 shrink-0" />,
  "Insurance Restoration Specialists": <FileCheck className="size-4 shrink-0" />,
}

interface TrustBadgesProps {
  variant?: "light" | "dark"
}

export function TrustBadges({ variant = "light" }: TrustBadgesProps) {
  const pillClasses =
    variant === "light"
      ? "bg-white/10 backdrop-blur-sm text-white/90 border border-white/10"
      : "bg-primary-dark/80 text-white border border-border"

  // Zero-data guard: a review-platform pill earns its place only when that
  // platform has real review volume behind it; credential pills always render.
  const { googleCount, facebookCount } = siteConfig.reviews
  const badges = trustBadges.filter((badge) => {
    if (badge.label === "Google Reviews") return googleCount >= MIN_SOURCE_COUNT
    if (badge.label === "Facebook Reviews") return facebookCount >= MIN_SOURCE_COUNT
    return true
  })

  if (!badges.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const logo = platformLogos[badge.label]

        return (
          <span
            key={badge.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${pillClasses}`}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={badge.label} className="size-4 shrink-0" />
            ) : (
              badgeIcons[badge.label]
            )}
            {badge.value}
          </span>
        )
      })}
    </div>
  )
}
