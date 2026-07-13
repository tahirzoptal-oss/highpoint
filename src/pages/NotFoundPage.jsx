import { Link } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import SEO from '../components/SEO';

/**
 * Branded 404. Prerenders to 404.html (route path "404" in App.jsx) so Vercel
 * serves a real HTTP 404 for unknown paths, and also handles the client-side
 * catch-all route for stray in-app navigation.
 */
export default function NotFoundPage() {
  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-navy">
      <SEO path="/404" title={`Page Not Found | ${brandDNA.company.name}`} noindex />
      <div className="relative max-w-xl mx-auto" style={{ zIndex: 5 }}>
        <p className="text-gold font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">ERROR 404</p>
        <h1 className="font-heading font-bold text-white uppercase leading-none text-5xl mb-4">
          PAGE NOT FOUND
        </h1>
        <span className="line-gold block w-12 mx-auto my-4" />
        <p className="text-cool text-base leading-relaxed mb-8">
          That page moved or never existed. Let us get you back on track.
        </p>
        <Link
          to="/"
          className="btn-gold inline-block font-heading font-bold text-sm uppercase px-8 py-3 tracking-widest text-navy"
        >
          BACK TO HOME
        </Link>
      </div>
    </section>
  );
}
