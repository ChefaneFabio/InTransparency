import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { extractSignalsFromJob } from '@/lib/job-signals-extractor'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 30

/**
 * POST /api/ai/extract-signals-preview
 * Body: { title?, description?, responsibilities?, requirements?, niceToHave?, experience? }
 *
 * Returns the same ExtractedJobSignals shape the scoring engine uses, so the
 * recruiter can preview how we'll read their JD before they publish.
 * Rate-limited — called on debounce as the recruiter types.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = getClientIp(req)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    const signals = await extractSignalsFromJob({
      title: body.title ?? null,
      description: body.description ?? null,
      responsibilities: body.responsibilities ?? null,
      requirements: body.requirements ?? null,
      niceToHave: body.niceToHave ?? null,
      experience: body.experience ?? null,
    })

    return NextResponse.json({ signals })
  } catch (error) {
    console.error('POST /api/ai/extract-signals-preview error:', error)
    return NextResponse.json({ error: 'Failed to preview signals' }, { status: 500 })
  }
}
