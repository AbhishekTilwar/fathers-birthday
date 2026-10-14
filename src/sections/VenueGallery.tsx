import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Lightbox } from '../components/Lightbox';
import { invitation } from '../data/invitation';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';

/** Scene 6 — wide cinematic venue frames (placeholders until photos are added). */
export function VenueGallery() {
  const { heading, subheading, frames } = invitation.venue;
  const [open, setOpen] = useState<number | null>(null);
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  return (
    <section className="scene venue" aria-labelledby="venue-h">
      <Reveal as="p" className="eyebrow">Reel Five · Where We Gather</Reveal>
      <Reveal as="h2" className="scene-title"><span id="venue-h">{heading}</span></Reveal>
      <Reveal as="p" className="scene-sub">{subheading}</Reveal>
      <div className="venue-reel">
        {frames.map((f, i) => (
          <Reveal key={f.src} kind="wipe" delay={0.1} className={`venue-frame f${i}`}>
            <button type="button" className="cinema-btn" disabled={missing[f.src]} onClick={() => setOpen(i)} aria-label={`Enlarge: ${f.alt}`}>
              <SafeImage slot={f} ratio="21 / 9" className="cinema" onMissing={() => setMissing((m) => ({ ...m, [f.src]: true }))} />
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && <Lightbox items={frames} index={open} ratio="21 / 9" onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
