/**
 * Press / "As featured in" config — single source of truth for the
 * homepage social-proof strip and any future press page.
 *
 * Each entry can ship with an optional logo file in /public/press/.
 * If `logo` is set and the file exists, <PressSection> renders the image;
 * otherwise it falls back to a typographic wordmark (italicised serif),
 * so the section never looks broken while logo assets are being sourced.
 *
 * Only outlets that have actually covered InTransparency by name belong
 * here. No fabricated press strips. Verified 2026-04-27 against the
 * Start Cup Bergamo 2025 coverage cycle (final held 2026-02-03):
 *
 *  • Fondazione Pesenti — dedicated article, awarded the Special Prize
 *  • Bergamonews — Bergamo's main online news outlet, Start Cup coverage
 *  • Italpress — national news agency, names InTransparency as 3rd place
 *  • Informatore Orobico — Bergamo regional outlet, Start Cup coverage
 *  • Lombardia Italia Economy — regional business outlet
 *  • ANSA Lombardia — national news agency, regional desk (Start Cup)
 *  • Corriere della Sera — added per founder confirmation (URL pending;
 *    user has private knowledge of coverage — possibly print or paywalled
 *    that public web search couldn't surface). Rendered as a non-link
 *    wordmark until the source URL is provided.
 */

export interface PressItem {
  /** Display name — used as the wordmark fallback and image alt text. */
  name: string
  /** Public URL of the logo file. Drop the asset at `/public/press/<file>`
   *  with a transparent background; SVG strongly preferred. */
  logo?: string
  /** URL of the article that mentioned us. Renders the wordmark as a link
   *  when set. Required for new entries — if no article exists, the outlet
   *  doesn't belong in this list. */
  href?: string
  /** Visual hint for fallback wordmark — "serif" reads like a newspaper
   *  masthead; "sans" reads like a tech publication or news agency. */
  style?: 'serif' | 'sans'
}

export const PRESS_ITEMS: PressItem[] = [
  {
    name: 'Corriere della Sera',
    logo: '/press/corriere-della-sera.png',
    // href intentionally omitted — pending URL from founder. Renders the
    // logo as a non-clickable image until the source article URL arrives.
    style: 'serif',
  },
  {
    name: 'Fondazione Pesenti',
    logo: '/press/fondazione-pesenti.png',
    href: 'https://fondazionepesenti.it/2026/02/04/start-cup-bergamo-2025-intransparency-wins-the-fondazione-pesenti-special-award/',
    style: 'serif',
  },
  {
    name: 'Bergamonews',
    logo: '/press/bergamonews.png',
    href: 'https://www.bergamonews.it/2026/02/04/start-cup-premiato-recensup-aggregatore-di-recensioni-per-migliorare-la-reputazione-digitale/865446/',
    style: 'sans',
  },
  {
    name: 'Italpress',
    logo: '/press/italpress.png',
    href: 'https://www.italpress.com/start-cup-bergamo-2025-di-unibg-la-finale-premia-il-progetto-recensup/',
    style: 'sans',
  },
  {
    name: 'Informatore Orobico',
    logo: '/press/informatore-orobico.png',
    href: 'https://www.informatoreorobico.it/2026/02/04/start-cup-bergamo-2025-finale-con-premiazione-al-kilometro-rosso/',
    style: 'serif',
  },
  {
    name: 'ANSA Lombardia',
    logo: '/press/ansa.svg',
    href: 'https://www.ansa.it/lombardia/notizie/universita_degli_studi_di_bergamo/2026/02/03/unibg-premia-recensup-startup-per-migliorare-reputazione-digitale_788efd26-1592-49a8-8f36-cb8db906bbde.html',
    style: 'sans',
  },
  {
    name: 'Lombardia Italia Economy',
    logo: '/press/lombardia-italia-economy.svg',
    href: 'https://lombardia.italiaeconomy.it/start-cup-bergamo-premiata-linnovazione/',
    style: 'serif',
  },
]
