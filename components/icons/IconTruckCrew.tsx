import type { SVGProps } from "react"

/**
 * IconTruckCrew, bespoke duotone glyph (E1): crew truck, side view.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = cargo box, fill var(--icon-duo)
 *   .ink (top)    = cab + chassis + wheels, fill currentColor
 */
export function IconTruckCrew({
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
      <path className="duo" d="M3 5.5h10v9.5H2V6.5c0-.55.45-1 1-1z" />
      <path
        className="ink"
        d="M13 8.5h4.2l3.3 4v2.5H13V8.5zM2 15h20v2.2H2zM4.6 17.8a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 1 0-4.8 0zM14.2 17.8a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 1 0-4.8 0z"
      />
    </svg>
  )
}
