import BackgroundPattern from './BackgroundPattern';
import { brandDNA } from '../config/brand-dna';
import CornerOverlay from './CornerOverlay';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// ── Outline icons (24px, 1.5 stroke — the site's icon idiom) ──
const Ic = ({ children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const DocIcon = (p) => <Ic {...p}><path d="M6 2.25h9l4.5 4.5v13.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V3.75A1.5 1.5 0 0 1 6 2.25Z" /><path d="M15 2.25v4.5h4.5" /><path d="M8.25 11.25h7.5M8.25 14.75h7.5M8.25 18.25h4.5" /></Ic>;
const UserIcon = (p) => <Ic {...p}><path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /><path d="M4.5 20.1a7.5 7.5 0 0 1 15 0A17.9 17.9 0 0 1 12 21.75c-2.7 0-5.2-.6-7.5-1.65Z" /></Ic>;
const LayersIcon = (p) => <Ic {...p}><path d="m3.75 8.25 8.25-4.5 8.25 4.5-8.25 4.5-8.25-4.5Z" /><path d="m3.75 12 8.25 4.5 8.25-4.5" /><path d="m3.75 15.75 8.25 4.5 8.25-4.5" /></Ic>;
const CardIcon = (p) => <Ic {...p}><rect x="2.4" y="4.5" width="19.2" height="15" rx="2.25" /><path d="M2.4 9.4h19.2" /><path d="M5.6 14.6h6" /><path d="M5.6 16.9h3" /></Ic>;
const HouseIcon = (p) => <Ic {...p}><path d="M2.6 12 12 3.2 21.4 12" /><path d="M4.9 9.9v9.8c0 .6.5 1.1 1.1 1.1h3.6v-4.5c0-.6.5-1.1 1.1-1.1h2.6c.6 0 1.1.5 1.1 1.1v4.5H18c.6 0 1.1-.5 1.1-1.1V9.9" /></Ic>;
const StarIcon = (p) => <Ic {...p}><path d="M11.5 3.5a.56.56 0 0 1 1 0l2.13 5.11c.08.2.27.33.48.35l5.51.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61l-4.72-2.88a.56.56 0 0 0-.59 0L7 20.54a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.55l-4.2-3.6a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35L11.5 3.5Z" /></Ic>;
const ShieldCheckIcon = (p) => <Ic {...p}><path d="M12 2.7C9.9 4.7 7 6 3.8 6c-.4 1.2-.6 2.4-.6 3.7 0 5.6 3.8 10.3 8.8 11.6 5.2-1.3 8.8-6 8.8-11.6 0-1.3-.2-2.5-.6-3.7C17 6 14.1 4.7 12 2.7Z" /><path d="m9 12.2 2.2 2.2 3.8-5" /></Ic>;

/* Pick an icon by keyword from the reason title, so the pairing survives a
   brand-dna refresh that reorders or rewords `why_choose_us`. Specific terms
   come first (e.g. "written estimate" before the generic house/roof rules). */
function pickReasonIcon(title) {
  const t = String(title || '').toLowerCase();
  if (/estimate|written|price you pay|quote|no surprise/.test(t)) return DocIcon;
  if (/owner|himself|herself|in person/.test(t)) return UserIcon;
  if (/material|premium|quality|shingle/.test(t)) return LayersIcon;
  if (/payment|plan|budget|financ|afford/.test(t)) return CardIcon;
  if (/whole house|one contractor|contractor|home|house/.test(t)) return HouseIcon;
  if (/star|rating|fast|turnaround|review/.test(t)) return StarIcon;
  return ShieldCheckIcon;
}

/**
 * Reason card — icon-first and centre-aligned: large glass medallion on top,
 * heading beneath. `why_choose_us` carries titles only (there is no per-reason
 * body copy anywhere in brand-dna), so the card is deliberately title-led
 * rather than inventing a description.
 *
 * The shadow is STATIC by design — no shadow, border or lift animation. Only
 * the medallion and the heading colour respond to hover, very gently.
 */
function ReasonCard({ title, icon }) {
  // Resolved by the caller and passed in — `react-hooks/static-components`
  // rejects deriving a component inside a component body.
  const Icon = icon;
  return (
    <div
      className="group relative flex h-full flex-col items-center overflow-hidden rounded-[22px] bg-white px-6 py-8 text-center shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-18px_rgba(16,40,79,0.16)]"
    >
      {/* thin accent line across the top */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent)) 50%, transparent)' }} />
      {/* faint glass wash so the card is not a plain white box */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: 'linear-gradient(180deg, rgba(44,90,166,0.05), transparent)' }} />

      {/* Icon medallion — the focal point, with a thin accent ring around it */}
      <span className="relative inline-flex flex-shrink-0">
        <span
          className="relative flex h-[58px] w-[58px] items-center justify-center rounded-[18px] transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          style={{
            background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 18px -10px rgba(16,40,79,0.5)',
            color: 'rgb(var(--on-accent))',
          }}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[44%] rounded-[18px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
          <Icon className="relative h-7 w-7" />
        </span>
      </span>

      <h3
        className="relative mt-7 text-[18px] font-semibold capitalize leading-[1.35] tracking-[0.02em] text-[rgb(var(--primary-dark))] transition-colors duration-300 ease-out group-hover:text-[rgb(var(--accent))]"
        style={{ fontFamily: INTER }}
      >
        {title}
      </h3>
    </div>
  );
}

export default function WhyChooseUs() {
  const c = brandDNA.copy.whyChoose;

  return (
    <section id="why" className="relative overflow-hidden">
      {/* ── Soft mesh base — theme-blue radial pools over a pale wash ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 44% at 8% 10%, rgba(110,143,196,0.18) 0%, transparent 62%),' +
            'radial-gradient(44% 40% at 94% 18%, rgba(44,90,166,0.12) 0%, transparent 64%),' +
            'radial-gradient(52% 48% at 50% 100%, rgba(24,60,120,0.10) 0%, transparent 62%),' +
            'linear-gradient(168deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)',
        }}
      />

      {/* Per-client motif pattern + corner overlays (Rule 58), re-tinted for
          the light surface. */}
      
      <CornerOverlay position="top-left" size={300} color="#2C5AA6" opacity={0.07} />
      <CornerOverlay position="bottom-right" size={300} color="#2C5AA6" opacity={0.07} />

      {/* ── Architectural decoration: blueprint grid, diagonals, roof peaks ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        
        <div
          className="absolute right-[7%] bottom-28 hidden h-20 w-20 rotate-45 lg:block"
          style={{ borderTop: '2px solid rgba(44,90,166,0.12)', borderRight: '2px solid rgba(44,90,166,0.12)', borderTopRightRadius: '10px' }}
        />
        <div className="absolute -left-16 bottom-6 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.18)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />
      </div>

      <div className="site-container relative py-14 lg:py-20">
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

        {/* ── Feature grid: 3 across on desktop, 2 on tablet, 1 on mobile.
               Six reasons land as a clean 3 × 2. `h-full` on each card keeps
               every row exactly level. ── */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {brandDNA.why_choose_us.map((title) => (
            <ReasonCard key={title} title={title} icon={pickReasonIcon(title)} />
          ))}
        </div>
      </div>

    </section>
  );
}
