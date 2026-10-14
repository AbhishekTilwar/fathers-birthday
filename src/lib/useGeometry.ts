import { useEffect, useState, type RefObject } from 'react';

export type Geometry = ReturnType<typeof compute>;

/**
 * All envelope/card sizes in px, derived from the viewport.
 * E/H = envelope, W/Hc = invitation card at full size, s0 = card scale inside the envelope.
 */
function compute(vw = window.innerWidth, vh = window.innerHeight) {
  const E = Math.min(vw * 0.88, 540, (vh - 150) / 0.74, vh * 0.6);
  const H = E * 0.74;
  const W = Math.max(160, Math.min(vw * 0.92, 440, (vh - 120) / 1.4));
  const Hc = W * 1.4;
  const cw = E * 0.78;
  const s0 = cw / W;
  const b = H * 0.07;
  const peek = -H * 0.06; // negative: card sits fully inside the envelope, top tucked under the flap
  const ch = Hc * s0;
  const y0 = ch - H + b - peek; // card tucked in the pocket, top peeking
  const y1 = b - 0.16 * H; // end of the "rise"
  return { vw, vh, E, H, W, Hc, s0, b, peek, y0, y1, seal: Math.max(44, Math.min(104, E * 0.2)) };
}

/**
 * Sizes come from the scene's real box (not window.innerWidth), so the envelope stays
 * centred and inside the frame in embedded/emulated viewports and while resizing.
 */
export function useGeometry(box: RefObject<HTMLElement | null>): Geometry {
  const [g, setG] = useState(() => compute());
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const on = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (w && h) setG(compute(w, h));
    };
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [box]);
  return g;
}
