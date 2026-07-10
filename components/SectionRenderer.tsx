import type { ReactNode } from "react"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { designDNA } from "@/lib/design-dna"
import "@/lib/heading-align"
import { Reveal } from "@/components/Reveal"
import { offerOverGalleryActive } from "@/components/special-offers/offers-data"
import { Hero } from "@/components/Hero"
import { TrustLogoSlider } from "@/components/TrustLogoSlider"
import { Reviews } from "@/components/Reviews"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Gallery } from "@/components/Gallery"
import { Process } from "@/components/Process"
import { FAQ } from "@/components/FAQ"
import { CTABanner } from "@/components/CTABanner"
import { ServiceAreas } from "@/components/ServiceAreas"
import { Blog } from "@/components/Blog"
import { SpecialOffers } from "@/components/SpecialOffers"
import { BrandMarquee } from "@/components/BrandMarquee"

/**
 * SectionRenderer, the homepage dispatcher. Renders siteConfig.layout.order
 * (the locked conversion blueprint) through the resolved per-client variants,
 * and owns the section-level reveal choreography (2B A1/A2).
 *
 * Reveal wiring (A1), the hard rules:
 *   - Hero and the FIRST band after the hero are NEVER wrapped: nothing above
 *     the fold participates, so the LCP element never waits on JS. Header,
 *     TopBar and MobileCTABar live outside this dispatcher entirely.
 *   - Everything below gets ONE coarse section-entrance Reveal. Finer reveals
 *     (card grids, split halves, accordion rows) belong to the section
 *     components themselves.
 *   - A section that pulls across a band seam is NOT wrapped: the hidden
 *     state's will-change keeps a stacking context on the wrapper, which
 *     would trap the pulled card's z-index and let the later (receiving)
 *     band paint over the hang. Today that is specialOffers whenever
 *     offer-over-gallery is live; hero-into-trust is exempt by the first-band
 *     rule and stat-badge-photo is intra-section.
 *
 * Direction choreography (A2), per-pack profiles from the 2B matrix:
 *   - commercial-authority / industrial-contractor / storm-response =
 *     directional alternation: content bands alternate slide-in-from-left and
 *     slide-in-from-right. Full-bleed strips (marquee, the specialOffers
 *     crescendo, the final CTA band) always rise, so the saturated surfaces
 *     never show an edge sliver mid-slide.
 *   - every other pack = fade-up only (calm); the per-pack distance/duration
 *     comes from html[data-motion] tokens in globals.css, not from here.
 *
 * Stagger indices: adjacent wrapped sections alternate --stagger-i 0/1, so
 * two bands crossing the threshold in the same scroll gesture cascade by one
 * 80ms step. Indices never accumulate: a monotonic index would give every
 * lower band the capped 320ms solo delay, exactly the sluggishness the A1
 * cap exists to prevent. Sibling stagger inside grids is the section
 * components' job (.reveal-stagger / Reveal index).
 */

/** Packs whose A2 profile is directional left/right alternation. */
const DIRECTIONAL_PACKS = new Set<string>([
  "commercial-authority",
  "industrial-contractor",
  "storm-response",
  "tactical-tech",
])

/** Sections eligible for horizontal entrances in directional packs.
 * Full-bleed strips (marqueeTrust, specialOffers crescendo, cta) are
 * deliberately absent: they always fade up. */
const HORIZONTAL_SECTIONS = new Set<string>([
  "reviews",
  "whyChooseUs",
  "about",
  "services",
  "gallery",
  "process",
  "blog",
  "faq",
  "serviceAreas",
])

type RevealDirection = "up" | "left" | "right"

export function SectionRenderer() {
  const layout = getLayout()
  const order = siteConfig.layout.order

  /* First band after the hero (A1: never wrapped). Slots that render nothing
   * can never be the first band: the marqueeLicense/marqueeEstimate slots are
   * always null, and marqueeTrust is null when the reviews marquee already
   * consumed the one-marquee budget. TrustLogoSlider always renders (its
   * typeset-credentials fallback includes a hardcoded line), so in the locked
   * order the first band is trustLogos; this stays correct if a client order
   * ever drops it. */
  const isEmptySlot = (section: string): boolean =>
    section === "marqueeLicense" ||
    section === "marqueeEstimate" ||
    (section === "marqueeTrust" && layout.reviews === "marquee")
  const firstBand = order
    .slice(order.indexOf("hero") + 1)
    .find((section) => !isEmptySlot(section))

  const directional = DIRECTIONAL_PACKS.has(designDNA.pack)
  let wrapped = 0
  let sides = 0

  /** Wrap a section in its entrance Reveal, or pass it through untouched when
   * a hard rule exempts it. Called in order, so the alternation counters walk
   * the page top to bottom. */
  const reveal = (section: string, node: ReactNode): ReactNode => {
    if (section === "hero" || section === firstBand) return node
    if (section === "specialOffers" && offerOverGalleryActive()) return node
    const direction: RevealDirection =
      directional && HORIZONTAL_SECTIONS.has(section)
        ? sides++ % 2 === 0
          ? "left"
          : "right"
        : "up"
    return (
      <Reveal key={section} direction={direction} index={wrapped++ % 2}>
        {node}
      </Reveal>
    )
  }

  return (
    <>
      {order.map((section) => {
        switch (section) {
          case "hero":
            return (
              <div id="hero" key={section}>
                {/* NEVER wrapped in Reveal (A1: the LCP element must not wait
                 * on JS). overlap: only the home hero (rendered by this
                 * dispatcher, with the TrustLogos band below it) may pull
                 * across the seam. Inner pages hard-code hero variants
                 * without the flag, so a pull can never fire where no band
                 * receives it (spec 2.5). */}
                <Hero variant={layout.hero} overlap />
              </div>
            )

          case "trustLogos":
            /* The first band after the hero in the locked order: reveal()
             * passes it through unwrapped. */
            return reveal(section, <TrustLogoSlider key={section} />)

          case "reviews":
            return reveal(
              section,
              <Reviews key={section} variant={layout.reviews} />
            )

          case "marqueeTrust":
            /* Marquee budget ruling: ONE infinite scroller per page, counting
             * the reviews "marquee" variant. When reviews scroll, they consume
             * the budget and every BrandMarquee slot renders nothing. */
            if (layout.reviews === "marquee") return null
            return reveal(
              section,
              <BrandMarquee
                key={section}
                phrases={[
                  `${siteConfig.city.toUpperCase()}'S TRUSTED ROOFING CONTRACTOR`,
                  "LICENSED • INSURED • WARRANTY BACKED",
                ]}
                variant="accent"
                twoTone={directional}
              />
            )

          case "whyChooseUs":
            return reveal(
              section,
              <WhyChooseUs key={section} variant={layout.whyChooseUs} />
            )

          case "about":
            return (
              <div id="about" key={section}>
                {reveal(section, <About variant={layout.about} />)}
              </div>
            )

          case "services":
            return reveal(
              section,
              <Services key={section} variant={layout.services} />
            )

          case "specialOffers":
            /* Unwrapped while offer-over-gallery is live (see the stacking
             * note in the header comment); otherwise it rises like any band
             * (the crescendo never slides sideways). */
            return reveal(
              section,
              <SpecialOffers key={section} variant={layout.specialOffers} />
            )

          /* Marquee budget: exactly ONE marquee per page. The first slot
           * (marqueeTrust) renders unless the reviews marquee already used the
           * budget; the later slots render nothing. Adjacent sections carry
           * their own section-y padding, so spacing stays sane. */
          case "marqueeLicense":
            return null

          case "gallery":
            return reveal(
              section,
              <Gallery key={section} variant={layout.gallery} />
            )

          case "process":
            return reveal(
              section,
              <Process key={section} variant={layout.process} />
            )

          case "faq":
            return reveal(section, <FAQ key={section} variant={layout.faq} />)

          case "marqueeEstimate":
            return null

          case "cta":
            return reveal(
              section,
              <CTABanner key={section} variant={layout.cta} />
            )

          case "serviceAreas":
            return (
              <div id="service-area" key={section}>
                {reveal(
                  section,
                  <ServiceAreas variant={layout.serviceAreas} />
                )}
              </div>
            )

          case "blog":
            return reveal(section, <Blog key={section} variant={layout.blog} />)

          default:
            return null
        }
      })}
    </>
  )
}
