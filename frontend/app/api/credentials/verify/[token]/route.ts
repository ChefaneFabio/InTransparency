import { NextRequest, NextResponse } from 'next/server'
import { verifyByShareToken } from '@/lib/verifiable-credentials'
import { credentialVerifyLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ token: string }>
}

// GET /api/credentials/verify/[token] — public verification endpoint (no auth)
// Used by employers, Europass readers, or anyone with a share link.
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(credentialVerifyLimiter, req)
  if (limited) return limited

  const { token } = await ctx.params
  const result = await verifyByShareToken(token)
  if (!result) return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
  return NextResponse.json(result)
}
