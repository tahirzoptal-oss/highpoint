import { useParams, Link, Navigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import FAQAccordion from '../components/FAQAccordion';
import ServiceAreas from '../components/ServiceAreas';
import SEO from '../components/SEO';
// Shared silo primitives — the same bands, headings, buttons, medallions,
// body renderer and sticky rail the service detail pages use, so the two page
// types read as one system.
import { Band, SectionHead, CallNow, Medallion, CheckIcon, StickyRail, SiloBody } from '../components/SiloSection';
import { PRIMARY_SERVICES } from '../config/primary-services';
import { buildBreadcrumb, buildFAQ } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const CARD =
  'rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]';
const CARD_BORDER = { border: '1px solid rgba(16,40,79,0.07)' };

// Slugify a city name the same way the route's getStaticPaths enumerates
// brandDNA.serviceAreas (lowercase, non-alphanumeric -> '-', trimmed).
const slugifyCity = (name) =>
  String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Title-case an UPPERCASE service-area string (e.g. "LEE'S SUMMIT" -> "Lee's
// Summit") for the on-page heading / breadcrumb / SEO title when there is no
// rich location_pages entry to pull a pre-formatted city name from. Capitalises
// the first letter of each whitespace-separated word only, so a letter after an
// apostrophe stays lowercase ("Lee's", not "Lee'S").
const titleCaseCity = (name) =>
  String(name)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');

/**
 * Split a copy-deck body at its `## ` headings so each one becomes its own
 * band, rather than the whole page reading as a single column of text. The
 * copy is untouched — the heading line is simply promoted out of the body and
 * rendered as the section's own heading.
 *
 * Returns [{ heading: string|null, body: string }]; the first entry carries
 * whatever ran before the first heading (heading === null).
 */
function splitBodySections(body) {
  if (!body) return [];
  const out = [];
  let current = { heading: null, lines: [] };
  const flush = () => {
    if (current.heading || current.lines.join('').trim()) out.push(current);
  };
  for (const line of body.trim().split('\n')) {
    const m = /^##\s+(.+)$/.exec(line.trim());
    if (m) {
      flush();
      current = { heading: m[1].replace(/\*([^*]+)\*/g, '$1').trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  flush();
  return out.map((s) => ({ heading: s.heading, body: s.lines.join('\n').trim() }));
}

export default function LocationDetailPage() {
  const { slug } = useParams();
  const pages = brandDNA.location_pages || [];
  // Prefer a rich location_pages entry. When none exists (a flat list of city
  // names), fall back to the matching service-area string so the prerendered
  // /service-areas/:slug route still resolves to real content.
  const richPage = pages.find((p) => p.slug === slug);
  const areaMatch = (brandDNA.serviceAreas || []).find((a) => slugifyCity(a) === slug);
  if (!richPage && !areaMatch) return <Navigate to="/service-areas" replace />;

  const cityName = richPage ? richPage.city : titleCaseCity(areaMatch);
  const page = richPage || { city: cityName, headline: null, subheadline: null, body: '', faq: [] };

  const faqItems = (page.faq || []).filter((f) => f && (f.q || f.question) && (f.a || f.answer));

  // Hero copy: prefer the entry headline, else read as a clean "Roofing in {City}, WA".
  const state = brandDNA.address?.state || 'WA';
  const heroTitle = page.headline || `Roofing in ${cityName}, ${state}`;

  // Each copy-deck heading becomes its own band, and the bands alternate
  // white / pale blue down the page so the read breaks into scannable blocks.
  const bodySections = splitBodySections(page.body);
  let bandIdx = 0;
  const nextTone = () => ((bandIdx++ % 2 === 0) ? 'white' : 'light');

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas' },
      { name: cityName, path: `/service-areas/${slug}` },
    ]),
    faqItems.length ? buildFAQ(faqItems) : null,
  ].filter(Boolean);

  return (
    <>
      <SEO
        path={`/service-areas/${slug}`}
        title={`Roofing in ${cityName}, ${state} | ${brandDNA.company.name}`}
        description={page.subheadline || undefined}
        jsonLd={jsonLd}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title={heroTitle}
        subtitle={page.subheadline}
        breadcrumb={[{ label: 'Service Areas', to: '/service-areas' }, { label: cityName }]}
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ SILO — the same 70/30 structure as the service pages: full-bleed
             bands down the left, the quote form floating over the right third
             and pinned until the last band ends. ════ */}
      <div className="relative">

        {/* ── Sticky quote rail. DOM position matters ONLY below lg, where the
               rail is in normal flow — first child, so on tablet/mobile the
               form is the first thing under the belt slider, ahead of the page
               content. From lg it is `absolute inset-0` over the whole stack,
               so its position in the document has no effect on the desktop
               layout at all. ── */}
        <StickyRail formId={`city-${slug}`} />

        {/* ── One band per copy-deck heading. The first carries whatever ran
               before the first heading and keeps the page title; the rest take
               the heading straight out of the body. Backgrounds alternate
               white / pale blue, and every band closes with the same left
               aligned Call button. ── */}
        {bodySections.map((section, i) => (
          <Band key={section.heading || `intro-${i}`} tone={nextTone()}>
            <SectionHead
              eyebrow={section.heading ? undefined : `${cityName.toUpperCase()}, ${state}`}
              title={section.heading || heroTitle}
            />
            {!section.heading && page.subheadline && (
              <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                {page.subheadline}
              </p>
            )}
            <div className="mt-6"><SiloBody body={section.body} /></div>
            <CallNow className="mt-2" />
          </Band>
        ))}

        {/* ── What we do here — the same seven primary services the header and
               footer list, each linking to its own page. ── */}
        <Band tone={nextTone()}>
          <SectionHead eyebrow="WHAT WE DO HERE" title={`OUR SERVICES IN ${cityName.toUpperCase()}`} />
          <ul className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
            {PRIMARY_SERVICES.map((s) => (
              <li key={s.name}>
                <Link
                  to={s.href}
                  className={`group flex items-center gap-4 px-5 py-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_22px_46px_-20px_rgba(16,40,79,0.3)] ${CARD}`}
                  style={CARD_BORDER}
                >
                  <Medallion>
                    <CheckIcon className="relative h-[18px] w-[18px]" />
                  </Medallion>
                  <span
                    className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em] transition-colors duration-300 ease-out group-hover:text-[rgb(var(--accent))]"
                    style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                  >
                    {s.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <CallNow className="mt-8" />
        </Band>

        {/* ── How it works — the shared company process ── */}
        {brandDNA.process_steps.length > 0 && (
          <Band tone={nextTone()}>
            <SectionHead eyebrow="THE PROCESS" title="HOW IT WORKS" />
            <ol className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
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
        )}

        {/* ── FAQ ── */}
        {faqItems.length > 0 && (
          <Band tone={nextTone()}>
            <SectionHead eyebrow={brandDNA.copy.faq.label} title={`QUESTIONS FROM ${cityName.toUpperCase()} HOMEOWNERS`} />
            <div className="mt-8">
              <FAQAccordion items={faqItems} />
            </div>
            <CallNow className="mt-8" />
          </Band>
        )}

        {/* ── Where we work — the same stacked, bare, dark-variant section the
               service pages close on. `mapQuery` points the existing map frame
               at THIS city; nothing else about the component changes. This is
               the closing section — there is no CTA banner, and "Nearby Areas
               We Serve" is gone (this section already lists every city). ── */}
        <Band tone="dark">
          <ServiceAreas
            variant="dark"
            layout="stacked"
            as="div"
            mapQuery={`${cityName}, ${state}`}
          />
        </Band>
      </div>
    </>
  );
}
