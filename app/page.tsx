import type { Metadata } from "next"

import { SectionRenderer } from "@/components/SectionRenderer"
import { JsonLd } from "@/components/JsonLd"
import { getFaqSchema } from "@/lib/schema"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Roofing Contractor ${siteConfig.city} ${siteConfig.address.state} | ${siteConfig.name}`,
  description: `${siteConfig.name} is ${siteConfig.city}'s #1 trusted roofing contractor. Roof repair, replacement & storm damage restoration. Licensed, insured & warranty-backed. Call ${siteConfig.phone} for a free estimate.`,
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={getFaqSchema()} />
      <SectionRenderer />
    </>
  )
}