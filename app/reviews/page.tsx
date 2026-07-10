import type { Metadata } from "next"
import { Star } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { CTABanner } from "@/components/CTABanner"
import { heroImage } from "@/lib/hero-image"

type Review = { platform: string; rating: number; quote: string; reviewer: string; location?: string }

export const metadata: Metadata = {
  title: `Reviews | ${siteConfig.reviews.googleRating.toFixed(1)} Stars | ${siteConfig.name}`,
  description: `Read what ${siteConfig.city} homeowners say about ${siteConfig.name}. ${siteConfig.reviews.googleRating.toFixed(1)}-star rated roofing and renovation. Call ${siteConfig.phone} for a free inspection.`,
  alternates: { canonical: "/reviews" },
}

export default function ReviewsPage() {
  const layout = getLayout()
  const r = siteConfig.reviews as {
    wall?: Review[]
    items?: Review[]
    googleRating: number
    googleCount: number
  }
  const reviews: Review[] = r.wall && r.wall.length ? r.wall : r.items ?? []
  const rating = r.googleRating
  const count = r.googleCount

  return (
    <>
      <PageHero
        image={heroImage("reviews")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Reviews" }]} />}
        eyebrow={<><Star className="size-4 fill-star text-star" /> {rating.toFixed(1)} Star Rated</>}
        title="What Our Customers Say"
        subtitle={`Homeowners across the ${siteConfig.region} trust ${siteConfig.shortName} with their roofs. Here is what they had to say${count ? `, straight from our ${count} five-star reviews` : ""}.`}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {reviews.map((rev, i) => (
              <figure key={i} className="break-inside-avoid rounded-2xl border border-border bg-card p-7">
                <div className="mb-3 flex gap-1 text-star">
                  {Array.from({ length: Math.round(rev.rating) || 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="leading-relaxed text-foreground">{rev.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-heading font-black text-accent">
                    {rev.reviewer.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{rev.reviewer}</div>
                    <div className="text-xs text-muted">{rev.platform}{rev.location ? ` · ${rev.location}` : ""}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTABanner variant={layout.cta} />
    </>
  )
}
