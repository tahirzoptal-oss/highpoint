import dynamicIconImports from "lucide-react/dynamicIconImports"

/**
 * Semantic icon resolution: the bespoke duotone tier (2B E1) + the Lucide
 * fallback tier.
 *
 * Two tiers live here:
 *
 * 1. BESPOKE, the 24 factory-owned duotone glyphs
 *    (components/icons/Icon<Name>.tsx, rendered by components/Icon.tsx).
 *    Camp A packs (owner-authority, commercial-authority, family-owned,
 *    industrial-contractor, storm-response) route every semantic icon here
 *    first via toBespokeIcon(). The pack-tier decision lives in IconChip,
 *    not in this map: luxury-premium keeps thin-line Lucide glyphs in
 *    1px-bordered chips and modern-corporate stays icon-free by pack
 *    routing.
 *
 * 2. LUCIDE, the fallback. resolveServiceIcon() keeps returning valid
 *    Lucide names so every pack (including the non-bespoke tiers) renders
 *    something real. Long-term, bare Lucide survives ONLY as the
 *    micro-utility tier (MICRO_UTILITY_ICONS: chevrons, arrows, check,
 *    phone, star, pin); the taste-gate consumes that list for its advisory
 *    lint (E2).
 *
 * The service NAME decides the icon first (keyword match, priority order),
 * so a mismatched icon in the research data (the hammer-for-reviews class of
 * bug) can never surface. The data-provided icon is only a fallback, and it
 * is validated against the installed Lucide set (with legacy-name aliases)
 * before use. Unknown everything resolves to a safe roofing default.
 */

/* ---------------------------------------------------------------------------
 * Bespoke duotone tier (E1)
 * ------------------------------------------------------------------------- */

/** The 24 bespoke glyphs. Kebab name -> components/icons/Icon<PascalCase>.tsx. */
export const BESPOKE_ICONS = [
  "roof-pitched",
  "roof-flat",
  "shingle-stack",
  "hammer-nail",
  "ladder",
  "house-check",
  "storm-cloud-hail",
  "lightning-bolt",
  "rain-gutter",
  "chimney",
  "skylight",
  "insulation-roll",
  "truck-crew",
  "hard-hat",
  "clipboard-estimate",
  "magnifier-inspection",
  "shield-warranty",
  "medal-certified",
  "handshake",
  "phone-callback",
  "calendar-booking",
  "dollar-financing",
  "map-pin-service",
  "star-review",
] as const

export type BespokeIconName = (typeof BESPOKE_ICONS)[number]

const BESPOKE_SET: ReadonlySet<string> = new Set(BESPOKE_ICONS)

/**
 * Lucide and legacy semantic names -> bespoke glyphs. This is how existing
 * call sites (and resolveServiceIcon output) land on the duotone set without
 * changing a single consumer: IconChip asks toBespokeIcon() on Camp A packs
 * and falls back to the Lucide name everywhere else.
 */
const BESPOKE_ALIASES: Record<string, BespokeIconName> = {
  /* trust + credentials */
  shield: "shield-warranty",
  "shield-check": "shield-warranty",
  "badge-check": "medal-certified",
  award: "medal-certified",
  medal: "medal-certified",
  ribbon: "medal-certified",
  "circle-check": "house-check",
  "circle-check-big": "house-check",
  "check-circle": "house-check",
  "check-circle-2": "house-check",
  /* reviews */
  star: "star-review",
  /* structures + trades */
  house: "roof-pitched",
  home: "roof-pitched",
  building: "roof-flat",
  "building-2": "roof-flat",
  warehouse: "roof-flat",
  factory: "roof-flat",
  layers: "shingle-stack",
  hammer: "hammer-nail",
  wrench: "hammer-nail",
  drill: "hammer-nail",
  "panel-top": "hammer-nail",
  droplets: "rain-gutter",
  "cloud-rain": "rain-gutter",
  /* weather + urgency */
  "cloud-lightning": "storm-cloud-hail",
  "cloud-hail": "storm-cloud-hail",
  tornado: "storm-cloud-hail",
  zap: "lightning-bolt",
  siren: "lightning-bolt",
  /* paperwork + inspection */
  "clipboard-check": "clipboard-estimate",
  "clipboard-list": "clipboard-estimate",
  "file-check": "clipboard-estimate",
  "file-text": "clipboard-estimate",
  search: "magnifier-inspection",
  "search-check": "magnifier-inspection",
  /* scheduling + money */
  calendar: "calendar-booking",
  "calendar-check": "calendar-booking",
  "calendar-days": "calendar-booking",
  clock: "calendar-booking",
  "credit-card": "dollar-financing",
  "dollar-sign": "dollar-financing",
  banknote: "dollar-financing",
  "piggy-bank": "dollar-financing",
  wallet: "dollar-financing",
  "badge-percent": "dollar-financing",
  percent: "dollar-financing",
  tag: "dollar-financing",
  /* people + contact + place */
  users: "truck-crew",
  user: "truck-crew",
  truck: "truck-crew",
  "heart-handshake": "handshake",
  heart: "handshake",
  phone: "phone-callback",
  "phone-call": "phone-callback",
  "map-pin": "map-pin-service",
  map: "map-pin-service",
  "map-pinned": "map-pin-service",
}

/** True when the (already kebab-case) name IS one of the 24 bespoke glyphs. */
export function isBespokeIcon(name: string): name is BespokeIconName {
  return BESPOKE_SET.has(name)
}

/**
 * Resolve any semantic name (bespoke, Lucide, or PascalCase legacy) to a
 * bespoke glyph. Returns null when nothing maps, in which case the consumer
 * stays on the Lucide tier. IconChip calls this on Camp A packs only.
 */
export function toBespokeIcon(name: string): BespokeIconName | null {
  const kebab = toKebabCase(name)
  if (isBespokeIcon(kebab)) return kebab
  return BESPOKE_ALIASES[kebab] ?? null
}

/**
 * The ONLY names sanctioned to render as bare Lucide long-term (E1/E2):
 * small utility marks, never feature pictograms. The taste-gate advisory
 * lint reads this list; anything semantic outside it belongs to the bespoke
 * set on Camp A packs.
 */
export const MICRO_UTILITY_ICONS = [
  "chevron-down",
  "chevron-up",
  "chevron-left",
  "chevron-right",
  "arrow-right",
  "arrow-left",
  "arrow-up",
  "arrow-down",
  "arrow-up-right",
  "check",
  "phone",
  "star",
  "map-pin",
] as const

export function isMicroUtilityIcon(name: string): boolean {
  return (MICRO_UTILITY_ICONS as readonly string[]).includes(toKebabCase(name))
}

/* ---------------------------------------------------------------------------
 * Lucide tier (service resolution + validation)
 * ------------------------------------------------------------------------- */

interface KeywordIcon {
  pattern: RegExp
  icon: string
}

/* Priority order matters: specific intents (emergency, storm, insurance)
 * outrank generic verbs (repair, replace). All icons are valid kebab-case
 * keys in lucide-react dynamicIconImports, so every pack renders; on Camp A
 * packs IconChip lifts them to the bespoke set via BESPOKE_ALIASES
 * (search -> magnifier-inspection, layers -> shingle-stack, etc.). */
const KEYWORD_ICONS: KeywordIcon[] = [
  { pattern: /review|rating|testimonial/, icon: "star" },
  { pattern: /warrant/, icon: "shield-check" },
  { pattern: /emergency|urgent|24[\s/-]?7|same[\s-]?day/, icon: "siren" },
  { pattern: /storm|hail|wind|hurricane|tornado/, icon: "cloud-lightning" },
  { pattern: /insurance|claim/, icon: "file-check" },
  { pattern: /financ|payment|loan/, icon: "credit-card" },
  { pattern: /commercial|industrial|flat[\s-]?roof|tpo|epdm/, icon: "building-2" },
  { pattern: /gutter|downspout|drainage/, icon: "droplets" },
  { pattern: /siding|soffit|fascia|trim/, icon: "panel-top" },
  { pattern: /inspect|assessment/, icon: "search" },
  { pattern: /estimate|quote/, icon: "clipboard-check" },
  { pattern: /repair|leak|patch|restoration/, icon: "wrench" },
  { pattern: /replac|install|re-?roof|new[\s-]?roof|shingle|metal|tile/, icon: "layers" },
  { pattern: /roof/, icon: "house" },
]

/* Lucide renamed several icons; research data may still carry the old names. */
const RENAMED_ICONS: Record<string, string> = {
  home: "house",
  "check-circle": "circle-check",
  "check-circle-2": "circle-check-big",
  "alert-triangle": "triangle-alert",
  "alert-circle": "circle-alert",
  "help-circle": "circle-help",
  "x-circle": "circle-x",
}

const DEFAULT_ICON = "house"

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

function isKnownIcon(name: string): name is keyof typeof dynamicIconImports {
  return Object.prototype.hasOwnProperty.call(dynamicIconImports, name)
}

/**
 * Resolve the Lucide icon for a service by its name. Keyword semantics win;
 * the data-provided fallback is used only when it is a real Lucide icon.
 * Always returns a Lucide-valid name (the bespoke lift happens in IconChip).
 */
export function resolveServiceIcon(name: string, fallback?: string): string {
  const haystack = name.toLowerCase()

  for (const entry of KEYWORD_ICONS) {
    if (entry.pattern.test(haystack)) return entry.icon
  }

  if (fallback) {
    const kebab = toKebabCase(fallback)
    const normalized = RENAMED_ICONS[kebab] ?? kebab
    if (isKnownIcon(normalized)) return normalized
  }

  return DEFAULT_ICON
}
