import { MapPin, Phone } from 'lucide-react';
import { invitation } from '../data/invitation';
import { Reveal } from '../components/Reveal';
import { Ordinal } from '../components/Ordinal';
import { CornerSpray, Sprig } from '../components/art/Flowers';

/** Scene 5 — the printed-invitation card. */
export function EventDetails() {
  const { date, venueName, address, phones, valet, mapsLabel, mapsUrl } = invitation.event;
  return (
    <section className="scene details" id="details" aria-labelledby="details-h">
      <Reveal as="p" className="eyebrow" duration={1.1}>Reel Four · The Celebration</Reveal>
      <Reveal className="paper" duration={1.15}>
        <div className="tex" aria-hidden="true" />
        <CornerSpray className="cs tl" /><CornerSpray className="cs br" />
        <div className="paper-inner">
          <Sprig />
          <h2 id="details-h" className="visually-hidden">Event details</h2>

          <div className="detail">
            <p className="label">Date</p>
            <p className="big"><Ordinal text={date} /></p>
          </div>
          <div className="sep" aria-hidden="true"><i /></div>

          <div className="detail">
            <p className="label">Venue</p>
            <p className="big">{venueName}</p>
            <address className="address">{address}</address>
            <a className="link-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={18} aria-hidden="true" /> {mapsLabel}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="sep" aria-hidden="true"><i /></div>

          <div className="detail">
            <p className="label">Contact</p>
            <ul className="phones">
              {phones.map((p) => (
                <li key={p}>
                  <a href={`tel:+91${p}`} aria-label={`Call ${p}`}>
                    <Phone size={18} aria-hidden="true" /> {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sep" aria-hidden="true"><i /></div>

          <p className="valet">{valet}</p>
        </div>
      </Reveal>
    </section>
  );
}
