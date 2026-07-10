import Image from "next/image"
import { siteConfig, owners } from "@/lib/site-config"

/**
 * Byline author card at the end of a blog article. Uses the named founder when
 * one exists, else the company. Renders the founder photo only when a real one
 * exists (owner-less / photo-less clients get the initial-letter treatment, so
 * no grey slot ever ships).
 */
export function AuthorCard() {
  const owner = owners[0]
  const name = owner?.name || siteConfig.name
  const title = owner?.title || `The ${siteConfig.shortName} Team`
  const photo = owner?.image && !owner.image.includes("placeholder") ? owner.image : ""

  return (
    <div className="mt-12 flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-accent/10">
        {photo ? (
          <Image src={photo} alt={name} fill sizes="64px" className="object-cover object-top" />
        ) : (
          <span className="grid size-full place-items-center font-heading text-2xl font-black text-accent">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Written by</p>
        <p className="mt-0.5 font-bold font-heading text-foreground">{name}</p>
        <p className="text-sm text-muted">{title}</p>
      </div>
    </div>
  )
}
