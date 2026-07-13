import { useEffect, useRef } from 'react';

// Wave 2 (2026-05-16 research bake): word-by-word scroll-reveal for Hero H1.
// Source: 2026-05-16-web-design-research-deep-dive.md Section 7 + Tactic 9.
// "One scroll-linked headline reveal per page" — the cheapest premium motion
// signal. Each word transitions opacity 0.2 -> 1 staggered by 60ms as the
// element scrolls past 25% of viewport height.
//
// Zero-dependency. Uses IntersectionObserver to detect entry, then CSS
// transition handles the per-word reveal via .is-revealed class on the wrapper.
// Honors prefers-reduced-motion via the global CSS guard (which zeros the
// transition duration).
//
// Usage:
//   <ScrollRevealHeadline as="h1" className="...">
//     {brandDNA.copy.hero.headline}
//   </ScrollRevealHeadline>
export default function ScrollRevealHeadline({ children, as: Tag = 'h1', className = '', style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // SSR or unsupported: reveal immediately
      if (el) el.classList.add('is-revealed');
      return;
    }
    const ob = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            ob.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  // Split children into words while preserving original element structure for
  // simple string children. If children isn't a plain string, fall back to
  // single-block reveal (no per-word stagger). Premium effect happens with strings.
  const text = typeof children === 'string' ? children : null;

  if (!text) {
    return (
      <Tag ref={ref} className={`scroll-reveal-headline ${className}`} style={style}>
        <span className="srh-word">{children}</span>
      </Tag>
    );
  }

  const words = text.split(/(\s+)/);
  return (
    <Tag ref={ref} className={`scroll-reveal-headline ${className}`} style={style}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <span key={i} className="srh-word" style={{ transitionDelay: `${i * 30}ms` }}>
            {w}
          </span>
        )
      )}
    </Tag>
  );
}
