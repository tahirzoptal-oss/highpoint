// Wave 5 (2026-05-16 research bake): skeleton loader primitives.
// Source: research file Section 30 — skeleton screens reduce perceived load
// time ~30% and prevent layout shift when real content arrives.
//
// Three pre-shaped skeletons:
//   <SkeletonLine width="80%" /> single text line
//   <SkeletonBlock aspect="16/9" /> media placeholder
//   <SkeletonReviewCard /> composite for the Reviews section
//
// Shimmer animation is CSS-only via background-position. Pulse animation is
// gentle (1.5s loop). Honors prefers-reduced-motion via the Wave 1 global guard.
//
// Usage in components that load async data:
//   {reviews.length === 0 && Array.from({length: 3}).map((_, i) =>
//      <SkeletonReviewCard key={i} />
//   )}
//   {reviews.map(r => <ReviewCard {...r} />)}

export function SkeletonLine({ width = '100%', height = '0.875rem', className = '' }) {
  return (
    <span
      className={`skeleton-shimmer block rounded ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({ aspect = '16/9', className = '' }) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      style={{ aspectRatio: aspect, width: '100%' }}
      aria-hidden="true"
    />
  );
}

export function SkeletonReviewCard() {
  return (
    <div className="card-elevated p-6 space-y-3 bg-white" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="skeleton-shimmer rounded-full" style={{ width: 48, height: 48 }} />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" height="0.75rem" />
        </div>
      </div>
      <SkeletonLine width="100%" />
      <SkeletonLine width="95%" />
      <SkeletonLine width="70%" />
    </div>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className="card-elevated-dark overflow-hidden flex flex-col bg-navy" aria-hidden="true">
      <SkeletonBlock aspect="16/9" />
      <div className="p-5 space-y-3">
        <SkeletonLine width="40%" height="0.625rem" />
        <SkeletonLine width="80%" height="1.125rem" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="60%" />
      </div>
    </div>
  );
}

export default SkeletonLine;
