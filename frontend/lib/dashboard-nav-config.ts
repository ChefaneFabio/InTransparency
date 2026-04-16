export type DashboardRole = 'student' | 'recruiter' | 'university' | 'institution' | 'professor' | 'techpark'

export interface NavItem {
  labelKey: string
  href: string
}

export interface NavGroup {
  labelKey: string
  items: NavItem[]
}

export interface NavConfig {
  groups: NavGroup[]
}

const student: NavConfig = {
  groups: [
    {
      labelKey: 'portfolio',
      items: [
        { labelKey: 'projects', href: '/dashboard/student/projects' },
        { labelKey: 'profile', href: '/dashboard/student/profile' },
        { labelKey: 'cv', href: '/dashboard/student/cv' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'jobs', href: '/dashboard/student/jobs' },
        { labelKey: 'applications', href: '/dashboard/student/applications' },
        { labelKey: 'skillPath', href: '/dashboard/student/skill-path' },
      ],
    },
    {
      labelKey: 'community',
      items: [
        { labelKey: 'messages', href: '/dashboard/student/messages' },
        { labelKey: 'challenges', href: '/dashboard/student/challenges' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/student/analytics' },
        { labelKey: 'settings', href: '/dashboard/student/settings' },
      ],
    },
  ],
}

const recruiter: NavConfig = {
  groups: [
    {
      labelKey: 'search',
      items: [
        { labelKey: 'candidates', href: '/dashboard/recruiter/candidates' },
        { labelKey: 'decisionPacks', href: '/dashboard/recruiter/decision-pack' },
      ],
    },
    {
      labelKey: 'jobs',
      items: [
        { labelKey: 'listings', href: '/dashboard/recruiter/jobs' },
        { labelKey: 'pipeline', href: '/dashboard/recruiter/pipeline' },
      ],
    },
    {
      labelKey: 'communicate',
      items: [
        { labelKey: 'messages', href: '/dashboard/recruiter/messages' },
        { labelKey: 'challenges', href: '/dashboard/recruiter/challenges' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/recruiter/analytics' },
        { labelKey: 'settings', href: '/dashboard/recruiter/settings' },
      ],
    },
  ],
}

// Institution type determines which nav items are visible
export type InstitutionType = 'university' | 'its' | 'school' | 'other'

const universityBase: NavConfig = {
  groups: [
    {
      labelKey: 'students',
      items: [
        { labelKey: 'list', href: '/dashboard/university/students' },
        { labelKey: 'projects', href: '/dashboard/university/projects' },
        { labelKey: 'courses', href: '/dashboard/university/courses' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'placements', href: '/dashboard/university/placements' },
        { labelKey: 'skillsGap', href: '/dashboard/university/skills-gap' },
        { labelKey: 'curriculumAlignment', href: '/dashboard/university/curriculum-alignment' },
        { labelKey: 'events', href: '/dashboard/university/events' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'settings', href: '/dashboard/university/settings' },
      ],
    },
  ],
}

const itsExtras: NavGroup[] = [
  {
    labelKey: 'internships',
    items: [
      { labelKey: 'internshipPipeline', href: '/dashboard/university/internship-pipeline' },
      { labelKey: 'internshipTracker', href: '/dashboard/university/internship-tracker' },
      { labelKey: 'board', href: '/dashboard/university/board' },
    ],
  },
]

const schoolNav: NavConfig = {
  groups: [
    {
      labelKey: 'students',
      items: [
        { labelKey: 'list', href: '/dashboard/university/students' },
        { labelKey: 'projects', href: '/dashboard/university/projects' },
      ],
    },
    {
      labelKey: 'pcto',
      items: [
        { labelKey: 'pctoManager', href: '/dashboard/university/pcto' },
        { labelKey: 'pctoMarketplace', href: '/dashboard/university/pcto/marketplace' },
        { labelKey: 'parentalConsent', href: '/dashboard/university/parental-consent' },
      ],
    },
    {
      labelKey: 'development',
      items: [
        { labelKey: 'orientation', href: '/dashboard/university/orientation' },
        { labelKey: 'softSkills', href: '/dashboard/university/soft-skills' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'settings', href: '/dashboard/university/settings' },
      ],
    },
  ],
}

const otherNav: NavConfig = {
  groups: [
    {
      labelKey: 'learners',
      items: [
        { labelKey: 'list', href: '/dashboard/university/students' },
        { labelKey: 'courses', href: '/dashboard/university/courses' },
        { labelKey: 'priorLearning', href: '/dashboard/university/prior-learning' },
      ],
    },
    {
      labelKey: 'credentials',
      items: [
        { labelKey: 'certificates', href: '/dashboard/university/certificates' },
        { labelKey: 'fastTrack', href: '/dashboard/university/fast-track' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'placements', href: '/dashboard/university/placements' },
        { labelKey: 'events', href: '/dashboard/university/events' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'settings', href: '/dashboard/university/settings' },
      ],
    },
  ],
}

export const getUniversityNavForType = (institutionType?: string): NavConfig => {
  switch (institutionType) {
    case 'its':
      return {
        groups: [
          ...universityBase.groups.slice(0, 2), // students + career
          ...itsExtras,
          ...universityBase.groups.slice(2),     // insights
        ],
      }
    case 'school':
      return schoolNav
    case 'other':
      return otherNav
    default:
      return universityBase
  }
}

// Default university nav (used when institutionType is unknown)
const university = universityBase

const professor: NavConfig = {
  groups: [
    {
      labelKey: 'endorsements',
      items: [
        { labelKey: 'overview', href: '/dashboard/professor' },
        { labelKey: 'allEndorsements', href: '/dashboard/professor/endorsements' },
      ],
    },
    {
      labelKey: 'people',
      items: [
        { labelKey: 'students', href: '/dashboard/professor/students' },
      ],
    },
  ],
}

const techpark: NavConfig = {
  groups: [
    {
      labelKey: 'overview',
      items: [
        { labelKey: 'dashboard', href: '/dashboard/techpark' },
        { labelKey: 'memberCompanies', href: '/dashboard/techpark/companies' },
      ],
    },
    {
      labelKey: 'talent',
      items: [
        { labelKey: 'talentPipeline', href: '/dashboard/techpark/talent' },
        { labelKey: 'candidates', href: '/dashboard/techpark/candidates' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/techpark/analytics' },
        { labelKey: 'placements', href: '/dashboard/techpark/placements' },
        { labelKey: 'events', href: '/dashboard/techpark/events' },
        { labelKey: 'settings', href: '/dashboard/techpark/settings' },
      ],
    },
  ],
}

export const dashboardNavConfig: Record<DashboardRole, NavConfig> = {
  student,
  recruiter,
  university,
  institution: university,
  professor,
  techpark,
}
