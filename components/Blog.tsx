import { BlogDarkCards } from "@/components/blog/BlogDarkCards"
import { BlogFeatured } from "@/components/blog/BlogFeatured"
import { BlogHorizontalSlider } from "@/components/blog/BlogHorizontalSlider"
import { BlogFeaturedSplit } from "@/components/blog/BlogFeaturedSplit"
import { BlogMagazineGrid } from "@/components/blog/BlogMagazineGrid"
import { blogPosts } from "@/components/blog/post-utils"

import type { BlogVariant } from "@/lib/component-registry"

export function Blog({
  variant = "slider",
}: {
  variant?: BlogVariant
}) {
  // Zero-data guard: the build already strips empty blogs; this keeps a
  // direct render safe. Posts without real thumbnails get text-only cards.
  if (!blogPosts.length) return null

  switch (variant) {
    case "featured":
      return <BlogFeatured />

    case "dark-cards":
      return <BlogDarkCards />

    case "featured-split":
      return <BlogFeaturedSplit />

    case "magazine-grid":
      return <BlogMagazineGrid />

    case "slider":
    default:
      return <BlogHorizontalSlider />
  }
}
