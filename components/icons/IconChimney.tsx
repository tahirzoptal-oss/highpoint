import type { SVGProps } from "react"

/**
 * IconChimney, bespoke duotone glyph (E1): capped chimney on a roof slope.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = roof slope, fill var(--icon-duo)
 *   .ink (top)    = cap + stack, fill currentColor
 */
export function IconChimney({
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
      <path className="duo" d="M2 22L22 10v12H2Z" />
      <path className="ink" d="M9.5 3h11v3h-11Z M11.5 6h7v6.1l-7 4.2V6Z" />
    </svg>
  )
}
