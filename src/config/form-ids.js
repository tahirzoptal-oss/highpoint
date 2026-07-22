/**
 * form-ids.js — the one place every lead form on the site gets its identity.
 *
 * Each ID is used twice for the same form instance:
 *   1. as the `id` attribute on the <form> element, so it is addressable in the
 *      DOM, in analytics selectors and in QA notes;
 *   2. as the `formId` passed to useLeadForm(), which rides along in the
 *      onLead({ ...fields, formId }) payload — that is what tells you which
 *      form produced a given submission.
 *
 * Rules
 *   - IDs are kebab-case and end in `-form`.
 *   - A component reused on several pages does NOT hardcode its ID. It takes a
 *     `formId` prop and every call site passes its own, so two instances of the
 *     same component never share an identity. See CTA_FORM below.
 *   - Detail pages (services, service areas, blog posts) are generated from
 *     data, so their IDs are built from the route slug rather than listed here.
 *     The builders at the bottom own that.
 */

// ── Fixed, one-per-site forms ──────────────────────────────────────────────
export const HOME_HERO_FORM = 'home-hero-form';
export const CONTACT_PAGE_FORM = 'contact-page-form';

// ── The global CTA banner, one entry per page that renders it. Same component,
//    seven instances, seven identities. ──
export const CTA_FORM = {
  home: 'home-cta-form',
  about: 'about-cta-form',
  services: 'services-cta-form',
  serviceAreas: 'service-areas-cta-form',
  gallery: 'gallery-cta-form',
  blog: 'blog-cta-form',
  financing: 'financing-cta-form',
};

// ── Sticky quote rail on the generated detail pages. One form per page, so the
//    slug is what keeps them apart. ──
export const serviceQuoteFormId = (slug) => `service-${slug}-quote-form`;
export const cityQuoteFormId = (slug) => `service-area-${slug}-quote-form`;
export const blogQuoteFormId = (slug) => `blog-${slug}-quote-form`;

/**
 * Every fixed ID, plus the builders' output for a given set of slugs. Exists so
 * a test or an audit script can assert uniqueness without hand-listing them.
 */
export function allFormIds({ services = [], cities = [], posts = [] } = {}) {
  return [
    HOME_HERO_FORM,
    CONTACT_PAGE_FORM,
    ...Object.values(CTA_FORM),
    ...services.map(serviceQuoteFormId),
    ...cities.map(cityQuoteFormId),
    ...posts.map(blogQuoteFormId),
  ];
}
