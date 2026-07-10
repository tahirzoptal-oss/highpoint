import { ServiceCard } from "@/components/ServiceCard"
import { siteConfig } from "@/lib/site-config"

type Service = (typeof siteConfig.services)[number] & { slug?: string; category?: string; icon?: string }

const slugOf = (s: Service): string => s.slug ?? s.href.replace("/services/", "").replace(/\/$/, "")

/**
 * "Explore more" 3-up related-services silo for a service page. Prefers
 * same-category siblings, then fills from the rest. Internal-linking win;
 * renders nothing when the client has no other services.
 */
export function ServicesRelated({ currentSlug }: { currentSlug: string }) {
  const all = siteConfig.services as Service[]
  const current = all.find((s) => slugOf(s) === currentSlug)
  const others = all.filter((s) => slugOf(s) !== currentSlug)
  const sameCat = current?.category ? others.filter((s) => s.category === current.category) : []
  const related = [...sameCat, ...others.filter((s) => !sameCat.includes(s))].slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="section-y bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl md:text-3xl font-black font-heading text-foreground">
          Explore more of what we do
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map((s) => (
            <ServiceCard
              key={s.href}
              title={s.title}
              description={s.description}
              href={s.href}
              icon={s.icon || "Home"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
