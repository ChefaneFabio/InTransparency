import { getRequestConfig } from 'next-intl/server'

export const locales = ['it', 'en'] as const
export type Locale = (typeof locales)[number]

// Static fallback for non-request contexts (i18n.ts validate, etc.).
// At request time the middleware picks the locale from IP geo
// (Italy → it, everywhere else → en) before this is consulted.
export const defaultLocale: Locale = 'en'

export default getRequestConfig(async ({ locale }) => {
  // Validate locale or use default
  const validLocale = (locale && locales.includes(locale as Locale)) ? locale as Locale : defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  }
})
