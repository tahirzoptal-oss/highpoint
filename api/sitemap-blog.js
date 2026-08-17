// Vercel serverless function (Node runtime) — the blog sitemap, computed per
// request instead of baked at build time.
//
// WHY THIS IS NOT A STATIC FILE
// The other sub-sitemaps (core, services, cities) list routes that only change
// when someone deploys, so scripts/gen-discovery.mjs can write them into dist/
// and be right until the next build. The blog cannot: a scheduled post becomes
// live on the wall clock, with no deploy in between, so a file written at build
// time would keep advertising the pre-publish set for as long as the deployment
// lasts. Computing it here means the sitemap flips at exactly the same instant
// the listing does.
//
// It is served at /sitemap-blog.xml through the rewrite in vercel.json, so the
// sitemap index needs no special-casing and the public URL is unchanged.
// gen-discovery.mjs deliberately does NOT write dist/sitemap-blog.xml — Vercel
// checks the filesystem before applying rewrites, so a static file of that name
// would shadow this function.
import { brandDNA } from '../src/config/brand-dna.js';
import { publishedPosts, publishedTime, sortByNewest } from '../src/lib/publishing.js';

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default function handler(req, res) {
  const base = String(brandDNA.company?.url || '').replace(/\/+$/, '');

  // Same filter and same sort the listing runs, against the same wall clock —
  // the sitemap can never disagree with the page it points at.
  const live = sortByNewest(publishedPosts(brandDNA.blog_posts));

  const urls = live
    .map((p) => {
      const at = publishedTime(p);
      const lastmod = at ? new Date(at).toISOString().slice(0, 10) : '';
      return (
        `  <url><loc>${xmlEscape(`${base}/blog/${p.slug}`)}</loc>` +
        (lastmod ? `<lastmod>${lastmod}</lastmod>` : '') +
        `</url>`
      );
    })
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Short edge cache: cheap under crawl load, but a post never waits more than a
  // minute past its publishedAt to appear here.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=60');
  return res.status(200).send(xml);
}
