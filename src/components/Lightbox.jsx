import { useCallback, useEffect, useRef } from 'react';

const Chevron = ({ dir, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M6 18 18 6M6 6l12 12" />
  </svg>
);

// Circular glass control — the site's global button treatment, tuned for a
// dark overlay. Colour-only hover, no translate.
const CtrlBtn = ({ onClick, label, className = '', children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[rgb(var(--primary))] backdrop-blur-md transition-[background-color,color] duration-300 ease-out hover:bg-[rgb(var(--accent))] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080F1C] lg:h-12 lg:w-12 ${className}`}
    style={{ border: '1px solid rgba(255,255,255,0.55)' }}
  >
    {children}
  </button>
);

/**
 * Lightbox — distraction-free modal image viewer for the gallery.
 *
 * Props:
 *   items    [{ src, alt }]  required
 *   index    number | null   the open item; null closes the modal
 *   onClose  ()  => void
 *   onIndex  (i) => void     parent owns the index so prev/next wrap
 *
 * Deliberately minimal: the image, Previous/Next and Close. No zoom, caption
 * or counter. Handles Esc / ArrowLeft / ArrowRight, locks body scroll while
 * open, restores focus to whatever opened it, and cross-fades between images.
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index >= 0 && items.length > 0;
  const openerRef = useRef(null);
  const panelRef = useRef(null);

  const go = useCallback(
    (delta) => {
      if (!items.length) return;
      onIndex(((index + delta) % items.length + items.length) % items.length);
    },
    [index, items.length, onIndex]
  );

  // Remember the trigger so focus can return to it, and move focus into the
  // dialog when it opens.
  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    panelRef.current?.focus();
    return () => {
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [open]);

  // Body scroll lock.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, go]);

  if (!open) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(8,15,28,0.94)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      {/* Close — pinned to the viewport corner so it never overlaps the photo */}
      <CtrlBtn onClick={onClose} label="Close gallery" className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <CloseIcon className="h-5 w-5" />
      </CtrlBtn>

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-5xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="overflow-hidden rounded-[20px]"
          style={{ border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.85)' }}
        >
          {/* `key` forces a fresh element per image so the fade-in replays. */}
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className="lightbox-image block w-full object-contain"
            style={{ maxHeight: '82vh', background: '#0B1C3A' }}
            decoding="async"
          />
        </div>
      </div>

      {items.length > 1 && (
        <>
          <CtrlBtn
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-6 lg:left-10"
          >
            <Chevron dir="left" className="h-5 w-5" />
          </CtrlBtn>
          <CtrlBtn
            onClick={(e) => { e.stopPropagation(); go(1); }}
            label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-6 lg:right-10"
          >
            <Chevron dir="right" className="h-5 w-5" />
          </CtrlBtn>
        </>
      )}
    </div>
  );
}
