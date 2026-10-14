import { motion } from 'motion/react';
import { invitation } from '../data/invitation';
import { Ordinal } from './Ordinal';
import { CornerSpray } from './art/Flowers';

/**
 * The printed invitation card. Sized by its container (cqw units), so the same
 * component works inside the envelope and full-size.
 * reveal: 0 = blank paper, 1 = headline lines, 2 = everything.
 */
export function InvitationCard({ reveal, instant }: { reveal: number; instant?: boolean }) {
  const { invite, honoree, designation, occasion } = invitation.title;
  const { headline } = invitation.opening;
  const { date, venueName } = invitation.event;
  const [shri, ...rest] = honoree.split(' ');

  const item = (need: number, i: number) => ({
    initial: false as const,
    animate: { opacity: reveal >= need ? 1 : 0, y: reveal >= need ? 0 : 10 },
    transition: instant ? { duration: 0 } : { duration: 1.1, delay: reveal >= need ? i * 0.22 : 0, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  return (
    <div className="inv-card">
      <div className="tex" aria-hidden="true" />
      <div className="inv-border" aria-hidden="true" />
      <CornerSpray className="cs tl" /><CornerSpray className="cs tr" />
      <CornerSpray className="cs bl" /><CornerSpray className="cs br" />
      <div className="inv-body">
        <motion.p className="inv-eyebrow foil" {...item(1, 0)}>{invite}</motion.p>
        <motion.h2 className="inv-name" {...item(1, 1)}>
          <span className="shri">{shri}</span>{' '}<span className="nm foil">{rest.join(' ')}</span>
        </motion.h2>
        <motion.p className="inv-designation" {...item(2, 0)}>{designation}</motion.p>
        <motion.i className="inv-rule" aria-hidden="true" {...item(2, 1)} />
        <motion.p className="inv-occasion" {...item(2, 2)}><Ordinal text={occasion} /></motion.p>
        <motion.p className="inv-headline" {...item(2, 3)}>{headline}</motion.p>
        <motion.i className="inv-rule" aria-hidden="true" {...item(2, 4)} />
        <motion.p className="inv-date" {...item(2, 5)}><Ordinal text={date} /></motion.p>
        <motion.p className="inv-venue" {...item(2, 6)}>{venueName}</motion.p>
      </div>
    </div>
  );
}
