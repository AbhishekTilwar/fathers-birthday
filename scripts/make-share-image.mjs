// Generates favicon PNGs and the 1200x630 WhatsApp/Open Graph preview.
// Run: npm run make-share-image
// Uses public/images/family/father-portrait.jpg when present (falls back to a text-only card).
import sharp from 'sharp';
import { existsSync, readFileSync } from 'node:fs';

const serif = "Georgia, 'Times New Roman', serif";
const hasPortrait = existsSync('public/images/family/father-portrait.jpg');
const cx = hasPortrait ? 850 : 600; // text column centre (clear of the portrait, which ends at x=506)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="${hasPortrait ? 62 : 50}%" cy="40%" r="80%"><stop offset="0" stop-color="#6a2631"/><stop offset=".6" stop-color="#3d1219"/><stop offset="1" stop-color="#1a0c0f"/></radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .06 0"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" filter="url(#n)"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#b99a65" stroke-opacity=".65" stroke-width="2"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#b99a65" stroke-opacity=".25"/>
  <text x="${cx}" y="150" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 15 : 22}" letter-spacing="${hasPortrait ? 3 : 5}" fill="#d3b886">WITH GREAT JOY, WE INVITE YOU TO CELEBRATE</text>
  <text x="${cx}" y="262" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 60 : 104}" font-weight="bold" fill="#f3e8d6">Shri Pravin Tilwar</text>
  <path d="M${cx - 110} 300h220" stroke="#b99a65" stroke-width="1.5"/>
  <text x="${cx}" y="350" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 20 : 24}" letter-spacing="3" fill="#d3b886">DIVISIONAL ENGINEER, BSNL</text>
  <text x="${cx}" y="425" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 32 : 42}" font-style="italic" fill="#f3e8d6">60th Birthday &amp; Retirement</text>
  <text x="${cx}" y="468" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 32 : 42}" font-style="italic" fill="#f3e8d6">Celebration</text>
  <text x="${cx}" y="545" text-anchor="middle" font-family="${serif}" font-size="${hasPortrait ? 20 : 25}" fill="#b99a65">Sunday, 1st November 2026 · The Legend Inn, Nagpur</text>
</svg>`;

const layers = [];
if (hasPortrait) {
  const w = 336, h = 420;
  const photo = await sharp('public/images/family/father-portrait.jpg')
    .resize(w, h, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.92 }).png().toBuffer();
  const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + 40}" height="${h + 40}"><rect x="1" y="1" width="${w + 38}" height="${h + 38}" fill="#2a1a14" stroke="#b99a65" stroke-width="2"/></svg>`;
  layers.push({ input: Buffer.from(frame), left: 130, top: 105 }, { input: photo, left: 150, top: 125 });
}
// 1200x630 palette PNG keeps the file small enough for WhatsApp's preview limit
await sharp(Buffer.from(svg)).composite(layers).png({ palette: true, quality: 80, compressionLevel: 9 }).toFile('public/favicon/share-preview.png');

await sharp(readFileSync('public/favicon/favicon.svg'), { density: 400 }).resize(180, 180).png().toFile('public/favicon/apple-touch-icon.png');
console.log('Generated share-preview.png and apple-touch-icon.png');
