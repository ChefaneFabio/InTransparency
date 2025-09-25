import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InTransparency - AI-Powered Academic Showcase',
  description: 'Connect students and professionals through intelligent project matching and storytelling',
  keywords: ['academic projects', 'AI matching', 'student portfolio', 'professional networking'],
  authors: [{ name: 'InTransparency Team' }],
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#0891b2',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InTransparency" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[SW] Registration successful with scope: ', registration.scope);
                    })
                    .catch(function(err) {
                      console.log('[SW] Registration failed: ', err);
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