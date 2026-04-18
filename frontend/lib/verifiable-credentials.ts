/**
 * Verifiable Credentials (VC) — W3C VC + EU EDC-compatible
 *
 * Issues signed credentials that live in our DB (authoritative) and can be
 * exported to the EU Digital Wallet, shared via public URL with a share token,
 * or revoked centrally.
 *
 * Signing: Ed25519 (Ed25519Signature2020), matching W3C VC and EU EDC specs.
 *
 * Key management:
 *   VC_SIGNING_PRIVATE_KEY — PKCS#8 PEM (starts with "-----BEGIN PRIVATE KEY-----")
 *   VC_SIGNING_PUBLIC_KEY  — SPKI PEM, published so verifiers can cryptographically
 *                            check credentials without contacting our service.
 *   VC_SIGNING_KEY_ID      — short identifier included in proof metadata (e.g. "2026-04-key-1").
 *
 * Generate a new keypair with:
 *   node scripts/generate-vc-keypair.js
 */

import prisma from './prisma'
import crypto from 'crypto'
import type { Prisma } from '@prisma/client'

const VC_CONTEXT = 'https://www.w3.org/2018/credentials/v1'

// Memoized key objects — parsing PEMs repeatedly is expensive
let cachedPrivateKey: crypto.KeyObject | null = null
let cachedPublicKey: crypto.KeyObject | null = null
let devKeyPair: { privateKey: crypto.KeyObject; publicKey: crypto.KeyObject } | null = null

function getDevKeyPair() {
  if (!devKeyPair) {
    console.warn(
      '[VC] VC_SIGNING_PRIVATE_KEY not set — using ephemeral in-process dev key. ' +
      'Credentials issued now will NOT verify after a server restart. Set the env var for production.'
    )
    devKeyPair = crypto.generateKeyPairSync('ed25519')
  }
  return devKeyPair
}

function getPrivateKey(): crypto.KeyObject {
  if (cachedPrivateKey) return cachedPrivateKey
  const pem = process.env.VC_SIGNING_PRIVATE_KEY
  if (!pem) {
    return getDevKeyPair().privateKey
  }
  cachedPrivateKey = crypto.createPrivateKey({ key: pem, format: 'pem' })
  return cachedPrivateKey
}

function getPublicKey(): crypto.KeyObject {
  if (cachedPublicKey) return cachedPublicKey
  const pem = process.env.VC_SIGNING_PUBLIC_KEY
  if (!pem) {
    return getDevKeyPair().publicKey
  }
  cachedPublicKey = crypto.createPublicKey({ key: pem, format: 'pem' })
  return cachedPublicKey
}

function getKeyId(): string {
  return process.env.VC_SIGNING_KEY_ID ?? 'intransparency:signing-key:dev'
}

/**
 * Canonicalize payload for signing. Uses JCS-style sorted-key JSON so that
 * signature verification is deterministic regardless of key ordering.
 */
function canonicalize(payload: object, created: Date): Buffer {
  const sortedKeys = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sortedKeys)
    if (obj && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortedKeys(obj[key])
          return acc
        }, {})
    }
    return obj
  }
  const canonical = JSON.stringify(sortedKeys(payload)) + '|' + created.toISOString()
  return Buffer.from(canonical, 'utf8')
}

/**
 * Sign the payload with Ed25519. Returns a base64 signature.
 */
function computeProof(payload: object, created: Date): string {
  const data = canonicalize(payload, created)
  const signature = crypto.sign(null, data, getPrivateKey())
  return signature.toString('base64')
}

/**
 * Verify a credential's Ed25519 signature. Returns true if the signature is valid.
 */
export function verifyProof(payload: object, created: Date, proofValue: string): boolean {
  try {
    const data = canonicalize(payload, created)
    const signature = Buffer.from(proofValue, 'base64')
    return crypto.verify(null, data, getPublicKey(), signature)
  } catch {
    return false
  }
}

/**
 * Public key export — served at /api/credentials/public-key so external verifiers
 * can validate credentials without trusting our service.
 */
export function exportPublicKeyPem(): string {
  return getPublicKey().export({ type: 'spki', format: 'pem' }).toString()
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
      proofType: 'Ed25519Signature2020',
      proofCreated: created,
      proofValue,
      verificationMethod: getKeyId(),
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
      proofType: 'Ed25519Signature2020',
      proofCreated: created,
      proofValue: computeProof(payload, created),
      verificationMethod: getKeyId(),
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
