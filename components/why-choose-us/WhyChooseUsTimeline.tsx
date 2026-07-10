import { ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"

export function WhyChooseUsTimeline() {
  const items = siteConfig.whyChooseUs

  if (items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={`Why homeowners *choose* ${siteConfig.shortName}`}
          subtitle="A cleaner process, better communication, and roofing work backed by local owners."
          scale="feature"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-accent/40 md:block" />

          {/* A2 choreography: rows stagger down the timeline. */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <Reveal
                key={item.title}
                index={index}
                /* B3 depth: token two-layer shadow + asymmetric hover lift. */
                className="hover-card relative grid grid-cols-1 gap-5 rounded-2xl border border-black/10 bg-[var(--color-surface-light)] p-6 transition hover:border-accent hover:bg-white md:grid-cols-[90px_1fr]"
              >
                <div className="flex items-center gap-4 md:block">
                  <IconChip name="circle-check" surface="light" size={48} />

                  <div className="mt-0 text-3xl font-black text-accent md:mt-5">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-primary-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>

          <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark/60">
            <ShieldCheck className="size-5 text-accent" />
            Licensed, insured and warranty-backed.
          </div>
        </div>
      </div>
    </section>
  )
}
