import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react"
import { ArrowRight, Phone } from "lucide-react"

/**
 * Button, the ONE CTA anatomy for the whole site.
 *
 * Every button shares one skeleton: inline-flex, radius token, font-heading,
 * casing from --btn-case, size paddings. The per-pack hardware v2 (2B B1) is
 * pure CSS keyed off html[data-hardware] in globals.css, so the markup never
 * changes per pack. Five kinds:
 *   letterpress = 4px offset slab; hover presses toward the plate, active seats
 *   plate       = 8px slab snap (V6); blade clip-path layers take over under
 *                 html[data-corner="sharp"] (app/layout.tsx emits data-corner)
 *   gel         = V4 pill emboss (border-radius 9999px + inset highlights);
 *                 shows the arrow coin
 *   ingot       = metallic gradient + 1px inner ring + glare, press choreography
 *   coin        = the trailing arrow chip becomes visible (press physics = B2,
 *                 Wave 2, not built yet)
 * The hardware hover states set `translate: none` to take the movement over
 * from the shared hover:-translate-y-0.5 lift (ghost/phone keep the lift), and
 * the extra layers (plate slab, ingot glare) are negative-z pseudo-elements in
 * globals.css, so no wrapper spans are needed here. The trailing .btn-coin
 * arrow chip is ALWAYS rendered; CSS decides visibility (coin + gel packs).
 *
 * Exactly three inversions (AA-locked, do not regress):
 *   primary on light/dark  = bg-accent  + on-accent label
 *   primary on accent      = bg-white   + accent label; the hardware swaps its
 *                            slab to a translucent on-accent plate (--btn-plate)
 *   ghost (and phone)      = transparent + 1px border, ink on light / white on dark
 */

type ButtonIntent = "primary" | "ghost" | "phone"
type ButtonSurface = "light" | "dark" | "accent"
type ButtonSize = "md" | "lg"

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  intent?: ButtonIntent
  surface?: ButtonSurface
  size?: ButtonSize
  /** Section-end CTAs go full width on mobile (D1), auto width from sm up. */
  fullWidthMobile?: boolean
  className?: string
}

/**
 * Sizes (2B D1). lg is the in-body section-end default: min-height 3.5rem
 * (56px), px-10, text-base, the big corpus slab. md stays for nav + cards.
 */
const SIZE_CLASS: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-10 min-h-14 text-base",
}

const GHOST_CLASS: Record<ButtonSurface, string> = {
  light: "border border-primary-dark/25 bg-transparent text-primary-dark hover:-translate-y-0.5",
  dark: "border border-white/40 bg-transparent text-white hover:-translate-y-0.5",
  accent: "border border-white/40 bg-transparent text-white hover:-translate-y-0.5",
}

function intentClass(intent: ButtonIntent, surface: ButtonSurface): string {
  if (intent === "primary") {
    return surface === "accent"
      ? "btn-primary btn-primary-inverse bg-white text-accent"
      : "btn-primary bg-accent text-[var(--color-on-accent)]"
  }
  return GHOST_CLASS[surface]
}

function coinClass(intent: ButtonIntent, surface: ButtonSurface): string {
  if (intent === "primary") {
    return surface === "accent"
      ? "bg-accent text-[var(--color-on-accent)]"
      : "bg-white text-accent"
  }
  return surface === "light"
    ? "bg-accent text-[var(--color-on-accent)]"
    : "bg-white text-accent"
}

export function Button({
  href,
  intent = "primary",
  surface = "light",
  size = "md",
  fullWidthMobile = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  // Primary buttons get their hover motion from the per-pack hardware CSS
  // (html[data-hardware] press physics in globals.css); the Tailwind lift lives
  // only on ghost/phone (GHOST_CLASS) so it never composes against and cancels
  // the hardware press. brightness stays shared (it never fights transforms).
  const widthClass = fullWidthMobile ? "flex w-full sm:inline-flex sm:w-auto" : "inline-flex"
  const classes = `btn ${widthClass} items-center justify-center gap-2 rounded-[var(--radius-lg)] font-heading font-bold tracking-wide transition duration-200 hover:brightness-110 ${SIZE_CLASS[size]} ${intentClass(intent, surface)} ${className}`

  const content = (
    <>
      {intent === "phone" && (
        <span className="size-2.5 shrink-0 rounded-full bg-success animate-pulse-dot" />
      )}
      {intent === "phone" && <Phone className="size-4 shrink-0" />}
      {children}
      <span
        aria-hidden="true"
        className={`btn-coin size-6 shrink-0 items-center justify-center rounded-full ${coinClass(intent, surface)}`}
      >
        <ArrowRight className="size-3.5" />
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as unknown as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
