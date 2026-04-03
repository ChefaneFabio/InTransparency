import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { authenticator } from 'otplib'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/totp/validate
 * Validate a TOTP code or backup code during login.
 * Called after credentials are verified but before session is granted.
 * Body: { userId: string, code: string }
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { success } = authLimiter.check(`totp-login:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Please wait.' }, { status: 429 })
    }

    const { userId, code } = await req.json()
    if (!userId || !code) {
      return NextResponse.json({ error: 'userId and code required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totpSecret: true, totpEnabled: true, backupCodes: true },
    })

    if (!user?.totpEnabled || !user.totpSecret) {
      return NextResponse.json({ error: 'MFA not enabled' }, { status: 400 })
    }

    // Try TOTP code first
    const isValidTotp = authenticator.verify({ token: code, secret: user.totpSecret })
    if (isValidTotp) {
      return NextResponse.json({ success: true })
    }

    // Try backup codes
    for (let i = 0; i < user.backupCodes.length; i++) {
      const isMatch = await bcrypt.compare(code, user.backupCodes[i])
      if (isMatch) {
        // Remove used backup code
        const updatedCodes = [...user.backupCodes]
        updatedCodes.splice(i, 1)
        await prisma.user.update({
          where: { id: userId },
          data: { backupCodes: updatedCodes },
        })
        return NextResponse.json({ success: true, backupCodeUsed: true, remainingCodes: updatedCodes.length })
      }
    }

    return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
  } catch (error) {
    console.error('TOTP validate error:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
