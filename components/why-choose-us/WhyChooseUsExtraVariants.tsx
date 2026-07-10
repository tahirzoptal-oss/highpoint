"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { getOverlapMoments, statsCountUp } from "@/lib/design-dna"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { StatNumeral } from "@/components/StatNumeral"
import { halfDirection } from "@/components/split-reveal"
import { getWhyStats } from "@/components/why-choose-us/why-stats"
import { sectionPhoto } from "@/components/about/section-photo"

/* Generic benefit icons cycled by index. All are valid Lucide kebab names. */
const ICON_NAMES = ["shield-check", "users", "award", "clock", "hammer", "house"]

function getItems() {
  return siteConfig.whyChooseUs || []
}

function pickImage(index: number): string | null {
  // #4: the section's primary photo (index 0, the only index any variant here
  // requests) resolves through the distinct WhyChooseUs slot so it never
  // repeats the About photo. Non-zero indices keep the plain modulo behaviour
  // (defensive: no caller in this file passes one today).
  if (index === 0) return sectionPhoto("why")
  const images = (siteConfig.projectImages ?? []) as string[]
  if (images.length === 0) return null
  return images[index % images.length]
}

/* Overlap moment "stat-badge-photo" (spec 2.5): the photo-bearing variants in
 * this file pin a guarded StatNumeral badge over the photo's bottom-right
 * corner (.overlap-badge-corner) when the resolver grants the moment, so a
 * pack whose seed lands icon-grid-image or timeline-image-right still renders
 * its granted badge. Zero-data guard: no real stat, no badge. */
function getBadgeStat() {
  const stats = getWhyStats()
  return getOverlapMoments().includes("stat-badge-photo") && stats.length > 0
    ? stats[0]
    : null
}

function StatBadge({ stat }: { stat: { value: string; label: string } }) {
  return (
    <div className="overlap-badge-corner w-max rounded-2xl bg-white p-5 shadow-2xl">
      {/* A3: count-up the badge numeral on the pack set that specifies it. All
       * StatBadge call sites in this file inherit the gate through here. */}
      <StatNumeral
        value={stat.value}
        label={stat.label}
        countUp={statsCountUp()}
        className="text-primary-dark [&_.stat-label]:text-primary-dark/60"
      />
    </div>
  )
}

export function WhyChooseUsIconGridImage() {
  const items = getItems()
  const image = pickImage(0)
  const badgeStat = getBadgeStat()

  if (items.length === 0) return null

  return (
    /* overflow-hidden keeps the corner badge from widening the page on
     * small screens (same clip the split and bento variants rely on). */
    <section className="overflow-hidden bg-white section-y">
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:items-center lg:px-8 ${
          image ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={image ? halfDirection("left") : "up"}
          className={image ? "reveal-follow" : ""}
        >
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Built on *quality*, focused on you"
            subtitle="We deliver expert craftsmanship, honest service, and lasting results from the first inspection to the final cleanup."
            centered={false}
            scale="feature"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.slice(0, 6).map((item, index) => (
              /* B3 depth: token two-layer shadow + asymmetric hover lift. */
              <div
                key={item.title}
                className="hover-card flex w-full gap-4 rounded-2xl border border-black/10 bg-white p-6"
              >
                <IconChip name={ICON_NAMES[index % ICON_NAMES.length]} surface="light" size={48} />
                <div>
                  <h3 className="font-black text-primary-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* D1 cadence: a section-end estimate CTA below the grid. */}
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile className="mt-9">
            Get My Free Estimate
          </Button>
        </Reveal>

        {image && (
          <Reveal direction={halfDirection("right")} className="relative">
            <Photo
              src={image}
              alt={`${siteConfig.name} roofing project`}
              fill
              className="w-full min-h-[620px]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            {badgeStat && <StatBadge stat={badgeStat} />}
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function WhyChooseUsAccordionImageLeft() {
  const items = getItems()
  const image = pickImage(0)
  const [active, setActive] = useState(0)

  if (items.length === 0) return null

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:items-center lg:px-8 ${
          image ? "lg:grid-cols-[.95fr_1.05fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        {image && (
          <Reveal direction={halfDirection("left")}>
            <Photo
              src={image}
              alt={`${siteConfig.name} roofing work`}
              fill
              className="min-h-[620px]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </Reveal>
        )}

        <Reveal
          direction={image ? halfDirection("right") : "up"}
          className={image ? "reveal-follow" : ""}
        >
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Experience you can *trust*"
            subtitle="We make the process simple and deliver results that last."
            centered={false}
            scale="feature"
          />

          <div className="flex flex-col gap-3">
            {items.slice(0, 6).map((item, index) => {
              const isActive = active === index

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(isActive ? -1 : index)}
                  className="w-full rounded-2xl border border-black/10 bg-white text-left shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <h3 className="font-black text-primary-dark">{item.title}</h3>
                      {!isActive && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`size-5 shrink-0 text-accent transition ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isActive && (
                    <div className="border-t border-black/10 px-5 pb-5 pt-4 text-muted">
                      {item.description}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* D1 cadence: a section-end estimate CTA below the grid. */}
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile className="mt-9">
            Get My Free Estimate
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

export function WhyChooseUsTimelineImageRight() {
  const items = getItems()
  const image = pickImage(0)
  const badgeStat = getBadgeStat()

  if (items.length === 0) return null

  return (
    /* overflow-hidden keeps the corner badge from widening the page on
     * small screens (same clip the split and bento variants rely on). */
    <section className="overflow-hidden bg-white section-y">
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:items-center lg:px-8 ${
          image ? "lg:grid-cols-[1fr_.9fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={image ? halfDirection("left") : "up"}
          className={image ? "reveal-follow" : ""}
        >
          <SectionHeading
            eyebrow="Why Choose Us"
            title="A process you can *count on*"
            subtitle="From start to finish, we keep your project organized, clear, and on schedule."
            centered={false}
            scale="feature"
          />

          <div className="flex flex-col gap-7">
            {items.slice(0, 5).map((item, index) => (
              <div key={item.title} className="flex w-full gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary-dark font-black text-white">
                    {index + 1}
                  </div>
                  {index !== 4 && <div className="mt-3 h-full w-px bg-accent" />}
                </div>

                <div>
                  <h3 className="text-xl font-black text-primary-dark">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* D1 cadence: a section-end estimate CTA below the grid. */}
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile className="mt-9">
            Get My Free Estimate
          </Button>
        </Reveal>

        {image && (
          <Reveal direction={halfDirection("right")} className="relative">
            <Photo
              src={image}
              alt={`${siteConfig.name} completed roofing project`}
              fill
              className="h-full min-h-[650px]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            {badgeStat && <StatBadge stat={badgeStat} />}
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function WhyChooseUsBenefitsBackground() {
  const items = getItems()
  const image = pickImage(0)

  if (items.length === 0) return null

  return (
    <section
      className={`relative overflow-hidden section-y text-white ${
        image ? "" : "bg-primary-dark"
      }`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            fill
            className="graded-media object-cover"
          />
          <div className="absolute inset-0 bg-primary-dark/80" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Dark band: heading map applied via the data-scale token directly
         * (SectionHeading emits light-band colors, banned on dark surfaces). */}
        <p className="eyebrow flex items-center justify-center gap-2.5 text-[13px] text-accent-light">
          <span aria-hidden="true" className="eyebrow-mark" />
          Why Choose Us
        </p>

        <h2 data-scale="feature" className="mx-auto mt-4 max-w-4xl font-black uppercase">
          Quality, integrity, peace of mind
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
          We are committed to protecting your home like it is our own.
        </p>

        {/* A2 grid choreography: row-major stagger down the benefit rows. */}
        <div className="mt-12 flex flex-col gap-8">
          {items.slice(0, 6).map((item, index) => (
            <Reveal
              key={item.title}
              index={index}
              className="flex w-full gap-4 text-left"
            >
              <IconChip name={ICON_NAMES[index % ICON_NAMES.length]} surface="dark" size={48} />
              <div>
                <h3 className="text-xl font-black uppercase">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* D1 cadence: a section-end estimate CTA below the grid (dark band). */}
        <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile className="mt-12">
          Get My Free Estimate
        </Button>
      </div>
    </section>
  )
}

export function WhyChooseUsImageOverlayDark() {
  const items = getItems()
  const image = pickImage(0)

  if (items.length === 0) return null

  return (
    <section
      className={`grid bg-primary-dark text-white ${
        image ? "lg:grid-cols-[.85fr_1.15fr]" : ""
      }`}
    >
      {/* A2 split choreography: halves slide from their own sides in the
       * directional packs, the content half trailing 120ms. */}
      {image && (
        <Reveal
          direction={halfDirection("left")}
          className="relative min-h-[620px]"
        >
          <div className="absolute inset-0 opacity-55">
            <Photo
              src={image}
              alt={`${siteConfig.name} roofing project`}
              fill
              className="h-full w-full"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </Reveal>
      )}

      <Reveal
        direction={image ? halfDirection("right") : "up"}
        className={`flex items-center p-8 md:p-14 ${image ? "reveal-follow" : ""}`}
      >
        <div className="max-w-2xl">
          {/* Dark band: heading map applied via the data-scale token directly
           * (SectionHeading emits light-band colors, banned on dark surfaces). */}
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
            <span aria-hidden="true" className="eyebrow-mark" />
            Why Choose Us
          </p>

          <h2 data-scale="feature" className="mt-4 font-black uppercase">
            Protecting homes, building trust
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-white/65">
            We go above and beyond to deliver roofing solutions you can rely on.
          </p>

          <div className="mt-9 flex flex-col gap-6">
            {items.slice(0, 4).map((item, index) => (
              <div key={item.title} className="flex w-full gap-4">
                <IconChip name={ICON_NAMES[index % ICON_NAMES.length]} surface="dark" size={48} />
                <div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-1 text-white/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile className="mt-9">
            Get My Free Estimate
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export function WhyChooseUsFeatureBoxOverlay() {
  const items = getItems()
  const image = pickImage(0)

  if (items.length === 0) return null

  return (
    <section
      className={`relative overflow-hidden section-y text-white ${
        image ? "" : "bg-primary-dark"
      }`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            fill
            className="graded-media object-cover"
          />
          <div className="absolute inset-0 bg-primary-dark/70" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Dark band: heading map applied via the data-scale token directly
         * (SectionHeading emits light-band colors, banned on dark surfaces). */}
        <p className="eyebrow flex items-center justify-center gap-2.5 text-[13px] text-accent-light">
          <span aria-hidden="true" className="eyebrow-mark" />
          Why Choose Us
        </p>

        <h2 data-scale="feature" className="mx-auto mt-4 max-w-4xl font-black uppercase">
          The smart choice for your home
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
          Trusted by homeowners for quality work and dependable service.
        </p>

        {/* A2 grid choreography: row-major stagger down the feature boxes. */}
        <div className="mt-12 flex flex-col gap-5">
          {items.slice(0, 4).map((item, index) => (
            <Reveal
              key={item.title}
              index={index}
              className="flex w-full gap-4 rounded-2xl bg-white p-8 text-left text-primary-dark shadow-2xl"
            >
              <IconChip name={ICON_NAMES[index % ICON_NAMES.length]} surface="light" size={48} />
              <div>
                <h3 className="text-xl font-black uppercase">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile className="mt-10">
          Get My Free Estimate
        </Button>
      </div>
    </section>
  )
}
