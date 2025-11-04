import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Always use /it/ or /en/ prefix for clarity
})

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip intl middleware for static files and public assets
  const isStaticFile =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)$/)

  let response: NextResponse

  if (isStaticFile) {
    // For static files, just pass through
    response = NextResponse.next()

    // Fix MIME type for JavaScript files
    if (pathname.endsWith('.js')) {
      response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
    }
  } else {
    // For all other requests, apply next-intl locale detection
    response = intlMiddleware(request)
  }

  // Security headers for all requests
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Handle CSP for different environments
  const isDev = process.env.NODE_ENV === 'development'
  const isVercel = process.env.VERCEL === '1'

  if (!isDev) {
    // Production CSP - includes Google Maps support
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://*.vercel.app https://maps.googleapis.com https://*.gstatic.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app https://intransparency-api.onrender.com https://maps.googleapis.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self' blob:",
      "child-src 'self' blob:"
    ].join('; ')

    response.headers.set('Content-Security-Policy', csp)
  }

  // Handle prefetch requests
  if (request.headers.get('purpose') === 'prefetch') {
    response.headers.set('Cache-Control', 'public, max-age=3600')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (static files, images)
     * - Public files (.png, .jpg, .ico, .svg, etc.)
     */
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ],
}