import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { MarkdownBody } from "@/components/MarkdownBody"
import { FAQList } from "@/components/FAQList"
import { ProcessSteps } from "@/components/ProcessSteps"
import { SiloLayout } from "@/components/SiloLayout"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ServicesRelated } from "@/components/services/ServicesRelated"
import { CTABanner } from "@/components/CTABanner"
import { JsonLd } from "@/components/JsonLd"
import { getServiceSchema, getBreadcrumbSchema, faqPageSchema } from "@/lib/schema"
import { heroImage } from "@/lib/hero-image"

type Service = (typeof siteConfig.services)[number] & {
  slug?: string
  body?: string
  faq?: { q: string; a: string }[]
}

function slugOf(s: Service): string {
  return s.slug ?? s.href.replace("/services/", "").replace(/\/$/, "")
}

function find(slug: string): Service | undefined {
  return (siteConfig.services as Service[]).find((s) => slugOf(s) === slug)
}

export function generateStaticParams() {
  return (siteConfig.services as Service[]).map((s) => ({ slug: slugOf(s) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const svc = find(slug)
  if (!svc) return {}
  return {
    title: `${svc.title} ${siteConfig.city} ${siteConfig.address.state} | ${siteConfig.name}`.replace(/\s+\|/, " |"),
    description: svc.description,
    alternates: { canonical: `/services/${slug}` },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const svc = find(slug)
  if (!svc) notFound()
  const layout = getLayout()
  const faq = svc.faq ?? []
  const faqLd = faqPageSchema(faq)

  return (
    <>
      <JsonLd data={getServiceSchema(svc.title, svc.description, `/services/${slug}`)} />
      <JsonLd data={getBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: svc.title, path: `/services/${slug}` },
      ])} />
      {faqLd && <JsonLd data={faqLd} />}

      {/* Service header */}
      <PageHero
        image={heroImage(slug)}
        breadcrumb={
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Services", href: "/services" },
              { name: svc.title },
            ]}
          />
        }
        eyebrow={`${siteConfig.city}, ${siteConfig.address.state}`}
        title={svc.title}
        subtitle={svc.description}
      />

      <SiloLayout>
        {svc.body && <MarkdownBody markdown={svc.body} />}

        <div className="mt-12">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold font-heading text-foreground">How We Work</h2>
          <ProcessSteps />
        </div>

        {faq.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl md:text-3xl font-bold font-heading text-foreground">Common Questions</h2>
            <FAQList items={faq} />
          </div>
        )}
      </SiloLayout>

      <ServicesRelated currentSlug={slug} />

      <CTABanner variant={layout.cta} />
    </>
  )
}
