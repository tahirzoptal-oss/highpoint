import { Button } from "@/components/Button"
import { IconChip } from "@/components/IconChip"
import { Photo } from "@/components/Photo"
import { stripAccent } from "@/lib/accent"
import { siteConfig } from "@/lib/site-config"
import { sectionPhoto } from "@/components/about/section-photo"

export function AboutOverlayImage() {
  // No real project photo, the card sits on a dark band instead. Placeholder
  // art never ships. #4: distinct About slot so this band never repeats the
  // WhyChooseUs photo.
  const aboutImage = sectionPhoto("about")

  return (
    <section className="relative overflow-hidden bg-white section-y">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[640px]">
          {aboutImage ? (
            <div className="absolute inset-0">
              <Photo
                src={aboutImage}
                alt={`${siteConfig.name} roofing project`}
                fill
                scrim="bottom"
                className="h-full"
              />
            </div>
          ) : (
            <div className="absolute inset-0 rounded-[var(--photo-radius)] bg-[var(--color-surface-dark)]" />
          )}

          <div className="relative z-10 flex min-h-[640px] items-center justify-center p-6">
            <div className="max-w-3xl rounded-2xl bg-primary-dark/90 p-8 text-center text-white shadow-2xl backdrop-blur-md md:p-12">
              <p className="eyebrow flex items-center justify-center gap-2.5 text-[13px] text-accent-light">
                <span aria-hidden="true" className="eyebrow-mark" />
                About Us
              </p>

              <h2 data-scale="feature" className="mt-4 font-black uppercase">
                {stripAccent("Experience, integrity, peace of mind")}
              </h2>

              {siteConfig.founder.story.map((para, i) => (
                <p key={i} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  {para}
                </p>
              ))}

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div>
                  <IconChip name="shield-check" surface="dark" className="mx-auto" />
                  <h3 className="mt-3 text-sm font-black uppercase">
                    Honest Communication
                  </h3>
                </div>

                <div>
                  <IconChip name="star" surface="dark" className="mx-auto" />
                  <h3 className="mt-3 text-sm font-black uppercase">
                    Quality Materials
                  </h3>
                </div>

                <div>
                  <IconChip name="users" surface="dark" className="mx-auto" />
                  <h3 className="mt-3 text-sm font-black uppercase">
                    Expert Installation
                  </h3>
                </div>

                <div>
                  <IconChip name="award" surface="dark" className="mx-auto" />
                  <h3 className="mt-3 text-sm font-black uppercase">
                    Strong Warranties
                  </h3>
                </div>
              </div>

              {/* D1 cadence: the section-end estimate CTA (locked phrase), with
               * the story link kept as the secondary action (dark card). */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="#estimate-form" surface="dark" size="lg" fullWidthMobile>
                  Get My Free Estimate
                </Button>

                <Button href="/about" intent="ghost" surface="dark" size="lg">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
