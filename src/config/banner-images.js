/**
 * Inner-banner background images.
 *
 * Every page that renders <InnerBanner/> gets its own photo from /public/work/,
 * resolved from the current route. Nothing is imported, copied, renamed or moved
 * — these are the 22 project photos already shipped in that folder.
 *
 * A page can still override the choice by passing `image` to InnerBanner; the
 * blog post pages do exactly that, using each post's own cover. Everything else
 * is looked up here, so adding a page needs no banner wiring: an unmapped route
 * falls back to a stable image derived from its path (see `bannerImageFor`).
 *
 * Coverage note: the site has 25 banner routes and the folder holds 22 photos,
 * so three pairings repeat by necessity. The repeats are deliberately placed
 * between different page families (a service-area page and a top-level page)
 * rather than between siblings, so two pages a visitor is likely to compare
 * never share a photo. Drop more photos into /public/work/, add them to POOL,
 * and the repeats disappear.
 */

// Every file currently in /public/work/, in numeric order.
export const POOL = Array.from({ length: 22 }, (_, i) => `/work/project${i + 1}.webp`);

const img = (n) => `/work/project${n}.webp`;

// Explicit route -> photo. Keyed by pathname so the mapping is reviewable at a
// glance and a given page always renders the same banner between builds.
const BY_ROUTE = {
  // ── Top-level pages ──
  '/about': img(1),
  '/services': img(2),
  '/gallery': img(3),
  '/service-areas': img(4),
  '/blog': img(5),
  '/financing': img(6),
  '/contact': img(7),
  '/privacy-policy': img(8),
  '/terms-conditions': img(9),

  // ── Service detail ──
  '/services/roof-repairs': img(10),
  '/services/roof-replacement': img(11),
  '/services/roof-installation': img(12),
  '/services/roof-inspections': img(13),
  '/services/emergency-roofing': img(14),
  '/services/insurance-claims': img(15),
  '/services/storm-damage-repair': img(16),
  '/services/home-renovation-remodeling': img(17),

  // ── Service-area detail. The last three reuse a top-level page's photo,
  //    which is where the 25-routes-into-22-photos overlap lands. ──
  '/service-areas/kennewick': img(18),
  '/service-areas/pasco': img(19),
  '/service-areas/richland': img(20),
  '/service-areas/west-richland': img(21),
  '/service-areas/walla-walla': img(22),
  '/service-areas/yakima': img(1),
  '/service-areas/benton-city': img(2),
  '/service-areas/spokane': img(3),
};

// Stable string hash, so an unmapped route keeps the same photo on every build
// and every visit rather than shuffling between renders.
function hashIndex(key, length) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % length;
}

/**
 * Photo for a route. Trailing slashes are ignored so "/about" and "/about/"
 * resolve identically.
 */
export function bannerImageFor(pathname) {
  const key = String(pathname || '/').replace(/\/+$/, '') || '/';
  return BY_ROUTE[key] || POOL[hashIndex(key, POOL.length)];
}

export default bannerImageFor;
