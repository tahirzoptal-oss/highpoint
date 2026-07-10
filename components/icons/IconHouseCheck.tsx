import type { SVGProps } from "react"

/**
 * IconHouseCheck, bespoke duotone glyph (E1): house with approval check.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = house + chimney, fill var(--icon-duo)
 *   .ink (top)    = approval check, fill currentColor
 */
export function IconHouseCheck({
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
      <path className="duo" d="M12 2l10 8v11H2V10l10-8Z M16 3h3v5h-3Z" />
      <path className="ink" d="M5.5 13.5L8 11l2.5 2.5L16 8l2.5 2.5-8 8-5-5Z" />
    </svg>
  )
}
