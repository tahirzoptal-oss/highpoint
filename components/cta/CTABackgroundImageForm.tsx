import { ContactForm } from "@/components/ContactForm"
import { Photo } from "@/components/Photo"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"

export function CTABackgroundImageForm() {
  // No real project photo, the band stays a plain dark surface. Placeholder
  // art never ships.
  const backgroundImage =
    siteConfig.projectImages.length > 0 ? siteConfig.projectImages[0] : null

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y">
      {backgroundImage && (
        <div className="absolute inset-0">
          <Photo
            src={backgroundImage}
            alt={`${siteConfig.name} roofing project`}
            fill
            sizes="100vw"
            scrim="left"
            className="h-full"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_500px] lg:items-center lg:px-8">
        <div className="text-white">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-accent-light">
            Free Roofing Quote
          </p>

          {/* Feature scale (spec 2.1); accent word renders accent-light on
           * this dark band (spec 2.3 + v2 contrast invariant). */}
          <h2 data-scale="feature" className="mt-4 font-black uppercase [&_.text-accent]:text-accent-light">
            {renderAccent("Protect your home with a *trusted* local team")}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Get expert roofing guidance, honest recommendations and a clear estimate.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-primary-dark/70 p-6 backdrop-blur-md">
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
