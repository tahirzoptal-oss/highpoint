import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { CTABanner } from "@/components/CTABanner"
import { getLayout } from "@/lib/get-layout"

type Post = { slug?: string; href?: string; title: string; hook?: string; excerpt?: string; category?: string; date?: string; image?: string }
const posts: readonly Post[] = siteConfig.blogPosts ?? []
const slugOf = (p: Post): string => p.slug ?? (p.href ? p.href.split("/").filter(Boolean).pop() ?? "" : "")

export const metadata: Metadata = {
  title: `Roofing Tips & Insights | ${siteConfig.name}`,
  description: `Practical roofing guidance from ${siteConfig.name} for ${siteConfig.city} homeowners.`,
  alternates: { canonical: "/blog" },
}

export default function BlogIndex() {
  const layout = getLayout()
  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">From the Roof Up</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black font-heading text-foreground">Roofing Tips & Insights</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">Practical, no-nonsense guidance for {siteConfig.city} homeowners.</p>

          {posts.length === 0 ? (
            <p className="mt-12 text-muted">New articles are on the way.</p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.filter((p) => slugOf(p)).map((p) => {
                const slug = slugOf(p)
                const summary = p.hook ?? p.excerpt
                return (
                <Link key={slug} href={`/blog/${slug}`} className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-accent/40">
                  {p.category && <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">{p.category}</p>}
                  <h2 className="mt-3 text-xl font-bold font-heading text-foreground group-hover:text-accent">{p.title}</h2>
                  {summary && <p className="mt-3 text-muted leading-relaxed line-clamp-3">{summary}</p>}
                  {p.date && <p className="mt-4 text-sm text-muted">{p.date}</p>}
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <CTABanner variant={layout.cta} />
    </>
  )
}
