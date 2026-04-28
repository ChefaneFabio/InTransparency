import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GlowEffect } from '@/components/effects/GlowEffect'

// Distinctive display serif for headlines
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
})

// Clean but unique sans for body text
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  // Canonical domain is www.in-transparency.com (matches sitemap.ts + robots.ts).
  // Was previously https://intransparency.eu — that mismatch was causing
  // every page to ship a canonical tag pointing to a different domain than
  // the sitemap, contributing to "duplicate without canonical" in Search Console.
  metadataBase: new URL('https://www.in-transparency.com'),
  title: {
    default: 'InTransparency — Verified Student Profiles | University-to-Work Platform',
    template: '%s | InTransparency',
  },
  description: 'Hire verified graduates with institution-backed skills and evidence-based project portfolios. Browse free, contact 5 candidates/month at no cost, then €89/mo for unlimited. Built for Italian universities and ITS academies.',
  keywords: ['verified student profiles', 'university recruitment Italy', 'hire graduates Europe', 'graduate recruiting subscription', 'ITS Academy platform', 'Bologna Process grades', 'student portfolio', 'institutional verification'],
  authors: [{ name: 'InTransparency' }],
  creator: 'InTransparency',
  publisher: 'InTransparency',
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#0891b2',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '400x400' },
      { url: '/favicon.png', type: 'image/png', sizes: '400x400' },
    ],
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InTransparency',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'it_IT',
    url: 'https://www.in-transparency.com',
    siteName: 'InTransparency',
    title: 'InTransparency — Verified Student Profiles | University-to-Work Platform',
    description: 'Hire verified graduates with institution-backed skills and evidence-based project portfolios. Browse free + 5 contacts/month, then €89/mo for unlimited.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InTransparency — Verified Student Profiles',
    description: 'Hire verified graduates with institution-backed skills. 5 free contacts/month, then €89/mo for unlimited.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InTransparency" />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster />
            <GlowEffect />
          </Providers>
        </ErrorBoundary>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      ${process.env.NODE_ENV === 'development' ? "console.log('[SW] Registration successful with scope: ', registration.scope);" : ''}
                    })
                    .catch(function(err) {
                      ${process.env.NODE_ENV === 'development' ? "console.error('[SW] Registration failed: ', err);" : ''}
                    });
                });
              }
            `,
          }}
        />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {/* HubSpot tracking — portal 147782942 (EU region) */}
      <Script
        id="hs-script-loader"
        src="//js-eu1.hs-scripts.com/147782942.js"
        strategy="afterInteractive"
      />
    </html>
  )
}