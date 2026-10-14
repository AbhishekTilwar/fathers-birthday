// Generates favicon PNGs and the 1200x630 WhatsApp/OG preview from SVG.
// Run: npm run make-share-image   (edit the text below to change the preview)
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const serif = "Georgia, 'Times New Roman', serif";
const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#4A2026"/><stop offset="1" stop-color="#171311"/></radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .07 0"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" filter="url(#n)"/>
  <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#B99A65" stroke-opacity=".6" stroke-width="2"/>
  <rect x="42" y="42" width="1116" height="546" fill="none" stroke="#B99A65" stroke-opacity=".25" stroke-width="1"/>
  <text x="600" y="150" text-anchor="middle" font-family="${serif}" font-size="22" letter-spacing="7" fill="#B99A65">WITH GREAT JOY, WE INVITE YOU TO CELEBRATE</text>
  <text x="600" y="290" text-anchor="middle" font-family="${serif}" font-size="104" font-weight="bold" fill="#F3E8D6">Shri Pravin Tilwar</text>
  <path d="M470 335h260" stroke="#B99A65" stroke-width="1.5"/>
  <text x="600" y="395" text-anchor="middle" font-family="${serif}" font-size="26" letter-spacing="5" fill="#D3B886">DIVISIONAL ENGINEER, BSNL</text>
  <text x="600" y="465" text-anchor="middle" font-family="${serif}" font-size="42" font-style="italic" fill="#F3E8D6">60th Birthday &amp; Retirement Celebration</text>
  <text x="600" y="540" text-anchor="middle" font-family="${serif}" font-size="26" fill="#B99A65">Sunday, 1st November 2026  ·  The Legend Inn, Nagpur</text>
</svg>`;
await sharp(Buffer.from(share)).png().toFile('public/favicon/share-preview.png');

const icon = readFileSync('public/favicon/favicon.svg');
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile('public/favicon/apple-touch-icon.png');
console.log('Generated share-preview.png and apple-touch-icon.png');
