import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { packSeal } from "@/lib/pack-seal"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutImageLeft() {
  const owner = owners?.[0]

  // No owner portrait and no project photo, no image column. Placeholder art
  // never ships. #4: the project-photo fallback uses the distinct About slot so
  // it never repeats the WhyChooseUs photo (owner portrait still wins first).
  const aboutImage = owner?.image || sectionPhoto("about")
  const aboutAlt = owner?.name || `${siteConfig.name} roofing project`

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:px-8 ${
          aboutImage ? "lg:grid-cols-2 lg:items-center" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        {aboutImage && (
          <Reveal direction={halfDirection("left")}>
            {/* B6 (sharp packs only, no-op on rounded CRS): the industrial About
             * photo is the hero-adjacent framed photo, so it carries the octagon
             * blade mask + one pair of detached corner brackets (this is the one
             * bracketed frame on the page, within the max-2 budget). Both
             * classes are scoped to html[data-corner="sharp"] in globals.css. */}
            <Photo
              src={aboutImage}
              alt={aboutAlt}
              fill
              focus={owner?.image ? "top" : "center"}
              bladeFrame
              seal={packSeal()}
              className="corner-brackets w-full min-h-[560px]"
            />
          </Reveal>
        )}

        <Reveal
          direction={aboutImage ? halfDirection("right") : "up"}
          className={aboutImage ? "reveal-follow" : "max-w-3xl"}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            About Us
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("A local team you can *trust*")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-5"} text-lg leading-relaxed text-muted`}
            >
              {para}
            </p>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-5">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the team link kept as the secondary action. */}
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="light" size="lg">
              Meet Our Team
            </Button>

            <div className="inline-flex items-center gap-2 font-bold text-muted">
              <ShieldCheck className="size-5 text-accent" />
              Local. Accountable. Warranty-backed.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
