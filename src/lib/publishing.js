/* global __BUILD_TIME__ */

/**
 * publishing.js — scheduled publishing for blog posts.
 *
 * A post may carry `publishedAt`: an ISO-8601 instant WITH an explicit UTC
 * offset, e.g. "2026-08-07T12:00:00-05:00" (noon, GMT-5). Until that instant
 * has passed the post is *scheduled*, not live, and is kept out of:
 *   - the /blog listing (src/pages/BlogPage.jsx)
 *   - the homepage blog slider (src/components/Blog.jsx)
 *   - the prerendered /blog/:slug routes (src/App.jsx getStaticPaths), and so
 *     out of dist/, and so out of sitemap-blog.xml as well
 *
 * A post with no `publishedAt` is always live. Every article that shipped
 * before scheduling existed therefore behaves exactly as it did before.
 *
 * WHY THE BUILD CLOCK, NOT Date.now()
 * The site is statically prerendered by vite-react-ssg and hydrated in the
 * browser. Gating on the visitor's live clock would let the two disagree: the
 * HTML built on the 3rd would show six posts while the client on the 8th
 * computed seven — a hydration mismatch, and a listing card pointing at a
 * /blog/:slug page the build never wrote (a hard 404 on refresh or from
 * search). Freezing "now" to the build clock keeps the listing, the slider,
 * the detail routes and the sitemap in permanent agreement.
 *
 * The practical consequence: a scheduled post publishes on the first BUILD at
 * or after its publishedAt instant. Deploy (or trigger a Vercel deploy hook /
 * daily cron rebuild) on or after the scheduled time and it goes live.
 */

// Replaced at build time by the `define` in vite.config.js. The typeof guard
// keeps this module importable from plain Node (audit scripts, tests), where
// the constant was never substituted.
const BUILD_TIME =
  typeof __BUILD_TIME__ === 'string' ? Date.parse(__BUILD_TIME__) : Date.now();

/**
 * Is this post live as of `now`? Posts without a `publishedAt`, and posts with
 * an unparseable one, are treated as live — a typo hides nothing.
 */
export function isPublished(post, now = BUILD_TIME) {
  const at = post && post.publishedAt;
  if (!at) return true;
  const t = Date.parse(at);
  return Number.isNaN(t) ? true : t <= now;
}

/** The live subset of `posts`, in the order they were authored. */
export function publishedPosts(posts, now = BUILD_TIME) {
  return (posts || []).filter((p) => isPublished(p, now));
}

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * When a post published, as a sortable instant. `publishedAt` (an explicit ISO
 * instant) is the authority when a post carries one; posts that predate
 * scheduling ship only the display `date` — "June 2026" — which resolves to the
 * first of that month. Anything unparseable falls back to 0 so it sorts last
 * rather than jumping the queue.
 */
export function publishedTime(post) {
  const at = post && post.publishedAt ? Date.parse(post.publishedAt) : NaN;
  if (!Number.isNaN(at)) return at;
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(((post && post.date) || '').trim());
  const month = m ? MONTHS[m[1].toLowerCase()] : undefined;
  return month === undefined ? 0 : Date.UTC(Number(m[2]), month, 1);
}

/**
 * `posts`, newest publication first, without mutating the input. The /blog
 * listing and the homepage slider both order themselves through this, so the
 * two can never disagree about which post is the latest — and neither has to
 * name a post to put it in front.
 */
export function sortByNewest(posts) {
  return (posts || []).slice().sort((a, b) => publishedTime(b) - publishedTime(a));
}
