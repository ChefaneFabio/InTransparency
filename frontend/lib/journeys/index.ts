/**
 * User journey definitions per role.
 *
 * Each journey is an ordered list of "steps" that guide a user from first
 * login to the high-value habits of the platform. The <JourneyPanel/>
 * component renders these as a checklist with progress, links, and
 * completion detection (where the API surface allows).
 *
 * Steps are intentionally small and recurring — students re-add projects,
 * recruiters post new jobs every week. The journey is not a one-shot
 * onboarding wizard; it's the ambient "what should I do next" companion
 * that stays available as long as the user wants it.
 */

export type JourneySegment = 'student' | 'recruiter' | 'institution'

export interface JourneyStep {
  /** Stable key for storing per-step completion. */
  key: string
  /** Short label shown in the checklist. */
  label: string
  /** Longer hint shown when the panel is expanded. */
  hint: string
  /** Where the CTA takes them. */
  href: string
  /** CTA button label. */
  cta: string
  /**
   * Optional API check that returns true if this step is already done.
   * If omitted, the step relies on local "I marked it done" state only.
   */
  detect?: () => Promise<boolean>
}

export interface Journey {
  /** Stable key (one per segment for now). */
  key: string
  /** Title shown at the top of the panel. */
  title: string
  /** One-sentence framing. */
  subtitle: string
  segment: JourneySegment
  steps: JourneyStep[]
}

// ── Helpers for detection ──
async function fetchOk(url: string): Promise<any | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ───────────────────────────────────────────────────────────────────────
// STUDENT JOURNEY
// ───────────────────────────────────────────────────────────────────────
const STUDENT_JOURNEY: Journey = {
  key: 'student-v1',
  title: 'Your first week on InTransparency',
  subtitle: 'Build verified evidence, then let recruiters find you.',
  segment: 'student',
  steps: [
    {
      key: 'profile',
      label: 'Complete your profile',
      hint: 'Photo, bio, university — recruiters need to see who you are before they engage.',
      href: '/dashboard/student/profile',
      cta: 'Edit profile',
      detect: async () => {
        const data = await fetchOk('/api/dashboard/student/profile')
        return !!(data?.profile?.bio && data?.profile?.photo)
      },
    },
    {
      key: 'first-project',
      label: 'Add your first project',
      hint: 'A real project is worth a hundred bullet points on a CV.',
      href: '/dashboard/student/projects/new',
      cta: 'Add project',
      detect: async () => {
        const data = await fetchOk('/api/projects?mine=1&limit=1')
        return Array.isArray(data?.projects) && data.projects.length > 0
      },
    },
    {
      key: 'self-discovery',
      label: 'Run the 6-step self-discovery',
      hint: 'Capire chi sei, before showing yourself. Generates your fit profile.',
      href: '/self-discovery',
      cta: 'Start discovery',
      detect: async () => {
        const data = await fetchOk('/api/student/self-discovery')
        return (data?.profile?.stepsCompleted ?? 0) >= 6
      },
    },
    {
      key: 'cv',
      label: 'Generate your Europass CV',
      hint: 'Auto-built from your profile + projects. Recruiters still ask for it.',
      href: '/dashboard/student/cv',
      cta: 'Generate CV',
    },
    {
      key: 'first-application',
      label: 'Apply to your first match',
      hint: 'AI-recommended jobs based on your skills + fit profile.',
      href: '/dashboard/student/matches',
      cta: 'See matches',
      detect: async () => {
        const data = await fetchOk('/api/dashboard/student/applications')
        return Array.isArray(data?.applications) && data.applications.length > 0
      },
    },
    {
      key: 'endorsement',
      label: 'Request a professor endorsement',
      hint: 'A signed endorsement turns a project claim into verified evidence.',
      href: '/dashboard/student/projects',
      cta: 'Open projects',
    },
  ],
}

// ───────────────────────────────────────────────────────────────────────
// RECRUITER JOURNEY
// ───────────────────────────────────────────────────────────────────────
const RECRUITER_JOURNEY: Journey = {
  key: 'recruiter-v1',
  title: 'First day as a recruiter',
  subtitle: 'Set up your brand, post a role, find your first verified candidate.',
  segment: 'recruiter',
  steps: [
    {
      key: 'company-profile',
      label: 'Complete your company profile',
      hint: 'Logo, about, industry. Use "Auto-fill from your domain" — one click does most of it.',
      href: '/dashboard/recruiter/settings',
      cta: 'Open settings',
      detect: async () => {
        const data = await fetchOk('/api/dashboard/recruiter/settings')
        return !!(
          data?.settings?.companyName &&
          data?.settings?.companyDescription &&
          data?.settings?.companyLogo
        )
      },
    },
    {
      key: 'first-job',
      label: 'Post your first job',
      hint: 'Paste an existing JD or URL — the AI parser fills the form for you.',
      href: '/dashboard/recruiter/jobs/new',
      cta: 'Post a job',
      detect: async () => {
        const data = await fetchOk('/api/dashboard/recruiter/jobs')
        return Array.isArray(data?.jobs) && data.jobs.length > 0
      },
    },
    {
      key: 'first-search',
      label: 'Run a candidate search',
      hint: 'Verified profiles only — filter by skills, university, fit score.',
      href: '/dashboard/recruiter/candidates',
      cta: 'Search candidates',
    },
    {
      key: 'first-contact',
      label: 'Contact your first candidate',
      hint: 'Free tier gives 5 contacts/month per company domain. Use them on the highest-fit profiles.',
      href: '/dashboard/recruiter/candidates',
      cta: 'Find a candidate',
      detect: async () => {
        const data = await fetchOk('/api/recruiter/contacts')
        return (data?.totalContacted ?? 0) > 0
      },
    },
    {
      key: 'decision-pack',
      label: 'Generate your first Decision Pack',
      hint: 'One-page PDF with all the evidence — share with the hiring committee.',
      href: '/dashboard/recruiter/decision-pack',
      cta: 'Open Decision Packs',
    },
    {
      key: 'integrate-ats',
      label: 'Connect your ATS (optional)',
      hint: 'Two-way sync with Greenhouse, Lever, Workday. Keep your existing source of truth.',
      href: '/dashboard/recruiter/integrations',
      cta: 'See integrations',
    },
  ],
}

// ───────────────────────────────────────────────────────────────────────
// INSTITUTION JOURNEY
// ───────────────────────────────────────────────────────────────────────
const INSTITUTION_JOURNEY: Journey = {
  key: 'institution-v1',
  title: 'Set up your career office workspace',
  subtitle: 'Replace spreadsheets with M1–M4: Inbox, Offers, CRM, Pipeline.',
  segment: 'institution',
  steps: [
    {
      key: 'students',
      label: 'Import your students',
      hint: 'CSV/Excel import or AlmaLaurea sync. The roster anchors everything else.',
      href: '/dashboard/university/students/import',
      cta: 'Import students',
      detect: async () => {
        const data = await fetchOk('/api/dashboard/university/students?limit=1')
        return Array.isArray(data?.students) && data.students.length > 0
      },
    },
    {
      key: 'inbox',
      label: 'Review the Mediation Inbox (M1)',
      hint: 'Recruiter messages to your students wait for staff approval here.',
      href: '/dashboard/university/inbox',
      cta: 'Open Inbox',
    },
    {
      key: 'crm',
      label: 'Add your first company in the CRM (M3)',
      hint: 'Drag-and-drop kanban from first contact to signed convention.',
      href: '/dashboard/university/crm',
      cta: 'Open CRM',
    },
    {
      key: 'first-convention',
      label: 'Generate your first convention',
      hint: 'Template-based on Free Core. AI-personalized clauses on Premium.',
      href: '/dashboard/university/conventions',
      cta: 'Open Convention Builder',
    },
    {
      key: 'placement-pipeline',
      label: 'Track a placement (M4)',
      hint: 'Hours log, evaluations, deadlines — full tirocinio lifecycle.',
      href: '/dashboard/university/placement-pipeline',
      cta: 'Open Placement Pipeline',
    },
    {
      key: 'analytics',
      label: 'Review your placement analytics',
      hint: 'Overview + Placement free. Skills Gap, Employers, Salary, Benchmark, Scorecard on Premium.',
      href: '/dashboard/university/analytics',
      cta: 'Open analytics',
    },
  ],
}

// ───────────────────────────────────────────────────────────────────────
// REGISTRY
// ───────────────────────────────────────────────────────────────────────
export const JOURNEYS: Record<JourneySegment, Journey> = {
  student: STUDENT_JOURNEY,
  recruiter: RECRUITER_JOURNEY,
  institution: INSTITUTION_JOURNEY,
}

export function getJourney(segment: JourneySegment): Journey {
  return JOURNEYS[segment]
}
