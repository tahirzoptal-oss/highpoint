import type { SVGProps } from "react"

/**
 * IconDollarFinancing, bespoke duotone glyph (E1): financing coin.
 * Two fill layers per the globals.css plumbing:
 *   .duo (behind) = coin disc, fill var(--icon-duo)
 *   .ink (top)    = dollar sign (stem + S), fill currentColor
 * The S is a generated offset polygon (two joined arcs at 2.1 thickness),
 * so the fill is artifact-free at small sizes.
 */
export function IconDollarFinancing({
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
        d="M12 3.2a8.8 8.8 0 1 1 0 17.6 8.8 8.8 0 0 1 0-17.6z"
      />
      <path
        className="ink"
        d="M10.95 5h2.1v14h-2.1zM14.94 7.8 14.64 7.38 14.22 6.96 13.72 6.61 13.18 6.36 12.6 6.2 12 6.15 11.4 6.2 10.82 6.36 10.28 6.61 9.78 6.96 9.36 7.38 9.01 7.88 8.76 8.42 8.6 9 8.55 9.6 8.6 10.2 8.76 10.78 9.01 11.33 9.36 11.82 9.78 12.24 10.27 12.59 10.82 12.84 11.4 13 11.91 13.05 12.23 13.07 12.46 13.13 12.67 13.23 12.87 13.37 13.03 13.53 13.17 13.73 13.27 13.94 13.33 14.17 13.35 14.4 13.33 14.63 13.27 14.86 13.17 15.07 13.03 15.27 12.87 15.43 12.67 15.57 12.46 15.67 12.23 15.73 12 15.75 11.77 15.73 11.54 15.67 11.33 15.57 11.13 15.43 10.97 15.27 10.78 15 9.06 16.2 9.36 16.62 9.78 17.04 10.28 17.39 10.82 17.64 11.4 17.8 12 17.85 12.6 17.8 13.18 17.64 13.72 17.39 14.22 17.04 14.64 16.62 14.99 16.12 15.24 15.58 15.4 15 15.45 14.4 15.4 13.8 15.24 13.22 14.99 12.68 14.64 12.18 14.22 11.76 13.72 11.41 13.18 11.16 12.6 11 12.09 10.95 11.77 10.93 11.54 10.87 11.33 10.77 11.13 10.63 10.97 10.47 10.83 10.28 10.73 10.06 10.67 9.83 10.65 9.6 10.67 9.37 10.73 9.14 10.83 8.93 10.97 8.73 11.13 8.57 11.33 8.43 11.54 8.33 11.77 8.27 12 8.25 12.23 8.27 12.46 8.33 12.67 8.43 12.87 8.57 13.03 8.73 13.22 9z"
      />
    </svg>
  )
}
