import { ReviewsMarquee } from "@/components/reviews/ReviewsMarquee"
import { ReviewsSlider } from "@/components/reviews/ReviewsSlider"
import { ReviewsWall } from "@/components/reviews/ReviewsWall"
import { SeeAllReviews } from "@/components/reviews/SeeAllReviews"

import type { ReviewsVariant } from "@/lib/component-registry"

/** wall renders the TestimonialCard grid (B4 one-inverted-card active flip on
 * index 0); marquee = ticker; slider = single-card carousel. */
function ReviewsBody({ variant }: { variant: ReviewsVariant }) {
  switch (variant) {
    case "marquee":
      return <ReviewsMarquee />
    case "wall":
      return <ReviewsWall />
    case "slider":
    default:
      return <ReviewsSlider />
  }
}

export function Reviews({
  variant = "slider",
}: {
  variant?: ReviewsVariant
}) {
  return (
    <>
      <ReviewsBody variant={variant} />
      <SeeAllReviews />
    </>
  )
}