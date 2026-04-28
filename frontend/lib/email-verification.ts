import crypto from 'crypto'
import prisma from '@/lib/prisma'

/**
 * Email verification helpers built on the existing VerificationToken model.
 *
 * Pattern: 32-byte random token, hashed with sha256 before storage. The
 * raw token is returned for embedding in the email link; the hash is
 * what we look up at verification time. This means a database breach
 * doesn't leak active tokens — same threat model as session tokens.
 *
 * Tokens expire after 24h. Existing tokens for the same identifier are
 * invalidated when a new one is issued (so resend flows don't leave
 * orphan tokens around).
 */

const TOKEN_EXPIRY_HOURS = 24

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

/**
 * Generate a verification token for the given email and store its hash.
 * Returns the RAW token (callers embed in the email link).
 */
export async function issueVerificationToken(email: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  // Invalidate any existing tokens for this email — only one active token at a time.
  await prisma.verificationToken.deleteMany({
    where: { identifier: email.toLowerCase() },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: email.toLowerCase(),
      token: tokenHash,
      expires,
    },
  })

  return rawToken
}

/**
 * Validate a verification token and mark the user's email as verified.
 * Returns the user's email if successful, null if token is invalid/expired/used.
 *
 * On success: token is consumed (deleted from DB) and User.emailVerified is true.
 */
export async function consumeVerificationToken(rawToken: string): Promise<{
  ok: boolean
  reason?: 'invalid' | 'expired' | 'user_not_found'
  email?: string
}> {
  const tokenHash = hashToken(rawToken)

  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  })

  if (!record) return { ok: false, reason: 'invalid' }

  if (record.expires < new Date()) {
    // Best-effort cleanup — don't block on it
    await prisma.verificationToken.deleteMany({ where: { token: tokenHash } }).catch(() => {})
    return { ok: false, reason: 'expired' }
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: record.identifier, mode: 'insensitive' } },
  })

  if (!user) return { ok: false, reason: 'user_not_found' }

  // Atomic: mark verified + delete token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { token: tokenHash } }),
  ])

  return { ok: true, email: user.email }
}
