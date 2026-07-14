import { Link } from 'react-router-dom';
import CTABanner from '../components/CTABanner';
import Ticker from '../components/Ticker';
import CornerOverlay from '../components/CornerOverlay';
import QuoteForm from '../components/QuoteForm';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

// Cities served. brandDNA.serviceAreas is a flat array of uppercase strings
// populated by Stage 10.1 from research / strategy data. We render them under
// a single heading and let the responsive grid handle visual hierarchy. No
// fake region grouping (the schema doesn't carry region metadata).
const cities = brandDNA.serviceAreas || [];

const founder = (brandDNA.team && brandDNA.team.founder) || null;
const founderLabel = founder ? (founder.displayName || founder.name) : null;

const coverageHighlights = [
  {
    title: 'Same-Day Response',
    text: 'We schedule inspections within 24 to 48 hours across our entire service area. Emergency calls get a same-day response.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'No Travel Fees',
    text: 'Inspections, estimates, and site visits anywhere in our service area are free. No surprise charges for driving to you.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Owner Makes Every Visit',
    text: founderLabel
      ? `${founderLabel} personally attends every inspection and project walkthrough, not a subcontractor or third-party rep.`
      : 'The owner personally attends every inspection and project walkthrough, not a subcontractor or third-party rep.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <SEO
        path="/service-areas"
        title={`Service Areas | ${brandDNA.company.name}`}
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/service-areas' }])}
      />
      {/* Page Hero */}
      <section className="relative overflow-hidden flex flex-col justify-end bg-navy theme-keep-dark" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <img
            src="/hero-image.webp"
            alt={`${brandDNA.address.city} service area`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.88) 100%)' }} />
        </div>
        <div className="relative px-8 py-14 max-w-7xl mx-auto w-full" style={{ zIndex: 5 }}>
          <div className="flex items-center gap-2 text-cool text-xs font-semibold uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gold">›</span>
            <span className="text-white">Service Areas</span>
          </div>
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">{brandDNA.copy.serviceAreas.label}</p>
          <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl lg:text-6xl mb-4">
            {brandDNA.copy.serviceAreas.heading}
          </h1>
          <span className="line-gold block w-16 mb-4" />
          <p className="text-white text-sm max-w-xl leading-relaxed font-body" style={{ textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}>
            {brandDNA.copy.serviceAreas.body}
          </p>
        </div>
      </section>

      {/* Coverage Highlights */}
      <section className="py-12 bg-navy-slate" style={{ borderBottom: '1px solid rgba(100,116,139,0.2)' }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {coverageHighlights.map((h) => (
              <div key={h.title} className="card-elevated-dark flex flex-col items-center text-center gap-3 p-6 bg-navy" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                  {h.icon}
                </div>
                <div className="font-heading font-bold text-white uppercase text-base">{h.title}</div>
                <p className="text-cool text-xs leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Areas */}
      <section className="relative py-16 bg-grid bg-navy">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: content + map */}
            <div className="lg:col-span-2">
              <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">OUR SERVICE AREA</p>
              <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-4">
                WHERE WE WORK
              </h2>
              <span className="line-gold block w-12 mb-5" />
              <p className="text-cool text-sm mb-4 leading-relaxed max-w-2xl">
                We serve homeowners across the Tri-Cities and the nearby towns of Eastern Washington. Not sure if you're covered? Just call and we'll let you know.
              </p>
              <p className="text-cool text-sm mb-8 leading-relaxed max-w-2xl">
                High Point is a local contractor, not a storm-chasing crew that rolls into town after a big wind and disappears before winter. {founderLabel || 'The owner'} lives and works here, so you get a real name, a real number, and a reputation to protect on every job.
              </p>

              {/* Cities we serve, single grouped grid */}
              <div className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 flex-shrink-0 bg-gold" />
                Cities We Serve
              </div>
              {cities.length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                  {cities.map((city) => {
                    const citySlug = String(city).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    const hasPage = (brandDNA.location_pages || []).some((p) => p.slug === citySlug);
                    const inner = (
                      <>
                        <svg className="w-3 h-3 flex-shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {city}
                      </>
                    );
                    return (
                      <li key={city} className="flex items-center gap-2 text-cool text-xs">
                        {hasPage ? (
                          <Link to={`/service-areas/${citySlug}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                            {inner}
                          </Link>
                        ) : inner}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-cool text-xs">
                  Call us to confirm if you're in our service area.
                </p>
              )}

              <div className="mt-8 p-4" style={{ background: 'rgb(var(--accent) / 0.08)', border: '1px solid rgb(var(--accent) / 0.2)' }}>
                <p className="text-xs text-cool font-semibold leading-relaxed">
                  Don't see your city? Call us at{' '}
                  <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="text-gold hover:text-white transition-colors">{brandDNA.contact.phone}</a>{' '}
                  and we'll confirm if you're in our service area.
                </p>
              </div>

              {/* Map */}
              <div className="overflow-hidden mt-10" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.45)', height: 420, border: '1px solid rgba(100,116,139,0.25)' }}>
                <iframe
                  title={`${brandDNA.company.name} Service Area`}
                  src={brandDNA.contact.mapsEmbedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: sticky quote form */}
            <div>
              <div className="lg:sticky lg:top-24">
                <QuoteForm formId="areas" title="Get Your Free Estimate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* Ready to Start */}
      <section className="relative overflow-hidden py-16 bg-grid bg-navy-slate">
        {/* Rule 58: per-client corner overlays. */}
        <CornerOverlay position="top-left" size={320} />
        <CornerOverlay position="bottom-right" size={320} />
        <div className="relative max-w-3xl mx-auto px-8 text-center">
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">READY TO START</p>
          <h2 className="font-heading font-bold text-white uppercase text-5xl leading-tight mb-4">
            IN YOUR AREA.<br />READY TO HELP.
          </h2>
          <span className="line-gold block w-12 mx-auto mb-5" />
          <p className="text-cool text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Request your free inspection today. We'll be at your property within 24 to 48 hours, give you an honest assessment, and tell you exactly what your roof needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold font-heading font-bold text-base uppercase px-8 py-3.5 tracking-widest text-navy">
              {brandDNA.copy.buttonText}
            </Link>
            <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="btn-outline font-heading font-bold text-base uppercase px-8 py-3.5 tracking-wider">
              CALL {brandDNA.contact.phone}
            </a>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
