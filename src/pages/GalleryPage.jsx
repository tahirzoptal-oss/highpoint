import { useState } from 'react';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import Lightbox from '../components/Lightbox';
import CTABanner from '../components/CTABanner';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

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
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title="Our Completed Projects"
        subtitle={brandDNA.copy.gallery.body}
        objectPosition="50% 35%"
        breadcrumb={[{ label: 'Our Work' }]}
      />

      {/* ════ 2. Logo slider ════ */}
      <LogoSlider />
       <BeltSlider />

      {/* ════ 3. Gallery grid ════ */}
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
      <CTABanner />
    </>
  );
}
