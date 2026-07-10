import type { SVGProps } from "react"

/**
 * IconLadder, bespoke duotone glyph (E1): ladder.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = rungs, fill var(--icon-duo)
 *   .ink (top)    = rails, fill currentColor
 */
export function IconLadder({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className ? `icon-duotone ${className}` : "icon-duotone"}
      {...props}
    >
      <path className="duo" d="M7 4h10v2H7Z M7 9h10v2H7Z M7 14h10v2H7Z M7 19h10v2H7Z" />
      <path className="ink" d="M5 2h2v20H5Z M17 2h2v20h-2Z" />
    </svg>
  )
}
