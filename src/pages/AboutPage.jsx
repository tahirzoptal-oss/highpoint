import { Link } from 'react-router-dom';
import Founder from '../components/Founder';
import TrustStrip from '../components/TrustStrip';
import CTABanner from '../components/CTABanner';
import Ticker from '../components/Ticker';
import CornerOverlay from '../components/CornerOverlay';
import QuoteForm from '../components/QuoteForm';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const stats = [
  { value: '2022', label: 'Founded' },
  { value: `${brandDNA.team.founder.yearsExp}`, label: 'Years Experience' },
  { value: `${brandDNA.reviews.rating.toFixed(1)}★`, label: brandDNA.reviews.googleLabel },
  { value: '100%', label: 'Owner-Operated Projects' },
];

const values = [
  {
    title: 'Integrity First',
    text: "We tell you the truth, even when it's not what you want to hear. If your roof can be repaired, we'll repair it. We never upsell work you don't need.",
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
      </svg>
    ),
  },
  {
    title: 'Expert Craftsmanship',
    text: 'We use manufacturer-preferred installation techniques and premium materials. Every project is handled by trained professionals, never subcontracted out.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Total Transparency',
    text: "From your first inspection to the final walkthrough, you know exactly what's happening and why. No hidden fees, no surprises on the final invoice.",
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Accountability',
    text: 'We stand behind our work with manufacturer-backed warranties and our direct phone number. If something is wrong, we fix it.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Community',
    text: 'We live and work in the same neighborhoods we serve. Our reputation is built on treating every homeowner like a neighbor, because you are one.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Education',
    text: 'We believe informed homeowners make the best decisions. That is why we walk you through every finding, every option, and every step of the process.',
    icon: (
      <svg className="w-6 h-6" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        path="/about"
        title={`About | ${brandDNA.company.name}`}
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])}
      />
      {/* Page Hero */}
      <section
        className="relative overflow-hidden flex flex-col justify-end bg-navy theme-keep-dark"
        style={{ minHeight: '52vh' }}
      >
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <img
            src="/hero-image.webp"
            alt={`${brandDNA.company.name} team`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%' }}
            onError={(e) => { e.target.src = '/work/project1.webp'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.88) 100%)' }} />
        </div>
        <div className="relative px-8 py-14 max-w-7xl mx-auto w-full" style={{ zIndex: 5 }}>
          <div className="flex items-center gap-2 text-cool text-xs font-semibold uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gold">›</span>
            <span className="text-white">About Us</span>
          </div>
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">{brandDNA.copy.founder.label}</p>
          <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl lg:text-6xl mb-4">
            OWNER-OPERATED.<br />ON EVERY JOB.
          </h1>
          <span className="line-gold block w-16 mb-4" />
          <p className="text-white text-sm max-w-xl leading-relaxed font-body" style={{ textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}>
            {brandDNA.company.description}
          </p>
        </div>
      </section>

      <TrustStrip />

      {/* Stats Strip. Uses .stats-card-value class so the metallic-silver
          number gradient (invisible on white) flips to solid navy in light
          mode. The class lives in index.css. */}
      <section className="py-10 bg-navy-slate" style={{ borderBottom: '1px solid rgba(100,116,139,0.2)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card-elevated-dark flex flex-col items-center text-center gap-2 p-5 bg-navy" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <div className="stats-card-value font-heading font-bold text-3xl leading-none">{s.value}</div>
                <div className="text-cool text-xs uppercase tracking-wide font-semibold leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative overflow-hidden bg-grid bg-navy">
        {/* Rule 58: per-client corner overlays. */}
        <CornerOverlay position="top-left" size={320} />
        <CornerOverlay position="bottom-right" size={320} />

        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          {/* Left: content */}
          <div className="relative px-8 lg:pl-16 lg:pr-8 py-16">
            <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">OUR STORY</p>
            <h2 className="font-heading font-bold text-white uppercase leading-none text-5xl mb-5">
              BUILT ON<br />TRUST &amp; CRAFT
            </h2>
            <span className="line-gold block w-12 mb-5" />
            <div className="flex flex-col gap-4 text-cool text-sm leading-relaxed max-w-lg">
              <p>
                {brandDNA.copy.founder.para1}
              </p>
              <p>
                {brandDNA.copy.founder.para2}
              </p>
              <p>
                That commitment has earned us a perfect {brandDNA.reviews.rating.toFixed(1)}-star rating on Google, satisfied homeowners across {brandDNA.company.serviceRegion}, and more referrals than we can count. We believe the best advertisement is work you're proud of.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/contact" className="btn-gold font-heading font-bold text-sm uppercase px-6 py-3 tracking-widest text-navy">
                {brandDNA.copy.buttonText}
              </Link>
              <Link to="/gallery" className="btn-outline font-heading font-bold text-sm uppercase px-6 py-3 tracking-wider">
                VIEW OUR WORK
              </Link>
            </div>
          </div>

          {/* Right: full-bleed image */}
          <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: 560 }}>
            <img
              src="/owner.webp"
              alt={`${brandDNA.team.founder.name}, Founder of ${brandDNA.company.name}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 15%' }}
              onError={(e) => { e.target.src = '/work/project2.webp'; }}
            />
            <div className="absolute inset-y-0 left-0 w-44" style={{ background: 'linear-gradient(to right, #0F172A, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 px-8 py-4" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, transparent 100%)' }}>
              <div className="font-heading font-bold text-white text-lg uppercase">{brandDNA.team.founder.displayName}</div>
              <div className="text-gold text-xs">{brandDNA.team.founder.title}</div>
            </div>
          </div>
        </div>

        {/* Mobile image */}
        <div className="lg:hidden relative h-64 overflow-hidden">
          <img
            src="/owner.webp"
            alt={`${brandDNA.team.founder.name}, Founder of ${brandDNA.company.name}`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 15%' }}
            onError={(e) => { e.target.src = '/work/project2.webp'; }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, #0F172A, transparent)' }} />
        </div>
      </section>

      {/* Founder / Vision + Mission */}
      <Founder />

      {/* Meet the Team — only renders when team_group_photo or team_members
          are populated. Avoids a lonely empty section for clients with no
          team imagery. */}
      {(brandDNA.team_group_photo || (brandDNA.team_members && brandDNA.team_members.length > 0)) && (
        <section className="relative py-20 overflow-hidden bg-grid bg-navy">
          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-10">
              <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">OUR CREW</p>
              <h2 className="font-heading font-bold text-white uppercase text-5xl leading-tight mb-3">
                MEET THE TEAM
              </h2>
              <span className="line-gold block w-12 mx-auto mt-3 mb-6" />
              <p className="text-cool text-sm max-w-xl mx-auto leading-relaxed">
                The {brandDNA.address.city || 'local'} crew that walks every roof, files every claim, and stands behind every warranty.
              </p>
            </div>
            {brandDNA.team_group_photo && (
              <div className="relative overflow-hidden mb-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}>
                <img
                  src={`/team/${brandDNA.team_group_photo}`}
                  alt={`The ${brandDNA.company.name} team`}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: 520 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-x-0 bottom-0 px-6 py-4" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95), transparent)' }}>
                  <p className="font-heading font-bold text-white text-lg uppercase tracking-wider">
                    Our {brandDNA.address.city || 'Local'} Crew
                  </p>
                </div>
              </div>
            )}
            {brandDNA.team_members && brandDNA.team_members.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brandDNA.team_members.map((m, i) => (
                  <div key={`${m.name || m.filename || i}`} className="card-elevated-dark p-4 bg-navy text-center" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                    {m.filename && (
                      <img
                        src={`/team/${m.filename}`}
                        alt={m.name || 'Team member'}
                        className="w-24 h-24 object-cover mx-auto mb-3"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    {m.name && (
                      <div className="font-heading font-bold text-white text-sm uppercase tracking-wide">{m.name}</div>
                    )}
                    {m.role && (
                      <div className="text-cool text-xs mt-1">{m.role}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Core Values */}
      <section className="relative py-20 bg-grid bg-navy-slate">
        {/* Rule 58: per-client corner overlays, clipped in an inner layer so the
            section stays overflow-visible and the sticky rail can pin. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CornerOverlay position="top-left" size={320} />
          <CornerOverlay position="bottom-right" size={320} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: the values content */}
            <div className="lg:col-span-2 text-center">
              <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">HOW WE OPERATE</p>
              <h2 className="font-heading font-bold text-white uppercase text-5xl leading-tight mb-3">
                THE VALUES WE WORK BY
              </h2>
              <span className="line-gold block w-12 mx-auto mt-3 mb-10" />
              <p className="text-cool text-sm mb-10 max-w-xl mx-auto leading-relaxed">
                These aren't marketing words. They are the standards {brandDNA.team.founder.name.split(' ')[0]} holds every project to, every single time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="card-elevated-dark flex flex-col items-center text-center py-8 px-6 gap-4 bg-navy"
                    style={{ border: '1px solid rgba(100,116,139,0.25)', borderTop: '2px solid rgb(var(--accent))' }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                      {v.icon}
                    </div>
                    <div className="font-heading font-bold text-white uppercase tracking-wider text-base">{v.title}</div>
                    <p className="text-cool text-xs leading-relaxed">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: sticky quote-form rail. Stacks below the values on mobile. */}
            <div>
              <div className="lg:sticky lg:top-24">
                <QuoteForm formId="about" title="Get Your Free Estimate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />
      <CTABanner />
    </>
  );
}
