import Image from "next/image"
import {
  CalendarCheck,
  ClipboardCheck,
  Hammer,
  Phone,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { halfDirection } from "@/components/split-reveal"
import { resolveStepIcon } from "@/components/process/process-utils"
import { renderAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"

/* The step LABEL decides the icon, never its index (see process-utils). The
 * ProcessCircular ring paints raw Lucide components, so it maps the resolved
 * kebab name back to a component through this table; every name here is one
 * resolveStepIcon can return. */
const CIRCLE_ICON: Record<string, LucideIcon> = {
  phone: Phone,
  "calendar-check": CalendarCheck,
  "shield-check": ShieldCheck,
  "clipboard-check": ClipboardCheck,
  search: Search,
  hammer: Hammer,
}

const projectImages = (siteConfig as { projectImages?: string[] }).projectImages ?? []
// No real project photos, no photo slots. Placeholder art never ships.
const imageFor = (i: number): string | null =>
  projectImages.length ? projectImages[i % projectImages.length] : null

// Step-count grids and headings must track the ACTUAL number of steps, so a
// four-step client never ships a five-column grid or a "5 Steps" claim.
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
}

function getSteps() {
  const configured = (siteConfig as { processSteps?: { title: string; body: string }[] }).processSteps
  if (configured && configured.length) {
    return configured.map((s) => ({ title: s.title, description: s.body }))
  }
  return [
    { title: "Inspection", description: "We inspect your roof and understand your needs." },
    { title: "Estimate", description: "You receive a detailed, transparent estimate." },
    { title: "Schedule", description: "We schedule the project at a time that works for you." },
    { title: "Installation", description: "Our team completes the work with precision." },
    { title: "Final Walkthrough", description: "We review everything and make sure you are satisfied." },
  ]
}

export function ProcessHorizontalTimeline() {
  const steps = getSteps().slice(0, 5)

  /* Connector inset (#24): the chips are mx-auto centered in equal columns, so
   * the first and last chip centers sit half a column in from each edge. Inset
   * the rail by that exact half-column (gap-aware: the grid gap is 2rem) so it
   * spans node-center to node-center with no loose stubs poking past the outer
   * chips. One node = no rail. */
  const n = steps.length
  const centerInset = n > 1 ? `calc((100% - ${n - 1} * 2rem) / ${2 * n})` : undefined

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title="Simple process, *perfect* results"
          subtitle="We make roofing projects easy from start to finish."
          scale="feature"
        />

        <div className={`relative grid grid-cols-1 gap-8 ${GRID_COLS[steps.length] ?? "md:grid-cols-5"}`}>
          {centerInset && (
            <div
              className="absolute top-6 hidden h-px bg-accent md:block"
              style={{ left: centerInset, right: centerInset }}
            />
          )}

          {steps.map((step, index) => {
            return (
            /* A2 grid choreography: left-to-right step stagger. The step LABEL
             * decides the icon (see process-utils), never its index. Every
             * chip carries ONE treatment (#23): the row reads as equal peers,
             * not one lit step over muted ones. */
            <Reveal key={step.title} index={index} className="relative z-10">
              <div className="mx-auto w-fit rounded-[var(--radius-lg)] bg-white shadow-xl">
                <IconChip
                  name={resolveStepIcon(step.title, step.description)}
                  surface="light"
                />
              </div>

              <div className="mt-5 text-2xl font-black text-primary-dark">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-2 text-lg font-black text-primary-dark">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </Reveal>
            )
          })}
        </div>

        {/* D1 cadence: a section-end estimate CTA after the final step so no
         * stretch runs more than 2 sections without one. */}
        <div className="mt-12 flex justify-center">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ProcessZigZagImages() {
  const steps = getSteps().slice(0, 5)
  const hasImages = projectImages.length > 0

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title="Built on process, focused on *quality*"
          scale="feature"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {steps.map((step, index) => {
            const stepImage = imageFor(index)

            return (
              /* A2 grid choreography: row-major card stagger. */
              <Reveal
                key={step.title}
                index={index}
                /* B3 depth: token two-layer shadow + asymmetric hover lift. */
                className={`hover-card grid grid-cols-1 overflow-hidden rounded-2xl bg-white ${
                  hasImages ? "md:grid-cols-2" : ""
                } ${index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                {stepImage && (
                  <div className="relative min-h-[220px]">
                    <div className="absolute inset-0">
                      <Photo src={stepImage} alt={step.title} fill className="h-full" />
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-3xl font-black text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-primary-dark">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* D1 cadence: a section-end estimate CTA after the final step. */}
        <div className="mt-12 flex justify-center">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ProcessNumberCards() {
  const steps = getSteps().slice(0, 5)

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title={`${steps.length} steps to a *better* roof`}
          scale="feature"
        />

        <div className={`grid grid-cols-1 gap-5 ${GRID_COLS[steps.length] ?? "md:grid-cols-5"}`}>
          {steps.map((step, index) => {
            /* B4: exactly one card per repeated row flips its polarity (index
             * 0). The flipped card is always dark, so .card-on-dark separates
             * it by a tonal step on this light band and its inner text keys to
             * the remapped tokens (foreground -> white, accent numeral -> white
             * so no accent TEXT sits on the dark card). B3 hover-card gives the
             * quiet cards the token shadow + asymmetric lift. */
            const flip = index === 0
            return (
              /* A2 grid choreography: left-to-right card stagger. */
              <Reveal
                key={step.title}
                index={index}
                className={`hover-card rounded-2xl border border-black/10 bg-white p-7 text-left ${
                  flip ? "card-flip card-on-dark" : ""
                }`}
              >
                <div
                  className={`text-6xl font-black ${flip ? "text-foreground" : "text-accent"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <IconChip
                  name={resolveStepIcon(step.title, step.description)}
                  surface="light"
                  className="mt-6"
                />

                <h3
                  className={`mt-5 text-xl font-black ${flip ? "text-foreground" : "text-primary-dark"}`}
                >
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </Reveal>
            )
          })}
        </div>

        {/* D1 cadence: a section-end estimate CTA after the final step. */}
        <div className="mt-12 flex justify-center">
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
            Get My Free Estimate
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ProcessImageSplit() {
  const steps = getSteps().slice(0, 5)
  const featureImage = imageFor(0)

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:px-8 ${
          featureImage ? "lg:grid-cols-[0.9fr_1.1fr] lg:items-center" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={featureImage ? halfDirection("left") : "up"}
          className={featureImage ? "reveal-follow" : ""}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            Our Process
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("Your project, our *process*")}
          </h2>

          <p className="mt-5 text-lg text-muted">
            Professional. Reliable. Every step of the way.
          </p>

          <div className="mt-9 space-y-5">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <IconChip
                  name={resolveStepIcon(step.title, step.description)}
                  surface="light"
                  size={40}
                />

                <div>
                  <h3 className="font-black text-primary-dark">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* D1 cadence: a section-end estimate CTA after the final step. */}
          <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile className="mt-9">
            Get My Free Estimate
          </Button>
        </Reveal>

        {featureImage && (
          <Reveal
            direction={halfDirection("right")}
            className="relative min-h-[650px]"
          >
            <div className="absolute inset-0">
              <Photo src={featureImage} alt="Roofing process" fill className="h-full" />
            </div>

            <div className="absolute bottom-8 right-8 rounded-2xl bg-primary-dark p-6 text-white shadow-2xl">
              <IconChip name="shield-check" surface="dark" size={40} />
              <div className="mt-3 text-xl font-black">Quality You Can Trust</div>
              <p className="mt-1 text-white/65">From start to finish.</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function ProcessCircular() {
  const steps = getSteps().slice(0, 5)
  const centerImage = imageFor(0)

  return (
    <section className="bg-white section-y">
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the ring half trailing behind the text. */}
        <Reveal direction={halfDirection("left")}>
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            Our Process
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("A complete process you can *rely on*")}
          </h2>

          <p className="mt-5 text-lg text-muted">
            We follow a proven process to deliver the best results.
          </p>

          <Button href="/contact" surface="light" size="lg" fullWidthMobile className="mt-8">
            Get My Free Estimate
          </Button>
        </Reveal>

        <Reveal
          direction={halfDirection("right")}
          className="reveal-follow relative mx-auto flex aspect-square w-full max-w-[620px] items-center justify-center"
        >
          {centerImage ? (
            // The ring composition needs a circular crop, so this photo keeps
            // rounded-full and takes the grade class directly.
            <div className="relative size-[280px] overflow-hidden rounded-full border-8 border-white shadow-2xl">
              <Image
                src={centerImage}
                alt="Completed project"
                fill
                className="graded-media object-cover"
              />
            </div>
          ) : (
            <div className="grid size-[280px] place-items-center rounded-full border-8 border-white bg-primary-dark shadow-2xl">
              <ShieldCheck className="size-16 text-white" />
            </div>
          )}

          {steps.map((step, index) => {
            const Icon = CIRCLE_ICON[resolveStepIcon(step.title, step.description)] ?? ShieldCheck
            const positions = [
              "left-1/2 top-0 -translate-x-1/2",
              "right-0 top-1/4",
              "right-12 bottom-6",
              "left-12 bottom-6",
              "left-0 top-1/4",
            ]

            return (
              <div
                key={step.title}
                className={`absolute ${positions[index]} text-center`}
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-dark text-white shadow-xl">
                  <Icon className="size-7" />
                </div>

                <div className="mt-2 text-sm font-black text-primary-dark">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="text-xs font-bold text-muted">
                  {step.title}
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

export function ProcessVerticalFlow() {
  const steps = getSteps().slice(0, 5)

  return (
    <section className="bg-[var(--color-surface-light)] section-y">
      <div className="mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the steps rail trailing 120ms. */}
        <Reveal direction={halfDirection("left")}>
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            Our Process
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("A step-by-step approach to *excellence*")}
          </h2>

          <p className="mt-5 text-lg text-muted">
            We follow a systematic process to ensure quality and peace of mind.
          </p>

          <Button href="/contact" surface="light" size="lg" fullWidthMobile className="mt-8">
            Get My Free Estimate
          </Button>
        </Reveal>

        <Reveal
          direction={halfDirection("right")}
          className="reveal-follow relative space-y-8"
        >
          <div className="absolute left-6 top-0 h-full w-px bg-accent" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative flex gap-6">
              <div className="relative z-10 h-fit w-fit shrink-0 rounded-[var(--radius-lg)] bg-white shadow-sm">
                <IconChip
                  name={resolveStepIcon(step.title, step.description)}
                  surface="light"
                />
              </div>

              {/* B3 depth: token two-layer shadow + asymmetric hover lift. */}
              <div className="hover-card rounded-2xl bg-white p-6">
                <h3 className="text-xl font-black text-primary-dark">
                  {step.title}
                </h3>

                <p className="mt-2 text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
