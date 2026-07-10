import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { MarkdownBody } from "@/components/MarkdownBody"
import { FAQList } from "@/components/FAQList"
import { SiloLayout } from "@/components/SiloLayout"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { CTABanner } from "@/components/CTABanner"
import { JsonLd } from "@/components/JsonLd"
import { getServiceSchema, getBreadcrumbSchema, faqPageSchema } from "@/lib/schema"
import { heroImage } from "@/lib/hero-image"

type Location = {
  slug: string
  city: string
  headline?: string
  subheadline?: string
  body?: string
  faq?: { q: string; a: string }[]
  adjacentCities?: string[]
}

const locations: Location[] = ((siteConfig as { locations?: Location[] }).locations) ?? []

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const loc = locations.find((l) => l.slug === slug)
  if (!loc) return {}
  return {
    title: `Roofing Contractor in ${loc.city}, ${siteConfig.address.state} | ${siteConfig.name}`,
    description: loc.subheadline || `${siteConfig.name} provides roof repair, replacement and storm damage restoration in ${loc.city}. Licensed, insured, warranty-backed. Call ${siteConfig.phone}.`,
    alternates: { canonical: `/service-areas/${slug}` },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loc = locations.find((l) => l.slug === slug)
  if (!loc) notFound()
  const layout = getLayout()
  const faq = loc.faq ?? []
  const faqLd = faqPageSchema(faq)

  return (
    <>
      <JsonLd data={getServiceSchema(`Roofing in ${loc.city}`, loc.subheadline || `Roofing services in ${loc.city}`, `/service-areas/${slug}`, loc.city)} />
      <JsonLd data={getBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Service Areas", path: "/service-areas" },
        { name: loc.city, path: `/service-areas/${slug}` },
      ])} />
      {faqLd && <JsonLd data={faqLd} />}

      <PageHero
        image={heroImage(slug)}
        breadcrumb={
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Service Areas", href: "/service-areas" },
              { name: `${loc.city}, ${siteConfig.address.state}` },
            ]}
          />
        }
        eyebrow={<><MapPin className="size-4" /> {loc.city}, {siteConfig.address.state}</>}
        title={loc.headline || `Your Trusted ${loc.city} Roofing Contractor`}
        subtitle={loc.subheadline}
      />

      <SiloLayout>
        {loc.body && <MarkdownBody markdown={loc.body} />}

        {faq.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl md:text-3xl font-bold font-heading text-foreground">
              {loc.city} Roofing FAQs
            </h2>
            <FAQList items={faq} />
          </div>
        )}

        {loc.adjacentCities && loc.adjacentCities.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border bg-card p-7">
            <h2 className="mb-4 text-xl font-bold font-heading text-foreground">Nearby Areas We Serve</h2>
            <div className="flex flex-wrap gap-3">
              {loc.adjacentCities.map((c) => {
                const adj = locations.find((l) => l.city.toLowerCase() === c.toLowerCase())
                return adj ? (
                  <Link key={c} href={`/service-areas/${adj.slug}`} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted hover:border-accent hover:text-accent">{c}</Link>
                ) : (
                  <span key={c} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted">{c}</span>
                )
              })}
            </div>
          </div>
        )}
      </SiloLayout>

      <CTABanner variant={layout.cta} />
    </>
  )
}
