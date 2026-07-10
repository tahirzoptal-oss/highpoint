import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { siteConfig, owners } from "@/lib/site-config"
import { renderAccent } from "@/lib/accent"
import { getOverlapMoments } from "@/lib/design-dna"
import { HeroReviewBadges } from "@/components/hero/HeroReviewBadges"

/** Real project photo or nothing. Placeholder art must be impossible. */
function heroImage(index: number) {
  const imgs = siteConfig.projectImages
  if (imgs.length === 0) return ""
  const img = imgs[index % imgs.length]
  return img.includes("placeholder") ? "" : img
}

function ConnectedForm({ overlap = false }: { overlap?: boolean }) {
  // Overlap moment (spec 2.5): the connected card additionally breaks into
  // the TrustLogos band only when the resolver grants hero-into-trust AND
  // this render is the home hero (overlap prop from SectionRenderer);
  // TrustLogos pairs this with .overlap-receive on the same signal.
  const pullsIntoTrust = overlap && getOverlapMoments().includes("hero-into-trust")

  return (
    <div
      className={`relative z-20 mx-auto -mt-16 max-w-6xl rounded-2xl bg-white p-6 shadow-2xl md:p-8 ${
        pullsIntoTrust ? "overlap-pull-into-next" : ""
      }`}
    >
      <h3 className="text-center text-3xl font-black uppercase text-primary-dark md:text-4xl">
        Get My <span className="text-accent">Free</span> Estimate
      </h3>

      <div className="mt-6">
        <ContactForm variant="hero-connected" />
      </div>
    </div>
  )
}

function HeroBase({
  eyebrow,
  headline,
  subheadline,
  backgroundImage,
  ownerImage,
  showTruck = false,
  overlap = false,
}: {
  eyebrow: string
  headline: string
  subheadline: string
  backgroundImage: string
  ownerImage?: string
  showTruck?: boolean
  overlap?: boolean
}) {
  // Zero-data guards: a missing or placeholder photo renders the designed
  // gradient treatment (background) or simply omits the slot (owner, truck).
  const bg =
    backgroundImage && !backgroundImage.includes("placeholder")
      ? backgroundImage
      : ""
  // The generated hero (hero-final-*) already composites the owner into the
  // scene; overlaying the raw scraped owner photo on top double-exposes the
  // owner with an off-brand shot. Only show the cutout when the background is
  // NOT a generated hero (i.e. an LCP fallback or plain project photo, which
  // has no owner baked in).
  const ownerCutout =
    !siteConfig.hero.generated && ownerImage && !ownerImage.includes("placeholder")
      ? ownerImage
      : ""
  const truckImage = heroImage(1)

  return (
    /* z-20 so the connected card paints above the z-10 TrustLogos band when
     * the hero-into-trust overlap moment pulls it across the seam. */
    <section className="relative z-20 bg-[var(--color-surface-dark)]">
      <div className="relative min-h-[760px] overflow-hidden">
        {bg ? (
          <Image
            src={bg}
            alt={`${siteConfig.name} roofing project`}
            fill
            priority
            sizes="100vw"
            className="graded-media object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in srgb, var(--color-accent) 18%, transparent),transparent_40%),linear-gradient(135deg,var(--color-ink)_0%,var(--color-primary-dark)_55%,var(--color-primary)_100%)]" />
        )}

        <div className="absolute inset-0 scrim-left" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-black/40" />

        {/* pb-28 reserves dark hero space below the review pill so the
            connected form card (pulled up -mt-16) overlaps empty band, not
            the pill. */}
        <div className="relative z-10 mx-auto grid max-w-[var(--container-max)] gap-10 px-4 pt-24 pb-28 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="pt-10 text-white">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-accent-light">
              {eyebrow}
            </p>

            {/* Display scale (spec 2.1); accent word renders accent-light on
             * this dark band (spec 2.3 + v2 contrast invariant). */}
            <h1 data-scale="display" className="mt-5 max-w-3xl font-black uppercase [&_.text-accent]:text-accent-light">
              {renderAccent(headline)}
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/85">
              {subheadline}
            </p>

            <ul className="mt-8 flex flex-col gap-2.5">
              {siteConfig.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                  <CheckCircle className="size-4 shrink-0 text-white" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 max-w-xl">
              <HeroReviewBadges />
            </div>
          </div>

          <div className="relative hidden min-h-[620px] lg:block">
            {showTruck && truckImage && (
              <div className="absolute bottom-14 right-0 h-[280px] w-[520px] opacity-80">
                <Image
                  src={truckImage}
                  alt={`${siteConfig.name} completed project`}
                  fill
                  sizes="520px"
                  className="object-contain"
                />
              </div>
            )}

            {ownerCutout && (
              <div className="absolute bottom-0 right-10 h-[620px] w-[460px]">
                <Image
                  src={ownerCutout}
                  alt={owners[0]?.name ?? siteConfig.name}
                  fill
                  priority
                  sizes="460px"
                  className="object-contain object-bottom"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ConnectedForm overlap={overlap} />
    </section>
  )
}

export function HeroDarkOwnerTruck({ overlap = false }: { overlap?: boolean }) {
  return (
    <HeroBase
      eyebrow={`${siteConfig.city}'s Trusted Roofing Contractor`}
      headline={siteConfig.hero.headline}
      subheadline={siteConfig.hero.subheadline}
      backgroundImage={siteConfig.hero.backgroundImage || heroImage(0)}
      ownerImage={owners[0]?.image}
      showTruck
      overlap={overlap}
    />
  )
}

export function HeroBrightOwner({ overlap = false }: { overlap?: boolean }) {
  return (
    <HeroBase
      eyebrow={`${siteConfig.city} Roofing Team`}
      headline={siteConfig.hero.headline}
      subheadline={siteConfig.hero.subheadline}
      backgroundImage={siteConfig.hero.backgroundImage || heroImage(0)}
      ownerImage={owners[0]?.image}
      overlap={overlap}
    />
  )
}

export function HeroSunsetOwnerTruck({ overlap = false }: { overlap?: boolean }) {
  return (
    <HeroBase
      eyebrow={siteConfig.hero.badge}
      headline={siteConfig.hero.headline}
      subheadline={siteConfig.hero.subheadline}
      backgroundImage={siteConfig.hero.backgroundImage || heroImage(0)}
      ownerImage={owners[0]?.image}
      showTruck
      overlap={overlap}
    />
  )
}
