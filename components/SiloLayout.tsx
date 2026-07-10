import type { ReactNode } from "react"
import { ContactForm } from "@/components/ContactForm"

/**
 * Two-column interior "silo" layout: long-form content on the left, a
 * persistent lead-capture form pinned in a right rail that follows the reader
 * down the page. Pure CSS position:sticky (no client scroll JS, static-export
 * safe). On mobile it collapses to one column and the form drops below the
 * content (the sticky MobileCtaBar already covers the mobile capture surface).
 *
 * lg:top-24 clears the sticky site header; lg:self-start keeps the aside short
 * enough that it can stick rather than stretch to the full row height.
 */
export function SiloLayout({ children }: { children: ReactNode }) {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="min-w-0">{children}</div>
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <ContactForm variant="default" />
        </aside>
      </div>
    </section>
  )
}
