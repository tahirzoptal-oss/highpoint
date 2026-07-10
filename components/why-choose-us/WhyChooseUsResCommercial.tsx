import { Check } from "lucide-react"
import { SectionHeading } from "@/components/SectionHeading"
import { siteConfig } from "@/lib/site-config"

/**
 * B21: the dual residential-vs-commercial split card. Two audience columns split
 * by VALUE INVERSION (one dark column, one light), never two colour-coded
 * columns, so the one-accent-hue lock holds: the single client accent tints the
 * light column's eyebrow + checks, while the dark column reads as the structural
 * neutral (white on primary-dark). Both list the client's differentiators, so
 * the split says "same crew, same standards, tuned to your property".
 */
export function WhyChooseUsResCommercial() {
  const items = (siteConfig.whyChooseUs || []).slice(0, 5)
  const points = items.map((it) => it.title).filter(Boolean)
  if (!points.length) return null

  const Column = ({
    label,
    blurb,
    dark,
  }: {
    label: string
    blurb: string
    dark: boolean
  }) => (
    <div
      className={`rounded-2xl p-8 md:p-10 ${
        dark
          ? "bg-primary-dark text-white"
          : "border border-border bg-card text-foreground"
      }`}
    >
      <p
        className={`text-sm font-black uppercase tracking-[0.14em] ${
          dark ? "text-white/70" : "text-accent"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-lg font-bold">{blurb}</p>
      <ul className="mt-6 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <span
              className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                dark ? "bg-white/15 text-white" : "bg-accent/10 text-accent"
              }`}
            >
              <Check className="size-3.5" />
            </span>
            <span className={dark ? "text-white/85" : "text-muted"}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section className="section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Who we serve"
          title={`Homes and businesses across ${siteConfig.city}`}
          subtitle="The same crew and the same standards, tuned to what your property needs."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Column label="Residential" blurb="Your home, protected." dark={false} />
          <Column
            label="Commercial"
            blurb="Your property, uptime first."
            dark={true}
          />
        </div>
      </div>
    </section>
  )
}
