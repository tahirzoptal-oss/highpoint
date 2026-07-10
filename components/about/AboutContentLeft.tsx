import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { packSeal } from "@/lib/pack-seal"
import { packFrame } from "@/lib/pack-frame"
import { Reveal } from "@/components/Reveal"
import { halfDirection } from "@/components/split-reveal"
import { renderAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutContentLeft({
  receiveSeam = false,
}: {
  /* F2: pad this band's top to absorb the WhyChooseUs seam-weld overshoot. */
  receiveSeam?: boolean
} = {}) {
  // No real project photo, no image column. Placeholder art never ships.
  // #4: distinct About slot so this band never repeats the WhyChooseUs photo.
  const aboutImage = sectionPhoto("about")

  return (
    <section
      className={`bg-white section-y ${receiveSeam ? "overlap-receive-seam" : ""}`}
    >
      <div
        className={`mx-auto grid grid-cols-1 max-w-[var(--container-max)] gap-12 px-4 sm:px-6 lg:px-8 ${
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
            {renderAccent("Built on *honesty*, focused on quality")}
          </h2>

          {siteConfig.founder.story.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-6" : "mt-5"} text-lg leading-relaxed text-muted`}
            >
              {para}
            </p>
          ))}

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
            <Photo
              src={aboutImage}
              alt={`${siteConfig.name} roofing project`}
              fill
              seal={packSeal()}
              frame={packFrame()}
              className="min-h-[520px]"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
