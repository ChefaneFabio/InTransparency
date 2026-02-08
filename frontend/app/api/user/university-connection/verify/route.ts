import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/user/university-connection/verify?token=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing verification token' }, { status: 400 })
    }

    const connection = await prisma.universityConnection.findUnique({
      where: { verificationToken: token },
    })

    if (!connection) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 404 })
    }

    if (connection.verificationStatus === 'VERIFIED') {
      // Already verified, redirect to success
      return NextResponse.redirect(new URL('/dashboard/student?verified=true', req.url))
    }

    // Check if token expired (24 hours)
    if (connection.verificationSentAt) {
      const expiresAt = new Date(connection.verificationSentAt.getTime() + 24 * 60 * 60 * 1000)
      if (new Date() > expiresAt) {
        await prisma.universityConnection.update({
          where: { id: connection.id },
          data: { verificationStatus: 'EXPIRED' },
        })
        return NextResponse.json({ error: 'Verification link has expired' }, { status: 410 })
      }
    }

    // Verify the connection
    await prisma.universityConnection.update({
      where: { id: connection.id },
      data: {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        verificationToken: null,
      },
    })

    // Update user's emailVerified flag
    await prisma.user.update({
      where: { id: connection.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    })

    // Redirect to dashboard with success message
    return NextResponse.redirect(new URL('/dashboard/student?verified=true', req.url))
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
