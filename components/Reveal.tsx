"use client"

import {
  createElement,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react"

/**
 * Reveal, the ONE scroll-entrance wrapper (2B A1/A2).
 *
 * Mechanics lifted from the main factory's FadeOnEnter (proven on live client
 * sites): one module-level IntersectionObserver shared across all instances,
 * threshold 0.12, rootMargin "0px 0px -8% 0px", once-only (on intersect the
 * element gets .is-visible and is unobserved, so it never re-fires on
 * scroll-up). All visuals live in globals.css keyed off html[data-motion];
 * this component only tags elements and drives the class swap.
 *
 * LCP + flash safety (what the main factory does NOT do):
 *   1. Content is never hidden without JS: the hide rules in globals.css are
 *      gated behind html.motion-ready, which this component adds only from
 *      its mount effect. SEO-safe, content fully visible without JS.
 *   2. Anti-flash mount (useLayoutEffect, runs before paint): any element
 *      already inside the viewport (rect.top < innerHeight) is marked
 *      .is-visible synchronously and never observed; only THEN is
 *      motion-ready armed. Nothing already on screen ever blinks. React
 *      flushes every layout effect in the commit before paint, so ordering
 *      holds across instances. Idempotent with a MotionProvider that also
 *      arms motion-ready.
 *   3. data-motion="none" and prefers-reduced-motion skip the machinery
 *      entirely (belt) on top of the CSS guards (braces).
 *
 * HARD DISPATCHER RULE (not enforceable here): Hero, Header, TopBar,
 * MobileCTABar and the first band after the hero are NEVER wrapped in Reveal.
 * Nothing above the fold participates.
 *
 * Usage:
 *   <Reveal>...</Reveal>                          fade-up
 *   <Reveal direction="left">photo half</Reveal>  slide from the left
 *   <Reveal direction="right" className="reveal-follow">text half</Reveal>
 *   grid children: <Reveal index={i}>...</Reveal> (or put .reveal-stagger on
 *   the parent and let the nth-child rules stagger; both cap at index 4).
 */

type RevealDirection = "up" | "left" | "right"
type RevealTag = "div" | "section" | "article" | "li" | "span"

interface RevealProps {
  children: ReactNode
  /** Entrance axis: "up" (default) fade-up, "left"/"right" slide-in (A2). */
  direction?: RevealDirection
  /** Sibling stagger slot: delay = min(index, 4) * var(--stagger-step, 80ms). */
  index?: number
  className?: string
  /** Wrapper tag, div by default (li for grid/list items). */
  as?: RevealTag
}

const DIRECTION_CLASS: Record<RevealDirection, string> = {
  up: "reveal",
  left: "reveal reveal-left",
  right: "reveal reveal-right",
}

const STAGGER_CAP = 4

let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            sharedObserver?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
  }
  return sharedObserver
}

let motionArmed = false

/** Add motion-ready to <html> exactly once. Safe to race with MotionProvider:
 * classList.add is idempotent. */
function armMotionReady() {
  if (motionArmed) return
  motionArmed = true
  document.documentElement.classList.add("motion-ready")
}

export function Reveal({
  children,
  direction = "up",
  index,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const motionOff = document.documentElement.dataset.motion === "none"
    const observer = reduced || motionOff ? null : getObserver()

    if (!observer) {
      // Reduced motion, motion "none", or no IntersectionObserver: render
      // visible immediately and never arm the engine from here.
      el.classList.add("is-visible")
      return
    }

    if (el.getBoundingClientRect().top < window.innerHeight) {
      // Already on screen at mount: reveal synchronously, never observe.
      el.classList.add("is-visible")
      armMotionReady()
      return
    }

    armMotionReady()
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])

  const style =
    index !== undefined
      ? ({ "--stagger-i": Math.min(index, STAGGER_CAP) } as CSSProperties)
      : undefined

  return createElement(
    as,
    {
      ref,
      "data-reveal": direction,
      className: `${DIRECTION_CLASS[direction]} ${className}`.trim(),
      style,
    },
    children
  )
}
