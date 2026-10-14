/** Drifting rose petals. Pure CSS animation; hidden entirely in lite mode. */
type P = { x: number; sz: number; dur: number; delay: number; dx: number; op: number; blur: number; hue: number };

const base: P[] = [
  { x: 8, sz: 22, dur: 16, delay: 0, dx: 90, op: 0.9, blur: 0, hue: 0 },
  { x: 24, sz: 14, dur: 22, delay: 4, dx: -60, op: 0.6, blur: 0.5, hue: 1 },
  { x: 41, sz: 30, dur: 14, delay: 9, dx: 70, op: 0.85, blur: 2, hue: 0 },
  { x: 55, sz: 12, dur: 25, delay: 2, dx: -40, op: 0.5, blur: 0.5, hue: 2 },
  { x: 68, sz: 20, dur: 18, delay: 7, dx: -90, op: 0.85, blur: 0, hue: 0 },
  { x: 80, sz: 16, dur: 21, delay: 12, dx: 50, op: 0.65, blur: 0.5, hue: 1 },
  { x: 92, sz: 26, dur: 15, delay: 5, dx: -70, op: 0.9, blur: 1.5, hue: 0 },
  { x: 33, sz: 11, dur: 27, delay: 14, dx: 40, op: 0.45, blur: 0.5, hue: 2 },
];
const burst: P[] = [
  { x: 12, sz: 34, dur: 7, delay: 0, dx: 120, op: 0.95, blur: 2.5, hue: 0 },
  { x: 30, sz: 24, dur: 8, delay: 0.4, dx: -80, op: 0.9, blur: 1, hue: 1 },
  { x: 50, sz: 38, dur: 6.5, delay: 0.2, dx: 90, op: 0.95, blur: 3, hue: 0 },
  { x: 66, sz: 26, dur: 8.5, delay: 0.7, dx: -110, op: 0.9, blur: 1, hue: 2 },
  { x: 84, sz: 32, dur: 7, delay: 0.1, dx: -60, op: 0.95, blur: 2.5, hue: 0 },
  { x: 92, sz: 20, dur: 9, delay: 0.9, dx: -90, op: 0.8, blur: 0.5, hue: 1 },
];
const fills = ['url(#petalA)', 'url(#petalB)', 'url(#petalC)'];

export function Petals({ variant = 'ambient' }: { variant?: 'ambient' | 'burst' }) {
  const list = variant === 'burst' ? burst : base;
  return (
    <div className={`petals ${variant}`} aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="petalA" cx="30%" cy="80%" r="90%"><stop offset="0" stopColor="#5e1420" /><stop offset="1" stopColor="#b9525d" /></radialGradient>
          <radialGradient id="petalB" cx="30%" cy="80%" r="90%"><stop offset="0" stopColor="#c98089" /><stop offset="1" stopColor="#f2cfd0" /></radialGradient>
          <radialGradient id="petalC" cx="30%" cy="80%" r="90%"><stop offset="0" stopColor="#c9b078" /><stop offset="1" stopColor="#f6ecd2" /></radialGradient>
          <path id="petalShape" d="M2 0 C12 -8 22 4 14 16 C9 23 -3 20 -5 9 C-6 3 -2 1 2 0Z" />
        </defs>
      </svg>
      {list.map((p, i) => (
        <span key={i} className="petal"
          style={{ ['--x' as string]: `${p.x}%`, ['--sz' as string]: `${p.sz}px`, ['--dur' as string]: `${p.dur}s`, ['--delay' as string]: `${p.delay}s`, ['--dx' as string]: `${p.dx}px`, ['--op' as string]: p.op, filter: p.blur ? `blur(${p.blur}px)` : undefined }}>
          <svg viewBox="-8 -10 32 36" width="100%"><use href="#petalShape" fill={fills[p.hue]} /></svg>
        </span>
      ))}
    </div>
  );
}
