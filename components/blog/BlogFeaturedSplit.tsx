import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { renderAccent } from "@/lib/accent"
import { halfDirection } from "@/components/split-reveal"
import { blogPosts, postThumb } from "@/components/blog/post-utils"

export function BlogFeaturedSplit() {
  const posts = blogPosts
  const featured = posts[0]
  const sidePosts = posts.slice(1, 4)

  if (!featured) return null

  const featuredThumb = postThumb(featured, 0)

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
              <span aria-hidden="true" className="eyebrow-mark" />
              Roofing Tips & Resources
            </p>
            <h2
              data-scale="utility"
              className="mt-4 font-black uppercase text-primary-dark"
            >
              {renderAccent("Helpful roofing *advice*")}
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-black uppercase text-primary-dark"
          >
            View All Articles
            <ArrowRight className="size-5 text-accent" />
          </Link>
        </div>

        {/* A2 split choreography: the featured card and the side rail slide
         * from their own sides in the directional packs, the rail trailing. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <Reveal direction={halfDirection("left")} className="h-full">
          {featuredThumb ? (
            <article className="relative h-full">
              <Photo
                src={featuredThumb}
                alt={featured.title}
                fill
                aspect="16/10"
                scrim="bottom"
                sizes="760px"
                className="h-full w-full min-h-[430px] shadow-xl"
              />

              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-sm font-black uppercase tracking-widest text-accent-light">
                  {featured.category || "Roofing Guide"}
                </p>

                <h3 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight text-white md:text-4xl">
                  {featured.title}
                </h3>

                <p className="mt-4 max-w-2xl text-white/70">
                  {featured.excerpt}
                </p>

                {featured.date && (
                  <p className="mt-3 text-sm text-white/60">{featured.date}</p>
                )}

                <Button href={featured.href ?? "/blog"} surface="dark" className="mt-6">
                  Read More
                </Button>
              </div>
            </article>
          ) : (
            <article className="flex h-full min-h-[430px] flex-col justify-end rounded-2xl bg-primary-dark p-8 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-widest text-accent-light">
                {featured.category || "Roofing Guide"}
              </p>

              <h3 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight md:text-4xl">
                {featured.title}
              </h3>

              <p className="mt-4 max-w-2xl text-white/70">
                {featured.excerpt}
              </p>

              {featured.date && (
                <p className="mt-3 text-sm text-white/60">{featured.date}</p>
              )}

              <div className="mt-6">
                <Button href={featured.href ?? "/blog"} surface="dark">
                  Read More
                </Button>
              </div>
            </article>
          )}
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
                  className={`hover-card overflow-hidden rounded-2xl border border-black/10 bg-white ${
                    thumb ? "grid grid-cols-[150px_1fr]" : ""
                  }`}
                >
                  {thumb && (
                    <Photo
                      src={thumb}
                      alt={post.title}
                      fill
                      sizes="150px"
                      className="h-full w-full min-h-[135px]"
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
