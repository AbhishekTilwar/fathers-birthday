import { useId } from 'react';

const tones = {
  ivory: ['#fbf3e2', '#e6d6b6', '#b9a37a'],
  champagne: ['#f0dba6', '#d2b574', '#8c7036'],
  burgundy: ['#b04654', '#6d1b27', '#35090f'],
  gold: ['#ecce85', '#c19b4d', '#76571f'],
} as const;
export type BalloonTone = keyof typeof tones;

export function Balloon({ tone, className = '', style }: { tone: BalloonTone; className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, '');
  const [a, b, c] = tones[tone];
  return (
    <svg className={`balloon ${className}`} style={style} viewBox="0 0 60 140" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`g${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} />
        </radialGradient>
      </defs>
      <path d="M30 80 C24 92 36 100 30 112 S28 130 30 138" fill="none" stroke="#e8d9b8" strokeOpacity=".5" strokeWidth=".8" />
      <path d="M30 2 C50 2 58 22 56 41 C54 61 40 74 30 76 C20 74 6 61 4 41 C2 22 10 2 30 2Z" fill={`url(#g${id})`} />
      <path d="M30 76 l-4.5 7 h9z" fill={c} />
      <ellipse cx="19" cy="24" rx="6" ry="11" fill="#fff" opacity=".35" transform="rotate(18 19 24)" />
      <ellipse cx="42" cy="58" rx="9" ry="5" fill="#000" opacity=".12" transform="rotate(-35 42 58)" />
    </svg>
  );
}
