import { siteConfig, serviceAreas, owners } from "@/lib/site-config"

/** Absolute URL helper against the configured site domain. */
function abs(path: string): string {
  const base = siteConfig.website.replace(/\/$/, "")
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

/** RoofingContractor / LocalBusiness, rendered site-wide from config. */
export function getLocalBusinessSchema() {
  const allCities = [...serviceAreas.primary, ...serviceAreas.secondary]
  const sameAs = Object.values(siteConfig.socialLinks).filter(
    (url) => typeof url === "string" && url !== "#" && url.startsWith("http")
  )

  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${siteConfig.website.replace(/\/$/, "")}/#business`,
    name: siteConfig.name,
    description: siteConfig.metaDescription,
    url: siteConfig.website,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: abs("/images/og.jpg"),
    logo: abs("/images/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    areaServed: allCities.map((city) => ({ "@type": "City", name: city })),
    priceRange: "$$",
    ...(siteConfig.reviews?.googleCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(siteConfig.reviews.googleRating ?? 5),
            reviewCount: String(
              (siteConfig.reviews.googleCount ?? 0) + (siteConfig.reviews.facebookCount ?? 0)
            ),
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    founder: owners.map((owner) => ({
      "@type": "Person",
      name: owner.name,
      jobTitle: owner.title,
    })),
  }
}

/** WebSite node for sitelinks / search understanding. */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.website,
  }
}

/** FAQPage built from the client's FAQ content. */
export function getFaqSchema() {
  const faqs = siteConfig.faqs ?? []
  if (!faqs.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

/** Service node for a service or location page. Pass areaCity to scope
 * areaServed to a specific City (location pages) instead of the whole State. */
export function getServiceSchema(name: string, description: string, path: string, areaCity?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: abs(path),
    serviceType: name,
    provider: {
      "@type": "RoofingContractor",
      name: siteConfig.name,
      url: siteConfig.website,
      telephone: siteConfig.phone,
    },
    areaServed: areaCity
      ? { "@type": "City", name: areaCity }
      : { "@type": "State", name: siteConfig.region },
  }
}

/** BreadcrumbList for an interior page. Items are ordered root -> current. */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

/** FAQPage from raw {q,a} pairs (service/location page FAQ blocks). */
export function faqPageSchema(pairs: { q: string; a: string }[]) {
  if (!pairs.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

/** Article node for a blog post. */
export function getArticleSchema(opts: { title: string; description: string; path: string; author?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: abs(opts.path),
    author: { "@type": opts.author ? "Person" : "Organization", name: opts.author || siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  }
}
