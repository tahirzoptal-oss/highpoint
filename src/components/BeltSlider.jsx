/**
 * BeltSlider — reusable brand belt. A compact, full-bleed band that scrolls the
 * site logo + site name across the page, continuously and seamlessly.
 *
 * Drop it anywhere as a section divider:
 *     <BeltSlider />                        // navy band (default)
 *     <BeltSlider variant="light" />        // pale blue band
 *     <BeltSlider repeat={8} speed={4} />   // denser / faster
 *
 * Notes
 * • Content is ONLY brandDNA.company.name + the existing /logo.webp asset.
 * • Seamless loop: the item list renders TWICE and .belt-marquee-track (see
 *   index.css) translates by exactly -50%, so the restart is invisible.
 * • Never pauses — no hover pause, no arrows, no dots, by design.
 * • The whole band is decorative repetition, so every item is aria-hidden and
 *   the section carries the brand name once as its accessible label.
 */

import { brandDNA } from '../config/brand-dna';

const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Theme-only surfaces. `navy` uses the same gradient family as the site header;
// `light` uses the hero's pale blue wash. No colors outside the palette.
const VARIANTS = {
  navy: {
    background:
      'linear-gradient(100deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary)) 52%, rgb(var(--primary-dark)) 100%)',
    rule: 'rgb(var(--accent-light) / 0.55)',
    text: '#FFFFFF',
    diamond: 'rgb(var(--accent-light))',
    chip: '#FFFFFF',
    chipBorder: 'rgba(255,255,255,0.6)',
    chipShadow: '0 8px 20px -10px rgba(8,16,34,0.6)',
    texture: 'rgba(255,255,255,0.05)',
  },
  light: {
    background: 'linear-gradient(100deg, #F2F6FC 0%, #E5EDF8 52%, #F2F6FC 100%)',
    rule: 'rgb(var(--accent) / 0.28)',
    text: 'rgb(var(--primary-dark))',
    diamond: 'rgb(var(--accent))',
    chip: '#FFFFFF',
    chipBorder: 'rgba(16,40,79,0.08)',
    chipShadow: '0 8px 20px -12px rgba(16,40,79,0.35)',
    texture: 'rgba(24,60,120,0.035)',
  },
};

// One belt unit: logo chip + site name + diamond separator.
function BeltItem({ logo, name, v }) {
  return (
    <li className="flex flex-shrink-0 items-center" aria-hidden="true">
      <span
        className="flex h-11 w-[60px] flex-shrink-0 items-center justify-center rounded-[8px] sm:h-12 sm:w-[84px] lg:h-[45px] lg:w-[85px]"
        style={{ background: v.chip, border: `1px solid ${v.chipBorder}`, boxShadow: v.chipShadow }}
      >
        <img
          src={logo}
          alt=""
          className="h-6 w-auto max-w-[80%] object-contain sm:h-8 lg:h-9"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </span>

      <span
        className="ml-3 whitespace-nowrap text-[12px] font-bold uppercase leading-none sm:ml-4 sm:text-[14px] lg:text-[16px]"
        style={{ fontFamily: JOSEFIN, color: v.text, letterSpacing: '0.13em' }}
      >
        {name}
      </span>

      {/* Separator — the site's existing rotated-square accent motif */}
      <span
        className="mx-7 h-[7px] w-[7px] flex-shrink-0 rotate-45 rounded-[1px] sm:mx-9 lg:mx-12"
        style={{ background: v.diamond }}
      />
    </li>
  );
}

export default function BeltSlider({
  name = brandDNA.company.name,
  logo = '/logo.webp',
  variant = 'navy',
  // One copy must be at least as wide as the viewport or a gap appears at the
  // loop point — 8 items clears ~4400px, i.e. every realistic display.
  repeat = 8,
  speed = 5, // seconds per item — duration scales with `repeat` so the
  // on-screen speed stays constant however dense the belt is.
  className = '',
}) {
  const v = VARIANTS[variant] || VARIANTS.navy;
  const items = Array.from({ length: repeat });

  return (
    <section
      className={`relative overflow-hidden py-2.5 lg:py-3 ${className}`}
      style={{ background: v.background }}
      aria-label={name}
    >
      {/* Hairline theme rules top + bottom so the band reads as a belt */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: v.rule }} />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px" style={{ background: v.rule }} />
      {/* Very low-contrast diagonal texture, same motif as the hero */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `repeating-linear-gradient(135deg, transparent 0 22px, ${v.texture} 22px 23px)` }}
      />

      <div className="belt-marquee relative" style={{ '--belt-marquee-duration': `${repeat * speed}s` }}>
        {/* Rendered twice — the track slides -50% for a jump-free loop */}
        <ul className="belt-marquee-track m-0 list-none p-0">
          {items.map((_, i) => (
            <BeltItem key={`a${i}`} logo={logo} name={name} v={v} />
          ))}
          {items.map((_, i) => (
            <BeltItem key={`b${i}`} logo={logo} name={name} v={v} />
          ))}
        </ul>
      </div>
    </section>
  );
}
