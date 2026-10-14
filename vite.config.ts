import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { invitation } from './src/data/invitation';

/**
 * Fills the <head> share metadata from src/data/invitation.ts so text lives in
 * one place. Set SITE_URL (e.g. https://my-invite.vercel.app) at build time so
 * WhatsApp gets an absolute preview-image URL. On Vercel it is detected
 * automatically from VERCEL_PROJECT_PRODUCTION_URL.
 */
function shareMeta(): Plugin {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const site = (process.env.SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '');
  const { title, description, shareImage } = invitation.meta;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const map: Record<string, string> = {
    __TITLE__: esc(title),
    __DESCRIPTION__: esc(description),
    __URL__: site ? `${site}/` : '',
    __IMAGE__: `${site}${shareImage}`,
  };
  return {
    name: 'share-meta',
    transformIndexHtml: (html) => html.replace(/__(TITLE|DESCRIPTION|URL|IMAGE)__/g, (m) => map[m]),
  };
}

// base './' keeps asset paths relative, so the build works on Vercel, Netlify
// and GitHub Pages sub-paths without further configuration.
export default defineConfig({
  base: './',
  plugins: [react(), shareMeta()],
});
