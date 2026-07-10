import type { SVGProps } from "react"

/**
 * IconHammerNail, bespoke duotone glyph (E1): tilted hammer seating a nail.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = nail head + shaft, fill var(--icon-duo)
 *   .ink (top)    = hammer head + handle, fill currentColor
 */
export function IconHammerNail({
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
      <path className="duo" d="M1.5 13.5h6v2h-6Z M3.5 15.5v4l1 3 1-3v-4h-2Z" />
      <path className="ink" d="M3 6L15 3l1 4.5L4 10.5 3 6Z M9 9.5l3.4-.9 3.4 11.6-3.4.9L9 9.5Z" />
    </svg>
  )
}
