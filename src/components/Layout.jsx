import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileCtaBar from './MobileCtaBar';

/**
 * ScrollManager — on route change scroll to the hash anchor when present, else
 * jump to top. All browser calls live inside the effect, so it is SSR-safe for
 * prerendering. Lesson 09-build Rule 50.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const id = hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [pathname, hash]);
  return null;
}

/**
 * Layout route element. Renders the shared chrome and an <Outlet/> for the
 * matched child route. The key=pathname wrapper remounts on navigation for the
 * 200ms route fade (.route-mount in index.css).
 */
export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="w-full pb-16 lg:pb-0">
      <ScrollManager />
      <header className="sticky top-0 z-50">
        <TopBar />
        <Navbar />
      </header>
      <main>
        <div key={pathname} className="route-mount">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileCtaBar />
    </div>
  );
}
