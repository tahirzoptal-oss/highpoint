import { useEffect, useRef } from 'react';

// Wave 2 (2026-05-16 research bake): zero-dependency scroll-driven fade-in.
// Wraps children in a div that fades opacity 0->1 + translates y 24px->0 over
// 600ms when it crosses 12% into the viewport. Stagger siblings with --stagger
// css var (number of milliseconds). Honors prefers-reduced-motion via the
// global guard in index.css (which zeros animation/transition duration).
//
// Usage:
//   <FadeOnEnter><div>I fade up</div></FadeOnEnter>
//   <FadeOnEnter delay={80}>{...}</FadeOnEnter>
//
// Performance: a single IntersectionObserver is reused across all instances
// via module-level state. Once an element fades in it is unobserved so it
// never re-fires on scroll back-up (Section 7 of the research file).
let _observer = null;
const _pending = new WeakSet();

function getObserver() {
  if (_observer) return _observer;
  if (typeof IntersectionObserver === 'undefined') return null;
  _observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          _observer.unobserve(entry.target);
          _pending.delete(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  return _observer;
}

export default function FadeOnEnter({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = getObserver();
    if (!ob) {
      // SSR / no IntersectionObserver: render visible immediately
      el.classList.add('is-in-view');
      return;
    }
    if (!_pending.has(el)) {
      _pending.add(el);
      ob.observe(el);
    }
    return () => {
      ob.unobserve(el);
      _pending.delete(el);
    };
  }, []);

  const style = delay ? { transitionDelay: `${delay}ms`, ...(rest.style || {}) } : rest.style;
  const cls = `fade-on-enter ${className}`.trim();

  return (
    <Tag ref={ref} className={cls} {...rest} style={style}>
      {children}
    </Tag>
  );
}
