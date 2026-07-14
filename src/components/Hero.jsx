import { brandDNA } from '../config/brand-dna';
import BackgroundPattern from './BackgroundPattern';
import ScrollRevealHeadline from './ScrollRevealHeadline';
import ClaimIcon from './ClaimIcon';
import { useLeadForm } from '../lib/leadForm';

const glassInput = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'white',
};

const glassPill = {
  background: 'rgba(255,255,255,0.09)',
  border: '1px solid rgba(255,255,255,0.16)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

export default function Hero() {
  const { honeypotProps, onSubmit: handleSubmit } = useLeadForm('hero');

  return (
    <section
      id="hero"
      className="hero-section relative overflow-hidden flex flex-col bg-navy theme-keep-dark"
    >
      <BackgroundPattern motif={brandDNA.shape_motif} opacity={0.3} color="white" />
      {/* Full-screen hero image (WebP with mobile-srcset, PNG fallback) */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <picture>
          <source media="(max-width: 768px)" srcSet="/hero-image-mobile.webp" type="image/webp" />
          <source srcSet="/hero-image.webp" type="image/webp" />
          <img
            src="/hero-image.webp"
            alt={`${brandDNA.company.name}, ${brandDNA.address.city} roofing contractor`}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 38%' }}
            loading="eager"
            fetchpriority="high"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </picture>
      </div>
      {/* Rule 72: dark overlay sits as sibling of picture wrapper with explicit
          zIndex: 2 so it renders between hero image (z=1) and text content (z=5).
          Nesting it inside the picture wrapper creates a stacking-context trap
          where the overlay renders invisible under the image. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(8,12,20,0.92) 0%, rgba(8,12,20,0.82) 32%, rgba(8,12,20,0.64) 58%, rgba(8,12,20,0.42) 100%)', zIndex: 2 }}
      />

      {/* Two-column layout: text left, form right */}
      <div
        className="relative flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-24 pb-10 lg:pt-24 lg:pb-0 lg:items-center lg:gap-14"
        style={{ zIndex: 5 }}
      >
        {/* LEFT: headline + badges + trust claims */}
        <div className="text-left lg:flex-1 lg:py-8">
          {/* Eyebrow — Rule 73: read brand_dna.hero.eyebrow_color when set
              (used by clients whose accent is too dark on the overlaid hero,
              e.g. Cloud Nine navy accent → orange primary override). Default
              uses raw brand accent (rgb(var(--accent))) inline so the Rule 65
              light-theme darkening does NOT apply to the hero eyebrow — on a
              55% navy overlay, the brand accent reads cleanly without the
              dark-mix needed against a white surface. */}
          <p
            className="font-body font-semibold text-xs uppercase tracking-[0.2em] mb-4"
            style={{
              color: brandDNA.hero?.eyebrow_color || 'rgb(var(--accent))',
              textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)',
            }}
          >
            {brandDNA.copy.hero.eyebrow}
          </p>

          {/* Rule 55: H1 carries the same drop-shadow as the subheading so
              both stay legible against any Mid-Atlantic / sky / shingle hero
              photo.
              Wave 2 (research bake): wrapped in <ScrollRevealHeadline> for
              per-word fade-in on scroll. One premium motion moment per page. */}
          <ScrollRevealHeadline
            as="h1"
            className="font-heading font-bold text-white uppercase leading-display tracking-display mb-0"
            style={{ fontSize: 'clamp(40px, 5vw, 76px)', color: '#FFFFFF', textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}
          >
            {brandDNA.copy.hero.headline}
          </ScrollRevealHeadline>

          {/* Gold accent line */}
          <span className="line-gold block w-16 mt-4 mb-5" />

          {/* Rule 55: subheading (3-stat trust line) renders white with a navy
              drop-shadow. NEVER text-cool / text-steel — slate greys vanish on
              most hero photos. */}
          <p
            className="text-sm font-body leading-relaxed mb-6 max-w-sm"
            style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}
          >
            {brandDNA.copy.hero.subheadline}
          </p>

          {/* Clickable rating + accreditation pills — frosted glass. Each pill
              is gated on its own data, so a brand with only Google (or only a
              BBB rating) never renders an empty Facebook or 0-count pill. */}
          {(brandDNA.reviews?.googleCount > 0 || brandDNA.reviews?.facebookCount > 0 || brandDNA.certifications?.bbb) && (
          <div className="flex items-center justify-start gap-2 mb-6 flex-wrap">
            {brandDNA.reviews?.googleCount > 0 && (
            <a
              href={brandDNA.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 transition-all hover:border-gold"
              style={glassPill}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white">{brandDNA.reviews.rating.toFixed(1)}</span>
                  <div className="flex text-yellow-400 text-xs leading-none">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <span className="text-white/50 text-[10px]">({brandDNA.reviews.googleCount})</span>
                </div>
                <div className="text-[10px] text-white/55 leading-none">{brandDNA.reviews.googleLabel}</div>
              </div>
            </a>
            )}

            {brandDNA.reviews?.facebookCount > 0 && (
            <a
              href={brandDNA.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 transition-all hover:border-gold"
              style={glassPill}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white">{brandDNA.reviews.rating.toFixed(1)}</span>
                  <div className="flex text-yellow-400 text-xs leading-none">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <span className="text-white/50 text-[10px]">({brandDNA.reviews.facebookCount})</span>
                </div>
                <div className="text-[10px] text-white/55 leading-none">{brandDNA.reviews.facebookLabel}</div>
              </div>
            </a>
            )}

            {brandDNA.certifications?.bbb && (
            <a
              href={brandDNA.contact.bbbUrl || 'https://www.bbb.org/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 transition-all hover:border-gold"
              style={glassPill}
            >
              <div className="flex items-center justify-center px-1 h-5 flex-shrink-0" style={{ background: '#0A4C8B' }}>
                <span className="font-heading font-bold text-white text-[11px] leading-none tracking-tight">BBB</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white">{brandDNA.certifications.bbb_rating || 'A+'}</span>
                  <span className="text-white/50 text-[10px]">Rating</span>
                </div>
                <div className="text-[10px] text-white/55 leading-none">BBB Accredited</div>
              </div>
            </a>
            )}
          </div>
          )}

          {/* Trust claims */}
          <div className="flex flex-col gap-2.5">
            {brandDNA.copy.heroTrustChips.map((claim) => (
              <div key={claim} className="flex items-center gap-2.5">
                <ClaimIcon claim={claim} className="w-6 h-6 flex-shrink-0" />
                <span className="text-white text-base font-body font-semibold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>{claim}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: form — frosted glass. Rule 65: marked `theme-keep-dark` so
            the dark glass surface keeps its white text in BOTH light and
            dark theme builds. Without this, light-theme clients flip
            text-white -> text-primary which renders as low-contrast navy
            on the dark glass (failures ~1.38 in WCAG audit). */}
        <div id="quote" className="mt-8 lg:mt-0 lg:w-[420px] lg:flex-shrink-0 lg:py-0">
          <div
            className="overflow-hidden theme-keep-dark"
            style={{
              background: 'rgba(38,38,42,0.62)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.30)',
            }}
          >
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="heading-metallic font-heading font-bold text-white text-xl uppercase tracking-wide block">
                {brandDNA.copy.formHeader}
              </span>
              <span className="text-white/50 text-[11px] font-body">{brandDNA.copy.formSubtext}</span>
            </div>

            <form onSubmit={handleSubmit} className="p-4 grid grid-cols-2 gap-3">
              {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
              <input {...honeypotProps} />
              <input
                name="name"
                className="form-input px-4 py-3 text-sm placeholder-white/40"
                placeholder="Your Name"
                style={glassInput}
              />
              <input
                name="phone"
                className="form-input px-4 py-3 text-sm placeholder-white/40"
                placeholder="Phone Number"
                type="tel"
                style={glassInput}
              />
              <input
                name="email"
                className="form-input col-span-2 px-4 py-3 text-sm placeholder-white/40"
                placeholder="Email Address"
                type="email"
                style={glassInput}
              />
              <select
                name="service"
                className="form-input col-span-2 px-4 py-3 text-sm"
                style={{ ...glassInput, color: 'rgba(255,255,255,0.75)' }}
              >
                <option value="" style={{ background: '#1E293B', color: 'white' }}>How Can We Help?</option>
                {brandDNA.services.map((s) => (
                  <option key={s.slug} value={s.slug} style={{ background: '#1E293B', color: 'white' }}>{s.name}</option>
                ))}
              </select>
              <input
                name="address"
                className="form-input col-span-2 px-4 py-3 text-sm placeholder-white/40"
                placeholder="Property Address"
                style={glassInput}
              />
              <input
                name="message"
                className="form-input col-span-2 px-4 py-3 text-sm placeholder-white/40"
                placeholder="Brief message (optional)"
                style={glassInput}
              />
              <div className="col-span-2">
                <button
                  type="submit"
                  className="btn-gold w-full font-heading font-bold text-base uppercase tracking-widest py-3.5 text-white"
                >
                  {brandDNA.copy.buttonText} →
                </button>
                <p className="text-center text-white/35 font-body text-[10px] mt-2">
                  No obligation. No pressure. We will never send you unsolicited messages.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
