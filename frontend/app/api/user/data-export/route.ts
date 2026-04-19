import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { auditFromRequest } from '@/lib/audit'

/**
 * GET /api/user/data-export
 *
 * GDPR Art. 20 (right to data portability) — returns all personal data we hold
 * about the authenticated user in a machine-readable JSON format.
 *
 * Response is a single downloadable JSON file. Includes:
 *   - Profile + settings
 *   - Projects, endorsements, stages, exchanges
 *   - Skill graph, self-discovery profile
 *   - Notifications, applications, matches, credentials
 *   - Hiring confirmations
 *
 * Does NOT include: other users' data (even if they endorsed you, only the
 * public parts of their name/title are included — their private info stays
 * private).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  // Audit trail — Art. 5(2) accountability
  auditFromRequest(req, {
    actorId: userId,
    actorEmail: session.user.email ?? null,
    action: 'EXPORT_USER_DATA',
    targetType: 'User',
    targetId: userId,
  })

  const [
    user,
    projects,
    endorsements,
    stages,
    exchanges,
    skillDeltas,
    selfDiscovery,
    notifications,
    applications,
    matches,
    credentials,
    hiringConfirmations,
    companyFollows,
    universityConnections,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.project.findMany({ where: { userId } }),
    prisma.professorEndorsement.findMany({ where: { studentId: userId } }),
    prisma.stageExperience.findMany({ where: { studentId: userId } }),
    prisma.exchangeEnrollment.findMany({ where: { studentId: userId } }),
    prisma.skillDelta.findMany({ where: { studentId: userId } }),
    prisma.selfDiscoveryProfile.findUnique({ where: { studentId: userId } }),
    prisma.notification.findMany({ where: { userId } }),
    prisma.application.findMany({ where: { applicantId: userId } }).catch(() => []),
    prisma.matchExplanation.findMany({ where: { subjectId: userId } }),
    prisma.verifiableCredential.findMany({ where: { subjectId: userId } }),
    prisma.hiringConfirmation.findMany({ where: { studentId: userId } }),
    prisma.companyFollow.findMany({ where: { userId } }),
    prisma.universityConnection.findMany({ where: { userId } }).catch(() => []),
  ])

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Strip passwordHash before exporting
  const { passwordHash: _unused, ...safeUser } = user as any

  const payload = {
    '@generatedAt': new Date().toISOString(),
    '@spec': 'GDPR Art. 20 data export',
    '@subjectId': userId,
    profile: safeUser,
    projects,
    endorsements,
    stages,
    exchanges,
    skillGraph: skillDeltas,
    selfDiscovery,
    notifications,
    applications,
    matches,
    credentials: credentials.map(c => ({
      ...c,
      // Don't leak the proof signature — it's verifiable via public key
      proofValue: '[redacted — verify via /api/credentials/public-key]',
    })),
    hiringConfirmations,
    companyFollows,
    universityConnections,
  }

  const json = JSON.stringify(payload, null, 2)
  return new NextResponse(json, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="intransparency-data-export-${userId}.json"`,
    },
  })
}
