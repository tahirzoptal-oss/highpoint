import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { blogPosts, postThumb, type BlogPost } from "@/components/blog/post-utils"

const slugOf = (p: BlogPost): string =>
  p.slug ?? (p.href ? p.href.split("/").filter(Boolean).pop() ?? "" : "")

/** 3-up related-posts block at the end of an article (internal linking). */
export function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = blogPosts.filter((p) => slugOf(p) !== currentSlug).slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="section-y bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl md:text-3xl font-black font-heading text-foreground">Keep reading</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map((p, i) => {
            const href = p.href ?? `/blog/${slugOf(p)}`
            const thumb = postThumb(p, i)
            return (
              <Link
                key={href}
                href={href}
                className="group overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-accent"
              >
                {thumb && <Photo src={thumb} alt={p.title} fill aspect="16/9" sizes="(min-width: 768px) 380px, 100vw" />}
                <div className="p-6">
                  {p.category && <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{p.category}</p>}
                  <h3 className="mt-2 line-clamp-2 font-bold font-heading text-foreground">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{p.excerpt}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
                    Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
