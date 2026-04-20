/**
 * European Digital Credentials for Learning (EDC / EDCI).
 *
 * EDCI is the European Commission's own Verifiable Credential format —
 * a superset of W3C VC Data Model with EU-specific fields (accreditations,
 * awarding opportunity, learning outcomes mapped to European frameworks,
 * ELM — European Learning Model).
 *
 * Spec references:
 *   - ELM v3: https://europa.eu/europass/elm-browser
 *   - EDCI integration patterns: https://europass.europa.eu/en/interoperability-specifications
 *   - European Qualifications Framework (EQF) for levels 1-8
 *
 * This module converts an InTransparency credential (stage completion or
 * professor endorsement) into the EDCI JSON-LD shape. Our Ed25519 signature
 * remains the cryptographic proof; the EDCI wrapper ensures EU-portal
 * readers recognize the payload.
 */

import type { Prisma } from '@prisma/client'

export const EDCI_CONTEXT = [
  'https://www.w3.org/2018/credentials/v1',
  'https://europa.eu/europass/elm-browser/api-docs/context.json',
]

/**
 * European Qualifications Framework levels 1-8.
 * Approximate mapping from our 1-4 proficiency scale — EQF was designed
 * for qualifications (entire degrees), not individual skills, so we map
 * to the lower half (skill levels don't reach EQF 7 "Master" automatically).
 */
export function proficiencyToEqf(level: 1 | 2 | 3 | 4): number {
  switch (level) {
    case 1:
      return 3 // Basic — upper-secondary skill
    case 2:
      return 4 // Intermediate — post-secondary skill
    case 3:
      return 5 // Advanced — short-cycle higher ed skill
    case 4:
      return 6 // Expert — bachelor-level competence applied to skill
  }
}

export interface EdciIssuer {
  id: string // URI identifying the issuing institution
  name: string
  type: 'UNIVERSITY' | 'PROFESSOR' | 'COMPANY' | 'GOVERNMENT'
  /** Country code ISO 3166-1 alpha-2 */
  countryCode?: string
}

export interface EdciLearningAchievement {
  title: string
  description?: string
  /** EQF level 1-8 */
  eqfLevel?: number
  /** ISCED-F code if known — classification of the education field */
  iscedFCode?: string
  /** ESCO URIs of the skills this achievement attests */
  relatedSkills?: string[]
  /** DigComp / EntreComp / GreenComp framework URIs if mapped */
  frameworkReferences?: Array<{ framework: string; uri: string }>
}

export interface EdciCredential {
  '@context': string[]
  type: string[]
  id: string
  issuanceDate: string
  expirationDate?: string
  issuer: EdciIssuer
  credentialSubject: {
    id: string
    givenName?: string
    familyName?: string
    dateOfBirth?: string
    achieved: EdciLearningAchievement[]
  }
  proof?: {
    type: string
    created: string
    proofPurpose: string
    verificationMethod: string
    proofValue: string
  }
}

/**
 * Build an EDCI credential payload from the shape we already store in
 * our VerifiableCredential table.
 */
export function buildEdciCredential(params: {
  internalId: string
  issuerName: string
  issuerType: 'UNIVERSITY' | 'PROFESSOR' | 'COMPANY' | 'GOVERNMENT'
  issuerCountry?: string
  subjectId: string
  subjectGivenName?: string
  subjectFamilyName?: string
  achievements: EdciLearningAchievement[]
  issuedAt: Date
  expiresAt?: Date | null
  proofCreated?: Date | null
  proofValue?: string | null
  verificationMethod?: string | null
}): EdciCredential {
  return {
    '@context': EDCI_CONTEXT,
    type: ['VerifiableCredential', 'EuropeanDigitalCredential'],
    id: `https://www.in-transparency.com/api/credentials/${params.internalId}`,
    issuanceDate: params.issuedAt.toISOString(),
    expirationDate: params.expiresAt?.toISOString(),
    issuer: {
      id: `https://www.in-transparency.com/issuers/${encodeURIComponent(params.issuerName)}`,
      name: params.issuerName,
      type: params.issuerType,
      countryCode: params.issuerCountry,
    },
    credentialSubject: {
      id: `https://www.in-transparency.com/subjects/${params.subjectId}`,
      givenName: params.subjectGivenName,
      familyName: params.subjectFamilyName,
      achieved: params.achievements,
    },
    proof:
      params.proofValue && params.proofCreated
        ? {
            type: 'Ed25519Signature2020',
            created: params.proofCreated.toISOString(),
            proofPurpose: 'assertionMethod',
            verificationMethod:
              params.verificationMethod ?? 'https://www.in-transparency.com/api/credentials/public-key',
            proofValue: params.proofValue,
          }
        : undefined,
  }
}

/**
 * Helper: convert our internal VerifiableCredential payload + source into
 * EDCI achievements. Handles both stage completions and endorsements.
 */
export function inferAchievements(params: {
  credentialType: string
  payload: Prisma.JsonValue
}): EdciLearningAchievement[] {
  const payload = params.payload as any
  const subject = payload?.credentialSubject ?? {}

  if (params.credentialType === 'STAGE_COMPLETION') {
    const stage = subject?.stage ?? {}
    return [
      {
        title: `${stage.role ?? 'Internship'} at ${stage.company ?? 'company'}`,
        description: stage.supervisorStrengths ?? undefined,
        eqfLevel: 5, // Short-cycle experiential learning
        relatedSkills: Array.isArray(stage.competencies)
          ? stage.competencies.map((c: any) => c?.skill).filter(Boolean)
          : undefined,
      },
    ]
  }

  if (params.credentialType === 'SKILL_ENDORSEMENT') {
    const endorsement = subject?.endorsement ?? {}
    return [
      {
        title: `Professor endorsement — ${endorsement.project ?? 'project'}`,
        description: endorsement.endorsementText ?? undefined,
        eqfLevel: 6, // Bachelor-level academic work
        relatedSkills: Array.isArray(endorsement.skills) ? endorsement.skills : undefined,
      },
    ]
  }

  return [
    {
      title: params.credentialType.replace(/_/g, ' '),
    },
  ]
}
