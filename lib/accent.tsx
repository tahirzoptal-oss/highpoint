import type { ReactNode } from "react"

/**
 * Accent-word rendering (spec 2.3, render side only).
 *
 * The copy deck marks ONE emotional keyword or phrase per headline with
 * asterisks: "Get Your *FREE* Roof Estimate". renderAccent turns the FIRST
 * such pair into an accent span; any further pairs render as plain text
 * (the copy lint owns the one-marker rule, this is just a safety net so raw
 * asterisks never ship). Unmarked strings pass through untouched.
 *
 * text-accent resolves through the WCAG-clamped --color-accent-text token
 * (see globals.css), so the accent word stays readable on light bands.
 * Accent words never sit on dark surfaces (v2 contrast invariant); consumers
 * on dark bands should pass stripAccent()ed copy instead.
 */

const ACCENT_MARK = /\*([^*\n]+)\*/

/** Remove all accent markers, keeping the marked text. */
export function stripAccent(text: string): string {
  return text.replace(/\*([^*\n]+)\*/g, "$1")
}

/** Render the first *marked* word or phrase as an accent span. */
export function renderAccent(text: string): ReactNode {
  const match = ACCENT_MARK.exec(text)
  if (!match) return text
  const word = match[1]
  if (!word.trim()) return stripAccent(text)
  const before = text.slice(0, match.index)
  const after = stripAccent(text.slice(match.index + match[0].length))
  return (
    <>
      {before}
      <span className="text-accent">{word}</span>
      {after}
    </>
  )
}
