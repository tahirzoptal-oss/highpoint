"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Phone } from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { getPatternSlot } from "@/components/pattern-slots"
import { designDNA } from "@/lib/design-dna"
import { siteConfig } from "@/lib/site-config"

export function FAQCenteredAccordion() {
  const faqs = siteConfig.faqs || []
  const [active, setActive] = useState(0)

  /* #15 pre-hydration consistency: with JS off the contract CSS forces EVERY
   * panel open, but React state opens only item 0, so items 1+ would show a
   * down (closed) chevron over an open panel. Until mount, every chevron reads
   * open; the rotation is transform-only (no CLS). After mount, per-item state
   * wins. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* C1/C3 pattern slot: modern-corporate textures this tinted sheet with
   * dot-grid at whisper opacity (its one light pattern band per the C3 map).
   * Other packs get null and the band stays flat. */
  const pattern = getPatternSlot("faq")

  /* A4 active-header polarity: industrial (plate) auto-fills; others flip via
   * .card-flip on the open header. */
  const isPlate = designDNA.pack === "industrial-contractor"

  if (!faqs.length) return null

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}

      {/* Reading-heavy section: column narrowed to ~720px (taste rule 19). */}
      <div className="relative mx-auto max-w-[45rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          scale="utility"
          eyebrow="FAQ"
          title="Common roofing *questions*"
          subtitle="Simple answers to the questions homeowners usually ask before starting a roofing project."
        />

        {/* A2 accordion choreography: rows walk top-down on the 60ms tight
         * stagger (.reveal-stagger assigns the nth-child slots). */}
        <div className="reveal-stagger reveal-stagger-tight divide-y divide-black/10 rounded-2xl bg-white p-4 shadow-xl">
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
                      : "hover:bg-[var(--color-surface-light)]"
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
        </div>

        <div className="mt-10 text-center">
          <Button href={`tel:${siteConfig.phoneRaw}`} surface="light" size="lg">
            <Phone className="size-5 shrink-0" />
            Still Have Questions?
          </Button>
        </div>
      </div>
    </section>
  )
}