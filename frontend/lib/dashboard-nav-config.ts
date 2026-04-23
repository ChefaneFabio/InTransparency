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

// Restructured 2026-04-23: split the 8-item "career" dropdown into
// Discover (finding opportunities) and Applications (acting on them);
// skillPath moved to Portfolio as a growth tool alongside the skill
// graph. Journey remains the landing surface.
const student: NavConfig = {
  groups: [
    // 1. Journey — the engaging overview. Always first.
    {
      labelKey: 'journey',
      items: [
        { labelKey: 'journey', href: '/dashboard/student/journey' },
      ],
    },
    // 2. Portfolio — everything that represents "who you are"
    {
      labelKey: 'portfolio',
      items: [
        { labelKey: 'projects',    href: '/dashboard/student/projects' },
        { labelKey: 'profile',     href: '/dashboard/student/profile' },
        { labelKey: 'cv',          href: '/dashboard/student/cv' },
        { labelKey: 'skillGraph',  href: '/dashboard/student/skill-graph' },
        { labelKey: 'skillPath',   href: '/dashboard/student/skill-path' },
        { labelKey: 'credentials', href: '/dashboard/student/credentials' },
      ],
    },
    // 3. Discover — finding opportunities
    {
      labelKey: 'discover',
      items: [
        { labelKey: 'jobs',              href: '/dashboard/student/jobs' },
        { labelKey: 'rolesForYou',       href: '/dashboard/student/roles' },
        { labelKey: 'matches',           href: '/dashboard/student/matches' },
        { labelKey: 'discoverCompanies', href: '/discover' },
        { labelKey: 'selfDiscovery',     href: '/self-discovery' },
      ],
    },
    // 4. Applications — acting on opportunities + your tirocinio
    {
      labelKey: 'applications',
      items: [
        { labelKey: 'applications', href: '/dashboard/student/applications' },
        { labelKey: 'tirocinio',    href: '/dashboard/student/tirocinio' },
      ],
    },
    // 5. Community — messages, challenges
    {
      labelKey: 'community',
      items: [
        { labelKey: 'messages',   href: '/dashboard/student/messages' },
        { labelKey: 'challenges', href: '/dashboard/student/challenges' },
      ],
    },
    // 6. Settings — analytics, privacy, integrations, preferences
    {
      labelKey: 'settings',
      items: [
        { labelKey: 'analytics',    href: '/dashboard/student/analytics' },
        { labelKey: 'integrations', href: '/dashboard/student/integrations' },
        { labelKey: 'privacy',      href: '/dashboard/student/privacy' },
        { labelKey: 'settings',     href: '/dashboard/student/settings' },
      ],
    },
  ],
}

const recruiter: NavConfig = {
  groups: [
    // 1. AI Tools — the differentiators (Assistant + Hiring Advisor +
    //    Interview Kit live here as one family). Most recruiters will
    //    start from the Assistant now.
    {
      labelKey: 'aiTools',
      items: [
        { labelKey: 'assistant',     href: '/dashboard/recruiter/assistant' },
        { labelKey: 'hiringAdvisor', href: '/dashboard/recruiter/hiring-advisor' },
        { labelKey: 'interviewKit',  href: '/dashboard/recruiter/interview-kit' },
      ],
    },
    // 2. Talent — finding + evaluating candidates
    {
      labelKey: 'talent',
      items: [
        { labelKey: 'candidates',    href: '/dashboard/recruiter/candidates' },
        { labelKey: 'talentMatch',   href: '/dashboard/recruiter/talent-match' },
        { labelKey: 'compare',       href: '/dashboard/recruiter/compare' },
        { labelKey: 'decisionPacks', href: '/dashboard/recruiter/decision-pack' },
      ],
    },
    // 3. Pipeline — kanban of saved candidates moving through stages
    {
      labelKey: 'pipeline',
      items: [
        { labelKey: 'pipeline', href: '/dashboard/recruiter/pipeline' },
      ],
    },
    // 4. Jobs — offers lifecycle
    {
      labelKey: 'jobs',
      items: [
        { labelKey: 'listings', href: '/dashboard/recruiter/jobs' },
      ],
    },
    // 5. Communicate — messages + challenges
    {
      labelKey: 'communicate',
      items: [
        { labelKey: 'messages',   href: '/dashboard/recruiter/messages' },
        { labelKey: 'challenges', href: '/dashboard/recruiter/challenges' },
      ],
    },
    // 6. Brand — company profile surface recruiters maintain
    {
      labelKey: 'brand',
      items: [
        { labelKey: 'companyProfile',     href: '/dashboard/recruiter/company-profile' },
        { labelKey: 'followers',          href: '/dashboard/recruiter/followers' },
        { labelKey: 'universityInsights', href: '/dashboard/recruiter/university-insights' },
      ],
    },
    // 7. Settings — analytics, documents, integrations, preferences
    {
      labelKey: 'settings',
      items: [
        { labelKey: 'analytics',    href: '/dashboard/recruiter/analytics' },
        { labelKey: 'integrations', href: '/dashboard/recruiter/integrations' },
        { labelKey: 'documents',    href: '/dashboard/recruiter/documents' },
        { labelKey: 'settings',     href: '/dashboard/recruiter/settings' },
      ],
    },
  ],
}

// Institution type determines which nav items are visible
export type InstitutionType = 'university' | 'its' | 'school' | 'other'

// Restructured 2026-04-23: Workspace (paid M1-M4) up front, Students +
// Analytics cleanly separated, "Career" split into action vs reporting
// to reduce the 12-item dropdown. Academic-program items live under
// "Programmi" and are hidden for ITS.
const universityBase: NavConfig = {
  groups: [
    // 1. Workspace — the paid institutional modules (M1-M4). Most
    //    daily staff activity lives here. Always first.
    {
      labelKey: 'workspace',
      items: [
        { labelKey: 'inbox',             href: '/dashboard/university/inbox' },
        { labelKey: 'offers',            href: '/dashboard/university/offers' },
        { labelKey: 'crm',               href: '/dashboard/university/crm' },
        { labelKey: 'placementPipeline', href: '/dashboard/university/placement-pipeline' },
      ],
    },
    // 2. Students roster
    {
      labelKey: 'students',
      items: [
        { labelKey: 'list',     href: '/dashboard/university/students' },
        { labelKey: 'projects', href: '/dashboard/university/projects' },
        { labelKey: 'courses',  href: '/dashboard/university/courses' },
      ],
    },
    // 3. AI & Compliance — differentiator surfaces (assistant, audit)
    {
      labelKey: 'aiCompliance',
      items: [
        { labelKey: 'assistant', href: '/dashboard/university/assistant' },
        { labelKey: 'auditLog',  href: '/dashboard/university/audit-log' },
      ],
    },
    // 4. Events & Conventions — transactional activities
    {
      labelKey: 'eventsConventions',
      items: [
        { labelKey: 'events',         href: '/dashboard/university/events' },
        { labelKey: 'conventions',    href: '/dashboard/university/conventions' },
        { labelKey: 'communications', href: '/dashboard/university/communications' },
      ],
    },
    // 5. Analytics — reporting / read-only
    {
      labelKey: 'analytics',
      items: [
        { labelKey: 'placements',    href: '/dashboard/university/placements' },
        { labelKey: 'skillsGap',     href: '/dashboard/university/skills-gap' },
        { labelKey: 'scorecard',     href: '/dashboard/university/scorecard' },
        { labelKey: 'analyticsMain', href: '/dashboard/university/analytics' },
      ],
    },
    // 6. Programmi — academic programs (university-only; filtered out for ITS)
    {
      labelKey: 'programs',
      items: [
        { labelKey: 'curriculumAlignment', href: '/dashboard/university/curriculum-alignment' },
        { labelKey: 'careerPaths',         href: '/dashboard/university/career-paths' },
        { labelKey: 'skillsIntelligence',  href: '/dashboard/university/skills-intelligence' },
        { labelKey: 'exchanges',           href: '/dashboard/university/exchanges' },
      ],
    },
    // 7. Settings
    {
      labelKey: 'settings',
      items: [
        { labelKey: 'integrations', href: '/dashboard/university/integrations' },
        { labelKey: 'documents',    href: '/dashboard/university/documents' },
        { labelKey: 'billing',      href: '/dashboard/university/billing' },
        { labelKey: 'settings',     href: '/dashboard/university/settings' },
      ],
    },
  ],
}

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
        { labelKey: 'scorecard', href: '/dashboard/university/scorecard' },
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'documents', href: '/dashboard/university/documents' },
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
        { labelKey: 'scorecard', href: '/dashboard/university/scorecard' },
        { labelKey: 'analytics', href: '/dashboard/university/analytics' },
        { labelKey: 'documents', href: '/dashboard/university/documents' },
        { labelKey: 'settings', href: '/dashboard/university/settings' },
      ],
    },
  ],
}

export const getUniversityNavForType = (institutionType?: string): NavConfig => {
  switch (institutionType) {
    case 'its':
      // ITS Academies don't have the broader academic-program concepts
      // (curriculum alignment across faculties, Erasmus exchanges). Keep
      // the core workspace + analytics; strip "Programmi".
      return {
        groups: universityBase.groups.filter(g => g.labelKey !== 'programs'),
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
