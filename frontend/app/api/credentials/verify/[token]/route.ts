import { NextRequest, NextResponse } from 'next/server'
import { verifyByShareToken } from '@/lib/verifiable-credentials'

interface RouteContext {
  params: Promise<{ token: string }>
}

// GET /api/credentials/verify/[token] — public verification endpoint (no auth)
// Used by employers, Europass readers, or anyone with a share link.
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { token } = await ctx.params
  const result = await verifyByShareToken(token)
  if (!result) return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
  return NextResponse.json(result)
}
