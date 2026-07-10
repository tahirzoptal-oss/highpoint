import { siteConfig } from "@/lib/site-config"
import { isLead } from "@/lib/lead-item"

const configuredSteps = (siteConfig as { processSteps?: { title: string; body: string }[] }).processSteps
const fallbackSteps = [
  { title: "Inspection", body: "We inspect your roof and understand your needs." },
  { title: "Estimate", body: "You receive a clear, honest estimate." },
  { title: "Schedule", body: "We schedule the project at a time that works for you." },
  { title: "Installation", body: "Our team completes the work with quality workmanship." },
]
const processSteps = (configuredSteps && configuredSteps.length ? configuredSteps : fallbackSteps).map(
  (s, i) => ({ step: String(i + 1), title: s.title, description: s.body }),
)

export function ProcessSteps() {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-6 top-6 bottom-6 w-px bg-border" />

      <div className="space-y-8 md:space-y-0">
        {processSteps.map((item, index) => (
          <div key={item.step} className="relative md:pl-16 md:pb-10 last:md:pb-0">
            <div className={`md:absolute md:left-0 md:top-0 inline-flex items-center justify-center size-12 rounded-full ${isLead(index) ? "bg-accent text-[var(--color-on-accent)]" : "bg-accent/10 text-accent"} font-bold text-lg font-heading shrink-0 relative z-10 mb-3 md:mb-0`}>
              {item.step}
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-muted leading-relaxed">{item.description}</p>
            </div>

            {index < processSteps.length - 1 && (
              <div className="md:hidden h-px bg-border mt-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
