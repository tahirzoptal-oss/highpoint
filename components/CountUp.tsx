"use client"

import { useLayoutEffect, useRef } from "react"

/**
 * CountUp, the ONE numeral count-up wrapper (2B A3).
 *
 * Server-renders the FINAL value verbatim (SEO + no-JS correct: the number a
 * crawler and a JS-off visitor read is the real one, never 0). On first
 * intersect the numeric part animates 0 -> final over 900ms with easeOutExpo,
 * driven by requestAnimationFrame. The value string is rendered inside a
 * .stat-numeral (tabular-nums already on it), so the width never shifts as the
 * digits tick: zero CLS by construction. Skipped whole under
 * prefers-reduced-motion, data-motion="none", or a missing IntersectionObserver
 * (the final value simply stays put).
 *
 * Mechanics deliberately mirror Reveal.tsx so the two share one behaviour
 * contract: a module-level IntersectionObserver shared across all instances
 * (threshold 0.12, rootMargin "0px 0px -8% 0px"), once-only (on intersect the
 * element animates and is unobserved, so scrolling back up never re-runs it).
 * The observer here carries its own per-target callback via a WeakMap because,
 * unlike a class swap, each numeral needs its own RAF loop; the IO itself is
 * still one shared instance.
 *
 * Value grammar: only the LEADING numeric run animates. A prefix ("$", "+"),
 * decimals ("4.9"), and any trailing text ("500+", "24/7", "15 yrs") are
 * preserved:
 *   "500+"    -> counts 0..500, re-appends "+"          (integer)
 *   "$2,500"  -> counts 0..2500, re-formats with the "$" prefix and "," groups
 *   "4.9"     -> counts 0.0..4.9 at one decimal place    (float, decimals kept)
 *   "24/7"    -> counts 0..24, re-appends "/7"
 *   "A+"      -> no leading number, renders final verbatim (no animation)
 * The formatter re-uses the source string's own decimal count and thousands
 * separators, so the ticking numerals look identical to the final render.
 */

interface CountUpProps {
  /** The final value, rendered server-side verbatim (e.g. "500+", "4.9", "$2,500"). */
  value: string
  className?: string
}

const DURATION = 900

/** easeOutExpo, the house easing (matches --motion-ease's shape). */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/** Parse the leading numeric run out of the value string.
 * Returns the target number, its decimal-place count, whether the source used
 * thousands grouping, and the prefix/suffix to re-wrap around the ticking
 * number. Returns null when there is no leading number to animate. */
function parseValue(value: string): {
  prefix: string
  target: number
  decimals: number
  grouped: boolean
  suffix: string
} | null {
  // Leading optional non-digit prefix (e.g. "$"), then a number with optional
  // thousands separators and an optional decimal, then the rest as suffix.
  const match = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/s)
  if (!match) return null

  const [, prefix, numRaw, suffix] = match
  const grouped = numRaw.includes(",")
  const plain = numRaw.replace(/,/g, "")
  const target = Number(plain)
  if (!Number.isFinite(target)) return null

  const dot = plain.indexOf(".")
  const decimals = dot === -1 ? 0 : plain.length - dot - 1

  return { prefix, target, decimals, grouped, suffix }
}

/** Format a mid-animation number back into the source's shape (decimals +
 * thousands grouping), so the ticking read matches the final render exactly. */
function formatNumber(n: number, decimals: number, grouped: boolean): string {
  const fixed = n.toFixed(decimals)
  if (!grouped) return fixed
  const [intPart, fracPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return fracPart !== undefined ? `${withCommas}.${fracPart}` : withCommas
}

let sharedObserver: IntersectionObserver | null = null
const runners = new WeakMap<Element, () => void>()

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const run = runners.get(entry.target)
            sharedObserver?.unobserve(entry.target)
            runners.delete(entry.target)
            run?.()
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
  }
  return sharedObserver
}

export function CountUp({ value, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const parsed = parseValue(value)
    if (!parsed) return // no leading number: final value stays as rendered

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const motionOff = document.documentElement.dataset.motion === "none"
    const observer = reduced || motionOff ? null : getObserver()
    if (!observer) return // reduced motion / no IO: leave the final value alone

    const { prefix, target, decimals, grouped, suffix } = parsed
    let raf = 0

    const animate = () => {
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        const current = target * easeOutExpo(t)
        el.textContent = `${prefix}${formatNumber(current, decimals, grouped)}${suffix}`
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          // Snap to the exact source string so the final read is byte-identical
          // to the server render (no rounding drift, original grouping intact).
          el.textContent = value
        }
      }
      raf = requestAnimationFrame(step)
    }

    // Already on screen at mount: run immediately (mirrors Reveal's above-fold
    // path). Otherwise observe and run on first intersect.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      animate()
    } else {
      runners.set(el, animate)
      observer.observe(el)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (runners.has(el)) {
        runners.delete(el)
        observer.unobserve(el)
      }
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
