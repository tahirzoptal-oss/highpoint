"use client"

import { useState } from "react"
import {
  CalendarCheck,
  ChevronDown,
  ClipboardCheck,
  Hammer,
  Phone,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { resolveStepIcon } from "@/components/process/process-utils"
import { stripAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"

/* The step LABEL decides the icon, never its index (see process-utils). This
 * accordion paints raw Lucide components, so it maps the resolved kebab name
 * back to one; every name here is one resolveStepIcon can return. */
const STEP_ICON: Record<string, LucideIcon> = {
  phone: Phone,
  "calendar-check": CalendarCheck,
  "shield-check": ShieldCheck,
  "clipboard-check": ClipboardCheck,
  search: Search,
  hammer: Hammer,
}
const projectImages = (siteConfig as { projectImages?: string[] }).projectImages ?? []
// No real project photos, no photo panel. Placeholder art never ships.
const imageFor = (i: number): string | null =>
  projectImages.length ? projectImages[i % projectImages.length] : null
const fallbackSteps = [
  {
    title: "Get in Touch",
    description:
      "Call, text, or fill out the form. We respond quickly, answer your first questions, and help you understand the next step.",
  },
  {
    title: "Free Inspection",
    description:
      "We inspect the full roof system, document damage or problem areas, and explain what we find in simple language.",
  },
  {
    title: "Clear Estimate",
    description:
      "You receive a written estimate with clear options, materials, timeline, and no hidden surprises.",
  },
  {
    title: "Expert Installation",
    description:
      "Our crew completes the work using proper installation standards, clean jobsite protection, and quality materials.",
  },
  {
    title: "Final Walkthrough",
    description:
      "We review the completed work with you, clean the jobsite, and make sure you understand your warranty coverage.",
  },
]
const configuredSteps = (siteConfig as { processSteps?: { title: string; body: string }[] }).processSteps
const steps = (configuredSteps && configuredSteps.length
  ? configuredSteps.map((s) => ({ title: s.title, description: s.body }))
  : fallbackSteps
).map((s, i) => ({
  ...s,
  image: imageFor(i),
  icon: STEP_ICON[resolveStepIcon(s.title, s.description)] ?? ShieldCheck,
}))

export function ProcessSplitAccordion() {
  const [active, setActive] = useState(0)
  const activeStep = steps[active]
  const hasImages = projectImages.length > 0

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 15%, transparent),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              Our Process
            </p>

            <h2 data-scale="feature" className="mt-4 font-black uppercase">
              {stripAccent("A clear roofing process from first call to final walkthrough")}
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-white/65">
            We keep every step organized, documented and easy to understand so you always know what happens next.
          </p>
        </div>

        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        <div className={`grid gap-8 ${hasImages ? "lg:grid-cols-[0.95fr_1.05fr]" : ""}`}>
          {hasImages && activeStep.image && (
            <Reveal
              direction={halfDirection("left")}
              className="relative min-h-[560px]"
            >
              <div className="absolute inset-0 shadow-2xl">
                <Photo
                  src={activeStep.image}
                  alt={activeStep.title}
                  fill
                  sizes="620px"
                  scrim="bottom"
                  className="h-full"
                />
              </div>

              <div className="absolute left-6 top-6 rounded-full bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-on-accent)]">
                Step {String(active + 1).padStart(2, "0")}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-sm font-black uppercase tracking-[0.25em] text-accent-light">
                  Step {String(active + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-3 text-4xl font-black uppercase leading-tight">
                  {activeStep.title}
                </h3>
              </div>
            </Reveal>
          )}

          <Reveal
            direction={hasImages ? halfDirection("right") : "up"}
            className={`rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-md ${
              hasImages ? "reveal-follow" : ""
            }`}
          >
            <div className="divide-y divide-white/10">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = active === index

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActive(index)}
                    className="group w-full py-4 text-left"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`grid size-14 shrink-0 place-items-center rounded-lg transition ${
                          isActive
                            ? "bg-accent text-[var(--color-on-accent)]"
                            : "bg-white/10 text-white group-hover:bg-accent group-hover:text-[var(--color-on-accent)]"
                        }`}
                      >
                        <Icon className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`rounded-xl transition-all duration-300 ${
                            isActive
                              ? "border border-white/10 bg-white/5 p-5"
                              : "p-5"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h3
                              className={`text-xl font-black uppercase transition ${
                                isActive ? "text-white" : "text-white/90"
                              }`}
                            >
                              {step.title}
                            </h3>

                            <ChevronDown
                              className={`size-5 shrink-0 text-white transition duration-300 ${
                                isActive ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          <div
                            className={`grid transition-all duration-300 ${
                              isActive
                                ? "mt-4 grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="leading-relaxed text-white/65">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        {/* D1 cadence: a section-end estimate CTA after the final step (dark
         * band, so the dark surface inversion). */}
        <div className="mt-12 flex justify-center">
          <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>
        </div>
      </div>
    </section>
  )
}
