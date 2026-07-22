import { brandDNA } from '../config/brand-dna';
import { useLeadForm } from '../lib/leadForm';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Field shell. `.form-input` is kept so the global focus ring in index.css
// (accent border + 3px halo) still applies; everything else is set here.
// The wrapper carries `theme-keep-dark`, which is what excludes these fields
// from the light-theme `.form-input` override — do not remove it.
const FIELD_CLASS = 'form-input w-full rounded-[12px] px-4 text-[14px]';
const fieldStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#FFFFFF',
  fontFamily: INTER,
  height: 48,
};

/**
 * Reusable lead-capture form for inner pages and the service-page sticky rail.
 * Self-contained: honeypot + useLeadForm submit + real `name` attributes so
 * submissions are actually captured (the go-live CRM webhook attaches through
 * useLeadForm's onLead). Single-column so it fits a narrow sidebar. Drop it
 * inside a `.sticky-rail` wrapper to get the sticky quote rail — that class
 * owns the offset that clears the fixed header (see index.css).
 */
export default function QuoteForm({ formId = 'quote', title, subtitle }) {
  const { honeypotProps, onSubmit } = useLeadForm(formId);
  return (
    <div
      className="theme-keep-dark overflow-hidden rounded-[20px]"
      style={{
        background: 'linear-gradient(160deg, #10254C 0%, #0B1C3A 55%, #091629 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.45), 0 32px 64px -28px rgba(0,0,0,0.8)',
      }}
    >
      {/* accent hairline across the top */}
      <span aria-hidden className="block h-[3px] w-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))' }} />

      {/* Title + the site's own "we call you back" line. The reassurance copy
          at the foot of the form is deliberately the only other prose, so the
          panel never repeats itself. */}
      <div className="px-6 pb-5 pt-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
        <span
          className="block text-[21px] font-bold uppercase leading-[1.15]"
          style={{ fontFamily: JOSEFIN, color: '#FFFFFF', letterSpacing: '-0.005em' }}
        >
          {title || brandDNA.copy.buttonText}
        </span>
        <span className="mt-2.5 block text-[12.5px] leading-[1.6]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.55)' }}>
          {subtitle || brandDNA.copy.formHeader}
        </span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5 p-6">
        {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
        <input {...honeypotProps} />

        <input
          name="name"
          required
          className={`${FIELD_CLASS} placeholder-white/40`}
          placeholder="Your Name"
          style={fieldStyle}
        />
        <input
          name="phone"
          required
          type="tel"
          className={`${FIELD_CLASS} placeholder-white/40`}
          placeholder="Phone Number"
          style={fieldStyle}
        />
        <input
          name="email"
          type="email"
          className={`${FIELD_CLASS} placeholder-white/40`}
          placeholder="Email Address"
          style={fieldStyle}
        />
        {/* Free-text rather than a dropdown, so a caller can describe the job in
            their own words. Same `name`, so submission is unchanged. */}
        <input
          name="service"
          className={`${FIELD_CLASS} placeholder-white/40`}
          placeholder="How Can We Help?"
          style={fieldStyle}
        />

        <button
          type="submit"
          className="btn-gold mt-1 w-full px-6 py-[17px] text-[13.5px] uppercase tracking-[0.08em]"
          style={{ fontFamily: JOSEFIN, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
        >
          {brandDNA.copy.buttonText} &rarr;
        </button>

        <p className="text-center text-[11px] leading-[1.6]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.4)' }}>
          No obligation. No pressure. We will never send you unsolicited messages.
        </p>
      </form>
    </div>
  );
}
