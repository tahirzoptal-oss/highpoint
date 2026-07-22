import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import SEO from '../components/SEO';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// The site's premium dark surface — the same one the homepage Service Area
// band and the service-page closing band use.
const DARK_BASE =
  'radial-gradient(52% 46% at 10% 8%, rgba(44,90,166,0.34) 0%, transparent 62%),' +
  'radial-gradient(46% 42% at 92% 16%, rgba(110,143,196,0.20) 0%, transparent 64%),' +
  'radial-gradient(58% 50% at 45% 104%, rgba(44,90,166,0.22) 0%, transparent 62%),' +
  'linear-gradient(168deg, #0B1C3A 0%, #10284F 52%, #0A1730 100%)';

const glassBtnTextStyle = {
  fontFamily: JOSEFIN,
  fontWeight: 700,
  color: '#FFFFFF',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
};

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden py-20 lg:py-28">
      <SEO path="/thank-you" title={`Thank You | ${brandDNA.company.name}`} noindex />

      <div aria-hidden className="absolute inset-0" style={{ background: DARK_BASE }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.24)' }} />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.14)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }} />
      </div>

      <div className="site-container relative">
        <div className="mx-auto max-w-[720px] text-center">

          {/* Success medallion — the site's global glass icon container, scaled
              up and ringed so it reads as a confirmation mark. */}
          <span className="relative mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
              border: '1px solid rgba(255,255,255,0.65)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -14px 24px -14px rgba(16,40,79,0.55), 0 16px 34px -12px rgb(var(--accent) / 0.6), 0 0 0 10px rgba(255,255,255,0.07)',
              color: 'rgb(var(--on-accent))',
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[6px] -top-px h-[46%] rounded-full opacity-80"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.55), transparent)' }}
            />
            <svg viewBox="0 0 24 24" className="relative h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7" />
            </svg>
          </span>

          <p
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'rgb(var(--accent-light))', fontFamily: INTER }}
          >
            <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent-light))' }} />
            MESSAGE RECEIVED
          </p>

          <h1
            className="mt-3 uppercase"
            style={{
              fontFamily: JOSEFIN,
              fontWeight: 700,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              textShadow: '0 2px 20px rgba(8,18,38,0.55)',
            }}
          >
            THANKS FOR TRUSTING US
          </h1>

          <span className="mx-auto mb-6 mt-6 block h-[3px] w-14 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))' }} />

          <p className="mx-auto max-w-[52ch] text-[16px] leading-[1.75]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.82)' }}>
            Your request is in. We will call you back within 5 minutes during business hours.
          </p>
          <p className="mx-auto mt-3 max-w-[52ch] text-[14.5px] leading-[1.75]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.55)' }}>
            Need to reach us sooner? Call us directly at{' '}
            <a
              href={`tel:${brandDNA.contact.phoneTelLink}`}
              className="font-bold transition-colors duration-300 hover:text-white"
              style={{ color: 'rgb(var(--accent-light))' }}
            >
              {brandDNA.contact.phone}
            </a>
            .
          </p>

          {/* Actions — one primary glass button, two ghosts. Wraps to a single
              column on narrow screens, each button full width. */}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/"
              className="btn-gold inline-flex items-center justify-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em]"
              style={glassBtnTextStyle}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
