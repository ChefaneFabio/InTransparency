import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/change-password
 * Change the current user's password.
 * Body: { currentPassword, newPassword }
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting — 5 attempts per 15 minutes
    const ip = getClientIp(req)
    const { success } = authLimiter.check(`pw:${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    // Fetch user with password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    })

    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: 'Password change not available for social login accounts' },
        { status: 400 }
      )
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 })
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
