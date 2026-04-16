import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/verify/[credentialId] — public verification endpoint
export async function GET(req: NextRequest, { params }: { params: Promise<{ credentialId: string }> }) {
  try {
    const { credentialId } = await params
    const certificate = await prisma.digitalCertificate.findUnique({
      where: { credentialId },
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found', valid: false }, { status: 404 })
    }

    // Fetch institution name
    const institution = await prisma.user.findUnique({
      where: { id: certificate.universityId },
      select: { company: true, firstName: true, lastName: true },
    })

    // Fetch student name
    const student = await prisma.user.findUnique({
      where: { id: certificate.studentId },
      select: { firstName: true, lastName: true },
    })

    const isExpired = certificate.expiryDate ? new Date() > certificate.expiryDate : false
    const isRevoked = certificate.status === 'REVOKED'
    const isValid = !isExpired && !isRevoked && certificate.status === 'ISSUED'

    return NextResponse.json({
      valid: isValid,
      credentialId: certificate.credentialId,
      title: certificate.title,
      description: certificate.description,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate,
      status: isExpired ? 'EXPIRED' : certificate.status,
      revokedAt: certificate.revokedAt,
      revokedReason: certificate.revokedReason,
      institutionName: institution?.company || `${institution?.firstName || ''} ${institution?.lastName || ''}`.trim() || 'Istituto',
      studentName: student ? `${student.firstName || ''} ${student.lastName || ''}`.trim() : 'Studente',
    })
  } catch (error) {
    console.error('Verify credential GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
