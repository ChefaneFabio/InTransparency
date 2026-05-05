/**
 * Claim-account flow for bulk-imported users.
 *
 * Pattern mirrors lib/email-verification.ts: 32-byte random token, sha256
 * hashed before storage, looked up by hash. Reuses VerificationToken table
 * with an `identifier` prefix of `claim:` to avoid collisions with
 * email-verification tokens (which use the bare email as identifier).
 *
 * Tokens expire after 30 days — concierge imports often happen weeks
 * before the institution sends invites. The claim flow lets the user set
 * their first real password (replacing the random placeholder set by the
 * importer) and marks the account as both claimed and verified.
 */

import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

const TOKEN_EXPIRY_DAYS = 30
const IDENTIFIER_PREFIX = 'claim:'

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

function makeIdentifier(email: string): string {
  return `${IDENTIFIER_PREFIX}${email.toLowerCase()}`
}

export async function issueClaimToken(email: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expires = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  const identifier = makeIdentifier(email)

  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({
    data: { identifier, token: tokenHash, expires },
  })

  return rawToken
}

/**
 * Validate a claim token, set a new password, and consume the token.
 * Returns the user's email on success.
 */
export async function consumeClaimToken(
  rawToken: string,
  newPassword: string
): Promise<{
  ok: boolean
  reason?: 'invalid' | 'expired' | 'user_not_found'
  email?: string
}> {
  const tokenHash = hashToken(rawToken)

  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  })
  if (!record || !record.identifier.startsWith(IDENTIFIER_PREFIX)) {
    return { ok: false, reason: 'invalid' }
  }
  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { token: tokenHash } }).catch(() => {})
    return { ok: false, reason: 'expired' }
  }

  const email = record.identifier.slice(IDENTIFIER_PREFIX.length)
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { id: true, email: true },
  })
  if (!user) return { ok: false, reason: 'user_not_found' }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
      },
    }),
    prisma.verificationToken.deleteMany({ where: { token: tokenHash } }),
  ])

  return { ok: true, email: user.email }
}

/**
 * Inspect a claim token without consuming it — used by the claim page to
 * decide whether to render the password form or an error.
 */
export async function inspectClaimToken(rawToken: string): Promise<{
  ok: boolean
  reason?: 'invalid' | 'expired' | 'user_not_found'
  email?: string
  firstName?: string | null
}> {
  const tokenHash = hashToken(rawToken)
  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  })
  if (!record || !record.identifier.startsWith(IDENTIFIER_PREFIX)) {
    return { ok: false, reason: 'invalid' }
  }
  if (record.expires < new Date()) return { ok: false, reason: 'expired' }
  const email = record.identifier.slice(IDENTIFIER_PREFIX.length)
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { email: true, firstName: true },
  })
  if (!user) return { ok: false, reason: 'user_not_found' }
  return { ok: true, email: user.email, firstName: user.firstName }
}
