import { Link } from 'react-router-dom';
import QuoteForm from './QuoteForm';
import { brandDNA } from '../config/brand-dna';

/**
 * Silo layout primitives — the shared building blocks for the 70/30 pages
 * (service detail and service-area detail). Both page types render the same
 * bands, headings, call buttons, icon medallions, body copy and sticky rail,
 * so the two never drift apart.
 *
 * Exports components only, so fast-refresh stays happy.
 */

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Two column widths:
//   'silo' — 67% of the container with a right gutter, leaving the right third
//            clear for the sticky enquiry rail. Used by the DETAIL pages
//            (/services/:slug, /service-areas/:slug).
//   'full' — the whole container, for the LISTING pages (/services,
//            /service-areas), which carry no sticky rail.
const COLS = {
  silo: 'relative w-full lg:w-[67%] lg:pr-8',
  full: 'relative w-full',
};

// Bands run full-bleed and alternate white / pale blue down the page; `dark`
// is the deep navy premium surface, used to close the page out.
const TONES = {
  white: {
    background: 'linear-gradient(170deg, #FFFFFF 0%, #FDFEFF 60%, #F8FBFE 100%)',
    rule: 'rgb(var(--accent) / 0.25)',
  },
  light: {
    background:
      'radial-gradient(46% 42% at 8% 10%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
      'radial-gradient(42% 40% at 96% 16%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
      'linear-gradient(170deg, #F6F9FD 0%, #EFF4FB 55%, #E9F0F9 100%)',
    rule: 'rgb(var(--accent) / 0.25)',
  },
  dark: {
    background:
      'radial-gradient(52% 46% at 10% 8%, rgba(44,90,166,0.34) 0%, transparent 62%),' +
      'radial-gradient(46% 42% at 92% 16%, rgba(110,143,196,0.20) 0%, transparent 64%),' +
      'radial-gradient(58% 50% at 45% 104%, rgba(44,90,166,0.22) 0%, transparent 62%),' +
      'linear-gradient(168deg, #0B1C3A 0%, #10284F 52%, #0A1730 100%)',
    rule: 'rgba(255,255,255,0.28)',
  },
};

const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h2.2a1 1 0 0 1 .95.68l1.2 3.6a1 1 0 0 1-.5 1.2l-1.7.85a11 11 0 0 0 5.02 5.02l.85-1.7a1 1 0 0 1 1.2-.5l3.6 1.2a1 1 0 0 1 .68.95v2.2A2.5 2.5 0 0 1 16.5 19h-.5C9.37 19 5 14.63 5 8v-.5z" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

/**
 * Section CTA — the site's global glass button, on every content block.
 * `label` defaults to the bare phone number; pass a fuller string (e.g.
 * "Call (509) 518-0747") where the section wants it spelled out.
 */
export function CallNow({ className = '', label }) {
  return (
    <a
      href={`tel:${brandDNA.contact.phoneTelLink}`}
      className={`btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em] ${className}`}
      style={{ fontFamily: JOSEFIN, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)' }}
    >
      <PhoneIcon className="h-[18px] w-[18px]" />
      {label || brandDNA.contact.phone}
    </a>
  );
}

/** Full-bleed band holding one section. `width` picks the column — see COLS. */
export function Band({ tone = 'white', width = 'silo', children }) {
  const t = TONES[tone] || TONES.white;
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      <div aria-hidden className="absolute inset-0" style={{ background: t.background }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.rule}, transparent)` }} />
      <div className="site-container relative">
        <div className={COLS[width] || COLS.silo}>{children}</div>
      </div>
    </section>
  );
}

/**
 * `align="center"` centres the eyebrow, heading and rule. Default is left,
 * which is what every existing caller renders, so nothing else moves.
 */
export function SectionHead({ eyebrow, title, tone = 'white', align = 'left' }) {
  const dark = tone === 'dark';
  const centered = align === 'center';
  const accent = dark ? 'rgb(var(--accent-light))' : 'rgb(var(--accent))';
  return (
    <div className={centered ? 'text-center' : undefined}>
      {eyebrow && (
        <p
          className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent, fontFamily: INTER }}
        >
          <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: accent }} />
          {eyebrow}
        </p>
      )}
      <h2 className="section-h2 uppercase" style={{ color: dark ? '#FFFFFF' : 'rgb(var(--primary))' }}>{title}</h2>
      <span
        className={`mt-4 block h-[3px] w-12 rounded-full ${centered ? 'mx-auto' : ''}`}
        style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }}
      />
    </div>
  );
}

/**
 * Glass medallion — the site's global icon container, used static here and
 * sized down to 40px so it supports the copy rather than dominating it.
 */
export function Medallion({ children, size = 40, radius = 13 }) {
  return (
    <span
      className="relative flex flex-shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 18px -10px rgba(16,40,79,0.5)',
        color: 'rgb(var(--on-accent))',
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[44%]" style={{ borderRadius: radius - 4, background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
      {children}
    </span>
  );
}

/**
 * Readable measure for running text inside a FULL-width band (the listing
 * pages). Silo bands are already narrow, so they do not need it.
 */
export function Prose({ className = '', children }) {
  return <div className={`max-w-[74ch] ${className}`}>{children}</div>;
}

/**
 * The sticky quote rail — used by the DETAIL pages only. In the flow on
 * tablet/mobile (wherever it sits in the DOM); an overlay column pinned beside
 * the content from lg up. `.sticky-rail` owns the offset that clears the fixed
 * header. `pointer-events` are re-enabled on the card alone, so the overlay
 * never swallows clicks on the left column. The rail's vertical padding is what
 * stops the form short of the last band's edge, so it can never ride into the
 * footer.
 *
 * Must be rendered inside a `relative` wrapper that spans the whole band stack.
 */
export function StickyRail({ formId, title = 'Get Your Free Estimate' }) {
  return (
    <div className="relative py-12 lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:py-0">
      <div className="site-container lg:relative lg:h-full">
        <div className="mx-auto w-full max-w-[435px] lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:h-full lg:w-[30%] lg:py-14">
          <div className="lg:pointer-events-auto sticky-rail">
            <QuoteForm formId={formId} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Copy-deck body renderer, shared by the silo page types (service detail,
 * service-area detail and blog detail). Recognises:
 *   - <!-- SUBSERVICE_START: Title --> ... <!-- SUBSERVICE_END --> markers,
 *     which wrap the enclosed range in a visually distinct zone so an umbrella
 *     page reads as zones, not one stacked stream.
 *   - ## and ### headings, - bulleted lists, 1. ordered lists, > blockquotes,
 *     *emphasis* spans, **bold** runs and [inline](links).
 *   - Defensively SKIPS any heading matching faq / frequently asked / common
 *     questions / service faq, so even if the parser missed stripping the FAQ
 *     block, the FAQAccordion below stays the single source of truth.
 */
const FAQ_HEADING_RE = /^(faq|frequently asked questions?|common questions?|service faq)\s*$/i;
const SUB_START_RE = /^<!--\s*SUBSERVICE_START:\s*(.+?)\s*-->$/;
const SUB_END_RE = /^<!--\s*SUBSERVICE_END\s*-->$/;
const ORDERED_RE = /^\d+\.\s+/;

// Inline runs: **bold**, *emphasis* and [label](href). Internal hrefs route
// through the router; anything external opens in a new tab.
function renderInline(text) {
  const parts = String(text).split(/(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((seg, k) => {
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(seg);
    if (link) {
      const [, label, href] = link;
      const cls = 'font-semibold text-[rgb(var(--accent))] underline underline-offset-2 transition-colors duration-300 ease-out hover:text-[rgb(var(--primary))]';
      // Internal path -> router. mailto:/tel: -> plain anchor (a new tab would
      // leave an empty window behind). Anything else is external.
      if (href.startsWith('/')) return <Link key={k} to={href} className={cls}>{label}</Link>;
      if (/^(mailto:|tel:)/i.test(href)) return <a key={k} href={href} className={cls}>{label}</a>;
      return <a key={k} href={href} className={cls} target="_blank" rel="noopener noreferrer">{label}</a>;
    }
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return <strong key={k} className="font-semibold text-[rgb(var(--primary-dark))]">{seg.slice(2, -2)}</strong>;
    }
    if (seg.startsWith('*') && seg.endsWith('*')) {
      return <em key={k} className="font-semibold not-italic text-[rgb(var(--primary-dark))]">{seg.slice(1, -1)}</em>;
    }
    return seg;
  });
}

function renderBlock(block, key) {
  const t = block.trim();
  if (!t) return null;

  if (t.startsWith('### ')) {
    const heading = t.replace(/^###\s+/, '').replace(/\*([^*]+)\*/g, '$1').trim();
    if (FAQ_HEADING_RE.test(heading)) return null;
    return (
      <h4
        key={key}
        className="mb-3 mt-8 text-[16px] font-bold uppercase leading-[1.3] tracking-[0.04em] sm:text-[17px]"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
      >
        {heading}
      </h4>
    );
  }

  if (t.startsWith('## ')) {
    const heading = t.replace(/^##\s+/, '').replace(/\*([^*]+)\*/g, '$1').trim();
    if (FAQ_HEADING_RE.test(heading)) return null;
    return (
      <h3
        key={key}
        className="mb-4 mt-10 text-[20px] font-bold uppercase leading-[1.25] sm:text-[22px]"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
      >
        {heading}
      </h3>
    );
  }

  // Blockquote — accent rail, larger type, no quotation marks added.
  if (t.startsWith('> ')) {
    const quote = t.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ').trim();
    return (
      <blockquote
        key={key}
        className="mb-6 mt-2 rounded-r-[14px] py-3 pl-6 pr-4 text-[16px] italic leading-[1.75] text-ink/80"
        style={{ fontFamily: INTER, borderLeft: '3px solid rgb(var(--accent))', background: 'rgb(var(--accent) / 0.06)' }}
      >
        {renderInline(quote)}
      </blockquote>
    );
  }

  if (t.startsWith('- ')) {
    const items = t.split(/\n- /).map((s) => s.replace(/^- /, '').trim()).filter(Boolean);
    return (
      <ul key={key} className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
        {items.map((item, j) => (
          <li key={j} className="flex items-start gap-3 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            <CheckIcon className="mt-[5px] h-[15px] w-[15px] flex-shrink-0" style={{ color: 'rgb(var(--accent))' }} />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Ordered list — numerals in an accent chip so they read as steps.
  if (ORDERED_RE.test(t)) {
    const items = t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(ORDERED_RE, ''));
    return (
      <ol key={key} className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
        {items.map((item, j) => (
          <li key={j} className="flex items-start gap-3 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            <span
              className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: 'rgb(var(--accent) / 0.12)', color: 'rgb(var(--accent))' }}
            >
              {j + 1}
            </span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p key={key} className="mb-5 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
      {renderInline(t)}
    </p>
  );
}

export function SiloBody({ body }) {
  if (!body) return null;

  const rawBlocks = body.trim().split(/\n\s*\n/);
  // Walk blocks once, grouping any range between SUBSERVICE_START and
  // SUBSERVICE_END into a single styled zone.
  const out = [];
  let i = 0;
  let zoneIdx = 0;
  while (i < rawBlocks.length) {
    const t = rawBlocks[i].trim();
    const startMatch = t.match(SUB_START_RE);
    if (startMatch) {
      const title = startMatch[1];
      const inner = [];
      i += 1;
      while (i < rawBlocks.length && !SUB_END_RE.test(rawBlocks[i].trim())) {
        inner.push(renderBlock(rawBlocks[i], `sub-${zoneIdx}-${i}`));
        i += 1;
      }
      // Skip the END marker if found
      if (i < rawBlocks.length) i += 1;
      out.push(
        <div key={`zone-${zoneIdx}`} className="mt-12 pt-10" style={{ borderTop: '1px solid rgb(var(--accent) / 0.25)' }}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>SUB-SERVICE</p>
          <h3 className="section-h2 mb-6 uppercase" style={{ color: 'rgb(var(--primary))' }}>{title}</h3>
          {inner}
        </div>
      );
      zoneIdx += 1;
      continue;
    }
    // Defensively swallow stray END markers
    if (SUB_END_RE.test(t)) { i += 1; continue; }
    out.push(renderBlock(rawBlocks[i], `b-${i}`));
    i += 1;
  }
  return <>{out}</>;
}
