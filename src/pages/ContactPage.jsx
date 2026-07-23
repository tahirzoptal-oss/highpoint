import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import SEO from '../components/SEO';
import FadeOnEnter from '../components/FadeOnEnter';
import { buildBreadcrumb } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';
import { useLeadForm } from '../lib/leadForm';
// The global footer/header "get a free quote" buttons target this id. Contact
// carries no CTA section, so the on-page form is the quote target here — the
// button scrolls to it instead of routing back to the homepage.
import { QUOTE_SECTION_ID } from '../lib/scrollToQuote';
// Same map frame the homepage Service Area section renders.
import { MAP_FRAME } from '../config/map-frame';
import { CONTACT_PAGE_FORM } from '../config/form-ids';

const MAP = MAP_FRAME.dark;

// The deep-navy surface shared with the homepage Service Area section.
const DARK_BASE =
  'radial-gradient(52% 46% at 10% 8%, rgba(44,90,166,0.34) 0%, transparent 62%),' +
  'radial-gradient(46% 42% at 92% 16%, rgba(110,143,196,0.20) 0%, transparent 64%),' +
  'radial-gradient(58% 50% at 45% 104%, rgba(44,90,166,0.22) 0%, transparent 62%),' +
  'linear-gradient(168deg, #0B1C3A 0%, #10284F 52%, #0A1730 100%)';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// The global `[data-theme-mode="light"] .form-input` rule in index.css sets
// background and border with !important, so inline styles cannot soften them.
// `.cta-field` is the companion rule that out-specifies it and owns the
// #F8FAFC fill, #D8DEE9 hairline, 50px height, placeholder contrast and focus
// ring — the same field treatment the global CTA form uses.
const FIELD_CLASS = 'cta-field form-input w-full rounded-[12px] px-4 text-[14.5px]';

const glassBtnTextStyle = {
  fontFamily: JOSEFIN,
  fontWeight: 700,
  color: '#FFFFFF',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
};

// ── Band surfaces, alternating down the page ──
const BAND_WHITE =
  'radial-gradient(46% 42% at 10% 8%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
  'radial-gradient(42% 40% at 92% 14%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
  'linear-gradient(170deg, #FFFFFF 0%, #FBFCFE 60%, #F4F8FD 100%)';
const BAND_LIGHT =
  'radial-gradient(46% 42% at 8% 10%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
  'radial-gradient(42% 40% at 96% 16%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
  'linear-gradient(170deg, #F6F9FD 0%, #EFF4FB 55%, #E9F0F9 100%)';

// The site's glass surface: translucent white over the band, blurred, with a
// hairline rim and a soft lift. Same treatment as the homepage service tiles.
const GLASS_CARD =
  'relative overflow-hidden rounded-[22px] bg-white/70 p-5 lg:p-7 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_18px_44px_-24px_rgba(16,40,79,0.28)] backdrop-blur-md lg:p-9';
const GLASS_BORDER = { border: '1px solid rgba(255,255,255,0.75)' };

// brandDNA.serviceAreas ships uppercase ("WEST RICHLAND"); render it in prose
// case so it reads as a sentence rather than a shout.
const titleCase = (s) =>
  String(s)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');

// hours.display is empty in brand-dna, so derive the weekday line from the
// structured hours — the same derivation the footer uses.
const hoursLine = (() => {
  const w = brandDNA.hours?.weekday;
  if (!w?.opens || !w?.closes) return null;
  const to12 = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  };
  const days = w.dayOfWeek || [];
  const span = days.length > 1 ? `${days[0]} to ${days[days.length - 1]}` : days[0];
  return `${span}, ${to12(w.opens)} to ${to12(w.closes)}`;
})();

// ── Info icons (24px, 1.5 stroke — the site's icon idiom) ──
const Ic = ({ children, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);
const PhoneIcon = (p) => <Ic {...p}><path d="M2.5 5.2c0-1 .8-1.8 1.8-1.8h2a1.8 1.8 0 0 1 1.8 1.5l.5 2.6a1.8 1.8 0 0 1-.9 1.9l-1.3.7a13.5 13.5 0 0 0 6 6l.7-1.3a1.8 1.8 0 0 1 1.9-.9l2.6.5a1.8 1.8 0 0 1 1.5 1.8v2c0 1-.8 1.8-1.8 1.8h-.9A15.7 15.7 0 0 1 2.5 6.1v-.9Z" /></Ic>;
const MailIcon = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="14" rx="2.4" /><path d="M3.6 6.6 12 12.6l8.4-6" /></Ic>;
const PinIcon = (p) => <Ic {...p}><path d="M20 10.5c0 5.2-6.3 10.3-7.5 11.2a.8.8 0 0 1-1 0C10.3 20.8 4 15.7 4 10.5a8 8 0 1 1 16 0z" /><circle cx="12" cy="10.3" r="2.9" /></Ic>;

const ClockIcon = (p) => <Ic {...p}><circle cx="12" cy="12" r="8.8" /><path d="M12 7.2V12l3.4 2" /></Ic>;
const MapIcon = (p) => <Ic {...p}><path d="m9 4.5 6 2.4 5.2-2.1a.6.6 0 0 1 .8.55v12.1a.6.6 0 0 1-.38.56L15 19.5l-6-2.4-5.2 2.1a.6.6 0 0 1-.8-.55V6.55a.6.6 0 0 1 .38-.56L9 4.5Z" /><path d="M9 4.5v12.6M15 6.9v12.6" /></Ic>;
const HandshakeIcon = (p) => <Ic {...p}><path d="m11 17.5-2 2a1.6 1.6 0 0 1-2.3-2.2l.6-.6" /><path d="M3.5 12.5 7 9a2 2 0 0 1 2.6-.2l1.6 1.2a2 2 0 0 0 2.5-.1L17 7.2" /><path d="m13.4 15.4 2.6 2.6a1.6 1.6 0 0 0 2.3-2.3l-4.8-4.8" /><path d="M20.5 12.6 17 9M3 6.5 6.5 4h3L12 6M22 6.5 18.5 4h-3" /></Ic>;

/**
 * Glass medallion — the site's global icon container, static.
 */
function Medallion({ icon }) {
  const Icon = icon;
  return (
    <span
      className="relative flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[16px]"
      style={{
        background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 18px -10px rgba(16,40,79,0.5), 0 12px 26px -14px rgb(var(--accent) / 0.55)',
        color: 'rgb(var(--on-accent))',
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[44%] rounded-[14px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
      <Icon className="relative h-6 w-6" />
    </span>
  );
}

/**
 * One glass box in the three-up row. All three share this shell, so padding,
 * radius, rim, medallion size and type scale are identical, and `h-full` keeps
 * the row level whatever the copy length.
 */
function GlassBox({ icon, title, children }) {
  return (
    <div className={`${GLASS_CARD} flex h-full w-full flex-col`} style={GLASS_BORDER}>
      {/* Top-light wash so the box reads as glass rather than flat white */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(44,90,166,0.06), transparent)' }} />

      <Medallion icon={icon} />

      <h3
        className="relative mt-5 text-[17px] font-bold uppercase leading-[1.3] tracking-[0.03em]"
        style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
      >
        {title}
      </h3>

      <span className="relative mt-3.5 block h-[3px] w-10 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

      <div className="relative mt-4 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/**
 * Company info card — icon tile, uppercase label, value. One shell for every
 * item so the three cards read at a single weight and stretch to equal height.
 */
function InfoCard({ icon, label, children }) {
  const Icon = icon;
  return (
    <div
      className="group flex h-full w-full flex-col rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-18px_rgba(16,40,79,0.2)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_22px_46px_-20px_rgba(16,40,79,0.28)] lg:p-8"
      style={{ border: '1px solid rgba(16,40,79,0.07)' }}
    >
      {/* Glass medallion — identical to the site's global icon container
          (Why Choose Us, Our Process, Services, Footer): 58px, 18px radius,
          primary-blue gradient, hairline highlight, inset gloss. Static here,
          with no hover transform. */}
      <span className="relative inline-flex flex-shrink-0">
        <span
          className="relative flex h-[50px] w-[50px] lg:h-[58px] lg:w-[58px] items-center justify-center rounded-[12px] lg:rounded-[18px]"
          style={{
            background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 18px -10px rgba(16,40,79,0.5)',
            color: 'rgb(var(--on-accent))',
          }}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[44%] rounded-[18px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
          <Icon className="relative h-7 w-7" />
        </span>
      </span>

      <span
        className="mt-5 block text-[12.5px] font-bold uppercase tracking-[0.15em] text-ink/50"
        style={{ fontFamily: INTER }}
      >
        {label}
      </span>

      <div className="mt-3 flex min-w-0 flex-1 flex-col justify-start">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const { honeypotProps, onSubmit: handleSubmit } = useLeadForm(CONTACT_PAGE_FORM);

  const valueClass = 'text-[18px] font-bold leading-[1.35] sm:text-[19px]';
  const valueStyle = { fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' };

  return (
    <>
      <SEO
        path="/contact"
        title={`Contact | ${brandDNA.company.name}`}
        description="Contact High Point Renovation & Roofing in Kennewick, WA for a free roof inspection and honest written estimate. Call (509) 518-0747 or send a message."
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      {/* The intro paragraph moved into the section below, so the banner is
          title + breadcrumb only and the copy is not printed twice. */}
      <InnerBanner
        title={brandDNA.pages.contact.heading}
        breadcrumb={[{ label: 'Contact' }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ 4. Company info ════ */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(46% 42% at 10% 8%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
              'radial-gradient(42% 40% at 92% 14%, rgba(44,90,166,0.10) 0%, transparent 64%),' +
              'linear-gradient(170deg, #FFFFFF 0%, #FBFCFE 60%, #F4F8FD 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />

        <div className="site-container relative">
          {/* ── Intro: eyebrow, heading, lead paragraph. All three come from
                 brand-dna (pages.contact), so nothing new is authored here. The
                 paragraph is the page intro, which now lives with the contact
                 details instead of only under the banner. ── */}
          <FadeOnEnter>
            <div className="mx-auto max-w-[70ch] text-center">
              <p
                className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
              >
                <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
                GET IN TOUCH
              </p>

              <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
                {brandDNA.pages.contact.contactHeading}
              </h2>

              <span className="mx-auto mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

              <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                {brandDNA.pages.contact.intro}
              </p>
            </div>
          </FadeOnEnter>

          {/* Three across from tablet up, stacked on mobile — an even row with
              no gap left over. Cards stretch, so a wrapped email never leaves
              the row ragged. */}
          <ul className="relative m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-3 lg:mt-10 lg:gap-6">
            <FadeOnEnter as="li" className="flex">
              <InfoCard icon={PhoneIcon} label="Phone">
                <a
                  href={`tel:${brandDNA.contact.phoneTelLink}`}
                  className={`${valueClass} transition-colors duration-300 ease-out hover:text-[rgb(var(--accent))]`}
                  style={valueStyle}
                >
                  {brandDNA.contact.phone}
                </a>
              </InfoCard>
            </FadeOnEnter>

            <FadeOnEnter as="li" className="flex" delay={80}>
              <InfoCard icon={MailIcon} label="Email">
                <a
                  href={`mailto:${brandDNA.contact.email}`}
                  className={`${valueClass} break-words transition-colors duration-300 ease-out hover:text-[rgb(var(--accent))]`}
                  style={valueStyle}
                >
                  {brandDNA.contact.email}
                </a>
              </InfoCard>
            </FadeOnEnter>

            <FadeOnEnter as="li" className="flex" delay={160}>
              <InfoCard icon={PinIcon} label="Address">
                <span className={valueClass} style={valueStyle}>
                  {brandDNA.address.full}
                </span>
              </InfoCard>
            </FadeOnEnter>
          </ul>

        </div>
      </section>

      {/* ════ 5. Coverage, hours and approach — ONE section, one heading, three
             glass boxes in a responsive row (3 across on desktop, 2 on tablet,
             stacked on mobile). Copy unchanged; every fact comes from the
             published service-area list, the structured hours and the owner's
             role. ════ */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div aria-hidden className="absolute inset-0" style={{ background: BAND_LIGHT }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.25), transparent)' }} />

        <div className="site-container relative">
          <FadeOnEnter>
            <div className="mx-auto max-w-[70ch] text-center">
              <p
                className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
              >
                <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
                GOOD TO KNOW
              </p>
              <h2
                className="section-h2 uppercase"
                style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary))' }}
              >
                Coverage, Hours &amp; Approach
              </h2>
              <span className="mx-auto mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
            </div>
          </FadeOnEnter>

          <ul className="m-0 mt-9 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:mt-11 lg:grid-cols-3 lg:gap-6">
            <FadeOnEnter as="li" className="flex">
              <GlassBox icon={MapIcon} title="Where We Work">
                <p className="text-[14.5px] leading-[1.75] text-ink/75" style={{ fontFamily: INTER }}>
                  We cover {brandDNA.company.serviceRegion}. That means{' '}
                  {(brandDNA.serviceAreas || []).slice(0, -1).map(titleCase).join(', ')} and{' '}
                  {titleCase((brandDNA.serviceAreas || [])[(brandDNA.serviceAreas || []).length - 1] || '')}.
                  If your town is not on that list, call and ask. It is a short
                  conversation, and we would rather tell you straight than have
                  you wonder.
                </p>
                <Link
                  to="/service-areas"
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ease-out hover:text-[rgb(var(--primary))]"
                  style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}
                >
                  See every area we serve →
                </Link>
              </GlassBox>
            </FadeOnEnter>

            <FadeOnEnter as="li" className="flex" delay={80}>
              <GlassBox icon={ClockIcon} title="When We Answer">
                <p className="text-[14.5px] leading-[1.75] text-ink/75" style={{ fontFamily: INTER }}>
                  Our office hours are {hoursLine}. Call during those hours and
                  you will reach us directly. Send the form and we call you back
                  in 5 minutes during business hours, and the same business day
                  otherwise. You will not sit in a queue waiting on a call
                  centre. The number you ring is answered by the people who do
                  the work.
                </p>
              </GlassBox>
            </FadeOnEnter>

            <FadeOnEnter as="li" className="flex" delay={160}>
              <GlassBox icon={HandshakeIcon} title="How We Work With You">
                <p className="text-[14.5px] leading-[1.75] text-ink/75" style={{ fontFamily: INTER }}>
                  {brandDNA.team.founder.name} is the {brandDNA.team.founder.title.toLowerCase()},
                  so the person who inspects and prices your roof is the person
                  who builds it. Inspections and written estimates are free, the
                  written estimate is the price you pay, and we tell you when a
                  repair will hold and when it will not.
                </p>
              </GlassBox>
            </FadeOnEnter>
          </ul>
        </div>
      </section>

      {/* ════ 6. What happens next — the published company process, as glass
             step cards with the number carried in a medallion so it reads as
             the primary marker rather than a caption. ════ */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div aria-hidden className="absolute inset-0" style={{ background: BAND_WHITE }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.25), transparent)' }} />

        <div className="site-container relative">
          <FadeOnEnter>
            <div className="mx-auto max-w-[70ch] text-center">
              <p
                className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
              >
                <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
                AFTER YOU SEND THE FORM
              </p>
              <h2
                className="section-h2 uppercase"
                style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary))' }}
              >
                What Happens Next
              </h2>
              <span className="mx-auto mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
            </div>
          </FadeOnEnter>

          <ol className="m-0 mt-9 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:mt-11 lg:grid-cols-5">
            {brandDNA.process_steps.map((step, i) => (
              <FadeOnEnter as="li" key={step.n ?? i} className="flex" delay={i * 70}>
                <div
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white/70 p-5 lg:p-6 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_18px_44px_-24px_rgba(16,40,79,0.28)] backdrop-blur-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1"
                  style={GLASS_BORDER}
                >
                  {/* Top-light wash so the card reads as glass, not flat white */}
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(44,90,166,0.06), transparent)' }} />

                  {/* Prominent step number in the site's glass medallion */}
                  <span
                    className="relative flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[16px]"
                    style={{
                      background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 18px -10px rgba(16,40,79,0.5), 0 12px 26px -14px rgb(var(--accent) / 0.55)',
                      color: 'rgb(var(--on-accent))',
                    }}
                  >
                    <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[44%] rounded-[14px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
                    <span className="relative text-[19px] font-bold leading-none" style={{ fontFamily: JOSEFIN, letterSpacing: '0.02em' }}>
                      {String(step.n ?? i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <h3
                    className="relative mt-5 text-[14.5px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
                    style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                  >
                    {step.title}
                  </h3>
                  <p className="relative mt-2.5 text-[13.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>
                    {step.body}
                  </p>
                </div>
              </FadeOnEnter>
            ))}
          </ol>
        </div>
      </section>

      {/* ════ 5. Contact form + map — deep navy surface, the same premium
             treatment the homepage Service Area section uses, so the page
             separates cleanly from the light band above and the footer below. ════ */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        <div aria-hidden className="absolute inset-0" style={{ background: DARK_BASE }} />

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.24)' }} />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.14)' }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
          <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }} />
        </div>

        <div className="site-container relative">
          {/* Form left, map right on desktop; form first when stacked.
              `items-stretch` makes both columns take the row height, which the
              form defines — the map then fills it exactly. */}
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
            <FadeOnEnter>
              <div
                id={QUOTE_SECTION_ID}
                className="h-full scroll-mt-24 rounded-[20px] bg-white p-5 sm:p-9 lg:p-10"
                style={{
                  border: '1px solid #EAEAEA',
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.4), 0 32px 64px -26px rgba(0,0,0,0.75)',
                }}
              >
                <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
                  {brandDNA.pages.contact.formHeading}
                </h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/60" style={{ fontFamily: INTER }}>
                  {brandDNA.pages.contact.formIntro}
                </p>

                {/* Field names, validation and the submit handler are unchanged. */}
                <form id={CONTACT_PAGE_FORM} onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Anti-spam honeypot: hidden from humans, bots fill it. */}
                  <input {...honeypotProps} />

                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>Full Name *</label>
                    <input id="contact-name" name="name" required className={FIELD_CLASS} placeholder="John Smith" style={{ fontFamily: INTER }} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>Phone Number *</label>
                    <input id="contact-phone" name="phone" required type="tel" className={FIELD_CLASS} placeholder="(509) 000-0000" style={{ fontFamily: INTER }} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>Email Address *</label>
                    <input id="contact-email" name="email" required type="email" className={FIELD_CLASS} placeholder="john@example.com" style={{ fontFamily: INTER }} />
                  </div>
                  <div>
                    <label htmlFor="contact-address" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>Property Address</label>
                    <input id="contact-address" name="address" className={FIELD_CLASS} placeholder={`123 Main St, ${brandDNA.address.city}, ${brandDNA.address.state}`} style={{ fontFamily: INTER }} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-service" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>How Can We Help? *</label>
                    <select id="contact-service" name="service" defaultValue="" className={FIELD_CLASS} style={{ fontFamily: INTER }}>
                      <option value="">Select a service...</option>
                      {brandDNA.services.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={`${FIELD_CLASS} resize-none py-3.5`}
                      placeholder="Tell us about your project, current issues, or any questions you have..."
                      style={{ fontFamily: INTER }}
                    />
                  </div>
                  <div className="sm:col-span-2 sm:mt-1">
                    <button
                      type="submit"
                      className="btn-gold w-full px-6 py-[18px] text-[14px] uppercase tracking-[0.08em]"
                      style={glassBtnTextStyle}
                    >
                      {brandDNA.copy.submitButton} →
                    </button>
                    <p className="mt-3 text-center text-[12px] text-ink/45" style={{ fontFamily: INTER }}>
                      No spam. No obligation. We call you back in 5 minutes.
                    </p>
                  </div>
                </form>
              </div>
            </FadeOnEnter>

            {/* Map — business address only, in the shared MAP_FRAME treatment:
                corner bracket, offset glass panel, 24px glass frame and an
                aspect-locked 18px inner window, exactly as on the homepage. */}
            <FadeOnEnter delay={140} className="h-full">
              <div className="relative mx-auto h-full w-full max-w-[560px] lg:mx-0 lg:max-w-none">
                <span
                  aria-hidden
                  className="absolute -right-3.5 -top-3.5 hidden h-20 w-20 rounded-tr-[24px] sm:block"
                  style={{ borderTop: `2px solid ${MAP.bracket}`, borderRight: `2px solid ${MAP.bracket}` }}
                />
                <span
                  aria-hidden
                  className="absolute -bottom-3.5 -left-3.5 hidden h-28 w-28 rounded-[24px] sm:block"
                  style={{ background: MAP.panel, border: `1px solid ${MAP.panelBorder}` }}
                />

                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-[24px] p-2 backdrop-blur-md"
                  style={{
                    background: MAP.frameBg,
                    border: `1px solid ${MAP.frameBorder}`,
                    boxShadow: MAP.frameShadow,
                  }}
                >
                  {/* Stacked (tablet / mobile) the window keeps the homepage
                      aspect ratio; from lg it drops the ratio and flexes to the
                      frame's full height, so it ends flush with the form. */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] sm:aspect-[16/11] lg:aspect-auto lg:flex-1">
                    <iframe
                      title={`${brandDNA.company.name} - ${brandDNA.address.full}`}
                      src={brandDNA.contact.mapsEmbedUrl}
                      className="absolute inset-0 h-full w-full"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </FadeOnEnter>
          </div>
        </div>
      </section>
    </>
  );
}
