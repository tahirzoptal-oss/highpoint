import { FAQSimpleAccordion } from "@/components/faq/FAQSimpleAccordion"
import { FAQSplitAccordion } from "@/components/faq/FAQSplitAccordion"
import { FAQCenteredAccordion } from "@/components/faq/FAQCenteredAccordion"
import { FAQList } from "@/components/FAQList"
import { SectionHeading } from "@/components/SectionHeading"
import { siteConfig } from "@/lib/site-config"

import {
  FAQImageSplit,
  FAQTwoColumnCTA,
  FAQContactCTA,
} from "@/components/faq/FAQExtraVariants"

import type { FAQVariant } from "@/lib/component-registry"

export function FAQ({
  variant = "accordion",
}: {
  variant?: FAQVariant
}) {
  const faqs = siteConfig.faqs || []

  /* Zero-data guards: no FAQs renders nothing; fewer than 3 renders the
   * narrow single-column list so no variant ships dead panel space. */
  if (!faqs.length) return null

  if (faqs.length < 3) {
    return (
      <section className="bg-white section-y">
        <div className="mx-auto max-w-[45rem] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            scale="utility"
            eyebrow="Frequently Asked Questions"
            title="Common roofing *questions*"
          />

          <FAQList items={faqs.map((faq) => ({ q: faq.question, a: faq.answer }))} />
        </div>
      </section>
    )
  }

  switch (variant) {
    case "side-info":
      return <FAQSplitAccordion />

    case "centered":
      return <FAQCenteredAccordion />

    case "image-split":
      return <FAQImageSplit />

    case "two-column-cta":
      return <FAQTwoColumnCTA />

    case "contact-cta":
      return <FAQContactCTA />

    case "accordion":
    default:
      return <FAQSimpleAccordion />
  }
}
