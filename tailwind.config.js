/** @type {import('tailwindcss').Config} */
//
// Palette mapped to CSS variables so per-client Stage 10.1 + scripts/inject-theme.mjs
// can rewrite the :root block without touching tailwind.config.js. Variables live
// in src/index.css and use the rgb-triplet (no `rgb()` wrapper) format Tailwind
// expects with `<alpha-value>`.
//
// Wave 1 (2026-05-16 research bake): added modular 1.25 type scale + 8pt spacing
// scale + tracking + line-height + layered shadow tokens per Vercel design
// guidelines and our 2026-05-16 research synthesis.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Type scale · 1.25 modular (body) bumping to 1.333 at display sizes.
    // Each entry is [size, { lineHeight, letterSpacing }]. Display sizes (3xl+) get
    // tight line-height + negative tracking (Stripe / Vercel premium pattern).
    fontSize: {
      'xs':   ['0.75rem',   { lineHeight: '1.6' }],                                  // 12px
      'sm':   ['0.875rem',  { lineHeight: '1.6' }],                                  // 14px
      'base': ['1rem',      { lineHeight: '1.6' }],                                  // 16px - body default
      'lg':   ['1.125rem',  { lineHeight: '1.55' }],                                 // 18px
      'xl':   ['1.375rem',  { lineHeight: '1.4' }],                                  // 22px
      '2xl':  ['1.75rem',   { lineHeight: '1.3' }],                                  // 28px
      '3xl':  ['2.25rem',   { lineHeight: '1.2', letterSpacing: '-0.02em' }],        // 36px
      '4xl':  ['3rem',      { lineHeight: '1.1', letterSpacing: '-0.025em' }],       // 48px
      '5xl':  ['3.75rem',   { lineHeight: '1.05', letterSpacing: '-0.025em' }],      // 60px
      '6xl':  ['4.75rem',   { lineHeight: '1.05', letterSpacing: '-0.03em' }],       // 76px
      '7xl':  ['6rem',      { lineHeight: '1.0',  letterSpacing: '-0.03em' }],       // 96px
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
          slate: 'rgb(var(--primary-slate) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        steel: 'rgb(var(--neutral-dim) / <alpha-value>)',
        cool: 'rgb(var(--neutral) / <alpha-value>)',
        silver: 'rgb(var(--silver) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        // Backwards-compat single-tone aliases (used by some inline classes)
        accent: 'rgb(var(--accent) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
      },
      fontFamily: {
        // The actual font family string is rewritten by inject-theme.mjs (it
        // edits the @import url(...) at the top of src/index.css) so the
        // first family name in each stack here just needs to match
        // brandDNA.typography.heading / .body.
        heading: ['Josefin Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      // Wave 1: named line-height tokens for explicit application by class
      lineHeight: {
        'display': '1.05',          // multi-line H1/H2
        'tight-display': '1.1',     // tight H3
        'body': '1.6',              // body paragraph default
        'snug-body': '1.55',        // slightly tighter sub-paragraph
      },
      // Wave 1: tracking tokens (Stripe / Vercel premium pattern)
      letterSpacing: {
        'display': '-0.025em',      // 40px+ headlines
        'display-tight': '-0.03em', // 60px+ headlines
        'eyebrow': '0.12em',        // uppercase section eyebrows
      },
      // Wave 1: 8pt spacing scale named tokens
      spacing: {
        'section-gap': '6rem',      // 96px - between sections (desktop)
        'section-gap-lg': '8rem',   // 128px - between major sections
        'card-pad': '2rem',         // 32px - inside cards
        'card-gap': '1.5rem',       // 24px - between cards in a grid
        'inline-gap': '0.75rem',    // 12px - between adjacent inline elements
      },
      // Wave 1: max-width tokens
      maxWidth: {
        '7xl': '90rem',             // 1440px — site-wide container cap (override Tailwind's 80rem default)
        'prose-tight': '65ch',      // body-text columns (premium read)
        'prose-wide': '75ch',       // looser body columns
      },
      // Wave 2 prep: layered shadows (ambient + direct) per Vercel design guidelines
      boxShadow: {
        'card':     '0 1px 2px rgba(0,0,0,0.06), 0 12px 24px rgba(0,0,0,0.06)',
        'card-lg':  '0 1px 2px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)',
        'floating': '0 4px 8px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.16)',
      },
      // Wave 2 prep: easing tokens for consistent motion across template
      transitionTimingFunction: {
        'premium-out': 'cubic-bezier(0.16, 1, 0.3, 1)',  // easeOutExpo · snappy enter
        'premium-in':  'cubic-bezier(0.7, 0, 0.84, 0)',  // easeInExpo · controlled exit
      },
    },
  },
  plugins: [],
}
