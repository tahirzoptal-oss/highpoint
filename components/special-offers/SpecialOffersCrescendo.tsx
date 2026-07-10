import type { ComponentType, ReactNode } from "react"
import { Button } from "@/components/Button"
import { Reveal } from "@/components/Reveal"
import { renderAccent } from "@/lib/accent"
import { designDNA } from "@/lib/design-dna"
import { specialOffersData } from "@/components/special-offers/offers-data"
import { IconCalendarBooking } from "@/components/icons/IconCalendarBooking"
import { IconClipboardEstimate } from "@/components/icons/IconClipboardEstimate"
import { IconDollarFinancing } from "@/components/icons/IconDollarFinancing"
import { IconHammerNail } from "@/components/icons/IconHammerNail"
import { IconHandshake } from "@/components/icons/IconHandshake"
import { IconHouseCheck } from "@/components/icons/IconHouseCheck"
import { IconMagnifierInspection } from "@/components/icons/IconMagnifierInspection"
import { IconMedalCertified } from "@/components/icons/IconMedalCertified"
import { IconRainGutter } from "@/components/icons/IconRainGutter"
import { IconRoofPitched } from "@/components/icons/IconRoofPitched"
import { IconShieldWarranty } from "@/components/icons/IconShieldWarranty"
import { IconShingleStack } from "@/components/icons/IconShingleStack"
import { IconStormCloudHail } from "@/components/icons/IconStormCloudHail"

/**
 * SpecialOffersCrescendo (2B D2), the redesigned "banner" variant.
 *
 * The page's ONE full-bleed saturated accent surface (rule 1.8 unchanged):
 * a flat edge-to-edge accent band via .band-crescendo, hard horizontal cuts,
 * NO BandPattern (patterns are banned on the crescendo), NO card anatomy
 * (the spec 2.8 exemption executed; this band must never be retrofitted with
 * the cards/split coupon anatomy) and NO overlap hang (the offer-over-gallery
 * moment belongs to the cards/split card rows; offers-data.ts routes it off
 * whenever this band renders, so the gallery side never over-pads).
 *
 * Anatomy (V2/V5 financing band, committed in the 2026-07-03 report):
 *   Left: feature-scale white headline with ONE knockout word rendered as a
 *   .text-accent span, which .band-crescendo remaps to the on-accent ink
 *   (accent-on-accent is invisible). Short white sub-line below.
 *   Right: the inverted lg CTA carrying the locked phrase verbatim.
 *   Below (default packs): one row of up to three 128px duotone icon tiles.
 *   storm-response variation: two 140px tiles stacked beside the right CTA.
 *
 * Tile count resolves by data: 3 offer/financing facts = 3 tiles, 2 facts =
 * 2 tiles, fewer = no tile row. Never filler. A single fact renders its title
 * as the money line under the section heading (the sparse band still reads
 * designed); raw offer titles are client copy in arbitrary casing and never
 * become the data-scale H2, which stays sentence case per spec 2.3.
 * Tile fills rotate ink / white / accent-dark (the B4 inversion rule); the
 * bespoke duotone glyphs (E1) recolor through the chip-ink-* context classes.
 *
 * The 6 locked CRO phrases render verbatim and UNSTYLED; the knockout only
 * ever touches offer copy and section headings, never the Button children.
 */

type Glyph = ComponentType

type OfferFact = {
  title: string
  body: string
  Icon: Glyph
}

/* Deterministic glyph pick per fact, first match wins. Bespoke duotone set
 * only (E1); the fallback is a real glyph too, so nothing renders broken. */
const OFFER_GLYPHS: ReadonlyArray<[RegExp, Glyph]> = [
  [/financ|payment|apr|credit/i, IconDollarFinancing],
  [/storm|hail|wind/i, IconStormCloudHail],
  [/insurance|claim/i, IconShieldWarranty],
  [/inspect/i, IconMagnifierInspection],
  [/estimate|quote/i, IconClipboardEstimate],
  [/warrant/i, IconShieldWarranty],
  [/replac/i, IconShingleStack],
  [/repair/i, IconHammerNail],
  [/gutter/i, IconRainGutter],
  [/senior|military|veteran/i, IconMedalCertified],
  [/referr/i, IconHandshake],
  [/schedul|book/i, IconCalendarBooking],
  [/roof/i, IconRoofPitched],
]

function glyphFor(text: string): Glyph {
  for (const [pattern, glyph] of OFFER_GLYPHS) {
    if (pattern.test(text)) return glyph
  }
  return IconHouseCheck
}

/* B4 fill rotation for the tile row: ink, white, accent-dark. Each fill pairs
 * its chip-ink-* context class so the duotone glyph recolors correctly. */
const TILE_FILLS = [
  "bg-ink chip-ink-dark",
  "bg-white chip-ink-light",
  "bg-accent-dark chip-ink-accent",
] as const

/* The knockout: a copy-deck *marked* word wins; otherwise the first money or
 * percent token (or the word Free) knocks out, matching the V1/V2/V5 bands
 * where the dollar figure or FREE is the knocked-out word. No match = plain
 * white headline. The span is .text-accent, remapped to on-accent ink by
 * .band-crescendo. Never applied to locked phrases. */
const ACCENT_MARK = /\*[^*\n]+\*/
const KNOCKOUT_TOKEN = /\$\d[\d,.]*|\d+(?:\.\d+)?%|\bfree\b/i

function renderKnockout(text: string): ReactNode {
  if (ACCENT_MARK.test(text)) return renderAccent(text)
  const match = KNOCKOUT_TOKEN.exec(text)
  if (!match) return text
  const end = match.index + match[0].length
  return (
    <>
      {text.slice(0, match.index)}
      <span className="text-accent">{match[0]}</span>
      {text.slice(end)}
    </>
  )
}

/* .band-crescendo remaps every nested .text-accent to var(--color-on-accent)
 * for the headline knockout, but the inverted Button's label carries the same
 * .text-accent class, and for clients whose on-accent ink is white that would
 * paint a white label on the white button fill. This override restores the
 * exact paint the Button's label has everywhere else (the AA-clamped
 * --color-accent-text), important so it outranks the band remap. */
const CTA_INK = "text-[color:var(--color-accent-text,var(--color-accent))]!"

export function SpecialOffersCrescendo() {
  const so = specialOffersData()
  const offers = so?.offers ?? []
  const financing = so?.financing

  const facts: OfferFact[] = [
    ...offers.map((o) => ({
      title: o.title,
      body: o.description,
      Icon: glyphFor(`${o.title} ${o.description}`),
    })),
    ...(financing?.headline
      ? [{ title: financing.headline, body: financing.body, Icon: IconDollarFinancing }]
      : []),
  ]
  if (facts.length === 0) return null

  /* One fact: no tile row; its title is the money line below the heading. */
  const solo = facts.length === 1 ? facts[0] : null
  const headline =
    so?.heading ||
    (financing?.headline ? "Current offers & financing" : "Current special offers")
  const subline = solo ? solo.body : so?.subheading
  const expires = solo && offers[0]?.expires ? offers[0].expires : undefined

  const isStorm = designDNA.pack === "storm-response"
  const tiles = solo ? [] : facts.slice(0, isStorm ? 2 : 3)

  const cta = (
    <Button href="#estimate-form" surface="accent" size="lg" className={CTA_INK}>
      Get My Free Estimate
    </Button>
  )

  return (
    <section className="band-crescendo section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.6fr_auto]">
          <div>
            {so?.eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-80">
                {so.eyebrow}
              </p>
            )}
            <h2 data-scale="feature" className="mt-3 font-heading font-black">
              {renderKnockout(headline)}
            </h2>
            {solo && (
              <p className="mt-4 font-heading text-2xl font-black sm:text-3xl">
                {renderKnockout(solo.title)}
              </p>
            )}
            {subline && <p className="mt-4 max-w-2xl text-lg opacity-90">{subline}</p>}
            {expires && (
              <p className="mt-2 text-sm font-semibold opacity-80">Ends {expires}</p>
            )}
          </div>

          {isStorm && tiles.length > 0 ? (
            /* Storm variation: two 140px tiles stacked beside the right CTA. */
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center lg:justify-self-end">
              <div className="flex flex-col gap-6">
                {tiles.map((fact, i) => (
                  <Reveal key={`${fact.title}-${i}`} index={i}>
                    <div
                      className={`icon-tile icon-tile-crescendo-stack [&_svg]:size-18 ${TILE_FILLS[i]}`}
                    >
                      <fact.Icon />
                    </div>
                    <p className="mt-3 max-w-40 font-heading text-sm font-bold">
                      {fact.title}
                    </p>
                  </Reveal>
                ))}
              </div>
              {cta}
            </div>
          ) : (
            <div className="lg:justify-self-end">{cta}</div>
          )}
        </div>

        {!isStorm && tiles.length > 0 && (
          /* Offer cards: each fact is a glassy card on the accent band with a
           * SMALL icon square in the top-left next to the card heading, and the
           * body below (replaces the old row of large 128px standalone tiles). */
          <div
            className={`mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              tiles.length >= 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {tiles.map((fact, i) => (
              <Reveal key={`${fact.title}-${i}`} index={i}>
                <div className="h-full rounded-[var(--radius-2xl)] border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-[var(--radius-lg)] [&_svg]:size-6 ${TILE_FILLS[i]}`}
                    >
                      <fact.Icon />
                    </span>
                    <h3 className="font-heading text-lg font-bold leading-tight">
                      {fact.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed opacity-85">
                    {fact.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
