import { Building2, CheckCircle } from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { ContactForm } from "@/components/ContactForm"
import { getPatternSlot } from "@/components/pattern-slots"
import { getDividerSlot } from "@/components/divider-slots"
import { RoofRidgeDivider } from "@/components/RoofRidgeDivider"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"

export function CTACommercialAuthority() {
  /* C1/C3 pattern slot: industrial-contractor textures this flat dark band
   * with blade-shards at whisper opacity (budget held in pattern-slots.ts).
   * Every other pack gets null and the band stays flat. Never the crescendo:
   * that is the SpecialOffers band, not this one. */
  const pattern = getPatternSlot("cta")
  const divider = getDividerSlot("cta")

  return (
    <section className="relative overflow-hidden bg-primary-dark section-y text-white">
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

      <div className="relative mx-auto grid max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_520px] lg:items-center lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white">
            <Building2 className="size-5" />
            Commercial Roofing
          </div>

          {/* Feature scale (spec 2.1); accent word renders accent-light on
           * this dark band (spec 2.3 + v2 contrast invariant). */}
          <h2 data-scale="feature" className="mt-6 font-black uppercase [&_.text-accent]:text-accent-light">
            {renderAccent("Request a commercial roofing *bid*")}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Get a professional inspection, clear scope and project-ready estimate from our roofing team.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Flat roofing systems", "Multi-family properties", "Repair & replacement", "Clear written scopes"].map((item) => (
              <div key={item} className="flex items-center gap-3 font-bold text-white/85">
                <CheckCircle className="size-5 text-white" />
                {item}
              </div>
            ))}
          </div>

          <Button
            href={`tel:${siteConfig.phoneRaw}`}
            intent="phone"
            surface="dark"
            size="lg"
            className="mt-8"
          >
            {siteConfig.phone}
          </Button>
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