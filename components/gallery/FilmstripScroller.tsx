"use client"

import { useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * FilmstripScroller, the ONE client island for edge-bleed filmstrips (2B F1 +
 * A5). It owns nothing but a ref to the .bleed-row track and the two A5
 * carousel arrows that scroll it. The photos themselves stream in as server
 * children (`track`), so the tiles ship no JS and the whole strip is fully
 * present, crawlable and scrollable by touch/trackpad without hydration; the
 * arrows are a progressive enhancement layered on top.
 *
 * A5 hardware: the arrows are the contract .carousel-arrow pair (prev = outline
 * circle, next = solid accent circle). On the dark gallery band the prev takes
 * .on-dark. Each click drives scrollBy({ left: card + gap, behaviour smooth }),
 * measuring one card from the first child's width + the flex gap so the step
 * matches whatever tile size the strip renders.
 */

interface FilmstripScrollerProps {
  /** The .bleed-row track, rendered on the server (photo tiles, no JS). */
  track: ReactNode
  /** Flex gap between tiles in px, matching the .bleed-row gap (20). */
  gap?: number
  /** Optional node parked between the arrows (e.g. a "View all" link). */
  between?: ReactNode
  /** Accessible label prefix for the arrows. */
  label?: string
}

export function FilmstripScroller({
  track,
  gap = 20,
  between,
  label = "projects",
}: FilmstripScrollerProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const step = (direction: 1 | -1) => {
    const row = rowRef.current
    if (!row) return
    const firstCard = row.firstElementChild as HTMLElement | null
    const cardWidth = firstCard?.offsetWidth ?? row.clientWidth * 0.8
    row.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" })
  }

  return (
    <>
      <div ref={rowRef} className="bleed-row">
        {track}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          className="carousel-arrow carousel-arrow-prev on-dark"
          aria-label={`Previous ${label}`}
        >
          <ChevronLeft className="size-5" />
        </button>

        {between}

        <button
          type="button"
          onClick={() => step(1)}
          className="carousel-arrow carousel-arrow-next"
          aria-label={`Next ${label}`}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </>
  )
}
