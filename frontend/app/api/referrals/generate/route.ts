import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/referrals/generate - Generate referral link for cross-selling
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { referralType, programId } = body

    if (!referralType || !programId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine segment from user role
    const segment = user.role === 'STUDENT' ? 'student' :
                   user.role === 'RECRUITER' ? 'company' :
                   user.role === 'UNIVERSITY' ? 'institution' : 'student'

    // Generate unique referral code
    const code = `INTRANS-${segment.substring(0, 3).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    // Store referral code in analytics (can be moved to separate table if needed)
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'referral_link_generated',
        properties: {
          code,
          referralType,
          programId,
          segment
        }
      }
    })

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/ref/${code}/${programId}`

    return NextResponse.json({
      code,
      link,
      referralType,
      programId
    })
  } catch (error) {
    console.error('Error generating referral link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
