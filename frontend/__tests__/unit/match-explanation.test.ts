/**
 * Unit tests for match-explanation logic — decision labeling + factor conversion.
 * These are the outputs every match surfaces to students (right-to-explanation).
 */

import { decisionLabel, legacyReasonsToFactors, MATCH_MODEL_VERSION } from '@/lib/match-explanation'

describe('decisionLabel', () => {
  it('classifies 80+ as STRONG_MATCH', () => {
    expect(decisionLabel(80)).toBe('STRONG_MATCH')
    expect(decisionLabel(100)).toBe('STRONG_MATCH')
    expect(decisionLabel(95)).toBe('STRONG_MATCH')
  })

  it('classifies 60-79 as MATCH', () => {
    expect(decisionLabel(60)).toBe('MATCH')
    expect(decisionLabel(79)).toBe('MATCH')
    expect(decisionLabel(70)).toBe('MATCH')
  })

  it('classifies 40-59 as WEAK_MATCH', () => {
    expect(decisionLabel(40)).toBe('WEAK_MATCH')
    expect(decisionLabel(59)).toBe('WEAK_MATCH')
  })

  it('classifies below 40 as NO_MATCH', () => {
    expect(decisionLabel(39)).toBe('NO_MATCH')
    expect(decisionLabel(0)).toBe('NO_MATCH')
  })
})

describe('legacyReasonsToFactors', () => {
  it('maps known factor names to correct categories', () => {
    const factors = legacyReasonsToFactors(
      [
        { factor: 'requiredSkills', score: 30, detail: 'Python, SQL' },
        { factor: 'verifiedProjects', score: 15, detail: '2 projects' },
        { factor: 'internshipExperience', score: 10, detail: 'Brembo' },
        { factor: 'academicPerformance', score: 8, detail: 'GPA 28' },
      ],
      { matchedSkills: ['Python', 'SQL'], topProjects: [{ title: 'Thesis project' }], internships: [] }
    )

    const byName = Object.fromEntries(factors.map(f => [f.name, f.category]))
    expect(byName.requiredSkills).toBe('skills')
    expect(byName.verifiedProjects).toBe('verified_evidence')
    expect(byName.internshipExperience).toBe('experience')
    expect(byName.academicPerformance).toBe('academic')
  })

  it('attaches evidence per factor type', () => {
    const factors = legacyReasonsToFactors(
      [{ factor: 'requiredSkills', score: 40, detail: 'Python' }],
      { matchedSkills: ['Python'] }
    )
    expect(factors[0].evidence).toEqual([{ type: 'skill', label: 'Python' }])
  })

  it('recognizes verifiedDepth as verified_evidence (added in wire-up)', () => {
    const factors = legacyReasonsToFactors(
      [{ factor: 'verifiedDepth', score: 8, detail: 'python (Expert, 2 sources)' }],
      {}
    )
    expect(factors[0].category).toBe('verified_evidence')
  })
})

describe('MATCH_MODEL_VERSION', () => {
  it('is pinned to a specific version string (audit-critical)', () => {
    expect(MATCH_MODEL_VERSION).toMatch(/^talent-match-v\d+\.\d+\.\d+$/)
  })
})
