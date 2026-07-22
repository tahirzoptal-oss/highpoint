import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import { PRIMARY_SERVICES } from '../config/primary-services';
import AvailableDot from './AvailableDot';
import { goToQuote } from '../lib/scrollToQuote';
import { isActivePath } from '../lib/activePath';

// Inter is the ONLY font on the header (per redesign brief). Applied at the
// nav root so every descendant inherits it — no font-heading/font-body classes
// (those map to Oswald/Montserrat) are used inside the header.
const INTER = "'Inter', system-ui, -apple-system, sans-serif";

// Services come from the shared config (all seven, in order) so the header
// dropdown, the homepage Services section and the footer always match. Each
// entry already carries a resolved `href`, so the dropdown uses `href` rather
// than composing `base + slug`.
const serviceItems = PRIMARY_SERVICES.map((s) => ({ label: s.name, href: s.href }));
const areaItems = (brandDNA.location_pages || []).map((p) => ({ label: p.city, href: `/service-areas/${p.slug}` }));

// Two nav dropdowns, driven by one shared map (mirrors V1's Services +
// Service Areas dropdowns). A navLink flagged with `dropdown: '<key>'` renders
// the matching mega-menu below.
const dropdowns = {
  services: { items: serviceItems, allLabel: 'All Services', base: '/services' },
  areas: { items: areaItems, allLabel: 'All Service Areas', base: '/service-areas' },
};

// Existing menu structure — unchanged. Split around the centered logo:
// five links to the left, three to the right, then the CTA at the far right.
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

const leftLinks = navLinks.slice(0, 5);
const rightLinks = navLinks.slice(5);

// Rule 62 + Rule 65: nav CTA renders --on-accent text on the accent gradient.
const navCtaTextStyle = {
  color: 'rgb(var(--on-accent))',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
  fontFamily: INTER,
};

function ChevronIcon({ open }) {
  return (
    <svg
      className={`ml-0.5 h-3 w-3 text-steel transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Small solid triangle — echoes brandDNA.shape_motif = "triangle".
function TriangleMark(props) {
  return (
    <svg viewBox="0 0 10 10" fill="currentColor" {...props}>
      <path d="M5 1.5l3.5 6.5h-7z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Scrolls to the CTA banner, or routes home to it when the current page has
  // no banner (/404, /thank-you).
  const scrollToForm = () => goToQuote(null, navigate);

  // Shared with the footer, so header and footer always agree on which item is
  // current. Matches the item and everything beneath it, which is what lights a
  // dropdown parent on a child page.
  const isActive = (to) => isActivePath(location.pathname, to);
  // Dropdown rows are leaves: exact only, so a row whose href falls back to the
  // section index does not light up on every page beneath it.
  const isExact = (to) => isActivePath(location.pathname, to, { exact: true });

  // ── Desktop link hover/active language (blue-only, premium — no underline) ──
  // A soft rounded pill fades in as an absolute overlay (so it never widens the
  // item) and the label shifts charcoal → deep blue.
  //
  // Active and hover must NOT look the same, or you cannot tell which page you
  // are on while the pointer is over the bar. They are separated on two axes:
  // the active pill is denser (0.22 vs 0.12) and permanent, and the active
  // label is the darker primary-dark rather than primary. Hovering a non-active
  // item fades the light pill in. ONE background span, either way.
  const linkBase =
    'group relative inline-flex items-center gap-1.5 py-1 text-[13px] font-semibold uppercase tracking-[0.04em] transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

  const linkTone = (active, open) => {
    if (active) return 'text-[rgb(var(--primary-dark))]';
    if (open) return 'text-[rgb(var(--primary))]';
    return 'text-ink hover:text-[rgb(var(--primary))]';
  };

  const Pill = ({ active, open }) => (
    <span
      aria-hidden
      className={`pointer-events-none absolute -inset-x-3.5 -inset-y-2 rounded-lg transition-opacity duration-300 ${
        active
          ? 'bg-[rgb(var(--accent)/0.22)] opacity-100'
          : `bg-[rgb(var(--accent)/0.12)] ${open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
      }`}
    />
  );

  const DesktopLink = ({ link }) => {
    const active = isActive(link.to);

    if (link.dropdown) {
      const dd = dropdowns[link.dropdown];
      const open = openDropdown === link.dropdown;
      return (
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(open ? null : link.dropdown)}
            aria-current={active ? 'page' : undefined}
            aria-expanded={open}
            className={`${linkBase} ${linkTone(active, open)}`}
          >
            <Pill active={active} open={open} />
            <span className="relative flex items-center gap-1.5">
              {link.label}
              <ChevronIcon open={open} />
            </span>
          </button>

          {open && (
            <div
              className="absolute left-1/2 top-full z-50 mt-3 w-60 -translate-x-1/2 overflow-hidden rounded-xl border border-black/5 bg-white py-2 shadow-[0_24px_48px_-12px_rgba(16,40,79,0.28)]"
              style={{ fontFamily: INTER }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))' }}
              />
              <Link
                to={dd.base}
                className="mb-1 flex items-center gap-1.5 border-b border-black/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gold transition-colors hover:bg-[rgb(var(--accent)/0.06)]"
              >
                {dd.allLabel} &rarr;
              </Link>
              {dd.items.map((s) => {
                const on = isExact(s.href);
                return (
                  <Link
                    key={s.label}
                    to={s.href}
                    aria-current={on ? 'page' : undefined}
                    className={`flex items-center gap-2 px-4 py-2 text-[13px] transition-colors hover:bg-[rgb(var(--accent)/0.06)] hover:text-gold ${
                      on ? 'bg-[rgb(var(--accent)/0.1)] font-semibold text-[rgb(var(--primary-dark))]' : 'font-medium text-ink'
                    }`}
                  >
                    <TriangleMark className="h-2 w-2 shrink-0 text-gold/70" />
                    {s.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link to={link.to} aria-current={active ? 'page' : undefined} className={`${linkBase} ${linkTone(active, false)}`}>
        <Pill active={active} open={false} />
        <span className="relative">{link.label}</span>
      </Link>
    );
  };

  return (
    <nav className="relative z-50 bg-white shadow-[0_10px_30px_-18px_rgba(16,40,79,0.5)]" style={{ fontFamily: INTER }}>
      {/* Blue accent hairline on top for mobile (on desktop the TopBar carries it) */}
      <div
        aria-hidden
        className="h-[3px] lg:hidden"
        style={{ background: 'linear-gradient(90deg, rgb(var(--accent-dark)), rgb(var(--accent)) 50%, rgb(var(--accent-dark)))' }}
      />
      {/* Thin blue accent line at the base of the nav */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.35) 18%, rgb(var(--accent) / 0.35) 82%, transparent)' }}
      />

      <div className="site-container">
        <div className="relative flex h-20 items-center lg:h-[88px]">
          {/* ── Overlapping centered logo — straddles the top bar (up) and the nav
                 (down) on lg+, sitting in the top bar's white centre cradle. On
                 mobile (no top bar) it simply centres in the nav row. ── */}
          <Link
            to="/"
            aria-label={brandDNA.company.name}
            className="header-logo absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 lg:top-[-24px] lg:translate-y-0"
          >
            <img
              src="/logo.webp"
              alt={brandDNA.company.name}
              className="h-14 w-auto lg:h-[100px]"
            />
          </Link>

          {/* ── Left cluster (desktop) — starts at the container's left edge ── */}
          <div className="hidden flex-1 items-center justify-start gap-8 min-[1360px]:flex" ref={navRef}>
            {leftLinks.map((link) => (
              <DesktopLink key={link.label} link={link} />
            ))}
          </div>

          {/* ── Reserved centre column — dedicated space for the logo so no menu
                 item can ever sit under it. Width ≥ logo width + breathing room. ── */}
          <div aria-hidden className="hidden w-[210px] shrink-0 min-[1360px]:block" />

          {/* ── Right cluster + CTA (desktop) — ends at the container's right edge ── */}
          <div className="hidden flex-1 items-center justify-end gap-8 min-[1360px]:flex">
            {rightLinks.map((link) => (
              <DesktopLink key={link.label} link={link} />
            ))}
            <button
              onClick={scrollToForm}
              className="btn-gold ml-2 whitespace-nowrap px-5 py-3 text-[12px] uppercase tracking-[0.07em]"
              style={navCtaTextStyle}
            >
              {brandDNA.copy.buttonText}
            </button>
          </div>

          {/* ── Mobile / tablet: call button (left) + menu toggle (right), logo
                 centred between them. The two are deliberately the SAME control
                 geometry — 44×44, 12px radius, 20px glyph, centred — so the bar
                 reads as a matched pair. Only the fill differs (the call button
                 is the accent gradient, the toggle is an outline), which is the
                 existing design language. The call button carries no label, as
                 a text label would make it wider than its twin. ── */}
          <a
            href={`tel:${brandDNA.contact.phoneTelLink}`}
            className="mr-auto inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl min-[1360px]:hidden"
            aria-label={`Call ${brandDNA.contact.phone}`}
            style={{
              background: 'linear-gradient(160deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 45%, rgb(var(--accent-dark)) 100%)',
              color: 'rgb(var(--on-accent))',
              border: '1px solid rgba(255,255,255,0.45)',
              boxShadow: '0 8px 18px -10px rgb(var(--accent) / 0.6)',
            }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>

          <button
            className="ml-auto inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-black/10 text-ink transition-colors hover:border-[rgb(var(--accent))] hover:text-gold min-[1360px]:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-5 pb-5 pt-3 min-[1360px]:hidden" style={{ fontFamily: INTER }}>
          
          {navLinks.map((link) => {
            if (link.dropdown) {
              const dd = dropdowns[link.dropdown];
              const open = mobileOpenDropdown === link.dropdown;
              return (
                <div key={link.label} className="border-b border-black/5">
                  <button
                    onClick={() => setMobileOpenDropdown(open ? null : link.dropdown)}
                    aria-current={isActive(link.to) ? 'page' : undefined}
                    aria-expanded={open}
                    className={`flex w-full items-center justify-between py-3 text-[14px] font-semibold uppercase tracking-[0.04em] transition-colors ${
                      isActive(link.to)
                        ? 'text-[rgb(var(--primary-dark))]'
                        : open ? 'text-gold' : 'text-ink hover:text-gold'
                    }`}
                  >
                    {link.label}
                    <ChevronIcon open={open} />
                  </button>
                  {open && (
                    <div className="flex flex-col gap-0.5 pb-3 pl-3">
                      <Link
                        to={dd.base}
                        className="py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-gold"
                      >
                        {dd.allLabel} &rarr;
                      </Link>
                      {dd.items.map((s) => {
                        const on = isExact(s.href);
                        return (
                          <Link
                            key={s.label}
                            to={s.href}
                            aria-current={on ? 'page' : undefined}
                            className={`flex items-center gap-2 py-1.5 text-[13px] transition-colors hover:text-gold ${
                              on ? 'font-semibold text-[rgb(var(--primary-dark))]' : 'font-medium text-ink/75'
                            }`}
                          >
                            <TriangleMark className="h-2 w-2 shrink-0 text-gold/70" />
                            {s.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={`block border-b border-black/5 py-3 text-[14px] font-semibold uppercase tracking-[0.04em] transition-colors ${
                  isActive(link.to) ? 'text-[rgb(var(--primary-dark))]' : 'text-ink hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

        </div>
      )}
    </nav>
  );
}
