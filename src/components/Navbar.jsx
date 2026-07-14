import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import AvailableDot from './AvailableDot';

const serviceItems = brandDNA.services.map((s) => ({ label: s.name, slug: s.slug }));
const areaItems = (brandDNA.location_pages || []).map((p) => ({ label: p.city, slug: p.slug }));

// Two nav dropdowns, driven by one shared map (mirrors V1's Services +
// Service Areas dropdowns). A navLink flagged with `dropdown: '<key>'` renders
// the matching mega-menu below.
const dropdowns = {
  services: { items: serviceItems, allLabel: 'All Services', base: '/services' },
  areas: { items: areaItems, allLabel: 'All Service Areas', base: '/service-areas' },
};

// Rule 68 "post-sale full build": per-page routes are live. About sits beside
// Home (Juan's call). Services and Service Areas stay adjacent, each a dropdown.
// Financing + Blog are real V2 pages added to the nav.
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', dropdown: 'services' },
  { label: 'Service Areas', to: '/service-areas', dropdown: 'areas' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Financing', to: '/financing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

// Rule 62 + Rule 65: nav CTA buttons render --on-accent text on the accent
// gradient. inject-theme.mjs auto-picks --on-accent (white for blue/navy/red
// brands, dark navy for yellow/cream brands) so the letters stay readable
// across the full palette.
const navCtaTextStyle = {
  color: 'rgb(var(--on-accent))',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('quote') || document.getElementById('cta-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const navDark = brandDNA.nav_treatment === 'dark';
  const themeKeep = navDark ? ' theme-keep-dark' : '';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-lg bg-navy${themeKeep}`}>
      {/* Thin gold accent line at very top */}
      <div className="line-gold w-full" />

      <div className="max-w-7xl mx-auto px-4 flex items-center h-24 md:h-28 gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 relative" style={{ zIndex: 20 }}>
          <img
            src={navDark ? '/logo-white.webp' : '/logo.webp'}
            alt={brandDNA.company.name}
            className="h-20 md:h-24 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 ml-auto" ref={navRef}>
          {navLinks.map((link) => {
            if (link.dropdown) {
              const dd = dropdowns[link.dropdown];
              const isOpen = openDropdown === link.dropdown;
              return (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : link.dropdown)}
                    className={`font-body font-semibold text-sm flex items-center gap-0.5 whitespace-nowrap transition-colors pb-1 ${
                      isActive(link.to)
                        ? 'text-white border-b-2 border-gold'
                        : 'text-cool hover:text-white border-b-2 border-transparent'
                    }`}
                  >
                    {link.label}
                    <svg className={`w-3 h-3 ml-0.5 text-steel transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className={`absolute top-full left-0 mt-2 w-56 shadow-2xl border border-steel/30 py-2 z-50 bg-navy-slate${themeKeep}`}>
                      <Link
                        to={dd.base}
                        className="block px-4 py-2 text-xs font-body font-bold text-gold uppercase tracking-wider hover:bg-navy transition-colors border-b border-steel/20 mb-1"
                      >
                        {dd.allLabel} &rarr;
                      </Link>
                      {dd.items.map((s) => (
                        <Link
                          key={s.slug}
                          to={`${dd.base}/${s.slug}`}
                          className="block px-4 py-1.5 text-xs font-body font-semibold text-cool hover:text-white hover:bg-navy transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`font-body font-semibold text-sm whitespace-nowrap transition-colors pb-1 ${
                  isActive(link.to)
                    ? 'text-white border-b-2 border-gold'
                    : 'text-cool hover:text-white border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Phone with available-now indicator */}
          <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="flex items-center gap-2 ml-1">
            <span className="hidden xl:inline-flex">
              <AvailableDot size="sm" label={true} />
            </span>
            <span className="inline-flex xl:hidden">
              <AvailableDot size="sm" label={false} />
            </span>
            <span className="font-body font-semibold text-sm text-cool whitespace-nowrap">{brandDNA.contact.phone}</span>
          </a>

          <button
            onClick={scrollToForm}
            className="btn-gold font-heading font-bold text-xs uppercase px-5 py-2.5 tracking-wider ml-1 whitespace-nowrap"
            style={navCtaTextStyle}
          >
            {brandDNA.copy.buttonText}
          </button>
        </div>

        {/* Mobile: CTA between logo and hamburger */}
        <div className="lg:hidden ml-auto mr-2 flex items-center gap-2">
          <a
            href={`tel:${brandDNA.contact.phoneTelLink}`}
            className="hidden sm:inline-flex"
            aria-label="Call now"
          >
            <AvailableDot size="sm" label={true} />
          </a>
          <a
            href={`tel:${brandDNA.contact.phoneTelLink}`}
            className="sm:hidden inline-flex"
            aria-label="Call now"
          >
            <AvailableDot size="sm" label={false} />
          </a>
          <a
            href={`tel:${brandDNA.contact.phoneTelLink}`}
            className="flex items-center gap-1.5 font-heading font-bold text-xs uppercase px-3 py-1.5 tracking-wider"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)',
              ...navCtaTextStyle,
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`lg:hidden border-t border-steel/20 px-4 py-3 flex flex-col gap-0.5 bg-navy${themeKeep}`}>
          <div className="py-2 border-b border-steel/20">
            <AvailableDot size="sm" label={true} />
          </div>
          {navLinks.map((link) => {
            if (link.dropdown) {
              const dd = dropdowns[link.dropdown];
              const isOpen = mobileOpenDropdown === link.dropdown;
              return (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileOpenDropdown(isOpen ? null : link.dropdown)}
                    className="w-full text-left font-body font-semibold text-sm py-2.5 border-b border-steel/20 flex items-center justify-between text-cool hover:text-white"
                  >
                    {link.label}
                    <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="pl-3 py-1 flex flex-col gap-0.5">
                      <Link
                        to={dd.base}
                        className="text-xs font-body font-bold py-1.5 text-gold uppercase tracking-wider"
                      >
                        {dd.allLabel} &rarr;
                      </Link>
                      {dd.items.map((s) => (
                        <Link
                          key={s.slug}
                          to={`${dd.base}/${s.slug}`}
                          className="text-xs font-body font-semibold py-1.5 text-steel hover:text-white"
                        >
                          &middot; {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.to}
                className="font-body font-semibold text-sm py-2.5 border-b border-steel/20 last:border-b-0 text-cool hover:text-white"
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => { scrollToForm(); setMobileOpen(false); }}
            className="mt-2 btn-gold font-heading font-bold text-sm uppercase px-4 py-2.5 tracking-wider text-center w-full"
            style={navCtaTextStyle}
          >
            {brandDNA.copy.buttonText}
          </button>
        </div>
      )}
    </nav>
  );
}
