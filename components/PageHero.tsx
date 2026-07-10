import type { ReactNode } from "react"
import Image from "next/image"
import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/**
 * Shared interior-page hero: a dark band carrying a cinematic background photo
 * with a contrast scrim, then breadcrumb / eyebrow / title / subtitle / CTA.
 * Every interior page uses this instead of reusing the homepage <Hero>, so the
 * inner pages read as a consistent family. When no image is supplied it falls
 * back to the brand gradient (safe for image-less clients).
 */
export function PageHero({
  title,
  eyebrow,
  subtitle,
  image,
  breadcrumb,
  showCTA = true,
  align = "left",
}: {
  title: ReactNode
  eyebrow?: ReactNode
  subtitle?: string
  image?: string | null
  breadcrumb?: ReactNode
  showCTA?: boolean
  align?: "left" | "center"
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-ink)] py-20 md:py-28">
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="graded-media object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/95 via-[var(--color-ink)]/80 to-[var(--color-ink)]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-[var(--color-ink)]/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-dark)] via-[var(--color-primary)] to-[var(--color-ink)]" />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={align === "center" ? "mx-auto flex max-w-3xl flex-col items-center text-center" : "flex max-w-3xl flex-col"}>
          {breadcrumb}
          {eyebrow && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-accent-light">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-black font-heading text-white md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{subtitle}</p>}
          {showCTA && (
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-7 py-4 font-black text-[var(--color-on-accent)]"
            >
              <Phone className="size-5" /> Get My Free Estimate
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
