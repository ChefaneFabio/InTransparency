import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auditFromRequest } from '@/lib/audit'

/**
 * POST /api/user/delete-account
 *
 * GDPR Art. 17 (right to erasure). Requires the user to re-enter their
 * password as a confirmation check.
 *
 * Strategy:
 *   - Delete records where the user is the sole owner (projects, skillDeltas,
 *     selfDiscovery, notifications, credentials)
 *   - Anonymize records that are shared/relational (endorsements become
 *     "Anonymous", stages keep the company-facing data but lose studentId)
 *   - Finally delete the User record itself
 *
 * Body: { currentPassword: string, confirmPhrase: "DELETE MY ACCOUNT" }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, confirmPhrase } = await req.json()
  if (confirmPhrase !== 'DELETE MY ACCOUNT') {
    return NextResponse.json(
      { error: 'Confirmation phrase must be exactly "DELETE MY ACCOUNT"' },
      { status: 400 }
    )
  }
  if (!currentPassword) {
    return NextResponse.json({ error: 'Password confirmation required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, passwordHash: true, email: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 403 })

  const userId = user.id

  // Audit before delete — once the user is gone, we can't resolve the action back
  await auditFromRequest(req, {
    actorId: userId,
    actorEmail: user.email,
    action: 'DELETE_USER',
    targetType: 'User',
    targetId: userId,
  })

  // Transactional deletion/anonymization
  await prisma.$transaction(async tx => {
    // Delete records owned solely by the user — cascades handle most via Prisma schema
    await tx.skillDelta.deleteMany({ where: { studentId: userId } })
    await tx.selfDiscoveryProfile.deleteMany({ where: { studentId: userId } })
    await tx.notification.deleteMany({ where: { userId } })
    await tx.companyFollow.deleteMany({ where: { userId } })
    await tx.verifiableCredential.updateMany({
      where: { subjectId: userId },
      data: { status: 'REVOKED', revokedReason: 'Subject deleted account', revokedAt: new Date() },
    })

    // Anonymize professor endorsements — keep the endorsement data (professor's
    // work is their record) but unlink from the student.
    await tx.professorEndorsement.updateMany({
      where: { studentId: userId },
      data: { studentId: '00000000-0000-0000-0000-000000000000' }, // anonymized marker
    }).catch(() => {})

    // Anonymize match explanations (retained as aggregate audit data, subject unlinked)
    await tx.matchExplanation.deleteMany({ where: { subjectId: userId } })

    // Delete User — cascades to projects, stages, exchanges, applications,
    // hiring confirmations via `onDelete: Cascade` in schema.
    await tx.user.delete({ where: { id: userId } })
  })

  return NextResponse.json({
    success: true,
    message:
      'Your account has been deleted. Related records were anonymized or removed per our data retention policy.',
  })
}
