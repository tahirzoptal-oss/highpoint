const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

/**
 * OwnerCard — the shared owner/identity plate used by the Hero composition and
 * the About section, so the two always read as the same component.
 *
 * Pure glass: frosted translucent body, hairline light rim, top gloss and a
 * soft drop shadow. No left accent rail, no coloured border — emphasis comes
 * from the type scale (name → role → optional stat) and a single short accent
 * underline beneath the name.
 *
 * Props:
 *   name       — display name (required)
 *   role       — title / position line (required)
 *   statValue  — optional figure shown to the right (e.g. years of experience)
 *   statLabel  — optional caption under that figure
 *   className  — layout hook for the caller
 */
export default function OwnerCard({ name, role, statValue, statLabel, className = '' }) {
  const hasStat = statValue !== undefined && statValue !== null && statValue !== '';

  return (
    <div
      className={`relative overflow-hidden rounded-[12px] px-4 py-4 sm:px-4 sm:py-[18px] ${className}`}
      style={{
        background: 'linear-gradient(158deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 100%)',
        backdropFilter: 'blur(22px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
        border: '1px solid rgba(255,255,255,0.75)',
        boxShadow: '0 1px 2px rgba(16,40,79,0.05), 0 18px 40px -20px rgba(16,40,79,0.5)',
      }}
    >
      

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div
            className="truncate text-[18px] font-bold uppercase leading-none"
            style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))', letterSpacing: '0.005em' }}
          >
            {name}
          </div>

          <div
            className="truncate text-[11px] mt-2 font-semibold uppercase leading-none tracking-[0.16em]"
            style={{ color: 'rgb(var(--accent))', fontFamily: INTER }}
          >
            {role}
          </div>
        </div>

        {hasStat && (
          <div className="flex flex-shrink-0 flex-col items-end text-right">
            <span className="text-[26px] font-bold leading-none" style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary))' }}>
              {statValue}
            </span>
            {statLabel && (
              <span className="mt-1.5 max-w-[74px] text-[9px] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-ink/45" style={{ fontFamily: INTER }}>
                {statLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
