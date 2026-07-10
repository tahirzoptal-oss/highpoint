import Image from "next/image"
import { SealStamp } from "@/components/SealStamp"

/**
 * Photo, the ONE way media renders sitewide.
 *
 * Always applies the photo-frame class (tokenized --photo-radius + hairline
 * border, photos never naked), the graded-media grade hook, and object-cover.
 * Text-over-photo goes through a SHAPED scrim (left / bottom / wedge, defined
 * in globals.css from the client's primary-dark), never a flat overlay.
 *
 * fill mode wraps next/image in a relative container carrying the aspect
 * ratio (default 4/3). Non-fill mode emits intrinsic dimensions derived from
 * the same aspect, which is all the static export (images.unoptimized) needs.
 */

type PhotoScrim = "none" | "left" | "bottom" | "wedge"

interface PhotoProps {
  src: string
  alt: string
  /** Aspect ratio like "4/3" or "16/10". */
  aspect?: string
  scrim?: PhotoScrim
  caption?: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  /**
   * Object-position anchor for the cover crop (fill mode + non-fill). Default
   * "center". Use "top" for people/portraits so a tall or full-body source
   * photo never crops the face out.
   */
  focus?: "top" | "center" | "bottom"
  /**
   * Octagon blade mask (2B B6). Applies .blade-frame, which cuts the TL + BR
   * corners at clamp(80px, 8vw, 140px). The class is a NO-OP outside sharp
   * corner mode (globals.css scopes it to html[data-corner="sharp"]), so
   * rounded packs render the plain framed photo. Sharp packs only.
   */
  bladeFrame?: boolean
  /**
   * B07 circular seal/stamp overlapping the photo corner. Pass packSeal() from
   * a single feature photo per page; null on non-seal packs renders nothing.
   */
  seal?: { ring: string } | null
  /**
   * B11 per-pack signature frame for FEATURE photos only. Pass packFrame();
   * undefined renders the plain framed photo. Never on gallery/blog media.
   */
  frame?: "slab" | "circle"
}

const SCRIM_CLASS: Record<Exclude<PhotoScrim, "none">, string> = {
  left: "scrim-left",
  bottom: "scrim-bottom",
  wedge: "scrim-wedge",
}

const FOCUS_CLASS: Record<NonNullable<PhotoProps["focus"]>, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
}

const BASE_WIDTH = 1600

function parseAspect(aspect: string): number {
  const parts = aspect.split("/")
  const w = Number(parts[0])
  const h = Number(parts[1])
  return w > 0 && h > 0 ? w / h : 4 / 3
}

export function Photo({
  src,
  alt,
  aspect,
  scrim = "none",
  caption,
  className = "",
  sizes,
  priority,
  fill = false,
  focus = "center",
  bladeFrame = false,
  seal = null,
  frame,
}: PhotoProps) {
  const effectiveAspect = aspect ?? (fill ? "4/3" : undefined)
  const ratio = parseAspect(effectiveAspect ?? "4/3")
  const bladeClass = bladeFrame ? " blade-frame" : ""
  const frameClass = frame ? ` frame-${frame}` : ""
  const focusClass = FOCUS_CLASS[focus]

  return (
    <div
      className={`photo-frame relative${fill ? " w-full" : ""}${bladeClass}${frameClass} ${className}`}
      style={effectiveAspect ? { aspectRatio: String(ratio) } : undefined}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`graded-media object-cover ${focusClass}`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={BASE_WIDTH}
          height={Math.round(BASE_WIDTH / ratio)}
          sizes={sizes}
          priority={priority}
          className={`graded-media h-auto w-full object-cover ${focusClass}`}
        />
      )}

      {scrim !== "none" && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${SCRIM_CLASS[scrim]}`}
        />
      )}

      {caption && (
        <span className="absolute bottom-3 left-3 rounded-[var(--radius-sm)] bg-primary-dark/85 px-3 py-1.5 text-xs font-medium text-white">
          {caption}
        </span>
      )}

      {seal && <SealStamp ring={seal.ring} />}
    </div>
  )
}
