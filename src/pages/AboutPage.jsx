import { Link, useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import Founder from '../components/Founder';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import Testimonials from '../components/Testimonials';
import ServiceAreas from '../components/ServiceAreas';
import CTABanner from '../components/CTABanner';
import { CTA_FORM } from '../config/form-ids';
import SEO from '../components/SEO';
import { buildBreadcrumb } from '../lib/schema';
import { QUOTE_HASH, goToQuote } from '../lib/scrollToQuote';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// The site's existing core-values copy, carried over unchanged.
const values = [
  {
    title: 'Integrity First',
    text: "We tell you the truth, even when it's not what you want to hear. If your roof can be repaired, we'll repair it. We never upsell work you don't need.",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
      </svg>
    ),
  },
  {
    title: 'Expert Craftsmanship',
    text: 'We use manufacturer-recommended installation techniques and premium materials. Every project is handled by trained professionals and trusted subcontractor crews, with Terry personally managing and overseeing the work.',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26" />
      </svg>
    ),
  },
  {
    title: 'Total Transparency',
    text: "From your first inspection to the final walkthrough, you know exactly what's happening and why. No hidden fees, no surprises on the final invoice.",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Accountability',
    text: 'We stand behind our work with manufacturer-backed warranties and our direct phone number. If something is wrong, we fix it.',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Community',
    text: 'We live and work in the same neighborhoods we serve. Our reputation is built on treating every homeowner like a neighbor, because you are one.',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Education',
    text: 'We believe informed homeowners make the best decisions. That is why we walk you through every finding, every option, and every step of the process.',
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const showTeam = Boolean(brandDNA.team_group_photo || (brandDNA.team_members && brandDNA.team_members.length > 0));

  return (
    <>
      <SEO
        path="/about"
        title={`About | ${brandDNA.company.name}`}
        description="Meet Terry Preston, owner-operator of High Point Renovation & Roofing in Kennewick, WA. He inspects every roof himself and manages every job personally."
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title="About Us"
        subtitle={brandDNA.company.tagline}
        breadcrumb={[{ label: 'About Us' }]}
      />

      {/* ════ 2. Logo slider ════ */}
      <LogoSlider />

      {/* ════ 3. Belt slider ════ */}
      <BeltSlider />

      {/* ════ 4. Owner story + vision/mission — the shared About component.
             No CTA here: it links to this page. ════ */}
      <Founder showCta={false} />

      {/* ════ 5. Our Story — full-bleed brand statement. Deliberately the only
             dark section in the page body, so it reads as a break between the
             light sections above and below rather than another content block. ════ */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(54% 48% at 12% 6%, rgba(44,90,166,0.36) 0%, transparent 62%),' +
              'radial-gradient(48% 44% at 88% 14%, rgba(110,143,196,0.22) 0%, transparent 64%),' +
              'radial-gradient(60% 52% at 50% 106%, rgba(44,90,166,0.24) 0%, transparent 62%),' +
              'linear-gradient(166deg, #0B1C3A 0%, #10284F 54%, #0A1730 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-1/4 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: 'rgb(var(--accent) / 0.22)' }} />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.14)' }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
          <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
        </div>

        <div className="site-container relative">
          {/* Centred brand statement — no image, no columns. Capped at 1000px
              rather than a `ch` measure so the three paragraphs get real width
              on desktop while staying comfortably readable. */}
          <div className="mx-auto max-w-[1000px] text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgb(var(--accent-light))', fontFamily: INTER }}>
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent-light))' }} />
              Our Story
            </p>

            <h2 className="section-h2 uppercase" style={{ color: '#FFFFFF', textShadow: '0 2px 22px rgba(8,18,38,0.5)' }}>
              Built on Trust &amp; Craft
            </h2>

            <span className="mx-auto mb-8 mt-6 block h-[3px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)))' }} />

            <div className="flex flex-col gap-6 text-[15px] leading-[1.72]" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.8)' }}>
              <p>{brandDNA.copy.founder.para1}</p>
              <p>{brandDNA.copy.founder.para2}</p>
              <p>
                That commitment has earned us a perfect {brandDNA.reviews.rating.toFixed(1)}-star rating on Google,
                satisfied homeowners across {brandDNA.company.serviceRegion}, and more referrals than we can count.
                We believe the best advertisement is work you&rsquo;re proud of.
              </p>
            </div>
          </div>

          {/* Option A: the key-points row is gone so the section is purely the
              story. The trust claims it used still appear in the CTA banner. */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 lg:mt-14">
            <a
              href={QUOTE_HASH}
              onClick={(e) => goToQuote(e, navigate)}
              className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 text-[13px] uppercase tracking-[0.07em]"
              style={{ color: 'rgb(var(--on-accent))', textShadow: '0 1px 2px rgba(0,0,0,0.18)', fontFamily: INTER }}
            >
              {brandDNA.copy.buttonText}
              <span aria-hidden>→</span>
            </a>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2.5 rounded-[14px] px-7 py-4 text-[13px] font-bold uppercase tracking-[0.07em] backdrop-blur-md transition-colors duration-300 ease-out hover:bg-[rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1C3A]"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.24)', color: '#FFFFFF', fontFamily: INTER }}
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>


      {/* ════ 6. Core values ════ */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(48% 44% at 90% 10%, rgba(110,143,196,0.18) 0%, transparent 62%),' +
              'radial-gradient(44% 40% at 6% 16%, rgba(44,90,166,0.12) 0%, transparent 64%),' +
              'linear-gradient(170deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(118deg, transparent 0 92px, rgba(24,60,120,0.03) 92px 93px)' }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />
        </div>

        <div className="site-container relative">
          <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
            <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
              <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
              How We Operate
            </p>
            <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
              The Values We Work By
            </h2>
            <span className="mx-auto mb-5 mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
            <p className="mx-auto max-w-[62ch] text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
              These aren&rsquo;t marketing words. They are the standards {brandDNA.team.founder.name.split(' ')[0]} holds every project to, every single time.
            </p>
          </div>

          {/* Values only — the quote rail is gone, so the grid runs the full
              container width and stays centred under the heading. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {values.map((v) => (
              <article
                key={v.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-18px_rgba(16,40,79,0.18)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,79,0.05),0_22px_46px_-20px_rgba(16,40,79,0.26)] sm:p-7"
                style={{ border: '1px solid rgba(16,40,79,0.07)' }}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))' }} />

                <span
                  className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[15px] transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                  style={{
                    background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 18px -8px rgb(var(--accent) / 0.55)',
                    color: 'rgb(var(--on-accent))',
                  }}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-[4px] top-[4px] h-[42%] rounded-[11px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
                  <span className="relative">{v.icon}</span>
                </span>

                <h3 className="mt-5 text-[15px] font-bold uppercase leading-tight tracking-[0.06em]" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}>
                  {v.title}
                </h3>

                <span aria-hidden className="mb-3.5 mt-3 block h-px w-9" style={{ background: 'rgb(var(--accent) / 0.5)' }} />

                <p className="text-[14px] leading-[1.75] text-ink/70" style={{ fontFamily: INTER }}>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* ════ 7. Meet the team — renders only when brand-dna carries crew
             imagery, so it never leaves an empty section behind. ════ */}
      {showTeam && (
        <section className="relative overflow-hidden py-14 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(170deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)' }}
          />
          <div className="site-container relative">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}>
                <span className="h-1.5 w-1.5 rotate-45 rounded-[2px]" style={{ background: 'rgb(var(--accent))' }} />
                Our Crew
              </p>
              <h2 className="section-h2 uppercase" style={{ color: 'rgb(var(--primary))' }}>
                Meet the Team
              </h2>
              <span className="mx-auto mb-5 mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }} />
              <p className="mx-auto max-w-[62ch] text-[15px] leading-[1.72] text-ink/75" style={{ fontFamily: INTER }}>
                The {brandDNA.address.city || 'local'} crew that walks every roof, files every claim, and stands behind every warranty.
              </p>
            </div>

            {brandDNA.team_group_photo && (
              <div
                className="relative mb-8 overflow-hidden rounded-[24px] bg-white p-2"
                style={{ border: '1px solid rgba(16,40,79,0.07)', boxShadow: '0 2px 6px -1px rgba(16,40,79,0.06), 0 26px 52px -26px rgba(16,40,79,0.32)' }}
              >
                <img
                  src={`/team/${brandDNA.team_group_photo}`}
                  alt={`The ${brandDNA.company.name} team`}
                  className="block w-full rounded-[18px] object-cover"
                  style={{ maxHeight: 520 }}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {brandDNA.team_members && brandDNA.team_members.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {brandDNA.team_members.map((m, i) => (
                  <div
                    key={`${m.name || m.filename || i}`}
                    className="rounded-[20px] bg-white p-5 text-center shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_32px_-20px_rgba(16,40,79,0.2)]"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {m.filename && (
                      <img
                        src={`/team/${m.filename}`}
                        alt={m.name || 'Team member'}
                        className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    {m.name && (
                      <div className="text-[14px] font-bold uppercase tracking-[0.04em]" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}>{m.name}</div>
                    )}
                    {m.role && (
                      <div className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}>{m.role}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <BeltSlider />

      {/* ════ 8. Where we work ════ */}
      <ServiceAreas variant="light" />

      {/* ════ 9. Global CTA ════ */}
      <CTABanner formId={CTA_FORM.about} />
    </>
  );
}
