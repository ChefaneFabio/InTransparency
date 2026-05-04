import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/totp'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { authLimiter, getClientIp } from '@/lib/rate-limit'
import { decryptSecret } from '@/lib/encryption'

/**
 * POST /api/auth/totp/verify
 * Verify a TOTP code to complete MFA setup.
 * Also generates backup codes.
 * Body: { code: string }
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { success } = authLimiter.check(`totp-verify:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totpSecret: true, totpEnabled: true },
    })

    if (!user?.totpSecret) {
      return NextResponse.json({ error: 'Run setup first' }, { status: 400 })
    }

    if (user.totpEnabled) {
      return NextResponse.json({ error: 'MFA is already enabled' }, { status: 400 })
    }

    // Verify the code against the (decrypted) stored secret
    const isValid = await verifyToken(code, decryptSecret(user.totpSecret))
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
    }

    // Generate 10 backup codes
    const plainBackupCodes: string[] = []
    const hashedBackupCodes: string[] = []
    for (let i = 0; i < 10; i++) {
      const backupCode = crypto.randomBytes(4).toString('hex') // 8-char hex codes
      plainBackupCodes.push(backupCode)
      hashedBackupCodes.push(await bcrypt.hash(backupCode, 10))
    }

    // Enable TOTP and store hashed backup codes
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totpEnabled: true,
        totpVerifiedAt: new Date(),
        backupCodes: hashedBackupCodes,
      },
    })

    return NextResponse.json({
      success: true,
      backupCodes: plainBackupCodes, // Show once, never again
    })
  } catch (error) {
    console.error('TOTP verify error:', error)
    return NextResponse.json({ error: 'Failed to verify MFA' }, { status: 500 })
  }
}
