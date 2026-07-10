import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"
import { Breadcrumb } from "@/components/Breadcrumb"
import { SectionHeading } from "@/components/SectionHeading"
import { TrustBadges } from "@/components/TrustBadges"
import { CTABanner } from "@/components/CTABanner"
import { siteConfig } from "@/lib/site-config"
import { getLayout } from "@/lib/get-layout"
import { heroImage } from "@/lib/hero-image"
import { Eye, Hammer, ShieldCheck, Heart, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: `About ${siteConfig.name} | ${siteConfig.address.city || siteConfig.city}, ${siteConfig.address.state || siteConfig.region}`,
  description: `Meet the team behind ${siteConfig.name}, ${siteConfig.city}'s trusted roofing contractor. Licensed, insured, and warranty-backed, serving ${siteConfig.city} with integrity.`,
  alternates: { canonical: "/about" },
}

const values = [
  { icon: Eye, title: "Transparency", description: "No hidden fees, no surprise line items, no vague timelines. You get a written scope, a clear estimate, and honest answers from day one." },
  { icon: Hammer, title: "Craftsmanship", description: "Every roof we install follows manufacturer specifications to the letter. We do not cut corners because your roof is not the place to take shortcuts." },
  { icon: ShieldCheck, title: "Accountability", description: "We stand behind our work with manufacturer-backed warranties and our direct phone number. If something is wrong, we fix it." },
  { icon: Heart, title: "Community", description: "We live and work in the same neighborhoods we serve. Our reputation is built on treating every homeowner like a neighbor, because you are one." },
  { icon: BookOpen, title: "Education", description: "We believe informed homeowners make the best decisions. That is why we walk you through every finding, every option, and every step of the process." },
]

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
}

type Owner = { name: string; title: string; image: string }

export default function AboutPage() {
  const owners: Owner[] = siteConfig.owners ?? []
  const layout = getLayout()
  return (
    <>
      <PageHero
        image={heroImage("about")}
        breadcrumb={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About" }]} />}
        eyebrow="Who We Are"
        title="About Us"
        subtitle={`Owner-led roofing and renovation built on honest inspections and craftsmanship that lasts, right here in ${siteConfig.city}, ${siteConfig.address.state}.`}
      />

      {/* The Story */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Who We Are"
            title={`The ${siteConfig.shortName} Story`}
            subtitle="The standard we hold ourselves to on every project, start to finish."
          />

          <div className="max-w-3xl mx-auto space-y-6 text-muted leading-relaxed text-lg">
            <p>
              {siteConfig.name} was built on a simple frustration too many homeowners
              know: contractors who over-promise, under-deliver, and disappear when
              things get difficult. We set out to be different, a roofing company that
              answers the phone, shows up to the inspection, and stands behind every
              shingle.
            </p>
            <p>
              Based in {siteConfig.city}, {siteConfig.region}, we specialize in
              residential roofing, storm damage restoration, siding, and gutters, and we
              handle every insurance claim like it is our own.
            </p>
            <p>
              Our standard for every project is simple: nothing leaves our hands until it
              is built right, documented, and backed by a warranty you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership (renders only when owners are configured; works for 1 or many) */}
      {owners.length > 0 && (
        <section className="section-y bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Leadership"
              title={owners.length === 1 ? `Meet the Owner` : `Meet the Team Behind ${siteConfig.shortName}`}
              subtitle="You work directly with the people responsible for the result."
            />
            <div className={`grid gap-8 ${owners.length === 1 ? "max-w-md mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {owners.map((owner) => (
                <div key={owner.name} className="rounded-2xl border border-border bg-background p-8 text-center">
                  <div className="size-24 rounded-full bg-surface mx-auto mb-5 flex items-center justify-center">
                    <span className="text-3xl font-heading font-bold text-accent">{initials(owner.name)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-heading">{owner.name}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-accent">{owner.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Mission */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Mission" title="Do It Right and Lead with Integrity" />
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-muted leading-relaxed">
              Our mission is to deliver roofing and exterior services homeowners can
              trust, built on honest inspections, clear communication, and craftsmanship
              that lasts. We exist to raise the standard in an industry that has earned a
              reputation for cutting corners. Every decision we make is guided by a simple
              question: would we do this on our own home?
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-y bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Values"
            subtitle="These are not corporate slogans. They are the standards we hold ourselves to on every project."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border bg-background p-8 hover:border-accent/30 transition-colors">
                <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <value.icon className="size-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 font-heading">{value.title}</h3>
                <p className="text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Credentials"
            title="Licensed. Insured. Warranty-Backed."
            subtitle="We carry the certifications and coverage that protect you and your investment."
          />
          <div className="flex justify-center">
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      <CTABanner variant={layout.cta} />
    </>
  )
}
