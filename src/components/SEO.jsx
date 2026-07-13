import { Head } from 'vite-react-ssg';
import { brandDNA } from '../config/brand-dna';

/**
 * Per-route head: title, meta description, canonical, OG/Twitter, optional
 * noindex, and optional JSON-LD. Rendered through vite-react-ssg's <Head> so
 * every tag is baked into the prerendered HTML and visible to crawlers with no
 * JS. This is the single owner of head tags; index.html stays minimal.
 *
 * Props:
 *   path        absolute route path, e.g. "/" or "/services/roof-replacement"
 *   title       overrides brandDNA.meta.title
 *   description overrides brandDNA.meta.description
 *   image       absolute-from-root OG image path, e.g. "/hero-image.webp"
 *   noindex     adds <meta name="robots" content="noindex, nofollow">
 *   jsonLd      a JSON-LD object (or array) baked as <script type="application/ld+json">
 */
export default function SEO({ title, description, path = '/', image, noindex = false, jsonLd }) {
  const base = String(brandDNA.company?.url || '').replace(/\/+$/, '');
  const canonical = base + (path === '/' ? '/' : path);
  const metaTitle = title || brandDNA.meta?.title || brandDNA.company?.name || '';
  const metaDesc = description || brandDNA.meta?.description || '';
  const ogImage = base + (image || brandDNA.meta?.ogImage || '/hero-image.webp');
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={brandDNA.company?.name || ''} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Head>
  );
}
