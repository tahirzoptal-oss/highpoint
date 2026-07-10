import { Button } from "@/components/Button"
import { isLead } from "@/lib/lead-item"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { resolveStepIcon } from "@/components/process/process-utils"
import { siteConfig } from "@/lib/site-config"

const fallbackSteps = [
  { title: "Get in Touch", description: "Call, text, or fill out the form. We respond quickly and answer your first questions." },
  { title: "Free Inspection", description: "We inspect the roof system, document concerns, and explain what we find clearly." },
  { title: "Clear Estimate", description: "You get a written estimate with options, materials, timeline, and no hidden surprises." },
  { title: "Expert Installation", description: "Our team completes the work using proper materials, clean process, and strong standards." },
]
const configuredSteps = (siteConfig as { processSteps?: { title: string; body: string }[] }).processSteps
// The step LABEL decides the icon, never its index (see process-utils).
const steps = (configuredSteps && configuredSteps.length
  ? configuredSteps.map((s) => ({ title: s.title, description: s.body }))
  : fallbackSteps
).map((s) => ({ ...s, iconName: resolveStepIcon(s.title, s.description) }))

export function ProcessTimeline() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title="A *simple* roofing process from first call to final walkthrough"
          subtitle="We keep the process clear, organized and stress-free so you always know what is happening next."
          scale="feature"
        />

        <div className="relative">
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-black/15 lg:block" />
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-accent to-transparent lg:block" />

          {/* A2 grid choreography: left-to-right step-card stagger. */}
          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                index={index}
                /* B3 depth: token two-layer shadow + asymmetric hover lift. */
                className={`hover-card relative rounded-2xl bg-white p-7${isLead(index) ? " lead-frame" : ""}`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <IconChip name={step.iconName} surface="light" />

                  <div className="text-5xl font-black text-black/8">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase text-primary-dark">
                  {step.title}
                </h3>

                <p className="mt-3 leading-relaxed text-muted">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>

          <Button href={`tel:${siteConfig.phoneRaw}`} intent="phone" surface="light" size="lg">
            Call {siteConfig.phone}
          </Button>
        </div>
      </div>
    </section>
  )
}
