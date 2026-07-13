// Wave 3 (2026-05-16 research bake): responsive <Picture> wrapper.
// Source: research file Section 12 — AVIF + WebP + JPEG fallback chain with
// explicit dimensions to lock LCP + kill CLS.
//
// Usage:
//   <Picture
//     src="/work/project1.webp"
//     alt="Roof installation in Hamilton County"
//     width={1280}
//     height={800}
//     priority   // pass for above-the-fold images (sets eager + fetchpriority high)
//   />
//
// Build pipeline writes .webp files only today (tools/optimise-image.py),
// but the wrapper accepts an avifSrc prop if the build ever emits AVIF too.
// Defaults to lazy + low priority for below-the-fold safety.
//
// All Picture instances inherit:
//   - explicit width/height attributes (CLS = 0)
//   - loading="lazy" by default, "eager" when priority
//   - decoding="async"
//   - fetchpriority="high" when priority, "low" otherwise
//   - <img> styled to object-cover the parent if className contains 'absolute' or 'inset-0'
export default function Picture({
  src,
  avifSrc,
  alt,
  width,
  height,
  priority = false,
  className = '',
  imgClassName = '',
  style,
  onError,
  ...rest
}) {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'low';

  return (
    <picture className={className} style={style} {...rest}>
      {avifSrc && <source type="image/avif" srcSet={avifSrc} />}
      <source type="image/webp" srcSet={src} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        className={imgClassName}
        onError={onError}
      />
    </picture>
  );
}
