import type { SVGProps } from "react"

/**
 * IconSkylight, bespoke duotone glyph (E1): angled skylight roof window.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = angled roof plane, fill var(--icon-duo)
 *   .ink (top)    = window pane, fill currentColor
 */
export function IconSkylight({
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
      <path className="duo" d="M2 16L10 4h12l-8 12H2Z" />
      <path className="ink" d="M6 13.5L10.7 6.5h7.5l-4.7 7H6Z" />
    </svg>
  )
}
