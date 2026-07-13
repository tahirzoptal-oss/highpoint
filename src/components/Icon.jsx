// Wave 4 (2026-05-16 research bake): unified icon wrapper.
// Source: research file Section 25 — Lucide as the single icon library.
// 1.5px stroke at 24px default. All icons use currentColor so they inherit
// the surrounding text color via Tailwind utilities (text-gold, text-white).
//
// Replaces ad-hoc inline SVGs scattered across components. Components should
// import named Lucide icons directly and pass them through this wrapper for
// consistent stroke / size / color.
//
// Usage:
//   import { CheckCircle2, MapPin, Phone, Shield } from 'lucide-react';
//   import Icon from './Icon';
//   <Icon as={CheckCircle2} size="md" />
//   <Icon as={Phone} size="lg" className="text-gold" />
//
// Sizes match the research file Section 25 scale (multiples of 4):
//   xs = 16 (inline in text)
//   sm = 20 (form prefixes, small buttons)
//   md = 24 (nav, list items, default)
//   lg = 32 (feature cards)
//   xl = 40 (hero illustrations)
//   2xl = 48 (focal points)
const SIZE_MAP = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 };

export default function Icon({ as: LucideComponent, size = 'md', strokeWidth = 1.75, className = '', ...rest }) {
  if (!LucideComponent) return null;
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] || 24);
  return (
    <LucideComponent
      size={px}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      {...rest}
    />
  );
}
