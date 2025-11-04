import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'

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
  title: 'InTransparency - AI-Powered Academic Showcase',
  description: 'Connect students and professionals through intelligent project matching and storytelling',
  keywords: ['academic projects', 'AI matching', 'student portfolio', 'professional networking'],
  authors: [{ name: 'InTransparency Team' }],
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#0891b2',
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InTransparency',
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
    </html>
  )
}