import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { brandDNA } from '../config/brand-dna';

// Responsive columns via useSyncExternalStore — SSR-safe (server = 3) and
// lint-clean (no setState-in-effect). 3 desktop / 2 tablet / 1 mobile.
const getColumns = () => {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  return w < 640 ? 1 : w < 1024 ? 2 : 3;
};
const subscribeResize = (cb) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

// Hover-pause is a pointer affordance only: touch devices keep autoplaying.
const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// ── Dynamic review source ────────────────────────────────────────────────
// Reviews come from brandDNA.reviews.items (populated by the build-time Google
// Business Profile scrape) — NOT hardcoded here. When the pipeline re-runs and
// new Google reviews are captured, they flow in automatically on the next build.
// Prefer 5-star Google reviews; fall back to the latest of whatever exists.
const ALL = brandDNA.reviews?.items || [];
const GOOGLE_5 = ALL.filter((r) => String(r.source || '').toLowerCase() === 'google' && Number(r.rating) === 5);
const REVIEWS = (GOOGLE_5.length ? GOOGLE_5 : ALL)
  .slice()
  .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

const GoogleMark = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const QuoteIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M9.4 6.1C6.4 7.1 4.9 9.5 4.9 13.1V19h6.2v-6.4H8.2c.1-1.9.9-3.1 2.6-3.8L9.4 6.1zm9 0C15.4 7.1 13.9 9.5 13.9 13.1V19h6.2v-6.4h-2.9c.1-1.9.9-3.1 2.6-3.8L18.4 6.1z" />
  </svg>
);

const StarRow = ({ rating = 5 }) => (
  <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true" style={{ color: i < rating ? 'rgb(var(--accent))' : 'rgb(var(--silver))' }}>
        <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
      </svg>
    ))}
  </span>
);

const Chevron = ({ dir, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// Circular glass nav button — frosted white, theme-blue glyph, lifts on hover.
// `display` is supplied by the caller so the same button can be desktop-only
// (flanking the slider) or mobile-only (in the pagination row).
const ArrowBtn = ({ dir, onClick, label, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`h-12 w-12 items-center justify-center rounded-full bg-white/85 text-[rgb(var(--primary))] shadow-[0_12px_30px_-14px_rgba(16,40,79,0.55)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgb(var(--primary))] hover:text-white hover:shadow-[0_20px_38px_-14px_rgba(16,40,79,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 active:translate-y-0 lg:h-[52px] lg:w-[52px] ${className}`}
    style={{ border: '1px solid rgba(16,40,79,0.09)' }}
  >
    <Chevron dir={dir} className="h-5 w-5" />
  </button>
);

function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '★';
}

function ReviewCard({ review }) {
  const name = review.author || review.name || 'Verified Customer';
  const rating = Number(review.rating) || 5;
  const photo = review.avatar || review.photo || review.profilePhoto;

  return (
    <article
      // Layered, low-spread shadow. The old single `-22px` spread cancelled the
      // whole blur horizontally, so the shadow stopped dead at the card's left
      // and right edges and read as clipped. These layers keep enough spread to
      // wrap all four sides softly.
      className="group relative flex h-[368px] flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_2px_4px_-1px_rgba(16,40,79,0.05),0_10px_24px_-8px_rgba(16,40,79,0.10),0_22px_44px_-14px_rgba(16,40,79,0.13)] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_4px_8px_-2px_rgba(16,40,79,0.06),0_16px_32px_-10px_rgba(16,40,79,0.12),0_32px_56px_-18px_rgba(16,40,79,0.18)] sm:p-7"
      style={{ border: '1px solid rgba(16,40,79,0.07)', willChange: 'transform' }}
    >
      {/* Barely-there top-light wash — the "elevated glass" read without tint */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(180deg, rgba(44,90,166,0.045), transparent)' }}
      />

      <QuoteIcon className="relative h-12 w-12 flex-shrink-0" style={{ color: 'rgb(var(--accent) / 0.6)' }} />

      {/* Equal-height cards: long reviews scroll inside this area */}
      <div className="review-scroll relative mt-3 min-h-0 flex-1 overflow-y-auto pr-3">
        <p className="text-[15px] leading-[1.75] text-ink/75" style={{ fontFamily: INTER }}>{review.text}</p>
      </div>

      <div className="relative mt-6 flex items-center gap-3.5 border-t pt-5" style={{ borderColor: 'rgba(16,40,79,0.08)' }}>
        {photo ? (
          <img
            src={photo}
            alt=""
            width={52}
            height={52}
            loading="lazy"
            decoding="async"
            className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            // The initials MUST stay pure white: the global light-theme rule
            // `[data-theme-mode="light"] .text-white` repaints white text navy,
            // which is invisible on this navy avatar. The inline color (plus the
            // theme-keep-white opt-out) wins over that stylesheet rule.
            className="theme-keep-white flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full text-[14px] leading-none"
            style={{
              background: 'linear-gradient(145deg, rgb(var(--accent)), rgb(var(--primary)))',
              fontFamily: INTER,
              fontWeight: 700,
              color: '#FFFFFF',
              WebkitTextFillColor: '#FFFFFF',
            }}
            aria-hidden="true"
          >
            {initialsOf(name)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="truncate text-[16px] capitalize font-bold leading-tight"
              style={{ fontFamily: INTER, color: 'rgb(var(--primary-dark))', letterSpacing: '-0.015em' }}
            >
              {name}
            </span>
            <GoogleMark className="h-[18px] w-[18px] flex-shrink-0" />
          </div>
          <div className="mt-0.5">
            <StarRow rating={rating} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { copy } = brandDNA;
  const perView = useSyncExternalStore(subscribeResize, getColumns, () => 3);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const pageCount = Math.max(1, Math.ceil(REVIEWS.length / perView));
  // Derived (not stored) so a resize that shrinks pageCount can't leave `page`
  // out of range — no clamp-in-effect needed.
  const activePage = Math.min(page, pageCount - 1);

  const go = useCallback((next) => setPage(((next % pageCount) + pageCount) % pageCount), [pageCount]);

  // Autoplay. `paused` is a dependency, so hovering tears the timer down
  // immediately and leaving it rebuilds a full-length interval.
  useEffect(() => {
    if (pageCount <= 1 || paused) return undefined;
    const id = setInterval(() => setPage((p) => (p + 1) % pageCount), 6000);
    return () => clearInterval(id);
  }, [pageCount, paused]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(activePage + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(activePage + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(activePage - 1); }
  };

  if (!REVIEWS.length) return null;

  return (
    <section className="bg-white py-16 lg:py-20" aria-label={copy.reviews?.label || 'Customer reviews'}>
      <div className="site-container">
        {/* Heading — existing copy */}
        <div className="mx-auto mb-0 max-w-2xl text-center lg:mb-12">
          {copy.reviews?.label && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
              {copy.reviews.label}
            </p>
          )}
          <h2 className="section-h2 uppercase" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary))', letterSpacing: '-0.01em' }}>
            {copy.reviews?.heading || 'What Our Clients Say'}
          </h2>
          {copy.reviews?.body && (
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink/65" style={{ fontFamily: INTER }}>
              {copy.reviews.body}
            </p>
          )}
        </div>

        {/* Carousel. Hovering anywhere in this wrapper (cards or arrows) pauses. */}
        <div
          className="relative"
          onMouseEnter={() => { if (canHover()) setPaused(true); }}
          onMouseLeave={() => { if (canHover()) setPaused(false); }}
        >
          {/* Viewport — VERTICAL padding only. `overflow-hidden` clips at the
              PADDING box, so any horizontal padding becomes a window the
              neighbouring pages bleed through as slivers. Clipping flush to the
              container edge shows exactly `perView` cards; py-11 still gives the
              shadows their ~42px of downward room, and each slide's own px-3.5
              leaves 14px of side clearance for the ~10px sideways reach. */}
          <div
            className="overflow-hidden py-11 outline-none"
            role="group"
            aria-roledescription="carousel"
            aria-label="Google reviews"
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
          >
            {/* Horizontal slide only — no fade, scale or rotation. */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translate3d(-${activePage * 100}%, 0, 0)`, willChange: 'transform' }}
            >
              {REVIEWS.map((review, i) => (
                <div key={i} className="shrink-0 px-3.5" style={{ flexBasis: `${100 / perView}%`, maxWidth: `${100 / perView}%` }}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop arrows — vertically centred, clear of the cards.
              Below lg they move into the pagination row so nothing overlaps. */}
          {pageCount > 1 && (
            <>
              <ArrowBtn
                dir="left"
                label="Previous reviews"
                onClick={() => go(activePage - 1)}
                className="absolute top-1/2 hidden -translate-y-1/2 lg:-left-[46px] lg:flex xl:-left-14"
              />
              <ArrowBtn
                dir="right"
                label="Next reviews"
                onClick={() => go(activePage + 1)}
                className="absolute top-1/2 hidden -translate-y-1/2 lg:-right-[46px] lg:flex xl:-right-14"
              />
            </>
          )}
        </div>

        {/* Controls — pill pagination, flanked by the arrows on tablet/mobile */}
        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <ArrowBtn dir="left" label="Previous reviews" onClick={() => go(activePage - 1)} className="flex lg:hidden" />

            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => {
                const active = i === activePage;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to review group ${i + 1} of ${pageCount}`}
                    aria-current={active ? 'true' : undefined}
                    className="h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
                    style={{
                      width: active ? 34 : 10,
                      background: active ? 'rgb(var(--primary))' : 'rgb(var(--accent) / 0.22)',
                    }}
                  />
                );
              })}
            </div>

            <ArrowBtn dir="right" label="Next reviews" onClick={() => go(activePage + 1)} className="flex lg:hidden" />
          </div>
        )}
      </div>
    </section>
  );
}
