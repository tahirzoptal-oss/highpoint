import { useParams, Navigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import FAQAccordion from '../components/FAQAccordion';
import ServiceAreas from '../components/ServiceAreas';
import SEO from '../components/SEO';
// Shared layout primitives — the same bands, headings, buttons, medallions,
// body renderer and sticky rail the service-area detail pages use.
import { Band, SectionHead, CallNow, Medallion, CheckIcon, StickyRail, SiloBody } from '../components/SiloSection';
import { buildService, buildBreadcrumb, buildFAQ } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';
import { serviceQuoteFormId } from '../config/form-ids';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const CARD =
  'rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]';
const CARD_BORDER = { border: '1px solid rgba(16,40,79,0.07)' };

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const found = brandDNA.services.find((s) => s.slug === slug);
  if (!found) return <Navigate to="/services" replace />;
  // Service shape: base { slug, name, blurb } + optional rich fields.
  // Page degrades gracefully when a per-client service ships base-only.
  const service = {
    title: found.name.split(' ').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
    heroTitle: found.heroTitle || found.name,
    description: found.description || found.description_short || '',
    benefits: found.benefits || [],
    included: found.included || [],
    // No per-service `process` in this client's data: default to the shared
    // company process so "How It Works" always renders. process_steps ship as
    // { n, title, body }; the Process block below expects { num, title, desc }.
    process: (found.process && found.process.length)
      ? found.process
      : brandDNA.process_steps.map((s) => ({ num: s.n, title: s.title, desc: s.body })),
    faq: found.faq || [],
    body: found.body || '',
    // Optional per-service head overrides and a service-specific paragraph for
    // the closing Where We Work band. Absent on the generated services, which
    // keep the derived title and the shared service-area copy.
    metaTitle: found.metaTitle || '',
    whereWeWork: found.whereWeWork || '',
  };

  return (
    <>
      <SEO
        path={`/services/${slug}`}
        title={service.metaTitle || `${service.title} | ${brandDNA.company.name}`}
        description={service.description}
        jsonLd={[
          buildService(found),
          buildBreadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${slug}` },
          ]),
          // CHG-71: FAQPage that mirrors the rendered ServiceFaq exactly (same
          // service.faq items). buildFAQ returns null when the service has no FAQ,
          // so filter(Boolean) drops it and no empty FAQPage is emitted.
          buildFAQ(service.faq),
        ].filter(Boolean)}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title={service.heroTitle}
        subtitle={service.description}
        breadcrumb={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ SILO — 70/30. Content runs down the left in full-bleed bands;
             the quote form floats over the right third and stays pinned until
             the last band ends. Below lg the rail drops into normal flow and
             every band goes full width. ════ */}
      <div className="relative">

        {/* ── Sticky quote rail. DOM position matters ONLY below lg, where the
               rail is in normal flow — first child, so on tablet/mobile the
               form is the first thing under the belt slider, ahead of the page
               content. From lg it is `absolute inset-0` over the whole stack,
               so its position in the document has no effect on the desktop
               layout at all. ── */}
        <StickyRail formId={serviceQuoteFormId(slug)} />

        {/* ── Overview ── */}
        <Band tone="white">
          <SectionHead eyebrow="SERVICE OVERVIEW" title={service.title} />
          {service.description && (
            <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
              {service.description}
            </p>
          )}
          <div className="mt-2"><SiloBody body={service.body} /></div>
          <CallNow className="mt-4" />
        </Band>

        {/* ── Why us ── */}
        {service.benefits.length > 0 && (
          <Band tone="light">
            <SectionHead title={`WHY ${brandDNA.company.shortName.toUpperCase()} FOR ${service.title.toUpperCase()}`} />
            {/* A benefit is either a plain string (the generated services) or a
                { title, body } pair (the copy-deck services, one card per "###"
                heading). `items-center` keeps the medallion on a one-line row's
                optical centre; titled cards top-align so the medallion sits with
                the heading. Padding is identical either way. */}
            <ul className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
              {service.benefits.map((b, i) => {
                const titled = b && typeof b === 'object';
                return (
                  <li
                    key={i}
                    className={`flex gap-4 px-5 py-4 ${titled ? 'items-start' : 'items-center'} ${CARD}`}
                    style={CARD_BORDER}
                  >
                    <Medallion>
                      <CheckIcon className="relative h-[18px] w-[18px]" />
                    </Medallion>
                    {titled ? (
                      <div className="min-w-0">
                        <h3
                          className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
                          style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                        >
                          {b.title}
                        </h3>
                        <p className="mt-2 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{b.body}</p>
                      </div>
                    ) : (
                      <p className="text-[15px] leading-[1.7] text-ink/75" style={{ fontFamily: INTER }}>{b}</p>
                    )}
                  </li>
                );
              })}
            </ul>
            <CallNow className="mt-8" />
          </Band>
        )}

        {/* ── What's included ── */}
        {service.included.length > 0 && (
          <Band tone="white">
            <SectionHead eyebrow="SCOPE OF WORK" title="WHAT'S INCLUDED" />
            <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {service.included.map((item, i) => (
                <li key={i} className={`flex items-start gap-3 p-4 ${CARD}`} style={CARD_BORDER}>
                  <span
                    className="mt-[2px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgb(var(--accent) / 0.12)', color: 'rgb(var(--accent))' }}
                  >
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span className="text-[14.5px] leading-[1.6] text-ink/75" style={{ fontFamily: INTER }}>{item}</span>
                </li>
              ))}
            </ul>
            <CallNow className="mt-8" />
          </Band>
        )}

        {/* ── How it works ── */}
        {service.process.length > 0 && (
          <Band tone="light">
            <SectionHead eyebrow="THE PROCESS" title="HOW IT WORKS" />
            <ol className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
              {service.process.map((step, i) => (
                <li key={step.num ?? i} className={`flex items-start gap-4 p-5 ${CARD}`} style={CARD_BORDER}>
                  <Medallion>
                    <span className="relative text-[15px] font-bold leading-none" style={{ fontFamily: JOSEFIN }}>
                      {String(step.num ?? i + 1).padStart(2, '0')}
                    </span>
                  </Medallion>
                  <div className="min-w-0">
                    <h3
                      className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
                      style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <CallNow className="mt-8" />
          </Band>
        )}

        {/* ── FAQ ── */}
        {service.faq.length > 0 && (
          <Band tone="white">
            <SectionHead eyebrow={brandDNA.copy.faq.label} title="COMMON QUESTIONS" />
            <div className="mt-8">
              <FAQAccordion items={service.faq} />
            </div>
            <CallNow className="mt-8" />
          </Band>
        )}

        {/* ── Where we work — existing component, forced into stacked mode and
               rendered bare so this band owns the width and background. The
               band is deep navy (the site's premium surface) and the component
               runs its dark variant, so headings go white and the white
               location cards carry the heavier shadow tuned for dark. This is
               the page's closing section — there is no CTA banner. ── */}
        <Band tone="dark">
          <ServiceAreas variant="dark" layout="stacked" as="div" body={service.whereWeWork || undefined} />
        </Band>
      </div>
    </>
  );
}
