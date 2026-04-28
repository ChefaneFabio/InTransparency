import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { issueVerificationToken } from '@/lib/email-verification'
import { sendAccountVerificationEmail } from '@/lib/email'

/**
 * POST /api/auth/resend-verification
 *
 * Issues a fresh verification token (invalidating any prior one) and
 * re-sends the verification email. Auth required so we can't be used
 * to spam arbitrary inboxes. The "Verify your email" dashboard banner
 * calls this when the user clicks "Resend".
 *
 * Locale of the email is taken from the optional ?locale=it|en query
 * param so the resent email matches the dashboard the user was viewing.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, reason: 'unauthenticated' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { email: true, firstName: true, emailVerified: true },
  })
  if (!user) {
    return NextResponse.json({ ok: false, reason: 'user_not_found' }, { status: 404 })
  }
  if (user.emailVerified) {
    return NextResponse.json({ ok: false, reason: 'already_verified' }, { status: 400 })
  }

  const locale = request.nextUrl.searchParams.get('locale') === 'it' ? 'it' : 'en'

  try {
    const rawToken = await issueVerificationToken(user.email)
    await sendAccountVerificationEmail(user.email, rawToken, user.firstName || '', locale)
  } catch (err) {
    console.error('[resend-verification] dispatch failed:', err)
    return NextResponse.json({ ok: false, reason: 'send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
