"use client"

import { useEffect, useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { designDNA } from "@/lib/design-dna"
import { siteConfig } from "@/lib/site-config"

export function FAQSimpleAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  /* #15 pre-hydration consistency: with JS off the contract CSS forces EVERY
   * panel open, but React state opens only item 0, so items 1+ would show the
   * closed "+" glyph over an open panel. Until mount, every item shows the
   * open glyph so the affordance matches the force-open panels; the glyph swap
   * is transform/opacity-free (no CLS). After mount, real per-item state wins. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* A4 active-header polarity: industrial (plate hardware) auto-fills the open
   * header with accent + white via CSS. Every other pack flips polarity by
   * adding .card-flip to the open header (dark surface + white label). */
  const isPlate = designDNA.pack === "industrial-contractor"

  return (
    <section className="bg-white section-y">
      {/* Reading-heavy section: column narrowed to ~720px (taste rule 19). */}
      <div className="mx-auto max-w-[45rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          scale="utility"
          eyebrow="Frequently Asked Questions"
          title="Common roofing *questions*"
        />

        {/* A2 accordion choreography: rows walk top-down on the 60ms tight
         * stagger (.reveal-stagger assigns the nth-child slots). */}
        <div className="reveal-stagger reveal-stagger-tight space-y-4">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = open === index
            // Pre-mount every panel renders open (contract CSS), so show the
            // open glyph for every item; after mount, per-item state wins.
            const showOpen = !mounted || isOpen

            return (
              <Reveal
                key={faq.question}
                className={`accordion-item blade-row overflow-hidden rounded-2xl border border-black/10 bg-white${
                  isOpen ? " is-open" : ""
                }`}
              >
                {/* A4 header: .accordion-header carries the active treatment
                 * (plate auto-fill or .card-flip polarity flip on open). */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className={`accordion-header flex w-full items-center justify-between p-6 text-left text-primary-dark${
                    isOpen && !isPlate ? " card-flip" : ""
                  }`}
                >
                  {/* Label rides the header's currentColor: dark when closed,
                   * white when the header inverts (plate fill or .card-flip). */}
                  <span className="font-semibold text-current">
                    {faq.question}
                  </span>

                  {/* Chevron uses the shared +/- glyphs; .accordion-chevron is
                   * kept for parity though these do not rotate. On open the
                   * header inverts, so the glyph rides currentColor (white).
                   * showOpen (not isOpen) drives the glyph so the no-JS render
                   * shows the collapse glyph over every force-open panel. */}
                  {showOpen ? (
                    <Minus className="accordion-chevron h-5 w-5 shrink-0 text-current" />
                  ) : (
                    <Plus className="accordion-chevron h-5 w-5 shrink-0 text-accent" />
                  )}
                </button>

                {/* A4 panel: grid-rows 0fr->1fr height motion; no-JS renders
                 * OPEN (crawlable). The answer is always in the DOM. */}
                <div className={`accordion-panel${isOpen ? " is-open" : ""}`}>
                  <div className="accordion-panel-inner">
                    <div className="border-t border-black/10 px-6 py-5 text-muted">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
