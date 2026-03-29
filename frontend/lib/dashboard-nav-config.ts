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
        { labelKey: 'contractTransparency', href: '/dashboard/student/contract-transparency' },
        { labelKey: 'offerComparison', href: '/dashboard/student/offer-comparison' },
        { labelKey: 'salaryBenchmarks', href: '/dashboard/student/salary-benchmarks' },
      ],
    },
    {
      labelKey: 'messages',
      items: [
        { labelKey: 'messages', href: '/dashboard/student/messages' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/student/analytics' },
        { labelKey: 'personality', href: '/dashboard/student/personality' },
        { labelKey: 'certifications', href: '/dashboard/student/certifications' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'aiJobSearch', href: '/dashboard/student/ai-job-search' },
        { labelKey: 'skillPath', href: '/dashboard/student/skill-path' },
        { labelKey: 'challenges', href: '/dashboard/student/challenges' },
        { labelKey: 'exchange', href: '/dashboard/student/exchange' },
        { labelKey: 'privacy', href: '/dashboard/student/privacy' },
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
      ],
    },
    {
      labelKey: 'jobs',
      items: [
        { labelKey: 'listings', href: '/dashboard/recruiter/jobs' },
        { labelKey: 'postJob', href: '/dashboard/recruiter/post-job' },
      ],
    },
    {
      labelKey: 'messages',
      items: [
        { labelKey: 'messages', href: '/dashboard/recruiter/messages' },
      ],
    },
    {
      labelKey: 'hiring',
      items: [
        { labelKey: 'pipeline', href: '/dashboard/recruiter/pipeline' },
        { labelKey: 'decisionPacks', href: '/dashboard/recruiter/decision-pack' },
        { labelKey: 'compareCandidates', href: '/dashboard/recruiter/compare' },
        { labelKey: 'contractTransparency', href: '/dashboard/recruiter/contract-transparency' },
        { labelKey: 'team', href: '/dashboard/recruiter/team' },
        { labelKey: 'scheduling', href: '/dashboard/recruiter/scheduling' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/recruiter/analytics' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'challenges', href: '/dashboard/recruiter/challenges' },
        { labelKey: 'hiringOutcomes', href: '/dashboard/recruiter/hiring-outcomes' },
        { labelKey: 'outreach', href: '/dashboard/recruiter/outreach' },
        { labelKey: 'careerPage', href: '/dashboard/recruiter/career-page' },
        { labelKey: 'settings', href: '/dashboard/recruiter/settings' },
      ],
    },
  ],
}

const university: NavConfig = {
  groups: [
    {
      labelKey: 'students',
      items: [
        { labelKey: 'list', href: '/dashboard/university/students' },
        { labelKey: 'courses', href: '/dashboard/university/courses' },
        { labelKey: 'projects', href: '/dashboard/university/projects' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'placements', href: '/dashboard/university/placements' },
        { labelKey: 'recruiters', href: '/dashboard/university/recruiters' },
        { labelKey: 'contractAnalytics', href: '/dashboard/university/contract-analytics' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'placementReport', href: '/dashboard/university/placement-report' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'alumni', href: '/dashboard/university/alumni' },
        { labelKey: 'exchangeStudents', href: '/dashboard/university/exchange-students' },
        { labelKey: 'careerDay', href: '/dashboard/university/career-day' },
        { labelKey: 'settings', href: '/dashboard/university/settings' },
      ],
    },
  ],
}

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
    {
      labelKey: 'more',
      items: [
        { labelKey: 'settings', href: '/dashboard/professor/settings' },
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
      ],
    },
    {
      labelKey: 'more',
      items: [
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
