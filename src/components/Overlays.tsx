/** Fixed film-grain + vignette. Pure CSS, pointer-events none. */
export function Overlays() {
  return (
    <div className="overlays" aria-hidden="true">
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
