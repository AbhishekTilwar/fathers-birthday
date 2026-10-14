import { motion } from 'motion/react';

/** Warm film-burn flash used to cut between the invitation and the tribute. */
export function FilmBurn() {
  return (
    <motion.div className="film-burn" aria-hidden="true"
      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, times: [0, 0.42, 0.55, 1], ease: 'easeInOut' }} />
  );
}
