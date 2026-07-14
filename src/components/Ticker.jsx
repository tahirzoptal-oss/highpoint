import { brandDNA } from '../config/brand-dna';

const items = Array.from({ length: 5 }, () => brandDNA.company.name.toUpperCase());

// Reveal each repeat only at the width where a full item still fits, so the
// strip never overflows its clipped band: 1 item on phones, up to 5 on wide
// desktops (and inside the proposal's 1440px laptop embed it lands cleanly).
const revealAt = [
  'flex',
  'hidden min-[760px]:flex',
  'hidden min-[1120px]:flex',
  'hidden min-[1460px]:flex',
  'hidden min-[1820px]:flex',
];

export default function Ticker() {
  return (
    <div className="py-2.5 overflow-hidden bg-navy">
      <div className="flex items-center justify-center min-[760px]:justify-around gap-4 px-4 sm:px-6">
        {items.map((item, i) => (
          <div key={i} className={`items-center gap-3 whitespace-nowrap ${revealAt[i] || 'hidden'}`}>
            <img src="/logo.webp" alt="" className="w-12 sm:w-16 h-auto flex-shrink-0" aria-hidden="true" />
            <span className="text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-widest">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
