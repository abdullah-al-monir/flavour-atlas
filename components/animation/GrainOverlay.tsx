/**
 * Film grain + vignette for hero/pinned sections. The opacity of both
 * layers is driven entirely by CSS variables that flip to 0 in light
 * mode (see globals.css), so this component never branches on theme
 * itself — it's always mounted, just invisible in Editorial Daylight.
 */
export function GrainOverlay() {
  return (
    <div className="absolute inset-0 z-10" aria-hidden="true">
      <div className="vignette-overlay" />
      <div className="grain-overlay" />
    </div>
  );
}
