import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authLimiter, getClientIp } from '@/lib/rate-limit'
import { inspectClaimToken, consumeClaimToken } from '@/lib/claim-account'
import { checkPassword } from '@/lib/password-policy'

/**
 * GET /api/auth/claim?token=...
 * Inspect a claim token without consuming it. Returns user's email +
 * firstName so the claim page can prefill / personalise.
 *
 * POST /api/auth/claim
 * Consume the token + set the new password. Body: { token, password }.
 */

const postSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(12).max(128),
})

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  const result = await inspectClaimToken(token)
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 })
  }
  return NextResponse.json({ ok: true, email: result.email, firstName: result.firstName })
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { success } = authLimiter.check(`claim:${ip}`)
  if (!success) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  let body: z.infer<typeof postSchema>
  try {
    body = postSchema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const policy = await checkPassword(body.password)
  if (!policy.ok) {
    return NextResponse.json({ error: policy.reason ?? 'Password does not meet policy.' }, { status: 400 })
  }

  const result = await consumeClaimToken(body.token, body.password)
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 })
  }
  return NextResponse.json({ ok: true, email: result.email })
}
