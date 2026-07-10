import { CheckCircle, ShieldCheck, Star } from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { getPatternSlot } from "@/components/pattern-slots"
import { getDividerSlot } from "@/components/divider-slots"
import { RoofRidgeDivider } from "@/components/RoofRidgeDivider"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { ContactForm } from "@/components/ContactForm"

const benefits = [
  "Free Roof Inspection",
  "Licensed & Insured",
  "Warranty Backed",
  "Fast Response Times",
]

export function CTAFormSection() {
  /* C1/C3 pattern slot: industrial-contractor textures this flat dark band
   * with blade-shards at whisper opacity (budget held in pattern-slots.ts). */
  const pattern = getPatternSlot("cta")
  const divider = getDividerSlot("cta")

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 16%, transparent),transparent_30%)]" />
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}
      {divider && (
        <RoofRidgeDivider
          shape={divider.shape}
          edge={divider.edge}
          opacity={divider.opacity}
        />
      )}

      <div className="relative z-10 mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-light">
            Free Estimate
          </p>

          {/* Feature scale (spec 2.1); accent word renders accent-light on
           * this dark band (spec 2.3 + v2 contrast invariant). */}
          <h2 data-scale="feature" className="mt-4 font-black uppercase [&_.text-accent]:text-accent-light">
            {renderAccent("Ready to protect your home with a roof you can *trust*?")}
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
            Whether you need a repair, replacement, or storm restoration, our team is ready to help with honest recommendations and quality workmanship.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4"
              >
                <CheckCircle className="size-5 shrink-0 text-white" />
                <span className="font-bold">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="dark" size="lg">
              Call Now
            </Button>

            <Button href="/reviews" intent="ghost" surface="dark" size="lg">
              Read Reviews
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold text-white/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-5 text-white" />
              {siteConfig.license}
            </span>

            <span className="inline-flex items-center gap-2">
              <Star className="size-5 fill-star text-star" />
              {siteConfig.reviews.googleRating.toFixed(1)} Rated Local Contractor
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-black uppercase text-white md:text-3xl">
            Get My Free Estimate
          </h3>
          <p className="mt-2 text-white/70">
            Share your project details, and our team will respond.
          </p>
          <p className="mt-2 font-bold text-white">
            We call you back in 5 minutes!
          </p>

          <div className="mt-6">
            <ContactForm showHeader={false} />
          </div>
        </div>
      </div>
    </section>
  )
}
