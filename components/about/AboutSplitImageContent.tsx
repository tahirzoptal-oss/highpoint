import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig, owners } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutSplitImageContent({
  receiveSeam = false,
}: {
  /* F2: pad this band's top to absorb the WhyChooseUs seam-weld overshoot. */
  receiveSeam?: boolean
} = {}) {
  const owner = owners?.[0]

  // No owner portrait and no project photo, no image column. Placeholder art
  // never ships. #4: the project-photo fallback uses the distinct About slot so
  // it never repeats the WhyChooseUs photo (owner portrait still wins first).
  const aboutImage = owner?.image || sectionPhoto("about")
  const aboutAlt = owner?.name || `${siteConfig.name} roofing project`

  return (
    <section
      className={`bg-white section-y ${receiveSeam ? "overlap-receive-seam" : ""}`}
    >
      <div
        className={`mx-auto grid max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:px-8 ${
          aboutImage ? "lg:grid-cols-2 lg:items-center" : ""
        }`}
      >
        {/* A2 split choreography: halves slide from their own sides in the
         * directional packs, the text half trailing 120ms. */}
        <Reveal
          direction={aboutImage ? halfDirection("left") : "up"}
          className={aboutImage ? "reveal-follow" : "max-w-3xl"}
        >
          <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
            <span aria-hidden="true" className="eyebrow-mark" />
            About Us
          </p>

          <h2
            data-scale="feature"
            className="mt-4 font-black uppercase text-primary-dark"
          >
            {renderAccent("A local company you can *trust*")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-5"} text-lg leading-relaxed text-muted`}
            >
              {para}
            </p>
          ))}

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div>
              <IconChip name="shield-check" surface="light" />
              <h3 className="mt-3 font-black text-primary-dark">
                Honest Communication
              </h3>
              <p className="mt-1 text-sm text-muted">Clear answers. No pressure.</p>
            </div>

            <div>
              <IconChip name="users" surface="light" />
              <h3 className="mt-3 font-black text-primary-dark">
                Quality Workmanship
              </h3>
              <p className="mt-1 text-sm text-muted">Built to last. Done right.</p>
            </div>

            <div>
              <IconChip name="star" surface="light" />
              <h3 className="mt-3 font-black text-primary-dark">
                Warranty Protection
              </h3>
              <p className="mt-1 text-sm text-muted">Backed by strong warranties.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            {/* D1 cadence: the section-end estimate CTA (locked phrase), with
             * the about link kept as the secondary action. */}
            <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
              Get My Free Estimate
            </Button>

            <Button href="/about" intent="ghost" surface="light" size="lg">
              Learn More About Us
            </Button>

            <div className="inline-flex items-center gap-2 font-bold text-muted">
              <ShieldCheck className="size-5 text-accent" />
              Licensed, insured and warranty-backed.
            </div>
          </div>
        </Reveal>

        {aboutImage && (
          <Reveal direction={halfDirection("right")}>
            <Photo src={aboutImage} alt={aboutAlt} fill focus={owner?.image ? "top" : "center"} className="min-h-[560px]" />
          </Reveal>
        )}
      </div>
    </section>
  )
}
