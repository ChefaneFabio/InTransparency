/**
 * User journey definitions per role.
 *
 * Each journey is an ordered list of "steps" that guide a user from first
 * login to the high-value habits of the platform. The <JourneyPanel/>
 * component renders these as a checklist with progress, links, and
 * completion detection (where the API surface allows).
 *
 * Bilingual: pass a locale ('en' | 'it') to `getJourney()` to get the
 * localized version. Steps + detect logic are language-agnostic; only
 * the display strings (title/subtitle/label/hint/cta) vary.
 */

export type JourneySegment = 'student' | 'recruiter' | 'institution'
export type Locale = 'en' | 'it'

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
  /** Optional API check that returns true if this step is already done. */
  detect?: () => Promise<boolean>
}

export interface Journey {
  key: string
  title: string
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

const DETECTORS = {
  studentProfile: async () => {
    const data = await fetchOk('/api/dashboard/student/profile')
    return !!(data?.profile?.bio && data?.profile?.photo)
  },
  studentFirstProject: async () => {
    const data = await fetchOk('/api/projects?mine=1&limit=1')
    return Array.isArray(data?.projects) && data.projects.length > 0
  },
  studentSelfDiscovery: async () => {
    const data = await fetchOk('/api/student/self-discovery')
    return (data?.profile?.stepsCompleted ?? 0) >= 6
  },
  studentFirstApplication: async () => {
    const data = await fetchOk('/api/applications?limit=1')
    return Array.isArray(data?.applications) && data.applications.length > 0
  },
  recruiterCompanyProfile: async () => {
    const data = await fetchOk('/api/dashboard/recruiter/settings')
    return !!(
      data?.settings?.companyName &&
      data?.settings?.companyDescription &&
      data?.settings?.companyLogo
    )
  },
  recruiterFirstJob: async () => {
    const data = await fetchOk('/api/dashboard/recruiter/jobs')
    return Array.isArray(data?.jobs) && data.jobs.length > 0
  },
  recruiterFirstContact: async () => {
    const data = await fetchOk('/api/recruiter/contacts')
    return (data?.totalContacted ?? 0) > 0
  },
  institutionStudents: async () => {
    const data = await fetchOk('/api/dashboard/university/students?limit=1')
    return Array.isArray(data?.students) && data.students.length > 0
  },
}

// ───────────────────────────────────────────────────────────────────────
// CONTENT — keyed by locale + segment
// ───────────────────────────────────────────────────────────────────────
const STUDENT_JOURNEY: Record<Locale, Journey> = {
  en: {
    key: 'student-v1',
    title: 'Your first week on InTransparency',
    subtitle: 'Build verified evidence, then let recruiters find you.',
    segment: 'student',
    steps: [
      { key: 'profile', label: 'Complete your profile', hint: 'Photo, bio, university — recruiters need to see who you are before they engage.', href: '/dashboard/student/profile', cta: 'Edit profile', detect: DETECTORS.studentProfile },
      { key: 'first-project', label: 'Add your first project', hint: 'A real project is worth a hundred bullet points on a CV.', href: '/dashboard/student/projects/new', cta: 'Add project', detect: DETECTORS.studentFirstProject },
      { key: 'self-discovery', label: 'Run the 6-step self-discovery', hint: 'Capire chi sei, before showing yourself. Generates your fit profile.', href: '/self-discovery', cta: 'Start discovery', detect: DETECTORS.studentSelfDiscovery },
      { key: 'cv', label: 'Generate your Europass CV', hint: 'Auto-built from your profile + projects. Recruiters still ask for it.', href: '/dashboard/student/cv', cta: 'Generate CV' },
      { key: 'first-application', label: 'Apply to your first match', hint: 'AI-recommended jobs based on your skills + fit profile.', href: '/dashboard/student/matches', cta: 'See matches', detect: DETECTORS.studentFirstApplication },
      { key: 'endorsement', label: 'Request a professor endorsement', hint: 'A signed endorsement turns a project claim into verified evidence.', href: '/dashboard/student/projects', cta: 'Open projects' },
    ],
  },
  it: {
    key: 'student-v1',
    title: 'La tua prima settimana su InTransparency',
    subtitle: 'Costruisci evidenze verificate, poi lascia che i recruiter ti trovino.',
    segment: 'student',
    steps: [
      { key: 'profile', label: 'Completa il tuo profilo', hint: 'Foto, bio, università — i recruiter devono capire chi sei prima di contattarti.', href: '/dashboard/student/profile', cta: 'Modifica profilo', detect: DETECTORS.studentProfile },
      { key: 'first-project', label: 'Aggiungi il tuo primo progetto', hint: 'Un progetto reale vale più di cento punti elenco su un CV.', href: '/dashboard/student/projects/new', cta: 'Aggiungi progetto', detect: DETECTORS.studentFirstProject },
      { key: 'self-discovery', label: 'Fai i 6 passi di auto-esplorazione', hint: 'Capire chi sei, prima di mostrarti. Genera il tuo fit profile.', href: '/self-discovery', cta: 'Inizia', detect: DETECTORS.studentSelfDiscovery },
      { key: 'cv', label: 'Genera il tuo CV Europass', hint: 'Costruito automaticamente dal profilo + progetti. I recruiter lo chiedono ancora.', href: '/dashboard/student/cv', cta: 'Genera CV' },
      { key: 'first-application', label: 'Candidati al tuo primo match', hint: 'Lavori consigliati dall\'AI basati su competenze + fit profile.', href: '/dashboard/student/matches', cta: 'Vedi i match', detect: DETECTORS.studentFirstApplication },
      { key: 'endorsement', label: 'Chiedi un endorsement al professore', hint: 'Un endorsement firmato trasforma una dichiarazione in evidenza verificata.', href: '/dashboard/student/projects', cta: 'Apri progetti' },
    ],
  },
}

const RECRUITER_JOURNEY: Record<Locale, Journey> = {
  en: {
    key: 'recruiter-v1',
    title: 'First day as a recruiter',
    subtitle: 'Set up your brand, post a role, find your first verified candidate.',
    segment: 'recruiter',
    steps: [
      { key: 'company-profile', label: 'Complete your company profile', hint: 'Logo, about, industry. Use "Auto-fill from your domain" — one click does most of it.', href: '/dashboard/recruiter/settings', cta: 'Open settings', detect: DETECTORS.recruiterCompanyProfile },
      { key: 'first-job', label: 'Post your first job', hint: 'Paste an existing JD or URL — the AI parser fills the form for you.', href: '/dashboard/recruiter/jobs/new', cta: 'Post a job', detect: DETECTORS.recruiterFirstJob },
      { key: 'first-search', label: 'Run a candidate search', hint: 'Verified profiles only — filter by skills, university, fit score.', href: '/dashboard/recruiter/candidates', cta: 'Search candidates' },
      { key: 'first-contact', label: 'Contact your first candidate', hint: 'Free tier gives 5 contacts/month per company domain. Use them on the highest-fit profiles.', href: '/dashboard/recruiter/candidates', cta: 'Find a candidate', detect: DETECTORS.recruiterFirstContact },
      { key: 'decision-pack', label: 'Generate your first Decision Pack', hint: 'One-page PDF with all the evidence — share with the hiring committee.', href: '/dashboard/recruiter/decision-pack', cta: 'Open Decision Packs' },
      { key: 'integrate-ats', label: 'Connect your ATS (optional)', hint: 'Two-way sync with Greenhouse, Lever, Workday. Keep your existing source of truth.', href: '/dashboard/recruiter/integrations', cta: 'See integrations' },
    ],
  },
  it: {
    key: 'recruiter-v1',
    title: 'Il tuo primo giorno come recruiter',
    subtitle: 'Configura il brand, pubblica un ruolo, trova il primo candidato verificato.',
    segment: 'recruiter',
    steps: [
      { key: 'company-profile', label: 'Completa il profilo azienda', hint: 'Logo, descrizione, settore. Usa "Auto-fill dal dominio" — un click fa quasi tutto.', href: '/dashboard/recruiter/settings', cta: 'Apri impostazioni', detect: DETECTORS.recruiterCompanyProfile },
      { key: 'first-job', label: 'Pubblica la tua prima offerta', hint: 'Incolla una JD esistente o un URL — il parser AI riempie il form per te.', href: '/dashboard/recruiter/jobs/new', cta: 'Pubblica offerta', detect: DETECTORS.recruiterFirstJob },
      { key: 'first-search', label: 'Cerca candidati', hint: 'Solo profili verificati — filtra per competenze, università, fit score.', href: '/dashboard/recruiter/candidates', cta: 'Cerca candidati' },
      { key: 'first-contact', label: 'Contatta il primo candidato', hint: 'Il piano Free dà 5 contatti/mese per dominio aziendale. Usali sui profili più in target.', href: '/dashboard/recruiter/candidates', cta: 'Trova un candidato', detect: DETECTORS.recruiterFirstContact },
      { key: 'decision-pack', label: 'Genera il primo Decision Pack', hint: 'PDF di una pagina con tutte le evidenze — condividi col comitato di selezione.', href: '/dashboard/recruiter/decision-pack', cta: 'Apri Decision Pack' },
      { key: 'integrate-ats', label: 'Collega il tuo ATS (opzionale)', hint: 'Sync bidirezionale con Greenhouse, Lever, Workday. Mantieni il tuo source-of-truth.', href: '/dashboard/recruiter/integrations', cta: 'Integrazioni' },
    ],
  },
}

const INSTITUTION_JOURNEY: Record<Locale, Journey> = {
  en: {
    key: 'institution-v1',
    title: 'Set up your career office workspace',
    subtitle: 'Replace spreadsheets with M1–M4: Inbox, Offers, CRM, Pipeline.',
    segment: 'institution',
    steps: [
      { key: 'students', label: 'Import your students', hint: 'CSV/Excel import or AlmaLaurea sync. The roster anchors everything else.', href: '/dashboard/university/students/import', cta: 'Import students', detect: DETECTORS.institutionStudents },
      { key: 'inbox', label: 'Review the Mediation Inbox (M1)', hint: 'Recruiter messages to your students wait for staff approval here.', href: '/dashboard/university/inbox', cta: 'Open Inbox' },
      { key: 'crm', label: 'Add your first company in the CRM (M3)', hint: 'Drag-and-drop kanban from first contact to signed convention.', href: '/dashboard/university/crm', cta: 'Open CRM' },
      { key: 'first-convention', label: 'Generate your first convention', hint: 'Template-based on Free Core. AI-personalized clauses on Premium.', href: '/dashboard/university/conventions', cta: 'Open Convention Builder' },
      { key: 'placement-pipeline', label: 'Track a placement (M4)', hint: 'Hours log, evaluations, deadlines — full tirocinio lifecycle.', href: '/dashboard/university/placement-pipeline', cta: 'Open Placement Pipeline' },
      { key: 'analytics', label: 'Review your placement analytics', hint: 'Overview + Placement free. Skills Gap, Employers, Salary, Benchmark, Scorecard on Premium.', href: '/dashboard/university/analytics', cta: 'Open analytics' },
    ],
  },
  it: {
    key: 'institution-v1',
    title: 'Configura la workspace del career office',
    subtitle: 'Sostituisci i fogli Excel con M1–M4: Inbox, Offerte, CRM, Pipeline.',
    segment: 'institution',
    steps: [
      { key: 'students', label: 'Importa i tuoi studenti', hint: 'Import CSV/Excel o sync AlmaLaurea. L\'anagrafica è la base di tutto.', href: '/dashboard/university/students/import', cta: 'Importa studenti', detect: DETECTORS.institutionStudents },
      { key: 'inbox', label: 'Modera la Mediation Inbox (M1)', hint: 'I messaggi dei recruiter ai tuoi studenti aspettano l\'approvazione dello staff qui.', href: '/dashboard/university/inbox', cta: 'Apri Inbox' },
      { key: 'crm', label: 'Aggiungi la prima azienda al CRM (M3)', hint: 'Kanban drag-and-drop dal primo contatto alla convenzione firmata.', href: '/dashboard/university/crm', cta: 'Apri CRM' },
      { key: 'first-convention', label: 'Genera la prima convenzione', hint: 'Basata su template nel Free Core. Clausole AI-personalizzate in Premium.', href: '/dashboard/university/conventions', cta: 'Apri Convention Builder' },
      { key: 'placement-pipeline', label: 'Traccia un placement (M4)', hint: 'Registro ore, valutazioni, scadenze — ciclo completo del tirocinio.', href: '/dashboard/university/placement-pipeline', cta: 'Apri Pipeline' },
      { key: 'analytics', label: 'Vedi le analytics di placement', hint: 'Overview + Placement gratis. Skills Gap, Employers, Salary, Benchmark, Scorecard in Premium.', href: '/dashboard/university/analytics', cta: 'Apri analytics' },
    ],
  },
}

const JOURNEYS_BY_LOCALE: Record<Locale, Record<JourneySegment, Journey>> = {
  en: {
    student: STUDENT_JOURNEY.en,
    recruiter: RECRUITER_JOURNEY.en,
    institution: INSTITUTION_JOURNEY.en,
  },
  it: {
    student: STUDENT_JOURNEY.it,
    recruiter: RECRUITER_JOURNEY.it,
    institution: INSTITUTION_JOURNEY.it,
  },
}

export function getJourney(segment: JourneySegment, locale: Locale = 'en'): Journey {
  return JOURNEYS_BY_LOCALE[locale]?.[segment] || JOURNEYS_BY_LOCALE.en[segment]
}

// Backwards-compat default export — defaults to English
export const JOURNEYS = JOURNEYS_BY_LOCALE.en
