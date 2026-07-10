import type { SVGProps } from "react"

/**
 * IconStormCloudHail, bespoke duotone glyph (E1): storm cloud dropping hail.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = hailstones, fill var(--icon-duo)
 *   .ink (top)    = storm cloud, fill currentColor
 */
export function IconStormCloudHail({
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
      <path className="duo" d="M7 16.5l2 2-2 2-2-2 2-2Z M12 19l2 2-2 2-2-2 2-2Z M17 16.5l2 2-2 2-2-2 2-2Z" />
      <path className="ink" d="M3.5 10a4 4 0 1 1 8 0 4 4 0 1 1-8 0Z M8.5 8.5a5 5 0 1 1 10 0 5 5 0 1 1-10 0Z M15 11a3 3 0 1 1 6 0 3 3 0 1 1-6 0Z M4.5 10h16v4h-16Z" />
    </svg>
  )
}
