import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'
import { getToken } from 'next-auth/jwt'

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Always use /it/ or /en/ prefix for clarity
})

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/projects/new',
  '/projects/edit',
  '/messages',
  '/settings',
  '/subscription',
]

// Routes that require specific roles
const roleProtectedRoutes = {
  student: ['/projects/new', '/projects/edit'],
  recruiter: ['/search', '/candidates'],
  university: ['/admin', '/students/manage'],
  admin: ['/admin'],
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip intl middleware for static files and public assets
  const isStaticFile =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)$/)

  // Check authentication for protected routes (remove locale prefix for checking)
  const pathnameWithoutLocale = pathname.replace(/^\/(it|en)/, '') || '/'
  const isProtectedRoute = protectedRoutes.some(route =>
    pathnameWithoutLocale.startsWith(route)
  )

  // Get the user's session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
  })

  // Detect locale from pathname
  const localeMatch = pathname.match(/^\/(it|en)/)
  const detectedLocale = localeMatch ? localeMatch[1] : 'en'

  // Redirect to signin if accessing protected route without authentication
  if (isProtectedRoute && !token) {
    const signInUrl = new URL(`/${detectedLocale}/auth/signin`, request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based access
  if (token) {
    const userRole = token.role as string

    for (const [role, routes] of Object.entries(roleProtectedRoutes)) {
      const requiresRole = routes.some(route => pathnameWithoutLocale.startsWith(route))

      if (requiresRole && userRole !== role.toUpperCase() && userRole !== 'ADMIN') {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL(`/${detectedLocale}/unauthorized`, request.url))
      }
    }
  }

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
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Block search engines from indexing non-canonical hosts (Vercel preview
  // deploys, branch deploys, vercel.app subdomains). Without this, every
  // preview URL serves the same content as the production domain — Google
  // sees the production page mirrored across N preview URLs and starts
  // flagging duplicate content. (Search Console flagged this 2026-04-28.)
  const host = request.headers.get('host') || ''
  const isCanonicalHost = host === 'www.in-transparency.com' || host === 'in-transparency.com'
  const isProductionEnv = process.env.VERCEL_ENV === 'production'
  if (!isCanonicalHost || !isProductionEnv) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Handle CSP for different environments
  const isDev = process.env.NODE_ENV === 'development'
  const isVercel = process.env.VERCEL === '1'

  if (!isDev) {
    // Production CSP - includes Google Maps support
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.net https://*.hsforms.com https://*.hsleadflows.net https://*.hscollectedforms.net https://*.hsappstatic.net https://*.hubspotusercontent.com https://*.hubspotusercontent-eu1.net https://*.hubspot.com",
      "script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.net https://*.hsforms.com https://*.hsleadflows.net https://*.hscollectedforms.net https://*.hsappstatic.net https://*.hubspotusercontent.com https://*.hubspotusercontent-eu1.net https://*.hubspot.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://*.vercel.app https://maps.googleapis.com https://*.gstatic.com https://*.r2.cloudflarestorage.com https://*.r2.dev https://*.hubspot.com https://track.hubspot.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app https://api-intransparency.onrender.com https://maps.googleapis.com https://*.gstatic.com https://*.r2.cloudflarestorage.com https://*.r2.dev https://*.hubspot.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.com https://*.hsforms.net https://*.hsleadflows.net https://*.hscollectedforms.net https://*.hsappstatic.net https://*.hubspotusercontent.com https://*.hubspotusercontent-eu1.net https://api-eu1.hubapi.com https://forms-eu1.hubspot.com https://track-eu1.hubspot.com",
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