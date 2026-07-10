import { Clock, Check } from "lucide-react"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { StatNumeral } from "@/components/StatNumeral"
import { SectionHeading } from "@/components/SectionHeading"
import { siteConfig } from "@/lib/site-config"
import type { SpecialOffersData } from "@/lib/component-registry"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"

/**
 * Balanced offers + financing. Both columns are equal height (lg:items-stretch +
 * h-full flex cards), so a single offer next to a financing card reads as a
 * deliberate two-up with no dead space. With no financing it centers the offers;
 * with no offers it centers financing. The financing card is always navy, so its
 * text is white regardless of the site theme.
 */

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
 * the two-up straddles the seam into the gallery band. The section drops its
 * bottom padding, and the grid pairs the contract class (z lift plus the
 * -overlap-pull top margin) with a compensating top padding and a negative
 * bottom margin, so the cards end one overlap-pull inside the gallery band.
 * The gallery side adds .overlap-receive to compensate. */
const OVER_GALLERY = offerOverGalleryActive()
const HANG_CLASS =
  "overlap-card-over-gallery pt-[var(--overlap-pull)] -mb-[var(--overlap-pull)]"

export function SpecialOffersSplit() {
  const so = siteConfig.specialOffers as SpecialOffersData | undefined
  const offers = so?.offers ?? []
  const financing = so?.financing
  const hasOffers = offers.length > 0
  const hasFinancing = Boolean(financing?.headline)
  const twoUp = hasOffers && hasFinancing

  return (
    <section
      className="bg-card section-y"
      style={OVER_GALLERY ? { paddingBottom: 0 } : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={so?.eyebrow || "Limited-Time"}
          title={so?.heading || "Current Offers"}
          subtitle={so?.subheading}
          scale="feature"
          layout="centered"
        />

        <div
          className={`mx-auto grid gap-6 lg:items-stretch ${
            twoUp ? "max-w-5xl lg:grid-cols-2" : "max-w-2xl"
          }${OVER_GALLERY ? ` ${HANG_CLASS}` : ""}`}
        >
          {hasOffers && (
            <div className="grid gap-6">
              {offers.map((offer) => {
                const { figure, rest } = splitOfferFigure(offer.title)

                return (
                  <div
                    key={offer.title}
                    className="relative isolate flex h-full flex-col rounded-2xl border border-border bg-background p-8"
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
                          className="absolute -right-4 -top-10"
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
                    {/* Solid-accent chip (#16): the offer card leads with the
                     * same high-contrast accent badge as the navy financing
                     * card, so the two-up reads as balanced peers, not a bold
                     * card beside a faint one. */}
                    <IconChip name="badge-percent" surface="dark" />
                    {/* The offer figure is a StatNumeral (spec 2.2). */}
                    {figure && (
                      <StatNumeral value={figure} className="mt-5 text-accent" />
                    )}
                    <div className={`flex flex-wrap items-center gap-2 ${figure ? "mt-2" : "mt-5"}`}>
                      {rest ? (
                        <h3 className="font-heading text-2xl font-bold text-foreground">
                          {rest}
                        </h3>
                      ) : null}
                      {offer.badge && (
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
                          {offer.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 leading-relaxed text-muted">
                      {offer.description}
                    </p>
                    {/* Filler slot (#16): the expiry urgency line, else the
                     * sitewide trust promise. It never echoes the financing
                     * headline: the navy financing card already carries that
                     * with a full icon + title + checklist, so echoing it here
                     * as a bare floating line is the orphaned duplicate. */}
                    {offer.expires ? (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        <Clock className="size-4" /> Ends {offer.expires}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm font-semibold text-muted">
                        No obligation. No pressure.
                      </p>
                    )}
                    {/* Bottom-anchored CTA (spec 2.8): pinned with mt-auto, so
                     * all vertical slack collects into one gap above it. */}
                    <div className="mt-auto pt-8">
                      <Button href="#estimate-form" surface="light" className="w-full">
                        Get My Free Estimate
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {hasFinancing && (
            <div className="flex h-full flex-col rounded-2xl border border-border bg-primary-dark p-8">
              <IconChip name="credit-card" surface="dark" />
              <h3 className="mt-5 font-heading text-2xl font-bold text-white">
                {financing?.headline || "Flexible Financing"}
              </h3>
              <p className="mt-3 leading-relaxed text-white/70">
                {financing?.body ||
                  "Spread the cost of your project over low monthly payments."}
              </p>
              <ul className="mt-6 space-y-3">
                {["No obligation. No pressure.", "Fast, simple approval", "You're in control"].map(
                  (line) => (
                    <li key={line} className="flex items-center gap-3 text-white">
                      <Check className="size-5 shrink-0 text-white" /> {line}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-auto pt-8">
                <Button href="#estimate-form" surface="dark" className="w-full">
                  Get My Free Estimate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
