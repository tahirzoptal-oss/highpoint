import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig, owners } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { MarkdownBody } from "@/components/MarkdownBody"
import { Photo } from "@/components/Photo"
import { SiloLayout } from "@/components/SiloLayout"
import { Breadcrumb } from "@/components/Breadcrumb"
import { AuthorCard } from "@/components/blog/AuthorCard"
import { RelatedPosts } from "@/components/blog/RelatedPosts"
import { postThumb, type BlogPost } from "@/components/blog/post-utils"
import { CTABanner } from "@/components/CTABanner"
import { JsonLd } from "@/components/JsonLd"
import { getBreadcrumbSchema, getArticleSchema } from "@/lib/schema"

const posts: readonly BlogPost[] = siteConfig.blogPosts ?? []

/** A post may carry an explicit slug (bridge output) or only an href (template). */
const slugOf = (p: BlogPost): string =>
  p.slug ?? (p.href ? p.href.split("/").filter(Boolean).pop() ?? "" : "")

export function generateStaticParams() {
  return posts.map((p) => ({ slug: slugOf(p) })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => slugOf(p) === slug)
  if (!post) return {}
  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.hook || `${post.title} - roofing insight from ${siteConfig.name}.`,
    alternates: { canonical: `/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((p) => slugOf(p) === slug)
  if (!post) notFound()
  const layout = getLayout()
  const cover = postThumb(post)

  return (
    <>
      <JsonLd data={getBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${slug}` },
      ])} />
      <JsonLd data={getArticleSchema({
        title: post.title,
        description: post.hook || post.excerpt || post.title,
        path: `/blog/${slug}`,
        author: owners[0]?.name,
      })} />

      <section className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            tone="light"
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            {post.category && <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">{post.category}</p>}
            <h1 className="mt-3 text-4xl md:text-5xl font-black font-heading text-foreground leading-tight">{post.title}</h1>
            {post.byline && <p className="mt-4 text-sm text-muted">{post.byline}{post.date ? ` · ${post.date}` : ""}</p>}
            {post.hook && <p className="mt-6 text-xl leading-relaxed text-muted">{post.hook}</p>}
          </div>
          {cover && (
            <div className="mt-8">
              <Photo src={cover} alt={post.title} fill aspect="16/9" sizes="(min-width: 1024px) 1120px, 100vw" />
            </div>
          )}
        </div>
      </section>

      <SiloLayout>
        <MarkdownBody markdown={post.body || ""} />
        <AuthorCard />
      </SiloLayout>

      <RelatedPosts currentSlug={slug} />

      <CTABanner variant={layout.cta} />
    </>
  )
}
