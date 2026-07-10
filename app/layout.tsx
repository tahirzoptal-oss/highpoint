import type { Metadata } from "next"
import type { CSSProperties } from "react"
import "./globals.css"
import { siteConfig } from "@/lib/site-config"
import { brandDNA, buildThemeVars } from "@/lib/brand-dna"
import { designDNA, type DesignPack } from "@/lib/design-dna"
import { JsonLd } from "@/components/JsonLd"
import { MobileCTABar } from "@/components/MobileCTABar"
import { MotionProvider } from "@/components/MotionProvider"
import { getLocalBusinessSchema, getWebsiteSchema } from "@/lib/schema"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getLayout } from "@/lib/get-layout"

/** Per-pack button hardware v2 (2B B1). Consumed by globals.css via
 * html[data-hardware]: letterpress = 4px offset slab with press-toward-plate
 * physics, plate = 8px slab snap (V6; blade clip-path layers under the sharp
 * corner mode), gel = V4 pill emboss (shows the arrow coin), ingot = metallic
 * gradient + glare + press choreography, coin = the trailing arrow chip inside
 * every Button becomes visible. Remaps per Juan's 2026-07-03 ruling:
 * industrial-contractor letterpress to plate, storm-response coin to gel. */
const HARDWARE_BY_PACK: Record<
  DesignPack,
  "letterpress" | "plate" | "gel" | "ingot" | "coin" | "metallic"
> = {
  "owner-authority": "letterpress",
  "commercial-authority": "letterpress",
  "industrial-contractor": "plate",
  "family-owned": "ingot",
  "luxury-premium": "ingot",
  "storm-response": "gel",
  "modern-corporate": "coin",
  "tactical-tech": "metallic",
  "editorial-monochrome": "coin",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.website),
  title: `${siteConfig.primaryKeyword} | ${siteConfig.name}`,
  description: siteConfig.metaDescription,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.primaryKeyword} | ${siteConfig.name}`,
    description: siteConfig.metaDescription,
    url: siteConfig.website,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeVars = buildThemeVars(brandDNA) as CSSProperties
  const layout = getLayout()
  return (
    <html
      lang="en"
      className="overflow-x-clip"
      data-theme-mode={brandDNA.themeMode}
      data-motion={brandDNA.motion}
      data-treatment={brandDNA.treatment || undefined}
      data-hardware={HARDWARE_BY_PACK[designDNA.pack]}
      data-corner={brandDNA.cornerStyle}
      data-pack={designDNA.pack}
      data-accent-strategy={brandDNA.accentStrategy}
      style={themeVars}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Async font CSS (spec 2.9 perf budget): media="print" fetches the
            Google Fonts stylesheet without blocking first render, and the
            inline script flips it to "all" once loaded. display=swap in the
            href keeps text visible in the fallback font meanwhile. The script
            body is a static constant, no untrusted content. */}
        <link rel="preload" as="style" href={brandDNA.fonts.googleHref} />
        <link
          rel="stylesheet"
          href={brandDNA.fonts.googleHref}
          media="print"
          data-brand-fonts=""
        />
        <noscript>
          <link rel="stylesheet" href={brandDNA.fonts.googleHref} />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.querySelector('link[data-brand-fonts]');if(!l)return;var go=function(){l.media='all'};if(l.sheet){go()}else{l.addEventListener('load',go)}})()",
          }}
        />
        <JsonLd data={getLocalBusinessSchema()} />
        <JsonLd data={getWebsiteSchema()} />
      </head>
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased pb-16 md:pb-0">
        <Header variant={layout.header} />
        <main>{children}</main>
        <Footer variant={layout.footer} />
        <MobileCTABar />
        <MotionProvider />
      </body>
    </html>
  )
}