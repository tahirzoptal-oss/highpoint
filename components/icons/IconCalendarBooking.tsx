import type { SVGProps } from "react"

/**
 * IconCalendarBooking, bespoke duotone glyph (E1): booked calendar.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = calendar page, fill var(--icon-duo)
 *   .ink (top)    = header + binder pegs + checkmark, fill currentColor
 */
export function IconCalendarBooking({
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
        d="M3 8.4h18V20c0 .88-.72 1.6-1.6 1.6H4.6C3.72 21.6 3 20.88 3 20V8.4z"
      />
      <path
        className="ink"
        d="M4.6 4.4h14.8c.88 0 1.6.72 1.6 1.6v2.4H3V6c0-.88.72-1.6 1.6-1.6zM7.2 2.2h2.6v4.4H7.2zM14.2 2.2h2.6v4.4h-2.6zM11.1 18 7.9 14.8 9.6 13.1 11.1 14.6 14.4 11.3 16.1 13z"
      />
    </svg>
  )
}
