import { NextResponse } from 'next/server'
import { buildServiceProviderMetadata } from '@/lib/spid'

/**
 * GET /api/auth/spid/metadata
 *
 * Publishes our SAML 2.0 Service Provider metadata — consumed by SPID IdPs
 * and by AgID during the accreditation review.
 *
 * Must be publicly accessible without auth. Signed with the same certificate
 * registered with AgID (see lib/spid.ts once full implementation is wired).
 */
export async function GET() {
  const xml = buildServiceProviderMetadata()
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
