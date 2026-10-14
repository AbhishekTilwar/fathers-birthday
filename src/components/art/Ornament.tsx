/** Antique-gold filigree corner. Anchored top-left; rotate/flip with CSS. */
export function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg className={`corner-orn ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M2 2H70M2 2V70" strokeWidth="1.4" />
        <path d="M8 8H46M8 8V46" strokeWidth=".8" />
        <path d="M14 14 C34 14 34 34 20 34 C10 34 12 24 20 24" strokeWidth="1" />
        <path d="M46 8 C58 8 60 20 52 22 M8 46 C8 58 20 60 22 52" strokeWidth=".9" />
      </g>
      <path d="M2 2 l5 -0 l-5 5z" fill="currentColor" />
      <rect x="62" y="0" width="5" height="5" transform="rotate(45 64.5 2.5)" fill="currentColor" />
      <rect x="0" y="62" width="5" height="5" transform="rotate(45 2.5 64.5)" fill="currentColor" />
    </svg>
  );
}
