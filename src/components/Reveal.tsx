import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'p' | 'h2' | 'h3' | 'li' | 'span';
  /** 'film' = fade + soft focus pull (default); 'wipe' = curtain wipe for photographs. */
  kind?: 'film' | 'wipe';
};

/**
 * Cinematic appearance, like a cut in a film reel: a soft focus pull and slow fade for text,
 * a curtain wipe with a slow push-in for photographs. MotionConfig handles reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div', kind = 'film' }: Props) {
  const Tag = motion[as];
  const wipe = kind === 'wipe';
  return (
    <Tag
      className={className}
      initial={wipe ? { opacity: 0, clipPath: 'inset(0 0 100% 0)', scale: 1.04 } : { opacity: 0, y, scale: 0.985, filter: 'blur(6px)' }}
      whileInView={wipe ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', scale: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: wipe ? 1.8 : 1.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
