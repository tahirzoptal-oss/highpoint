/**
 * useLiveClock.js — the runtime clock the blog reads its "now" from.
 *
 * WHY A STORE AND NOT `Date.now()` IN RENDER
 * The site is prerendered by vite-react-ssg and hydrated in the browser.
 * Calling Date.now() during render would make the first client render disagree
 * with the HTML the build wrote, which React reports as a hydration mismatch
 * and repairs by throwing the server markup away.
 *
 * useSyncExternalStore solves exactly this. Its getServerSnapshot is used for
 * the SSR render AND for the hydration render, so both produce BUILD_TIME and
 * match byte for byte. The moment hydration finishes React subscribes, reads
 * the live snapshot, and re-renders with the visitor's real clock.
 *
 * The snapshot is a cached value, never a fresh Date.now() per call — getSnapshot
 * must be stable between store updates or React re-renders forever. It moves at
 * exactly two moments: when the first subscriber primes it, and when a post's
 * publishedAt boundary is crossed.
 */
import { useMemo, useSyncExternalStore } from 'react';
import { BUILD_TIME, nextPublishTime, publishedPosts, sortByNewest } from './publishing';
import { brandDNA } from '../config/brand-dna';

const subscribers = new Set();

// Starts on the build clock so the pre-hydration snapshot and the hydration
// snapshot agree; primed to the real clock by the first subscriber.
let snapshot = BUILD_TIME;
let primed = false;
let timer = null;

const notify = () => { for (const fn of subscribers) fn(); };

// setTimeout clamps above 2^31-1 ms and fires immediately, which would spin.
const MAX_DELAY = 2147483647;

function disarm() {
  if (timer !== null) { clearTimeout(timer); timer = null; }
}

/**
 * Arm a timer for the next post to go live, so an open tab flips over on its
 * own. Re-armed after every advance; a schedule further out than MAX_DELAY is
 * approached in hops rather than skipped.
 */
function arm() {
  disarm();
  if (!subscribers.size) return;
  const next = nextPublishTime(brandDNA.blog_posts, snapshot);
  if (next === null) return;
  // +1000ms so the timer lands *past* the boundary, never a hair before it on
  // a coarse timer, which would re-arm for the same instant in a tight loop.
  timer = setTimeout(advance, Math.min(Math.max(next - Date.now() + 1000, 0), MAX_DELAY));
}

function advance() {
  timer = null;
  snapshot = Date.now();
  notify();
  arm();
}

/**
 * Background tabs have their timers throttled hard, so a tab that sat through a
 * publish boundary can come back stale. Re-checking on wake costs nothing and
 * only notifies when a boundary was actually missed.
 */
function onWake() {
  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
  const next = nextPublishTime(brandDNA.blog_posts, snapshot);
  if (next !== null && Date.now() >= next) advance();
}

function subscribe(cb) {
  subscribers.add(cb);

  // First mount on the client: leave the build clock behind. Done once, not per
  // subscriber, so mounting a second consumer cannot churn the snapshot.
  if (!primed) {
    primed = true;
    snapshot = Date.now();
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onWake);
    notify();
  }
  arm();

  return () => {
    subscribers.delete(cb);
    if (!subscribers.size) disarm();
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => BUILD_TIME;

/**
 * The current instant, as a timestamp that is stable within a render pass.
 * BUILD_TIME during SSR and hydration; the visitor's clock from then on.
 */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Every live post, newest publication first — the one list the /blog listing,
 * the homepage slider and the featured slot all read, so they can never
 * disagree about what is published or which post is newest.
 */
export function useLivePosts(posts = brandDNA.blog_posts) {
  const now = useNow();
  return useMemo(() => sortByNewest(publishedPosts(posts, now)), [posts, now]);
}
