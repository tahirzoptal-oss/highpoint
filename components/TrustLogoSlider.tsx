import { siteConfig } from "@/lib/site-config"
import { getOverlapMoments } from "@/lib/design-dna"
import { getLayout } from "@/lib/get-layout"
import type { HeroVariant } from "@/lib/component-registry"

/**
 * The credentials strip directly under the hero. Renders the client's real
 * manufacturer / certification badges (GAF Master Elite, CertainTeed, Owens
 * Corning, NRCA, BBB Accredited ...) resolved at build time from research
 * flags via the trust-badge registry.
 *
 * Locked design value: review-platform logos (Google, Facebook, bare BBB
 * fallback) are BANNED from this strip. When a client has no real
 * manufacturer or certification badges on file, the strip renders as typeset
 * credentials (license, years in business, locally owned) instead. A badge
 * with no image renders its name typeset; placeholder art is impossible.
 */

const REVIEW_PLATFORM_PATTERN = /\b(google|facebook|yelp|angi|review|reviews)\b/i

/** Hero variants whose form card sits in flow at the section's bottom edge,
 * the only anatomies that can actually pull across the seam (spec 2.5).
 * commercial-authority gained pull anatomy (its side form card anchors to the
 * section edge when the moment is granted), so every hero in the
 * commercial-authority pack pool can now land the granted moment. */
const PULLING_HEROES: HeroVariant[] = [
  "project-showcase",
  "dark-owner-truck",
  "bright-owner",
  "sunset-owner-truck",
]

function isReviewPlatform(name: string): boolean {
  // Registry accreditations like "BBB Accredited A+" stay; the bare "BBB"
  // review-platform fallback logo does not.
  return REVIEW_PLATFORM_PATTERN.test(name) || name.trim().toLowerCase() === "bbb"
}

export function TrustLogoSlider() {
  const badges = (siteConfig.trustLogos || []).filter(
    (logo) => logo.name && !isReviewPlatform(logo.name)
  )

  const years = siteConfig.founder.yearsExperience
  const typesetItems = [
    siteConfig.license,
    years ? `${years}+ Years in Business` : "",
    "Locally Owned & Operated",
  ].filter(Boolean)

  if (!badges.length && !typesetItems.length) return null

  // A small, real set of credentials reads as proof when shown statically and
  // centered. Only scroll it when there are too many to sit in one row.
  const scroll = badges.length > 7
  const row = scroll ? [...badges, ...badges] : badges

  // Overlap moment (spec 2.5): when the resolver grants hero-into-trust AND
  // the resolved hero anatomy can pull (its form card breaks 48px into this
  // band via .overlap-pull-into-next), this band compensates with
  // .overlap-receive. Otherwise it keeps normal quiet-band padding, so a
  // grid-form hero never leaves dead compensation padding here.
  const receivesHero =
    getOverlapMoments().includes("hero-into-trust") &&
    PULLING_HEROES.includes(getLayout().hero)

  return (
    <section
      className={`relative z-10 bg-white pb-16 ${
        receivesHero ? "overlap-receive" : "pt-16"
      }`}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">
            {badges.length ? "Certified, Accredited & Trusted" : "Licensed & Trusted"}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark md:text-3xl">
            The credentials behind every roof we install
          </h2>
        </div>

        {badges.length === 0 ? (
          // No inter-item bullets: a bullet glued to the front of an item
          // reappears at the START of any wrapped line, so the second row shows
          // an orphaned leading marker (#22). Dropping it and letting the flex
          // gap carry the separation keeps the strip consistent on every wrap.
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {typesetItems.map((item) => (
              <span
                key={item}
                className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-primary-dark md:text-base"
              >
                {item}
              </span>
            ))}
          </div>
        ) : scroll ? (
          <div className="overflow-hidden">
            <div className="flex w-max animate-logo-marquee items-center gap-6">
              {row.map((logo, index) => (
                <BadgeTile key={`${logo.name}-${index}`} name={logo.name} image={logo.image} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-stretch justify-center gap-5 sm:gap-6">
            {row.map((logo, index) => (
              <BadgeTile key={`${logo.name}-${index}`} name={logo.name} image={logo.image} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BadgeTile({ name, image }: { name: string; image?: string }) {
  return (
    <div className="flex h-28 w-40 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:w-44">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          width={180}
          height={90}
          className="max-h-full w-auto object-contain"
        />
      ) : (
        <span className="text-center font-heading text-sm font-bold uppercase tracking-wide text-primary-dark">
          {name}
        </span>
      )}
    </div>
  )
}
