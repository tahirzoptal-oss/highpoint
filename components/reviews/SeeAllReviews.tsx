import { siteConfig } from "@/lib/site-config"
import { brandDNA } from "@/lib/brand-dna"
import { Button } from "@/components/Button"
import { MIN_SOURCE_COUNT } from "@/components/reviews/stat-chips"

/** Blueprint Section 3: "See All Google Reviews" + "See All Facebook Reviews"
 * buttons linking to the client's real review profiles. A platform earns its
 * button only when it has real review volume behind it; with neither source
 * qualified the strip renders nothing. */
export function SeeAllReviews() {
  const { googleUrl, facebookUrl, googleCount, facebookCount } = siteConfig.reviews
  const surface = brandDNA.themeMode === "dark" ? "dark" : "light"
  const showGoogle = googleCount >= MIN_SOURCE_COUNT
  const showFacebook = facebookCount >= MIN_SOURCE_COUNT

  if (!showGoogle && !showFacebook) return null

  return (
    <div className="bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 px-4 sm:px-6 lg:px-8">
        {showGoogle && (
          <Button
            href={googleUrl}
            intent="ghost"
            surface={surface}
            target="_blank"
            rel="noopener noreferrer"
          >
            See All Google Reviews
          </Button>
        )}
        {showFacebook && (
          <Button
            href={facebookUrl}
            intent="ghost"
            surface={surface}
            target="_blank"
            rel="noopener noreferrer"
          >
            See All Facebook Reviews
          </Button>
        )}
      </div>
    </div>
  )
}
