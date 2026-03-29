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
        { labelKey: 'profileOptimizer', href: '/dashboard/student/profile-optimizer' },
        { labelKey: 'cv', href: '/dashboard/student/cv' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'jobs', href: '/dashboard/student/jobs' },
        { labelKey: 'applications', href: '/dashboard/student/applications' },
        { labelKey: 'skillPath', href: '/dashboard/student/skill-path' },
        { labelKey: 'aiJobSearch', href: '/dashboard/student/ai-job-search' },
        { labelKey: 'contractTransparency', href: '/dashboard/student/contract-transparency' },
        { labelKey: 'offerComparison', href: '/dashboard/student/offer-comparison' },
        { labelKey: 'interviewPrep', href: '/dashboard/student/interview-prep' },
        { labelKey: 'jobDecoder', href: '/dashboard/student/job-decoder' },
        { labelKey: 'salaryBenchmarks', href: '/dashboard/student/salary-benchmarks' },
        { labelKey: 'skillsTimeline', href: '/dashboard/student/skills-timeline' },
        { labelKey: 'skillsDemand', href: '/dashboard/student/skills-demand' },
      ],
    },
    {
      labelKey: 'community',
      items: [
        { labelKey: 'messages', href: '/dashboard/student/messages' },
        { labelKey: 'mentoring', href: '/dashboard/student/mentoring' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/student/analytics' },
        { labelKey: 'activity', href: '/dashboard/student/activity' },
        { labelKey: 'certifications', href: '/dashboard/student/certifications' },
        { labelKey: 'personality', href: '/dashboard/student/personality' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'exchange', href: '/dashboard/student/exchange' },
        { labelKey: 'courses', href: '/dashboard/student/courses' },
        { labelKey: 'challenges', href: '/dashboard/student/challenges' },
        { labelKey: 'employerReviews', href: '/dashboard/student/reviews' },
        { labelKey: 'feedback', href: '/dashboard/student/feedback' },
        { labelKey: 'privacy', href: '/dashboard/student/privacy' },
        { labelKey: 'settings', href: '/dashboard/student/settings' },
      ],
    },
  ],
}

const recruiter: NavConfig = {
  groups: [
    {
      labelKey: 'talent',
      items: [
        { labelKey: 'candidates', href: '/dashboard/recruiter/candidates' },
        { labelKey: 'talentDiscovery', href: '/dashboard/recruiter/talent-discovery' },
        { labelKey: 'advancedSearch', href: '/dashboard/recruiter/advanced-search' },
        { labelKey: 'aiSearch', href: '/dashboard/recruiter/ai-search' },
        { labelKey: 'aiShortlist', href: '/dashboard/recruiter/ai-shortlist' },
        { labelKey: 'geographicSearch', href: '/dashboard/recruiter/geographic-search' },
        { labelKey: 'courseSearch', href: '/dashboard/recruiter/course-search' },
        { labelKey: 'savedCandidates', href: '/dashboard/recruiter/saved-candidates' },
        { labelKey: 'savedSearches', href: '/dashboard/recruiter/saved-searches' },
      ],
    },
    {
      labelKey: 'jobs',
      items: [
        { labelKey: 'listings', href: '/dashboard/recruiter/jobs' },
        { labelKey: 'postJob', href: '/dashboard/recruiter/post-job' },
        { labelKey: 'positions', href: '/dashboard/recruiter/positions' },
      ],
    },
    {
      labelKey: 'messages',
      items: [
        { labelKey: 'messages', href: '/dashboard/recruiter/messages' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/recruiter/analytics' },
        { labelKey: 'talentAnalytics', href: '/dashboard/recruiter/talent-analytics' },
        { labelKey: 'marketIntelligence', href: '/dashboard/recruiter/market-intelligence' },
      ],
    },
    {
      labelKey: 'hiring',
      items: [
        { labelKey: 'decisionPacks', href: '/dashboard/recruiter/decision-pack' },
        { labelKey: 'compareCandidates', href: '/dashboard/recruiter/compare' },
        { labelKey: 'hiringOutcomes', href: '/dashboard/recruiter/hiring-outcomes' },
        { labelKey: 'contractTransparency', href: '/dashboard/recruiter/contract-transparency' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'challenges', href: '/dashboard/recruiter/challenges' },
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
        { labelKey: 'addStudent', href: '/dashboard/university/students/add' },
        { labelKey: 'importStudents', href: '/dashboard/university/students/import' },
      ],
    },
    {
      labelKey: 'academics',
      items: [
        { labelKey: 'courses', href: '/dashboard/university/courses' },
        { labelKey: 'departments', href: '/dashboard/university/departments' },
        { labelKey: 'projects', href: '/dashboard/university/projects' },
      ],
    },
    {
      labelKey: 'career',
      items: [
        { labelKey: 'placements', href: '/dashboard/university/placements' },
        { labelKey: 'recruiters', href: '/dashboard/university/recruiters' },
        { labelKey: 'alumni', href: '/dashboard/university/alumni' },
      ],
    },
    {
      labelKey: 'exchange',
      items: [
        { labelKey: 'partnerships', href: '/dashboard/university/partnerships' },
        { labelKey: 'exchangeStudents', href: '/dashboard/university/exchange-students' },
        { labelKey: 'events', href: '/dashboard/university/events' },
      ],
    },
    {
      labelKey: 'insights',
      items: [
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'placementAnalytics', href: '/dashboard/university/placement-analytics' },
        { labelKey: 'skillsGap', href: '/dashboard/university/skills-gap' },
        { labelKey: 'curriculumAlignment', href: '/dashboard/university/curriculum-alignment' },
        { labelKey: 'companyEngagement', href: '/dashboard/university/company-engagement' },
        { labelKey: 'placementReport', href: '/dashboard/university/placement-report' },
        { labelKey: 'contractAnalytics', href: '/dashboard/university/contract-analytics' },
      ],
    },
    {
      labelKey: 'more',
      items: [
        { labelKey: 'challenges', href: '/dashboard/university/challenges' },
        { labelKey: 'aiSearch', href: '/dashboard/university/ai-search' },
        { labelKey: 'careerDay', href: '/dashboard/university/career-day' },
        { labelKey: 'embedConfig', href: '/dashboard/university/embed-config' },
        { labelKey: 'sync', href: '/dashboard/university/sync' },
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
