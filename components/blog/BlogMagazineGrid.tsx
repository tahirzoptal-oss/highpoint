import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"
import { blogPosts, postThumb } from "@/components/blog/post-utils"

export function BlogMagazineGrid() {
  const posts = blogPosts
  const featured = posts[0]
  const sidePosts = posts.slice(1, 4)

  if (!featured) return null

  const featuredThumb = postThumb(featured, 0)

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Latest Articles"
          title="Roofing *tips* & resources"
          subtitle="Helpful advice to keep your roof protected and your home prepared."
          scale="utility"
        />

        {/* A2 split choreography: the featured card and the side rail slide
         * from their own sides in the directional packs, the rail trailing. */}
        <div className="grid gap-8 lg:grid-cols-[1fr_.75fr]">
          <Reveal
            as="article"
            direction={halfDirection("left")}
            /* B3 depth: token two-layer shadow + asymmetric hover lift. */
            className="hover-card overflow-hidden rounded-2xl bg-white"
          >
            {featuredThumb && (
              /* B5 frame-break micro-overlap: the post date rides inside the
               * photo's top-right corner as a .photo-pill (rounded ink pill,
               * white caption, over-photo dark-surface safe). The relative
               * wrapper is the pill's positioning host; zero CLS (absolute).
               * Guarded on a real date, so no empty pill ever ships. */
              <div className="relative">
                <Photo
                  src={featuredThumb}
                  alt={featured.title}
                  fill
                  aspect="16/9"
                  sizes="760px"
                  className="min-h-[430px]"
                />
                {featured.date && (
                  <span className="photo-pill">{featured.date}</span>
                )}
              </div>
            )}

            <div className="p-8">
              <p className="text-xs font-black uppercase tracking-widest text-accent">
                {featured.category || "Roofing Guide"}
              </p>

              <h3 className="mt-3 text-3xl font-black uppercase leading-tight text-primary-dark md:text-4xl">
                {featured.title}
              </h3>

              <p className="mt-4 text-muted">{featured.excerpt}</p>

              {/* The date now rides the photo as the B5 .photo-pill above, so
               * the in-body date line is dropped for the featured card only
               * (side posts, which have no pill, keep their inline date). When
               * the featured post has no image, the pill never renders; the
               * date still surfaces there via the fallback below. */}
              {!featuredThumb && featured.date && (
                <p className="mt-3 text-sm text-muted">{featured.date}</p>
              )}

              <Button href={featured.href ?? "/blog"} surface="light" className="mt-6">
                Read More
              </Button>
            </div>
          </Reveal>

          <Reveal
            direction={halfDirection("right")}
            className="reveal-follow space-y-5"
          >
            {sidePosts.map((post, i) => {
              const thumb = postThumb(post, i + 1)

              return (
                <article
                  key={post.title}
                  /* B3 depth: token two-layer shadow + asymmetric hover lift. */
                  className={`hover-card overflow-hidden rounded-2xl bg-white ${
                    thumb ? "grid grid-cols-[130px_1fr]" : ""
                  }`}
                >
                  {thumb && (
                    <Photo
                      src={thumb}
                      alt={post.title}
                      fill
                      sizes="130px"
                      className="h-full w-full min-h-[130px]"
                    />
                  )}

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">
                      {post.category || "Roofing Tips"}
                    </p>

                    <h3 className="mt-2 font-black leading-snug text-primary-dark">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {post.excerpt}
                    </p>

                    {post.date && (
                      <p className="mt-2 text-xs text-muted">{post.date}</p>
                    )}

                    <Link
                      href={post.href ?? "/blog"}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-black uppercase text-primary-dark"
                    >
                      Read More
                      <ArrowRight className="size-4 text-accent" />
                    </Link>
                  </div>
                </article>
              )
            })}

            <Button href="/blog" intent="ghost" surface="light" className="w-full">
              View All Articles
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
