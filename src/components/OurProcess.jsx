import Ticker from './Ticker';
import BackgroundPattern from './BackgroundPattern';
import { brandDNA } from '../config/brand-dna';

export default function OurProcess() {
  return (
    <section id="process" className="relative overflow-hidden bg-navy">
      <BackgroundPattern motif={brandDNA.shape_motif} opacity={0.3} color="white" />

      {/* Mobile image */}
      <div className="lg:hidden relative h-52 overflow-hidden">
        <img
          src={`/work/${(brandDNA.previous_projects && brandDNA.previous_projects[3] && brandDNA.previous_projects[3].filename) || (brandDNA.previous_projects && brandDNA.previous_projects[0] && brandDNA.previous_projects[0].filename) || 'project4.webp'}`}
          alt={`${brandDNA.company.name} crew completing a roof installation in ${brandDNA.address.city}`}
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          onError={(e) => { e.target.src = '/work/project6.webp'; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(to top, rgb(var(--fade-navy)), transparent)' }} />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2">

        {/* Left: full-bleed image (desktop only) */}
        <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: 540 }}>
          <img
            src={`/work/${(brandDNA.previous_projects && brandDNA.previous_projects[3] && brandDNA.previous_projects[3].filename) || (brandDNA.previous_projects && brandDNA.previous_projects[0] && brandDNA.previous_projects[0].filename) || 'project4.webp'}`}
            alt={`${brandDNA.company.name} crew completing a roof installation in ${brandDNA.address.city}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
            onError={(e) => { e.target.src = '/work/project6.webp'; }}
          />
          {/* Right-edge fade */}
          <div className="absolute inset-y-0 right-0 w-44" style={{ background: 'linear-gradient(to right, transparent, rgb(var(--fade-navy)))' }} />
          {/* Bottom badge */}
          <div className="absolute bottom-0 left-0 p-4 pr-48" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 100%)' }}>
            <div className="font-heading font-bold text-white text-lg uppercase">{brandDNA.copy.process.badgeText}</div>
            <div className="font-body text-cool text-xs">{brandDNA.copy.process.badgeSubtext}</div>
          </div>
        </div>

        {/* Right: steps content */}
        <div className="px-8 lg:pl-10 lg:pr-16 pt-12 pb-12">
          <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">
            {brandDNA.copy.process.label}
          </p>
          <h2 className="font-heading font-bold text-white uppercase leading-none text-5xl mb-3">
            {brandDNA.copy.process.heading}
          </h2>
          <span className="line-gold block w-12 mb-5" />
          <p className="text-cool font-body text-sm leading-relaxed mb-7">
            {brandDNA.copy.process.body}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {brandDNA.process_steps.map((step) => (
              <div
                key={step.n}
                className="card-elevated-dark flex items-center gap-4 px-4 py-4 cursor-default transition-all group bg-navy-slate"
                style={{ border: '1px solid rgba(100,116,139,0.25)' }}
              >
                {/* Rule 60: step number renders white with a black-soft shadow
                    so the digit stays crisp on the per-client accent gradient. */}
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0 font-heading font-bold text-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)',
                    color: '#FFFFFF',
                    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  }}
                >
                  {step.n}
                </div>
                <span className="font-heading font-bold text-white text-sm uppercase tracking-wide leading-tight">{step.title}: {step.body}</span>
              </div>
            ))}
          </div>

          {/* Risk-reversal line */}
          <p className="text-steel font-body text-xs italic mt-5">
            You are in control at every step. No pressure, no obligation, no surprise charges.
          </p>

          {/* CTA */}
          <button
            onClick={() => {
              const el = document.getElementById('quote') || document.getElementById('cta-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-gold mt-5 font-heading font-bold text-sm uppercase px-6 py-3 tracking-widest text-navy"
          >
            {brandDNA.copy.buttonText} →
          </button>
        </div>

      </div>
      <Ticker />
    </section>
  );
}
