import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/Button"
import { Photo } from "@/components/Photo"
import { renderAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutOverlapCard() {
  // No real project photo, the card sits on a dark band instead. Placeholder
  // art never ships. #4: distinct About slot so this band never repeats the
  // WhyChooseUs photo.
  const aboutImage = sectionPhoto("about")

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[620px]">
          {aboutImage ? (
            <div className="absolute inset-0">
              <Photo
                src={aboutImage}
                alt={`${siteConfig.name} roofing project`}
                fill
                scrim="left"
                className="h-full"
              />
            </div>
          ) : (
            <div className="absolute inset-0 rounded-[var(--photo-radius)] bg-[var(--color-surface-dark)]" />
          )}

          <div className="relative z-10 flex min-h-[620px] items-center justify-center p-6 lg:justify-end lg:p-14">
            <div className="max-w-xl rounded-2xl bg-white p-8 shadow-2xl md:p-12">
              <p className="eyebrow flex items-center gap-2.5 text-[13px] text-accent">
                <span aria-hidden="true" className="eyebrow-mark" />
                About Us
              </p>

              <h2
                data-scale="feature"
                className="mt-4 font-black uppercase text-primary-dark"
              >
                {renderAccent(`Roofing *done right*. The ${siteConfig.shortName} way`)}
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
                {/* D1 cadence: the section-end estimate CTA (locked phrase),
                 * with the about link kept as the secondary action. */}
                <Button href="#estimate-form" surface="light" size="lg" fullWidthMobile>
                  Get My Free Estimate
                </Button>

                <Button href="/about" intent="ghost" surface="light" size="lg">
                  Learn More About Us
                </Button>

                <div className="inline-flex items-center gap-2 font-bold text-muted">
                  <ShieldCheck className="size-5 text-accent" />
                  Licensed and insured.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
