import { Link } from 'react-router-dom';
import SpecialOffers from '../components/SpecialOffers';
import CTABanner from '../components/CTABanner';
import Ticker from '../components/Ticker';
import CornerOverlay from '../components/CornerOverlay';
import QuoteForm from '../components/QuoteForm';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

// Strip internal research annotations from a service description so only the
// customer-facing copy renders (some description_short values carry sourcing
// notes like "Evidenced by ..." that never belong on a live page).
function cleanDescription(text) {
  if (!text) return '';
  let out = text;
  for (const marker of [' Evidenced by', ' Not shown', ' Sourced from']) {
    const i = out.indexOf(marker);
    if (i !== -1) out = out.slice(0, i);
  }
  return out.trim();
}

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

      {/* Detailed services listing + sticky quote rail. Driven entirely from
          brandDNA.services so it can never carry another client's data. */}
      <section className="relative bg-navy">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CornerOverlay position="bottom-right" size={340} />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: service detail cards + how we work */}
            <div className="lg:col-span-2">
              <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">Our Services</p>
              <h2 className="font-heading font-bold text-white uppercase text-3xl lg:text-4xl leading-tight mb-4">
                A Closer Look At Each Service
              </h2>
              <span className="line-gold block w-12 mb-8" />

              <div className="flex flex-col gap-5">
                {brandDNA.services.map((s) => (
                  <div
                    key={s.slug || s.name}
                    className="card-elevated-dark bg-navy-slate p-6 lg:p-7"
                    style={{ border: '1px solid rgba(100,116,139,0.3)', borderLeft: '3px solid rgb(var(--accent))' }}
                  >
                    <h3 className="font-heading font-bold text-white uppercase text-2xl leading-tight mb-3">{s.name}</h3>
                    <span className="line-gold block w-10 mb-4" />
                    <p className="text-cool text-sm leading-relaxed mb-5">{cleanDescription(s.description_short)}</p>
                    <Link
                      to={`/services/${s.slug}`}
                      className="inline-flex items-center gap-2 text-gold font-heading font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Learn More <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* How We Work */}
              <div className="mt-14">
                <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">{brandDNA.copy.process.label}</p>
                <h2 className="font-heading font-bold text-white uppercase text-3xl lg:text-4xl leading-tight mb-4">
                  {brandDNA.copy.process.heading}
                </h2>
                <span className="line-gold block w-12 mb-6" />
                <p className="text-cool text-sm leading-relaxed mb-8 max-w-xl">{brandDNA.copy.process.body}</p>

                <div className="flex flex-col gap-6">
                  {brandDNA.process_steps.map((step) => (
                    <div key={step.n} className="flex gap-4">
                      <div
                        className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-navy-slate text-gold font-heading font-bold text-lg"
                        style={{ border: '1px solid rgba(238,182,68,0.4)' }}
                      >
                        {step.n}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-white uppercase text-lg leading-tight mb-1">{step.title}</h4>
                        <p className="text-cool text-sm leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky quote form */}
            <div>
              <div className="lg:sticky lg:top-24">
                <QuoteForm formId="services" title="Get Your Free Estimate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />
      <SpecialOffers />
      <CTABanner />
    </>
  );
}
