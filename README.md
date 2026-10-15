# Cinematic Vows — 60th Birthday & Retirement Invitation

A cinematic, 90s-family-film-inspired invitation website for **Shri Pravin Tilwar**.
React + Vite + TypeScript + Motion. Fully static: no backend, database, secrets or paid APIs.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

## Change text
Everything (names, date, venue, phones, messages, image paths, audio path, share metadata)
lives in **`src/data/invitation.ts`**. Page title and WhatsApp/Open Graph text are generated from it at build time.

## Replace photographs
Copy files into `public/images/` with these **exact names** (JPG). Until a file exists, an elegant placeholder is shown.

| Role | File |
|---|---|
| Portrait (shown in a framed placeholder in the honoree scene until added) | `public/images/family/father-portrait.jpg` |
| Album – family | `public/images/family/family-memories-01.jpg` |
| Venue – exterior (single wide photo) | `public/images/venue/venue-exterior.jpg` |

Tips: album photos are cropped to 4:5 portrait, venue photos to wide 21:9 (16:10 on phones); keep subjects centred.
Resize to ~1600px on the long edge and compress (under ~300 KB each) for fast loading on WhatsApp/mobile.
To use another extension (png/webp) or add more album photos, edit the `frames` lists in `invitation.ts`; captions are editable there too.

### Venue photograph
The venue scene uses a photograph of The Legend Inn supplied by the family (`public/images/venue/venue-exterior.jpg`, shown in a 3:4 frame; tap it to see the full 9:16 photo). Replace the file to change it.

## Music
Off by default; starts only when the visitor taps the toggle. Drop a licensed instrumental at
`public/music/background-instrumental.mp3` (change the path via `audio` in `invitation.ts`).
If no file exists, a soft synthesized ambience (generated in the browser, no copyrighted content) plays instead.
Do not add copyrighted film songs without permission.

## Share preview & favicon
`public/favicon/favicon.svg`, `apple-touch-icon.png`, `share-preview.png` (1200×630) are generated from this project's own design.
Regenerate after editing `scripts/make-share-image.mjs`: `npm run make-share-image`.
WhatsApp needs an **absolute** image URL: set `SITE_URL=https://your-domain` at build time
(Vercel's production URL is detected automatically). WhatsApp caches previews — use a fresh URL or its debugger/re-share to refresh.

## Deploy
**Vercel** — push to GitHub, "Add New Project", pick this folder (Root Directory: `cinematic-vows-invitation` if inside a larger repo).
Framework: Vite, build `npm run build`, output `dist`. Or CLI: `npx vercel --prod`.

**Netlify** — build command `npm run build`, publish directory `dist`. Or `npx netlify deploy --prod --dir=dist`.
Optionally set `SITE_URL` in site environment variables.

**GitHub Pages** — the build uses relative paths (`base: './'`) and has no client router, so it works under a sub-path as-is.
Build with `SITE_URL=https://<user>.github.io/<repo> npm run build`, then publish `dist/` (e.g. `npx gh-pages -d dist`).

## The experience
1. **Sealed envelope** (`src/sections/EnvelopeScene.tsx`) — textured champagne envelope, wax seal ("PT"), SVG roses/jasmine, floating balloons, drifting petals.
2. **Opening ritual** (~4 s) — seal press → 3D flap rotation → card slides out → envelope falls away, card moves to the visitor → content reveals. "Skip intro" is always visible.
3. **Invitation card** (`src/components/InvitationCard.tsx`), then a film-burn cut into the tribute: honoree, photo album (tap a photo to enlarge), milestone title sequence, event details, venue, closing.
Reduced-motion, short landscape screens and low-memory phones get a lite path (no 3D animation or petals; the card simply fades in, scrollable).
Decorative art is hand-built SVG (`src/components/art/`), so there are no extra image downloads. Change the monogram, captions and button labels in `invitation.envelope`.

## Structure
```
public/images/{family,venue,backgrounds}  photos       public/music  audio
public/favicon                            icons + share preview
src/data/invitation.ts                    ALL content + asset paths
src/sections/                             EnvelopeScene, Honoree, Journey, Milestone, EventDetails, VenueGallery, Closing
src/components/                           InvitationCard, SafeImage, Lightbox, Reveal, Ordinal, SoundToggle, ScrollTop, FilmBurn, Overlays
src/components/art/                       Flowers, Balloon, Petals, WaxSeal, Ornament (SVG)
src/lib/                                  useSound (opt-in audio), useGeometry (envelope/card sizing)
src/styles/                               tokens.css (palette/fonts/paper texture), base.css, scenes.css
```
Fonts (Cormorant Garamond, Inter, Caveat) are bundled locally via Fontsource, with Georgia/system fallbacks.
`prefers-reduced-motion` is respected (grain, parallax and entrance motion are disabled/shortened).
