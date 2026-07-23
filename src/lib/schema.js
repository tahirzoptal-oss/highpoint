import { brandDNA } from '../config/brand-dna';

/**
 * LocalBusiness / RoofingContractor JSON-LD for the homepage, built from
 * brand-dna. Used by the SEO component (src/components/SEO.jsx) and baked into
 * the prerendered HTML by vite-react-ssg. Replaces the index.html injection
 * that inject-theme.mjs did for the old SPA.
 */
export function buildLocalBusiness() {
  const company = brandDNA.company || {};
  const contact = brandDNA.contact || {};
  const address = brandDNA.address || {};
  const hours = brandDNA.hours || {};
  const reviews = brandDNA.reviews || {};
  const team = brandDNA.team || {};

  const openingHours = [
    hours.weekday && {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.weekday.dayOfWeek,
      opens: hours.weekday.opens,
      closes: hours.weekday.closes,
    },
    hours.saturday && {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: hours.saturday.opens,
      closes: hours.saturday.closes,
    },
  ].filter(Boolean);

  const ld = {
    '@context': 'https://schema.org',
    '@type': company.schemaType || 'RoofingContractor',
    name: company.name,
    url: company.url,
    telephone: contact.phoneTelLink,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: openingHours,
    aggregateRating:
      reviews && (reviews.googleCount || reviews.totalReviewCount)
        ? {
            '@type': 'AggregateRating',
            ratingValue: String(reviews.rating),
            reviewCount: String(reviews.googleCount || reviews.totalReviewCount),
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    description: company.description,
    areaServed: company.serviceRegion,
    priceRange: '$$',
    founder: team.founder ? [{ '@type': 'Person', name: team.founder.name }] : undefined,
  };

  // Strip undefined fields so the rendered JSON stays clean.
  return JSON.parse(JSON.stringify(ld));
}

const baseUrl = () => String(brandDNA.company?.url || '').replace(/\/+$/, '');
const clean = (o) => JSON.parse(JSON.stringify(o));

// FAQPage from brandDNA.faq (homepage and any page with Q&A).
export function buildFAQ(faq = brandDNA.faq) {
  const items = (faq || []).filter((f) => (f.q || f.question) && (f.a || f.answer));
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q || f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.a || f.answer },
    })),
  };
}

// BreadcrumbList for any deep page. items: [{ name, path }] from home to current.
export function buildBreadcrumb(items) {
  const base = baseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: base + (it.path === '/' ? '/' : it.path),
    })),
  };
}

// Service schema for a service detail page. The `provider` is a LocalBusiness
// (RoofingContractor), so it MUST carry a PostalAddress or validators flag the
// LocalBusiness as invalid. We reuse the same verified business address the
// homepage LocalBusiness uses (see buildLocalBusiness) so the two never drift.
export function buildService(service) {
  const base = baseUrl();
  const address = brandDNA.address || {};
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name || service.title,
    serviceType: service.name || service.title,
    description: service.blurb || service.description,
    url: base + '/services/' + service.slug,
    provider: {
      '@type': brandDNA.company?.schemaType || 'RoofingContractor',
      name: brandDNA.company?.name,
      url: base,
      telephone: brandDNA.contact?.phoneTelLink,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.zip,
        addressCountry: 'US',
      },
    },
    areaServed: (brandDNA.serviceAreas || []).map((a) => (typeof a === 'string' ? a : a.name || a.city)).filter(Boolean),
  });
}

// Article schema for a blog post detail page.
export function buildArticle(post) {
  const base = baseUrl();
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: base + '/blog/' + post.slug,
    datePublished: post.date || post.publishedAt,
    image: post.image ? base + post.image : undefined,
    author: { '@type': 'Organization', name: brandDNA.company?.name },
    publisher: { '@type': 'Organization', name: brandDNA.company?.name },
  });
}
