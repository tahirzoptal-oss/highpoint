import { useLeadForm } from '../lib/leadForm';
import { HOME_HERO_FORM } from '../config/form-ids';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Light theme inputs — white field, subtle navy border, accent focus ring
// (the .form-input class supplies the focus state from index.css).
const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid rgba(16,40,79,0.16)',
  color: 'rgb(var(--ink))',
  fontFamily: INTER,
};

/**
 * Floating lead-generation form. Rendered on the homepage BETWEEN the hero and
 * the logo slider; a negative top margin lifts it so it floats over the bottom
 * of the hero WITHOUT covering the hero content (review badges etc.).
 * Keeps `id="quote"` on the SECTION so the header CTA still scrolls here. That
 * is a scroll anchor, not the form's identity: the <form> inside carries its
 * own `formId` (HOME_HERO_FORM), which is what identifies the submission.
 *
 * The SECTION itself has no background. A single tint layer starts exactly
 * where the hero ends (top-16 / lg:top-32 == the negative top margin) and runs
 * to the bottom, so it is continuous with the LogoSlider below. Net effect: the
 * hero artwork stays fully visible behind the upper part of the card and the
 * card genuinely straddles the hero → logo-slider seam. No white block.
 */
export default function LeadFormBanner({ formId = HOME_HERO_FORM }) {
  const { honeypotProps, onSubmit } = useLeadForm(formId);

  return (
    <section id="quote" className="relative z-30 -mt-16 lg:-mt-32">
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-16 bg-[#F4F7FC] lg:top-32" />

      <div className="site-container relative">
        <div
          className="rounded-[28px] bg-white px-5 py-5 sm:px-8 sm:py-8"
          style={{
            boxShadow:
              '0 44px 88px -30px rgba(16,40,79,0.42), 0 16px 36px -18px rgba(16,40,79,0.22), 0 2px 6px -2px rgba(16,40,79,0.08)',
            border: '1px solid rgba(16,40,79,0.06)',
          }}
        >
          <div className="mb-4 flex items-center justify-center gap-3 sm:mb-5">
            <h2 className="text-xl font-bold uppercase sm:text-2xl" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary))' }}>
              Request Your Free Inspection Now
            </h2>
          </div>

          {/* Desktop: single row (5 fields + button). Tablet: two rows (3 cols). Mobile: stacked. */}
          <form
            id={formId}
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3.5 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-stretch"
          >
            <input {...honeypotProps} />
            <input name="name" required aria-required="true" placeholder="Name*" className="form-input rounded-lg px-4 py-2.5 text-sm sm:py-3.5" style={inputStyle} />
            <input name="email" type="email" required aria-required="true" placeholder="Email*" className="form-input rounded-lg px-4 py-2.5 text-sm sm:py-3.5" style={inputStyle} />
            <input name="phone" type="tel" required aria-required="true" placeholder="Phone*" className="form-input rounded-lg px-4 py-2.5 text-sm sm:py-3.5" style={inputStyle} />
            <input name="address" placeholder="Address" className="form-input rounded-lg px-4 py-2.5 text-sm sm:py-3.5" style={inputStyle} />
            <input name="service" placeholder="How Can We Assist?" className="form-input rounded-lg px-4 py-2.5 text-sm sm:py-3.5" style={inputStyle} />
            <button
              type="submit"
              className="btn-gold w-full whitespace-nowrap px-8 py-3 text-[13px] font-bold uppercase tracking-[0.08em] sm:py-3.5 lg:w-auto"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
