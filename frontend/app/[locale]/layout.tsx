import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

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

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <GlobalEngagement />
    </NextIntlClientProvider>
  )
}
