import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import ServiceAreas from '../components/ServiceAreas';
import CTABanner from '../components/CTABanner';
import SEO from '../components/SEO';
// Same layout primitives as the service-area detail pages, so the index and
// the pages it links to read as one family.
import { Band, SectionHead, CallNow, Medallion, Prose } from '../components/SiloSection';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const CARD =
  'rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]';
const CARD_BORDER = { border: '1px solid rgba(16,40,79,0.07)' };

const founder = (brandDNA.team && brandDNA.team.founder) || null;
const founderLabel = founder ? (founder.displayName || founder.name) : null;

const Ic = ({ children, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);
const ClockIcon = (p) => <Ic {...p}><circle cx="12" cy="12" r="8.8" /><path d="M12 7.2V12l3.4 2" /></Ic>;
const ShieldIcon = (p) => <Ic {...p}><path d="M12 2.8C9.9 4.7 7.2 5.9 4.2 5.9c-.4 1.1-.6 2.3-.6 3.5 0 5.4 3.6 9.9 8.4 11.1 4.8-1.2 8.4-5.7 8.4-11.1 0-1.2-.2-2.4-.6-3.5-3 0-5.7-1.2-7.8-3.1Z" /><path d="m9.2 12 2.1 2.1 3.6-4.8" /></Ic>;
const UserIcon = (p) => <Ic {...p}><circle cx="12" cy="8" r="3.6" /><path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" /></Ic>;

// Existing coverage promises — copy unchanged.
const coverageHighlights = [
  {
    title: 'Same-Day Response',
    text: 'We schedule inspections within 24 to 48 hours across our entire service area. Emergency calls get a same-day response.',
    icon: ClockIcon,
  },
  {
    title: 'No Travel Fees',
    text: 'Inspections, estimates, and site visits anywhere in our service area are free. No surprise charges for driving to you.',
    icon: ShieldIcon,
  },
  {
    title: 'Owner Makes Every Visit',
    text: founderLabel
      ? `${founderLabel} personally attends every inspection and project walkthrough, not a subcontractor or third-party rep.`
      : 'The owner personally attends every inspection and project walkthrough, not a subcontractor or third-party rep.',
    icon: UserIcon,
  },
];

function HighlightCard({ icon, title, text }) {
  const Icon = icon;
  return (
    <div className={`flex h-full flex-col p-6 lg:p-7 ${CARD}`} style={CARD_BORDER}>
      <Medallion>
        <Icon className="relative h-[18px] w-[18px]" />
      </Medallion>
      <h3
        className="mt-5 text-[16px] font-bold uppercase leading-[1.3] tracking-[0.04em]"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
      >
        {title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{text}</p>
    </div>
  );
}

export default function ServiceAreasPage() {
  return (
    <>
      <SEO
        path="/service-areas"
        title={`Service Areas | ${brandDNA.company.name}`}
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/service-areas' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title={brandDNA.copy.serviceAreas.heading}
        subtitle={brandDNA.copy.serviceAreas.body}
        objectPosition="50% 40%"
        breadcrumb={[{ label: 'Service Areas' }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ Content — full-width bands, alternating white / pale blue. The
             global CTA banner closes the page. No sticky sidebar here — that
             belongs to the individual service / service-area pages. ════ */}

      {/* ── Who we cover ──
             The copy is capped at a readable measure, so left-aligning it in a
             1440px container stranded the whole right half of the row empty.
             Centring the block inside the standard container balances that
             whitespace without touching the container width, the horizontal
             padding, the copy or the type. ── */}
      <Band tone="white" width="full">
        <div className="mx-auto flex w-full max-w-[74ch] flex-col items-center text-center">
          <SectionHead eyebrow="OUR SERVICE AREA" title="WHERE WE WORK" align="center" />
          <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            We serve homeowners across the Tri-Cities and the nearby towns of Eastern Washington. Not sure if you&apos;re covered? Just call and we&apos;ll let you know.
          </p>
          <p className="mt-4 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            High Point is a local contractor, not a storm-chasing crew that rolls into town after a big wind and disappears before winter. {founderLabel || 'The owner'} lives and works here, so you get a real name, a real number, and a reputation to protect on every job.
          </p>
          <p
            className="mt-6 w-full rounded-[14px] p-4 text-[14px] font-medium leading-[1.7]"
            style={{ fontFamily: INTER, background: 'rgb(var(--accent) / 0.08)', border: '1px solid rgb(var(--accent) / 0.2)', color: 'rgb(var(--ink) / 0.8)' }}
          >
            Don&apos;t see your city? Call us at{' '}
            <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="font-bold text-[rgb(var(--primary))] transition-colors hover:text-[rgb(var(--accent))]">
              {brandDNA.contact.phone}
            </a>{' '}
            and we&apos;ll confirm if you&apos;re in our service area.
          </p>
          <CallNow className="mt-8" />
        </div>
      </Band>

      {/* ── What coverage means ── */}
      <Band tone="light" width="full">
        <SectionHead eyebrow="WHAT COVERAGE MEANS" title="IN YOUR AREA. READY TO HELP." />
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {coverageHighlights.map((h) => (
            <li key={h.title} className="flex">
              <HighlightCard icon={h.icon} title={h.title} text={h.text} />
            </li>
          ))}
        </ul>
        <Prose>
          <p className="mt-8 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            Request your free inspection today. We&apos;ll be at your property within 24 to 48 hours, give you an honest assessment, and tell you exactly what your roof needs.
          </p>
        </Prose>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em]"
            style={{ fontFamily: JOSEFIN, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
          >
            {brandDNA.copy.buttonText}
          </Link>
          <CallNow />
        </div>
      </Band>

      {/* ── Every city we cover, plus the live map — the shared stacked
             section, bare and on a light band. ── */}
      <ServiceAreas variant="light" />

      {/* ── Global CTA banner ── */}
      <CTABanner />
    </>
  );
}
