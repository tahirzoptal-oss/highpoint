import { brandDNA } from './brand-dna';

/**
 * PRIMARY_SERVICES — the single source of truth for the site's service list.
 *
 * These are the seven residential roof services from the client intake PDF
 * ("What Residential Roof Services Do You Offer?"), verbatim and in the order
 * given. The homepage Services section, the header dropdown and the footer all
 * import from here, so the three can never drift apart.
 *
 * Every name now maps onto its OWN detail page except "New Roof Installation",
 * which shares the scraped roof-installation page. Roof Replacement, Emergency
 * Roofing, Insurance Claims and Storm Damage Repair each got a real page from
 * their copy deck, so they no longer fall back to the /services index.
 * `hrefForService` still verifies against brand-dna, so a data refresh that
 * drops a slug degrades to the index rather than routing to a 404.
 */
const SERVICE_DEFS = [
  { name: 'Roof Repair', slug: 'roof-repairs' },
  { name: 'Roof Replacement', slug: 'roof-replacement' },
  { name: 'New Roof Installation', slug: 'roof-installation' },
  { name: 'Emergency Roofing', slug: 'emergency-roofing' },
  { name: 'Roof Inspections', slug: 'roof-inspections' },
  { name: 'Insurance Claims', slug: 'insurance-claims' },
  { name: 'Storm Damage Repair', slug: 'storm-damage-repair' },
];

// Verified against brand-dna at module load, so a data refresh that drops a
// slug degrades to the index instead of routing to a 404.
const LIVE_SLUGS = new Set((brandDNA.services || []).map((s) => s.slug));

export const hrefForService = (slug) =>
  (slug && LIVE_SLUGS.has(slug) ? `/services/${slug}` : '/services');

export const PRIMARY_SERVICES = SERVICE_DEFS.map((s) => ({
  ...s,
  href: hrefForService(s.slug),
}));

export default PRIMARY_SERVICES;
