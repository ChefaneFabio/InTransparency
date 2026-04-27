/**
 * Sample profiles for the /explore empty state.
 *
 * Rendered when the live API returns zero students AND no filters are
 * applied — typically pre-pilot or while a new locale is bootstrapping.
 * The cards are visibly flagged via `_sample: true` so visitors
 * understand what's example data vs. live, and the page disables the
 * "view portfolio" link on sample cards.
 *
 * Profiles span the four representative segments (university CS, ITS
 * mechatronics, design, business) so a recruiter sees discipline
 * coverage at a glance, not just tech.
 */

export interface SampleStudent {
  id: string
  username: string
  firstName: string
  lastName: string
  university: string
  degree: string
  graduationYear: number
  projectsCount: number
  verificationScore: number
  skillsCount: number
  topSkills: string[]
  topProject: string
  endorsement: boolean
  _sample: true
}

export const SAMPLE_PROFILES: SampleStudent[] = [
  {
    id: 'sample-1',
    username: 'sample-marta-r',
    firstName: 'Marta',
    lastName: 'R.',
    university: 'Università degli Studi di Bergamo',
    degree: 'Computer Science (M.Sc.)',
    graduationYear: 2025,
    projectsCount: 7,
    verificationScore: 94,
    skillsCount: 18,
    topSkills: ['Python', 'Machine Learning', 'React'],
    topProject: 'Real-time toxicity detection model — F1 0.87 on Italian news comments',
    endorsement: true,
    _sample: true,
  },
  {
    id: 'sample-2',
    username: 'sample-luca-b',
    firstName: 'Luca',
    lastName: 'B.',
    university: 'ITS Academy Meccatronico Veneto',
    degree: 'Industrial Automation (Diploma ITS)',
    graduationYear: 2024,
    projectsCount: 5,
    verificationScore: 88,
    skillsCount: 14,
    topSkills: ['PLC Programming', 'SCADA', 'Industrial Automation'],
    topProject: 'PLC retrofit on legacy bottling line — €40k savings projected, in production at host company',
    endorsement: true,
    _sample: true,
  },
  {
    id: 'sample-3',
    username: 'sample-giulia-c',
    firstName: 'Giulia',
    lastName: 'C.',
    university: 'Liceo Artistico di Brera (Milano)',
    degree: 'Diploma — Indirizzo Grafica',
    graduationYear: 2025,
    projectsCount: 9,
    verificationScore: 81,
    skillsCount: 12,
    topSkills: ['Adobe Illustrator', 'UI/UX Design', 'Brand Identity'],
    topProject: 'Identity system for Pinacoteca di Brera student-night event — adopted as the official 2024 mark',
    endorsement: false,
    _sample: true,
  },
  {
    id: 'sample-4',
    username: 'sample-alessandro-d',
    firstName: 'Alessandro',
    lastName: 'D.',
    university: 'Università Bocconi',
    degree: 'Business Administration (B.Sc.)',
    graduationYear: 2026,
    projectsCount: 4,
    verificationScore: 90,
    skillsCount: 11,
    topSkills: ['Financial Modeling', 'Market Analysis', 'Excel Advanced'],
    topProject: 'DCF valuation of an Italian SME for a real PE buyer-side mandate — published as course case study',
    endorsement: true,
    _sample: true,
  },
]
