/**
 * Shared step-icon resolution for the Process family.
 *
 * The step LABEL decides the icon, never its position. A positional array
 * (calendar on step 3, hammer on step 4) mismatches the icon to the step's
 * meaning the moment a client reorders or renames a step, exactly the
 * hammer-for-reviews class of bug that lib/icon-map.ts already guards for
 * services. This mirrors that keyword-first approach for process steps, so
 * "Certified Installation" always shows the hammer and "Final Walkthrough"
 * always shows the completion shield, whatever their index.
 *
 * Icon names stay kebab-case Lucide/legacy names so IconChip lifts them to
 * the bespoke duotone set on Camp A packs (via toBespokeIcon) and keeps them
 * as Lucide on the other tiers, unchanged from every other call site.
 */

interface StepKeywordIcon {
  pattern: RegExp
  icon: string
}

/* Priority order: specific step intents win over generic verbs. A "final
 * walkthrough" reads as completion (shield), not installation (hammer), so
 * the walkthrough/inspection-out patterns sit above the install pattern. */
const STEP_KEYWORD_ICONS: StepKeywordIcon[] = [
  { pattern: /contact|call|reach|touch|get in touch|phone|form|request/i, icon: "phone" },
  { pattern: /schedul|book|appoint|plan/i, icon: "calendar-check" },
  { pattern: /walk[\s-]?through|final|complet|hand[\s-]?off|clean[\s-]?up|warrant|review|sign[\s-]?off|follow[\s-]?up/i, icon: "shield-check" },
  { pattern: /estimate|quote|proposal|pric|option/i, icon: "clipboard-check" },
  { pattern: /inspect|assess|evaluat|survey|measur|diagnos/i, icon: "search" },
  { pattern: /install|build|construct|replac|re-?roof|repair|crew|work|shingle|metal/i, icon: "hammer" },
]

const DEFAULT_STEP_ICON = "clipboard-check"

/**
 * Resolve the semantic icon name for a process step from its title (and body
 * as a secondary signal). Always returns a real Lucide/legacy name.
 */
export function resolveStepIcon(title: string, body = ""): string {
  const haystack = `${title} ${body}`.toLowerCase()
  for (const entry of STEP_KEYWORD_ICONS) {
    if (entry.pattern.test(haystack)) return entry.icon
  }
  return DEFAULT_STEP_ICON
}
