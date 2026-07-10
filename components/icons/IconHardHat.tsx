import type { SVGProps } from "react"

/**
 * IconHardHat, bespoke duotone glyph (E1): construction hard hat.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = helmet dome, fill var(--icon-duo)
 *   .ink (top)    = brim + center rib, fill currentColor
 */
export function IconHardHat({
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
        d="M12 5c-4.7 0-8.5 3.8-8.5 8.5V16h17v-2.5C20.5 8.8 16.7 5 12 5z"
      />
      <path
        className="ink"
        d="M3.5 16h17a1.6 1.6 0 0 1 0 3.2h-17a1.6 1.6 0 0 1 0-3.2zM12 4.4c.77 0 1.4.63 1.4 1.4v4.9h-2.8V5.8c0-.77.63-1.4 1.4-1.4z"
      />
    </svg>
  )
}
