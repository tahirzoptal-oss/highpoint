import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ContactForm } from "@/components/ContactForm"
import { TrustBadges } from "@/components/TrustBadges"
import { SectionHeading } from "@/components/SectionHeading"
import { siteConfig, serviceAreas } from "@/lib/site-config"
import { heroImage } from "@/lib/hero-image"
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"

export const metadata: Metadata = {
  title: `Contact Us | Free Roof Inspection | ${siteConfig.name}`,
  description: `Contact ${siteConfig.name} for a free roof inspection. Call ${siteConfig.phone} or fill out our form. Serving ${siteConfig.city} and the surrounding ${siteConfig.region}.`,
  alternates: { canonical: "/contact" },
}

const contactMethods = [
  {
    icon: Phone,
    label: "Call or Text",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phoneRaw}`,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
]

const availability = [
  { label: "Monday to Saturday", value: "Open for calls and inspections" },
  { label: "Response time", value: "We respond within 24 hours" },
  { label: "Storm and emergencies", value: "Priority scheduling" },
]

const faqs = [
  {
    question: "Is the roof inspection really free?",
    answer:
      "Yes. Every inspection is 100% free with no obligation. We will document our findings with photos and provide a written report, whether or not you move forward with us. There is never a fee for an honest assessment of your roof.",
  },
  {
    question: "How quickly can you respond after I reach out?",
    answer:
      "We typically schedule inspections within 24 to 48 hours of your call or form submission. After a major storm, response times may be slightly longer due to high demand, but we prioritize by urgency and always communicate expected timelines.",
  },
  {
    question: "Do you work with insurance companies?",
    answer:
      "Absolutely. We handle insurance restoration projects regularly and know the process inside and out. We document everything to insurance standards, meet with your adjuster on-site, and advocate for the coverage your policy provides. You never have to navigate the claim alone.",
  },
]

const coverage = [...serviceAreas.primary, ...serviceAreas.secondary]

export default function ContactPage() {
  const mapUrl = (siteConfig as { mapEmbedUrl?: string }).mapEmbedUrl

  return (
    <>
      <PageHero
        image={heroImage("contact")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />}
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle={`Call, text, or send us a note. ${siteConfig.city} homeowners get a fast, honest response and a free inspection.`}
        showCTA={false}
      />

      {/* Contact info + coverage (left) / lead form (right) */}
      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Get In Touch</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black font-heading text-foreground">Talk to a Local Roofer</h2>
            <p className="mt-4 max-w-lg text-muted leading-relaxed">
              Call, text, or send us a note. We will get back to you within a day, and every inspection is free with no pressure.
            </p>

            <div className="mt-8 space-y-4">
              {contactMethods.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <m.icon className="size-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{m.label}</p>
                    <p className="font-heading text-lg font-bold text-foreground">{m.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="size-5 text-accent" />
                <h3 className="font-heading font-bold text-foreground">Availability</h3>
              </div>
              <dl className="space-y-2.5">
                {availability.map((a) => (
                  <div key={a.label} className="flex items-center justify-between gap-4 text-sm">
                    <dt className="font-semibold text-foreground">{a.label}</dt>
                    <dd className="text-right text-muted">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="size-5 text-accent" />
                <h3 className="font-heading font-bold text-foreground">Where We Work</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {coverage.map((c) => (
                  <span key={c} className="rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold text-muted">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-36">
            <ContactForm variant="default" />
          </div>
        </div>
      </section>

      {/* Service-area map */}
      {mapUrl && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                src={mapUrl}
                title={`${siteConfig.name} service area map`}
                className="h-[420px] w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Emergency Banner */}
      <section className="py-12 bg-gradient-to-r from-danger/20 via-danger/10 to-danger/20 border-y border-danger/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-danger/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-6 text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-heading">
                  Storm Damage? Do Not Wait.
                </h3>
                <p className="text-muted">
                  Active leaks and storm damage get priority scheduling. Call us now for
                  an emergency inspection.
                </p>
              </div>
            </div>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center gap-2 bg-danger text-white font-bold rounded-xl py-4 px-8 transition-all duration-200 hover:bg-danger/90 active:scale-[0.98] shrink-0"
            >
              <Phone className="size-4" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently Asked Questions"
          />

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 text-foreground font-bold font-heading hover:text-accent transition-colors list-none">
                  {faq.question}
                  <ChevronDown className="size-5 text-muted group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-muted leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>
    </>
  )
}
