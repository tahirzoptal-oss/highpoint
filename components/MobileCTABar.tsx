import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/**
 * Sticky mobile CTA bar: a 50/50 split of CALL NOW (tel:) and GET MY FREE
 * ESTIMATE (accent, anchors to the hero form). 54px tall targets, 14px/700
 * uppercase, no entrance animation. The caption line above the split carries
 * locked SOP phrases; it is the only guaranteed carrier of "We're Available
 * Now" and "You're in control" on offer-less builds, so it never gets removed.
 */
export function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <p className="border-t border-white/10 bg-primary-dark py-1 text-center text-[11px] font-medium text-white/70">
        We&apos;re Available Now. You&apos;re in control. No obligation. No pressure.
      </p>

      {/* Labels must never wrap to two lines at narrow widths (360px and
       * down): whitespace-nowrap plus a viewport-clamped size keeps the full
       * locked phrase on one line without truncation. */}
      <div className="grid grid-cols-2">
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="flex h-[54px] items-center justify-center gap-2 whitespace-nowrap bg-primary-dark px-1 font-heading text-[clamp(10px,3.2vw,14px)] font-bold uppercase tracking-wide text-white"
        >
          <span className="size-2 shrink-0 rounded-full bg-success animate-pulse-dot" />
          <Phone className="size-4 shrink-0" />
          Call Now
        </a>

        <a
          href="#estimate-form"
          className="flex h-[54px] items-center justify-center whitespace-nowrap bg-accent px-1 text-center font-heading text-[clamp(10px,3.2vw,14px)] font-bold uppercase tracking-wide text-[var(--color-on-accent)]"
        >
          Get My Free Estimate
        </a>
      </div>
    </div>
  )
}
