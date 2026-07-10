import type { SVGProps } from "react"

/**
 * IconLightningBolt, bespoke duotone glyph (E1): lightning bolt.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = offset echo bolt, fill var(--icon-duo)
 *   .ink (top)    = lightning bolt, fill currentColor
 */
export function IconLightningBolt({
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
      <path className="duo" transform="translate(3 1.5)" d="M13 2L4 14h6l-2 8 12-13h-6l5-7h-6Z" />
      <path className="ink" d="M13 2L4 14h6l-2 8 12-13h-6l5-7h-6Z" />
    </svg>
  )
}
