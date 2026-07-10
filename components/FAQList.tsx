import { isLead } from "@/lib/lead-item"

/**
 * Prop-driven FAQ accordion for per-page FAQs (service / location pages).
 * Uses native <details> so it needs no client JS and works under static export.
 * Emits FAQPage JSON-LD via the caller when needed.
 */
export function FAQList({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((item, i) => (
        <details key={i} open={isLead(i)} className="group blade-row p-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
            <span>{item.q}</span>
            <span className="shrink-0 text-accent transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
