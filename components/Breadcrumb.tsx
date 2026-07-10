import Link from "next/link"
import { ChevronRight } from "lucide-react"

/**
 * Visible breadcrumb trail. The last item is the current page (no link). Pair
 * with getBreadcrumbSchema() on the page for the matching BreadcrumbList JSON-LD.
 * tone="dark" for the white-on-dark hero bands; tone="light" for light bands.
 */
export function Breadcrumb({
  items,
  tone = "dark",
}: {
  items: { name: string; href?: string }[]
  tone?: "dark" | "light"
}) {
  const base = tone === "dark" ? "text-white/60" : "text-muted"
  const current = tone === "dark" ? "text-white/90" : "text-foreground"
  const link = tone === "dark" ? "hover:text-white" : "hover:text-accent"
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs font-semibold ${base}`}>
      {items.map((it, i) => {
        const last = i === items.length - 1
        return (
          <span key={it.name} className="inline-flex items-center gap-1.5">
            {it.href && !last ? (
              <Link href={it.href} className={`${link} transition-colors`}>{it.name}</Link>
            ) : (
              <span className={last ? current : undefined}>{it.name}</span>
            )}
            {!last && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
          </span>
        )
      })}
    </nav>
  )
}
