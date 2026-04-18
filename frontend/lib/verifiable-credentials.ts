/**
 * Verifiable Credentials (VC) — W3C VC + EU EDC-compatible
 *
 * Issues signed credentials that live in our DB (authoritative) and can be
 * exported to the EU Digital Wallet, shared via public URL with a share token,
 * or revoked centrally.
 *
 * V1 uses a simple HMAC-SHA256 proof keyed on VC_SIGNING_SECRET. V2 will
 * upgrade to Ed25519 DID-based signing (EU EDC spec compliant).
 */

import prisma from './prisma'
import crypto from 'crypto'
import type { Prisma } from '@prisma/client'

const VC_CONTEXT = 'https://www.w3.org/2018/credentials/v1'

function getSigningSecret(): string {
  const secret = process.env.VC_SIGNING_SECRET
  if (!secret) {
    // Fallback for dev — warn but don't crash
    console.warn('VC_SIGNING_SECRET not set; using deterministic dev key (do not use in production)')
    return 'dev-vc-signing-secret-do-not-use-in-production'
  }
  return secret
}

/**
 * Compute HMAC proof over a canonical string representation of the credential.
 */
function computeProof(payload: object, created: Date): string {
  const canonical = JSON.stringify(payload) + '|' + created.toISOString()
  return crypto.createHmac('sha256', getSigningSecret()).update(canonical).digest('hex')
}

/**
 * Verify a credential's HMAC proof. Returns true if the proof matches.
 */
export function verifyProof(payload: object, created: Date, proofValue: string): boolean {
  const expected = computeProof(payload, created)
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(proofValue, 'hex'))
}

function generateShareToken(): string {
  return crypto.randomBytes(16).toString('base64url')
}

/**
 * Issue a VC for a ProfessorEndorsement that has been verified by the professor.
 * Idempotent: if a VC already exists for this endorsement, returns it.
 */
export async function issueEndorsementCredential(endorsementId: string) {
  const endorsement = await prisma.professorEndorsement.findUnique({
    where: { id: endorsementId },
    include: {
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
      project: { select: { title: true } },
    },
  })
  if (!endorsement) throw new Error('Endorsement not found')
  if (endorsement.status !== 'VERIFIED') throw new Error('Endorsement not yet verified by professor')

  const existing = await prisma.verifiableCredential.findFirst({
    where: { sourceType: 'ProfessorEndorsement', sourceId: endorsementId, status: 'ISSUED' },
  })
  if (existing) return existing

  const payload = {
    '@context': [VC_CONTEXT, 'https://europa.eu/europass/vc/context.json'],
    type: ['VerifiableCredential', 'ProfessorEndorsement'],
    credentialSubject: {
      id: endorsement.studentId,
      name: [endorsement.student.firstName, endorsement.student.lastName].filter(Boolean).join(' '),
      endorsement: {
        professorName: endorsement.professorName,
        professorTitle: endorsement.professorTitle,
        university: endorsement.university,
        course: endorsement.courseName,
        project: endorsement.project.title,
        skills: endorsement.skills,
        rating: endorsement.rating,
        competencyRatings: endorsement.competencyRatings,
        endorsementText: endorsement.endorsementText,
      },
    },
  }

  const created = new Date()
  const proofValue = computeProof(payload, created)
  const shareToken = generateShareToken()

  return prisma.verifiableCredential.create({
    data: {
      subjectId: endorsement.studentId,
      subjectName: payload.credentialSubject.name,
      issuerType: 'PROFESSOR',
      issuerId: endorsement.professorEmail,
      issuerName: `${endorsement.professorName}, ${endorsement.university}`,
      credentialType: 'SKILL_ENDORSEMENT',
      payload: payload as unknown as Prisma.InputJsonValue,
      sourceType: 'ProfessorEndorsement',
      sourceId: endorsementId,
      proofType: 'HmacSha256-2025', // interim; will upgrade to Ed25519Signature2020
      proofCreated: created,
      proofValue,
      verificationMethod: `intransparency:signing-key:v1`,
      shareToken,
      status: 'ISSUED',
    },
  })
}

/**
 * Issue a stage-completion VC from an evaluated StageExperience.
 */
export async function issueStageCompletionCredential(stageId: string) {
  const stage = await prisma.stageExperience.findUnique({
    where: { id: stageId },
    include: { student: { select: { id: true, firstName: true, lastName: true } } },
  })
  if (!stage) throw new Error('Stage not found')
  if (!stage.supervisorCompleted) throw new Error('Stage not yet evaluated')

  const existing = await prisma.verifiableCredential.findFirst({
    where: { sourceType: 'StageExperience', sourceId: stageId, status: 'ISSUED' },
  })
  if (existing) return existing

  const payload = {
    '@context': [VC_CONTEXT, 'https://europa.eu/europass/vc/context.json'],
    type: ['VerifiableCredential', 'StageCompletion'],
    credentialSubject: {
      id: stage.studentId,
      name: [stage.student.firstName, stage.student.lastName].filter(Boolean).join(' '),
      stage: {
        role: stage.role,
        company: stage.companyName,
        department: stage.department,
        startDate: stage.startDate.toISOString(),
        endDate: stage.endDate?.toISOString() ?? null,
        completedHours: stage.completedHours,
        stageType: stage.stageType,
        supervisor: stage.supervisorName,
        supervisorRating: stage.supervisorRating,
        competencies: stage.supervisorCompetencies,
        supervisorStrengths: stage.supervisorStrengths,
        supervisorWouldHire: stage.supervisorWouldHire,
      },
    },
  }

  const created = new Date()
  return prisma.verifiableCredential.create({
    data: {
      subjectId: stage.studentId,
      subjectName: payload.credentialSubject.name,
      issuerType: 'UNIVERSITY',
      issuerId: stage.universityName,
      issuerName: stage.universityName,
      credentialType: 'STAGE_COMPLETION',
      payload: payload as unknown as Prisma.InputJsonValue,
      sourceType: 'StageExperience',
      sourceId: stageId,
      proofType: 'HmacSha256-2025',
      proofCreated: created,
      proofValue: computeProof(payload, created),
      verificationMethod: `intransparency:signing-key:v1`,
      shareToken: generateShareToken(),
      status: 'ISSUED',
    },
  })
}

/**
 * Revoke a credential. Student, original issuer, or platform admin can revoke.
 */
export async function revokeCredential(credentialId: string, reason: string) {
  return prisma.verifiableCredential.update({
    where: { id: credentialId },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
      revokedReason: reason,
    },
  })
}

/**
 * Public verification — given a share token, return (limited) payload and verify the proof.
 * Anyone on the internet can hit this to verify a credential shared by a student.
 */
export async function verifyByShareToken(token: string) {
  const vc = await prisma.verifiableCredential.findUnique({
    where: { shareToken: token },
  })
  if (!vc) return null

  // Increment view counter (fire-and-forget — don't block)
  prisma.verifiableCredential
    .update({ where: { id: vc.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {})

  const valid =
    vc.status === 'ISSUED' &&
    vc.proofValue != null &&
    vc.proofCreated != null &&
    verifyProof(vc.payload as object, vc.proofCreated, vc.proofValue)

  return {
    valid,
    status: vc.status,
    type: vc.credentialType,
    issuerName: vc.issuerName,
    subjectName: vc.subjectName,
    issuedAt: vc.issuedAt.toISOString(),
    expiresAt: vc.expiresAt?.toISOString() ?? null,
    payload: vc.payload,
  }
}
