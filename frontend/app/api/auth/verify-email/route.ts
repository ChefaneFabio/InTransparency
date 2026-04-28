import { NextRequest, NextResponse } from 'next/server'
import { consumeVerificationToken } from '@/lib/email-verification'

/**
 * GET /api/auth/verify-email?token=...
 *
 * Validates the email verification token, marks User.emailVerified=true,
 * and returns a JSON status. Called by /auth/verify-email page after the
 * user clicks the link in their inbox.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ ok: false, reason: 'missing_token' }, { status: 400 })
  }

  const result = await consumeVerificationToken(token)
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json({ ok: true, email: result.email })
}
