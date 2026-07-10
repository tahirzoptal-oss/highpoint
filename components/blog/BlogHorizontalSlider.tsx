"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Photo } from "@/components/Photo"
import { renderAccent } from "@/lib/accent"
import { blogPosts, postThumb } from "@/components/blog/post-utils"

export function BlogHorizontalSlider() {
  const posts = blogPosts
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const next = () => setActive((prev) => (prev + 1) % posts.length)
  const prev = () => setActive((prev) => (prev - 1 + posts.length) % posts.length)

  useEffect(() => {
    if (!posts.length || paused) return
    // B30 motion guard: never autoplay for a reduced-motion visitor.
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(next, 3500)
    return () => clearInterval(timer)
  }, [paused, posts.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const card = track.children[active] as HTMLElement | undefined
    if (!card) return

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    })
  }, [active])

  if (!posts.length) return null

  return (
    <section className="overflow-hidden bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
              <span aria-hidden="true" className="eyebrow-mark" />
              Latest Articles
            </p>

            <h2
              data-scale="utility"
              className="mt-4 font-black uppercase text-primary-dark"
            >
              {renderAccent("Roofing *tips* & resources")}
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-muted">
              Helpful guides, roofing advice, storm restoration tips and homeowner resources from the {siteConfig.shortName} team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="grid size-12 place-items-center rounded-full border border-black/15 bg-white text-primary-dark transition hover:border-accent hover:bg-accent hover:text-[var(--color-on-accent)]"
              aria-label="Previous article"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={next}
              className="grid size-12 place-items-center rounded-full bg-accent text-[var(--color-on-accent)] transition hover:brightness-95"
              aria-label="Next article"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((post, i) => {
              const thumb = postThumb(post, i)

              return (
                <article
                  key={post.href ?? post.title}
                  className="group w-[86vw] shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl sm:w-[420px]"
                >
                  {thumb && (
                    <div className="relative">
                      <Photo
                        src={thumb}
                        alt={post.title}
                        fill
                        sizes="420px"
                        className="h-60"
                      />

                      {post.category && (
                        <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-2 text-xs font-black uppercase tracking-widest text-[var(--color-on-accent)]">
                          {post.category}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {!thumb && post.category && (
                      <p className="text-xs font-black uppercase tracking-widest text-accent">
                        {post.category}
                      </p>
                    )}

                    <h3 className={`line-clamp-2 text-2xl font-black text-primary-dark ${!thumb && post.category ? "mt-3" : ""}`}>
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-muted">
                      {post.excerpt}
                    </p>

                    {post.date && (
                      <p className="mt-3 text-sm text-muted">{post.date}</p>
                    )}

                    <Link
                      href={post.href ?? "/blog"}
                      className="mt-5 inline-flex items-center gap-2 font-black uppercase text-accent"
                    >
                      Read More
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${
                active === index ? "w-10 bg-accent" : "w-2.5 bg-black/20"
              }`}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
