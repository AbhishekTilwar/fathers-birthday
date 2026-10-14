import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { asset } from '../lib/asset';
import type { ImageSlot } from '../data/invitation';

type Props = {
  slot: ImageSlot;
  /** CSS aspect-ratio, e.g. "4 / 5". Reserved up front to avoid layout shift. */
  ratio: string;
  eager?: boolean;
  /** Render nothing at all (instead of a placeholder) if the file is missing. */
  hideIfMissing?: boolean;
  className?: string;
  onMissing?: () => void;
};

/** Image with a designed placeholder fallback; never shows a broken icon. */
export function SafeImage({ slot, ratio, eager, hideIfMissing, className = '', onMissing }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const fail = () => { setFailed(true); onMissing?.(); };

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) fail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed && hideIfMissing) return null;

  return (
    <div className={`safe-image ${className}`} style={{ aspectRatio: ratio }}>
      {failed ? (
        <div className="placeholder" role="img" aria-label={`${slot.placeholder} (placeholder)`}>
          <Camera size={28} strokeWidth={1.2} aria-hidden="true" />
          <span>{slot.placeholder}</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={asset(slot.src)}
          alt={slot.alt}
          style={slot.position ? { objectPosition: slot.position } : undefined}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={fail}
        />
      )}
    </div>
  );
}
