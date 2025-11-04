import { getRequestConfig } from 'next-intl/server'

export const locales = ['it', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

export default getRequestConfig(async ({ locale }) => {
  // Validate locale or use default
  const validLocale = (locale && locales.includes(locale as Locale)) ? locale as Locale : defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  }
})
