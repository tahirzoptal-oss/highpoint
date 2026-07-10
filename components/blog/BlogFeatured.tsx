import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"
import { blogPosts, postThumb } from "@/components/blog/post-utils"

export function BlogFeatured() {
  const posts = blogPosts
  const featured = posts[0]
  const sidePosts = posts.slice(1, 4)

  if (!featured) return null

  const featuredThumb = postThumb(featured, 0)

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Latest Articles"
          title="Roofing tips from local *experts*"
          subtitle={`Helpful roofing guides, storm restoration advice and exterior tips from the ${siteConfig.shortName} team.`}
          scale="utility"
          layout="split"
        />

        {/* A2 split choreography: the featured card and the side rail slide
         * from their own sides in the directional packs, the rail trailing. */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal
            as="article"
            direction={halfDirection("left")}
            /* B3 depth: token two-layer shadow + asymmetric hover lift. */
            className="hover-card group overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-surface-light)]"
          >
            {featuredThumb && (
              <div className="relative">
                <Photo
                  src={featuredThumb}
                  alt={featured.title}
                  fill
                  aspect="16/9"
                  sizes="760px"
                  className="h-[430px]"
                />

                <div className="absolute left-6 top-6 rounded-full bg-accent px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--color-on-accent)]">
                  Featured Guide
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent">
                <CalendarDays className="size-4" />
                {featured.category || "Roofing Guide"}
              </div>

              <h3 className="text-3xl font-black leading-tight text-primary-dark">
                {featured.title}
              </h3>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                {featured.excerpt}
              </p>

              {featured.date && (
                <p className="mt-3 text-sm text-muted">{featured.date}</p>
              )}

              <Link
                href={featured.href ?? "/blog"}
                className="mt-6 inline-flex items-center gap-2 font-black uppercase text-accent"
              >
                Read More
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </Reveal>

          <Reveal
            direction={halfDirection("right")}
            className="reveal-follow space-y-5"
          >
            {sidePosts.map((post, i) => {
              const thumb = postThumb(post, i + 1)

              return (
                <Link
                  key={post.href ?? post.title}
                  href={post.href ?? "/blog"}
                  /* B3 depth: token two-layer shadow + asymmetric hover lift. */
                  className={`hover-card group grid gap-5 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-accent ${
                    thumb ? "sm:grid-cols-[170px_1fr]" : ""
                  }`}
                >
                  {thumb && (
                    <Photo
                      src={thumb}
                      alt={post.title}
                      fill
                      sizes="170px"
                      className="h-full w-full min-h-[144px]"
                    />
                  )}

                  <div>
                    {post.category && (
                      <div className="text-xs font-black uppercase tracking-widest text-accent">
                        {post.category}
                      </div>
                    )}

                    <h3 className="mt-2 text-xl font-black leading-tight text-primary-dark">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-muted">
                      {post.excerpt}
                    </p>

                    {post.date && (
                      <p className="mt-2 text-sm text-muted">{post.date}</p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-primary-dark group-hover:text-accent">
                      Read More
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              )
            })}

            <Button href="/blog" surface="light" className="w-full">
              View All Articles
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
