"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { designDNA } from "@/lib/design-dna"
import { siteConfig } from "@/lib/site-config"

export function FAQSplitAccordion() {
  const faqs = siteConfig.faqs || []
  const [active, setActive] = useState(0)

  /* #15 pre-hydration consistency: with JS off the contract CSS forces EVERY
   * panel open, but React state opens only item 0, so items 1+ would show a
   * down (closed) chevron over an open panel. Until mount, every chevron reads
   * open; the rotation is transform-only (no CLS). After mount state wins. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* A4 active-header polarity: industrial (plate) auto-fills; others flip via
   * .card-flip on the open header. */
  const isPlate = designDNA.pack === "industrial-contractor"

  if (!faqs.length) return null

  return (
    <section className="relative bg-white section-y">
      <div className="relative z-10 mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        {/* The dark panel carries its own background and padding, so the
         * heading is always contained; it can never slice at a band edge.
         * A2 split choreography: halves slide from their own sides in the
         * directional packs, the accordion half trailing 120ms. */}
        <Reveal direction={halfDirection("left")} className="relative">
          <div
            aria-hidden="true"
            className="absolute -right-5 bottom-8 top-8 hidden w-3 rotate-[7deg] bg-accent/80 lg:block"
          />

          <div className="relative h-full rounded-2xl bg-[var(--color-surface-dark)] p-8 text-white lg:p-10">
            {/* Dark-surface header: heading map row applied via data-scale +
              * the shared eyebrow hardware. SectionHeading itself is not
              * dark-surface safe (accent text), so white text stays manual. */}
            <p className="eyebrow mb-3 flex items-center gap-2.5 text-[13px] text-accent-light">
              <span aria-hidden="true" className="eyebrow-mark" />
              FAQ
            </p>

            <h2 data-scale="utility" className="font-heading font-bold tracking-tight">
              Roofing questions, clear answers
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              Get quick answers before booking your inspection. Still have a question?
              Our local team is happy to help.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/8 p-6 backdrop-blur-md">
              <IconChip name="HelpCircle" surface="dark" className="mb-4" />
              <div className="text-2xl font-black">Need a faster answer?</div>
              <p className="mt-2 text-white/60">
                Call our team and we&apos;ll point you in the right direction.
              </p>

              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                surface="dark"
                className="mt-5"
              >
                <Phone className="size-5 shrink-0" />
                {siteConfig.phone}
              </Button>
            </div>
          </div>
        </Reveal>

        {/* A2: the accordion half trails 120ms; rows walk top-down on the
         * 60ms tight stagger (.reveal-stagger assigns the nth-child slots). */}
        <Reveal
          direction={halfDirection("right")}
          className="reveal-follow reveal-stagger reveal-stagger-tight divide-y divide-black/10 rounded-2xl bg-[var(--color-surface-light)] p-4 shadow-xl"
        >
          {faqs.map((faq, index) => {
            const isActive = active === index
            // Pre-mount every panel renders open (contract CSS), so show the
            // open (rotated) chevron for every item; after mount state wins.
            const showOpen = !mounted || isActive

            return (
              <Reveal
                key={faq.question}
                className={`accordion-item blade-row my-2 overflow-hidden rounded-2xl transition ${
                  isActive ? "is-open border border-accent/35 shadow-xl" : ""
                }`}
              >
                {/* A4 header: plate auto-fills the open header; other packs flip
                 * polarity via .card-flip (dark surface + white label). */}
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? -1 : index)}
                  className={`accordion-header flex w-full items-center justify-between gap-5 p-6 text-left text-primary-dark transition ${
                    isActive
                      ? isPlate
                        ? ""
                        : "card-flip"
                      : "hover:bg-white"
                  }`}
                >
                  {/* Label rides the header's currentColor: dark when closed,
                   * white when the header inverts (plate fill or .card-flip). */}
                  <h3 className="text-lg font-black text-current md:text-xl">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    className={`accordion-chevron size-5 shrink-0 text-current ${
                      showOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* A4 panel: grid-rows 0fr->1fr height motion; no-JS renders
                 * OPEN (crawlable). The answer is always in the DOM. */}
                <div className={`accordion-panel${isActive ? " is-open" : ""}`}>
                  <div className="accordion-panel-inner">
                    <p className="px-6 pb-6 leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
