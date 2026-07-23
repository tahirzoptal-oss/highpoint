import { useEffect } from 'react';

/**
 * ChatWidgetOffset — keeps the LeadConnector chat widget clear of the fixed
 * mobile/tablet CTA bar (MobileCtaBar) without overlapping it or the footer.
 *
 * WHY THIS IS JS AND NOT CSS
 * The loader appends <chat-widget> straight to <body> (our loader <script> lives
 * in <body>, so the loader's container resolves to document.body — there is no
 * positioned wrapper we can target). The launcher `.lc_text-widget--bubble` is a
 * `position: fixed` element rendered INSIDE the component's Stencil shadow DOM,
 * and the component's own shadow CSS is `:host{ all:initial }`. `all:initial`
 * makes the host `display:inline`, and inline elements are NOT transformable, so
 * a `transform` set on <chat-widget> from page CSS is silently ignored — that is
 * why the earlier CSS-only fix never moved the bubble.
 *
 * The reliable fix is to inject a <style> INTO the widget's (open) shadow root
 * that lifts only the launcher bubble. Shadow-scoped rules are unaffected by
 * `:host{all:initial}` (which only resets the host, not shadow descendants), and
 * lifting the bubble alone leaves the open chat panel's layout intact.
 *
 * The lift is derived from the CTA's LIVE height (never hardcoded) plus a margin,
 * and is recomputed on resize / orientation change / CTA resize. When the sticky
 * bar is not present (desktop, >=1024px) the lift collapses to 0 and the widget
 * returns to its default position. The controller is mounted once in the
 * persistent Layout shell, so it survives SPA route changes (the widget and the
 * CTA both persist across navigation too).
 */

const MOBILE_MQ = '(max-width: 1024px)'; // matches MobileCtaBar's `lg:hidden`
const GAP = 0;                          // requested 16–24px clearance → 20px
const BUBBLE_FALLBACK_H = 58;            // .lc_text-widget--bubble height (widget CSS)
const STYLE_ID = 'hpr-chat-offset';
const CTA_SELECTOR = '[data-mobile-cta]';
const BUBBLE_SELECTOR = '.lc_text-widget--bubble';

export default function ChatWidgetOffset() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const root = document.documentElement;

    let shadow = null;
    let ctaEl = null;
    let ctaRO = null;
    let shadowMO = null;
    let pollId = 0;
    let raf = 0;

    const getCta = () =>
      ctaEl && ctaEl.isConnected ? ctaEl : (ctaEl = document.querySelector(CTA_SELECTOR));

    // Ensure our <style> node exists in the shadow root and return it.
    const ensureStyleNode = () => {
      if (!shadow) return null;
      let node = shadow.getElementById(STYLE_ID);
      if (!node) {
        node = document.createElement('style');
        node.id = STYLE_ID;
        shadow.appendChild(node);
      }
      return node;
    };

    // Core: measure the CTA, lift the bubble, reserve footer space.
    const apply = () => {
      raf = 0;
      const active = mq.matches;
      const cta = getCta();
      // getBoundingClientRect is 0 when the bar is display:none (desktop), which
      // naturally yields lift 0 there in addition to the matchMedia gate.
      const ctaH = active && cta ? Math.round(cta.getBoundingClientRect().height) : 0;
      const lift = ctaH ? ctaH + GAP : 0;

      // Lift ONLY the launcher bubble, inside the shadow root.
      const node = ensureStyleNode();
      if (node) {
        const css = lift
          ? `${BUBBLE_SELECTOR}{transform:translateY(-${lift}px)!important;}`
          : '';
        if (node.textContent !== css) node.textContent = css;
      }

      // Reserve footer-coloured space so the CTA + lifted bubble float over an
      // extension of the footer, keeping the copyright/links fully visible.
      // Prefer the bubble's real, post-transform top (exact); fall back to an
      // estimate from the CTA height when the bubble isn't rendered yet.
      let footerClear = 0;
      if (lift) {
        let measured = 0;
        const bubble = shadow && shadow.querySelector(BUBBLE_SELECTOR);
        if (bubble) {
          const r = bubble.getBoundingClientRect(); // forces the transform to flush
          if (r.height > 0 && r.top > 0) {
            measured = Math.round(window.innerHeight - r.top + GAP);
          }
        }
        const estimate = ctaH + GAP + BUBBLE_FALLBACK_H + GAP;
        footerClear = Math.max(measured, estimate);
      }
      if (footerClear) root.style.setProperty('--hpr-footer-clearance', `${footerClear}px`);
      else root.style.removeProperty('--hpr-footer-clearance');
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    // Attach to the widget's shadow root once it exists (loader is async), and
    // keep our <style> alive if the component re-renders and drops it.
    const attach = () => {
      const el = document.querySelector('chat-widget');
      if (!el) return false;
      shadow = el.shadowRoot || null;
      if (!shadow) return false; // element present but shadow not attached yet
      if (shadowMO) shadowMO.disconnect();
      shadowMO = new MutationObserver(() => schedule()); // re-inject + re-measure
      shadowMO.observe(shadow, { childList: true });
      schedule();
      return true;
    };

    // Observe the CTA's size so a future height change repositions the widget.
    const cta = getCta();
    if (cta && 'ResizeObserver' in window) {
      ctaRO = new ResizeObserver(schedule);
      ctaRO.observe(cta);
    }

    // Poll for the async-injected widget/shadow, then stop.
    if (!attach()) {
      let tries = 0;
      pollId = window.setInterval(() => {
        if (attach() || ++tries > 80) {
          window.clearInterval(pollId);
          pollId = 0;
        }
      }, 250); // up to ~20s
    }

    const onChange = () => schedule();
    window.addEventListener('resize', onChange, { passive: true });
    window.addEventListener('orientationchange', onChange);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange); // Safari < 14

    schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (pollId) window.clearInterval(pollId);
      if (ctaRO) ctaRO.disconnect();
      if (shadowMO) shadowMO.disconnect();
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
      // Restore default position on unmount.
      if (shadow) {
        const node = shadow.getElementById(STYLE_ID);
        if (node) node.remove();
      }
      root.style.removeProperty('--hpr-footer-clearance');
    };
  }, []);

  return null;
}
