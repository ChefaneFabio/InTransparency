import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/totp/setup
 * Generate a new TOTP secret and QR code for the user.
 * User must verify it with /api/auth/totp/verify before it's active.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { success } = authLimiter.check(`totp:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, totpEnabled: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.totpEnabled) {
      return NextResponse.json({ error: 'MFA is already enabled. Disable it first.' }, { status: 400 })
    }

    // Generate secret
    const secret = authenticator.generateSecret()

    // Store secret (not yet enabled — user must verify first)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { totpSecret: secret, totpEnabled: false },
    })

    // Generate QR code
    const otpauth = authenticator.keyuri(user.email, 'InTransparency', secret)
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth)

    return NextResponse.json({
      secret,
      qrCode: qrCodeDataUrl,
      otpauth,
    })
  } catch (error) {
    console.error('TOTP setup error:', error)
    return NextResponse.json({ error: 'Failed to setup MFA' }, { status: 500 })
  }
}
