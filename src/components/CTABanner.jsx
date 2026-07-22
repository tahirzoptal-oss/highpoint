import BeltSlider from './BeltSlider';
import FadeOnEnter from './FadeOnEnter';
import { brandDNA } from '../config/brand-dna';
import { useLeadForm } from '../lib/leadForm';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Matches the header CTA exactly (Navbar's navCtaTextStyle). Paired with the
// global .btn-gold glass class so these buttons and the nav button are the
// same component visually — gradient, border, radius, shadow, hover, transition.
const glassBtnTextStyle = {
  color: 'rgb(var(--on-accent))',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
  fontFamily: INTER,
};

// The global `[data-theme-mode="light"] .form-input` rule in index.css sets
// background and border with !important, so inline styles cannot soften them.
// `.cta-field` is a companion rule in index.css that out-specifies it — it
// owns the #F8FAFC fill, the #D8DEE9 hairline, the 50px height, the placeholder
// contrast and the blue focus ring. Padding and radius stay here.
const FIELD_CLASS = 'cta-field form-input w-full rounded-[12px] px-4 text-[14.5px]';

// Existing site wording for the four trust points, pulled from brand-dna
// rather than authored here.
const TRUST_BADGES = [
  brandDNA.copy.trustClaims?.[3] || 'Licensed & Insured',
  brandDNA.copy.heroTrustChips?.[0] || 'Same-Day Repairs',
  brandDNA.copy.trustClaims?.[4] || 'Payment Plans Available',
  brandDNA.copy.trustClaims?.[2] || 'Owner-Operated',
];

const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M2.5 5.2c0-1 .8-1.8 1.8-1.8h2a1.8 1.8 0 0 1 1.8 1.5l.5 2.6a1.8 1.8 0 0 1-.9 1.9l-1.3.7a13.5 13.5 0 0 0 6 6l.7-1.3a1.8 1.8 0 0 1 1.9-.9l2.6.5a1.8 1.8 0 0 1 1.5 1.8v2c0 1-.8 1.8-1.8 1.8h-.9A15.7 15.7 0 0 1 2.5 6.1v-.9Z" />
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export default function CTABanner() {
  const { honeypotProps, onSubmit: handleSubmit } = useLeadForm('cta');
  const c = brandDNA.copy.cta;

  return (
    <section id="get-free-quote" className="relative scroll-mt-24 overflow-hidden">
      {/* ── Full-bleed roofing photo, heavily veiled ── */}
      <img
        src="/work/project2.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '50% 45%' }}
        loading="lazy"
        decoding="async"
        onError={(e) => { e.target.src = '/hero-image.webp'; }}
      />

      {/* ── Dark navy overlay + soft blue gradient + lighting ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(112deg, rgba(8,18,38,0.96) 0%, rgba(11,28,58,0.92) 46%, rgba(16,40,79,0.86) 100%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* subtle lighting from the upper left, behind the headline */}
        <div className="absolute -left-32 -top-24 h-[32rem] w-[32rem] rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.3)' }} />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.16)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: 'linear-gradient(to top, rgba(8,18,38,0.6), transparent)' }} />
      </div>

      <div className="site-container relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:gap-20">
          {/* ════ LEFT — headline, body, trust badges, CTA, phone ════ */}
          <FadeOnEnter>
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent-light))', fontFamily: INTER }}>
                <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent-light))' }} />
                {c.label}
              </p>

              <h2 className="section-h2 uppercase" style={{ color: '#FFFFFF', textShadow: '0 2px 18px rgba(8,18,38,0.5)' }}>
                {c.heading}
              </h2>

              <span className="mb-6 mt-5 block h-[3px] w-14 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))' }} />

              <p className="max-w-[52ch] text-[15px] leading-[1.75]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.78)' }}>
                {c.body}
              </p>

              {/* Trust badges — glass pills */}
              <ul className="mt-7 flex list-none flex-wrap gap-2.5 p-0">
                {TRUST_BADGES.map((badge) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 backdrop-blur-md"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
                  >
                    <CheckIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'rgb(var(--accent-light))' }} />
                    <span className="text-[11.5px] font-semibold uppercase leading-none tracking-[0.08em]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.9)' }}>
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href="#cta-fields"
                  className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em]"
                  style={glassBtnTextStyle}
                >
                  {brandDNA.copy.buttonText}
                  <span aria-hidden>→</span>
                </a>

                <a
                  href={`tel:${brandDNA.contact.phoneTelLink}`}
                  className="group inline-flex items-center gap-3 transition-colors duration-300 ease-out"
                >
                  <span
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300 ease-out group-hover:bg-[rgb(var(--accent))]"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#FFFFFF' }}
                  >
                    <PhoneIcon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[17px] font-bold leading-none transition-colors duration-300 ease-out" style={{ fontFamily: JOSEFIN, color: '#FFFFFF' }}>
                    {brandDNA.contact.phone}
                  </span>
                </a>
              </div>
            </div>
          </FadeOnEnter>

          {/* ════ RIGHT — solid white form panel floating over the photo.
                 Fields, names, validation and the submit handler are untouched. ════ */}
          <FadeOnEnter delay={140}>
            <div
              id="cta-fields"
              className="scroll-mt-24 rounded-[20px] bg-white p-5 sm:p-9 lg:p-10"
              style={{
                border: '1px solid #EAEAEA',
                boxShadow: '0 2px 8px -2px rgba(8,18,38,0.2), 0 32px 64px -24px rgba(8,18,38,0.6)',
              }}
            >
              <h3
                className="text-[21px] font-bold uppercase leading-tight sm:text-[24px]"
                style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))', letterSpacing: '-0.005em' }}
              >
                {brandDNA.copy.formHeader}
              </h3>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/55" style={{ fontFamily: INTER }}>
                {brandDNA.copy.formSubtext}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-3 md:gap-5 sm:grid-cols-2">
                {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
                <input {...honeypotProps} />
                <input name="name" className={FIELD_CLASS} placeholder="Your Name" style={{ fontFamily: INTER }} />
                <input name="phone" className={FIELD_CLASS} placeholder="Phone Number" type="tel" style={{ fontFamily: INTER }} />
                <input name="email" className={`${FIELD_CLASS} sm:col-span-2`} placeholder="Email Address" type="email" style={{ fontFamily: INTER }} />
                <select name="service" defaultValue="" className={`${FIELD_CLASS} sm:col-span-2`} style={{ fontFamily: INTER }}>
                  <option value="">How Can We Help?</option>
                  {brandDNA.services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
                <div className="sm:col-span-2 sm:mt-1">
                  <button
                    type="submit"
                    className="btn-gold w-full px-6 py-[18px] text-[14px] uppercase tracking-[0.08em]"
                    style={glassBtnTextStyle}
                  >
                    {brandDNA.copy.buttonText} →
                  </button>
                </div>
              </form>
            </div>
          </FadeOnEnter>
        </div>
      </div>
    </section>
  );
}
