import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { auditFromRequest } from '@/lib/audit'

/**
 * GET /api/user/export
 *
 * GDPR Art. 20 (right to data portability). Returns a JSON dump of every
 * record we hold about the caller, in a structured, machine-readable format.
 *
 * Strategy: a "wide" select per relation, no JOINs that leak third-party
 * data. Each section is its own array; the caller can re-import or hand
 * the file to another platform.
 *
 * The export is audited (action = EXPORT_USER_DATA) so we have a record
 * that the export was issued — required by Art. 30 (records of processing).
 *
 * Response is downloaded as `intransparency-export-{date}.json`.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, username: true,
      firstName: true, lastName: true, role: true,
      bio: true, tagline: true, photo: true,
      country: true, location: true,
      university: true, degree: true, graduationYear: true,
      skills: true, interests: true,
      profilePublic: true,
      jobSearchStatus: true,
      subscriptionTier: true, subscriptionStatus: true, premiumUntil: true,
      emailVerified: true, createdAt: true, updatedAt: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Pull every relation in parallel — bounded queries, no third-party data
  // (e.g. messages include only the caller's own messages, not the recipient's).
  const [
    projects, applications, messages, savedJobs, certifications, languages,
    endorsements, notifications, contactUsage, analytics, matchExplanations,
    selfDiscovery, credentials, organizations, institutionStaffRoles,
  ] = await Promise.all([
    prisma.project.findMany({ where: { userId } }),
    prisma.application.findMany({ where: { applicantId: userId } }),
    prisma.message.findMany({ where: { OR: [{ senderId: userId }, { recipientId: userId }] } }),
    prisma.savedJob.findMany({ where: { userId } }),
    prisma.certification.findMany({ where: { userId } }),
    prisma.languageProficiency.findMany({ where: { userId } }),
    prisma.professorEndorsement.findMany({ where: { studentId: userId } }),
    prisma.notification.findMany({ where: { userId } }),
    prisma.contactUsage.findMany({ where: { OR: [{ recruiterId: userId }, { recipientId: userId }] } }),
    prisma.analytics.findMany({ where: { userId } }),
    prisma.matchExplanation.findMany({ where: { OR: [{ subjectId: userId }, { counterpartyId: userId }] } }),
    prisma.selfDiscoveryProfile.findMany({ where: { studentId: userId } }),
    prisma.verifiableCredential.findMany({ where: { subjectId: userId } }),
    prisma.organization.findMany({ where: { ownerId: userId } }),
    prisma.institutionStaff.findMany({ where: { userId }, include: { institution: { select: { id: true, name: true, slug: true } } } }),
  ])

  // Best-effort audit — never block the export on audit failure.
  await auditFromRequest(req, {
    actorId: userId,
    actorEmail: user.email,
    action: 'EXPORT_USER_DATA',
    targetType: 'User',
    targetId: userId,
  }).catch(err => console.error('[export] audit failed:', err))

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: '1.0',
    notice:
      'This export contains every record InTransparency holds about you (GDPR Art. 20). ' +
      'Re-import is not currently supported. Hand this file to another platform or ' +
      'archive it locally.',
    user,
    projects,
    applications,
    messages,
    savedJobs,
    certifications,
    languages,
    endorsements,
    notifications,
    contactUsage,
    analytics,
    matchExplanations,
    selfDiscovery,
    credentials,
    organizations,
    institutionStaffRoles,
  }

  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="intransparency-export-${date}.json"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
