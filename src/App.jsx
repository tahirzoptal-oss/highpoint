import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import GalleryPage from './pages/GalleryPage'
import ServiceAreasPage from './pages/ServiceAreasPage'
import LocationDetailPage from './pages/LocationDetailPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import FinancingPage from './pages/FinancingPage'
import ContactPage from './pages/ContactPage'
import ThankYouPage from './pages/ThankYouPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'
import { brandDNA } from './config/brand-dna'
import { publishedPosts } from './lib/publishing'

// Slugify a service-area city string ("WEST RICHLAND" -> "west-richland") so the
// dynamic /service-areas/:slug getStaticPaths matches LocationDetailPage's own
// slug resolution.
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Data-router route table. Consumed by vite-react-ssg (src/main.jsx) for
// build-time prerendering and by React Router for client navigation.
//
// Rule 68 "post-sale full build": the homepage-only demo is expanded to the full
// multi-page site. Every child ships its own <SEO> head inside the page
// component. Dynamic routes enumerate concrete slugs from brand-dna via
// getStaticPaths so vite-react-ssg prerenders every URL to static HTML.
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      {
        path: 'services/:slug',
        element: <ServiceDetailPage />,
        getStaticPaths: () => brandDNA.services.map((s) => `/services/${s.slug}`),
      },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'service-areas', element: <ServiceAreasPage /> },
      {
        path: 'service-areas/:slug',
        element: <LocationDetailPage />,
        getStaticPaths: () => (brandDNA.serviceAreas || []).map((a) => `/service-areas/${slugify(a)}`),
      },
      { path: 'financing', element: <FinancingPage /> },
      { path: 'blog', element: <BlogPage /> },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />,
        // Published posts only: a scheduled post gets no prerendered page, so
        // it cannot leak into dist/ or into sitemap-blog.xml before its date.
        // It prerenders on the first build at or after its publishedAt.
        getStaticPaths: () => publishedPosts(brandDNA.blog_posts).map((p) => `/blog/${p.slug}`),
      },
      { path: 'contact', element: <ContactPage /> },
      { path: 'thank-you', element: <ThankYouPage /> },
      // Footer legal pages. The footer has always linked these; they now have
      // routes and prerender like every other static page.
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-conditions', element: <TermsConditionsPage /> },
      // Prerenders to 404.html so Vercel returns a real HTTP 404 for unknown paths.
      { path: '404', element: <NotFoundPage /> },
      // Client-side catch-all (not prerendered): stray in-app navigation lands here.
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
