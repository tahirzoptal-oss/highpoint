import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import CTABanner from '../components/CTABanner';
import { CTA_FORM } from '../config/form-ids';
import FAQAccordion from '../components/FAQAccordion';
import SEO from '../components/SEO';
// The same layout primitives the service and service-area pages use, so this
// page sits in the same system rather than carrying its own styling.
import { Band, SectionHead, Medallion, Prose } from '../components/SiloSection';
import { buildBreadcrumb, buildFAQ } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

const CARD =
  'rounded-[18px] bg-white shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]';
const CARD_BORDER = { border: '1px solid rgba(16,40,79,0.07)' };

const ShieldCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 2.8C9.9 4.7 7.2 5.9 4.2 5.9c-.4 1.1-.6 2.3-.6 3.5 0 5.4 3.6 9.9 8.4 11.1 4.8-1.2 8.4-5.7 8.4-11.1 0-1.2-.2-2.4-.6-3.5-3 0-5.7-1.2-7.8-3.1Z" />
    <path d="m9.2 12 2.1 2.1 3.6-4.8" />
  </svg>
);

// brandDNA.financing.offered — boolean
// brandDNA.financing.providers — array of { name, url }
// brandDNA.financing.termsDescription — short paragraph (optional)
// brandDNA.financing.faqs — array of { q, a } (optional)
// brandDNA.financing.options — array of { name, headline, details, tag, highlight } (optional)
const financing = brandDNA.financing || {};
const isOffered = financing.offered !== false; // default true unless explicitly disabled

const defaultOfferedSteps = [
  {
    num: '01',
    title: 'Get Your Free Inspection',
    desc: 'We inspect your roof and give you a detailed written quote. No obligation, no pressure. You know the project cost before any financing conversation.',
  },
  {
    num: '02',
    title: 'Choose Your Financing Option',
    desc: 'We work with trusted lending partners to offer flexible terms. You choose what works for your budget.',
  },
  {
    num: '03',
    title: 'Quick Approval Process',
    desc: 'Soft-credit pre-qualification means you can check your options without affecting your credit score. Most approvals come back same day.',
  },
  {
    num: '04',
    title: 'We Get to Work',
    desc: 'Once approved, your project is scheduled immediately. No waiting, no delays.',
  },
];

const defaultNotOfferedSteps = [
  {
    num: '01',
    title: 'Get Your Free Inspection First',
    desc: "Before any payment conversation, we inspect your roof and give you a detailed written quote. You know the project cost up front, not after the work is done.",
  },
  {
    num: '02',
    title: 'Check Your Insurance Coverage',
    desc: "If the damage is from a covered storm or hail event, your insurance pays for the bulk of the work. Most homeowners only pay their deductible. We handle the claim documentation.",
  },
  {
    num: '03',
    title: 'Use a Third-Party Lender If You Need To',
    desc: "We do not offer in-house financing, but we are happy to point you to home-improvement lenders that other neighbors have used (Synchrony Home, GreenSky, Hearth). You apply directly with them, not through us, so you get their best rate without a markup.",
  },
  {
    num: '04',
    title: 'Pay When the Work Is Done',
    desc: "We collect payment when the project is complete and signed off. No deposits before materials are on-site.",
  },
];

const defaultOptions = [
  {
    name: 'Insurance Claim',
    headline: 'Often zero out-of-pocket beyond your deductible.',
    details: "Storm and hail damage is the most common path to a paid roof. We document everything for the adjuster and work the claim with you. Most homeowners pay only their deductible.",
    tag: 'MOST COMMON',
    highlight: true,
  },
  {
    name: 'Third-Party Lender',
    headline: 'Apply directly with a national home-improvement lender.',
    details: "Synchrony Home, GreenSky, and Hearth are the three most-used by our neighbors. You apply with them, not us, so the rate you see is the rate you get. No dealer markup.",
    tag: 'FLEXIBLE TERMS',
    highlight: false,
  },
  {
    name: 'Pay on Completion',
    headline: 'No deposit. Settle when the work is signed off.',
    details: "We collect payment when the project is complete and you have walked it. No money up front for materials, no progress draws.",
    tag: 'NO PRESSURE',
    highlight: false,
  },
];

const defaultFaqs = [
  {
    q: "Do you offer in-house financing?",
    a: "No. We focus on roofing and exteriors and let specialised lenders handle the lending. We will point you to the lenders other homeowners have used so you can apply directly with them at their best rate.",
  },
  {
    q: "Will my insurance pay for the roof?",
    a: "If the damage is from a covered storm or hail event, yes. We document the damage with photos and a written report, then work directly with your adjuster to get the claim paid properly. You typically only pay your deductible.",
  },
  {
    q: "Do I need to put money down to schedule?",
    a: "No. We do not collect deposits before work begins. Payment is settled when the project is complete and you have walked the finished roof with us.",
  },
  {
    q: "Which third-party lenders do other homeowners use?",
    a: "Synchrony Home, GreenSky, and Hearth are the three we hear most. You apply directly with them, not through us, so the rate you see is the rate you get. No dealer markup or referral fee.",
  },
];

const steps = financing.steps || (isOffered ? defaultOfferedSteps : defaultNotOfferedSteps);
const options = financing.options || defaultOptions;
const faqs = financing.faqs || defaultFaqs;

export default function FinancingPage() {
  const financingFaqs = brandDNA.financing?.faqs;
  const financingJsonLd = [
    buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Financing', path: '/financing' }]),
  ];
  if (financingFaqs && financingFaqs.length > 0) {
    const faqLd = buildFAQ(financingFaqs);
    if (faqLd) financingJsonLd.push(faqLd);
  }

  return (
    <>
      <SEO
        path="/financing"
        title={`Financing | ${brandDNA.company.name}`}
        description="Roofing payment plans in Kennewick, WA. Flexible options, offered to every customer, to keep your new roof or repair within budget. Ask High Point today."
        jsonLd={financingJsonLd}
      />

      {/* ════ 1. Banner — shared InnerBanner component, copy unchanged ════ */}
      <InnerBanner
        title={isOffered ? (
              <>YOUR ROOF SHOULDN&apos;T<br />BREAK THE BANK</>
            ) : (
              <>HOW HOMEOWNERS<br />PAY FOR ROOFS</>
            )}
        subtitle={financing.termsDescription || (isOffered
              ? "We offer flexible financing through trusted lending partners so you can protect your home now and pay on a schedule that works for you."
              : `${brandDNA.company.shortName || brandDNA.company.name} does not offer in-house financing. We focus on roofing and exteriors and let specialised lenders handle the lending. Below is what every homeowner should consider.`
            )}
        breadcrumb={[{ label: 'Financing' }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ── How it works ── */}
      <Band tone="white" width="full">
        <SectionHead eyebrow="THE PROCESS" title="HOW IT WORKS" />
        <Prose>
          <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            {isOffered
              ? "Four steps from inspection to installation, with flexible payment built in."
              : "Four steps from inspection to a finished roof, with honest payment guidance at every step."
            }
          </p>
        </Prose>
        <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.num} className={`flex h-full flex-col p-6 ${CARD}`} style={CARD_BORDER}>
              <Medallion>
                <span className="relative text-[15px] font-bold leading-none" style={{ fontFamily: JOSEFIN }}>
                  {s.num}
                </span>
              </Medallion>
              <h3
                className="mt-5 text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
                style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{s.desc}</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* ── Financing options. The enquiry form is gone, so the three option
             cards and the insurance callout run the full width of the band. ── */}
      <Band tone="light" width="full">
        <SectionHead
          eyebrow="YOUR OPTIONS"
          title={isOffered ? 'FINANCING OPTIONS' : 'WAYS HOMEOWNERS PAY'}
        />
        <Prose>
          <p className="mt-6 text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
            {isOffered
              ? "Payment plans are offered to every customer, subject to credit approval, so you find the fit for your budget."
              : "Insurance covers most storm damage. Third-party lenders handle the rest. We do not collect deposits."
            }
          </p>
        </Prose>

        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 lg:mt-10 lg:grid-cols-3">
          {options.map((o) => (
            <li key={o.name} className="flex">
              <div
                className={`flex h-full w-full flex-col p-6 lg:p-7 ${CARD}`}
                style={o.highlight
                  ? { border: '1px solid rgb(var(--accent) / 0.45)', boxShadow: '0 1px 2px rgba(16,40,79,0.04), 0 20px 44px -22px rgb(var(--accent) / 0.55)' }
                  : CARD_BORDER}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-[17px] font-bold uppercase leading-[1.25] sm:text-[18px]"
                    style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                  >
                    {o.name}
                  </h3>
                  {o.tag && (
                    <span
                      className="inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase leading-none tracking-[0.12em]"
                      style={o.highlight
                        ? {
                            fontFamily: INTER,
                            background: 'linear-gradient(150deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))',
                            border: '1px solid rgba(255,255,255,0.5)',
                            color: 'rgb(var(--on-accent))',
                          }
                        : {
                            fontFamily: INTER,
                            background: 'rgb(var(--accent) / 0.1)',
                            border: '1px solid rgb(var(--accent) / 0.2)',
                            color: 'rgb(var(--accent))',
                          }}
                    >
                      {o.tag}
                    </span>
                  )}
                </div>

                <span className="mt-4 block h-[3px] w-10 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />

                <p
                  className="mt-4 text-[15px] font-semibold leading-[1.5]"
                  style={{ fontFamily: INTER, color: 'rgb(var(--primary))' }}
                >
                  {o.headline}
                </p>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>{o.details}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Insurance-backed work callout */}
        <div
          className={`mt-8 flex items-start gap-4 p-6 lg:p-7 ${CARD}`}
          style={{ border: '1px solid rgb(var(--accent) / 0.25)' }}
        >
          <Medallion>
            <ShieldCheckIcon className="relative h-[18px] w-[18px]" />
          </Medallion>
          <div className="min-w-0">
            <h3
              className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.04em]"
              style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
            >
              STORM DAMAGE? OFTEN ONLY YOUR DEDUCTIBLE.
            </h3>
            <p className="mt-2.5 max-w-[74ch] text-[14.5px] leading-[1.7] text-ink/70" style={{ fontFamily: INTER }}>
              If your roof was damaged by a covered storm, we document everything to insurance standards and work the claim with your adjuster. Many homeowners end up paying only their deductible.
            </p>
          </div>
        </div>

        {/* Existing CTA — same link, same label, site button style */}
        <div className="mt-10">
          <Link
            to="/contact"
            className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.08em]"
            style={{ fontFamily: JOSEFIN, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)' }}
          >
            {brandDNA.copy.buttonText}
          </Link>
          <p className="mt-4 text-[13px] leading-[1.6] text-ink/55" style={{ fontFamily: INTER }}>
            {isOffered
              ? 'Payment plans subject to credit approval. Ask Terry when he gives you your estimate.'
              : 'No deposits. Pay on completion. Insurance work coordinated end to end.'}
          </p>
        </div>
      </Band>

      {/* ── FAQ — the shared accordion, same as the service pages. Heading and
             eyebrow are centred; the accordion keeps its full 920px measure and
             is centred in the band rather than narrowed. ── */}
      <Band tone="white" width="full">
        <SectionHead
          eyebrow={brandDNA.copy.faq.label}
          title={isOffered ? 'FINANCING FAQ' : 'PAYMENT FAQ'}
          align="center"
        />
        <div className="mx-auto mt-8 w-full max-w-[920px] lg:mt-10">
          <FAQAccordion items={faqs} />
        </div>
      </Band>

      <CTABanner formId={CTA_FORM.financing} />
    </>
  );
}
