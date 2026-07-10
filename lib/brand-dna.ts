/**
 * brand-dna.ts, per-client brand identity.
 *
 * This is the ONLY file that sets a client's visual identity (palette + fonts +
 * theme mode) and core business facts. Components must read identity from here
 * (or from site-config, which spreads these), and must use theme tokens for
 * colour (bg-accent, bg-surface-dark, text-foreground, font-heading), never
 * hardcoded hex or font-family names.
 *
 * The design DNA (which section VARIANTS render) lives separately in
 * lib/design-dna.ts. brand-dna = paint + facts; design-dna = layout choices.
 */

export interface BrandPalette {
  primary: string
  primaryDark: string
  primaryLight: string
  accent: string
  accentDark: string
  accentLight: string
  /** The accent clamped for COPY on light bands: darkened until it meets WCAG
   * AA against the lightest content surface. Feeds --color-accent-text, which
   * the text-accent utility resolves through, so gold/amber brand accents stay
   * on-brand for fills but always read as text. */
  accentText: string
  onAccent: string
  background: string
  foreground: string
  muted: string
  border: string
  card: string
  surface: string
  surfaceLight: string
  surfaceDark: string
  ink: string
}

export interface BrandFonts {
  heading: string
  body: string
  /** Google Fonts stylesheet href that loads heading + body families. */
  googleHref: string
}

export interface BrandCompany {
  name: string
  shortName: string
  phone: string
  phoneRaw: string
  email: string
  license: string
  city: string
  region: string
  state: string
  addressFull: string
}

/** Macro layout feel. Drives section rhythm, container width, and heading
 * weight/case/tracking, so two clients differ STRUCTURALLY, not just in paint.
 * Sourced from design-dna.json (layout_rhythm) at build time. */
export type LayoutRhythm = "standard" | "asymmetrical_premium" | "compact"

/** Entrance/scroll motion intensity. Sourced from design-dna.json (motion_style). */
export type MotionStyle = "none" | "subtle" | "expressive"

export interface BrandDNA {
  themeMode: "light" | "dark"
  /**
   * The single corner-radius decision for the whole site. "rounded" gives every
   * button, card, photo and input a consistent radius; "sharp" sets them all to
   * zero. One decision, applied everywhere, so the site never mixes rounded and
   * square corners. Driven from design-dna.json (corner_style) at build time.
   */
  cornerStyle: "rounded" | "sharp"
  /** Macro rhythm: section spacing, container width, heading treatment. */
  rhythm: LayoutRhythm
  /** Entrance/scroll motion intensity. */
  motion: MotionStyle
  /** Photo grade key (from design-dna.image_treatment). "" = no grade. */
  treatment: string
  /** B10 accent strategy: "chroma" = the brand hue; "value" = near-black on
   * light / near-white on dark, so photography plus the gold star are the only
   * colour. Set by the editorial-monochrome pack. */
  accentStrategy: "chroma" | "value"
  palette: BrandPalette
  fonts: BrandFonts
  company: BrandCompany
}

/**
 * The two radius scales. Both override Tailwind v4's built-in --radius-* theme
 * variables on <html>, so every rounded-* utility across the site resolves to
 * one of these and flips together. rounded-full (dots, avatars, pills) is a
 * fixed value, not a token, so circles stay circular in both modes.
 */
const RADIUS_SCALE: Record<"rounded" | "sharp", Record<string, string>> = {
  rounded: {
    "--radius": "0.5rem",
    "--radius-sm": "0.25rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-xl": "0.75rem",
    "--radius-2xl": "1rem",
    "--radius-3xl": "1.5rem",
  },
  sharp: {
    "--radius": "0px",
    "--radius-sm": "0px",
    "--radius-md": "0px",
    "--radius-lg": "0px",
    "--radius-xl": "0px",
    "--radius-2xl": "0px",
    "--radius-3xl": "0px",
  },
}

/**
 * Rhythm scales. Each emits the macro tokens that make a client feel distinct
 * beyond colour: section vertical padding (base + lg), max container width, and
 * heading weight / case / tracking. Premium = airy, lighter, sentence-case, tight
 * tracking. Compact = dense, heavy, all-caps. Standard = the proven middle.
 */
const RHYTHM_SCALE: Record<LayoutRhythm, Record<string, string>> = {
  standard: {
    "--section-py": "5rem",
    "--section-py-lg": "7.5rem",
    "--container-max": "1280px",
    "--heading-weight": "800",
    "--heading-case": "none",
    "--heading-tracking": "-0.01em",
    "--h2-size": "clamp(2.1rem, 3.6vw, 3rem)",
    "--h2-leading": "1.05",
    "--eyebrow-weight": "800",
    "--eyebrow-case": "uppercase",
    "--eyebrow-tracking": "0.3em",
    "--btn-case": "uppercase",
  },
  asymmetrical_premium: {
    "--section-py": "6rem",
    "--section-py-lg": "10rem",
    "--container-max": "1180px",
    "--heading-weight": "600",
    "--heading-case": "none",
    "--heading-tracking": "-0.02em",
    "--h2-size": "clamp(2.6rem, 4.6vw, 3.9rem)",
    "--h2-leading": "1.0",
    "--eyebrow-weight": "600",
    "--eyebrow-case": "uppercase",
    "--eyebrow-tracking": "0.24em",
    /* Premium reads quieter: no uppercase transform on button labels, so the
     * ONE-casing rule is enforced by the build gate on the rendered text
     * (labels are authored Title Case sitewide). */
    "--btn-case": "none",
  },
  compact: {
    "--section-py": "3.25rem",
    "--section-py-lg": "5rem",
    "--container-max": "1360px",
    "--heading-weight": "900",
    "--heading-case": "uppercase",
    "--heading-tracking": "0.02em",
    "--h2-size": "clamp(1.9rem, 3vw, 2.6rem)",
    "--h2-leading": "1.05",
    "--eyebrow-weight": "900",
    "--eyebrow-case": "uppercase",
    "--eyebrow-tracking": "0.32em",
    "--btn-case": "uppercase",
  },
}

export const brandDNA: BrandDNA = {
  "themeMode": "light",
  "cornerStyle": "rounded",
  "rhythm": "standard",
  "motion": "subtle",
  "treatment": "clean-natural",
  "accentStrategy": "chroma",
  "palette": {
    "primary": "#20447a",
    "primaryDark": "#163055",
    "primaryLight": "#4d6995",
    "accent": "#2b6ca3",
    "accentDark": "#1d496f",
    "accentLight": "#5a8cb7",
    "onAccent": "#ffffff",
    "accentText": "#29679b",
    "background": "#ffffff",
    "foreground": "#374559",
    "muted": "#536379",
    "border": "#e2e8f0",
    "card": "#ffffff",
    "surface": "#dfe5ef",
    "surfaceLight": "#dfe5ef",
    "surfaceDark": "#20447a",
    "ink": "#132949"
  },
  "fonts": {
    "heading": "\"Oswald\", system-ui, sans-serif",
    "body": "\"Inter\", system-ui, sans-serif",
    "googleHref": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap"
  },
  "company": {
    "name": "High Point Renovation & Roofing",
    "shortName": "High Point Renovation",
    "phone": "(509) 518-0747",
    "phoneRaw": "15095180747",
    "email": "highpointrenovation@outlook.com",
    "license": "Licensed & Insured",
    "city": "Kennewick",
    "region": "Pacific Northwest",
    "state": "WA",
    "addressFull": "Kennewick, WA"
  }
}

/**
 * Build the inline CSS custom-property map applied to <html>. Inline custom
 * properties on the root element beat any :root rule from a stylesheet, so a
 * per-client palette always wins without a build step.
 */
export function buildThemeVars(b: BrandDNA = brandDNA): Record<string, string> {
  const p = b.palette
  return {
    ...RADIUS_SCALE[b.cornerStyle ?? "rounded"],
    ...RHYTHM_SCALE[b.rhythm ?? "standard"],
    "--color-primary": p.primary,
    "--color-primary-dark": p.primaryDark,
    "--color-primary-light": p.primaryLight,
    "--color-accent": p.accent,
    "--color-accent-dark": p.accentDark,
    "--color-accent-light": p.accentLight,
    "--color-accent-text": p.accentText,
    "--color-on-accent": p.onAccent,
    "--color-background": p.background,
    "--color-foreground": p.foreground,
    "--color-muted": p.muted,
    "--color-border": p.border,
    "--color-card": p.card,
    "--color-surface": p.surface,
    "--color-surface-light": p.surfaceLight,
    "--color-surface-dark": p.surfaceDark,
    "--color-ink": p.ink,
    "--brand-font-heading": b.fonts.heading,
    "--brand-font-body": b.fonts.body,
  }
}
