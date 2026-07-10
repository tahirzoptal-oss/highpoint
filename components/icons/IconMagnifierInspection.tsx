import type { SVGProps } from "react"

/**
 * IconMagnifierInspection, bespoke duotone glyph (E1): inspection magnifier.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = lens disc, fill var(--icon-duo)
 *   .ink (top)    = ring + handle, fill currentColor
 * The ring hole comes from an opposite-winding inner subpath (nonzero fill),
 * so the handle unions cleanly with the ring where they meet.
 */
export function IconMagnifierInspection({
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
      <path
        className="duo"
        d="M10 5.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6z"
      />
      <path
        className="ink"
        d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zM15.72 13.88 13.88 15.72 19.56 21.4 21.4 19.56z"
      />
    </svg>
  )
}
