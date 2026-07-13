// Wave 5 (2026-05-16 research bake): contextual empty state.
// Source: research file Section 30 — apps with contextual empty states cut
// user confusion 50% and lift feature adoption 80%.
//
// Used when a section has no content yet (new client with no projects yet,
// blog with no published posts, gallery before first photo upload). Renders:
//   - small geometric SVG illustration (brand-aligned, not generic stock)
//   - short headline
//   - one CTA pointing to next step
//
// Usage:
//   <EmptyState
//     headline="Gallery coming soon"
//     description="We are wrapping our first {{REGION}} projects this month."
//     actionHref="#quote"
//     actionLabel="Schedule your first inspection"
//   />
export default function EmptyState({
  headline,
  description,
  actionLabel,
  actionHref,
  onAction,
  iconSlot,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`} role="status" aria-live="polite">
      <div className="empty-state-illus" aria-hidden="true">
        {iconSlot || (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="14" width="48" height="38" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <circle cx="22" cy="28" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M8 44L22 32L34 42L46 30L56 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        )}
      </div>
      <h3 className="empty-state-headline">{headline}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && (actionHref || onAction) && (
        <a
          href={actionHref || '#'}
          onClick={onAction}
          className="empty-state-cta"
        >
          {actionLabel} <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}
