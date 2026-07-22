import { useState } from 'react';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

/**
 * FAQAccordion — single shared accordion used by both the home FAQ.jsx and the
 * per-service ServiceDetailPage.jsx. One item open at a time.
 *
 * Props:
 *   items: [{ q: string, a: string }] — required
 *
 * Motion: the panel is always in the DOM inside a CSS grid whose single row
 * animates 0fr -> 1fr, with opacity and padding easing alongside it. That
 * interpolates the answer's NATURAL height, so unlike a max-height animation
 * there is no easing mismatch on short answers and no jump on long ones —
 * every item opens and closes at the same rate whatever its length.
 *
 * Visual contract:
 *   - Question row: dark navy card, white Josefin text, 20px radius
 *   - Answer panel: light surface below it, no accent rail, no borders
 *   - Toggle:       44px circle, chevron rotating 180 degrees
 *   - No hover states anywhere — the cards stay completely stable
 */
export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null);

  if (!items || items.length === 0) return null;

  // Sizing steps up with the viewport: tighter gaps, radius, padding and toggle
  // on tablet/mobile so a stack of questions does not dominate a small screen.
  // The desktop (sm and up) values are unchanged.
  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-[14px] shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_32px_-20px_rgba(16,40,79,0.5)] sm:rounded-[20px]"
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-[background] duration-[350ms] ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--accent-light))] sm:gap-4 sm:px-6 sm:py-5"
                style={{
                  background: isOpen
                    ? 'linear-gradient(150deg, rgb(var(--primary)) 0%, rgb(var(--primary-dark)) 100%)'
                    : 'linear-gradient(150deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-dark)) 100%)',
                }}
              >
                <span
                  className="pr-2 text-[14px] font-bold uppercase leading-[1.4] tracking-[0.03em] sm:text-[16px]"
                  style={{ fontFamily: JOSEFIN, color: '#FFFFFF' }}
                >
                  {item.q}
                </span>

                {/* Circular toggle — glass on the dark card, filled when open.
                    32px on mobile, the original 44px from sm up. */}
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-[background,box-shadow,transform] duration-[350ms] ease-in-out sm:h-11 sm:w-11"
                  style={
                    isOpen
                      ? {
                          background: 'rgba(255,255,255,1)',
                          border: '1px solid rgba(255,255,255,0.5)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 20px -10px rgba(0,0,0,0.6)',
                          color: 'var(--primary)',
                          transform: 'rotate(180deg)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.22)',
                          color: '#FFFFFF',
                          transform: 'rotate(0deg)',
                        }
                  }
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
            </h3>

            {/* Answer — height, opacity and padding all ease together. */}
            <div
              id={`faq-panel-${i}`}
              role="region"
              className="grid transition-[grid-template-rows,opacity] duration-[350ms] ease-in-out"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                opacity: isOpen ? 1 : 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgb(var(--accent) / 0.05) 100%)',
              }}
            >
              <div className="overflow-hidden">
                <div
                  className={`px-4 transition-[padding] duration-[350ms] ease-in-out sm:px-6 ${isOpen ? 'pb-4 pt-3.5 sm:pb-[22px] sm:pt-5' : 'pb-0 pt-0'}`}
                >
                  <p className="text-[14px] leading-[1.7] text-ink/70 sm:text-[14.5px] sm:leading-[1.75]" style={{ fontFamily: INTER }}>{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
