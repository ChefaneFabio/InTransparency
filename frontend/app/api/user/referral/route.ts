import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/user/referral
 * Returns the user's referral code + stats on who signed up through it.
 * Code is auto-assigned on user creation (schema default = cuid()).
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, referralCount: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const referred = await prisma.user.findMany({
    where: { referredBy: user.referralCode },
    select: { id: true, createdAt: true, role: true, firstName: true, lastName: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({
    code: user.referralCode,
    count: referred.length,
    shareUrl: `/auth/signup?ref=${user.referralCode}`,
    referred: referred.map(r => ({
      id: r.id,
      role: r.role,
      name: [r.firstName, r.lastName].filter(Boolean).join(' ') || 'Anonymous',
      signedUpAt: r.createdAt.toISOString(),
    })),
  })
}
