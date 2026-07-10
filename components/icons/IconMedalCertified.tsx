import type { SVGProps } from "react"

/**
 * IconMedalCertified, bespoke duotone glyph (E1): certification rosette.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = medal disc, fill var(--icon-duo)
 *   .ink (top)    = star + splayed ribbon tails below, fill currentColor
 */
export function IconMedalCertified({
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
      <path className="duo" d="M12 3.2a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4z" />
      <path
        className="ink"
        d="M8.2 14.2 11.4 15.6 9.2 20.8 6 19.4zM15.8 14.2 12.6 15.6 14.8 20.8 18 19.4zM12 5.8 13 8.02 15.42 8.29 13.62 9.93 14.12 12.31 12 11.1 9.88 12.31 10.38 9.93 8.58 8.29 11 8.02z"
      />
    </svg>
  )
}
