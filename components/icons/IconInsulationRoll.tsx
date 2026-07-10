import type { SVGProps } from "react"

/**
 * IconInsulationRoll, bespoke duotone glyph (E1): insulation roll with unrolled batt.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = roll + unrolled batt, fill var(--icon-duo)
 *   .ink (top)    = spiral + core dot + cut end, fill currentColor
 */
export function IconInsulationRoll({
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
      <path className="duo" d="M1.5 9.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 1 1-13 0Z M8 16h14.5v5H8Z" />
      <path className="ink" d="M10.2 15.6A6.5 6.5 0 1 1 14.1 11.7L11.8 10.9A4 4 0 1 0 9.4 13.3Z M6.4 9.5a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 1 1-3.2 0Z M20.5 16h2v5h-2Z" />
    </svg>
  )
}
