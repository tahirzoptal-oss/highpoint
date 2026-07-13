// Wave 5 (2026-05-16 research bake): reusable section eyebrow.
// Source: research file Section 4 + Section 27.
//
// Standardizes the eyebrow + accent-line + heading triad used at the top of
// every major section. Locks in:
//   - 12px uppercase font-body
//   - tracking-eyebrow (0.12em letter-spacing)
//   - text-gold by default (theme-aware via the Rule 65 light-theme override)
//   - 12px gap below eyebrow
//   - 12px tall gold accent line
//   - 24px gap before the H2
//
// Anti-pattern this replaces: every section component carrying its own ad-hoc
// inline eyebrow + line markup with subtly different tracking (some 0.2em,
// some 0.16em). Now consistent.
//
// Usage:
//   <SectionEyebrow label={brandDNA.copy.reviews.label} heading={brandDNA.copy.reviews.heading} />
//   or compose manually:
//   <SectionEyebrow label="WHAT WE DO" />  <h2>...</h2>
export default function SectionEyebrow({
  label,
  heading,
  headingTag: H = 'h2',
  alignment = 'left',
  className = '',
  headingClassName = '',
}) {
  const alignClass = alignment === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`section-eyebrow-block ${alignClass} ${className}`}>
      {label && (
        <p className="section-eyebrow-label">{label}</p>
      )}
      <span className="line-gold block w-12 mt-3 mb-5" />
      {heading && (
        <H className={`section-eyebrow-heading ${headingClassName}`}>{heading}</H>
      )}
    </div>
  );
}
