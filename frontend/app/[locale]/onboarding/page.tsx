'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  User,
  MapPin,
  Calendar,
  Loader2,
  Search,
  TrendingDown,
  BarChart3,
  Eye,
  Link2,
  ClipboardList,
  Moon,
  RefreshCw,
  Factory,
  Clock,
  UserCheck,
  FileText,
  BookOpen,
  HeartHandshake,
  Compass,
  Lock,
  Lightbulb,
  Zap,
  Award,
  Rocket,
  Globe,
  FolderOpen,
  Code,
  Brain,
  Palette,
  Megaphone,
  DollarSign,
  Cog,
  Scale,
  BookMarked,
  Languages,
  Heart,
  Users,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  search: Search, trendingDown: TrendingDown, barChart: BarChart3, eye: Eye,
  link: Link2, clipboard: ClipboardList, moon: Moon, refresh: RefreshCw,
  factory: Factory, clock: Clock, userCheck: UserCheck, fileText: FileText,
  bookOpen: BookOpen, handshake: HeartHandshake, compass: Compass, lock: Lock,
  lightbulb: Lightbulb, zap: Zap, award: Award, rocket: Rocket,
  globe: Globe, folder: FolderOpen, code: Code, brain: Brain,
  palette: Palette, megaphone: Megaphone, dollar: DollarSign, cog: Cog,
  scale: Scale, bookMarked: BookMarked, languages: Languages, heart: Heart,
  users: Users,
}

const OnboardingIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name]
  return Icon ? <Icon className={className || 'h-5 w-5'} /> : null
}

type UserRole = 'STUDENT' | 'RECRUITER' | 'UNIVERSITY'
type InstitutionTypeStudent = 'university' | 'its' | 'highschool' | 'bootcamp' | 'self' | 'other'
type StudentStatus = 'studying' | 'graduated' | 'pivoted'

const STUDENT_INSTITUTION_TYPES: InstitutionTypeStudent[] = [
  'university', 'its', 'highschool', 'bootcamp', 'self', 'other',
]
const STUDENT_STATUSES: StudentStatus[] = ['studying', 'graduated', 'pivoted']

interface OnboardingData {
  // Common
  firstName: string
  lastName: string
  bio: string
  photo: string

  // Student specific
  university: string
  degree: string
  graduationYear: string
  skills: string[]
  institutionType: InstitutionTypeStudent | ''
  status: StudentStatus | ''

  // Recruiter specific
  company: string
  jobTitle: string
  companySize: string

  // University specific
  institutionName: string
  institutionType: string
  institutionLogo: string
  contactName: string
  contactRole: string
  department: string
  region: string
  website: string
  studentCount: string
  focusAreas: string[]
  painPoints: string[]
  currentTools: string[]
  partnershipGoals: string[]
  topPriority: string
}

const steps = {
  STUDENT: ['Tu + Formazione', 'Competenze', 'Completa'],
  RECRUITER: ['Profilo Base', 'Azienda', 'Preferenze', 'Completa'],
  UNIVERSITY: ['Istituzione', 'Referente', 'Sfide Attuali', 'Obiettivi', 'Completa']
}

const institutionTypes = [
  { value: 'university', label: 'Scuola di Alta Formazione' },
  { value: 'its', label: 'ITS Academy' },
  { value: 'school', label: 'Scuola Superiore' },
  { value: 'other', label: 'Altro' },
]

const focusAreaOptions = [
  'STEM', 'Economia & Business', 'Giurisprudenza', 'Scienze Umane',
  'Design & Arti', 'Medicina & Sanità', 'Ingegneria', 'Lingue',
  'Scienze Sociali', 'Comunicazione & Media', 'Agricoltura & Ambiente',
]

interface PainPoint {
  value: string
  label: string
  context: string
  solution: string
  icon: string
  types: string[] // which institution types this applies to
}

interface GoalOption {
  value: string
  label: string
  description: string
  types: string[] // which institution types this applies to
}

const allPainPoints: PainPoint[] = [
  // === SHARED: University + ITS ===
  {
    value: 'no-skills-visibility',
    label: 'Non abbiamo visibilità sulle competenze reali degli studenti',
    context: "L'88% dei neolaureati non si sente preparato per il lavoro (LinkedIn, 2026)",
    solution: 'Skills Gap Analysis — mappa in tempo reale le competenze dei vostri studenti vs la domanda di mercato',
    icon: 'search',
    types: ['university', 'its'],
  },
  {
    value: 'curriculum-gap',
    label: 'I nostri programmi potrebbero non essere allineati a ciò che il mercato chiede',
    context: 'Le assunzioni entry-level in Italia sono calate del 18,8% in un anno',
    solution: 'Curriculum Alignment — punteggio di allineamento per ogni corso, con le competenze mancanti evidenziate',
    icon: 'trendingDown',
    types: ['university', 'its'],
  },
  {
    value: 'placement-tracking',
    label: 'Tracciare gli esiti occupazionali è difficile e manuale',
    context: 'I survey di fine anno hanno tassi di risposta sotto il 15%',
    solution: 'Placement Dashboard — funnel automatico dal primo contatto all\'assunzione, in tempo reale',
    icon: 'barChart',
    types: ['university', 'its'],
  },
  {
    value: 'student-self-awareness',
    label: 'Gli studenti faticano a capire e comunicare il proprio valore',
    context: 'Il talento oggi è quanto velocemente riesci a evolvere, non solo cosa sai fare',
    solution: 'Profili verificati con progetti, competenze e punteggio di employability — lo studente vede il proprio valore',
    icon: 'eye',
    types: ['university', 'its', 'school'],
  },
  {
    value: 'employer-disconnect',
    label: 'Le aziende non conoscono i nostri studenti e i nostri percorsi',
    context: 'Milano e Roma concentrano le opportunità — il resto d\'Italia è invisibile ai recruiter',
    solution: 'Company Leaderboard e Engagement Alerts — vedete quali aziende guardano i vostri studenti',
    icon: 'link',
    types: ['university', 'its'],
  },
  {
    value: 'manual-reporting',
    label: 'Il reporting per accreditamento e qualità richiede troppo lavoro manuale',
    context: 'Education è il settore con il calo di assunzioni più forte: -31,2%',
    solution: 'Analytics Dashboard con 6 viste + export automatici per ANVUR, INDIRE e ministero',
    icon: 'clipboard',
    types: ['university', 'its'],
  },
  {
    value: 'engagement',
    label: 'Gli studenti non partecipano ai servizi di orientamento e career service',
    context: 'Il collegamento tra formazione e lavoro è la sfida chiave per la Gen Z',
    solution: 'Eventi, attivazione studenti e feed di attività — tutto in un unico punto',
    icon: 'moon',
    types: ['university', 'its', 'school'],
  },
  {
    value: 'skills-translation',
    label: 'I voti non bastano: le aziende non capiscono cosa sanno fare i nostri studenti',
    context: 'Le competenze vanno "spacchettate" in skill concrete e spendibili (LinkedIn, 2026)',
    solution: 'Normalizzazione voti EU + Decision Pack — i recruiter vedono competenze, non solo medie',
    icon: 'refresh',
    types: ['university', 'its'],
  },
  // === ITS-SPECIFIC ===
  {
    value: 'internship-matching',
    label: 'Abbinare studenti a tirocini obbligatori è un processo lungo e manuale',
    context: 'Gli ITS richiedono 800+ ore di stage — il matching è il cuore del percorso',
    solution: 'Internship Pipeline — matching automatico studente-azienda basato su competenze, con tracking ore e valutazioni',
    icon: 'factory',
    types: ['its'],
  },
  {
    value: 'internship-hours',
    label: 'Non abbiamo un sistema per tracciare ore di stage e valutazioni aziendali',
    context: 'Il 30% del curriculum ITS è in azienda — serve visibilità in tempo reale',
    solution: 'Internship Tracker — ore, presenze, valutazioni del tutor aziendale e feedback dello studente in un unico cruscotto',
    icon: 'clock',
    types: ['its'],
  },
  {
    value: 'board-visibility',
    label: 'Le aziende nel CTS non hanno visibilità sui risultati dell\'ITS',
    context: 'Il Comitato Tecnico Scientifico guida la didattica ma spesso decide al buio',
    solution: 'Board Dashboard — vista dedicata per le aziende del CTS con outcome, skill gap e suggerimenti curricolari',
    icon: 'userCheck',
    types: ['its'],
  },
  {
    value: 'indire-reporting',
    label: 'Preparare i dati per la valutazione INDIRE è un incubo',
    context: 'INDIRE valuta placement rate, soddisfazione studenti e coerenza percorso-lavoro',
    solution: 'Report INDIRE — template precompilati con placement rate, coerenza titolo-occupazione e feedback automatici',
    icon: 'fileText',
    types: ['its'],
  },
  // === SCUOLA SUPERIORE ===
  {
    value: 'pcto-tracking',
    label: 'Gestire i PCTO è caotico: ore, convenzioni, attestati sono sparsi ovunque',
    context: 'I PCTO sono obbligatori (90-210 ore) ma spesso gestiti con fogli Excel e email',
    solution: 'PCTO Manager — tracciamento ore, convenzioni digitali, attestati automatici e report per il ministero',
    icon: 'bookOpen',
    types: ['school'],
  },
  {
    value: 'pcto-matching',
    label: 'Trovare aziende disponibili per i PCTO è difficile, soprattutto fuori dalle grandi città',
    context: 'Il 25% dei giovani cita la mancanza di opportunità locali come problema principale',
    solution: 'PCTO Marketplace — le aziende pubblicano opportunità, voi abbinate gli studenti per interesse e disponibilità',
    icon: 'handshake',
    types: ['school'],
  },
  {
    value: 'orientation',
    label: 'Gli studenti arrivano alla scelta post-diploma senza consapevolezza delle proprie attitudini',
    context: 'Il 48% dei giovani considererebbe l\'estero per mancanza di opportunità — molti non sanno cosa cercare',
    solution: 'Orientamento Attitudinale — test di interessi, mappatura soft skill e suggerimenti personalizzati su università, ITS o lavoro',
    icon: 'compass',
    types: ['school'],
  },
  {
    value: 'parental-consent',
    label: 'I nostri studenti sono minorenni: ogni dato condiviso richiede il consenso dei genitori',
    context: 'GDPR richiede consenso esplicito dei genitori per dati di minori sotto i 16 anni',
    solution: 'Consenso Genitoriale — flusso digitale di autorizzazione, visibilità controllata e privacy by design per i minori',
    icon: 'lock',
    types: ['school'],
  },
  {
    value: 'soft-skills',
    label: 'I nostri studenti non hanno ancora competenze tecniche: servono soft skill e competenze trasversali',
    context: 'Le competenze trasversali sono le più cercate per i ruoli entry-level (LinkedIn, 2026)',
    solution: 'Soft Skills Assessment — mappatura di teamwork, problem solving, comunicazione e pensiero critico con badge verificabili',
    icon: 'lightbulb',
    types: ['school'],
  },
  // === OTHER / FORMAZIONE PROFESSIONALE ===
  {
    value: 'short-courses',
    label: 'I nostri percorsi sono brevi (settimane/mesi), non lauree pluriennali',
    context: 'Il reskilling è la nuova normalità — il 37% dei giovani lamenta stipendi insufficienti',
    solution: 'Percorsi Brevi — modello flessibile per corsi da 1 settimana a 12 mesi, con certificati di completamento e skill tracking',
    icon: 'zap',
    types: ['other'],
  },
  {
    value: 'certification',
    label: 'Servono certificati verificabili, non solo voti',
    context: 'Le certificazioni di settore valgono più di una laurea per molti ruoli tecnici',
    solution: 'Certificati Digitali — emissione, verifica e condivisione di certificati con QR code e validazione blockchain-ready',
    icon: 'award',
    types: ['other'],
  },
  {
    value: 'fast-placement',
    label: 'I nostri cicli formativi sono brevi: il placement deve essere rapido',
    context: 'Chi esce da un corso di 3-6 mesi non può aspettare mesi per trovare lavoro',
    solution: 'Fast Track Placement — matching immediato con aziende che cercano le competenze appena certificate',
    icon: 'rocket',
    types: ['other'],
  },
  {
    value: 'fse-reporting',
    label: 'Dobbiamo rendicontare alla Regione e ai fondi FSE con dati precisi',
    context: 'I fondi europei FSE richiedono tracciamento puntuale di iscrizioni, completamenti e esiti occupazionali',
    solution: 'Report FSE/Regione — template conformi con dati automatici su iscrizioni, drop-out, completamenti e placement',
    icon: 'globe',
    types: ['other'],
  },
  {
    value: 'prior-learning',
    label: 'I nostri allievi hanno già esperienza lavorativa: serve mappare le competenze esistenti',
    context: 'Il reskilling riguarda adulti con skill pregresse — non partono da zero',
    solution: 'Recognition of Prior Learning — assessment iniziale delle competenze esistenti per personalizzare il percorso formativo',
    icon: 'folder',
    types: ['other'],
  },
]

const getPainPointsForType = (type: string): PainPoint[] =>
  allPainPoints.filter(p => p.types.includes(type || 'university'))

const currentToolsByType: Record<string, Array<{ value: string; label: string }>> = {
  university: [
    { value: 'excel', label: 'Excel / Fogli di calcolo' },
    { value: 'crm-custom', label: 'CRM interno / gestionale' },
    { value: 'almalaurea', label: 'AlmaLaurea' },
    { value: 'jobteaser', label: 'JobTeaser' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'paper', label: 'Processi manuali / cartacei' },
    { value: 'none', label: 'Nessuno strumento dedicato' },
  ],
  its: [
    { value: 'excel', label: 'Excel / Fogli di calcolo' },
    { value: 'crm-custom', label: 'Gestionale interno' },
    { value: 'sidi', label: 'SIDI / Portale INDIRE' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'paper', label: 'Processi manuali / cartacei' },
    { value: 'none', label: 'Nessuno strumento dedicato' },
  ],
  school: [
    { value: 'excel', label: 'Excel / Fogli di calcolo' },
    { value: 'registro', label: 'Registro elettronico' },
    { value: 'sidi', label: 'SIDI / Piattaforma PCTO' },
    { value: 'paper', label: 'Processi manuali / cartacei' },
    { value: 'none', label: 'Nessuno strumento dedicato' },
  ],
  other: [
    { value: 'excel', label: 'Excel / Fogli di calcolo' },
    { value: 'crm-custom', label: 'Gestionale interno' },
    { value: 'regione', label: 'Portale Regione / SIUF' },
    { value: 'paper', label: 'Processi manuali / cartacei' },
    { value: 'none', label: 'Nessuno strumento dedicato' },
  ],
}

const allGoalOptions: GoalOption[] = [
  // Shared
  {
    value: 'placement',
    label: 'Migliorare i tassi di placement',
    description: 'Funnel completo dal contatto all\'assunzione — saprete esattamente dove si blocca il processo',
    types: ['university', 'its'],
  },
  {
    value: 'skills-tracking',
    label: 'Rendere visibili le competenze degli studenti',
    description: 'Mappatura automatica delle skill reali, non solo dei voti — con confronto vs domanda di mercato',
    types: ['university', 'its'],
  },
  {
    value: 'curriculum-alignment',
    label: 'Allineare i programmi formativi al mercato',
    description: 'Punteggio di allineamento per ogni corso con suggerimenti su competenze da integrare',
    types: ['university', 'its'],
  },
  {
    value: 'employer-network',
    label: 'Aumentare la visibilità verso le aziende',
    description: 'I recruiter trovano i vostri studenti per competenze, non per nome dell\'ateneo',
    types: ['university', 'its'],
  },
  {
    value: 'student-activation',
    label: 'Attivare gli studenti prima della laurea',
    description: 'Profili, progetti e skill verificate — lo studente costruisce il proprio valore durante il percorso',
    types: ['university', 'its'],
  },
  {
    value: 'analytics',
    label: 'Avere dati per decidere e rendicontare',
    description: 'Dashboard con placement, skill gap, benchmark e report esportabili per accreditamento',
    types: ['university', 'its'],
  },
  // ITS-specific
  {
    value: 'internship-management',
    label: 'Gestire tirocini obbligatori end-to-end',
    description: 'Matching, ore, valutazioni e feedback — dall\'abbinamento alla chiusura dello stage',
    types: ['its'],
  },
  {
    value: 'cts-engagement',
    label: 'Dare visibilità al Comitato Tecnico Scientifico',
    description: 'Dashboard dedicata per le aziende del CTS con dati su outcome e allineamento curricolare',
    types: ['its'],
  },
  // School-specific
  {
    value: 'pcto-management',
    label: 'Gestire i PCTO in modo digitale e centralizzato',
    description: 'Ore, convenzioni, attestati e report ministeriali — tutto automatizzato',
    types: ['school'],
  },
  {
    value: 'orientation',
    label: 'Orientare gli studenti verso il percorso giusto',
    description: 'Test attitudinali, mappatura interessi e suggerimenti personalizzati per la scelta post-diploma',
    types: ['school'],
  },
  {
    value: 'soft-skills-dev',
    label: 'Sviluppare e certificare le competenze trasversali',
    description: 'Assessment di teamwork, problem solving e comunicazione con badge condivisibili',
    types: ['school'],
  },
  {
    value: 'safe-platform',
    label: 'Una piattaforma sicura per studenti minorenni',
    description: 'Consenso genitoriale, privacy by design e visibilità controllata dei dati',
    types: ['school'],
  },
  // Other / Formazione professionale
  {
    value: 'fast-reskilling',
    label: 'Accelerare il reskilling e il placement',
    description: 'Percorsi brevi con certificati digitali e matching immediato con aziende',
    types: ['other'],
  },
  {
    value: 'certification-system',
    label: 'Emettere certificati verificabili',
    description: 'Certificati digitali con QR code e validazione per ogni percorso completato',
    types: ['other'],
  },
  {
    value: 'fund-reporting',
    label: 'Rendicontare a Regione e fondi FSE',
    description: 'Report automatici conformi ai requisiti di finanziamento europeo e regionale',
    types: ['other'],
  },
  {
    value: 'prior-learning-recognition',
    label: 'Riconoscere le competenze pregresse',
    description: 'Assessment iniziale per mappare cosa gli allievi sanno già e personalizzare il percorso',
    types: ['other'],
  },
]

const getGoalsForType = (type: string): GoalOption[] =>
  allGoalOptions.filter(g => g.types.includes(type || 'university'))

const skillGroups: { name: string; icon: string; skills: string[] }[] = [
  {
    name: 'Informatica & Sviluppo',
    icon: 'code',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'Mobile Development']
  },
  {
    name: 'Data Science & AI',
    icon: 'brain',
    skills: ['Machine Learning', 'Deep Learning', 'Data Analysis', 'Data Visualization', 'NLP', 'Computer Vision', 'Statistics', 'R', 'TensorFlow', 'Power BI']
  },
  {
    name: 'Design & Creatività',
    icon: 'palette',
    skills: ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Suite', 'Branding', 'Motion Graphics', 'Photography', '3D Modeling', 'Video Editing']
  },
  {
    name: 'Business & Management',
    icon: 'barChart',
    skills: ['Project Management', 'Business Strategy', 'Agile/Scrum', 'Business Plan', 'Lean Management', 'Supply Chain', 'Operations', 'Consulting']
  },
  {
    name: 'Marketing & Comunicazione',
    icon: 'megaphone',
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Marketing', 'Social Media', 'Copywriting', 'Public Relations', 'Brand Strategy', 'Email Marketing', 'Analytics']
  },
  {
    name: 'Finanza & Economia',
    icon: 'dollar',
    skills: ['Financial Analysis', 'Accounting', 'Corporate Finance', 'Financial Modeling', 'Risk Management', 'Auditing', 'Taxation', 'Budgeting', 'ESG']
  },
  {
    name: 'Ingegneria & Scienze',
    icon: 'cog',
    skills: ['CAD/CAM', 'MATLAB', 'Mechanical Design', 'Electronics', 'Biomedical', 'Environmental Engineering', 'Materials Science', 'Lab Research', 'Quality Control']
  },
  {
    name: 'Giurisprudenza & Scienze Politiche',
    icon: 'scale',
    skills: ['Diritto Civile', 'Diritto Commerciale', 'GDPR/Privacy', 'Contrattualistica', 'Compliance', 'Public Policy', 'International Relations', 'EU Law']
  },
  {
    name: 'Scienze Umane & Sociali',
    icon: 'bookMarked',
    skills: ['Psicologia', 'Sociologia', 'Pedagogia', 'Antropologia', 'Filosofia', 'Ricerca Qualitativa', 'Ricerca Quantitativa', 'Mediazione Culturale']
  },
  {
    name: 'Lingue & Traduzione',
    icon: 'languages',
    skills: ['Inglese', 'Francese', 'Tedesco', 'Spagnolo', 'Cinese', 'Traduzione', 'Interpretariato', 'Linguistica', 'TESOL']
  },
  {
    name: 'Sanità & Scienze della Vita',
    icon: 'heart',
    skills: ['Biologia', 'Chimica', 'Farmacologia', 'Biotecnologie', 'Nutrizione', 'Anatomia', 'Clinical Research', 'Bioinformatics']
  },
  {
    name: 'Soft Skills & Trasversali',
    icon: 'users',
    skills: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Public Speaking', 'Negotiation', 'Creativity']
  },
]

export default function OnboardingPage() {
  const t = useTranslations('onboardingPage')
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    bio: '',
    photo: '',
    university: '',
    degree: '',
    graduationYear: '',
    skills: [],
    institutionType: '',
    status: '',
    company: '',
    jobTitle: '',
    companySize: '',
    institutionName: '',
    institutionType: '',
    institutionLogo: '',
    contactName: '',
    contactRole: '',
    department: '',
    region: '',
    website: '',
    studentCount: '',
    focusAreas: [],
    painPoints: [],
    currentTools: [],
    partnershipGoals: [],
    topPriority: '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const userRole = (session?.user?.role as UserRole) || 'STUDENT'
  const currentSteps = steps[userRole]
  const progress = ((currentStep + 1) / currentSteps.length) * 100

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }

    // Pre-fill data from session
    if (session?.user) {
      setData(prev => ({
        ...prev,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || ''
      }))
    }
  }, [session, status, router])

  const handleNext = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Save profile data — only send role-relevant fields
      const profilePayload: Record<string, any> = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        photo: data.photo || undefined,
      }
      if (userRole === 'STUDENT') {
        // `university` is the generic institution-name column the rest of
        // the app already reads from — works for any institutionType.
        profilePayload.university = data.university
        profilePayload.degree = data.degree
        profilePayload.graduationYear = data.graduationYear
        if (data.institutionType) profilePayload.institutionType = data.institutionType
        if (data.status) profilePayload.studentStatus = data.status
        if (data.skills.length > 0) profilePayload.skills = data.skills
      } else if (userRole === 'RECRUITER') {
        profilePayload.company = data.company
        profilePayload.jobTitle = data.jobTitle
      } else if (userRole === 'UNIVERSITY') {
        // Store institution name in company field (used as university identifier)
        profilePayload.company = data.institutionName
        profilePayload.firstName = data.contactName
        profilePayload.lastName = ''
        profilePayload.bio = data.contactRole
        profilePayload.photo = data.institutionLogo || undefined
      }

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      })

      // Sync settings so role-specific settings pages pick up onboarding data
      if (response.ok && userRole === 'RECRUITER' && data.company) {
        await fetch('/api/dashboard/recruiter/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: data.company,
            companySize: data.companySize || '',
          })
        }).catch(() => {})
      }
      if (response.ok && userRole === 'UNIVERSITY' && data.institutionName) {
        await fetch('/api/dashboard/university/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.institutionName,
            institutionType: data.institutionType || '',
            region: data.region || '',
            website: data.website || '',
            studentCount: data.studentCount || '',
            focusAreas: data.focusAreas,
            painPoints: data.painPoints,
            currentTools: data.currentTools,
            partnershipGoals: data.partnershipGoals,
            topPriority: data.topPriority || '',
            contactName: data.contactName || '',
            contactRole: data.contactRole || '',
          })
        }).catch(() => {})
      }

      if (response.ok) {
        // Redirect to role-specific dashboard after onboarding
        const dashboardRoutes: Record<string, string> = {
          STUDENT: '/dashboard/student',
          RECRUITER: '/dashboard/recruiter',
          UNIVERSITY: '/dashboard/university',
        }
        router.push(dashboardRoutes[userRole] || '/dashboard/student')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'profiles')

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const result = await res.json()
        setData(prev => ({ ...prev, photo: result.url }))
      }
    } catch (error) {
      console.error('Photo upload failed:', error)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'institutions')

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const result = await res.json()
        setData(prev => ({ ...prev, institutionLogo: result.url }))
      }
    } catch (error) {
      console.error('Logo upload failed:', error)
    } finally {
      setLogoUploading(false)
    }
  }

  const toggleFocusArea = (area: string) => {
    setData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const togglePainPoint = (point: string) => {
    setData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(point)
        ? prev.painPoints.filter(p => p !== point)
        : [...prev.painPoints, point]
    }))
  }

  const toggleCurrentTool = (tool: string) => {
    setData(prev => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter(t => t !== tool)
        : [...prev.currentTools, tool]
    }))
  }

  const togglePartnershipGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      partnershipGoals: prev.partnershipGoals.includes(goal)
        ? prev.partnershipGoals.filter(g => g !== goal)
        : [...prev.partnershipGoals, goal]
    }))
  }

  const toggleSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userRole === 'UNIVERSITY' ? t('welcomeUniversity') : t('welcome')}
          </h1>
          <p className="text-gray-600">
            {userRole === 'UNIVERSITY'
              ? t('welcomeSubtitleUniversity')
              : t('welcomeSubtitle')}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {currentSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-primary text-white' :
                  index === currentStep ? 'bg-primary/10 text-primary border-2 border-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < currentSteps.length - 1 && (
                  <div className={`h-0.5 w-12 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 text-center mt-2">
            {t('stepOf', { current: currentStep + 1, total: currentSteps.length })}: {currentSteps[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 0: Combined Profile + Formazione (Student) — 3-step flow */}
            {currentStep === 0 && userRole === 'STUDENT' && (
              <div className="space-y-6">
                {/* ── Profile section ─────────────────────────────── */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
                    {t('studentCombined.profileEyebrow')}
                  </div>
                  <div className="text-center mb-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      {data.photo ? (
                        <img src={data.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                    >
                      {photoUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('uploading')}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('uploadPhoto')}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('firstNameLabel')}</Label>
                      <Input
                        id="firstName"
                        value={data.firstName}
                        onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder={t('firstNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('lastNameLabel')}</Label>
                      <Input
                        id="lastName"
                        value={data.lastName}
                        onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder={t('lastNamePlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="bio">{t('bioLabel')}</Label>
                    <Textarea
                      id="bio"
                      value={data.bio}
                      onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder={t('bioPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>

                {/* ── Education section ──────────────────────────── */}
                <div className="border-t pt-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
                    {t('studentCombined.educationEyebrow')}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('studentCombined.educationDesc')}
                  </p>

                  {/* Institution type chips */}
                  <div className="space-y-2 mb-4">
                    <Label>{t('institutionTypeLabelStudent')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {STUDENT_INSTITUTION_TYPES.map(type => (
                        <Button
                          key={type}
                          type="button"
                          variant={data.institutionType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setData(prev => ({ ...prev, institutionType: type }))}
                        >
                          {t(`institutionTypes.${type}`)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Institution name (placeholder adapts to type) */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="university">{t('universityLabel')}</Label>
                    <Input
                      id="university"
                      value={data.university}
                      onChange={(e) => setData(prev => ({ ...prev, university: e.target.value }))}
                      placeholder={
                        data.institutionType
                          ? t(`institutionPlaceholderByType.${data.institutionType}`)
                          : t('universityPlaceholder')
                      }
                    />
                  </div>

                  {/* Degree (optional, placeholder adapts to type) */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="degree">{t('degreeLabel')}</Label>
                    <Input
                      id="degree"
                      value={data.degree}
                      onChange={(e) => setData(prev => ({ ...prev, degree: e.target.value }))}
                      placeholder={
                        data.institutionType
                          ? t(`degreePlaceholderByType.${data.institutionType}`)
                          : t('degreePlaceholder')
                      }
                    />
                  </div>

                  {/* Status radio — accommodates studying/graduated/pivoted */}
                  <div className="space-y-2 mb-4">
                    <Label>{t('statusLabel')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {STUDENT_STATUSES.map(s => (
                        <Button
                          key={s}
                          type="button"
                          variant={data.status === s ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setData(prev => ({ ...prev, status: s }))}
                          className="text-xs"
                        >
                          {t(`statusOptions.${s}`)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Graduation year — label adapts to status, optional when pivoted */}
                  {data.status && (
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">
                        {t(`graduationYearLabelByStatus.${data.status}`)}
                      </Label>
                      <Input
                        id="graduationYear"
                        value={data.graduationYear}
                        onChange={(e) => setData(prev => ({ ...prev, graduationYear: e.target.value }))}
                        placeholder={t('graduationYearPlaceholder')}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 0: Basic Profile (Recruiter only — STUDENT has its own combined step above) */}
            {currentStep === 0 && userRole === 'RECRUITER' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {data.photo ? (
                      <img src={data.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                  >
                    {photoUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('uploading')}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('uploadPhoto')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('firstNameLabel')}</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder={t('firstNamePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('lastNameLabel')}</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder={t('lastNamePlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('bioLabel')}</Label>
                  <Textarea
                    id="bio"
                    value={data.bio}
                    onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder={t('bioPlaceholder')}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 0: Institution Profile (University) */}
            {currentStep === 0 && userRole === 'UNIVERSITY' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {data.institutionLogo ? (
                      <img src={data.institutionLogo} alt="Logo" className="w-full h-full rounded-lg object-contain p-2" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading}
                  >
                    {logoUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('uploading')}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('uploadLogo')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">{t('institutionNameLabel')}</Label>
                  <Input
                    id="institutionName"
                    value={data.institutionName}
                    onChange={(e) => setData(prev => ({ ...prev, institutionName: e.target.value }))}
                    placeholder={t('institutionNamePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('institutionTypeLabel')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {institutionTypes.map(type => (
                      <Button
                        key={type.value}
                        variant={data.institutionType === type.value ? 'default' : 'outline'}
                        onClick={() => setData(prev => ({
                          ...prev,
                          institutionType: type.value,
                          // Reset type-specific selections when changing institution type
                          painPoints: [],
                          currentTools: [],
                          partnershipGoals: [],
                          topPriority: '',
                        }))}
                        className="w-full"
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('websiteLabel')}</Label>
                  <Input
                    id="website"
                    value={data.website}
                    onChange={(e) => setData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder={t('websitePlaceholder')}
                  />
                </div>
              </div>
            )}

            {/* STUDENT step 1 was Istituzione — merged into step 0. STUDENT now has 3 steps total: combined / skills / complete. Skills moved from currentStep===2 → currentStep===1 below. */}

            {currentStep === 1 && userRole === 'RECRUITER' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('companyInfoTitle')}</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('companyNameLabel')}</Label>
                    <Input
                      id="company"
                      value={data.company}
                      onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder={t('companyNamePlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">{t('jobTitleLabel')}</Label>
                    <Input
                      id="jobTitle"
                      value={data.jobTitle}
                      onChange={(e) => setData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder={t('jobTitlePlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('companySizeLabel')}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map(size => (
                        <Button
                          key={size}
                          variant={data.companySize === size ? 'default' : 'outline'}
                          onClick={() => setData(prev => ({ ...prev, companySize: size }))}
                          className="w-full"
                        >
                          {t('employeesCount', { size })}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && userRole === 'UNIVERSITY' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('contactAndLocationTitle')}</h2>
                  <p className="text-gray-600 text-sm">{t('contactAndLocationDesc')}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">{t('contactNameLabel')}</Label>
                      <Input
                        id="contactName"
                        value={data.contactName}
                        onChange={(e) => setData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder={t('contactNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactRole">{t('contactRoleLabel')}</Label>
                      <Input
                        id="contactRole"
                        value={data.contactRole}
                        onChange={(e) => setData(prev => ({ ...prev, contactRole: e.target.value }))}
                        placeholder={t('contactRolePlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">{t('departmentLabel')}</Label>
                    <Input
                      id="department"
                      value={data.department}
                      onChange={(e) => setData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder={t('departmentPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">{t('regionLabel')}</Label>
                    <Input
                      id="region"
                      value={data.region}
                      onChange={(e) => setData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder={t('regionPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT step 1: Skills (moved from step 2 in the old 4-step flow) */}
            {currentStep === 1 && userRole === 'STUDENT' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('skillsTitle')}</h2>
                  <p className="text-gray-600 text-sm">{t('skillsDesc')}</p>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {skillGroups.map((group) => {
                    const selectedInGroup = group.skills.filter(s => data.skills.includes(s)).length
                    return (
                      <div key={group.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-sm flex items-center gap-2">
                            <OnboardingIcon name={group.icon} className="h-5 w-5 text-primary" />
                            {group.name}
                          </h3>
                          {selectedInGroup > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedInGroup}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.skills.map(skill => (
                            <Badge
                              key={skill}
                              variant={data.skills.includes(skill) ? 'default' : 'outline'}
                              className="cursor-pointer py-1 px-2.5 text-xs"
                              onClick={() => toggleSkill(skill)}
                            >
                              {data.skills.includes(skill) && <Check className="h-3 w-3 mr-1" />}
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <p className="text-sm text-gray-500 text-center font-medium">
                  {t('skillsSelected', { count: data.skills.length })}
                </p>
              </div>
            )}

            {currentStep === 2 && userRole === 'RECRUITER' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('preferencesTitle')}</h2>
                </div>

                <p className="text-gray-600 text-center">
                  {t('preferencesDesc')}
                </p>
              </div>
            )}

            {/* University Step 2: Sfide Attuali (type-specific) */}
            {currentStep === 2 && userRole === 'UNIVERSITY' && (() => {
              const typePainPoints = getPainPointsForType(data.institutionType)
              const typeTools = currentToolsByType[data.institutionType] || currentToolsByType.university
              return (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('whereYouAreTitle')}</h2>
                  <p className="text-gray-600 text-sm">{t('whereYouAreDesc')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">
                      {data.institutionType === 'school' ? t('studentCountLabel') :
                       data.institutionType === 'other' ? t('traineesPerYearLabel') :
                       t('studentCountLabel')}
                    </Label>
                    <Input
                      id="studentCount"
                      value={data.studentCount}
                      onChange={(e) => setData(prev => ({ ...prev, studentCount: e.target.value }))}
                      placeholder={data.institutionType === 'school' ? t('studentCountPlaceholderSchool') :
                                   data.institutionType === 'other' ? t('studentCountPlaceholderOther') : t('studentCountPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {data.institutionType === 'school' ? t('tracksLabel') :
                       data.institutionType === 'other' ? t('sectorsLabel') :
                       t('disciplineAreasLabel')}
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {focusAreaOptions.map(area => (
                        <Badge
                          key={area}
                          variant={data.focusAreas.includes(area) ? 'default' : 'outline'}
                          className="cursor-pointer py-1 px-2.5 text-xs"
                          onClick={() => toggleFocusArea(area)}
                        >
                          {data.focusAreas.includes(area) && <Check className="h-3 w-3 mr-1" />}
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('challengesLabel')}</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1">
                    {typePainPoints.map(point => {
                      const isSelected = data.painPoints.includes(point.value)
                      return (
                        <button
                          key={point.value}
                          type="button"
                          onClick={() => togglePainPoint(point.value)}
                          className={`w-full text-left rounded-lg border p-3 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <OnboardingIcon name={point.icon} className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{point.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5 italic">{point.context}</p>
                              {isSelected && (
                                <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-md p-2">
                                  <p className="text-xs text-emerald-700 font-medium">
                                    {t('howWeSolveIt')} <span className="font-normal">{point.solution}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('currentToolsLabel')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {typeTools.map(tool => (
                      <Badge
                        key={tool.value}
                        variant={data.currentTools.includes(tool.value) ? 'default' : 'outline'}
                        className="cursor-pointer py-1.5 px-3 text-sm"
                        onClick={() => toggleCurrentTool(tool.value)}
                      >
                        {data.currentTools.includes(tool.value) && <Check className="h-3 w-3 mr-1" />}
                        {tool.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              )
            })()}

            {/* University Step 3: Obiettivi (type-specific) */}
            {currentStep === 3 && userRole === 'UNIVERSITY' && (() => {
              const typeGoals = getGoalsForType(data.institutionType)
              return (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">{t('goalsTitle')}</h2>
                  <p className="text-gray-600 text-sm">{t('goalsDesc')}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {typeGoals.map(goal => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => togglePartnershipGoal(goal.value)}
                      className={`w-full text-left rounded-lg border p-4 transition-colors ${
                        data.partnershipGoals.includes(goal.value)
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{goal.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{goal.description}</p>
                        </div>
                        {data.partnershipGoals.includes(goal.value) && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <Label>{t('topPriorityLabel')}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {typeGoals.map(goal => (
                      <Button
                        key={goal.value}
                        variant={data.topPriority === goal.value ? 'default' : 'ghost'}
                        onClick={() => setData(prev => ({ ...prev, topPriority: goal.value }))}
                        className="w-full justify-start text-left h-auto py-2 text-sm"
                        size="sm"
                      >
                        {data.topPriority === goal.value && <Check className="h-3 w-3 mr-2 flex-shrink-0" />}
                        {goal.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              )
            })()}

            {/* Final Step: Complete (step 3 for student/recruiter, step 4 for university) */}
            {currentStep === currentSteps.length - 1 && !(currentStep === 3 && userRole === 'UNIVERSITY') && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('almostReadyTitle')}
                </h2>
                <p className="text-gray-600">
                  {t('almostReadyDesc')}
                </p>
              </div>
            )}

            {currentStep === 4 && userRole === 'UNIVERSITY' && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t('allReadyTitle', { name: data.institutionName || t('partner') })}
                  </h2>
                  <p className="text-gray-600">
                    {t('allReadyDesc')}
                  </p>
                </div>

                <div className="space-y-2">
                  {data.painPoints.length > 0 && data.painPoints.map(pointValue => {
                    const point = allPainPoints.find(p => p.value === pointValue)
                    if (!point) return null
                    return (
                      <div key={pointValue} className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-800">{point.solution}</p>
                      </div>
                    )
                  })}
                  {data.painPoints.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                      {t('allToolsAccess')}
                    </p>
                  )}
                </div>

                {data.topPriority && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-400">{t('yourTopPriority')}</p>
                    <p className="text-sm font-semibold text-primary">
                      {allGoalOptions.find(g => g.value === data.topPriority)?.label}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>

              {currentStep < currentSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  {t('next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('saving')}
                    </>
                  ) : (
                    <>
                      {t('complete')}
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              const dashboardRoutes: Record<string, string> = {
                STUDENT: '/dashboard/student',
                RECRUITER: '/dashboard/recruiter',
                UNIVERSITY: '/dashboard/university',
              }
              router.push(dashboardRoutes[userRole] || '/dashboard/student')
            }}
            className="text-gray-500"
          >
            {t('skipForNow')}
          </Button>
        </div>
      </div>
    </div>
  )
}
