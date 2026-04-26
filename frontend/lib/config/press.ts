/**
 * Press / "As featured in" config — single source of truth for the
 * homepage social-proof strip and any future press page.
 *
 * Each entry can ship with an optional logo file in /public/press/.
 * If `logo` is set and the file exists, <PressSection> renders the image;
 * otherwise it falls back to a typographic wordmark (italicised serif),
 * so the section never looks broken while logo assets are being sourced.
 */

export interface PressItem {
  /** Display name — used as the wordmark fallback and image alt text. */
  name: string
  /** Public URL of the logo file. Drop the asset at `/public/press/<file>`
   *  with a transparent background; SVG strongly preferred. */
  logo?: string
  /** Optional URL to the article that mentioned us. Renders the wordmark
   *  as a link when set. */
  href?: string
  /** Visual hint for fallback wordmark — "serif" reads like a newspaper
   *  masthead; "sans" reads like a tech publication. */
  style?: 'serif' | 'sans'
}

export const PRESS_ITEMS: PressItem[] = [
  {
    name: 'Corriere della Sera',
    logo: '/press/corriere-della-sera.svg',
    style: 'serif',
  },
  {
    name: 'Eco di Bergamo',
    logo: '/press/eco-di-bergamo.svg',
    style: 'serif',
  },
]
