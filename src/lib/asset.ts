/** Resolve a /public path so it works on any base path (GitHub Pages, etc.). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');
