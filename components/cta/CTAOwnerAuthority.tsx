import { CheckCircle, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { siteConfig, owners } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"

export function CTAOwnerAuthority() {
  const owner = owners[0]

  // No owner portrait and no project photo, no visual column. Placeholder art
  // never ships.
  const visualImage =
    owner?.image ||
    (siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null)

  const rating = Math.round(siteConfig.reviews.googleRating)

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:px-8 ${
          visualImage ? "lg:grid-cols-[0.9fr_1.1fr] lg:items-center" : ""
        }`}
      >
        {visualImage && (
          <div className="relative min-h-[560px]">
            <div className="absolute inset-0 shadow-2xl">
              <Photo
                src={visualImage}
                alt={owner ? owner.name : `${siteConfig.shortName} roofing project`}
                fill
                sizes="620px"
                scrim="bottom"
                className="h-full w-full"
              />
            </div>

            {owner && (
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-3 flex gap-1 text-star">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <div className="text-xl font-black uppercase text-primary-dark">
                  {owner.name}
                </div>
                <div className="text-sm font-semibold text-primary-dark/60">
                  {owner.title}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            Talk To A Local Expert
          </p>

          {/* Feature scale (spec 2.1); light band, so the accent word can use
           * text-accent directly (spec 2.3). */}
          <h2 data-scale="feature" className="mt-4 font-black uppercase text-primary-dark">
            {renderAccent("Ready to *start* your roofing project?")}
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Get honest answers, clear recommendations and a roofing team that stands behind the work.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["Free Roof Inspection", "Owner-Led Service", "Licensed & Insured", "Warranty Backed"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-4">
                <CheckCircle className="size-5 text-accent" />
                <span className="font-black text-primary-dark">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#estimate-form" surface="light" size="lg">
              Get My Free Estimate
            </Button>

            <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="light" size="lg">
              Call {siteConfig.phone}
            </Button>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
            <ShieldCheck className="size-5 text-accent" />
            {siteConfig.license}
          </div>
        </div>
      </div>
    </section>
  )
}
