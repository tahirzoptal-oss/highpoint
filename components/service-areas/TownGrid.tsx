import { MapPin } from "lucide-react"
import { serviceAreas, siteConfig } from "@/lib/site-config"

/**
 * Zero-data guard for the map slot. The map iframe renders ONLY when the
 * per-client config carries a real embed URL (mapEmbedUrl). There is no
 * derived-query fallback, so a grey placeholder sheet is impossible; the
 * variants render the typeset TownGrid at full width instead.
 */
type SiteConfigWithMap = typeof siteConfig & { mapEmbedUrl?: string }

export function getMapEmbedUrl(): string | null {
  const url = (siteConfig as SiteConfigWithMap).mapEmbedUrl
  return typeof url === "string" && url.startsWith("https://") ? url : null
}

/**
 * TownGrid, the designed typeset town grid. A numbered, hairline-ruled grid of
 * service towns that fills the width when no real map embed exists.
 */
export function TownGrid({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark"
  className?: string
}) {
  const cities = [...serviceAreas.primary, ...serviceAreas.secondary]
  if (!cities.length) return null

  const line = tone === "dark" ? "border-white/10" : "border-black/10"
  const name = tone === "dark" ? "text-white" : "text-primary-dark"
  const index = tone === "dark" ? "text-white/40" : "text-primary-dark/40"
  const pin = tone === "dark" ? "text-accent-light" : "text-accent"

  return (
    <div
      className={`grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border sm:grid-cols-3 lg:grid-cols-4 ${line} ${className}`}
    >
      {cities.map((city, i) => (
        <div key={city} className={`border-b border-r p-5 sm:p-6 ${line}`}>
          <div
            className={`flex items-center justify-between text-[11px] font-black tracking-[0.2em] ${index}`}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <MapPin className={`size-3.5 ${pin}`} />
          </div>
          <div
            className={`mt-2 font-heading text-lg font-black uppercase leading-tight ${name}`}
          >
            {city}
          </div>
        </div>
      ))}
    </div>
  )
}
