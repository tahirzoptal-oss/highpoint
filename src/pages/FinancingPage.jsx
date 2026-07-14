import { useState } from 'react';
import { Link } from 'react-router-dom';
import CTABanner from '../components/CTABanner';
import Ticker from '../components/Ticker';
import CornerOverlay from '../components/CornerOverlay';
import QuoteForm from '../components/QuoteForm';
import SEO from '../components/SEO';
import { buildBreadcrumb, buildFAQ } from '../lib/schema';
import { brandDNA } from '../config/brand-dna';

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
  const [openFaq, setOpenFaq] = useState(null);

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
        jsonLd={financingJsonLd}
      />
      {/* Page Hero */}
      <section className="relative overflow-hidden flex flex-col justify-end bg-navy theme-keep-dark" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <img
            src="/hero-image.webp"
            alt="Roofing financing options"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
            onError={(e) => { e.target.src = '/work/project1.webp'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.88) 100%)' }} />
        </div>
        <div className="relative px-8 py-14 max-w-7xl mx-auto w-full" style={{ zIndex: 5 }}>
          <div className="flex items-center gap-2 text-cool text-xs font-semibold uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gold">›</span>
            <span className="text-white">Financing</span>
          </div>
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">
            {isOffered ? 'FLEXIBLE OPTIONS' : 'PAYMENT OPTIONS'}
          </p>
          <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl lg:text-6xl mb-4">
            {isOffered ? (
              <>YOUR ROOF SHOULDN'T<br />BREAK THE BANK</>
            ) : (
              <>HOW HOMEOWNERS<br />PAY FOR ROOFS</>
            )}
          </h1>
          <span className="line-gold block w-16 mb-4" />
          <p className="text-white text-sm max-w-xl leading-relaxed font-body" style={{ textShadow: '0 1px 2px rgba(15, 23, 42, 0.6)' }}>
            {financing.termsDescription || (isOffered
              ? "We offer flexible financing through trusted lending partners so you can protect your home now and pay on a schedule that works for you."
              : `${brandDNA.company.shortName || brandDNA.company.name} does not offer in-house financing. We focus on roofing and exteriors and let specialised lenders handle the lending. Below is what every homeowner should consider.`
            )}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/contact" className="btn-gold font-heading font-bold text-sm uppercase px-6 py-3 tracking-widest text-navy">
              {brandDNA.copy.buttonText} →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-16 bg-grid bg-navy">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-10">
            <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">THE PROCESS</p>
            <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-2">
              HOW IT WORKS
            </h2>
            <span className="line-gold block w-12 mx-auto mt-3 mb-4" />
            <p className="text-cool text-sm max-w-md mx-auto">
              {isOffered
                ? "Four steps from inspection to installation, with flexible payment built in."
                : "Four steps from inspection to a finished roof, with honest payment guidance at every step."
              }
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.num} className="card-elevated-dark flex flex-col gap-3 p-5 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <div className="w-10 h-10 flex items-center justify-center font-heading font-bold text-sm flex-shrink-0 text-white" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.45)', background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                  {s.num}
                </div>
                <div className="font-heading font-bold text-white uppercase text-sm tracking-wide leading-tight">{s.title}</div>
                <p className="text-cool text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section className="relative py-16 bg-grid bg-navy-slate">
        {/* Rule 58: per-client corner overlays, clipped in an inner layer so the
            section stays overflow-visible and the sticky rail can pin. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CornerOverlay position="top-left" size={320} />
          <CornerOverlay position="bottom-right" size={320} />
        </div>
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-10">
                <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">YOUR OPTIONS</p>
                <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-2">
                  {isOffered ? "FINANCING OPTIONS" : "WAYS HOMEOWNERS PAY"}
                </h2>
                <span className="line-gold block w-12 mt-3 mb-4" />
                <p className="text-cool text-sm max-w-md">
                  {isOffered
                    ? "Payment plans are offered to every customer, subject to credit approval, so you find the fit for your budget."
                    : "Insurance covers most storm damage. Third-party lenders handle the rest. We do not collect deposits."
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {options.map((o) => (
                  <div
                    key={o.name}
                    className="card-elevated-dark flex flex-col gap-3 p-6 bg-navy"
                    style={{
                      border: o.highlight ? '2px solid rgb(var(--accent))' : '1px solid rgba(100,116,139,0.25)',
                      borderTop: o.highlight ? '2px solid rgb(var(--accent))' : '1px solid rgba(100,116,139,0.25)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-heading font-bold text-white uppercase text-base leading-tight">{o.name}</div>
                      {o.tag && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex-shrink-0" style={{ background: o.highlight ? 'rgb(var(--accent) / 0.2)' : 'rgba(100,116,139,0.2)', color: o.highlight ? 'rgb(var(--accent))' : '#94A3BB', border: `1px solid ${o.highlight ? 'rgb(var(--accent) / 0.3)' : 'rgba(100,116,139,0.3)'}` }}>
                          {o.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-gold text-sm font-semibold leading-snug">{o.headline}</p>
                    <p className="text-cool text-xs leading-relaxed">{o.details}</p>
                  </div>
                ))}
              </div>

              {/* Insurance-backed work callout */}
              <div className="mt-8 p-5 flex items-start gap-4 bg-navy" style={{ border: '1px solid rgba(100,116,139,0.25)', borderLeft: '2px solid rgb(var(--accent))' }}>
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: 'rgb(var(--accent) / 0.1)', border: '1px solid rgb(var(--accent) / 0.3)' }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="rgb(var(--accent))" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
                  </svg>
                </div>
                <div>
                  <div className="font-heading font-bold text-white uppercase text-sm tracking-wide mb-1">STORM DAMAGE? OFTEN ONLY YOUR DEDUCTIBLE.</div>
                  <p className="text-cool text-xs leading-relaxed">
                    If your roof was damaged by a covered storm, we document everything to insurance standards and work the claim with your adjuster. Many homeowners end up paying only their deductible.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <Link to="/contact" className="btn-gold inline-block font-heading font-bold text-base uppercase px-10 py-3.5 tracking-widest text-navy">
                  {brandDNA.copy.buttonText}
                </Link>
                {isOffered && (
                  <p className="text-steel text-xs mt-4">Payment plans subject to credit approval. Ask Terry when he gives you your estimate.</p>
                )}
                {!isOffered && (
                  <p className="text-steel text-xs mt-4">No deposits. Pay on completion. Insurance work coordinated end to end.</p>
                )}
              </div>
            </div>

            {/* Sticky quote rail */}
            <div>
              <div className="lg:sticky lg:top-24">
                <QuoteForm formId="financing" title="Get Your Free Estimate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* FAQ */}
      <section className="relative py-16 bg-grid bg-navy">
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3 text-center">{brandDNA.copy.faq.label}</p>
          <h2 className="font-heading font-bold text-white uppercase text-4xl leading-tight mb-2 text-center">
            {isOffered ? "FINANCING FAQ" : "PAYMENT FAQ"}
          </h2>
          <span className="line-gold block w-12 mx-auto mt-3 mb-8" />
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden transition-all duration-200 bg-navy-slate"
                style={{
                  border: `1px solid ${openFaq === i ? 'rgb(var(--accent))' : 'rgba(100,116,139,0.25)'}`,
                  borderTop: openFaq === i ? '2px solid rgb(var(--accent))' : '1px solid rgba(100,116,139,0.25)',
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-heading font-bold text-white text-sm uppercase tracking-wide leading-tight">{item.q}</span>
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: openFaq === i ? 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' : 'rgba(100,116,139,0.2)',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg className="w-4 h-4" style={{ color: openFaq === i ? '#0F172A' : '#94A3BB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16M4 12h16" />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ borderTop: '1px solid rgba(100,116,139,0.2)' }}>
                    <p className="text-cool text-sm leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
