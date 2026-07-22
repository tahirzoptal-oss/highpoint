import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import { PRIMARY_SERVICES } from '../config/primary-services';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Matches the header CTA exactly (Navbar's navCtaTextStyle). Paired with the
// global .btn-gold glass class so this button and the nav button are the same
// component visually.
const glassBtnTextStyle = {
  color: 'rgb(var(--on-accent))',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
  fontFamily: INTER,
};

const serviceIcons = {
  // Wrench — repair. One continuous outline (the previous three-path version
  // overlapped itself and rendered as a tangle at 24px).
  'roof-repair': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  // Cycle arrows — replacement
  'roof-replacement': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  // House — new installation
  'new-roof-installation': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  'emergency-roofing': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  'roof-inspections': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  'historical-roof-restoration': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  'storm-damage-repair': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  'insurance-claims-assistance': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
    </svg>
  ),
  'siding': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  'gutters': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
    </svg>
  ),
  'windows': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
  'metal-roofing': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
    </svg>
  ),
};

const fallbackIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

/* Match a service by slug, then by keyword in the name (handles brand-dna
   entries that come from a sitemap with no `slug` field — picks the closest
   icon by name keyword so the grid shows varied icons instead of every card
   falling through to the roof fallback). Keyword order matters — specific
   terms first so "storm damage repair" doesn't collapse to plain "repair",
   and "replacement" doesn't collapse into "installation". */
function pickServiceIcon(service) {
  if (service.slug && serviceIcons[service.slug]) return serviceIcons[service.slug];
  const name = (service.name || '').toLowerCase();
  const slug = (service.slug || '').toLowerCase();
  const haystack = `${name} ${slug}`;
  const rules = [
    [/storm/, 'storm-damage-repair'],
    [/insurance|claim/, 'insurance-claims-assistance'],
    [/inspect/, 'roof-inspections'],
    [/historical|restor/, 'historical-roof-restoration'],
    [/emergency/, 'emergency-roofing'],
    [/replace/, 'roof-replacement'],
    [/install|new\s+roof/, 'new-roof-installation'],
    [/siding/, 'siding'],
    [/gutter/, 'gutters'],
    [/window/, 'windows'],
    [/metal/, 'metal-roofing'],
    [/renovat|remodel/, 'siding'],
    [/repair|leak|patch/, 'roof-repair'],
    [/roof/, 'roof-replacement'],
  ];
  for (const [re, key] of rules) {
    if (re.test(haystack) && serviceIcons[key]) return serviceIcons[key];
  }
  return fallbackIcon;
}

// The seven services, their order and their resolved hrefs all come from the
// shared config so this section, the header dropdown and the footer stay in
// lockstep. See src/config/primary-services.js.
const SERVICES = PRIMARY_SERVICES;

const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

const projectFile =
  brandDNA.previous_projects?.[1]?.filename ||
  brandDNA.previous_projects?.[0]?.filename ||
  'project1.webp';

/**
 * Service card. Shadow-free and border-free by design — the interaction is
 * carried entirely by colour: the tile tints toward accent blue, a gloss
 * sweeps across, the icon eases up, the label shifts 3px right and warms to
 * primary, and a chevron slides in from the right. All on one 280ms curve.
 */
function ServiceCard({ service, className = '' }) {
  return (
    <li className={className}>
      <Link
        to={service.href}
        className="group relative flex h-full items-center gap-3.5 overflow-hidden rounded-[18px] bg-white/70 p-3.5 backdrop-blur-md transition-colors duration-[280ms] ease-out hover:bg-[rgb(var(--accent)/0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
        style={{border: '1px solid rgba(44, 90, 166, 0.2),'}}
      >
        {/* glossy highlight sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-full transition-transform duration-[700ms] ease-out group-hover:translate-x-[200%]"
          style={{ background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.75) 50%, transparent 62%)' }}
        />

        {/* Icon tile — the site's blue glass medallion, as before. The only
            change is a hairline light rim and a soft accent shadow, so the tile
            reads as a raised object rather than a flat swatch. Size, radius,
            spacing and alignment are untouched. */}
        <span
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] transition-transform duration-[280ms] ease-out"
          style={{
            background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
            border: '1px solid rgba(255,255,255,0.55)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 18px -10px rgb(var(--accent) / 0.55)',
            color: 'rgb(var(--on-accent))',
          }}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-[3px] top-[3px] h-[44%] rounded-[10px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
          <span className="relative">{pickServiceIcon(service)}</span>
        </span>

        <span
          className="relative flex-1 text-[13px] font-semibold uppercase leading-[1.25] tracking-[0.05em] text-[rgb(var(--primary-dark))] transition-[color,transform] duration-[280ms] ease-out group-hover:text-[rgb(var(--primary))]"
          style={{ fontFamily: INTER }}
        >
          {service.name}
        </span>

        <ChevronRight className="relative h-4 w-4 flex-shrink-0 -translate-x-2 text-[rgb(var(--accent))] opacity-0 transition-[transform,opacity] duration-[280ms] ease-out group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
    </li>
  );
}

/**
 * Services — the homepage's single services section. Absorbed the former
 * standalone "What We Do" component: its layout, glass tiles, mesh background
 * and architectural decoration now live here, alongside this section's own
 * brand belt, project photo and logo lockup.
 */
export default function Services() {
  const c = brandDNA.copy.services;

  return (
    <section id="services" className="relative overflow-hidden">
      {/* ── Soft mesh base — theme-blue radial pools over a pale wash.
             Declared before the content so every `relative` block below
             paints on top of it without needing z-index juggling. ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(52% 46% at 88% 14%, rgba(110,143,196,0.20) 0%, transparent 62%),' +
            'radial-gradient(46% 42% at 6% 8%, rgba(44,90,166,0.13) 0%, transparent 64%),' +
            'radial-gradient(54% 50% at 20% 98%, rgba(24,60,120,0.10) 0%, transparent 62%),' +
            'linear-gradient(170deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)',
        }}
      />

      {/* ── Architectural decoration: blueprint grid, diagonals, roof peak ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(24,60,120,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(24,60,120,0.04) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
            maskImage: 'radial-gradient(ellipse 68% 60% at 28% 55%, #000 8%, transparent 74%)',
            WebkitMaskImage: 'radial-gradient(ellipse 68% 60% at 28% 55%, #000 8%, transparent 74%)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(118deg, transparent 0 88px, rgba(24,60,120,0.035) 88px 89px)' }} />
        
        <div className="absolute -right-14 bottom-24 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.2)' }} />
      </div>

      <div className="site-container relative py-14 lg:py-20">
        {/* MOBILE reading order for this image-text section is eyebrow →
            heading → image → copy → CTA, so the head block, the photo and the
            body are three separate grid items with explicit `order`. From lg
            the orders are dropped and explicit row/column placement rebuilds
            the original two-column layout exactly: photo on the right spanning
            both rows, head above body on the left, zero row gap between them so
            desktop spacing is untouched. */}
        <div className="grid items-center gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:gap-x-14 lg:gap-y-0">
          {/* ════ Head — label + heading (LEFT column, row 1 on desktop) ════ */}
          <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
            <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
              {c.label}
            </p>

            <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
              {c.heading}
            </h2>

            <span className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
          </div>

          {/* ════ Body — intro, service grid, CTA (LEFT column, row 2) ════ */}
          <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-5">
            <p className="max-w-[62ch] text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>{c.body}</p>

            {/* 2-up from sm; the odd seventh tile spans the row so the grid
                closes cleanly. `h-full` keeps every tile the same height. */}
            <ul className="mt-7 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-3.5">
              {SERVICES.map((s, i) => (
                <ServiceCard
                  key={s.name}
                  service={s}
                  className={i === SERVICES.length - 1 && SERVICES.length % 2 === 1 ? 'sm:col-span-2' : ''}
                />
              ))}
            </ul>

            <a
              href="#get-free-quote"
              className="btn-gold mt-8 inline-flex items-center gap-2.5 px-6 py-3 text-[12.5px] uppercase tracking-[0.07em]"
              style={glassBtnTextStyle}
            >
              {brandDNA.copy.buttonText}
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* ════ Photo — RIGHT column on desktop, spanning both rows; between
                 heading and copy on mobile ════ */}
          <div className="relative order-2 mx-auto w-full max-w-[460px] lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mx-0 lg:max-w-none">
            <span
              aria-hidden
              className="absolute -right-3.5 -top-3.5 hidden h-20 w-20 rounded-tr-[24px] sm:block"
              style={{ borderTop: '2px solid rgb(var(--accent) / 0.32)', borderRight: '2px solid rgb(var(--accent) / 0.32)' }}
            />
            <span
              aria-hidden
              className="absolute -bottom-3.5 -left-3.5 hidden h-28 w-28 rounded-[24px] sm:block"
              style={{
                background: 'linear-gradient(150deg, rgb(var(--accent) / 0.22), rgb(var(--accent) / 0.04))',
                border: '1px solid rgba(255,255,255,0.5)',
              }}
            />

            <div
              className="relative overflow-hidden rounded-[24px] bg-white"
              style={{
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 2px 6px -1px rgba(16,40,79,0.06), 0 30px 58px -26px rgba(16,40,79,0.36)',
              }}
            >
              <img
                src={`/work/${projectFile}`}
                alt={`${brandDNA.company.name} crew completing a residential project`}
                className="block aspect-[16/11] w-full object-cover lg:aspect-[4/5]"
                style={{ objectPosition: '50% 40%' }}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.target.src = '/hero-image.webp'; }}
              />
              <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(200deg, rgba(24,60,120,0.10), transparent 45%)' }} />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4" style={{ background: 'linear-gradient(to top, rgba(11,20,42,0.35), transparent)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
