import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const projects = brandDNA.previous_projects.map((p) => ({
  src: `/work/${p.filename}`,
  alt: p.alt,
  type: p.type,
}));

// Centre slide width per breakpoint. SSR snapshot = 620 (desktop-first).
// Kept comfortably under the viewport so the previous and next slides always
// have room to show at both edges.
const GAP = 22;
const getSlideWidth = () => {
  if (typeof window === 'undefined') return 620;
  const w = window.innerWidth;
  if (w < 640) return Math.round(w * 0.68);
  if (w < 1024) return Math.round(w * 0.55);
  if (w < 1440) return 520;
  return 600;
};
const subscribeResize = (cb) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

// Hover-pause is a pointer affordance only: touch devices keep autoplaying.
const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const AUTOPLAY_MS = 4200;

const Chevron = ({ dir, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// Circular glass nav button. Fixed in place — only background, icon colour and
// shadow transition on hover, no translate.
const ArrowBtn = ({ dir, onClick, label, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[rgb(var(--primary))] shadow-[0_12px_30px_-14px_rgba(8,16,34,0.8)] backdrop-blur-md transition-[background-color,color,box-shadow] duration-300 ease-out hover:bg-[rgb(var(--accent))] hover:text-white hover:shadow-[0_16px_34px_-12px_rgba(8,16,34,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1C3A] lg:h-[52px] lg:w-[52px] ${className}`}
    style={{ border: '1px solid rgba(255,255,255,0.6)' }}
  >
    <Chevron dir={dir} className="h-5 w-5" />
  </button>
);

function MediaItem({ project }) {
  const videoRef = useRef(null);

  if (project.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={project.src}
        className="block h-full w-full object-cover"
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }

  return (
    <img
      src={project.src}
      alt={project.alt}
      className="block h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={(e) => { e.target.style.background = '#12213F'; e.target.src = ''; }}
    />
  );
}

/**
 * Infinite coverflow. The list is rendered THREE times and `pos` starts in the
 * middle copy, so there is always a real slide to the left and right of the
 * centre — no empty gap at either end of the run. `pos` is unbounded; once a
 * slide transition finishes it is silently snapped back into the middle copy
 * with the animation switched off, which makes the loop seamless in both
 * directions and keeps the arithmetic trivial.
 */
export default function OurWork() {
  const count = projects.length;
  const [pos, setPos] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const slideW = useSyncExternalStore(subscribeResize, getSlideWidth, () => 620);
  const touchX = useRef(null);
  const trackRef = useRef(null);

  const step = useCallback((delta) => setPos((p) => { setAnimate(true); return p + delta; }), []);

  // Autoplay. `paused` is a dependency, so hovering tears the timer down
  // immediately and leaving rebuilds a full-length interval.
  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    const id = setInterval(() => { setAnimate(true); setPos((p) => p + 1); }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  // Snap back into the middle copy after each move so `pos` never runs away.
  const onTransitionEnd = (e) => {
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
    if (pos >= count * 2 || pos < count) {
      setAnimate(false);
      setPos(((pos % count) + count) % count + count);
    }
  };

  if (count === 0) return null;

  const activeIndex = ((pos % count) + count) % count;

  // Dots take the shortest way round rather than scrolling the whole strip.
  const goToIndex = (i) => {
    let delta = i - activeIndex;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    step(delta);
  };

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchX.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  // The track is `width: max-content` and pushed to the container's midpoint
  // with `margin-left: 50%`, so this pure-pixel translate lands the active
  // slide's centre exactly on the section's centre at any viewport width.
  const offset = pos * (slideW + GAP) + slideW / 2;
  const loop = [...projects, ...projects, ...projects];

  return (
    <section id="gallery" className="relative overflow-hidden py-14 lg:py-20">
      {/* ── Deep navy base with theme-blue depth pools ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(52% 46% at 12% 8%, rgba(44,90,166,0.34) 0%, transparent 62%),' +
            'radial-gradient(46% 42% at 90% 12%, rgba(110,143,196,0.20) 0%, transparent 64%),' +
            'radial-gradient(58% 50% at 50% 104%, rgba(44,90,166,0.22) 0%, transparent 62%),' +
            'linear-gradient(168deg, #0B1C3A 0%, #10284F 52%, #0A1730 100%)',
        }}
      />

      {/* ── Blueprint + architectural decoration, drawn in light on dark ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.22)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
      </div>

      {/* ── Centred header ── */}
      <div className="site-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent-light))', fontFamily: INTER }}>
            <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent-light))' }} />
            {brandDNA.copy.gallery.label}
          </p>

          <h2 className="section-h2 uppercase" style={{ color: '#FFFFFF' }}>
            {brandDNA.copy.gallery.heading}
          </h2>

          <span className="mx-auto mb-5 mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))' }} />

          <p className="mx-auto max-w-[62ch] text-[15px] leading-[1.72]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.72)' }}>
            {brandDNA.copy.gallery.body}
          </p>
        </div>
      </div>

      {/* ── Full-bleed coverflow carousel ── */}
      <div
        className="relative mt-10 lg:mt-12"
        onMouseEnter={() => { if (canHover()) setPaused(true); }}
        onMouseLeave={() => { if (canHover()) setPaused(false); }}
      >
        <div
          className="overflow-hidden outline-none"
          role="group"
          aria-roledescription="carousel"
          aria-label={brandDNA.copy.gallery.label}
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onKeyDown}
        >
          <div
            ref={trackRef}
            className="flex items-center"
            onTransitionEnd={onTransitionEnd}
            style={{
              width: 'max-content',
              marginLeft: '50%',
              gap: GAP,
              transform: `translate3d(-${offset}px, 0, 0)`,
              transition: animate ? 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              willChange: 'transform',
            }}
          >
            {loop.map((p, i) => {
              const isActive = i === pos;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => step(i - pos)}
                  aria-label={`Show project ${(i % count) + 1} of ${count}`}
                  aria-current={isActive ? 'true' : undefined}
                  tabIndex={isActive ? 0 : -1}
                  className="group relative block flex-shrink-0 overflow-hidden rounded-[20px] transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1C3A]"
                  style={{
                    width: slideW,
                    aspectRatio: '16 / 10',
                    transform: isActive ? 'scale(1)' : 'scale(0.88)',
                    opacity: isActive ? 1 : 0.45,
                    border: isActive ? '3px solid rgb(var(--accent-light))' : '1px solid rgba(255,255,255,0.12)',
                    boxShadow: isActive
                      ? '0 2px 8px -2px rgba(0,0,0,0.4), 0 34px 64px -26px rgba(0,0,0,0.85)'
                      : '0 10px 24px -18px rgba(0,0,0,0.6)',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  <MediaItem project={p} />
                  {/* navy veil on the flanking slides so the centre reads first */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(200deg, rgba(11,28,58,0.55), rgba(10,23,48,0.4))', opacity: isActive ? 0 : 1 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Arrows — overlaid on the flanking slides, vertically centred */}
        {count > 1 && (
          <>
            <ArrowBtn
              dir="left"
              label="Previous project"
              onClick={() => step(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 sm:left-8 lg:left-16"
            />
            <ArrowBtn
              dir="right"
              label="Next project"
              onClick={() => step(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-8 lg:right-16"
            />
          </>
        )}
      </div>

      {/* ── Pill pagination ── */}
      {count > 1 && (
        <div className="site-container relative mt-8">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {projects.map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToIndex(i)}
                  aria-label={`Go to project ${i + 1} of ${count}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1C3A]"
                  style={{
                    width: isActive ? 30 : 10,
                    background: isActive ? 'rgb(var(--accent-light))' : 'rgba(255,255,255,0.24)',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
