import type { SVGProps } from "react"

/**
 * IconHandshake, bespoke duotone glyph (E1): handshake, two arms clasped.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = left arm, fill var(--icon-duo)
 *   .ink (top)    = right arm + clasp bar, fill currentColor
 */
export function IconHandshake({
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
      <path className="duo" d="M1.5 9h5.3l7.8 4.1-1.6 2.3-6.6-2.2H1.5z" />
      <path
        className="ink"
        d="M22.5 9h-5.3l-7.8 4.1 1.6 2.3 6.6-2.2h4.9zM9.9 12.2h4.2a1.7 1.7 0 0 1 0 3.4H9.9a1.7 1.7 0 0 1 0-3.4z"
      />
    </svg>
  )
}
