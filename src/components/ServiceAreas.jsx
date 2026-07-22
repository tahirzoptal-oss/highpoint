import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
// The map frame (radius, glass fill, shadow, corner bracket, offset panel) is
// shared with the Contact page map, so both stay on one definition.
import { MAP_FRAME } from '../config/map-frame';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Slugify a city name exactly the way the /service-areas/:slug route's
// getStaticPaths enumerates brandDNA.serviceAreas, so every tile lands on a
// real prerendered page rather than a 404.
const slugifyCity = (name) =>
  String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 21.3s7-5.6 7-11.3a7 7 0 1 0-14 0c0 5.7 7 11.3 7 11.3Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

/**
 * Two surface treatments, one component. `dark` is the homepage look and stays
 * the default so the homepage renders byte-identically. Inner pages pass
 * `variant="light"` — their CTA banner is already dark, and two dark sections
 * back to back read as one heavy block.
 *
 * Only surface colours change: layout, content, links and hover behaviour are
 * shared, so there is nothing to keep in sync between the two.
 */
const SURFACE = {
  dark: {
    base:
      'radial-gradient(52% 46% at 10% 8%, rgba(44,90,166,0.34) 0%, transparent 62%),' +
      'radial-gradient(46% 42% at 92% 16%, rgba(110,143,196,0.20) 0%, transparent 64%),' +
      'radial-gradient(58% 50% at 45% 104%, rgba(44,90,166,0.22) 0%, transparent 62%),' +
      'linear-gradient(168deg, #0B1C3A 0%, #10284F 52%, #0A1730 100%)',
    glowA: 'rgb(var(--accent) / 0.24)',
    glowB: 'rgb(var(--accent-light) / 0.14)',
    ruleTop: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
    ruleBottom: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
    eyebrow: 'rgb(var(--accent-light))',
    heading: '#FFFFFF',
    body: 'rgba(255,255,255,0.72)',
    rule: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))',
    ...MAP_FRAME.dark,
  },
  light: {
    base:
      'radial-gradient(48% 44% at 10% 8%, rgba(110,143,196,0.18) 0%, transparent 62%),' +
      'radial-gradient(44% 40% at 92% 16%, rgba(44,90,166,0.12) 0%, transparent 64%),' +
      'linear-gradient(168deg, #FFFFFF 0%, #F6F9FD 52%, #EDF3FA 100%)',
    glowA: 'rgb(var(--accent) / 0.1)',
    glowB: 'rgb(var(--accent-light) / 0.16)',
    ruleTop: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)',
    ruleBottom: 'linear-gradient(90deg, transparent, rgba(16,40,79,0.12), transparent)',
    eyebrow: 'rgb(var(--accent))',
    heading: 'rgb(var(--primary))',
    body: 'rgb(var(--ink) / 0.75)',
    rule: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))',
    ...MAP_FRAME.light,
  },
};

/**
 * Props
 *   variant — 'dark' (default, homepage) | 'light' (inner pages)
 *   layout  — 'split' (default, copy beside map) | 'stacked' (copy above map,
 *             for narrow columns such as the service-page silo)
 *   as      — 'section' (default: own band, background, padding and container)
 *             | 'div' (bare: content only, so a host section owns the band and
 *             the column width). Bare mode never renders the section chrome.
 *   mapQuery — optional place string ("Pasco, WA"). When given, the SAME map
 *             frame centres on that place instead of the business address, so a
 *             location page shows its own suburb. Data only — no styling change.
 *   heading, body — optional copy overrides, so a service page can run its own
 *             "where we work" paragraph. Both default to the shared
 *             brandDNA.copy.serviceAreas text.
 */
export default function ServiceAreas({ variant = 'dark', layout = 'split', as = 'section', mapQuery, heading, body }) {
  const c = brandDNA.copy.serviceAreas;
  const areas = brandDNA.serviceAreas || [];
  const s = SURFACE[variant] || SURFACE.dark;
  const isDark = variant !== 'light';
  const stacked = layout === 'stacked';
  const bare = as === 'div';
  // Keyless place embed, the same form Google's "share > embed" produces.
  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : brandDNA.contact.mapsEmbedUrl;
  const mapTitle = mapQuery
    ? `${brandDNA.company.name} - ${mapQuery}`
    : `${brandDNA.company.name} - ${brandDNA.address.full}`;

  const content = (
    <div className={bare ? 'relative' : 'site-container relative'}>
        <div className={stacked ? 'grid gap-10' : 'grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14'}>
          {/* ════ LEFT — label, heading, body, area cards ════ */}
          <div>
            <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: s.eyebrow, fontFamily: INTER }}>
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: s.eyebrow }} />
              {c.label}
            </p>

            <h2 className="section-h2 uppercase" style={{ color: s.heading }}>
              {heading || c.heading}
            </h2>

            <span className="mb-5 mt-4 block h-[3px] w-12 rounded-full" style={{ background: s.rule }} />

            <p className="max-w-[58ch] text-[15px] leading-[1.72]" style={{ fontFamily: INTER, color: s.body }}>
              {body || c.body}
            </p>

            {/* Clean white location cards on both surfaces. No gradient or
                gloss — a hairline border and a whisper of shadow at rest.
                Hover lifts 3px, deepens the shadow and shifts the icon and
                label to primary blue. The shadow is tuned per surface (a dark
                backdrop needs a heavier one to register) and lives in a class,
                not inline, so the hover shadow can win the cascade. */}
            <ul className="mt-7 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <li key={area} className="h-full">
                  <Link
                    to={`/service-areas/${slugifyCity(area)}`}
                    className={`group flex h-full items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 transition-[transform,box-shadow] duration-[280ms] ease-out hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      isDark
                        ? 'shadow-[0_1px_2px_rgba(8,16,34,0.16)] hover:shadow-[0_10px_24px_-8px_rgba(8,16,34,0.45)] focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-[#0B1C3A]'
                        : 'shadow-[0_1px_2px_rgba(16,40,79,0.06)] hover:shadow-[0_10px_24px_-10px_rgba(16,40,79,0.32)] focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-white'
                    }`}
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <PinIcon className="h-[18px] w-[18px] flex-shrink-0 text-ink/40 transition-colors duration-[280ms] ease-out group-hover:text-[rgb(var(--primary))]" />
                    <span
                      className="truncate text-[12.5px] font-semibold uppercase leading-none tracking-[0.05em] text-ink transition-colors duration-[280ms] ease-out group-hover:text-[rgb(var(--primary))]"
                      style={{ fontFamily: INTER }}
                    >
                      {area}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ════ RIGHT (or BELOW when stacked) — live Google Maps embed ════ */}
          <div className={`relative mx-auto w-full lg:mx-0 lg:max-w-none ${stacked ? 'max-w-none' : 'max-w-[560px]'}`}>
            {/* corner bracket + offset glass panel, drawn light-on-dark */}
            <span
              aria-hidden
              className="absolute -right-3.5 -top-3.5 hidden h-20 w-20 rounded-tr-[24px] sm:block"
              style={{ borderTop: `2px solid ${s.bracket}`, borderRight: `2px solid ${s.bracket}` }}
            />
            <span
              aria-hidden
              className="absolute -bottom-3.5 -left-3.5 hidden h-28 w-28 rounded-[24px] sm:block"
              style={{ background: s.panel, border: `1px solid ${s.panelBorder}` }}
            />

            <div
              className="relative overflow-hidden rounded-[24px] p-2 backdrop-blur-md"
              style={{
                background: s.frameBg,
                border: `1px solid ${s.frameBorder}`,
                boxShadow: s.frameShadow,
              }}
            >
              {/* Aspect-locked so the map never changes height between breakpoints */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] sm:aspect-[16/11]">
                <iframe
                  title={mapTitle}
                  src={mapSrc}
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  // Bare mode: the host section owns the band, padding and column width.
  if (bare) return <div id="service-area" className="relative">{content}</div>;

  return (
    <section id="service-area" className="relative overflow-hidden py-14 lg:py-20">
      <div aria-hidden className="absolute inset-0" style={{ background: s.base }} />

      {/* ── Decoration: soft glows and hairline rules ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: s.glowA }} />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full blur-3xl" style={{ background: s.glowB }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: s.ruleTop }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: s.ruleBottom }} />
      </div>

      {content}
    </section>
  );
}
