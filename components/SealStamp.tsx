import { ShieldCheck } from "lucide-react"

interface SealStampProps {
  /** Short ring text, e.g. "DENVER • ROOFING". Repeated to wrap the circle. */
  ring: string
  className?: string
}

/**
 * SealStamp (B07): a STATIC circular ring-text stamp overlapping a photo corner,
 * the recurring glue for the family, luxury and storm/veteran registers. A
 * designed vector, never a pasted sticker, and NEVER spinning. Themed per pack
 * via html[data-pack] .seal-stamp in globals.css; reuses the accent ring, never
 * a second hue. The centre glyph stays ink (gold is spent only on the luxury
 * ring outline, never as a fill, so the gold-for-ratings lock holds).
 */
export function SealStamp({ ring, className = "" }: SealStampProps) {
  const text = `${ring} • ${ring} • `
  return (
    <div
      aria-hidden="true"
      className={`seal-stamp pointer-events-none absolute -bottom-5 -right-5 z-20 grid place-items-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <defs>
          <path
            id="seal-arc"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <circle cx="50" cy="50" r="47" className="seal-disc" />
        <circle cx="50" cy="50" r="43" className="seal-outline" fill="none" />
        <text className="seal-text">
          <textPath href="#seal-arc" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <ShieldCheck className="seal-glyph absolute size-5" />
    </div>
  )
}
