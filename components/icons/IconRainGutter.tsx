import type { SVGProps } from "react"

/**
 * IconRainGutter, bespoke duotone glyph (E1): open gutter channel catching rain.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = raindrops + waterline, fill var(--icon-duo)
 *   .ink (top)    = gutter channel, fill currentColor
 */
export function IconRainGutter({
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
      <path className="duo" d="M7 2.5l2.1 3.6a2.4 2.4 0 1 1-4.2 0L7 2.5Z M12 4.5l2.1 3.6a2.4 2.4 0 1 1-4.2 0L12 4.5Z M17 2.5l2.1 3.6a2.4 2.4 0 1 1-4.2 0L17 2.5Z M5 13h14v3H5Z" />
      <path className="ink" d="M2 10h3v6h14v-6h3v9H2Z" />
    </svg>
  )
}
