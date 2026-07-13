import { brandDNA } from '../config/brand-dna';

const items = Array.from({ length: 5 }, () => brandDNA.company.name.toUpperCase());

export default function Ticker() {
  return (
    <div className="py-2.5 overflow-hidden bg-navy">
      <div className="flex items-center justify-around gap-4 px-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap">
            <img src="/logo.webp" alt="" className="w-16 h-auto flex-shrink-0" aria-hidden="true" />
            <span className="text-white font-heading font-bold text-sm uppercase tracking-widest">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
