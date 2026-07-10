import type { SVGProps } from "react"

/**
 * IconRoofFlat, bespoke duotone glyph (E1): flat-roof commercial building.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = building body, fill var(--icon-duo)
 *   .ink (top)    = parapet slab + rooftop unit + door + window, fill currentColor
 */
export function IconRoofFlat({
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
      <path className="duo" d="M4 8h16v13H4Z" />
      <path className="ink" d="M2 5h20v3H2Z M14 2h4v3h-4Z M6 15h4v6H6Z M13 15h5v3h-5Z" />
    </svg>
  )
}
