import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import ServiceAreas from '../components/ServiceAreas';
import CTABanner from '../components/CTABanner';
import { CTA_FORM } from '../config/form-ids';
import SEO from '../components/SEO';
// Same layout primitives as the service detail pages, so the index and the
// pages it links to read as one family.
import { Band, SectionHead, CallNow, Medallion, Prose } from '../components/SiloSection';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const CARD =
  'rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]';
const CARD_BORDER = { border: '1px solid rgba(16,40,79,0.07)' };

const ArrowRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

// Strip internal research annotations from a service description so only the
// customer-facing copy renders (some description_short values carry sourcing
// notes like "Evidenced by ..." that never belong on a live page).
function cleanDescription(text) {
  if (!text) return '';
  let out = text;
  for (const marker of [' Evidenced by', ' Not shown', ' Sourced from']) {
    const i = out.indexOf(marker);
    if (i !== -1) out = out.slice(0, i);
  }
  return out.trim();
}

export default function ServicesPage() {
  return (
    <>
      <SEO
        path="/services"
        title={`Our Services | ${brandDNA.company.name}`}
        description="Roof inspections, repairs, installation, replacement, and home renovation in Kennewick and the Tri-Cities, WA. Honest, owner-operator work."
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title={brandDNA.copy.services.heading}
        subtitle={brandDNA.copy.services.body}
        breadcrumb={[{ label: 'Services' }]}
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ Content — full-width bands, alternating white / pale blue. The
             global CTA banner closes the page. No sticky sidebar here — that
             belongs to the individual service / service-area pages. ════ */}

      {/* ── Every service, as a card ── */}
      <Band tone="white" width="full">
        <SectionHead eyebrow="OUR SERVICES" title="A Closer Look At Each Service" />
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 lg:mt-10 lg:grid-cols-2">
          {brandDNA.services.map((s) => (
            <li key={s.slug || s.name} className="flex">
              <Link
                to={`/services/${s.slug}`}
                className={`group flex h-full w-full flex-col p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_22px_46px_-20px_rgba(16,40,79,0.3)] lg:p-7 ${CARD}`}
                style={CARD_BORDER}
              >
                <h3
                  className="text-[20px] font-bold uppercase leading-[1.25] transition-colors duration-300 ease-out group-hover:text-[rgb(var(--accent))] sm:text-[22px]"
                  style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                >
                  {s.name}
                </h3>
                <span className="mt-4 block h-[3px] w-10 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
                <p className="mt-4 flex-1 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                  {cleanDescription(s.description_short)}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em]"
                  style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}
                >
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <CallNow className="mt-8" />
      </Band>

      {/* ── How we work ── */}
      <Band tone="light" width="full">
        <SectionHead eyebrow={brandDNA.copy.process.label} title={brandDNA.copy.process.heading} />
        <Prose>
          <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            {brandDNA.copy.process.body}
          </p>
        </Prose>
        <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {brandDNA.process_steps.map((step, i) => (
            <li key={step.n ?? i} className={`flex items-start gap-4 p-5 ${CARD}`} style={CARD_BORDER}>
              <Medallion>
                <span className="relative text-[15px] font-bold leading-none" style={{ fontFamily: JOSEFIN }}>
                  {String(step.n ?? i + 1).padStart(2, '0')}
                </span>
              </Medallion>
              <div className="min-w-0">
                <h3
                  className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
                  style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <CallNow className="mt-8" />
      </Band>

      {/* ── Where we work — the shared stacked section, bare and on a
             light band so it sits with the rest of the page. ── */}
      <ServiceAreas variant="light" />

      {/* ── Global CTA banner ── */}
      <CTABanner formId={CTA_FORM.services} />
    </>
  );
}
