import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { invitation } from '../data/invitation';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { Lightbox } from '../components/Lightbox';

const tilts = [-2.2, 1.6, -1.2, 2.4];

/** Vintage photo album. Frames come from invitation.journey.frames; tap a photo to enlarge it. */
export function Journey() {
  const { heading, subheading, frames } = invitation.journey;
  const [open, setOpen] = useState<number | null>(null);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  return (
    <section className="scene journey" aria-labelledby="journey-h">
      <div className="film-strip" aria-hidden="true" />
      <Reveal as="p" className="eyebrow">Reel Two · The Album</Reveal>
      <Reveal as="h2" className="scene-title"><span id="journey-h">{heading}</span></Reveal>
      <Reveal as="p" className="scene-sub">{subheading}</Reveal>

      <ul className="album">
        {frames.map((f, i) => (
          <Reveal as="li" key={f.src} kind="wipe" delay={(i % 2) * 0.2} className="album-page">
            <figure style={{ ['--tilt' as string]: `${tilts[i % tilts.length]}deg` }}>
              <button type="button" className="photo" disabled={missing[f.src]} onClick={() => setOpen(i)}
                aria-label={`Enlarge: ${f.alt}`}>
                <span className="corner c1" aria-hidden="true" /><span className="corner c2" aria-hidden="true" />
                <SafeImage slot={f} ratio="4 / 5" onMissing={() => setMissing((m) => ({ ...m, [f.src]: true }))} />
              </button>
              {f.caption && <figcaption className="hand">{f.caption}</figcaption>}
            </figure>
          </Reveal>
        ))}
      </ul>
      <div className="film-strip" aria-hidden="true" />
      <AnimatePresence>
        {open !== null && <Lightbox items={frames} index={open} ratio="4 / 5" onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
