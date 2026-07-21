/**
 * One definition of "this nav item points at the page I'm on", shared by the
 * header and the footer so the two can never disagree.
 *
 * Matches the item itself and anything beneath it, which is what makes a
 * dropdown parent light up on a child page (/services is active on
 * /services/roof-repairs). The trailing-slash check is what keeps sibling
 * routes apart: a bare `startsWith` would light up /service on /service-areas.
 *
 * Hash links and empty targets are never active.
 *
 * `exact` turns the ancestor match off. Use it for LEAF links — a footer entry
 * or a dropdown row that points at one specific page. Without it, any leaf
 * whose href is a section index (e.g. "Insurance Claims" falls back to
 * /services) would light up on every page beneath that section, so several
 * unrelated rows highlight at once.
 */
export function isActivePath(pathname, to, { exact = false } = {}) {
  if (!to || typeof to !== 'string' || to.startsWith('#')) return false;
  const here = (pathname || '/').replace(/\/+$/, '') || '/';
  const target = to.replace(/\/+$/, '') || '/';
  if (target === '/' || exact) return here === target;
  return here === target || here.startsWith(`${target}/`);
}
