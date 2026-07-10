"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Phone, CalendarCheck } from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { getPatternSlot } from "@/components/pattern-slots"
import { halfDirection } from "@/components/split-reveal"
import { designDNA } from "@/lib/design-dna"
import { siteConfig } from "@/lib/site-config"

function getFaqs() {
  return siteConfig.faqs || []
}

/* A4 active-header polarity: industrial (plate) auto-fills the open header;
 * every other pack flips polarity via .card-flip on the open header. */
const isPlate = designDNA.pack === "industrial-contractor"

export function FAQImageSplit() {
  const faqs = getFaqs()
  const [active, setActive] = useState(0)

  /* #15 pre-hydration consistency: with JS off the contract CSS forces EVERY
   * panel open, but React state opens only item 0, so items 1+ would show a
   * down (closed) chevron over an open panel. Until mount, every chevron reads
   * open; the rotation is transform-only (no CLS). After mount state wins. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* Zero-data guard: no real project photo means no image column at all.
   * Placeholder art is impossible. */
  const photo = siteConfig.projectImages[0]

  const accordion = (
    <div>
      <SectionHeading
        scale="utility"
        centered={false}
        eyebrow="Frequently Asked Questions"
        title="Got questions? We've got *answers*"
      />

      {/* A2 accordion choreography: rows walk top-down on the 60ms tight
       * stagger (.reveal-stagger assigns the nth-child slots). */}
      <div className="reveal-stagger reveal-stagger-tight space-y-3">
        {faqs.slice(0, 6).map((faq, index) => {
          const isActive = active === index
          // Pre-mount every panel renders open (contract CSS), so show the open
          // (rotated) chevron for every item; after mount state wins.
          const showOpen = !mounted || isActive

          return (
            <Reveal
              key={faq.question}
              className={`accordion-item blade-row overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm${
                isActive ? " is-open" : ""
              }`}
            >
              {/* A4 header: plate auto-fills the open header; other packs flip
               * polarity via .card-flip (dark surface + white label). */}
              <button
                type="button"
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? -1 : index)}
                className={`accordion-header flex w-full items-center justify-between gap-4 p-5 text-left text-primary-dark${
                  isActive && !isPlate ? " card-flip" : ""
                }`}
              >
                {/* Label rides the header's currentColor: dark when closed,
                 * white when the header inverts (plate fill or .card-flip). */}
                <h3 className="font-black text-current">
                  {faq.question}
                </h3>

                <ChevronDown
                  className={`accordion-chevron size-5 shrink-0 text-current ${
                    showOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* A4 panel: grid-rows 0fr->1fr height motion; no-JS renders OPEN
               * (crawlable). The answer is always in the DOM. */}
              <div className={`accordion-panel${isActive ? " is-open" : ""}`}>
                <div className="accordion-panel-inner">
                  <div className="border-t border-black/10 px-5 py-5 text-muted">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )

  if (!photo) {
    return (
      <section className="bg-white section-y">
        {/* Reading-heavy fallback: column narrowed to ~720px (taste rule 19). */}
        <div className="mx-auto max-w-[45rem] px-4 sm:px-6 lg:px-8">{accordion}</div>
      </section>
    )
  }

  return (
    <section className="bg-white section-y">
      {/* A2 split choreography: halves slide from their own sides in the
       * directional packs, the accordion half trailing 120ms. min-w-0 on both
       * halves: the photo's aspect-ratio + min-height otherwise transfers a
       * ~496px min-content width into the grid track and forces horizontal
       * page scroll on mobile (the single-column track cannot shrink below
       * an item's automatic minimum size). */}
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <Reveal direction={halfDirection("left")} className="relative min-w-0">
          <Photo
            src={photo}
            alt="Roofing FAQ"
            fill
            aspect="4/5"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="w-full min-h-[620px]"
          />

          <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-primary-dark p-6 text-white">
            <IconChip name="ShieldCheck" surface="dark" />
            <h3 className="mt-3 text-xl font-black">Quality You Can Trust</h3>
            <p className="mt-2 text-white/70">
              We are here to answer your questions and protect your home.
            </p>
          </div>
        </Reveal>

        <Reveal direction={halfDirection("right")} className="min-w-0 reveal-follow">
          {accordion}
        </Reveal>
      </div>
    </section>
  )
}

export function FAQTwoColumnCTA() {
  const faqs = getFaqs()

  /* C1/C3 pattern slot: modern-corporate textures this tinted sheet with
   * dot-grid at whisper opacity (its one light pattern band per the C3 map).
   * Other packs get null and the band stays flat. */
  const pattern = getPatternSlot("faq")

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-light)] section-y">
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          scale="utility"
          eyebrow="Frequently Asked Questions"
          title="Common questions, clear *answers*"
        />

        {/* A2 grid choreography: row-major card stagger. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {faqs.slice(0, 6).map((faq, index) => (
            <Reveal
              key={faq.question}
              index={index}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h3 className="font-black text-primary-dark">{faq.question}</h3>
              <p className="mt-3 text-muted">{faq.answer}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-primary-dark p-6 text-white">
          <div>
            <h3 className="text-xl font-black">Still have questions?</h3>
            <p className="mt-1 text-white/70">
              Call us today and our team will be happy to help.
            </p>
          </div>

          <Button href={`tel:${siteConfig.phoneRaw}`} surface="dark" size="lg">
            <Phone className="size-5 shrink-0" />
            {siteConfig.phone}
          </Button>
        </div>
      </div>
    </section>
  )
}

export function FAQContactCTA() {
  const faqs = getFaqs()
  const [active, setActive] = useState(0)

  /* #15 pre-hydration consistency: with JS off the contract CSS forces EVERY
   * panel open, but React state opens only item 0, so items 1+ would show a
   * down (closed) chevron over an open panel. Until mount, every chevron reads
   * open; the rotation is transform-only (no CLS). After mount state wins. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="bg-white section-y">
      {/* A2 split choreography: halves slide from their own sides in the
       * directional packs, the contact rail trailing 120ms; rows walk
       * top-down on the 60ms tight stagger. */}
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <Reveal direction={halfDirection("left")}>
          <SectionHeading
            scale="utility"
            centered={false}
            eyebrow="Frequently Asked Questions"
            title="We've got *answers*. You've got options"
          />

          <div className="reveal-stagger reveal-stagger-tight space-y-3">
            {faqs.slice(0, 6).map((faq, index) => {
              const isActive = active === index
              // Pre-mount every panel renders open (contract CSS), so show the
              // open (rotated) chevron for every item; after mount state wins.
              const showOpen = !mounted || isActive

              return (
                <Reveal
                  key={faq.question}
                  className={`accordion-item blade-row overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm${
                    isActive ? " is-open" : ""
                  }`}
                >
                  {/* A4 header: plate auto-fills the open header; other packs
                   * flip polarity via .card-flip (dark surface + white label). */}
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => setActive(isActive ? -1 : index)}
                    className={`accordion-header flex w-full items-center justify-between gap-4 p-5 text-left text-primary-dark${
                      isActive && !isPlate ? " card-flip" : ""
                    }`}
                  >
                    {/* Label rides the header's currentColor: dark closed,
                     * white when the header inverts (plate fill / .card-flip). */}
                    <h3 className="font-black text-current">
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
                      <div className="border-t border-black/10 px-5 py-5 text-muted">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Reveal>

        <Reveal direction={halfDirection("right")} className="reveal-follow">
        <aside className="h-full rounded-2xl bg-primary-dark p-8 text-white">
          <IconChip name="Phone" surface="dark" />

          <h3 className="mt-5 text-3xl font-black uppercase">
            Still Have Questions?
          </h3>

          <p className="mt-4 text-white/70">
            We&apos;re here to help. Get in touch with our roofing experts today.
          </p>

          <Button
            href={`tel:${siteConfig.phoneRaw}`}
            surface="dark"
            size="lg"
            className="mt-8 w-full"
          >
            <Phone className="size-5 shrink-0" />
            Call Us Now
          </Button>

          <Button
            href="#estimate-form"
            intent="ghost"
            surface="dark"
            size="lg"
            className="mt-4 w-full"
          >
            <CalendarCheck className="size-5 shrink-0" />
            Get My Free Estimate
          </Button>
        </aside>
        </Reveal>
      </div>
    </section>
  )
}
