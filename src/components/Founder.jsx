import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import OwnerCard from './OwnerCard';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Matches the header CTA exactly (Navbar's navCtaTextStyle). Paired with the
// global .btn-gold glass class so this button and the nav button are the same
// component visually — gradient, border, radius, shadow, hover and transition
// all come from that one stylesheet rule.
const glassBtnTextStyle = {
  color: 'rgb(var(--on-accent))',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
  fontFamily: INTER,
};

// Photo fallback chain (per 09-build.md Rule 19 + brief A8):
//   1. /owner.webp (the single-owner portrait, when present)
//   2. /team/{team_group_photo} (the team group photo, when present)
//   3. nothing — the image column hides cleanly via the photoOk gate
//
// The build script writes only ONE of these per client. When the owner photo
// is missing, copy_assets() leaves /owner.webp absent and the onError flips
// photoOk false; the team-group fallback below picks up the slack.

// Outline icons chosen to match their copy: an eye for VISION (what we see
// ahead), a target for MISSION (what we aim at).
const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TargetIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Glass icon medallion — gradient blue disc, thin light rim, inner top gloss
 * and a blurred accent glow bleeding out behind it. Deliberately not a square
 * "icon box".
 */
function IconMedallion({ icon }) {
  const Icon = icon;
  return (
    <span className="relative inline-flex">
      
      <span
        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-[1.06]"
        style={{
          background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
          border: '1px solid rgba(255,255,255,0.6)',
          color: 'rgb(var(--on-accent))',
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-[3px] -top-[1px] h-[46%] rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)' }} />
        <Icon className="relative h-[23px] w-[23px]" />
      </span>
    </span>
  );
}

/**
 * Floating frosted feature card. Semi-transparent white body over a real
 * `backdrop-filter` blur, the .glass-ring gradient hairline, an inner top
 * gloss and a three-layer shadow that deepens on an 8px lift.
 */
function FeatureCard({ icon, label, body, className = '' }) {
  return (
    <article
      className={`glass-ring group relative overflow-hidden rounded-[22px] p-5 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_10px_26px_-12px_rgba(16,40,79,0.16),0_28px_54px_-24px_rgba(16,40,79,0.28)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_18px_38px_-14px_rgba(16,40,79,0.2),0_40px_72px_-28px_rgba(16,40,79,0.36)] sm:p-6 ${className}`}
      style={{
        background: 'linear-gradient(165deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.56) 100%)',
        backdropFilter: 'blur(18px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)' }} />

      <div className="relative">
        <IconMedallion icon={icon} />

        <h3
          className="mt-5 text-[15px] font-bold uppercase leading-none tracking-[0.12em]"
          style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
        >
          {label}
        </h3>

        <span aria-hidden className="mb-3.5 mt-3 block h-px w-9" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent) / 0))' }} />

        <p className="text-[13.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{body}</p>
      </div>
    </article>
  );
}

/**
 * Founder — the site's About section. Reused on the homepage and the About
 * page; `showCta` hides the "learn more" link on /about itself, where it would
 * point at the page you are already on.
 *
 * All copy comes from brandDNA.copy.founder and brandDNA.team.founder, and the
 * image is the existing owner (or team) photo. Nothing here is authored.
 */
export default function Founder({ showCta = true }) {
  // Crew-centric: when a crew/team group photo is provided it is the PRIMARY
  // image (rendered in the SSR HTML, no owner-photo attempt, no broken-image
  // flash). The single-owner photo path is only used when no crew photo exists.
  const hasCrew = Boolean(brandDNA.team_group_photo);
  const [photoOk, setPhotoOk] = useState(true);
  const [fallbackOk, setFallbackOk] = useState(hasCrew);
  const teamPhotoUrl = hasCrew ? `/team/${brandDNA.team_group_photo}` : null;
  const showOwner = !hasCrew && photoOk;
  const showTeamFallback = hasCrew && fallbackOk;
  const showPhoto = showOwner || showTeamFallback;
  const captionCity = brandDNA.address?.city || '';

  const c = brandDNA.copy.founder;
  const founder = brandDNA.team.founder;

  const profileName = showOwner ? founder.displayName : `OUR ${captionCity ? `${captionCity.toUpperCase()} ` : ''}CREW`;
  const profileRole = showOwner ? founder.title : brandDNA.company.shortName;

  return (
    <section id="about" className="relative overflow-hidden py-12 lg:py-16">
      {/* ── Soft mesh gradient base — three theme-blue radial pools over the
             pale linear wash. No flat block colour anywhere. ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 48% at 10% 16%, rgba(110,143,196,0.20) 0%, transparent 62%),' +
            'radial-gradient(48% 44% at 90% 6%, rgba(44,90,166,0.14) 0%, transparent 64%),' +
            'radial-gradient(56% 52% at 78% 96%, rgba(24,60,120,0.11) 0%, transparent 62%),' +
            'linear-gradient(165deg, #FFFFFF 0%, #F6F9FD 54%, #EAF1FA 100%)',
        }}
      />

      {/* ── Decoration: floating blur circles, thin architectural rules and a
             roof-inspired chevron. All CSS, all palette blues, all low alpha. ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-8 h-56 w-56 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.13)' }} />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.2)' }} />
                
        {/* roof-peak chevron — a square showing only two borders, rotated 45° */}
        
        
      </div>

      <div className="site-container relative">
        {/* MOBILE reading order for this image-text section is eyebrow →
            heading → image → copy → CTA, so the head block, the portrait and
            the body are three separate grid items with explicit `order`. From
            lg the orders are dropped and explicit row/column placement rebuilds
            the original two-column layout exactly: portrait on the left
            spanning both rows, head above body on the right, zero row gap
            between them so desktop spacing is untouched. */}
        <div className={`grid items-center gap-x-10 gap-y-6 lg:gap-x-12 lg:gap-y-0 ${showPhoto ? 'lg:grid-cols-[minmax(0,0.64fr)_minmax(0,1fr)]' : ''}`}>
          {/* ════ Portrait — LEFT column on desktop, spanning both rows;
                 between heading and copy on mobile ════ */}
          {showPhoto && (
            <div className="relative order-2 mx-auto w-full max-w-[440px] lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mx-0">
              {/* architectural corner bracket */}
              <span
                aria-hidden
                className="absolute -left-3.5 -top-3.5 hidden h-20 w-20 rounded-tl-[24px] sm:block"
                style={{ borderTop: '2px solid rgb(var(--accent) / 0.32)', borderLeft: '2px solid rgb(var(--accent) / 0.32)' }}
              />
              {/* offset glass panel peeking out bottom-right */}
              <span
                aria-hidden
                className="absolute -bottom-3.5 -right-3.5 hidden h-28 w-28 rounded-[24px] sm:block"
                style={{
                  background: 'linear-gradient(150deg, rgb(var(--accent) / 0.22), rgb(var(--accent) / 0.04))',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              />

              <div
                className="relative overflow-hidden rounded-[24px] bg-white"
                style={{
                  border: '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 2px 6px -1px rgba(16,40,79,0.06), 0 30px 58px -26px rgba(16,40,79,0.36)',
                }}
              >
                {showOwner ? (
                  <img
                    src="/owner.webp"
                    alt={`${founder.name}, ${founder.title} of ${brandDNA.company.name}`}
                    className="block aspect-[4/5] w-full object-cover"
                    style={{ objectPosition: 'center 22%' }}
                    loading="lazy"
                    decoding="async"
                    onError={() => setPhotoOk(false)}
                  />
                ) : (
                  <img
                    src={teamPhotoUrl}
                    alt={`${brandDNA.company.name} crew in ${captionCity || 'the field'}`}
                    className="block aspect-[4/5] w-full object-cover"
                    style={{ objectPosition: 'center 35%' }}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFallbackOk(false)}
                  />
                )}
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5" style={{ background: 'linear-gradient(to top, rgba(11,20,42,0.55), transparent)' }} />

                {/* ── Owner profile card — see OwnerCard.jsx for the shared
                       glass treatment used here and in the hero. ── */}
                <div className="absolute inset-x-3.5 bottom-3.5 sm:inset-x-4 sm:bottom-4">
                  <OwnerCard name={profileName} role={profileRole} statValue={founder.yearsExp} statLabel={founder.expLabel} />
                </div>
              </div>
            </div>
          )}

          {/* ════ Head — label + heading (RIGHT column, row 1 on desktop) ════ */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
              {c.label}
            </p>

            <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
              {c.heading}
            </h2>

            <span className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
          </div>

          {/* ════ Body — story, feature cards, CTA (RIGHT column, row 2) ════ */}
          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:mt-5">
            <div>
              <p className="text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>{c.para1}</p>
              <p className="mt-3.5 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>{c.para2}</p>
            </div>

            {/* Staggered pair — the second card drops half a step so the two
                read as layered floating panels rather than a matched row. */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:items-start sm:gap-5">
              <FeatureCard icon={EyeIcon} label={c.visionLabel} body={c.vision} />
              <FeatureCard icon={TargetIcon} label={c.missionLabel} body={c.mission} className="sm:mt-7" />
            </div>

            {showCta && (
              <Link
                to="/about"
                className="btn-gold mt-8 inline-flex items-center gap-2.5 px-6 py-3 text-[12.5px] uppercase tracking-[0.07em]"
                style={glassBtnTextStyle}
              >
                LEARN MORE ABOUT US
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
