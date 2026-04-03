import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/totp/disable
 * Disable MFA. Requires password confirmation.
 * Body: { password: string }
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { success } = authLimiter.check(`totp-disable:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await req.json()
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true, totpEnabled: true },
    })

    if (!user?.totpEnabled) {
      return NextResponse.json({ error: 'MFA is not enabled' }, { status: 400 })
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Not available for social login accounts' }, { status: 400 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 })
    }

    // Disable TOTP
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totpEnabled: false,
        totpSecret: null,
        backupCodes: [],
        totpVerifiedAt: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('TOTP disable error:', error)
    return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 })
  }
}
