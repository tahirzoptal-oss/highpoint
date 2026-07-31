import { useState } from 'react';
import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import Lightbox from '../components/Lightbox';
import CTABanner from '../components/CTABanner';
import { CTA_FORM } from '../config/form-ids';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';
import { PRIMARY_SERVICES } from '../config/primary-services';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// The seven services the header, footer and homepage already list, rendered as
// a sentence fragment. Pulled from the shared config so a data change here
// never leaves the gallery copy claiming a service we no longer offer.
const serviceSentence = (() => {
  const names = PRIMARY_SERVICES.map((s) => s.name.toLowerCase());
  if (names.length < 2) return names[0] || 'roofing';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
})();

// Derive gallery photos from brandDNA.previous_projects (populated by the
// Stage 10.1 asset-copy step). Each entry is { filename, type, alt }. Videos
// are skipped — the lightbox shows still images only. previous_projects carry
// no category data, so the gallery is one clean grid with no filter UI.
const photos = (brandDNA.previous_projects || [])
  .filter((p) => p && p.filename && p.type !== 'video')
  .map((p) => ({
    src: `/work/${p.filename}`,
    alt: p.alt || `${brandDNA.company.name} project`,
    caption: p.caption || p.alt || `${brandDNA.company.name} project`,
  }));

const ExpandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);

export default function GalleryPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <SEO
        path="/gallery"
        title={`Project Gallery | ${brandDNA.company.name}`}
        description="See completed roofing and renovation projects by High Point across Kennewick and the Tri-Cities, WA — roofs, kitchens, siding, and flooring."
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      {/* The intro paragraph moved into the section below, so the banner is
          title + breadcrumb only and the copy is not printed twice. */}
      <InnerBanner
        title="Our Completed Projects"
        breadcrumb={[{ label: 'Our Work' }]}
      />

      {/* ════ 2. Logo slider ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ 3. What You Are Looking At — the page's first content section,
             a standalone glass panel between the belt slider and the grid.
             Every fact is already published on the site: the service list, the
             service region, the owner's role and the shot-on-the-job note. ════ */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(46% 42% at 8% 10%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
              'radial-gradient(42% 40% at 96% 16%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
              'linear-gradient(170deg, #F6F9FD 0%, #EFF4FB 55%, #E9F0F9 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.25), transparent)' }} />

        <div className="site-container relative">
          <div
            className="relative text-center mx-auto max-w-[900px] overflow-hidden p-7 lg:p-9"
          >

            <p
              className="relative mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
            >
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
              {brandDNA.copy.gallery.label}
            </p>

            <h2 className="section-h2 relative uppercase" style={{ color: 'rgb(var(--primary))' }}>
              What You Are Looking At
            </h2>

            <span className="relative mt-4 mx-auto block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

            <p className="relative mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
              {brandDNA.copy.gallery.body}
            </p>

            <p className="relative mt-4 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
              These are jobs {brandDNA.team.founder.name} and the crew finished for
              homeowners across {brandDNA.company.serviceRegion}. The work spans
              everything we do: {serviceSentence}. Some are full tear-off
              re-roofs, some are repairs that saved a roof another few seasons,
              and some are renovation projects that started on the roof and
              carried on into the house.
            </p>

            <p className="relative mt-4 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
              We photograph jobs as they finish rather than staging them, so what you see here is the same standard of work you would get on your own property. {brandDNA.team.founder.name} is the owner-operator, so the person who inspects and prices a roof is the person who personally manages and oversees the crew that builds it. That is why the finish is consistent from one project to the next.
            </p>
          </div>
        </div>
      </section>

      {/* ════ 4. Gallery grid ════ */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(46% 42% at 10% 8%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
              'radial-gradient(42% 40% at 92% 14%, rgba(44,90,166,0.1) 0%, transparent 64%),' +
              'linear-gradient(170deg, #FFFFFF 0%, #F8FAFC 55%, #EEF3FA 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />

        <div className="site-container relative">
          {/* ── Grid heading, then the closing note, then the photos. The note
                 introduces the grid rather than trailing it, so a visitor knows
                 what to do with the images before scrolling through them. The
                 eyebrow and lead paragraph live in the section above. ── */}
          <div className="mx-auto mb-10 max-w-[74ch] text-center lg:mb-12">
            <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
              {brandDNA.copy.gallery.heading}
            </h2>
            <span className="mx-auto mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

            {photos.length > 0 && (
              <>
                <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                  Take your time scrolling through. Tap any photo to open it full
                  size. If something here looks like the job you need doing, get
                  in touch. The inspection and the written estimate are free, and
                  the written estimate is the price you pay.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em]"
                    style={{ fontFamily: JOSEFIN, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
                  >
                    {brandDNA.copy.buttonText}
                  </Link>
                  <a
                    href={`tel:${brandDNA.contact.phoneTelLink}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ease-out hover:text-[rgb(var(--primary))]"
                    style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}
                  >
                    Or call {brandDNA.contact.phone}
                  </a>
                </div>
              </>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
                Project Gallery Coming Soon
              </h2>
              <p className="mt-4 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                Call us for project photos and references from work in your area.
              </p>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {photos.map((photo, i) => (
                <li key={`${photo.src}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={`Open image ${i + 1} of ${photos.length}: ${photo.caption}`}
                    className="group relative block w-full overflow-hidden rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.05),0_12px_30px_-18px_rgba(16,40,79,0.24)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,79,0.06),0_22px_44px_-20px_rgba(16,40,79,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
                    style={{ border: '1px solid rgba(16,40,79,0.07)' }}
                  >
                    {/* Every tile shares one aspect ratio, so photos of any
                        native size line up on a clean grid with no gaps. */}
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* navy veil + expand affordance, revealed on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                        style={{ background: 'linear-gradient(200deg, rgba(11,28,58,0.55), rgba(8,18,38,0.4))' }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                        style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(255,255,255,0.7)', color: 'rgb(var(--primary))' }}
                      >
                        <ExpandIcon className="h-5 w-5" />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </section>

      <Lightbox items={photos} index={openIndex} onClose={() => setOpenIndex(null)} onIndex={setOpenIndex} />


      {/* ════ 4. Global CTA ════ */}
      <CTABanner formId={CTA_FORM.gallery} />
    </>
  );
}
