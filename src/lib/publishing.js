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
