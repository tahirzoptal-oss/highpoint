import type { SVGProps } from "react"

/**
 * IconMapPinService, bespoke duotone glyph (E1): service-area map pin.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = center dot showing through the pin hole, fill var(--icon-duo)
 *   .ink (top)    = pin body with a punched hole (evenodd), fill currentColor
 */
export function IconMapPinService({
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
        d="M12 6.1a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z"
      />
      <path
        className="ink"
        fillRule="evenodd"
        d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.6 7.5 12.5 7.5 12.5s7.5-6.9 7.5-12.5C19.5 5.36 16.14 2 12 2zm0 10.7a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z"
      />
    </svg>
  )
}
