import HomePage from './pages/HomePage'
import ThankYouPage from './pages/ThankYouPage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'

// Data-router route table. Consumed by vite-react-ssg (src/main.jsx) for
// build-time prerendering and by React Router for client navigation.
//
// Rule 68: the pipeline default is the HOMEPAGE-ONLY demo. The post-sale full
// build re-adds the other pages as children here (About, Services,
// ServiceDetail, Gallery, ServiceAreas, LocationDetail, Blog, BlogPost,
// Financing, Contact). Each child gets a `<SEO>` head, and dynamic routes
// (e.g. services/:slug, service-areas/:slug, blog/:slug) get a `getStaticPaths`
// that enumerates concrete slugs from brand-dna so every URL is prerendered:
//
//   {
//     path: 'service-areas/:slug',
//     element: <LocationDetailPage />,
//     getStaticPaths: () => brandDNA.locations.map((l) => `/service-areas/${l.slug}`),
//   }
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'thank-you', element: <ThankYouPage /> },
      // Prerenders to 404.html so Vercel returns a real HTTP 404 for unknown paths.
      { path: '404', element: <NotFoundPage /> },
      // Client-side catch-all (not prerendered): stray in-app navigation lands here.
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
