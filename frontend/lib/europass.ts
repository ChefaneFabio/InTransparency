/**
 * Europass v3 export
 *
 * Builds a Europass-compliant profile payload from a student's InTransparency data.
 * Supports JSON-LD export (Europass's preferred format for digital wallets) and
 * a simplified JSON for in-browser CV generation.
 *
 * Europass Digital Credentials Infrastructure (EDCI) spec reference:
 * https://europass.europa.eu/en/interoperability-specifications
 *
 * Design principle: Europass is a *receiver* standard — we push data in, they
 * store it in the EU Digital Wallet. We never claim to be the authoritative
 * Europass service; we enrich it with our verified evidence.
 */

import prisma from './prisma'
import { getCurrentSkillGraph } from './skill-delta'
import { resolveEscoUri } from './esco'

export interface EuropassProfile {
  '@context': string
  '@type': 'Person'
  identifier: string
  givenName: string | null
  familyName: string | null
  email: string | null
  nationality?: string
  address?: { addressCountry: string; addressLocality?: string }
  hasCredential: EuropassCredential[]
  learningAchievements: EuropassLearningAchievement[]
  workExperience: EuropassWorkExperience[]
  hasSkill: EuropassSkill[]
  language: EuropassLanguage[]
  digitallySigned: boolean
}

interface EuropassCredential {
  '@type': 'EuropeanDigitalCredential'
  identifier: string
  credentialSubject: string
  issuer: { name: string; type: string }
  awardingDate: string
  credentialType: string
  title: string
  description?: string
  proofOfVerification?: string // URL to verify on our platform
}

interface EuropassLearningAchievement {
  '@type': 'LearningAchievement'
  title: string
  institution: string
  startDate?: string
  endDate?: string
  credits?: number
  grade?: string
}

interface EuropassWorkExperience {
  '@type': 'WorkExperience'
  jobTitle: string
  employer: string
  startDate: string
  endDate?: string
  description?: string
  verifiedBySupervisor: boolean
}

interface EuropassSkill {
  '@type': 'Skill'
  preferredLabel: string
  escoUri?: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' // Europass uses CEFR-style
  evidenceCount: number
  verifiedByInstitution: boolean
}

interface EuropassLanguage {
  '@type': 'Language'
  name: string
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

/**
 * Map our 1-4 proficiency scale to Europass/CEFR A1-C2.
 * Approximate mapping — Europass allows institution-specific rubrics.
 */
function levelToCEFR(level: number): EuropassSkill['proficiencyLevel'] {
  if (level <= 1) return 'A2'
  if (level === 2) return 'B1'
  if (level === 3) return 'B2'
  return 'C1'
}

/**
 * Build the full Europass profile JSON-LD for a student.
 */
export async function buildEuropassProfile(studentId: string): Promise<EuropassProfile | null> {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      projects: {
        where: { verificationStatus: 'VERIFIED' },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      },
      stageExperiences: {
        where: { status: { in: ['EVALUATED', 'VERIFIED'] } },
        take: 10,
        orderBy: { startDate: 'desc' },
      },
    },
  })

  if (!student || student.role !== 'STUDENT') return null

  const skillGraph = await getCurrentSkillGraph(studentId)

  // Skills with ESCO resolution (skills already have escoUri where available)
  const hasSkill: EuropassSkill[] = []
  for (const row of skillGraph) {
    let escoUri = row.escoUri
    if (!escoUri) {
      const resolved = await resolveEscoUri(row.skillTerm).catch(() => null)
      escoUri = resolved?.uri ?? null
    }
    hasSkill.push({
      '@type': 'Skill',
      preferredLabel: row.skillTerm,
      escoUri: escoUri ?? undefined,
      proficiencyLevel: levelToCEFR(row.currentLevel),
      evidenceCount: row.sourceCount,
      verifiedByInstitution: row.sources.some(s => s.source === 'STAGE' || s.source === 'ENDORSEMENT'),
    })
  }

  // Credentials — one per verified project + stage
  const hasCredential: EuropassCredential[] = []
  for (const p of student.projects) {
    hasCredential.push({
      '@type': 'EuropeanDigitalCredential',
      identifier: `intransparency:project:${p.id}`,
      credentialSubject: student.id,
      issuer: { name: student.university ?? 'InTransparency', type: 'UNIVERSITY' },
      awardingDate: p.updatedAt.toISOString(),
      credentialType: 'PROJECT_VERIFICATION',
      title: p.title,
      description: p.description?.substring(0, 300) ?? undefined,
      proofOfVerification: `https://in-transparency.com/explore/project/${p.id}`,
    })
  }
  for (const s of student.stageExperiences) {
    hasCredential.push({
      '@type': 'EuropeanDigitalCredential',
      identifier: `intransparency:stage:${s.id}`,
      credentialSubject: student.id,
      issuer: { name: s.universityName, type: 'UNIVERSITY' },
      awardingDate: (s.supervisorEvalDate ?? s.endDate ?? s.startDate).toISOString(),
      credentialType: 'STAGE_COMPLETION',
      title: `${s.role} @ ${s.companyName}`,
      description: s.supervisorStrengths?.substring(0, 300) ?? undefined,
    })
  }

  const learningAchievements: EuropassLearningAchievement[] = student.degree
    ? [
        {
          '@type': 'LearningAchievement',
          title: student.degree,
          institution: student.university ?? 'Unknown',
          endDate: student.graduationYear ? `${student.graduationYear}-07-01` : undefined,
          grade: student.gpaPublic ? student.gpa ?? undefined : undefined,
        },
      ]
    : []

  const workExperience: EuropassWorkExperience[] = student.stageExperiences.map(s => ({
    '@type': 'WorkExperience',
    jobTitle: s.role,
    employer: s.companyName,
    startDate: s.startDate.toISOString(),
    endDate: s.endDate?.toISOString(),
    description: s.supervisorStrengths ?? s.studentDescription ?? undefined,
    verifiedBySupervisor: s.supervisorCompleted,
  }))

  return {
    '@context': 'https://europa.eu/europass/elm-browser/api-docs/context.json',
    '@type': 'Person',
    identifier: `intransparency:user:${student.id}`,
    givenName: student.firstName,
    familyName: student.lastName,
    email: student.email,
    address: student.country
      ? { addressCountry: student.country, addressLocality: student.location ?? undefined }
      : undefined,
    hasCredential,
    learningAchievements,
    workExperience,
    hasSkill,
    language: [], // Filled from user.interests or dedicated Language model (future)
    digitallySigned: false, // Set true when we sign with an institutional key
  }
}
