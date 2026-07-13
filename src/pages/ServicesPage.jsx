import { Link } from 'react-router-dom';
import Services from '../components/Services';
import SpecialOffers from '../components/SpecialOffers';
import CTABanner from '../components/CTABanner';
import Ticker from '../components/Ticker';
import CornerOverlay from '../components/CornerOverlay';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const featured = [
  {
    slug: 'roof-replacement',
    title: 'Roof Replacement',
    subtitle: 'THE COMPLETE SOLUTION',
    body: 'When repair is no longer viable, a full roof replacement gives your home decades of renewed protection. We handle everything from tear-off and decking inspection to underlayment, shingles, flashing, and clean-up in as little as one day for most homes.',
    bullets: ['Full tear-off and disposal included', 'Manufacturer warranty on materials', 'Owner on-site from start to finish', 'Same-day completion on most homes'],
    img: '/work/project1.webp',
    imgAlt: 'Roof replacement project',
    imgRight: false,
  },
  {
    slug: 'storm-damage-restoration',
    title: 'Storm Damage Restoration',
    subtitle: 'BACK TO NORMAL, FAST',
    body: "Missouri weather is brutal. Hail, wind, and ice storms can leave your roof compromised without you even knowing it. We'll inspect your roof for free, document all damage with photos and reports, and work directly with your insurance company to get the claim handled right.",
    bullets: ['Free storm damage inspection', 'Insurance claim documentation', 'Direct communication with your adjuster', 'Repairs typically covered at no out-of-pocket cost'],
    img: '/work/project3.webp',
    imgAlt: 'Storm damage restoration',
    imgRight: true,
  },
  {
    slug: 'insurance-claims',
    title: 'Insurance Claims Assistance',
    subtitle: 'WE FIGHT FOR YOU',
    body: "Navigating an insurance claim alone is overwhelming. Our team has processed hundreds of claims and knows exactly what adjusters look for. We document every damaged shingle, fascia, gutter, and vent, and we stay in your corner through the entire process.",
    bullets: ['Detailed damage report provided', 'We attend the adjuster inspection', 'Supplemental claims handled', 'No upfront payment required'],
    img: '/work/project4.webp',
    imgAlt: 'Insurance claims assistance',
    imgRight: false,
  },
  {
    slug: 'emergency-roofing',
    title: 'Emergency Roofing',
    subtitle: '24/7 RAPID RESPONSE',
    body: "A hole in your roof can't wait until Monday. Our emergency team responds day or night to stop the damage in its tracks. We tarp, board, and secure your property immediately, then schedule the permanent repair at your convenience.",
    bullets: ['Available 24 hours, 7 days a week', 'Emergency tarping and boarding', 'Prevent interior water damage', 'Permanent repair scheduled immediately'],
    img: '/work/project5.webp',
    imgAlt: 'Emergency roofing service',
    imgRight: true,
  },
];

export default function ServicesPage() {
  return (
    <>
      <SEO
        path="/services"
        title={`Our Services | ${brandDNA.company.name}`}
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])}
      />
      {/* Page Hero */}
      <section className="relative overflow-hidden flex flex-col justify-end bg-navy theme-keep-dark" style={{ minHeight: '52vh' }}>
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <img
            src="/hero-image.webp"
            alt={`${brandDNA.company.name} Services`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
            onError={(e) => { e.target.src = '/work/project1.webp'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.88) 100%)' }} />
        </div>
        <div className="relative px-8 py-14 max-w-7xl mx-auto w-full" style={{ zIndex: 5 }}>
          <div className="flex items-center gap-2 text-cool text-xs font-semibold uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gold">›</span>
            <span className="text-white">Services</span>
          </div>
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">{brandDNA.copy.services.label}</p>
          <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl lg:text-6xl mb-4">
            {brandDNA.copy.services.heading}
          </h1>
          <span className="line-gold block w-16 mb-4" />
          <p className="text-white text-sm max-w-xl leading-relaxed font-body" style={{ textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}>
            {brandDNA.copy.services.body}
          </p>
        </div>
      </section>

      {/* Service Cards Grid */}
      <Services />

      {/* Featured Services. Alternating bg-navy / bg-navy-slate so the
          light-theme override flips both surfaces to white / off-white. The
          inline-style hardcoded backgrounds bypassed the class override and
          left this whole page navy in light mode. */}
      {featured.map((s, i) => (
        <section
          key={s.slug}
          className={`relative overflow-hidden ${i % 2 === 0 ? 'bg-navy' : 'bg-navy-slate'}`}
        >
          {/* Rule 58: per-client corner overlays. */}
          <CornerOverlay position={i % 2 === 0 ? 'bottom-right' : 'top-left'} size={320} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2">
            {/* Image left */}
            {!s.imgRight && (
              <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: 480 }}>
                <img
                  src={s.img}
                  alt={s.imgAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/work/project1.webp'; }}
                />
              </div>
            )}

            {/* Text */}
            <div className="px-8 lg:px-14 py-14 flex flex-col justify-center">
              <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">{s.subtitle}</p>
              <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-4">
                {s.title}
              </h2>
              <span className="line-gold block w-12 mb-5" />
              <p className="text-cool text-sm leading-relaxed mb-5 max-w-md">{s.body}</p>
              <ul className="flex flex-col gap-2 mb-6">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-cool">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.5)' }}>
                      <svg className="w-2.5 h-2.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/services/${s.slug}`}
                  className="btn-gold font-heading font-bold text-sm uppercase px-6 py-3 tracking-widest text-navy"
                >
                  LEARN MORE →
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline font-heading font-bold text-sm uppercase px-6 py-3 tracking-wider"
                >
                  {brandDNA.copy.buttonText}
                </Link>
              </div>
            </div>

            {/* Image right */}
            {s.imgRight && (
              <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: 480 }}>
                <img
                  src={s.img}
                  alt={s.imgAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/work/project1.webp'; }}
                />
              </div>
            )}

            {/* Mobile image */}
            <div className="lg:hidden relative h-56 overflow-hidden">
              <img
                src={s.img}
                alt={s.imgAlt}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/work/project1.webp'; }}
              />
            </div>
          </div>
        </section>
      ))}

      <Ticker />
      <SpecialOffers />
      <CTABanner />
    </>
  );
}
