import { brandDNA } from '../config/brand-dna'
import AvailableDot from './AvailableDot'

// Architectural top bar (part 1 of the overlapping-logo header).
// Two navy clip-path wings (.topbar-geo ::before / ::after in index.css) angle
// toward the centre and stop short of it, leaving a white cradle that the
// centered logo — rendered in Navbar — straddles. Inter is the only font here;
// `theme-keep-dark` keeps the white/blue content legible on the navy wings.
const INTER = "'Inter', system-ui, -apple-system, sans-serif";

const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

// Monochrome Google "G" (single currentColor fill) so it matches the other
// social icons and stays inside the blue/white palette.
const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);


// Client-supplied Google listing URL for the top-bar social chip.
const GOOGLE_LISTING_URL =
  'https://www.google.com/search?q=High+Point+Renovation+%26+Roofing+WA&oq=High+Point+Renovation+%26+Roofing&gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MgYIABBFGDsyCAgBEEUYJxg7MggIAhAAGBYYHjINCAMQABiGAxiABBiKBTIHCAQQABjvBTIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPdIBCDE0OThqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8';

export default function TopBar() {
  const { contact, social, company, address } = brandDNA;

  // "Find us on Google" — the client's supplied Google listing URL. Falls back
  // to contact.googleMapsUrl, then a Maps search built from real business data
  // (no fabricated profile) if the constant is ever cleared.
  const googleUrl =
    GOOGLE_LISTING_URL ||
    contact.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.name} ${address.full}`)}`;

  // Shared social-chip styling so every icon matches in size, spacing + hover.
  const socialChip =
    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-white/85 transition-all duration-200 hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent-light))]';

  return (
    <div className="topbar-geo theme-keep-dark relative hidden text-white lg:block" style={{ fontFamily: INTER }}>
      {/* Content sits above the navy wings (z-10); the centre gap stays clear for the logo. */}
      <div className="site-container relative z-10 flex h-[46px] items-center justify-between text-[13px]">
        {/* Left wing — phone · availability (green) */}
        <div className="flex items-center gap-4">
          <a
            href={`tel:${contact.phoneTelLink}`}
            className="group inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <PhoneIcon className="h-4 w-4" style={{ color: 'rgb(var(--accent-light))' }} />
            <span className="font-tabular tracking-wide">{contact.phone}</span>
          </a>

          <span aria-hidden className="hidden h-4 w-px bg-white/15 xl:block" />
          <span className="hidden xl:inline-flex">
            <AvailableDot size="sm" label={true} />
          </span>
        </div>

        {/* Right wing — email · social */}
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <MailIcon className="h-4 w-4" style={{ color: 'rgb(var(--accent-light))' }} />
            <span>{contact.email}</span>
          </a>

          <span aria-hidden className="h-4 w-px bg-white/15" />
          <div className="inline-flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Follow
            </span>
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialChip}
                style={{ backgroundColor: 'rgb(255 255 255 / 0.05)' }}
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google"
              className={socialChip}
              style={{ backgroundColor: 'rgb(255 255 255 / 0.05)' }}
            >
              <GoogleIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
