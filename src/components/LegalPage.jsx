import InnerBanner from './InnerBanner';
import SEO from './SEO';
import { Band, SiloBody } from './SiloSection';
import { buildBreadcrumb } from '../lib/schema';
import { LEGAL_LAST_UPDATED } from '../config/legal-pages';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

/**
 * LegalPage — the shared shell for Privacy Policy and Terms & Conditions.
 *
 * Deliberately plain: the existing inner banner, then one white band holding a
 * single ~1000px measure. No cards, no sliders, no CTA — long legal copy reads
 * better without the furniture. Section headings use the global `.section-h2`
 * (the homepage H2), and the body runs through the same copy renderer the rest
 * of the site uses, so paragraphs, bullets, bold and inline links are styled
 * identically to every other page.
 *
 * Props
 *   title     page <h1>, breadcrumb leaf and SEO title
 *   path      route path, e.g. "/privacy-policy"
 *   intro     optional lead paragraph under the "last updated" line
 *   sections  [{ heading, body }] — body is copy-deck markdown
 */
export default function LegalPage({ title, path, intro, sections = [] }) {
  return (
    <>
      <SEO
        path={path}
        title={`${title} | High Point Renovation & Roofing`}
        description={intro}
        jsonLd={buildBreadcrumb([
          { name: 'Home', path: '/' },
          { name: title, path },
        ])}
      />

      <InnerBanner
        title={title}
        breadcrumb={[{ label: title }]}
        minHeightClass="min-h-[38vh] lg:min-h-[44vh]"
      />

      <Band tone="white" width="full">
        {/* One measure, centred. ~1000px keeps long legal copy comfortable on a
            wide screen without stranding it in a narrow column. */}
        <div className="mx-auto w-full max-w-[1000px]">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
          >
            Last updated: {LEGAL_LAST_UPDATED}
          </p>

          {intro && (
            <p className="mt-5 text-[16px] leading-[1.8] text-ink/80" style={{ fontFamily: INTER }}>
              {intro}
            </p>
          )}

          {sections.map((section, i) => (
            <section key={section.heading} className={i === 0 ? 'mt-12' : 'mt-14'}>
              <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
                {section.heading}
              </h2>
              <span
                className="mb-6 mt-4 block h-[3px] w-12 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }}
              />
              <SiloBody body={section.body} />
            </section>
          ))}
        </div>
      </Band>
    </>
  );
}
