/** Neutral placeholder if a menu image URL fails to load */
export const MENU_IMAGE_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#e7e5e4" width="800" height="600"/><text x="400" y="300" text-anchor="middle" dominant-baseline="middle" fill="#78716c" font-family="system-ui,sans-serif" font-size="16">Dish photo</text></svg>`
  );

export function handleMenuImageError(e) {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = MENU_IMAGE_FALLBACK;
}
