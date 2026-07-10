import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { stripAccent } from "@/lib/accent"
import { blogPosts, postThumb } from "@/components/blog/post-utils"

export function BlogDarkCards() {
  const posts = blogPosts

  if (!posts.length) return null

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in srgb, var(--color-accent) 16%, transparent),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Resource Center
            </p>

            <h2 data-scale="utility" className="mt-4 font-black uppercase">
              {stripAccent("Roofing advice that helps you decide")}
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-black uppercase text-white"
          >
            View Articles
            <ArrowRight className="size-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => {
            const thumb = postThumb(post, index)

            return (
              /* A2 grid choreography: row-major card stagger. */
              <Reveal
                as="article"
                key={post.href ?? post.title}
                index={index}
                /* B3 dark-band rule: a card on a dark band separates by ONE
                 * tonal step (.card-on-dark) and carries no shadow. */
                className={`card-on-dark group overflow-hidden rounded-2xl border border-white/10 ${
                  index === 0 && thumb ? "lg:row-span-2" : ""
                }`}
              >
                {thumb && (
                  <div className="relative">
                    <Photo
                      src={thumb}
                      alt={post.title}
                      fill
                      sizes="430px"
                      className={index === 0 ? "h-[420px]" : "h-64"}
                    />

                    {post.category && (
                      <div className="absolute left-5 top-5 rounded-full bg-accent px-3 py-2 text-xs font-black uppercase tracking-widest text-[var(--color-on-accent)]">
                        {post.category}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {!thumb && post.category && (
                    <div className="mb-3 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-black uppercase tracking-widest text-[var(--color-on-accent)]">
                      {post.category}
                    </div>
                  )}

                  <h3 className="text-2xl font-black leading-tight text-white">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-white/60">
                    {post.excerpt}
                  </p>

                  {post.date && (
                    <p className="mt-3 text-sm text-white/45">{post.date}</p>
                  )}

                  <Link
                    href={post.href ?? "/blog"}
                    className="mt-5 inline-flex items-center gap-2 font-black uppercase text-white"
                  >
                    Read More
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
