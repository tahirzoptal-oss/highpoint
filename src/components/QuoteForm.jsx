import { brandDNA } from '../config/brand-dna';
import { useLeadForm } from '../lib/leadForm';

const glassInput = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'white',
};

// Reusable lead-capture form for inner pages. Self-contained: honeypot +
// useLeadForm submit + real `name` attributes so submissions are actually
// captured (the go-live CRM webhook attaches through useLeadForm's onLead).
// Single-column so it fits a narrow sidebar. Drop it inside a
// `lg:sticky lg:top-24` wrapper to get the inner-page sticky quote rail.
export default function QuoteForm({ formId = 'quote', title, subtitle }) {
  const { honeypotProps, onSubmit } = useLeadForm(formId);
  return (
    <div
      className="overflow-hidden theme-keep-dark"
      style={{
        background: 'rgba(38,38,42,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="heading-metallic font-heading font-bold text-white text-xl uppercase tracking-wide block">
          {title || brandDNA.copy.formHeader}
        </span>
        <span className="text-white/50 text-[11px] font-body">{subtitle || brandDNA.copy.formSubtext}</span>
      </div>

      <form onSubmit={onSubmit} className="p-4 flex flex-col gap-3">
        {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
        <input {...honeypotProps} />
        <input
          name="name"
          required
          className="form-input px-4 py-3 text-sm placeholder-white/40"
          placeholder="Your Name"
          style={glassInput}
        />
        <input
          name="phone"
          required
          type="tel"
          className="form-input px-4 py-3 text-sm placeholder-white/40"
          placeholder="Phone Number"
          style={glassInput}
        />
        <input
          name="email"
          type="email"
          className="form-input px-4 py-3 text-sm placeholder-white/40"
          placeholder="Email Address"
          style={glassInput}
        />
        <select
          name="service"
          defaultValue=""
          className="form-input px-4 py-3 text-sm"
          style={{ ...glassInput, color: 'rgba(255,255,255,0.75)' }}
        >
          <option value="" style={{ background: '#1E293B', color: 'white' }}>How Can We Help?</option>
          {brandDNA.services.map((s) => (
            <option key={s.slug} value={s.slug} style={{ background: '#1E293B', color: 'white' }}>{s.name}</option>
          ))}
        </select>
        <input
          name="address"
          className="form-input px-4 py-3 text-sm placeholder-white/40"
          placeholder="Property Address"
          style={glassInput}
        />
        <textarea
          name="message"
          rows={3}
          className="form-input px-4 py-3 text-sm placeholder-white/40"
          placeholder="Brief message (optional)"
          style={glassInput}
        />
        <button
          type="submit"
          className="btn-gold w-full font-heading font-bold text-base uppercase tracking-widest py-3.5 text-white"
        >
          {brandDNA.copy.buttonText} &rarr;
        </button>
        <p className="text-center text-white/35 font-body text-[10px]">
          No obligation. No pressure. We will never send you unsolicited messages.
        </p>
      </form>
    </div>
  );
}
