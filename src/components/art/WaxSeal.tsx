import { useId } from 'react';

const N = 30;
const pts = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2;
  const r = 49 + (i % 2 ? 3 : -1.5) + Math.sin(i * 2.3) * 2;
  return [60 + r * Math.cos(a), 60 + r * Math.sin(a)];
});
const blob = pts.map((p, i) => {
  const q = pts[(i + 1) % N];
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
  return `${i === 0 ? `M${mx} ${my}` : ''}Q${q[0]} ${q[1]} ${(q[0] + pts[(i + 2) % N][0]) / 2} ${(q[1] + pts[(i + 2) % N][1]) / 2}`;
}).join('') + 'Z';

export function WaxSeal({ monogram }: { monogram: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="wax" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`w${id}`} cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#b8404f" /><stop offset=".5" stopColor="#7d1a29" /><stop offset="1" stopColor="#3d0a13" />
        </radialGradient>
        <radialGradient id={`i${id}`} cx="60%" cy="65%" r="75%">
          <stop offset="0" stopColor="#8e2232" /><stop offset="1" stopColor="#4b0e18" />
        </radialGradient>
        <filter id={`b${id}`}><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id={`c${id}`}><path d={blob} /></clipPath>
      </defs>
      <path d={blob} fill={`url(#w${id})`} />
      <circle cx="60" cy="60" r="35" fill={`url(#i${id})`} stroke="#33080f" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="35" fill="none" stroke="#c46a73" strokeOpacity=".45" strokeWidth="1" transform="translate(-.8 -.8)" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="#2b060c" strokeOpacity=".6" strokeWidth=".8" strokeDasharray="1.5 2.5" />
      <text x="60" y="71" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="600" fontSize="32" fill="#2a060c" transform="translate(1 1.2)">{monogram}</text>
      <text x="60" y="71" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="600" fontSize="32" fill="#e3b4a6" fillOpacity=".92">{monogram}</text>
      <g clipPath={`url(#c${id})`}>
        <ellipse className="gleam" cx="42" cy="34" rx="24" ry="9" fill="#fff" opacity=".3" transform="rotate(-32 42 34)" filter={`url(#b${id})`} />
      </g>
    </svg>
  );
}
