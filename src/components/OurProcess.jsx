import { brandDNA } from '../config/brand-dna';

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

// ── Outline icons (24px, 1.5 stroke — the site's icon idiom) ──
const Ic = ({ children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const PhoneIcon = (p) => <Ic {...p}><path d="M2.5 5.2c0-1 .8-1.8 1.8-1.8h2a1.8 1.8 0 0 1 1.8 1.5l.5 2.6a1.8 1.8 0 0 1-.9 1.9l-1.3.7a13.5 13.5 0 0 0 6 6l.7-1.3a1.8 1.8 0 0 1 1.9-.9l2.6.5a1.8 1.8 0 0 1 1.5 1.8v2c0 1-.8 1.8-1.8 1.8h-.9A15.7 15.7 0 0 1 2.5 6.1v-.9Z" /></Ic>;
const SearchHomeIcon = (p) => <Ic {...p}><path d="M3 10.6 11 4l8 6.6" /><path d="M5.2 9v9.4c0 .6.5 1.1 1.1 1.1h4" /><circle cx="16.2" cy="16.2" r="3.3" /><path d="m18.7 18.7 2.6 2.6" /></Ic>;
const DocIcon = (p) => <Ic {...p}><path d="M6 2.4h9l4.5 4.5v13.6a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V3.9A1.5 1.5 0 0 1 6 2.4Z" /><path d="M15 2.4v4.5h4.5" /><path d="M8.3 11.4h7.4M8.3 14.9h7.4M8.3 18.4h4.4" /></Ic>;
const LayersIcon = (p) => <Ic {...p}><path d="m3.75 8.25 8.25-4.5 8.25 4.5-8.25 4.5-8.25-4.5Z" /><path d="m3.75 12 8.25 4.5 8.25-4.5" /><path d="m3.75 15.75 8.25 4.5 8.25-4.5" /></Ic>;
const CheckCircleIcon = (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="m8.4 12.2 2.5 2.5 4.7-5.6" /></Ic>;

/* Pair an icon to each step by keyword, so the mapping survives a brand-dna
   refresh that reorders or rewords `process_steps`. Falls back to a check. */
function pickStepIcon(step) {
  const t = `${step.title || ''} ${step.body || ''}`.toLowerCase();
  if (/reach out|call|contact|form|phone|get in touch/.test(t)) return PhoneIcon;
  if (/inspect|look|assess|climb|survey/.test(t)) return SearchHomeIcon;
  if (/price|estimate|quote|written|proposal/.test(t)) return DocIcon;
  if (/do it|build|install|material|system|work|crew/.test(t)) return LayersIcon;
  return CheckCircleIcon;
}

// Circle centre measured from the top of the timeline row — the connector
// rules key off this so they thread every icon without measuring anything.
const CIRCLE = 72;
const CIRCLE_MID = CIRCLE / 2;

/**
 * Timeline step — no card. Just the glass icon circle, a compact number, the
 * title and the description, centred in a column of whitespace. The circle is
 * opaque so the connector line passes cleanly behind it.
 */
function Step({ step, icon, index }) {
  // Resolved by the caller and passed in — `react-hooks/static-components`
  // rejects deriving a component inside a component body.
  const Icon = icon;
  const num = String(step.n ?? index + 1).padStart(2, '0');

  return (
    <li className="group relative flex flex-col items-center text-center">
      {/* Glass icon circle — the site's global medallion treatment: blue
          gradient body, thin light rim, inner top highlight, inner bottom
          shadow for curvature, glossy cap and a soft accent shadow. */}
      <span
        className="relative flex flex-shrink-0 items-center justify-center rounded-full transition-transform duration-[280ms] ease-out group-hover:-translate-y-1"
        style={{
          width: CIRCLE,
          height: CIRCLE,
          background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
          border: '1px solid rgba(255,255,255,0.65)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -12px 20px -12px rgba(16,40,79,0.55), 0 12px 26px -10px rgb(var(--accent) / 0.55), 0 0 0 7px rgba(255,255,255,0.85)',
          color: 'rgb(var(--on-accent))',
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[5px] -top-[1px] h-[46%] rounded-full opacity-80 transition-opacity duration-[280ms] ease-out group-hover:opacity-100"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.55), transparent)' }}
        />
        <Icon className="relative h-7 w-7" />
      </span>

      {/* Compact step number */}
      <span
        className="mt-5 block text-[20px] font-bold leading-none"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))', letterSpacing: '0.06em' }}
      >
        {num}
      </span>

      <span aria-hidden className="mb-4 mt-3 block h-px w-8" style={{ background: 'rgb(var(--accent) / 0.45)' }} />

      <h3
        className="text-[14px] font-bold uppercase leading-[1.35] tracking-[0.05em]"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
      >
        {step.title}
      </h3>

      <p className="mx-auto mt-3 max-w-[27ch] text-[13.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>
        {step.body}
      </p>
    </li>
  );
}

export default function OurProcess() {
  const c = brandDNA.copy.process;
  const steps = brandDNA.process_steps || [];

  if (steps.length === 0) return null;

  // First and last circle centres sit half a column in from each edge, so an
  // inset of 100/(2*steps) % lands the connector exactly between them.
  const inset = `${100 / (steps.length * 2)}%`;

  return (
    <section id="process" className="relative overflow-hidden py-16 lg:py-24">
      {/* ── Soft mesh base — theme-blue radial pools over a pale wash ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 44% at 12% 12%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
            'radial-gradient(44% 40% at 90% 14%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
            'linear-gradient(170deg, #FFFFFF 0%, #F7FAFD 54%, #EDF3FA 100%)',
        }}
      />

      {/* ── Very light architectural decoration — the timeline stays the focus ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(24,60,120,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(24,60,120,0.035) 1px, transparent 1px)',
            backgroundSize: '58px 58px',
            maskImage: 'radial-gradient(ellipse 70% 58% at 50% 48%, #000 6%, transparent 74%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 58% at 50% 48%, #000 6%, transparent 74%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.28), transparent)' }} />
      </div>

      <div className="site-container relative">
        {/* ── Centred header ── */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
            <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
            {c.label}
          </p>

          <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
            {c.heading}
          </h2>

          <span className="mx-auto mb-5 mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

          <p className="mx-auto max-w-[62ch] text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>{c.body}</p>
        </div>

        {/* ── Horizontal timeline ──
            The connector sits at the circle's vertical centre and is inset to
            the first and last circle centres, so it starts and ends on the
            icons rather than running off into the margins. It renders before
            the list, so the opaque circles sit over it. */}
        <div className="relative mt-14 lg:mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute hidden h-px lg:block"
            style={{
              top: CIRCLE_MID,
              left: inset,
              right: inset,
              background: 'linear-gradient(90deg, rgb(var(--accent) / 0.14), rgb(var(--accent) / 0.42) 18%, rgb(var(--accent) / 0.42) 82%, rgb(var(--accent) / 0.14))',
            }}
          />
          {/* Mobile: the same rule turned vertical, down the circle centres. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2 sm:hidden"
            style={{
              top: CIRCLE_MID,
              bottom: CIRCLE_MID,
              background: 'linear-gradient(180deg, rgb(var(--accent) / 0.14), rgb(var(--accent) / 0.38) 12%, rgb(var(--accent) / 0.38) 88%, rgb(var(--accent) / 0.14))',
            }}
          />

          <ul className="relative m-0 grid list-none grid-cols-1 gap-y-12 p-0 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-5 lg:gap-x-5">
            {steps.map((step, i) => (
              <Step key={step.n ?? i} step={step} icon={pickStepIcon(step)} index={i} />
            ))}
          </ul>
        </div>

        {/* Reassurance line + CTA — existing brand-dna copy */}
        <div className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="text-[13px] italic text-ink/60" style={{ fontFamily: INTER }}>{c.badgeSubtext}</p>
          <a
            href="#get-free-quote"
            className="btn-gold inline-flex items-center gap-2.5 px-6 py-3 text-[12.5px] uppercase tracking-[0.07em]"
            style={glassBtnTextStyle}
          >
            {brandDNA.copy.buttonText}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
