import Ticker from './Ticker';
import { brandDNA } from '../config/brand-dna';

const serviceIcons = {
  'roof-repair': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  'roof-replacement': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  'new-roof-installation': (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
   terms first so "storm damage repair" doesn't collapse to plain "repair". */
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
    [/replace|install|new\s+roof/, 'new-roof-installation'],
    [/siding/, 'siding'],
    [/gutter/, 'gutters'],
    [/window/, 'windows'],
    [/metal/, 'metal-roofing'],
    [/repair|leak|patch/, 'roof-repair'],
    [/roof/, 'roof-replacement'],
  ];
  for (const [re, key] of rules) {
    if (re.test(haystack) && serviceIcons[key]) return serviceIcons[key];
  }
  return fallbackIcon;
}

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-navy">
      <Ticker />

      {/* Mobile image */}
      <div className="lg:hidden relative h-52 overflow-hidden">
        <img
          src={`/work/${(brandDNA.previous_projects && brandDNA.previous_projects[1] && brandDNA.previous_projects[1].filename) || (brandDNA.previous_projects && brandDNA.previous_projects[0] && brandDNA.previous_projects[0].filename) || 'project1.webp'}`}
          alt={`${brandDNA.company.name} crew completing a residential project`}
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          onError={(e) => { e.target.src = '/hero-image.webp'; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(to top, #F5F7FA, transparent)' }} />
      </div>

      {/* Desktop: image left | content right */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2">

        {/* Left: image with right-side fade (desktop only) */}
        <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: 580 }}>
          <img
            src={`/work/${(brandDNA.previous_projects && brandDNA.previous_projects[1] && brandDNA.previous_projects[1].filename) || (brandDNA.previous_projects && brandDNA.previous_projects[0] && brandDNA.previous_projects[0].filename) || 'project1.webp'}`}
            alt={`${brandDNA.company.name} crew completing a residential project`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
            onError={(e) => { e.target.src = '/hero-image.webp'; }}
          />
          {/* Right-edge fade */}
          <div className="absolute inset-y-0 right-0 w-44" style={{ background: 'linear-gradient(to right, transparent, #F5F7FA)' }} />
        </div>

        {/* Right: content */}
        <div className="px-8 pt-8 pb-4 flex flex-col justify-center">
          <div className="mb-4">
            <img src="/logo.webp" alt={brandDNA.company.name} className="w-44 h-auto" />
          </div>

          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            {brandDNA.copy.services.label}
          </p>
          <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-3">
            {brandDNA.copy.services.heading}
          </h2>
          <span className="line-gold block w-12 mb-5" />
          <p className="text-cool font-body text-sm mb-8 max-w-lg">
            {brandDNA.copy.services.body}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {brandDNA.services.map((s, idx) => (
              <div
                key={s.slug || s.name || idx}
                className="card-elevated-dark flex items-center gap-3 p-3 cursor-pointer transition-all group border-l-2 bg-navy-slate"
                style={{ border: '1px solid rgba(100,116,139,0.3)', borderLeft: '2px solid rgb(var(--accent))' }}
              >
                <div className="flex-shrink-0 flex items-center justify-center text-gold">
                  {pickServiceIcon(s)}
                </div>
                <span className="font-heading font-bold text-white text-xs uppercase leading-tight">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Ticker />
      </div>
    </section>
  );
}
