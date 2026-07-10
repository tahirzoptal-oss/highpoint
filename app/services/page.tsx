import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ServiceCard } from "@/components/ServiceCard"
import { ProcessSteps } from "@/components/ProcessSteps"
import { CTABanner } from "@/components/CTABanner"
import { JsonLd } from "@/components/JsonLd"
import { getBreadcrumbSchema } from "@/lib/schema"
import { heroImage } from "@/lib/hero-image"

type Service = (typeof siteConfig.services)[number] & { slug?: string; icon?: string }

export const metadata: Metadata = {
  title: `Roofing & Renovation Services | ${siteConfig.name}`,
  description: `Explore ${siteConfig.name}'s roofing and renovation services in ${siteConfig.city}, ${siteConfig.address.state}: inspections, installation, repairs and full home renovation. Call ${siteConfig.phone}.`,
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
  const layout = getLayout()
  const services = siteConfig.services as Service[]
  const gridCols = services.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"

  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />

      <PageHero
        image={heroImage("services")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Services" }]} />}
        eyebrow={`${siteConfig.city}, ${siteConfig.address.state}`}
        title="Roofing & Renovation Services"
        subtitle={`One local, owner-led team for the whole exterior. From a fast repair to a full roof replacement and beyond, here is how ${siteConfig.shortName} helps ${siteConfig.city} homeowners.`}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-6 ${gridCols}`}>
            {services.map((s) => (
              <ServiceCard key={s.href} title={s.title} description={s.description} href={s.href} icon={s.icon || "Home"} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl md:text-4xl font-bold font-heading text-foreground">How We Work</h2>
          <ProcessSteps />
        </div>
      </section>

      <CTABanner variant={layout.cta} />
    </>
  )
}
