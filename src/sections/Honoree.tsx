import { invitation } from '../data/invitation';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { Ordinal } from '../components/Ordinal';
import { Sprig } from '../components/art/Flowers';

/** The emotional introduction to the honoree. Portrait slot is replaceable. */
export function Honoree() {
  const { honoree, designation, occasion } = invitation.title;
  const { headline } = invitation.opening;
  const { portrait } = invitation.milestone;

  return (
    <section className="scene honoree" aria-labelledby="honoree-h">
      <Reveal as="p" className="eyebrow">Reel One · The Honoree</Reveal>
      <Reveal className="portrait-wrap" kind="wipe">
        <div className="ornate-frame">
          <span className="of-corner a" /><span className="of-corner b" /><span className="of-corner c" /><span className="of-corner d" />
          <SafeImage slot={portrait} ratio="4 / 5" eager />
        </div>
      </Reveal>
      <Reveal as="h2" className="honoree-name foil" delay={0.1}><span id="honoree-h">{honoree}</span></Reveal>
      <Reveal as="p" className="designation" delay={0.15}>{designation}</Reveal>
      <Reveal delay={0.2}><Sprig /></Reveal>
      <Reveal as="p" className="honoree-line" delay={0.2}>{headline}</Reveal>
      <Reveal as="p" className="honoree-occasion" delay={0.25}><Ordinal text={occasion} /></Reveal>
    </section>
  );
}
