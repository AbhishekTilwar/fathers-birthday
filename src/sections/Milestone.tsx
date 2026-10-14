import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { invitation } from '../data/invitation';
import { Reveal } from '../components/Reveal';
import { Sprig } from '../components/art/Flowers';

function Beat({ i, n, p, text }: { i: number; n: number; p: MotionValue<number>; text: string }) {
  const a = (i / (n + 1)) * 0.9;
  const b = a + 0.9 / (n + 1);
  // the first title is already visible at the top so the screen never looks empty
  const opacity = useTransform(p, i === 0 ? [0, b - 0.05, b] : [a, a + 0.05, b - 0.05, b], i === 0 ? [1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(p, [a, b], [30, -30]);
  return <motion.p className="beat foil" style={{ opacity, y }}>{text}</motion.p>;
}

/** The milestone: a short scroll-driven title sequence, then the tribute. "60" is a faint watermark. */
export function Milestone() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const mark = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const msgOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const msgY = useTransform(scrollYProgress, [0.6, 0.78], [30, 0]);
  const { beats, message } = invitation.milestone;

  if (reduce) {
    return (
      <section className="scene milestone static" aria-labelledby="milestone-h">
        <div className="mark-60" aria-hidden="true">60</div>
        {beats.map((b) => <p key={b} className="beat foil">{b}</p>)}
        <Sprig />
        <h2 id="milestone-h" className="milestone-message">{message}</h2>
      </section>
    );
  }

  return (
    <section ref={ref} className="milestone-track" aria-labelledby="milestone-h">
      <div className="milestone-sticky">
        <motion.div className="mark-60" style={{ y: mark }} aria-hidden="true">60</motion.div>
        <p className="eyebrow">Reel Three · The Milestone</p>
        <div className="beats" aria-hidden="true">
          {beats.map((t, i) => <Beat key={t} i={i} n={beats.length} p={scrollYProgress} text={t} />)}
        </div>
        <motion.div className="milestone-final" style={{ opacity: msgOpacity, y: msgY }}>
          <Sprig />
          <h2 id="milestone-h" className="milestone-message">{message}</h2>
        </motion.div>
      </div>
    </section>
  );
}
