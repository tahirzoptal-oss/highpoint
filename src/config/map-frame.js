/**
 * MAP_FRAME — the shared Google-map frame treatment.
 *
 * The homepage Service Area map defined this inline; it now lives here so the
 * Contact page map can reuse the exact same radius, glass frame, shadow,
 * corner bracket and offset panel instead of re-deriving them. Values are
 * unchanged from the original ServiceAreas SURFACE map.
 *
 * Consumers render:
 *   <div class="relative overflow-hidden rounded-[24px] p-2 backdrop-blur-md"
 *        style={{ background: f.frameBg, border: `1px solid ${f.frameBorder}`,
 *                 boxShadow: f.frameShadow }}>
 *     <div class="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] sm:aspect-[16/11]"> … </div>
 *   </div>
 */
export const MAP_FRAME = {
  dark: {
    frameBorder: 'rgba(255,255,255,0.2)',
    frameBg: 'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
    frameShadow: '0 2px 8px -2px rgba(0,0,0,0.4), 0 30px 58px -26px rgba(0,0,0,0.8)',
    bracket: 'rgba(255,255,255,0.22)',
    panel: 'linear-gradient(150deg, rgb(var(--accent) / 0.4), rgb(var(--accent) / 0.08))',
    panelBorder: 'rgba(255,255,255,0.14)',
  },
  light: {
    frameBorder: 'rgba(16,40,79,0.08)',
    frameBg: '#FFFFFF',
    frameShadow: '0 2px 6px -1px rgba(16,40,79,0.06), 0 26px 52px -26px rgba(16,40,79,0.3)',
    bracket: 'rgb(var(--accent) / 0.32)',
    panel: 'linear-gradient(150deg, rgb(var(--accent) / 0.22), rgb(var(--accent) / 0.04))',
    panelBorder: 'rgba(255,255,255,0.6)',
  },
};
