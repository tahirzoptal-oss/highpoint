import type { SVGProps } from "react"

/**
 * IconStarReview, bespoke duotone glyph (E1): rating star.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = full star, fill var(--icon-duo)
 *   .ink (top)    = left half of the same star, fill currentColor
 * Reads as a part-filled rating star, the review semantic.
 */
export function IconStarReview({
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
        d="M12 3.8 14.23 9.73 20.56 10.02 15.61 13.97 17.29 20.08 12 16.6 6.71 20.08 8.39 13.97 3.44 10.02 9.77 9.73z"
      />
      <path
        className="ink"
        d="M12 3.8 9.77 9.73 3.44 10.02 8.39 13.97 6.71 20.08 12 16.6z"
      />
    </svg>
  )
}
