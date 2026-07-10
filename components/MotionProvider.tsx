"use client"

import { useLayoutEffect } from "react"

/**
 * MotionProvider, the page-level arm of the reveal engine (2B A1).
 *
 * The 2026-07-03 ruling brings scroll reveals BACK (the V mockup corpus
 * outranks the 07-02 live-reference census). The engine has three parts:
 *   1. globals.css: hide/reveal rules gated behind BOTH html.motion-ready AND
 *      html[data-motion] in {subtle, expressive, luxury}. Without JS, before
 *      hydration, under data-motion="none", or under prefers-reduced-motion,
 *      every element is fully visible. Transform/opacity only, zero CLS.
 *   2. components/Reveal.tsx: the ONE wrapper components use. Each instance
 *      self-manages via one module-shared IntersectionObserver (threshold
 *      0.12, rootMargin "0px 0px -8% 0px", once-only).
 *   3. This provider: the page-level anti-flash sweep and safety net,
 *      mounted last in <body> from app/layout.tsx.
 *
 * Anti-flash mount order (A1), all inside one useLayoutEffect so everything
 * lands in the same pre-paint commit as the Reveal instances' own effects:
 *   (a) query every .reveal element on the page;
 *   (b) any element already inside the viewport (rect.top < innerHeight) is
 *       marked .is-visible synchronously;
 *   (c) only THEN is motion-ready added to <html> (idempotent with Reveal's
 *       own arming, classList.add is a no-op when the class exists);
 *   (d) the rest are observed. Reveal instances (data-reveal) self-observe
 *       through their shared observer, so this provider only picks up
 *       raw-class stragglers (.reveal applied without the component) and
 *       never double-observes anything.
 * Result: nothing already on screen ever blinks, and the LCP element (hero,
 * which the dispatcher never wraps) never waits on JS.
 *
 * html[data-motion] (the per-pack profile) is emitted SERVER-SIDE by
 * app/layout.tsx from brandDNA.motion, which the build bridge sources from
 * design-dna.json (motion_style, resolved per design pack). The profile
 * tokens live in globals.css (subtle 18px/600ms, expressive 32px/750ms,
 * luxury 12px/700ms). This provider deliberately never writes data-motion:
 * mutating it client-side would repaint the profile after first paint and
 * fight the server-rendered attribute. It only READS the profile to decide
 * whether the machinery may arm.
 *
 * Off switches (belt, on top of the CSS gating braces): unknown or "none"
 * data-motion, prefers-reduced-motion, or a missing IntersectionObserver all
 * mark everything visible and never arm motion-ready.
 *
 * HARD DISPATCHER RULE (enforced in SectionRenderer, not here): Hero, Header,
 * TopBar, MobileCTABar and the first band after the hero are NEVER wrapped.
 */

/** data-motion values the reveal CSS animates. Must mirror the
 * html.motion-ready:is([data-motion=...]) gate in globals.css. */
const ANIMATING_PROFILES = new Set(["subtle", "expressive", "luxury"])

export function MotionProvider() {
  useLayoutEffect(() => {
    const html = document.documentElement
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    )

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const animating = ANIMATING_PROFILES.has(html.dataset.motion ?? "")

    if (
      reduced ||
      !animating ||
      typeof IntersectionObserver === "undefined"
    ) {
      // Engine off: everything visible, motion-ready never armed, so the CSS
      // hide rules stay inert even if a Reveal instance armed them first.
      for (const el of targets) el.classList.add("is-visible")
      return
    }

    // (a) + (b): mark everything already on screen visible BEFORE arming.
    const stragglers: HTMLElement[] = []
    const viewportBottom = window.innerHeight
    for (const el of targets) {
      if (el.classList.contains("is-visible")) continue
      if (el.getBoundingClientRect().top < viewportBottom) {
        el.classList.add("is-visible")
      } else if (!el.hasAttribute("data-reveal")) {
        // Raw-class reveal with no Reveal component managing it: this
        // provider owns its observation. Reveal-emitted elements always
        // carry data-reveal and self-observe.
        stragglers.push(el)
      }
    }

    // (c): arm the engine only once nothing on screen can blink.
    html.classList.add("motion-ready")

    // (d): observe the rest. Same recipe as Reveal's shared observer.
    if (!stragglers.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
    for (const el of stragglers) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return null
}
