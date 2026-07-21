/**
 * LogoSlider — reusable, infinite certification/partner marquee.
 *
 * • Fixed logos-per-view: 5 desktop / 3 tablet / 2 mobile / 1 small mobile.
 *   Every slot is exactly 1/perView of the container, so spacing is equal and
 *   logos are vertically centred at every breakpoint.
 * • Seamless loop: the list is rendered twice and the track slides -50%.
 * • Autoplay, continuous, constant speed; pauses on hover / focus (desktop).
 * • Logos keep their aspect ratio (fixed height, w-auto, object-contain).
 *
 * To swap in the final assets later, just edit DEFAULT_LOGOS below (or pass a
 * `logos` prop) — the component structure never changes:
 *     <LogoSlider logos={[{ src: '/path.svg', alt: 'Name' }, ...]} />
 */

import { useSyncExternalStore } from 'react';

// Placeholder certification / partner logos (existing project assets).
const DEFAULT_LOGOS = [
  { src: '/badges/iko-roofpro-select.webp', alt: 'IKO RoofPro Select' },
  { src: '/badges/owens-corning.png', alt: 'Owens Corning Preferred Contractor' },
  { src: '/badges/google-ratingimage.webp', alt: '5.0 Google Rating' },
  { src: '/badges/iko-roofpro-select.webp', alt: 'IKO RoofPro Select' },
  { src: '/badges/owens-corning.png', alt: 'Owens Corning Preferred Contractor' },
  { src: '/badges/google-ratingimage.webp', alt: '5.0 Google Rating' },
];

const FADE = '#F4F7FC';

// Logos visible per slide. SSR snapshot = 5 (desktop-first, matches the LCP view).
const getPerView = () => {
  if (typeof window === 'undefined') return 5;
  const w = window.innerWidth;
  if (w < 480) return 3;   // small mobile
  if (w < 768) return 4;  
  if (w < 1200) return 5;  // tablet
  return 7;                // desktop
};
const subscribeResize = (cb) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

export default function LogoSlider({ logos = DEFAULT_LOGOS, speed = 34, className = '' }) {
  const perView = useSyncExternalStore(subscribeResize, getPerView, () => 5);

  if (!logos?.length) return null;

  // The track holds the list TWICE. Sizing it relative to the container:
  //   track  = 2 copies × (logos.length / perView) containers
  //   slot   = 1 / (2 × logos.length) of the track  ⇒ exactly 1/perView of the
  //            container, whatever the breakpoint.
  // Translating the track by -50% therefore advances exactly one full copy.
  const loop = [...logos, ...logos];
  const trackWidth = `${(200 * logos.length) / perView}%`;
  const slotWidth = `${100 / loop.length}%`;

  return (
    <section
      className={`relative overflow-hidden bg-[#F4F7FC] py-9 lg:py-12 ${className}`}
      aria-label="Certifications and partners"
    >
      {/* Soft edge fades so logos ease in/out at the container edges */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20" style={{ background: `linear-gradient(90deg, ${FADE}, transparent)` }} />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20" style={{ background: `linear-gradient(270deg, ${FADE}, transparent)` }} />

      <div className="logo-marquee" style={{ '--logo-marquee-duration': `${speed}s` }}>
        <ul className="logo-marquee-track m-0 list-none p-0" style={{ width: trackWidth }}>
          {loop.map((logo, i) => {
            const dup = i >= logos.length; // second copy is decorative
            return (
              <li
                key={i}
                className="flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{ flex: `0 0 ${slotWidth}`, maxWidth: slotWidth }}
                aria-hidden={dup || undefined}
              >
                <img
                  src={logo.src}
                  alt={dup ? '' : logo.alt}
                  className="h-11 w-auto max-w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 sm:h-12 lg:h-16"
                  loading="lazy"
                  draggable="false"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
