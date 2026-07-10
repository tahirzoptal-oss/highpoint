import type { SVGProps } from "react"

/**
 * IconClipboardEstimate, bespoke duotone glyph (E1): estimate clipboard.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = clipboard board, fill var(--icon-duo)
 *   .ink (top)    = clip + line items, fill currentColor
 */
export function IconClipboardEstimate({
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
        d="M4.5 3.2h15c.72 0 1.3.58 1.3 1.3v16c0 .72-.58 1.3-1.3 1.3h-15c-.72 0-1.3-.58-1.3-1.3v-16c0-.72.58-1.3 1.3-1.3z"
      />
      <path
        className="ink"
        d="M9.2 1.6h5.6c.72 0 1.3.58 1.3 1.3v2.3H7.9V2.9c0-.72.58-1.3 1.3-1.3zM6.8 9h10.4v2.1H6.8zM6.8 13h10.4v2.1H6.8zM6.8 17h6.4v2.1H6.8z"
      />
    </svg>
  )
}
