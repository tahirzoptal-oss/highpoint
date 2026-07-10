import type { SVGProps } from "react"

/**
 * IconShingleStack, bespoke duotone glyph (E1): layered shingle courses.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = lower course band, fill var(--icon-duo)
 *   .ink (top)    = top shingle course, fill currentColor
 */
export function IconShingleStack({
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
      <path className="duo" d="M2.5 11.5l9.5 5.5 9.5-5.5v3.5L12 20.5 2.5 15v-3.5Z" />
      <path className="ink" d="M12 2.5l9.5 5.5-9.5 5.5L2.5 8 12 2.5Z" />
    </svg>
  )
}
