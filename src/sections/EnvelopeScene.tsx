import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { invitation } from '../data/invitation';
import { useGeometry } from '../lib/useGeometry';
import { Balloon } from '../components/art/Balloon';
import { Bouquet } from '../components/art/Flowers';
import { Petals } from '../components/art/Petals';
import { WaxSeal } from '../components/art/WaxSeal';
import { CornerOrnament } from '../components/art/Ornament';
import { InvitationCard } from '../components/InvitationCard';

type Phase = 'closed' | 'press' | 'flap' | 'rise' | 'forward' | 'done';
const rank: Record<Phase, number> = { closed: 0, press: 1, flap: 2, rise: 3, forward: 4, done: 5 };
type CardTarget = { y: number; scale: number; clipOpen: boolean };

/** Envelope pieces fall away toward the viewer's feet once the card is out. */
function Part({ z, className, children, gone, lite, drop }: { z: number; className: string; children?: ReactNode; gone: boolean; lite: boolean; drop: number }) {
  return (
    <motion.div className={className} style={{ zIndex: z }} initial={false}
      animate={gone ? (lite ? { opacity: 0 } : { y: drop, opacity: 0, scale: 0.96 }) : { y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: lite ? 0.5 : 1.05, ease: [0.55, 0, 0.8, 0.45] }}>
      {children}
    </motion.div>
  );
}

type Props = { onContinue: () => void };

/**
 * Scenes A + B: the sealed envelope, and the opening ritual.
 * closed -> press (seal) -> flap (3D rotateX) -> rise (card slides out)
 * -> forward (envelope drops away, card scales to the viewer) -> done.
 */
export function EnvelopeScene({ onContinue }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const g = useGeometry(sceneRef);
  const gRef = useRef(g);
  gRef.current = g;
  const reduce = useReducedMotion();
  const lowMem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  // Lite path: reduced-motion, short landscape screens, low-memory phones.
  const lite = !!reduce || g.vh < 520 || (lowMem !== undefined && lowMem <= 2);
  const { caption, monogram } = invitation.envelope;

  const [phase, setPhase] = useState<Phase>('closed');
  const [flapBehind, setFlapBehind] = useState(false);
  const r = rank[phase];
  const envRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<() => void>(() => {});
  const continueRef = useRef(onContinue);
  const timers = useRef<number[]>([]);

  const [cardTarget, setCardTarget] = useState<CardTarget>({ y: g.y0, scale: g.s0, clipOpen: false });

  const clipFor = (target: CardTarget) => {
    if (target.clipOpen) return 'inset(0px)';
    const k = gRef.current;
    const bottom = Math.max(0, k.H - k.b + target.y - (k.H - 1)) / k.s0;
    return `inset(-40px -40px ${bottom}px -40px)`;
  };
  const moveCard = (target: CardTarget) => setCardTarget(target);

  useEffect(() => {
    if (phase === 'closed') {
      setCardTarget({ y: g.y0, scale: g.s0, clipOpen: false });
    }
  }, [g.y0, g.s0, phase]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const open = () => {
    if (phase !== 'closed') return;
    if (lite) { setPhase('press'); at(450, () => setPhase('done')); return; }
    const k = gRef.current;
    setPhase('press');
    at(300, () => setPhase('flap'));
    at(780, () => setFlapBehind(true));
    at(1300, () => { setPhase('rise'); moveCard({ y: k.y1, scale: k.s0, clipOpen: false }); });
    at(2550, () => {
      setPhase('forward');
      const top = envRef.current?.getBoundingClientRect().top ?? 0;
      const yf = k.vh / 2 + k.Hc / 2 - (top + k.H - k.b);
      moveCard({ y: yf, scale: 1, clipOpen: true });
    });
    at(3800, () => setPhase('done'));
  };

  openRef.current = open;
  continueRef.current = onContinue;
  useEffect(() => {
    if (phase !== 'closed') return;
    const timer = window.setTimeout(() => openRef.current(), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (phase !== 'done') return;
    const timer = window.setTimeout(() => continueRef.current(), 3400);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const flapH = g.H * 0.6;
  const faded = r >= 2 ? 0 : 1;

  return (
    <motion.div ref={sceneRef} className="envscene" role="region" aria-label="Invitation opening" data-phase={phase}
      exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      {/* atmosphere */}
      <div className="bg-wine" aria-hidden="true" />
      <div className="bg-light" aria-hidden="true" />
      <div className="bg-flare" aria-hidden="true"><i /><i /><i /></div>
      <div className="screen-frame" aria-hidden="true">
        <CornerOrnament className="o tl" /><CornerOrnament className="o tr" /><CornerOrnament className="o bl" /><CornerOrnament className="o br" />
      </div>

      <div className="balloons" aria-hidden="true">
        <Balloon tone="burgundy" className="b1" /><Balloon tone="champagne" className="b2" />
        <Balloon tone="ivory" className="b3" /><Balloon tone="gold" className="b4" />
      </div>
      <div className="bq-wrap bl" aria-hidden="true"><Bouquet className="sway-a" /></div>
      <div className="bq-wrap tr" aria-hidden="true"><Bouquet className="sway-b" /></div>

      <motion.p className="env-caption foil" animate={{ opacity: faded }} transition={{ duration: 0.6 }}>{caption}</motion.p>

      <div className="env-stage">
        <div className="env-shadow" style={{ width: g.E * 1.05 }} aria-hidden="true" />
        <div className="env" ref={envRef} style={{ width: g.E, height: g.H, ['--seal' as string]: `${g.seal}px` }}>
          <motion.div className="card-glow" aria-hidden="true" initial={false}
            animate={{ opacity: r >= 3 ? 1 : 0, scale: r >= 3 ? 1 : 0.7 }} transition={{ duration: 1.6 }} />

          <Part z={1} className="env-back" gone={r >= 4} lite={lite} drop={g.vh * 0.6}><div className="liner" /></Part>

          {/* flap: real 3D rotation about its top edge */}
          <Part z={flapBehind ? 2 : 5} className="env-flap-wrap" gone={r >= 4} lite={lite} drop={g.vh * 0.6}>
            <motion.div className="flap" style={{ height: flapH, transformPerspective: 1300 }} initial={false}
              animate={{ rotateX: r >= 2 ? -180 : 0 }} transition={{ duration: 1.05, ease: [0.5, 0.05, 0.25, 1] }}>
              <div className="flap-face out">
                <div className="paper">
                  <svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M3 3 L50 55 L97 3" fill="none" stroke="#b99a65" strokeOpacity=".75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /><path d="M0 0 L50 60 L100 0" fill="none" stroke="#6b4b2c" strokeOpacity=".4" strokeWidth="1" vectorEffect="non-scaling-stroke" /></svg>
                </div>
                <motion.div className="seal" aria-hidden="true"
                  animate={{ scale: r >= 1 ? 0.86 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
                  <span className="seal-glow" aria-hidden="true" />
                  <WaxSeal monogram={monogram} />
                </motion.div>
              </div>
              <div className="flap-face in"><div className="paper"><div className="liner" /></div></div>
            </motion.div>
          </Part>

          <div className="env-card"
            style={{ width: g.W, height: g.Hc, marginLeft: -g.W / 2, bottom: g.b, clipPath: clipFor(cardTarget), transform: `translateY(${cardTarget.y}px) scale(${cardTarget.scale})`, transitionDuration: phase === 'rise' ? '1.25s' : phase === 'forward' ? '1.15s' : '0s', zIndex: 3, display: lite ? 'none' : undefined }}>
            <InvitationCard reveal={r >= 4 ? 2 : r >= 3 ? 1 : 0} />
          </div>

          <Part z={4} className="env-front" gone={r >= 4} lite={lite} drop={g.vh * 0.6}>
            <div className="panels">
              <i className="p-left" /><i className="p-right" /><i className="p-bottom" />
            </div>
            <div className="tex" />
            <svg viewBox="0 0 100 74" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" vectorEffect="non-scaling-stroke">
                <path d="M0 0 L50 54 L0 74" stroke="#6b4b2c" strokeOpacity=".35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M100 0 L50 54 L100 74" stroke="#6b4b2c" strokeOpacity=".35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M0 74 L50 40 L100 74" stroke="#6b4b2c" strokeOpacity=".4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M0 74 L50 41 L100 74" stroke="#fff6df" strokeOpacity=".6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            <div className="emboss" />
            <p className="env-sign foil">{invitation.title.honoree}</p>
          </Part>

          <Part z={6} className="env-bq" gone={r >= 4} lite={lite} drop={g.vh * 0.6}>
            <Bouquet className="env-corner" />
          </Part>
        </div>
      </div>

      {lite && phase === 'done' && (
        <motion.div className="lite-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="lite-card" style={{ width: g.W }}><InvitationCard reveal={2} instant /></div>
        </motion.div>
      )}


      {!lite && phase !== 'closed' && <Petals variant="burst" />}
      {!lite && <Petals />}
    </motion.div>
  );
}
