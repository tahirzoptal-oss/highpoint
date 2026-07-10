import { CheckCircle, Phone } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { siteConfig } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"

export function CTAConnectedForm() {
  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_520px] lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            Get Started
          </p>

          {/* Feature scale (spec 2.1); light band, so the accent word can use
           * text-accent directly (spec 2.3). */}
          <h2 data-scale="feature" className="mt-4 font-black uppercase text-primary-dark">
            {renderAccent("Ready for a roof you can *trust*?")}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Schedule a free inspection and get clear answers from a local roofing team.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["Free inspections", "Fast response", "Licensed & insured", "Warranty-backed work"].map((item) => (
              <div key={item} className="flex items-center gap-3 font-bold text-primary-dark">
                <CheckCircle className="size-5 text-accent" />
                {item}
              </div>
            ))}
          </div>

          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="mt-8 inline-flex items-center gap-2 font-black text-primary-dark"
          >
            <Phone className="size-5 text-accent" />
            {siteConfig.phone}
          </a>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-black uppercase text-primary-dark md:text-3xl">
            Get My Free Estimate
          </h3>
          <p className="mt-2 text-muted">
            Share your project details, and our team will respond.
          </p>
          <p className="mt-2 font-bold text-accent">
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