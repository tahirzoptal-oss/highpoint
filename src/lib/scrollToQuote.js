/**
 * The single destination for every primary "Get a Free Quote" CTA: the CTA
 * banner section (`id="get-free-quote"`).
 *
 * CTABanner renders on every content page, but NOT on /404 or /thank-you — so
 * a bare `href="#get-free-quote"` would be a dead click there. This helper
 * scrolls when the section is on the current page and falls back to navigating
 * home with the hash otherwise; Layout's ScrollManager finishes the scroll
 * after that route change.
 *
 * Usage:
 *   const navigate = useNavigate();
 *   <a href={QUOTE_HASH} onClick={(e) => goToQuote(e, navigate)}>…</a>
 */
export const QUOTE_SECTION_ID = 'get-free-quote';
export const QUOTE_HASH = `#${QUOTE_SECTION_ID}`;

export function goToQuote(event, navigate) {
  if (event) event.preventDefault();
  const el = typeof document !== 'undefined' && document.getElementById(QUOTE_SECTION_ID);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (navigate) navigate(`/${QUOTE_HASH}`);
}
