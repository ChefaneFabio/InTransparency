import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { buildEuropassProfile } from '@/lib/europass'

/**
 * GET /api/student/europass
 * Returns the current student's Europass JSON-LD profile for download or
 * direct import into the EU Digital Wallet.
 *
 * Query params:
 *  - format: "json" (default) | "json-ld"
 *  - download: "1" to set attachment headers
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const download = searchParams.get('download') === '1'

  const profile = await buildEuropassProfile(session.user.id)
  if (!profile) {
    return NextResponse.json({ error: 'No profile data to export' }, { status: 404 })
  }

  const body = JSON.stringify(profile, null, 2)
  const headers: Record<string, string> = {
    'Content-Type': 'application/ld+json; charset=utf-8',
  }
  if (download) {
    headers['Content-Disposition'] = `attachment; filename="europass-${session.user.id}.jsonld"`
  }
  return new NextResponse(body, { headers })
}
