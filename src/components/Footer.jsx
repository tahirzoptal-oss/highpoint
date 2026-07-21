import { Link, useNavigate, useLocation } from 'react-router-dom';
import { brandDNA } from '../config/brand-dna';
import { PRIMARY_SERVICES } from '../config/primary-services';
import { QUOTE_HASH, goToQuote } from '../lib/scrollToQuote';
import { isActivePath } from '../lib/activePath';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Client-supplied Google listing URL (same one the top bar uses).
const GOOGLE_LISTING_URL =
  'https://www.google.com/search?q=High+Point+Renovation+%26+Roofing+WA&oq=High+Point+Renovation+%26+Roofing&gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MgYIABBFGDsyCAgBEEUYJxg7MggIAhAAGBYYHjINCAMQABiGAxiABBiKBTIHCAQQABjvBTIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPdIBCDE0OThqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8';

// Company column. NOTE: /privacy-policy and /terms-conditions have no route in
// App.jsx yet — they fall through to NotFoundPage until those pages are built.
const companyLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-conditions' },
];

// Format the structured brand-dna hours into one display line. `hours.display`
// is empty for this client, so the line is derived rather than authored.
function formatHours() {
  const w = brandDNA.hours?.weekday;
  if (!w?.dayOfWeek?.length || !w.opens || !w.closes) return null;
  const days = w.dayOfWeek;
  const span = days.length > 1 ? `${days[0]} – ${days[days.length - 1]}` : days[0];
  const to12 = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  return `${span}: ${to12(w.opens)} – ${to12(w.closes)}`;
}

// ── Icons (1.6 stroke) ──
const Ic = ({ children, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const PhoneIcon = (p) => <Ic {...p}><path d="M2.5 5.2c0-1 .8-1.8 1.8-1.8h2a1.8 1.8 0 0 1 1.8 1.5l.5 2.6a1.8 1.8 0 0 1-.9 1.9l-1.3.7a13.5 13.5 0 0 0 6 6l.7-1.3a1.8 1.8 0 0 1 1.9-.9l2.6.5a1.8 1.8 0 0 1 1.5 1.8v2c0 1-.8 1.8-1.8 1.8h-.9A15.7 15.7 0 0 1 2.5 6.1v-.9Z" /></Ic>;
const MailIcon = (p) => <Ic {...p}><rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.4" /><path d="m3.4 6.6 8.6 5.8 8.6-5.8" /></Ic>;
const PinIcon = (p) => <Ic {...p}><path d="M12 21.3s7-5.6 7-11.3a7 7 0 1 0-14 0c0 5.7 7 11.3 7 11.3Z" /><circle cx="12" cy="10" r="2.6" /></Ic>;
const ClockIcon = (p) => <Ic {...p}><circle cx="12" cy="12" r="8.8" /><path d="M12 7.2V12l3.2 1.9" /></Ic>;
const ChevronIcon = (p) => <Ic {...p}><path d="m9 5 7 7-7 7" /></Ic>;

const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="#E5484D" aria-hidden="true" {...props}>
    <path d="M12 21s-7.8-4.9-9.9-9.2A5.6 5.6 0 0 1 12 5.5a5.6 5.6 0 0 1 9.9 6.3C19.8 16.1 12 21 12 21Z" />
  </svg>
);

// Per-platform SVG paths. We render an icon ONLY if brandDNA.social[key]
// has a non-empty URL, so an unset platform never produces a dead icon.
const SOCIAL_ICON_MAP = {
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  youtube: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  google: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
};

// Column heading — near-black navy at 15px so it clearly outranks the 14.5px
// medium-grey links beneath it.
const ColHeading = ({ children }) => (
  <h4 className="mb-6 text-[15px] font-bold uppercase leading-none tracking-[0.14em]" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}>
    {children}
  </h4>
);

// Link row with a chevron that nudges right on hover — the only motion here.
// The current page uses the SAME cue as the header: the darker primary-dark
// label plus semibold weight, which hover never borrows (hover only lightens to
// primary), so you can always tell where you are.
const FooterLink = ({ to, children, active }) => (
  <li>
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`group inline-flex items-center gap-2.5 text-[14.5px] leading-[1.5] transition-colors duration-300 ease-out ${
        active
          ? 'font-semibold text-[rgb(var(--primary-dark))]'
          : 'font-medium text-ink/75 hover:text-[rgb(var(--primary))]'
      }`}
      style={{ fontFamily: INTER }}
    >
      <ChevronIcon className="h-3 w-3 flex-shrink-0 text-[rgb(var(--accent))] transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
      {children}
    </Link>
  </li>
);

/**
 * Contact row — glass icon plate, then the label and value stacked beside it.
 * No card, no background, no border: the row sits directly on the footer.
 *
 * `items-center` on the row plus a fixed 44px plate means the icon's centre
 * always lands on the vertical midpoint of the label+value block, so every row
 * aligns even when the address wraps to two lines. The icon is deliberately
 * static — only the value text responds to hover, and only on linked rows.
 */
function ContactRow({ icon, label, value, href }) {
  const Icon = icon;
  const body = (
    <>
      <span
        className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px]"
        style={{
          background: 'linear-gradient(150deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 52%, rgb(var(--primary)) 100%)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 18px -8px rgb(var(--accent) / 0.55)',
          color: 'rgb(var(--on-accent))',
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-[3px] top-[3px] h-[42%] rounded-[10px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />
        <Icon className="relative h-[19px] w-[19px]" />
      </span>

      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink/50" style={{ fontFamily: INTER }}>
          {label}
        </span>
        <span
          className="mt-2 block text-[14.5px] font-semibold leading-[1.55] text-[rgb(var(--primary-dark))] transition-colors duration-300 ease-out"
          style={{ fontFamily: INTER }}
        >
          {value}
        </span>
      </span>
    </>
  );

  const shell = 'group flex items-center gap-4 text-left';

  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${shell} rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-4`}
        >
          {body}
        </a>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </li>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  // Same rule the header uses, so the two never highlight different items.
  const isActive = (to) => isActivePath(location.pathname, to);
  // Service rows are leaves — see the `exact` note on isActivePath.
  const isExact = (to) => isActivePath(location.pathname, to, { exact: true });
  const hoursLine = formatHours();

  // Facebook (and any other configured platform) plus the Google listing.
  const socials = [
    ...Object.entries(brandDNA.social || {}).filter(([k, url]) => url && SOCIAL_ICON_MAP[k]),
    ['google', GOOGLE_LISTING_URL],
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* ── Light base — the same pale wash the homepage sections use ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 42% at 8% 6%, rgba(110,143,196,0.16) 0%, transparent 62%),' +
            'radial-gradient(42% 40% at 94% 14%, rgba(44,90,166,0.1) 0%, transparent 64%),' +
            'linear-gradient(170deg, #FFFFFF 0%, #F8FAFC 55%, #EEF3FA 100%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />

      <div className="site-container relative pb-10 pt-14 lg:pt-20">
        {/* ════ Four columns ════ */}
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4 lg:gap-12">
          {/* Col 1 — brand */}
          <div className="flex flex-col items-center sm:items-start">
            <Link to="/" className="inline-block">
              <img src="/logo.webp" alt={brandDNA.company.name} className="h-auto w-40" />
            </Link>

            <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.75] text-ink/75" style={{ fontFamily: INTER }}>
              {brandDNA.company.tagline}
            </p>

            {/* Dark outline chips — navy glyph on white with a navy ring, so
                they read clearly on the light footer. Colour-only hover. */}
            <div className="mt-7 flex items-center gap-3">
              {socials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[rgb(var(--primary-dark))] transition-colors duration-300 ease-out hover:border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
                  style={{ border: '1.5px solid rgb(var(--primary-dark) / 0.55)' }}
                >
                  <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d={SOCIAL_ICON_MAP[platform]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — company */}
          <div>
            <ColHeading>Company</ColHeading>
            <ul className="m-0 flex list-none flex-col items-center gap-3 p-0 sm:items-start">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} to={link.to} active={isActive(link.to)}>{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 3 — services. Same seven, same order, same hrefs as the header
              dropdown and the homepage Services section (shared config). */}
          <div>
            <ColHeading>Services</ColHeading>
            <ul className="m-0 flex list-none flex-col items-center gap-3 p-0 sm:items-start">
              {PRIMARY_SERVICES.map((s) => (
                <FooterLink key={s.name} to={s.href} active={isExact(s.href)}>{s.name}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 4 — contact rows (no cards, no backgrounds) */}
          <div>
            <ColHeading>Contact</ColHeading>
            <ul className="m-0 flex list-none flex-col gap-6 p-0 text-left">
              <ContactRow icon={PhoneIcon} label="Call Us" value={brandDNA.contact.phone} href={`tel:${brandDNA.contact.phoneTelLink}`} />
              <ContactRow icon={MailIcon} label="Email" value={<span className="break-all">{brandDNA.contact.email}</span>} href={`mailto:${brandDNA.contact.email}`} />
              <ContactRow icon={PinIcon} label="Address" value={brandDNA.address.full} />
              {hoursLine && <ContactRow icon={ClockIcon} label="Business Hours" value={hoursLine} />}
            </ul>
          </div>
        </div>

        {/* ════ CTA strip — dark navy bar, text and button on one baseline ════ */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[20px] px-6 py-7 text-center sm:px-9 md:flex-row md:text-left lg:mt-16 lg:px-10"
          style={{
            background: 'linear-gradient(150deg, rgb(var(--primary)) 0%, rgb(var(--primary-dark)) 100%)',
            boxShadow: '0 2px 6px -1px rgba(16,40,79,0.14), 0 20px 44px -24px rgba(16,40,79,0.5)',
          }}
        >
          <p className="text-[19px] font-bold uppercase leading-[1.25] sm:text-[22px]" style={{ fontFamily: JOSEFIN, color: '#FFFFFF', letterSpacing: '0.01em' }}>
            Need Roofing Help? Call Today.
          </p>
          <a
            href={QUOTE_HASH}
            onClick={(e) => goToQuote(e, navigate)}
            className="btn-gold inline-flex flex-shrink-0 items-center gap-2.5 px-7 py-3.5 text-[12.5px] uppercase tracking-[0.07em]"
            style={{ color: 'rgb(var(--on-accent))', textShadow: '0 1px 2px rgba(0,0,0,0.18)', fontFamily: INTER }}
          >
            {brandDNA.copy.buttonText}
          </a>
        </div>
      </div>

      {/* ════ Bottom bar — slightly darker for separation ════ */}
      <div className="relative" style={{ background: '#EEF2F7', borderTop: '1px solid #d2d2d2' }}>
        <div className="site-container flex flex-col items-center justify-between gap-3 py-5 text-center md:flex-row md:text-left">
          <p className="text-[12.5px] text-ink/75" style={{ fontFamily: INTER }}>
            {brandDNA.copy.copyright}
          </p>

          <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 text-[12.5px] text-ink/75 md:justify-end" style={{ fontFamily: INTER }}>
            <span>Website Designed With</span>
            <HeartIcon className="h-3.5 w-3.5" />
            <span>By</span>
            <a
              href="https://kingcontractor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 transition-colors duration-300 ease-out hover:text-[rgb(var(--primary))]"
              style={{ color: 'rgb(var(--primary-dark))' }}
            >
              King Contractor Agency
            </a>
            <span>– Building America&rsquo;s Most Trusted Roofing Brands.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
