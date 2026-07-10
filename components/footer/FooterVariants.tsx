import Link from "next/link"
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Star,
  Zap,
} from "lucide-react"
import { BandPattern } from "@/components/BandPattern"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { getPatternSlot } from "@/components/pattern-slots"
import { stripAccent } from "@/lib/accent"
import { navigation, services, serviceAreas, siteConfig } from "@/lib/site-config"

const companyLinks = navigation.filter((item) =>
  ["Home", "About", "Gallery", "Reviews", "Contact"].includes(item.label)
)

/**
 * knockout: white-knockout treatment for dark footer bands. A dark or colored
 * logo mark on a dark band disappears; brightness-0 invert renders it as a
 * clean white mark. When no logo file exists, the text wordmark stays and
 * keys its color to the band (white on dark, accent on light).
 */
function FooterLogo({
  className = "text-3xl",
  knockout = false,
}: {
  className?: string
  knockout?: boolean
}) {
  if (siteConfig.logo) {
    return (
      <Link
        href="/"
        className={
          knockout
            ? "inline-flex items-center rounded-[var(--radius-lg)] bg-white p-3"
            : "inline-flex items-center"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logo} alt={siteConfig.name} className="h-12 w-auto" />
      </Link>
    )
  }
  return (
    <Link href="/" className={`font-black ${className}`}>
      <span className={knockout ? "text-white" : "text-accent"}>
        {siteConfig.shortName}
      </span>
    </Link>
  )
}

function FooterBottom() {
  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
      <p>© 2026 {siteConfig.name}. All Rights Reserved.</p>
      <p>
        Website Designed by{" "}
        <a
          href="https://kingcontractoragency.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-white hover:text-accent-light"
        >
          King Contractor Agency
        </a>
      </p>
    </div>
  )
}

function FooterColumns({ showCta = false }: { showCta?: boolean }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.75fr_0.9fr_1fr]">
      <div>
        <FooterLogo className="text-3xl" knockout />

        <p className="mt-5 max-w-sm text-lg font-semibold leading-relaxed text-white/80">
          {siteConfig.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase text-white/70">
            <Icon name="shield-warranty" size={20} className="text-accent-light" />
            {siteConfig.license}
          </span>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-white/65">
            <Star className="size-5 fill-star text-star" />
            {siteConfig.reviews.googleRating.toFixed(1)} Rated
          </span>
        </div>

        {showCta && (
          <Button href="#estimate-form" surface="dark" size="lg" className="mt-6">
            Get My Free Estimate
          </Button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-black uppercase">Company</h3>
        <ul className="mt-5 space-y-3">
          {companyLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group inline-flex items-center gap-2 text-white/65 hover:text-accent-light">
                <ArrowRight className="size-4 text-accent-light transition group-hover:translate-x-1" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-black uppercase">Services</h3>
        <ul className="mt-5 space-y-3">
          {services.slice(0, 6).map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="group inline-flex items-center gap-2 text-white/65 hover:text-accent-light">
                <ArrowRight className="size-4 text-accent-light transition group-hover:translate-x-1" />
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-black uppercase">Contact</h3>
        <div className="mt-5 space-y-5 text-white/70">
          <a href={`tel:${siteConfig.phoneRaw}`} className="flex gap-4 hover:text-accent-light">
            <Phone className="mt-1 size-5 shrink-0 text-accent-light" />
            <span className="font-black">{siteConfig.phone}</span>
          </a>

          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className="flex gap-4 hover:text-accent-light">
              <Mail className="mt-1 size-5 shrink-0 text-accent-light" />
              <span className="font-black">{siteConfig.email}</span>
            </a>
          )}

          <div className="flex gap-4">
            <MapPin className="mt-1 size-5 shrink-0 text-accent-light" />
            <span className="font-black">{siteConfig.address.full}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FooterAuthority() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-surface-dark)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in srgb, var(--color-accent) 14%, transparent),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-4 section-y sm:px-6 lg:px-8">
        <FooterColumns />

        <div className="mt-12 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-[0.8fr_1.2fr_0.8fr] md:items-center">
          <div className="text-sm font-black uppercase tracking-widest text-white/55">
            Follow Us
          </div>

          <p className="text-center text-lg font-black uppercase text-white">
            Need roofing help? Call us today.
          </p>

          <div className="md:text-right">
            <Button href="#estimate-form" surface="dark" size="lg">
              Get My Free Estimate
            </Button>
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  )
}

export function FooterCommercial() {
  /* C1/C3 pattern slot: industrial-contractor textures its dark footer with
   * facet-mesh (the second of its two dark pattern bands, per the C2 map:
   * blade-shards mid-page, facet-mesh FAQ/footer). Other packs get null. */
  const pattern = getPatternSlot("footer")

  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] text-white">
      {pattern && (
        <BandPattern
          motif={pattern.motif}
          band={pattern.band}
          opacity={pattern.opacity}
        />
      )}

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 section-y sm:px-6 lg:px-8">
        <FooterColumns showCta />
        <FooterBottom />
      </div>
    </footer>
  )
}

export function FooterFamily() {
  return (
    <footer className="bg-white text-primary-dark">
      <div className="mx-auto max-w-[var(--container-max)] px-4 section-y sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center">
          <FooterLogo className="text-4xl" />

          <p className="mt-5 text-lg font-semibold text-primary-dark/65">
            Family-owned roofing experts serving {siteConfig.city} with honest answers and warranty-backed work.
          </p>

          <Button href="#estimate-form" surface="light" size="lg" className="mt-7">
            Get My Free Estimate
          </Button>
        </div>

        <div className="grid gap-8 border-y border-black/10 py-10 md:grid-cols-3">
          <div>
            <h3 className="font-black uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-dark/65 hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              {services.slice(0, 6).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="text-primary-dark/65 hover:text-accent">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase">Contact</h3>
            <div className="mt-4 space-y-3 text-primary-dark/65">
              <p>{siteConfig.phone}</p>
              {siteConfig.email && <p>{siteConfig.email}</p>}
              <p>{siteConfig.address.full}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-primary-dark/50">
          © 2026 {siteConfig.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export function FooterPremium() {
  return (
    <footer className="bg-[var(--color-surface-light)] text-primary-dark">
      <div className="mx-auto max-w-[var(--container-max)] px-4 section-y sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-2xl bg-primary-dark p-10 text-white lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-light">
              Ready To Start?
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase">
              {stripAccent("Get A Roofing Team You Can Trust.")}
            </h2>
          </div>

          <div className="lg:text-right">
            <Button href="#estimate-form" surface="dark" size="lg">
              Get My Free Estimate
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div>
            <FooterLogo className="text-3xl" />
            <p className="mt-4 text-primary-dark/70">{siteConfig.tagline}</p>
          </div>

          <div>
            <h3 className="font-black uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-dark/70 hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="text-primary-dark/70 hover:text-accent">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase">Contact</h3>
            <p className="mt-4 text-primary-dark/70">{siteConfig.phone}</p>
            {siteConfig.email && (
              <p className="mt-2 text-primary-dark/70">{siteConfig.email}</p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6 text-sm text-primary-dark/70">
          © 2026 {siteConfig.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export function FooterStorm() {
  const cities = serviceAreas.primary.slice(0, 8)

  return (
    <footer className="bg-[var(--color-surface-dark)] text-white">
      <div className="bg-accent px-4 py-5 text-center font-black uppercase text-[var(--color-on-accent)]">
        <Zap className="mr-2 inline size-5" />
        Storm Damage? Call Now: {siteConfig.phone}
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-4 section-y sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1fr]">
          <div>
            <FooterLogo className="text-3xl" knockout />
            <p className="mt-4 text-white/60">
              Fast storm inspections, roof repairs and insurance claim support.
            </p>
          </div>

          <div>
            <h3 className="font-black uppercase">Emergency Services</h3>
            <ul className="mt-4 space-y-2 text-white/65">
              <li>Storm Damage</li>
              <li>Insurance Claims</li>
              <li>Emergency Roof Repair</li>
              <li>Roof Replacement</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase">Areas Served</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 text-white/65">
              {cities.map((city) => (
                <span key={city}>{city}</span>
              ))}
            </div>
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  )
}
