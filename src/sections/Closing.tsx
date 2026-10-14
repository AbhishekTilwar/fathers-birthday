import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { invitation } from '../data/invitation';
import { Bouquet, Sprig } from '../components/art/Flowers';
import { WaxSeal } from '../components/art/WaxSeal';

/** Final frame — slow fade like the end of a reel, signed by the family. */
export function Closing({ onReplay }: { onReplay: () => void }) {
  const { message, regards, family } = invitation.closing;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -15% 0px' },
    transition: { duration: 1.8, delay, ease: 'easeOut' as const },
  });
  return (
    <section className="scene closing" aria-labelledby="closing-h">
      <div className="bq-wrap bl small" aria-hidden="true"><Bouquet className="sway-a" /></div>
      <div className="bq-wrap br small" aria-hidden="true"><Bouquet className="sway-b" /></div>
      <div className="closing-vignette" aria-hidden="true" />
      <motion.h2 id="closing-h" className="closing-message" {...rise(0)}>{message}</motion.h2>
      <motion.div {...rise(0.6)}><Sprig /></motion.div>
      <motion.p className="regards" {...rise(1.1)}>{regards}</motion.p>
      <motion.p className="closing-family foil" {...rise(1.8)}>{family}</motion.p>
      <motion.div className="closing-seal" aria-hidden="true" {...rise(2.4)}><WaxSeal monogram={invitation.envelope.monogram} /></motion.div>
      <motion.button type="button" className="replay" onClick={onReplay} {...rise(2.8)}>
        <RotateCcw size={16} aria-hidden="true" /> Watch the invitation again
      </motion.button>
    </section>
  );
}
