import { useId } from 'react';

/** Hand-built SVG florals: layered roses, jasmine, leaves. Muted, heirloom palette. */

const PETAL = 'M0 0 C-21 -6 -27 -31 -7 -41 Q0 -44 7 -41 C27 -31 21 -6 0 0Z';
const tones = {
  red: ['#34090f', '#7d1d2a', '#c25560'],
  champagne: ['#97774a', '#d9c291', '#f7eed9'],
  blush: ['#86424b', '#d58e97', '#f5d3d1'],
  ivory: ['#b3a283', '#ebdfc6', '#fdf8ec'],
} as const;
export type RoseTone = keyof typeof tones;

type At = { x: number; y: number; s?: number; r?: number };
const place = ({ x, y, s = 1, r = 0 }: At) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

export function Rose({ x, y, s = 1, r = 0, tone = 'red' }: At & { tone?: RoseTone }) {
  const id = useId().replace(/:/g, '');
  const [d, m, l] = tones[tone];
  const layer = (n: number, off: number, sc: number, fill: string) =>
    Array.from({ length: n }, (_, i) => (
      <path key={`${sc}-${i}`} d={PETAL} transform={`rotate(${off + (i * 360) / n}) scale(${sc})`}
        fill={fill} stroke={d} strokeOpacity=".5" strokeWidth=".7" />
    ));
  return (
    <g transform={place({ x, y, s, r })}>
      <defs>
        <radialGradient id={`a${id}`} cx="50%" cy="100%" r="105%">
          <stop offset="0" stopColor={d} /><stop offset=".55" stopColor={m} /><stop offset="1" stopColor={l} />
        </radialGradient>
        <radialGradient id={`b${id}`} cx="50%" cy="100%" r="100%">
          <stop offset="0" stopColor={m} /><stop offset="1" stopColor={l} />
        </radialGradient>
      </defs>
      {layer(6, 0, 1, `url(#a${id})`)}
      {layer(5, 30, 0.78, `url(#b${id})`)}
      {layer(4, 12, 0.54, `url(#a${id})`)}
      <circle r="7" fill={d} />
      <path d="M-5 1a5 5 0 0 1 10 0a3 3 0 0 1 -6 0a1.6 1.6 0 0 1 3 0" fill="none" stroke={l} strokeOpacity=".6" strokeWidth=".9" />
    </g>
  );
}

const JP = 'M0 0 C-5.5 -8 -4.5 -18 0 -23 C4.5 -18 5.5 -8 0 0Z';
export function Jasmine({ x, y, s = 1, r = 0 }: At) {
  return (
    <g transform={place({ x, y, s, r })}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={JP} transform={`rotate(${a})`} fill="#fbf6ea" stroke="#cbb98f" strokeWidth=".6" />
      ))}
      <circle r="3" fill="#e5cf98" />
      <circle r="1.2" fill="#a98743" />
    </g>
  );
}

export function Bud({ x, y, s = 1, r = 0 }: At) {
  return (
    <g transform={place({ x, y, s, r })}>
      <ellipse cx="0" cy="-8" rx="3.4" ry="9" fill="#f4ecd9" stroke="#cbb98f" strokeWidth=".6" />
      <path d="M-2.4 -2c1 3 3.8 3 4.8 0" fill="#8aa069" />
    </g>
  );
}

export function Leaf({ x, y, s = 1, r = 0 }: At) {
  return (
    <g transform={place({ x, y, s, r })}>
      <path d="M0 0 C9 -15 28 -21 47 -15 C38 -3 19 7 0 0Z" fill="url(#leafG)" stroke="#233019" strokeOpacity=".5" strokeWidth=".6" />
      <path d="M2 -1 C16 -7 30 -10 44 -14" fill="none" stroke="#c9d3a4" strokeOpacity=".5" strokeWidth=".7" />
    </g>
  );
}

function LeafDefs() {
  return (
    <defs>
      <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#2b3a1f" /><stop offset=".6" stopColor="#566a3a" /><stop offset="1" stopColor="#7d8e57" />
      </linearGradient>
    </defs>
  );
}

const leaves: [number, number, number, number][] = [
  [60, 340, -62, 2.2], [60, 340, -36, 2.6], [60, 340, -10, 2.5], [60, 340, -88, 2.0], [60, 340, 14, 2.0],
  [100, 322, -22, 2.1], [40, 300, -80, 2.1], [110, 335, 8, 2.2], [80, 262, -70, 1.8], [155, 300, -14, 1.9],
  [128, 362, 4, 1.7], [30, 362, -52, 1.6], [48, 214, -96, 1.7], [190, 262, -34, 1.5], [215, 330, -6, 1.6],
];
const jasmines: [number, number, number, number][] = [
  [246, 290, 1, 10], [275, 262, 0.9, 40], [214, 262, 1.1, -20], [150, 188, 1, 0], [118, 150, 0.9, 30],
  [36, 150, 1.05, -15], [24, 105, 0.85, 20], [248, 352, 0.9, 0], [290, 322, 0.8, 30], [186, 372, 0.95, 12],
  [78, 120, 0.8, 10], [162, 142, 0.7, -10],
];
const buds: [number, number, number, number][] = [[262, 232, 1, 38], [96, 184, 1, -24], [20, 190, 1, -50], [300, 292, 1, 70], [210, 214, 0.9, 20]];

/** A corner arrangement anchored bottom-left. Flip with CSS for other corners. */
export function Bouquet({ className = '' }: { className?: string }) {
  return (
    <svg className={`flora ${className}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <LeafDefs />
      <g fill="none" stroke="#3b4c2a" strokeWidth="2.2" strokeLinecap="round" opacity=".85">
        <path d="M60 340 Q150 300 246 290" /><path d="M60 340 Q80 230 150 188" /><path d="M60 340 Q30 220 36 150" />
        <path d="M60 340 Q180 350 248 352" /><path d="M150 188 Q130 160 118 150" /><path d="M60 340 Q230 260 275 262" />
      </g>
      {leaves.map((l, i) => <Leaf key={i} x={l[0]} y={l[1]} r={l[2]} s={l[3]} />)}
      {buds.map((b, i) => <Bud key={i} x={b[0]} y={b[1]} s={b[2]} r={b[3]} />)}
      {jasmines.map((j, i) => <Jasmine key={i} x={j[0]} y={j[1]} s={j[2]} r={j[3]} />)}
      <Rose x={52} y={206} s={1.05} r={-20} tone="blush" />
      <Rose x={178} y={236} s={0.92} r={30} tone="ivory" />
      <Rose x={112} y={288} s={1.5} r={8} tone="red" />
      <Rose x={204} y={338} s={1.2} r={-14} tone="champagne" />
      <Rose x={266} y={372} s={0.78} r={20} tone="red" />
      <Jasmine x={150} y={330} s={0.9} r={20} />
      <Jasmine x={66} y={282} s={0.85} r={-10} />
    </svg>
  );
}

/** Small corner spray for the invitation card, anchored top-left. */
export function CornerSpray({ className = '' }: { className?: string }) {
  return (
    <svg className={`corner-spray ${className}`} viewBox="0 0 150 150" aria-hidden="true" focusable="false">
      <LeafDefs />
      <Leaf x={12} y={12} r={40} s={1.7} /><Leaf x={12} y={12} r={72} s={1.5} /><Leaf x={12} y={12} r={10} s={1.4} />
      <Leaf x={60} y={44} r={20} s={1.0} />
      <Bud x={92} y={22} r={70} /><Bud x={26} y={96} r={-20} />
      <Jasmine x={104} y={34} s={0.7} r={20} /><Jasmine x={34} y={104} s={0.7} r={-10} /><Jasmine x={74} y={74} s={0.6} />
      <Rose x={38} y={38} s={0.78} r={10} tone="red" />
      <Rose x={80} y={50} s={0.42} r={30} tone="champagne" />
    </svg>
  );
}

/** Horizontal floral divider. */
export function Sprig({ className = '' }: { className?: string }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 280 40" aria-hidden="true" focusable="false">
      <LeafDefs />
      <path d="M10 20H110M170 20H270" stroke="#b99a65" strokeWidth="1" />
      <Leaf x={112} y={22} r={-170} s={0.5} /><Leaf x={168} y={22} r={-10} s={0.5} />
      <Leaf x={112} y={18} r={170} s={0.45} /><Leaf x={168} y={18} r={10} s={0.45} />
      <Rose x={140} y={20} s={0.36} r={0} tone="red" />
      <Jasmine x={118} y={20} s={0.4} /><Jasmine x={162} y={20} s={0.4} />
    </svg>
  );
}
