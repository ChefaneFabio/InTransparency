import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/algorithms
 *
 * Machine-readable form of our /algorithm-registry page. Required by AI Act
 * Annex III for high-risk AI systems. Agents consuming our data can audit
 * the exact inputs, weights, and excluded attributes before relying on match
 * scores.
 */

const ALGORITHMS = [
  {
    id: 'talent-match-v1.2.0',
    name: 'Talent Match',
    version: '1.2.0',
    type: 'rule-based-scoring',
    purpose:
      'Rank students for a role based on verified skills, projects, stages, and academic performance.',
    aiActClassification: 'high-risk (Annex III §4)',
    inputs: [
      { name: 'Required skills', source: 'Job posting', sensitive: false },
      { name: 'Preferred skills', source: 'Job posting', sensitive: false },
      { name: 'Student verified skills', source: 'SkillDelta graph', sensitive: false },
      { name: 'Student self-declared skills', source: 'Profile', sensitive: false },
      { name: 'Verified projects', source: 'Project + ProfessorEndorsement', sensitive: false },
      { name: 'Stage supervisor ratings', source: 'StageExperience', sensitive: false },
      { name: 'GPA (opt-in public only)', source: 'Profile', sensitive: true },
      { name: 'Graduation year', source: 'Profile', sensitive: false },
      { name: 'Location', source: 'Profile', sensitive: false },
    ],
    excludedInputs: [
      'Gender',
      'Nationality',
      'Ethnicity',
      'Religion',
      'Age (beyond graduation year cohort)',
      'Photo / biometric inference',
      'Private GPA (if not opted in)',
    ],
    weights: [
      { factor: 'Required skills match', maxPoints: 40, verifiedMultiplier: 1.0, selfDeclaredMultiplier: 0.6 },
      { factor: 'Preferred skills match', maxPoints: 15, verifiedMultiplier: 1.0, selfDeclaredMultiplier: 0.6 },
      { factor: 'Verified depth bonus (Advanced/Expert)', maxPoints: 10 },
      { factor: 'Verified projects with matching skills', maxPoints: 20 },
      { factor: 'Stage / internship experience', maxPoints: 15 },
      { factor: 'Academic performance (opt-in)', maxPoints: 10 },
    ],
    humanOversight:
      'Every match can be reviewed and overridden by a university administrator via /api/match/{id}/audit.',
    subjectRights: [
      'Right to view the explanation at /matches/{id}/why',
      'Right to request human review',
      'Right to object to listing in match results',
      'Right to export all explanations',
    ],
    lastAudit: '2026-03-15',
    biasTesting: 'Monthly cohort parity tests across gender, universities, degree types. >5% differential triggers review.',
    complianceRefs: [
      'EU AI Act Regulation 2024/1689, Annex III §4',
      'GDPR Art. 22',
      'EU AI Act Art. 86 (right to explanation)',
    ],
  },
  {
    id: 'placement-prediction-v0.9.0',
    name: 'Placement Prediction',
    version: '0.9.0 (preview)',
    type: 'hybrid-scoring',
    purpose: "Estimate a student's probability of securing a job offer within 6 months post-graduation.",
    aiActClassification: 'high-risk (Annex III §4)',
    audience: 'Student + their university career service only. Never shown to recruiters.',
    inputs: [
      { name: 'Verified project count', source: 'Project' },
      { name: 'Stage completions', source: 'StageExperience' },
      { name: 'Supervisor would-hire signal', source: 'StageExperience' },
      { name: 'GPA (opt-in)', source: 'Profile' },
      { name: 'Skill graph depth', source: 'SkillDelta' },
    ],
    excludedInputs: ['Gender', 'Nationality', 'Ethnicity', 'Religion', 'Socio-economic data'],
    humanOversight:
      'Predictions are advisory, never determinative. Career services can contextualize or suppress.',
    lastAudit: '2026-02-20',
    complianceRefs: ['EU AI Act Regulation 2024/1689, Annex III §4', 'GDPR Art. 22'],
  },
]

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson({
    '@type': 'AlgorithmRegistry',
    count: ALGORITHMS.length,
    algorithms: ALGORITHMS,
    humanSurface: 'https://www.in-transparency.com/en/algorithm-registry',
  }, 3600)
}
