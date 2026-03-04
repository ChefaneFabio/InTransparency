/**
 * Static mock Decision Pack data for the university demo page.
 * No 'use client' — importable from both server and client components.
 */

import type { DecisionPackData } from './decision-pack'

export const sampleDecisionPack: DecisionPackData = {
  candidate: {
    id: 'demo-student-001',
    firstName: 'Sofia',
    lastName: 'Marchetti',
    university: 'Università degli Studi di Bergamo',
    degree: 'Computer Science',
    country: 'IT',
    tagline: 'Full-stack developer with a passion for accessible design',
    bio: 'Final-year CS student specialising in web accessibility and distributed systems. Start Cup Bergamo 2024 finalist.',
  },
  trustScore: {
    verifiedProjects: 4,
    totalProjects: 5,
    endorsementCount: 3,
    universityVerified: true,
  },
  skills: [
    { name: 'React', industryTerms: ['React.js', 'Frontend'], evidenceSources: ['Project: AccessiBoard', 'Project: EcoTrack'], verifiedLevel: 'Advanced' },
    { name: 'TypeScript', industryTerms: ['TS', 'JavaScript'], evidenceSources: ['Project: AccessiBoard', 'Endorsed by Prof. Rossi'], verifiedLevel: 'Advanced' },
    { name: 'Node.js', industryTerms: ['Backend JS', 'Express'], evidenceSources: ['Project: EcoTrack'], verifiedLevel: 'Intermediate' },
    { name: 'PostgreSQL', industryTerms: ['SQL', 'Database'], evidenceSources: ['Project: AccessiBoard'], verifiedLevel: 'Intermediate' },
    { name: 'Accessibility (WCAG)', industryTerms: ['a11y', 'WCAG 2.1'], evidenceSources: ['Project: AccessiBoard', 'Certification'], verifiedLevel: 'Advanced' },
  ],
  projects: [
    {
      id: 'proj-001',
      title: 'AccessiBoard — Accessible Dashboard Builder',
      discipline: 'Computer Science',
      grade: '30L',
      normalizedGrade: 100,
      gradeDisplay: '30 e lode',
      innovationScore: 88,
      complexityScore: 82,
      marketRelevance: 91,
      aiInsights: null,
      verificationStatus: 'VERIFIED',
      skills: ['React', 'TypeScript', 'PostgreSQL', 'WCAG 2.1'],
      endorsements: [
        { professorName: 'Prof. Marco Rossi', rating: 5, endorsementText: 'Outstanding work on accessibility patterns — publication-quality code.' },
      ],
    },
    {
      id: 'proj-002',
      title: 'EcoTrack — Carbon Footprint Tracker',
      discipline: 'Computer Science',
      grade: '28',
      normalizedGrade: 83,
      gradeDisplay: '28/30',
      innovationScore: 75,
      complexityScore: 68,
      marketRelevance: 85,
      aiInsights: null,
      verificationStatus: 'VERIFIED',
      skills: ['React', 'Node.js', 'Chart.js'],
      endorsements: [
        { professorName: 'Prof. Elena Bianchi', rating: 4, endorsementText: 'Solid full-stack implementation with real-world impact.' },
      ],
    },
  ],
  grades: [
    { projectTitle: 'AccessiBoard', originalGrade: '30L', country: 'IT', normalizedGrade: 100, displayInCountry: { IT: '30 e lode', DE: '1.0', FR: '20/20', ES: '10.0/10', UK: '100%', NL: '10.0/10' } },
    { projectTitle: 'EcoTrack', originalGrade: '28', country: 'IT', normalizedGrade: 83, displayInCountry: { IT: '28/30', DE: '1.7', FR: '17/20', ES: '8.3/10', UK: '83%', NL: '8.3/10' } },
  ],
  prediction: {
    probability: 0.87,
    topFactors: [
      { factor: 'Verified projects', impact: 0.3, description: '4 of 5 projects university-verified' },
      { factor: 'In-demand skills', impact: 0.25, description: 'React + TypeScript match 68% of open positions' },
      { factor: 'Professor endorsements', impact: 0.2, description: '3 endorsements from 2 professors' },
    ],
  },
  softSkills: null,
  matchScore: null,
  generatedAt: new Date('2024-12-01').toISOString(),
}
