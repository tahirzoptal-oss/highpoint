import { brandDNA } from '../config/brand-dna';
import ScrollRevealHeadline from './ScrollRevealHeadline';
import OwnerCard from './OwnerCard';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
// Hero headings use Josefin Sans ONLY (loaded via the @import in index.css).
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Official platform marks — the ONLY colors allowed outside the blue palette,
// used exclusively inside the review cards (per brief).
const GoogleMark = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
const FacebookMark = (props) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Stars = () => (
  <span className="inline-flex text-[14px] leading-none tracking-tight sm:text-[16px]" style={{ color: 'rgb(var(--accent))' }}>{'★★★★★'}</span>
);

// ── Outline icons, matched to each trust point ──
const Ic = ({ children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const BoltIcon = (p) => <Ic {...p}><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" /></Ic>;
const UserIcon = (p) => <Ic {...p}><circle cx="12" cy="8" r="3.4" /><path d="M4.8 20c0-3.5 3.3-5.4 7.2-5.4S19.2 16.5 19.2 20" /></Ic>;
const WalletIcon = (p) => <Ic {...p}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none" /></Ic>;
const ShieldIcon = (p) => <Ic {...p}><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z" /><path d="m9.2 12 2 2 3.6-3.8" /></Ic>;
const AwardIcon = (p) => <Ic {...p}><circle cx="12" cy="9" r="5" /><path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" /></Ic>;
const CheckBadgeIcon = (p) => <Ic {...p}><path d="M12 3l2.2 1.6 2.7-.3.9 2.6 2.3 1.4-.8 2.6.8 2.6-2.3 1.4-.9 2.6-2.7-.3L12 21l-2.2-1.6-2.7.3-.9-2.6-2.3-1.4.8-2.6-.8-2.6 2.3-1.4.9-2.6 2.7.3z" /><path d="m9 12 2 2 4-4" /></Ic>;

function trustIcon(text) {
  const t = String(text).toLowerCase();
  if (/same.?day|fast|24|hour|quick|response|repair/.test(t)) return BoltIcon;
  if (/owner|every job|crew|team|local|family/.test(t)) return UserIcon;
  if (/payment|financ|plan|budget|afford|price|cost/.test(t)) return WalletIcon;
  if (/licens|insur|bond|certif|guarant|warrant/.test(t)) return ShieldIcon;
  if (/experience|year|award|rated|proven|star/.test(t)) return AwardIcon;
  return CheckBadgeIcon;
}

const GOOGLE_REVIEW_URL = 'https://share.google/LPZS1EkTCmfvW3sov';

const lightCard = {
  background: '#FFFFFF',
  border: '1px solid rgba(16,40,79,0.06)',
  boxShadow: '0 12px 28px -16px rgba(16,40,79,0.32)',
};
// Two separate, identically-sized review cards (light UI).
// Review badge. Everything scales down on tablet/mobile — min width, padding,
// icon plate, glyph and both type sizes — so the pair costs far less vertical
// space on a narrow hero. The sm-and-up values are the originals.
const ReviewCard = ({ href, icon, top, stars, sub }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex min-w-[152px] flex-1 items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(16,40,79,0.4)] sm:min-w-[188px] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"
    style={lightCard}
  >
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/5 sm:h-11 sm:w-11 sm:rounded-xl" style={{ background: '#F3F7FC' }}>{icon}</span>
    <span className="min-w-0">
      <span className="flex items-center gap-1.5">
        <span className="text-[13.5px] font-bold leading-none text-ink sm:text-[15px]" style={{ fontFamily: INTER }}>{top}</span>
        {stars && <Stars />}
      </span>
      <span className="mt-0.5 block text-[11px] leading-[1.4] text-ink/55 sm:mt-1 sm:text-[12px]" style={{ fontFamily: INTER }}>{sub}</span>
    </span>
  </a>
);

export default function Hero() {
  const { copy, reviews, social, team, company } = brandDNA;
  const founder = team.founder;
  const trustFeatures = copy.heroTrustChips.slice(0, 3);

  const hasGoogle = reviews?.googleCount > 0;
  const hasFacebook = reviews?.facebookCount > 0;
  const showFacebook = Boolean(social?.facebook);

  return (
    <section id="hero" className="hero-section relative flex flex-col overflow-hidden">
      {/* ── Light multi-tone background (theme blues) ── */}
      <div className="absolute inset-0" style={{ zIndex: 0, background: 'linear-gradient(120deg, #F2F6FC 0%, #E5EDF8 46%, #D8E3F2 100%)' }} />
      {/* subtle architectural texture — very low opacity so it never competes with text */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(135deg, transparent 0 26px, rgba(24,60,120,0.022) 26px 27px)' }} />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(44,90,166,0.10), transparent 68%)' }} />
        <div className="absolute left-[18%] -bottom-28 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(24,60,120,0.07), transparent 68%)' }} />
        
      </div>

      {/* ── Full-bleed right composition — completed-project photo + owner (lg only) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:block" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}>
          <img src="/work/project16.webp" alt="" className="h-full w-full object-cover" style={{ objectPosition: '50% 42%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(118deg, rgba(11,20,42,0.82) 0%, rgba(16,40,79,0.52) 44%, rgba(11,30,66,0.32) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: 'linear-gradient(to top, rgba(8,12,20,0.78), transparent)' }} />
        </div>
        {/* diagonal seam accents (blend light left → image right) */}
        <div className="absolute inset-0" style={{ background: 'rgb(var(--accent-light))', opacity: 0.8, clipPath: 'polygon(20% 0, 18.9% 0, -1.1% 100%, 0 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'rgb(var(--accent) / 0.5)', clipPath: 'polygon(21% 0, 21.5% 0, 6.5% 100%, 6% 100%)' }} />
        {/* soft glow halo to lift the owner */}
        <div className="absolute" style={{ left: '24%', top: '10%', width: '62%', height: '82%', background: 'radial-gradient(ellipse at 45% 40%, rgba(147,175,214,0.28) 0%, transparent 62%)' }} />
      </div>

      {/* ════ Two-column content row ════ */}
      {/* Bottom padding reserves room for the floating lead form, which lifts
          itself by 64px (mobile) / 128px (desktop) into this space. On desktop
          the extra 16px leaves the bottom-aligned columns just clear of the
          form's top edge. */}
      {/* MOBILE bottom padding is deliberately smaller than the floating form's
          -mt-16 lift, so the form rides up over the last of the hero and meets
          the owner image with no band of background between them. It still
          clears the owner card, which sits higher up the image. */}
      <div className="site-container relative flex flex-1 flex-col gap-5 pb-20 pt-8 sm:gap-6 sm:pb-20 sm:pt-10 lg:flex-row lg:items-end lg:gap-6 lg:pb-36 lg:pt-8" style={{ zIndex: 5 }}>
        {/* LEFT — marketing content (dark text on light).
            On tablet/mobile this column runs FIRST, so the stack reads
            eyebrow → heading → trust badges → review badges → owner image →
            owner card → floating form. Desktop is unchanged: this stays the
            left column of the two-column row. */}
        <div className="order-1 text-left lg:flex-1 lg:max-w-[600px]">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
            <span className="h-2 w-2 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
            {copy.hero.eyebrow}
          </p>

          <ScrollRevealHeadline
            as="h1"
            className="uppercase"
            style={{
              fontFamily: JOSEFIN,
              fontWeight: 700,
              fontSize: 'clamp(34px, 4.4vw, 51px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'rgb(var(--primary))',
              WebkitTextFillColor: 'rgb(var(--primary))',
              background: 'none',
            }}
          >
            {copy.hero.headline}
          </ScrollRevealHeadline>

          <span className="mt-4 mb-5 block h-[3px] w-16 rounded-full" style={{ background: 'rgb(var(--accent))' }} />

          {/* Trust badges — compact elevated cards (same glass/shadow treatment,
              tighter box) so the hero stays short without feeling cramped. */}
          <div className="mb-5 flex flex-wrap gap-2">
            {trustFeatures.map((claim) => {
              const Icon = trustIcon(claim);
              return (
                <div key={claim} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5" style={lightCard}>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgb(var(--accent) / 0.1)', color: 'rgb(var(--accent))' }}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="pr-0.5 text-[13px] font-semibold leading-tight text-ink" style={{ fontFamily: INTER }}>{claim}</span>
                </div>
              );
            })}
          </div>

          {/* Two SEPARATE review cards */}
          <div className="flex flex-wrap items-stretch gap-2 sm:max-w-[440px] sm:gap-3">
            {hasGoogle && (
              <ReviewCard href={GOOGLE_REVIEW_URL} icon={<GoogleMark className="h-5 w-5 sm:h-6 sm:w-6" />} top={reviews.rating.toFixed(1)} stars sub={`${reviews.googleCount} Google reviews`} />
            )}
            {showFacebook && (
              <ReviewCard
                href={social.facebook}
                icon={<FacebookMark className="h-5 w-5 sm:h-6 sm:w-6" />}
                top={hasFacebook ? reviews.rating.toFixed(1) : 'Facebook'}
                stars={hasFacebook}
                sub={hasFacebook ? `${reviews.facebookCount} Facebook reviews` : 'Read our reviews'}
              />
            )}
          </div>
        </div>

        {/* RIGHT — owner + branded-truck cutout floats over the composition.
            The asset is landscape (1146×617) so the frame is aspect-driven
            rather than fixed-height: it scales without ever distorting. */}
        {/* The -mb on desktop drops the composition 44px past the column
            baseline, so its bottom tucks ~28px behind the floating form (z-30)
            instead of hovering above it — the two read as one composition.
            The negative margin also keeps the taller image from adding height. */}
        <div className="order-2 flex w-full items-center justify-center -mb-12 lg:-mb-14 lg:w-[56%]">
          <div className="relative w-full max-w-[560px] lg:max-w-[760px]">
            <img
              src="/owner-banner-img.webp"
              alt={`${founder.name}, ${founder.title} of ${company.name}`}
              width={1146}
              height={617}
              className="block h-auto w-full object-contain"
              style={{ filter: 'drop-shadow(0 24px 40px rgba(8,12,20,0.45))' }}
              loading="eager"
            />

            {/* ── Owner card — absolutely positioned at every width, so it stays
                   part of the composition rather than a block underneath it.
                   On tablet/mobile it is centred over the bottom of the owner
                   image; from lg it pins to the far right exactly as before.
                   The bottom offset keeps it inside the image box, so it never
                   reaches the floating form that lifts into the space below.
                   Same OwnerCard component the About section uses. ── */}
            <div className="absolute bottom-[40px] right-0 z-20 transition-transform duration-300 lg:bottom-[17%] lg:left-auto lg:right-0 lg:translate-x-0">
              <OwnerCard name={founder.name} role={founder.title} className="sm:min-w-[210px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
