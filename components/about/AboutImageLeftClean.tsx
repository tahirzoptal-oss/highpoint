import { ShieldCheck, Star, Users } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { BrandGlyph, getBrandGlyphPathForBullets } from "@/components/brand-glyph"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutImageLeftClean() {
  const owner = owners?.[0]

  /* E4 list-bullet slot: the derived brand glyph replaces the generic Lucide
   * bullets in this feature list (accent ink on this light card). Zero-data
   * guard: no derived glyph (or a restraint pack) keeps the Lucide bullets. */
  const glyph = getBrandGlyphPathForBullets()

  // No owner portrait and no project photo, no image column. Placeholder art
  // never ships. #4: the project-photo fallback uses the distinct About slot so
  // it never repeats the WhyChooseUs photo (owner portrait still wins first).
  const aboutImage = owner?.image || sectionPhoto("about")
  const aboutAlt = owner?.name || `${siteConfig.name} roofing project`

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:px-8 ${
          aboutImage ? "lg:grid-cols-[0.9fr_1.1fr] lg:items-center" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text card trailing 120ms. */}
        {aboutImage && (
          <Reveal direction={halfDirection("left")}>
            <Photo src={aboutImage} alt={aboutAlt} fill focus={owner?.image ? "top" : "center"} className="min-h-[560px]" />
          </Reveal>
        )}

        <Reveal
          direction={aboutImage ? halfDirection("right") : "up"}
          className={`rounded-2xl bg-white p-8 shadow-xl md:p-12 ${
            aboutImage ? "reveal-follow" : "mx-auto max-w-3xl"
          }`}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            About Us
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent(`Roofing *done right*. The ${siteConfig.shortName} way`)}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-5"} text-lg leading-relaxed text-muted`}
            >
              {para}
            </p>
          ))}

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 font-bold text-primary-dark">
              {glyph ? (
                <BrandGlyph d={glyph} size={20} className="text-accent" />
              ) : (
                <Users className="size-5 text-accent" />
              )}
              Local and family owned
            </div>

            <div className="flex items-center gap-3 font-bold text-primary-dark">
              {glyph ? (
                <BrandGlyph d={glyph} size={20} className="text-accent" />
              ) : (
                <ShieldCheck className="size-5 text-accent" />
              )}
              Experienced, professional team
            </div>

            <div className="flex items-center gap-3 font-bold text-primary-dark">
              {glyph ? (
                <BrandGlyph d={glyph} size={20} className="text-accent" />
              ) : (
                <Star className="size-5 fill-star text-star" />
              )}
              Top-rated by homeowners
            </div>
          </div>

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
              Licensed and insured.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
