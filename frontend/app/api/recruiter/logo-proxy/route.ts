import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/recruiter/logo-proxy?domain=brembo.it
 *
 * Server-side proxy for company logos. Solves three problems at once:
 *   1. CSP — the browser's connect-src would block direct Clearbit calls
 *      from the page (the service worker intercepts <img> requests too).
 *   2. Privacy — fetching the logo client-side leaks the recruiter's email
 *      domain to Clearbit on every keystroke. Server-side keeps the lookup
 *      out of the user's browser.
 *   3. Reliability — when Clearbit doesn't have the logo, a direct call
 *      times out and surfaces as a 408 error in the page console. Here we
 *      fall back to Google's S2 favicons service (always returns something)
 *      and cache the result so misses don't keep timing out.
 *
 * Returns the image bytes with a long Cache-Control so subsequent loads are
 * served from CDN/disk cache for free.
 */

const FETCH_TIMEOUT_MS = 4000
const PRIMARY = (d: string) => `https://logo.clearbit.com/${d}`
const FALLBACK = (d: string) => `https://www.google.com/s2/favicons?domain=${d}&sz=128`

function isValidDomain(d: string): boolean {
  // Looser than RFC, tighter than free-for-all. Lowercase letters, digits,
  // dots, hyphens. At least one dot. No path.
  return /^[a-z0-9](?:[a-z0-9-.]*[a-z0-9])?$/i.test(d) && d.includes('.')
}

async function tryFetch(url: string): Promise<Response | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      // Don't pass through identifying headers
      headers: { 'User-Agent': 'InTransparency-LogoProxy/1.0' },
    })
    if (!res.ok) return null
    return res
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = (searchParams.get('domain') || '').trim().toLowerCase()

  if (!isValidDomain(domain)) {
    return new NextResponse('Invalid domain', { status: 400 })
  }

  // Try Clearbit first (best-quality logos), fall back to Google favicons
  let upstream = await tryFetch(PRIMARY(domain))
  if (!upstream) upstream = await tryFetch(FALLBACK(domain))

  if (!upstream) {
    // Both failed — return a 1x1 transparent PNG so the <img> doesn't broken-icon
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    )
    return new NextResponse(transparentPng, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  const buf = await upstream.arrayBuffer()
  const contentType = upstream.headers.get('content-type') || 'image/png'
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // 24h browser cache + 7d CDN cache — logos rarely change
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
    },
  })
}
