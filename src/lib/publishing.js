/* global __BUILD_TIME__ */

/**
 * publishing.js — scheduled publishing for blog posts.
 *
 * A post may carry `publishedAt`: an ISO-8601 instant WITH an explicit UTC
 * offset, e.g. "2026-08-07T12:00:00-05:00" (noon, GMT-5). Until that instant
 * has passed the post is *scheduled*, not live, and is kept out of:
 *   - the /blog listing (src/pages/BlogPage.jsx)
 *   - the homepage blog slider (src/components/Blog.jsx)
 *   - the article body on /blog/:slug (src/pages/BlogPostPage.jsx, which serves
 *     a noindex "not published yet" page instead)
 *   - the blog sitemap (api/sitemap-blog.js, computed per request)
 *
 * A post with no `publishedAt` is always live. Every article that shipped
 * before scheduling existed therefore behaves exactly as it did before.
 *
 * THE CLOCK IS THE VISITOR'S, NOT THE BUILD'S
 * Every function here is pure and takes `now` explicitly, defaulting to
 * Date.now(). Publishing therefore happens on the wall clock: once the instant
 * passes, the very next page view shows the post. No rebuild, no redeploy.
 *
 * That is only possible because the deployed artifact now carries EVERY post:
 * `blog_posts` is bundled whole, and src/App.jsx prerenders a route for every
 * slug (not just the live ones), so the URL a scheduled post will occupy
 * already exists on disk the moment its time arrives.
 *
 * Hydration is kept safe not by freezing the clock but by React: the consumers
 * read `now` through useSyncExternalStore (src/lib/useLiveClock.js), whose
 * getServerSnapshot returns BUILD_TIME. The first client render therefore
 * reproduces the prerendered HTML exactly, and React swaps in the live clock
 * immediately afterwards. Same guarantee as before, without the deploy.
 */

// Replaced at build time by the `define` in vite.config.js. The typeof guard
// keeps this module importable from plain Node (the sitemap function, audit
// scripts, tests), where the constant was never substituted.
//
// This is no longer the publishing authority — only the hydration snapshot, so
// that the first client render matches the HTML the build wrote.
export const BUILD_TIME =
  typeof __BUILD_TIME__ === 'string' ? Date.parse(__BUILD_TIME__) : Date.now();

/**
 * Is this post live as of `now`? Posts without a `publishedAt`, and posts with
 * an unparseable one, are treated as live — a typo hides nothing.
 *
 * Date.parse honours the explicit offset in the stored string, so
 * "2026-08-21T12:00:00-05:00" compares as 2026-08-21T17:00:00Z regardless of
 * where the visitor (or the server) happens to be.
 */
export function isPublished(post, now = Date.now()) {
  const at = post && post.publishedAt;
  if (!at) return true;
  const t = Date.parse(at);
  return Number.isNaN(t) ? true : t <= now;
}

/** The live subset of `posts`, in the order they were authored. */
export function publishedPosts(posts, now = Date.now()) {
  return (posts || []).filter((p) => isPublished(p, now));
}

/**
 * The next instant at which some post in `posts` flips from scheduled to live,
 * or null if none remain. useLiveClock arms a timer on this so a tab left open
 * across a publish time updates itself instead of waiting for a reload.
 */
export function nextPublishTime(posts, now = Date.now()) {
  let soonest = null;
  for (const p of posts || []) {
    const at = p && p.publishedAt ? Date.parse(p.publishedAt) : NaN;
    if (Number.isNaN(at) || at <= now) continue;
    if (soonest === null || at < soonest) soonest = at;
  }
  return soonest;
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
