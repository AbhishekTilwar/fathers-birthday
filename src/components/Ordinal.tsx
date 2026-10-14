import { Fragment } from 'react';

/**
 * Renders text with ordinals ("60th", "1st") as a single unbreakable unit with a
 * superscript suffix, so it can never read "th 60".
 */
export function Ordinal({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:st|nd|rd|th))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = /^(\d+)(st|nd|rd|th)$/.exec(p);
        return m ? (
          <span className="ordinal" key={i}>{m[1]}<sup>{m[2]}</sup></span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        );
      })}
    </>
  );
}
