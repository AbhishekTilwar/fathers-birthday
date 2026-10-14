import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ImageSlot } from '../data/invitation';
import { SafeImage } from './SafeImage';

type Props = { items: ImageSlot[]; index: number; ratio: string; onIndex: (i: number) => void; onClose: () => void };

/** A photograph opened into a larger ornate frame. Esc / arrows / backdrop work. */
export function Lightbox({ items, index, ratio, onIndex, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];
  const [ra, rb] = ratio.split('/').map(Number);
  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const keys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', keys);
    document.body.classList.add('locked');
    return () => {
      window.removeEventListener('keydown', keys);
      document.body.classList.remove('locked');
      prev?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={item.alt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onClose}>
      <motion.figure className="lb-frame" style={{ ['--r' as string]: ra / rb }} onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, y: 20, rotate: -1 }} animate={{ scale: 1, y: 0, rotate: 0 }} transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}>
        <div className="lb-mat"><SafeImage key={item.src} slot={item} ratio={ratio} eager /></div>
        {item.caption && <figcaption className="hand">{item.caption}</figcaption>}
      </motion.figure>
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close photograph"><X size={22} /></button>
      {items.length > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photograph"><ChevronLeft size={26} /></button>
          <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photograph"><ChevronRight size={26} /></button>
        </>
      )}
    </motion.div>
  );
}
