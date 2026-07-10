import { ProcessTimeline } from "@/components/process/ProcessTimeline"
import { ProcessSplitAccordion } from "@/components/process/ProcessSplitAccordion"

import {
  ProcessHorizontalTimeline,
  ProcessZigZagImages,
  ProcessNumberCards,
  ProcessImageSplit,
  ProcessCircular,
  ProcessVerticalFlow,
} from "@/components/process/ProcessExtraVariants"

import type { ProcessVariant } from "@/lib/component-registry"

export function Process({
  variant = "timeline",
}: {
  variant?: ProcessVariant
}) {
  switch (variant) {
    case "split-accordion":
      return <ProcessSplitAccordion />

    case "horizontal-timeline":
      return <ProcessHorizontalTimeline />

    case "zigzag-images":
      return <ProcessZigZagImages />

    case "number-cards":
      return <ProcessNumberCards />

    case "image-split":
      return <ProcessImageSplit />

    case "circular":
      return <ProcessCircular />

    case "vertical-flow":
      return <ProcessVerticalFlow />

    case "timeline":
    default:
      return <ProcessTimeline />
  }
}