import { CTAFormSection } from "@/components/cta/CTAFormSection"
import { CTAOwnerAuthority } from "@/components/cta/CTAOwnerAuthority"
import { CTACompactForm } from "@/components/cta/CTACompactForm"

import { CTAConnectedForm } from "@/components/cta/CTAConnectedForm"
import { CTABackgroundImageForm } from "@/components/cta/CTABackgroundImageForm"
import { CTACommercialAuthority } from "@/components/cta/CTACommercialAuthority"
import { CTACloser } from "@/components/cta/CTACloser"

import type { CTAVariant } from "@/lib/component-registry"

export function CTABanner({
  variant = "split-form",
}: {
  // "closer" is widened locally so this dispatcher stands alone regardless of
  // when the registry union picks the variant up (spec 2.7 registration).
  variant?: CTAVariant | "closer"
}) {
  switch (variant) {
    case "owner-authority":
      return <CTAOwnerAuthority />

    case "closer":
      return <CTACloser />

    case "compact-form":
      return <CTACompactForm />

    case "connected-form":
      return <CTAConnectedForm />

    case "background-image-form":
      return <CTABackgroundImageForm />

    case "commercial-authority":
      return <CTACommercialAuthority />

    case "split-form":
    default:
      return <CTAFormSection />
  }
}