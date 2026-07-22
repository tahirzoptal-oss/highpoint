import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Cards per view: 3 desktop / 2 tablet / 1 mobile. SSR snapshot = 3.
const getPerView = () => {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
};
const subscribeResize = (cb) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

// Hover-pause is a pointer affordance only: touch devices keep autoplaying.
const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const AUTOPLAY_MS = 5000;

// Covers are authored as .png/.jpg in brand-dna but shipped as .webp.
const coverOf = (post) => (post.cover || '/work/project1.webp').replace(/\.(png|jpe?g)$/i, '.webp');
const onCoverError = (e) => { e.target.style.background = '#E9F0F9'; e.target.src = ''; };

const ArrowRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// ── Meta icons (14px, 1.6 stroke) ──
const MetaIc = ({ children, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);
const CalendarIcon = (p) => <MetaIc {...p}><rect x="3.2" y="4.8" width="17.6" height="16" rx="2.4" /><path d="M3.2 9.6h17.6M8 2.8v4M16 2.8v4" /></MetaIc>;
const ClockIcon = (p) => <MetaIc {...p}><circle cx="12" cy="12" r="8.8" /><path d="M12 7.2V12l3.2 1.9" /></MetaIc>;
const UserIcon = (p) => <MetaIc {...p}><circle cx="12" cy="8" r="3.6" /><path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" /></MetaIc>;

const MetaItem = ({ icon, children }) => {
  const Icon = icon;
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'rgb(var(--accent) / 0.75)' }} />
      <span className="truncate">{children}</span>
    </span>
  );
};

const MetaDivider = () => (
  <span aria-hidden className="h-3 w-px flex-shrink-0" style={{ background: 'rgb(var(--accent) / 0.25)' }} />
);

// Circular glass nav button — the site's global control treatment. Fixed in
// place; only background, icon colour and shadow move on hover.
const ArrowBtn = ({ dir, onClick, label, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[rgb(var(--primary))] shadow-[0_10px_26px_-14px_rgba(16,40,79,0.5)] backdrop-blur-md transition-[background-color,color] duration-300 ease-out hover:bg-[rgb(var(--primary))] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 lg:h-12 lg:w-12 ${className}`}
    style={{ border: '1px solid rgba(16,40,79,0.1)' }}
  >
    <Chevron dir={dir} className="h-[18px] w-[18px]" />
  </button>
);

/**
 * Blog card — cover on top, copy below. Stretches to the tallest in the row.
 * The post brand-dna flags as `featured` keeps the extra weight the reference
 * layout gives its lead story: a taller cover, a FEATURED chip, an accent ring
 * and a larger title — without breaking the equal-height grid.
 */
export function PostCard({ post, tabbable = true, featured }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      tabIndex={tabbable ? 0 : -1}
      // Every card carries the SAME soft shadow so the row reads at one visual
      // weight. The featured post is distinguished by its accent ring, chip and
      // larger title — not by floating higher than its neighbours.
      className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_12px_30px_-16px_rgba(16,40,79,0.18)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_20px_40px_-18px_rgba(16,40,79,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
      style={{ border: featured ? '1px solid rgb(var(--accent) / 0.3)' : '1px solid rgba(16,40,79,0.07)' }}
    >
      {/* Every cover uses the SAME aspect ratio and object-cover, so images of
          any native dimensions render at identical height with no layout shift. */}
      <span className="relative block aspect-[16/10] flex-shrink-0 overflow-hidden">
        <img
          src={coverOf(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
          loading="lazy"
          decoding="async"
          onError={onCoverError}
        />
        {/* soft base scrim so the category chip always reads */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5" style={{ background: 'linear-gradient(to top, rgba(8,18,38,0.55), transparent)' }} />

        {featured && brandDNA.copy.blog.featuredLabel && (
          <span
            className="absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.14em]"
            style={{
              background: 'linear-gradient(150deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'rgb(var(--on-accent))',
              fontFamily: INTER,
            }}
          >
            {brandDNA.copy.blog.featuredLabel}
          </span>
        )}

        {post.category && (
          <span
            className="absolute bottom-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em]"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'rgb(var(--primary-dark))',
              fontFamily: INTER,
            }}
          >
            {post.category}
          </span>
        )}
      </span>

      <span className="flex flex-1 flex-col p-5">
        {/* Compact meta: date and read time share a row behind hairline
            separators; the byline sits beneath so a long agency string never
            forces the row to wrap mid-item. */}
        {(post.date || post.readTime) && (
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium tracking-[0.04em] text-ink/50" style={{ fontFamily: INTER }}>
            {post.date && <MetaItem icon={CalendarIcon}>{post.date}</MetaItem>}
            {post.date && post.readTime && <MetaDivider />}
            {post.readTime && <MetaItem icon={ClockIcon}>{post.readTime}</MetaItem>}
          </span>
        )}
        {post.byline && (
          <span className="mt-1.5 flex min-w-0 items-center text-[11px] font-medium tracking-[0.04em] text-ink/45" style={{ fontFamily: INTER }}>
            <MetaItem icon={UserIcon}>{post.byline}</MetaItem>
          </span>
        )}

        <h3
          className={`mt-2.5 font-bold uppercase leading-[1.3] transition-colors duration-300 ease-out group-hover:text-[rgb(var(--accent))] ${featured ? 'text-[18px]' : 'text-[16px]'}`}
          style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
        >
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.65] text-ink/65" style={{ fontFamily: INTER }}>
          {post.excerpt}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}>
          Read More
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
        </span>
      </span>
    </Link>
  );
}

/**
 * Blog carousel. The post list is rendered THREE times and `pos` starts in the
 * middle copy, so the strip is continuous in both directions; once a slide
 * transition finishes, `pos` is silently snapped back into the middle copy
 * with the animation off. Widths are percentages of the track, so the 3/2/1
 * breakpoints need no measurement.
 */
export default function Blog() {
  // Latest posts in brand-dna order, with the flagged featured story pulled to
  // the front so the strip opens on it.
  const all = brandDNA.blog_posts || [];
  const featuredSlug = (all.find((p) => p.featured) || all[0] || {}).slug;
  const posts = all.slice().sort((a, b) => (a.slug === featuredSlug ? -1 : b.slug === featuredSlug ? 1 : 0));
  const count = posts.length;

  const perView = useSyncExternalStore(subscribeResize, getPerView, () => 3);
  const [pos, setPos] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const trackRef = useRef(null);

  const step = useCallback((delta) => setPos((p) => { setAnimate(true); return p + delta; }), []);

  // Autoplay. `paused` is a dependency, so hovering tears the timer down
  // immediately and leaving rebuilds a full-length interval.
  useEffect(() => {
    if (count <= perView || paused) return undefined;
    const id = setInterval(() => { setAnimate(true); setPos((p) => p + 1); }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, perView, paused]);

  const onTransitionEnd = (e) => {
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
    if (pos >= count * 2 || pos < count) {
      setAnimate(false);
      setPos(((pos % count) + count) % count + count);
    }
  };

  if (count === 0) return null;

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

  const loop = [...posts, ...posts, ...posts];
  const slidePct = 100 / loop.length;          // one slide, as % of the track
  const trackPct = (loop.length / perView) * 100; // track, as % of the viewport
  const showNav = count > perView;

  return (
    <section id="blog" className="relative overflow-hidden py-14 lg:py-20">
      {/* ── Soft mesh base — theme-blue radial pools over a pale wash ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 44% at 90% 10%, rgba(110,143,196,0.18) 0%, transparent 62%),' +
            'radial-gradient(44% 40% at 8% 16%, rgba(44,90,166,0.12) 0%, transparent 64%),' +
            'radial-gradient(52% 48% at 50% 100%, rgba(24,60,120,0.10) 0%, transparent 62%),' +
            'linear-gradient(170deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)',
        }}
      />

      {/* ── Architectural decoration ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        
        <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.18)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />
      </div>

      <div className="site-container relative">
        {/* ── Header ── */}
        <div>
          <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
            <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
            {brandDNA.copy.blog.label}
          </p>

          <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
            {brandDNA.copy.blog.heading}
          </h2>

          <span className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
        </div>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
          {brandDNA.copy.blog.body}
        </p>

        {/* ── Carousel. Vertical padding only: `overflow-hidden` clips at the
               PADDING box, so any horizontal padding would let the neighbouring
               slides bleed into it as slivers. Clipping flush to the container
               edge keeps exactly `perView` cards visible. ── */}
        <div
          className="relative mt-8 lg:mt-10"
          onMouseEnter={() => { if (canHover()) setPaused(true); }}
          onMouseLeave={() => { if (canHover()) setPaused(false); }}
        >
          <div
            className="overflow-hidden py-6 outline-none"
            role="group"
            aria-roledescription="carousel"
            aria-label={brandDNA.copy.blog.label}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
          >
            <div
              ref={trackRef}
              className="flex items-stretch"
              onTransitionEnd={onTransitionEnd}
              style={{
                width: `${trackPct}%`,
                transform: `translate3d(-${pos * slidePct}%, 0, 0)`,
                transition: animate ? 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                willChange: 'transform',
              }}
            >
              {loop.map((post, i) => (
                <div key={i} className="flex-shrink-0 px-2.5" style={{ width: `${slidePct}%` }}>
                  <PostCard post={post} tabbable={i >= pos && i < pos + perView} featured={post.slug === featuredSlug} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows flank the slider from sm up, vertically centred — outside
              the cards entirely at lg, overlaying the slider edges between.
              On MOBILE they leave the card area altogether and sit in a centred
              row beneath the strip, so they can never cover a cover image or a
              headline on a narrow screen. */}
          {showNav && (
            <>
              <ArrowBtn
                dir="left"
                label="Previous articles"
                onClick={() => step(-1)}
                className="hidden sm:absolute sm:left-2 sm:top-1/2 sm:flex sm:-translate-y-1/2 lg:-left-[46px] xl:-left-14"
              />
              <ArrowBtn
                dir="right"
                label="Next articles"
                onClick={() => step(1)}
                className="hidden sm:absolute sm:right-2 sm:top-1/2 sm:flex sm:-translate-y-1/2 lg:-right-[46px] xl:-right-14"
              />
            </>
          )}
        </div>

        {/* Mobile-only arrow row, clear of the cards */}
        {showNav && (
          <div className="mt-2 flex items-center justify-center gap-3 sm:hidden">
            <ArrowBtn dir="left" label="Previous articles" onClick={() => step(-1)} />
            <ArrowBtn dir="right" label="Next articles" onClick={() => step(1)} />
          </div>
        )}
      </div>
    </section>
  );
}
