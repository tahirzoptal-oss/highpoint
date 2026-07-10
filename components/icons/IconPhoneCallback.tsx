import type { SVGProps } from "react"

/**
 * IconPhoneCallback, bespoke duotone glyph (E1): callback phone handset.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = return arrow arc, fill var(--icon-duo)
 *   .ink (top)    = handset, fill currentColor
 */
export function IconPhoneCallback({
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
        d="M12.6 7a4.4 4.4 0 0 1 8.8 0h-2.2a2.2 2.2 0 0 0-4.4 0zM10.5 7.2h4.2L12.6 10.8z"
      />
      <path
        className="ink"
        d="M4.4 3.2h3.4c.5 0 .9.35 1 .84l.8 3.5c.09.4-.03.8-.32 1.08L7.6 10.3c1.3 2.7 3.4 4.8 6.1 6.1l1.68-1.68c.28-.29.68-.41 1.08-.32l3.5.8c.49.11.84.51.84 1.01v3.4c0 .55-.45 1-1 1C11.4 20.6 3.4 12.6 3.4 4.2c0-.55.45-1 1-1z"
      />
    </svg>
  )
}
