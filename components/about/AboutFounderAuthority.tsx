import { Check, Quote, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { BrandGlyph, getBrandGlyphPathForBullets } from "@/components/brand-glyph"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutFounderAuthority({
  receiveSeam = false,
}: {
  /* F2: pad this band's top to absorb the WhyChooseUs seam-weld overshoot. */
  receiveSeam?: boolean
} = {}) {
  const owner = owners[0]
  const secondOwner = owners[1]

  /* E4 list-bullet slot: the derived brand glyph replaces the check bullets
   * in this feature list (accent ink on this light band). Zero-data guard:
   * no derived glyph (or a restraint pack) keeps the CheckCircle bullets. */
  const glyph = getBrandGlyphPathForBullets()

  // No owner portrait and no project photo, no visual column. Placeholder art
  // never ships. #4: the project-photo fallback uses the distinct About slot so
  // it never repeats the WhyChooseUs photo (owner portrait still wins first).
  const featureImage = owner?.image || sectionPhoto("about")
  const featureAlt = owner?.name || `${siteConfig.name} roofing project`

  return (
    <section
      className={`relative overflow-hidden bg-white section-y ${
        receiveSeam ? "overlap-receive-seam" : ""
      }`}
    >
      <div
        className={`relative z-10 mx-auto grid max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:px-8 ${
          featureImage ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
        }`}
      >
        {/* Decorative dark backdrop for the media column. Absolute to the GRID
         * (not the section) so its height tracks the media column exactly and
         * never leaves a dead slab in the section-y padding (#18). Only rendered
         * with the two-column layout (hidden lg:block, #8) so it can never
         * overlap the single-column text at mobile widths. */}
        {featureImage && (
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 -z-10 hidden h-full w-[34%] bg-[var(--color-surface-dark)] lg:block"
          />
        )}

        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={featureImage ? halfDirection("left") : "up"}
          className={`flex flex-col justify-center ${featureImage ? "reveal-follow" : ""}`}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            Meet the Owners
          </p>

          <h2
            data-scale="feature"
            className="mt-4 max-w-3xl font-black uppercase text-primary-dark"
          >
            {renderAccent("The *local* team behind your roof")}
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {siteConfig.founder.story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Owner-led communication",
              "Clear estimates without pressure",
              "Warranty-backed workmanship",
              "Local team, local accountability",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 font-bold text-primary-dark">
                {glyph ? (
                  <BrandGlyph d={glyph} size={20} className="text-accent" />
                ) : (
                  /* E2 check-bullet: the solid-circle + contrast-check standard
                   * (accent circle + white check on this light band). */
                  <span className="check-bullet">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
                {item}
              </div>
            ))}
          </div>

          {siteConfig.founder.quote ? (
            <div className="mt-8 rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-6">
              <Quote className="mb-3 size-7 text-accent" />
              <p className="text-xl font-black leading-tight text-primary-dark">
                {siteConfig.founder.quote}
              </p>
              {owner && (
                <p className="mt-3 text-sm font-bold text-muted">
                  {owner.name}{secondOwner ? ` & ${secondOwner.name}` : ""}
                </p>
              )}
            </div>
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the story link kept as the secondary action. */}
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="light" size="lg">
              Read Our Story
            </Button>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
              <ShieldCheck className="size-5 text-accent" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>

        {featureImage && (
          <Reveal
            direction={halfDirection("right")}
            className="relative min-h-[560px]"
          >
            <div className="absolute inset-0 shadow-2xl">
              <Photo
                src={featureImage}
                alt={featureAlt}
                fill
                focus={owner?.image ? "top" : "center"}
                sizes="620px"
                scrim="bottom"
                className="h-full"
              />
            </div>

            {owner && (
              <div className="absolute left-6 top-6 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)]">
                Owner Authority
              </div>
            )}

            <div className="absolute -left-8 bottom-8 w-[360px] rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-3 flex items-center gap-2 text-star">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-lg font-black leading-tight text-primary-dark">
                Local leadership. Clear communication. Better roofing experience.
              </p>
              {owner && (
                <div className="mt-4 border-t border-black/10 pt-4">
                  <div className="font-black uppercase text-primary-dark">{owner.name}</div>
                  <div className="text-sm font-semibold text-primary-dark/60">{owner.title}</div>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
