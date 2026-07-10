import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export const dynamic = "force-static"

const BASE_URL = siteConfig.website.replace(/\/$/, "")

type Service = { href: string; slug?: string }
type Location = { slug: string }
type Post = { slug?: string; href?: string }

const postSlug = (p: Post): string =>
  p.slug ?? (p.href ? p.href.split("/").filter(Boolean).pop() ?? "" : "")

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const services = siteConfig.services as Service[]
  const locations = ((siteConfig as { locations?: Location[] }).locations) ?? []
  const posts: Post[] = siteConfig.blogPosts ?? []

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/service-areas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug ?? s.href.replace("/services/", "").replace(/\/$/, "")}`,
    lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }))

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${BASE_URL}/service-areas/${l.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.filter((p) => postSlug(p)).map((p) => ({
    url: `${BASE_URL}/blog/${postSlug(p)}`, lastModified: now, changeFrequency: "monthly", priority: 0.5,
  }))

  return [...staticPages, ...servicePages, ...locationPages, ...blogPages]
}
