import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { packSeal } from "@/lib/pack-seal"
import { packFrame } from "@/lib/pack-frame"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { stripAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutOwnerJourney() {
  const owner = owners[0]

  // No owner portrait and no project photo, no visual column. Placeholder art
  // never ships. #4: the project-photo fallback uses the distinct About slot so
  // it never repeats the WhyChooseUs photo (owner portrait still wins first).
  const featureImage = owner?.image || sectionPhoto("about")
  const featureAlt = owner?.name || `${siteConfig.name} roofing project`

  const milestones = [
    {
      title: "Built on Clear Communication",
      description: "Every project starts with a clear inspection, clear options and no-pressure recommendations.",
    },
    {
      title: "Owner Accountability",
      description: "You are not passed from person to person. Our team stays accountable from start to finish.",
    },
    {
      title: "Work That Lasts",
      description: "Materials, installation and warranties are handled with long-term protection in mind.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-dark)] section-y text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in srgb, var(--color-accent) 16%, transparent),transparent_30%)]" />

      <div
        className={`relative z-10 mx-auto grid max-w-[var(--container-max)] gap-14 px-4 sm:px-6 lg:px-8 ${
          featureImage ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        {featureImage && (
          <Reveal
            direction={halfDirection("left")}
            className="relative min-h-[560px]"
          >
            <div className="absolute inset-0 shadow-2xl">
              <Photo
                src={featureImage}
                alt={featureAlt}
                fill
                focus={owner?.image ? "top" : "center"}
                sizes="620px"
                scrim="bottom"
                seal={packSeal()}
                frame={packFrame()}
                className="h-full"
              />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-black/70 p-6 backdrop-blur-md">
              <p className="text-2xl font-black leading-tight">
                The name {siteConfig.shortName} means finishing the job the right way.
              </p>
              <p className="mt-3 text-sm font-semibold text-white/60">
                Local ownership. Clear process. Better experience.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal
          direction={featureImage ? halfDirection("right") : "up"}
          className={`flex flex-col justify-center ${featureImage ? "reveal-follow" : ""}`}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent-light">
            <span aria-hidden="true" className="eyebrow-mark" />
            Our Story
          </p>

          <h2 data-scale="feature" className="mt-4 font-black uppercase">
            {stripAccent("Built for homeowners who want roofing done right")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p key={i} className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
              {para}
            </p>
          ))}

          <div className="mt-10 space-y-6">
            {milestones.map((item) => (
              <div key={item.title} className="flex gap-5 rounded-2xl border border-white/10 bg-white/8 p-6">
                <IconChip name="circle-check" surface="dark" />
                <div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the story link kept as the secondary action (dark band). */}
            <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="dark" size="lg">
              Read Our Full Story
            </Button>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-white/60">
              <ShieldCheck className="size-5 text-white" />
              Locally owned and warranty-backed.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
