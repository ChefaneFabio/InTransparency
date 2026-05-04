import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { generateTotpSecret, buildOtpauthUrl, verifyTotp, generateBackupCodes } from '@/lib/totp'
import { authLimiter, enforceRateLimit } from '@/lib/rate-limit'
import { encryptSecret, decryptSecret } from '@/lib/encryption'

/**
 * POST /api/user/2fa/setup
 * Initializes 2FA: generates a secret, returns the otpauth URL.
 * User then confirms enrollment by POSTing a valid code to /activate.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(authLimiter, req)
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const secret = generateTotpSecret()
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: encryptSecret(secret), totpEnabled: false, totpEnrolledAt: null },
  })

  const otpauthUrl = buildOtpauthUrl({
    issuer: 'InTransparency',
    accountName: session.user.email ?? session.user.id,
    secret,
  })

  return NextResponse.json({
    secret, // Shown once; user should scan the QR or type it
    otpauthUrl, // For QR code generation client-side
  })
}

/**
 * POST /api/user/2fa/activate
 * Confirms enrollment by verifying a fresh TOTP code.
 * Returns backup codes (shown once).
 */
export async function PATCH(req: NextRequest) {
  const limited = enforceRateLimit(authLimiter, req)
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.totpSecret) return NextResponse.json({ error: '2FA setup not started' }, { status: 400 })

  if (!verifyTotp(decryptSecret(user.totpSecret), code)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  const { clear, hashes } = generateBackupCodes()
  const hashedBackup = await hashes

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      totpEnabled: true,
      totpEnrolledAt: new Date(),
      totpBackupCodes: hashedBackup,
    },
  })

  return NextResponse.json({
    success: true,
    backupCodes: clear, // one-time display
    message: 'Save these backup codes — each works once if you lose your authenticator.',
  })
}

/**
 * DELETE /api/user/2fa/setup
 * Disable 2FA. Requires a valid current TOTP code.
 */
export async function DELETE(req: NextRequest) {
  const limited = enforceRateLimit(authLimiter, req)
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json().catch(() => ({}))
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.totpEnabled || !user.totpSecret) {
    return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 })
  }

  if (!code || !verifyTotp(decryptSecret(user.totpSecret), code)) {
    return NextResponse.json({ error: 'Invalid code — cannot disable without proof' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      totpEnabled: false,
      totpSecret: null,
      totpEnrolledAt: null,
      totpBackupCodes: [],
    },
  })
  return NextResponse.json({ success: true })
}
