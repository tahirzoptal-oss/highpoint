import { Link, useLocation } from 'react-router-dom';
import { bannerImageFor } from '../config/banner-images';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

/**
 * InnerBanner — the shared hero band for every inner page.
 *
 * The homepage deliberately does NOT use this: its hero is a bespoke
 * two-column composition. Everything else (About, Services, Service detail,
 * Service Areas, Gallery, Financing, Blog, Blog detail, Contact and any future
 * page) renders this, so changing the banner here changes them all.
 *
 * Inner banners carry NO eyebrow label — the breadcrumb already says where you
 * are, so the band reads title-first on every page.
 *
 * Props
 *   title            string      required — the <h1>
 *   subtitle         node        optional supporting line under the rule
 *   image            string      background photo. Omit it and the banner picks
 *                                the photo mapped to the current route in
 *                                src/config/banner-images.js, so every page
 *                                gets its own without any per-page wiring. Pass
 *                                one to override (the blog posts pass their
 *                                cover).
 *   imageFallback    string      swapped in via onError if `image` 404s
 *   objectPosition   string      focal point for the photo; defaults to centre
 *   breadcrumb       [{ label, to? }]  optional; the final crumb renders plain.
 *                                A leading Home crumb is added automatically.
 *   overlayOpacity   number      0–1 multiplier on the dark scrim (default 1)
 *   minHeightClass   string      escape hatch for a taller/shorter band
 *   children         node        optional extra content under the subtitle
 */
export default function InnerBanner({
  title,
  subtitle,
  image,
  imageFallback = '/work/project1.webp',
  objectPosition = '50% 50%',
  breadcrumb,
  overlayOpacity = 1,
  minHeightClass = 'min-h-[46vh] lg:min-h-[52vh]',
  children,
}) {
  // No `image` prop? Take the one mapped to this route. Doing the lookup here
  // rather than in every page keeps the banner a single component with no
  // duplicated wiring, and a new page picks up a photo automatically.
  const { pathname } = useLocation();
  const src = image || bannerImageFor(pathname);

  // One scrim, scaled by `overlayOpacity`, so a page with a busy photo can dial
  // it up and a page with a soft one can dial it down without redefining the
  // gradient. Clamped so text never loses its floor.
  const k = Math.max(0, Math.min(1, overlayOpacity));
  const scrim =
    `linear-gradient(180deg, rgba(6,10,18,${(0.62 * k).toFixed(3)}) 0%, ` +
    `rgba(8,18,38,${(0.86 * k).toFixed(3)}) 62%, ` +
    `rgba(8,18,38,${(0.94 * k).toFixed(3)}) 100%)`;

  const crumbs = breadcrumb && breadcrumb.length
    ? [{ label: 'Home', to: '/' }, ...breadcrumb]
    : null;

  return (
    <section className={`relative flex flex-col justify-end overflow-hidden ${minHeightClass}`}>
      {/* Rendered as an <img> rather than a CSS background: `object-fit: cover`
          + `object-position: 50% 50%` on a full-bleed element is the exact
          equivalent of `background-size: cover; background-position: center;
          background-repeat: no-repeat`, and it additionally gives us the
          onError fallback and lets the browser prioritise the fetch. */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        onError={(e) => { if (imageFallback && e.target.src !== imageFallback) e.target.src = imageFallback; }}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: scrim }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.22)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
      </div>

      <div className="site-container relative py-14 lg:py-20">
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.6)' }}
          >
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
                  {i > 0 && <span aria-hidden style={{ color: 'rgb(var(--accent-light))' }}>›</span>}
                  {c.to && !last ? (
                    <Link to={c.to} className="transition-colors duration-300 hover:text-white">{c.label}</Link>
                  ) : (
                    <span style={{ color: '#FFFFFF' }} aria-current={last ? 'page' : undefined}>{c.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <h1
          className="uppercase"
          style={{
            fontFamily: JOSEFIN,
            fontWeight: 700,
            fontSize: 'clamp(34px, 5vw, 62px)',
            lineHeight: 1.03,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            textShadow: '0 2px 20px rgba(8,18,38,0.55)',
          }}
        >
          {title}
        </h1>

        <span className="mb-5 mt-5 block h-[3px] w-14 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))' }} />

        {subtitle && (
          <p className="max-w-[58ch] text-[15px] leading-[1.75]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.8)' }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
