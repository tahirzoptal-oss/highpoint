import type { SVGProps } from "react"

/**
 * IconRoofPitched, bespoke duotone glyph (E1): pitched-roof house.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = house body, fill var(--icon-duo)
 *   .ink (top)    = roof chevron + door, fill currentColor
 */
export function IconRoofPitched({
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
      <path className="duo" d="M5 12h14v9H5Z" />
      <path className="ink" d="M12 2L23 13h-4l-7-7-7 7H1L12 2Z M10 15h4v6h-4Z" />
    </svg>
  )
}
