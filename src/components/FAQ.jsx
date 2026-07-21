import { brandDNA } from '../config/brand-dna';
import FAQAccordion from './FAQAccordion';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

export default function FAQ() {
  const c = brandDNA.copy.faq;

  return (
    <section id="faq" className="relative overflow-hidden py-14 lg:py-20">

      <div className="site-container relative">
        {/* ── Centred header ── */}
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
            <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
            {c.label}
          </p>

          <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
            {c.heading}
          </h2>

          <span className="mx-auto mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
        </div>

        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={brandDNA.faq} />
        </div>
      </div>
    </section>
  );
}
