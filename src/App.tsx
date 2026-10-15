import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { invitation } from './data/invitation';
import { useSound } from './lib/useSound';
import { asset } from './lib/asset';
import { useScrollNudge } from './lib/useScrollNudge';
import { Overlays } from './components/Overlays';
import { SoundToggle } from './components/SoundToggle';
import { ScrollCue } from './components/ScrollCue';
import { FilmBurn } from './components/FilmBurn';
import { EnvelopeScene } from './sections/EnvelopeScene';
import { Honoree } from './sections/Honoree';
import { Journey } from './sections/Journey';
import { Milestone } from './sections/Milestone';
import { EventDetails } from './sections/EventDetails';
import { VenueGallery } from './sections/VenueGallery';
import { Closing } from './sections/Closing';

export default function App() {
  const [stage, setStage] = useState<'scene' | 'main'>('scene');
  const [burn, setBurn] = useState(false);
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);
  const sound = useSound(invitation.audio);
  useScrollNudge(stage === 'main');

  // Fetch and decode every photograph during the opening so nothing waits for its turn later.
  useEffect(() => {
    const srcs = [invitation.milestone.portrait.src, ...invitation.journey.frames.map((f) => f.src), ...invitation.venue.frames.map((f) => f.src)];
    srcs.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = asset(src);
      void img.decode?.().catch(() => { /* missing photo: the placeholder is shown instead */ });
    });
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked', stage === 'scene');
  }, [stage]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const toMain = () => { setStage('main'); window.scrollTo(0, 0); };
  /** Card -> tribute, cut with a warm film burn. */
  const cont = () => {
    setBurn(true);
    timers.current.push(window.setTimeout(toMain, 620), window.setTimeout(() => setBurn(false), 1600));
  };
  const replay = () => { setRun((n) => n + 1); setStage('scene'); window.scrollTo(0, 0); };

  return (
    <MotionConfig reducedMotion="user">
      <Overlays />
      <SoundToggle on={sound.on} onToggle={sound.toggle} />
      <AnimatePresence>
        {stage === 'scene' && <EnvelopeScene key={run} onContinue={cont} />}
      </AnimatePresence>
      {burn && <FilmBurn />}
      {stage === 'main' && (
        <main>
          <Honoree />
          <Journey />
          <Milestone />
          <EventDetails />
          <VenueGallery />
          <Closing onReplay={replay} />
          <ScrollCue />
        </main>
      )}
    </MotionConfig>
  );
}
