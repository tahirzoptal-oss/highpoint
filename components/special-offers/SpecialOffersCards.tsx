import { Clock, ArrowRight } from "lucide-react"
import { IconChip } from "@/components/IconChip"
import { StatNumeral } from "@/components/StatNumeral"
import { Button } from "@/components/Button"
import { siteConfig } from "@/lib/site-config"
import type { SpecialOffersData } from "@/lib/component-registry"
import { SectionHeading } from "@/components/SectionHeading"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

/**
 * Pull a dollar figure out of an offer title so it can render large. Only
 * reformats real copy; nothing is fabricated.
 */
function splitOfferFigure(title: string): { figure: string | null; rest: string } {
  const match = title.match(/\$\s?\d[\d,]*(?:\.\d{2})?/)
  if (!match) return { figure: null, rest: title }
  const figure = match[0]
  const rest = title
    .replace(figure, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:,.-]+|[\s:,.-]+$/g, "")
  return { figure, rest }
}

/* Overlap moment (spec 2.5): when the resolver grants "offer-over-gallery",
 * the card row straddles the seam into the gallery band. The section drops
 * its bottom padding, and this wrapper pairs the contract class (z lift plus
 * the -overlap-pull top margin) with a compensating top padding and a
 * negative bottom margin, so the cards end one overlap-pull inside the
 * gallery band. The gallery side adds .overlap-receive to compensate. */
const OVER_GALLERY = offerOverGalleryActive()
const HANG_CLASS =
  "overlap-card-over-gallery pt-[var(--overlap-pull)] -mb-[var(--overlap-pull)]"

export function SpecialOffersCards() {
  const so = siteConfig.specialOffers as SpecialOffersData | undefined
  const offers = so?.offers ?? []
  const financing = so?.financing

  return (
    <section
      className="section-y"
      style={OVER_GALLERY ? { paddingBottom: 0 } : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={so?.eyebrow || "Limited-Time"}
          title={so?.heading || "Current Offers & Financing"}
          subtitle={so?.subheading}
          scale="feature"
          layout="centered"
        />

        <div className={OVER_GALLERY ? HANG_CLASS : undefined}>
          {offers.length > 0 && (
            <div
              className={`mx-auto grid gap-6 ${
                offers.length === 1
                  ? "max-w-md"
                  : offers.length === 2
                    ? "max-w-4xl sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {offers.map((offer) => {
                const { figure, rest } = splitOfferFigure(offer.title)

                return (
                  <div
                    key={offer.title}
                    className="relative isolate flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-accent/40"
                  >
                    {/* Ghost background art (spec 2.8): the offer figure as a
                     * 140-160px StatNumeral, clipped to the card and painted
                     * between the card surface and its content (isolate + -z-10). */}
                    {figure && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
                      >
                        <StatNumeral
                          value={figure}
                          size="ghost"
                          className="absolute -right-4 -top-8"
                        />
                      </span>
                    )}
                    {/* Optional coupon keyline (spec 2.8): a dashed inset rule
                     * on the letterpress packs only, keyed off the same
                     * html[data-hardware] attribute as the Button hardware. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-2 -z-10 hidden rounded-[max(calc(var(--radius-2xl)-0.5rem),0px)] border border-dashed border-foreground/20 [[data-hardware=letterpress]_&]:block"
                    />
                    {offer.badge && (
                      <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-accent)]">
                        {offer.badge}
                      </span>
                    )}
                    {/* Solid-accent chip (#16): high-contrast accent badge so
                     * the offer icon never reads faint on the card surface. */}
                    <IconChip name="tag" surface="dark" className="mb-4" />
                    {/* The offer figure is a StatNumeral (spec 2.2). */}
                    {figure && <StatNumeral value={figure} className="text-accent" />}
                    {rest ? (
                      <h3
                        className={`font-heading text-xl font-bold text-foreground ${
                          figure ? "mt-1" : ""
                        }`}
                      >
                        {rest}
                      </h3>
                    ) : null}
                    <p className="mt-2 flex-1 text-muted leading-relaxed">{offer.description}</p>
                    {/* Filler slot (#16): the expiry urgency line, else the
                     * sitewide trust promise. It never echoes the financing
                     * headline: the dedicated financing panel below already
                     * carries it, so echoing it here as a bare floating line
                     * is the orphaned duplicate. */}
                    {offer.expires ? (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        <Clock className="size-4" /> Ends {offer.expires}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm font-semibold text-muted">
                        No obligation. No pressure.
                      </p>
                    )}
                    {/* Bottom-anchored CTA (spec 2.8): mt-auto pins it. */}
                    <a
                      href="#estimate-form"
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-foreground hover:text-accent"
                    >
                      Get My Free Estimate <ArrowRight className="size-4" />
                    </a>
                  </div>
                )
              })}
            </div>
          )}

          {financing?.headline && (
            <div className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-accent/20 bg-accent/5 p-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <IconChip name="credit-card" surface="light" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{financing.headline}</h3>
                  <p className="mt-1 text-muted leading-relaxed">{financing.body}</p>
                </div>
              </div>
              <Button href="#estimate-form" surface="light" className="shrink-0">
                Get My Free Estimate
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
