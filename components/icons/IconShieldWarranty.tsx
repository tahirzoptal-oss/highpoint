import type { SVGProps } from "react"

/**
 * IconShieldWarranty, bespoke duotone glyph (E1): warranty shield.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = shield body, fill var(--icon-duo)
 *   .ink (top)    = checkmark, fill currentColor
 */
export function IconShieldWarranty({
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
        d="M12 2 4.5 4.8v6.4c0 4.9 3.2 8.4 7.5 10.6 4.3-2.2 7.5-5.7 7.5-10.6V4.8L12 2z"
      />
      <path
        className="ink"
        d="M11 15.9 7.2 12.1 8.9 10.4 11 12.5 15.4 8.1 17.1 9.8z"
      />
    </svg>
  )
}
