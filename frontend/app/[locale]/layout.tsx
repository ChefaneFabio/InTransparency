import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales } from '@/i18n'

const BASE_URL = 'https://www.in-transparency.com'

/**
 * Default metadata cascade for the locale layout — every page under
 * /it/* and /en/* inherits these unless it sets its own generateMetadata.
 *
 * Why this exists: most marketing pages don't define their own metadata,
 * which means Next.js generates a canonical from the request URL but emits
 * NO hreflang. Google then sees /it/foo and /en/foo as separate competing
 * URLs (one of the "duplicate without canonical" causes flagged in
 * Search Console 2026-04-28). Setting alternates here ships hreflang in
 * the HTML head for every page; per-page overrides still win.
 *
 * Note: canonical is intentionally left to per-page metadata + Next.js
 * default. Setting it here would force it to "/" which is wrong for nested
 * routes.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      languages: {
        en: `${BASE_URL}/en`,
        it: `${BASE_URL}/it`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: locale === 'it' ? 'en_US' : 'it_IT',
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params to ensure proper handling
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Get messages for the specific locale
  const messages = await getMessages({ locale })

  // Dynamic import to avoid SSR issues with engagement components
  const { GlobalEngagement } = await import('@/components/engagement/GlobalEngagement')
  const { CookieConsentBanner } = await import('@/components/legal/CookieConsent')

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <GlobalEngagement />
      <CookieConsentBanner />
    </NextIntlClientProvider>
  )
}
