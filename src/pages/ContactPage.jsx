import { Link } from 'react-router-dom';
import CTABanner from '../components/CTABanner';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';
import { useLeadForm } from '../lib/leadForm';

const glassInput = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'white',
};

export default function ContactPage() {
  const { honeypotProps, onSubmit: handleSubmit } = useLeadForm('contact');

  // hours.display is empty in brand-dna, so derive readable rows from the
  // structured weekday hours in 12-hour format. Prefer display if it is ever
  // populated.
  const to12h = (t) => {
    const [h, m] = String(t).split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  };
  const wk = brandDNA.hours.weekday;
  const sat = brandDNA.hours.saturday;
  const derivedHours = [
    { label: 'Monday - Friday', value: wk ? `${to12h(wk.opens)} - ${to12h(wk.closes)}` : 'Closed' },
    { label: 'Saturday', value: sat ? `${to12h(sat.opens)} - ${to12h(sat.closes)}` : 'Closed' },
    { label: 'Sunday', value: 'Closed' },
  ];
  const hoursRows = (brandDNA.hours.display && brandDNA.hours.display.length)
    ? brandDNA.hours.display
    : derivedHours;

  // Truthful, brand-grounded FAQ (free inspections, response time, insurance).
  const contactFaqs = [
    { q: 'Do you charge for inspections?', a: 'No. Inspections and written estimates are free, with no obligation and no pressure to say yes.' },
    { q: 'How fast will I hear back?', a: 'We call you back in 5 minutes during business hours, and the same business day otherwise.' },
    { q: 'Do you handle insurance claims?', a: 'Yes. For covered storm and wind damage, we document everything for your adjuster and work the claim with you.' },
  ];

  return (
    <>
      <SEO
        path="/contact"
        title={`Contact | ${brandDNA.company.name}`}
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])}
      />
      {/* Page Hero */}
      <section
        className="relative overflow-hidden flex flex-col justify-end bg-navy theme-keep-dark"
        style={{ minHeight: '38vh' }}
      >
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <img
            src="/hero-image.webp"
            alt={`Contact ${brandDNA.company.name}`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 60%' }}
            onError={(e) => { e.target.src = '/work/project1.webp'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.88) 100%)' }} />
        </div>
        <div className="relative px-8 py-12 max-w-7xl mx-auto w-full" style={{ zIndex: 5 }}>
          <div className="flex items-center gap-2 text-cool text-xs font-semibold uppercase tracking-widest mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gold">›</span>
            <span className="text-white">Contact</span>
          </div>
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">GET IN TOUCH</p>
          <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl lg:text-6xl mb-3">
            {brandDNA.pages.contact.heading}
          </h1>
          <span className="line-gold block w-16 mb-4" />
          <p className="text-white text-sm max-w-lg font-body" style={{ textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}>
            {brandDNA.pages.contact.intro}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative py-16 bg-grid bg-navy">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: full form */}
          <div className="lg:col-span-2">
            <h2 className="font-heading font-bold text-white uppercase text-3xl leading-tight mb-2">
              {brandDNA.pages.contact.formHeading}
            </h2>
            <p className="text-cool text-sm mb-6">
              {brandDNA.pages.contact.formIntro}
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
              <input {...honeypotProps} />
              <div>
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">Full Name *</label>
                <input name="name" required className="form-input w-full px-4 py-3 text-sm placeholder-white/40" style={glassInput} placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">Phone Number *</label>
                <input name="phone" required className="form-input w-full px-4 py-3 text-sm placeholder-white/40" style={glassInput} placeholder="(509) 000-0000" type="tel" />
              </div>
              <div>
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">Email Address *</label>
                <input name="email" required className="form-input w-full px-4 py-3 text-sm placeholder-white/40" style={glassInput} placeholder="john@example.com" type="email" />
              </div>
              <div>
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">Property Address</label>
                <input name="address" className="form-input w-full px-4 py-3 text-sm placeholder-white/40" style={glassInput} placeholder={`123 Main St, ${brandDNA.address.city}, ${brandDNA.address.state}`} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">How Can We Help? *</label>
                <select name="service" defaultValue="" className="form-input w-full px-4 py-3 text-sm" style={{ ...glassInput, color: 'rgba(255,255,255,0.75)' }}>
                  <option value="" style={{ background: '#1E293B', color: 'white' }}>Select a service...</option>
                  {brandDNA.services.map((s) => (
                    <option key={s.slug} value={s.slug} style={{ background: '#1E293B', color: 'white' }}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-cool uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  name="message"
                  className="form-input w-full px-4 py-3 text-sm placeholder-white/40 resize-none"
                  style={glassInput}
                  rows={5}
                  placeholder="Tell us about your project, current issues, or any questions you have..."
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="btn-gold w-full font-heading font-bold text-lg uppercase tracking-widest py-3.5 text-navy"
                >
                  {brandDNA.copy.submitButton} →
                </button>
                <p className="text-center text-white/35 text-xs mt-2">No spam. No obligation. We call you back in 5 minutes.</p>
              </div>
            </form>
          </div>

          {/* Right: contact info */}
          <div className="flex flex-col gap-5">
            {/* Contact card */}
            <div className="p-6 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
              <h3 className="font-heading font-bold text-white uppercase text-lg mb-4">{brandDNA.pages.contact.contactHeading}</h3>
              <div className="flex flex-col gap-4">
                <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                    <svg className="w-4 h-4" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-steel uppercase tracking-wider">Phone</div>
                    <div className="font-heading font-bold text-white group-hover:text-gold transition-colors">{brandDNA.contact.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${brandDNA.contact.email}`} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                    <svg className="w-4 h-4" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-steel uppercase tracking-wider">Email</div>
                    <div className="font-heading font-bold text-white text-sm group-hover:text-gold transition-colors">{brandDNA.contact.email}</div>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                    <svg className="w-4 h-4" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-steel uppercase tracking-wider">Address</div>
                    <div className="font-heading font-bold text-white text-sm leading-snug">{brandDNA.address.street}<br />{brandDNA.address.city}, {brandDNA.address.state} {brandDNA.address.zip}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
              <h3 className="font-heading font-bold text-white uppercase text-lg mb-4">BUSINESS HOURS</h3>
              <div className="flex flex-col gap-2">
                {hoursRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm pb-2 last:pb-0" style={{ borderBottom: '1px solid rgba(100,116,139,0.15)' }}>
                    <span className="font-semibold text-cool text-xs">{row.label}</span>
                    <span className="text-gold font-bold text-xs">{row.value}</span>
                  </div>
                ))}
              </div>
              {brandDNA.hours.emergencyBadge && (
                <div className="mt-4 flex items-center gap-2 py-2 px-3" style={{ background: 'rgb(var(--accent) / 0.08)', border: '1px solid rgb(var(--accent) / 0.15)' }}>
                  <div className="w-2 h-2 bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="text-xs font-bold text-gold">{brandDNA.hours.emergencyBadge}</span>
                </div>
              )}
            </div>

            {/* Service area */}
            <div className="p-5 text-center" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', border: '1px solid rgb(var(--accent) / 0.2)' }}>
              <div className="font-heading font-bold text-white uppercase text-sm mb-1">{brandDNA.copy.serviceAreaCard.heading}</div>
              <div className="text-cool text-xs mb-3">{brandDNA.copy.serviceAreaCard.body}</div>
              <Link
                to="/service-areas"
                className="btn-outline inline-block text-xs font-bold uppercase tracking-wider px-4 py-2"
              >
                View Our Service Area →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-14 bg-navy">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-heading font-bold text-white uppercase text-2xl mb-6">COMMON QUESTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactFaqs.map((f) => (
              <div key={f.q} className="p-6 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <h3 className="font-heading font-bold text-white text-sm uppercase mb-2">{f.q}</h3>
                <p className="text-cool text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-8">
          <div className="overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.45)', height: 360, border: '1px solid rgba(100,116,139,0.25)' }}>
            <iframe
              title={`${brandDNA.company.name} Location`}
              src={brandDNA.contact.mapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
