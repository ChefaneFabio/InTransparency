import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'
const AI_SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY || ''

// --- Rate limiting (in-memory, per-IP) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] ?? realIp ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = 30 // 30 queries per hour for demo
  const windowMs = 60 * 60 * 1000

  const record = rateLimitMap.get(ip)
  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }
  if (record.count >= limit) return true
  record.count++
  return false
}

// --- AI service call ---
type AIResponse = {
  message: string
  intent?: string
  entities?: {
    skills?: string[]
    locations?: string[]
    job_types?: string[]
    universities?: string[]
    [key: string]: unknown
  }
  suggested_actions?: Array<{ label: string; action: string }>
  session_id?: string
}

async function callAIService(
  query: string,
  type: string,
  sessionId: string
): Promise<AIResponse | null> {
  const roleMap: Record<string, string> = {
    student: 'student',
    company: 'recruiter',
    university: 'institution',
  }

  try {
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: query,
        user_role: roleMap[type] || 'student',
        stream: false,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return null
    return (await response.json()) as AIResponse
  } catch {
    return null
  }
}

// --- Conversational follow-up detection ---
const FOLLOWUP_PATTERNS = [
  /^[?!.…]+$/,                    // just punctuation
  /^(yes|no|ok|sure|thanks|thank|grazie|si|sì|no|va bene)[\s?!.]*$/i,
  /^(are you sure|sei sicuro|really|davvero|what|cosa|why|perché|how|come)[\s?!.]*$/i,
  /^(show me more|more|altro|altri|di più|tell me more)[\s?!.]*$/i,
  /^(they don.?t match|not what i|non è quello|wrong|sbagliato)[\s?!.]*$/i,
]

function isFollowUp(query: string): boolean {
  const trimmed = query.trim()
  if (trimmed.length <= 2) return true
  const words = trimmed.split(/\s+/)
  if (words.length <= 2 && !extractSearchTerms(trimmed).length) return true
  return FOLLOWUP_PATTERNS.some((p) => p.test(trimmed))
}

// --- Stop words for extracting search terms ---
const STOP_WORDS = new Set([
  'i', 'we', 'you', 'want', 'to', 'find', 'the', 'a', 'an', 'in', 'for',
  'and', 'or', 'with', 'at', 'of', 'my', 'me', 'looking', 'search', 'show',
  'get', 'need', 'who', 'are', 'is', 'good', 'great', 'best', 'top', 'some',
  'that', 'this', 'those', 'people', 'person', 'students', 'student',
  'graduated', 'graduates', 'from', 'have', 'has', 'their', 'our', 'can',
  'voglio', 'cerco', 'cerca', 'trovami', 'trova', 'mostrami', 'per', 'con',
  'che', 'di', 'il', 'la', 'un', 'una', 'dei', 'delle', 'del', 'dalla',
  'dal', 'le', 'lo', 'gli', 'sono', 'da', 'su', 'come', 'mi', 'si',
  'looking', 'hire', 'hiring', 'jobs', 'job', 'work', 'experience',
])

/** Extract meaningful search terms (non-stopword tokens >= 3 chars) */
function extractSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
}

// --- Levenshtein distance for fuzzy matching ---
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix[b.length][a.length]
}

/** Try to fuzzy-match a word against a list of keywords (max distance 2) */
function fuzzyMatchKeyword(word: string, keywords: string[]): string | null {
  if (word.length < 4) return null // too short for fuzzy
  let bestMatch: string | null = null
  let bestDist = 3 // threshold: max distance 2
  for (const kw of keywords) {
    // Only compare words of similar length (avoid matching "ai" to "design")
    if (Math.abs(word.length - kw.length) > 2) continue
    const dist = levenshtein(word, kw)
    if (dist < bestDist) {
      bestDist = dist
      bestMatch = kw
    }
  }
  return bestMatch
}

// --- Fallback entity extraction (keyword-based) ---

const SKILL_KEYWORDS = [
  // Tech
  'react', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java',
  'node', 'figma', 'photoshop', 'illustrator', 'ui', 'ux', 'design',
  'graphic', 'graphics', 'cybersecurity', 'security', 'network', 'cloud',
  'aws', 'docker', 'sql', 'database', 'devops', 'mobile', 'ios', 'android',
  'flutter', 'swift', 'kotlin', 'machine learning', 'deep learning',
  // Business & Finance
  'marketing', 'seo', 'data', 'ml', 'ai', 'excel', 'financial',
  'accounting', 'legal', 'law', 'communication', 'consulting', 'business',
  'analytics', 'economics', 'management', 'entrepreneurship',
  // Sciences & Engineering
  'biomedical', 'biotechnology', 'biology', 'chemistry', 'physics',
  'pharmaceutical', 'medicine', 'medical', 'nursing', 'health',
  'mechanical', 'electrical', 'civil', 'environmental', 'aerospace',
  'chemical', 'materials', 'robotics', 'automation', 'energy',
  // Architecture & Design
  'architecture', 'urban', 'interior', 'industrial design',
  // Humanities & Social
  'psychology', 'sociology', 'philosophy', 'literature', 'linguistics',
  'political', 'international relations', 'education', 'pedagogy',
]

function extractBasicEntities(query: string) {
  const lower = query.toLowerCase()

  const cityKeywords: Record<string, string> = {
    milano: 'Milan', milan: 'Milan',
    roma: 'Rome', rome: 'Rome',
    torino: 'Turin', turin: 'Turin',
    firenze: 'Florence', florence: 'Florence',
    bologna: 'Bologna',
    napoli: 'Naples', naples: 'Naples',
    venezia: 'Venice', venice: 'Venice',
    padova: 'Padova', genova: 'Genova',
    bari: 'Bari', palermo: 'Palermo',
  }

  const locations: string[] = []
  for (const [keyword, city] of Object.entries(cityKeywords)) {
    if (lower.includes(keyword)) locations.push(city)
  }

  const jobTypes: string[] = []
  if (
    lower.includes('stage') ||
    lower.includes('tirocinio') ||
    lower.includes('internship') ||
    lower.includes('curriculare')
  ) {
    jobTypes.push('INTERNSHIP')
  }
  if (lower.includes('full time') || lower.includes('full-time')) {
    jobTypes.push('FULL_TIME')
  }
  if (lower.includes('part time') || lower.includes('part-time')) {
    jobTypes.push('PART_TIME')
  }
  if (lower.includes('freelance') || lower.includes('contract')) {
    jobTypes.push('CONTRACT')
  }

  // Exact keyword matching
  const skills: string[] = []
  const matchedWords = new Set<string>()
  for (const skill of SKILL_KEYWORDS) {
    if (lower.includes(skill)) {
      skills.push(skill)
      matchedWords.add(skill)
    }
  }

  // Fuzzy matching for remaining query words that didn't match any keyword
  const queryWords = lower.split(/\s+/).filter((w) => w.length >= 4)
  for (const word of queryWords) {
    if (matchedWords.has(word)) continue
    if (STOP_WORDS.has(word)) continue
    const fuzzyMatch = fuzzyMatchKeyword(word, SKILL_KEYWORDS)
    if (fuzzyMatch && !skills.includes(fuzzyMatch)) {
      skills.push(fuzzyMatch)
    }
  }

  const universities: string[] = []
  const uniKeywords = [
    'politecnico', 'bocconi', 'sapienza', 'luiss', 'naba', 'ied',
    'bologna', 'cattolica', 'bicocca', 'statale',
  ]
  for (const uni of uniKeywords) {
    if (lower.includes(uni)) universities.push(uni)
  }

  return { skills, locations, job_types: jobTypes, universities }
}

// --- Prisma search functions ---

async function searchJobs(
  entities: NonNullable<AIResponse['entities']>,
  searchTerms: string[] = []
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isPublic: true, status: 'ACTIVE' }

  const hasEntityFilters =
    (entities.skills && entities.skills.length > 0) ||
    (entities.locations && entities.locations.length > 0) ||
    (entities.job_types && entities.job_types.length > 0)

  // Job type filter
  if (entities.job_types && entities.job_types.length > 0) {
    const mapped = entities.job_types.map((jt) => {
      const upper = jt.toUpperCase()
      if (upper === 'INTERNSHIP' || upper === 'STAGE' || upper === 'TIROCINIO')
        return 'INTERNSHIP'
      if (upper === 'FULL_TIME' || upper === 'FULL TIME') return 'FULL_TIME'
      if (upper === 'PART_TIME' || upper === 'PART TIME') return 'PART_TIME'
      if (upper === 'CONTRACT' || upper === 'FREELANCE') return 'CONTRACT'
      return upper
    })
    if (mapped.length === 1) {
      where.jobType = mapped[0]
    } else {
      where.jobType = { in: mapped }
    }
  }

  // Location filter
  if (entities.locations && entities.locations.length > 0) {
    where.location = {
      contains: entities.locations[0],
      mode: 'insensitive',
    }
  }

  // Build combined search terms from entities + raw query
  const allTerms = Array.from(new Set([
    ...(entities.skills || []),
    ...searchTerms,
  ]))

  // Combined skill + text search
  if (allTerms.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = []

    // Array element exact matches
    if (entities.skills && entities.skills.length > 0) {
      conditions.push({ requiredSkills: { hasSome: entities.skills } })
      conditions.push({ preferredSkills: { hasSome: entities.skills } })
    }

    // Text-based search (contains) for title, description, tags
    for (const term of allTerms) {
      conditions.push({ title: { contains: term, mode: 'insensitive' } })
      conditions.push({ description: { contains: term, mode: 'insensitive' } })
    }

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: conditions }]
      delete where.OR
    } else {
      where.OR = conditions
    }
  } else if (!hasEntityFilters) {
    // No filters at all — return empty instead of dumping all jobs
    return []
  }

  const jobs = await prisma.job.findMany({
    where,
    select: {
      id: true,
      title: true,
      companyName: true,
      location: true,
      jobType: true,
      workLocation: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      showSalary: true,
      requiredSkills: true,
      preferredSkills: true,
      postedAt: true,
      isFeatured: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { postedAt: 'desc' }],
    take: 10,
  })

  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.companyName,
    location: job.location || null,
    type: formatJobType(job.jobType),
    salary: job.showSalary
      ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)
      : null,
    skills: Array.from(
      new Set([...job.requiredSkills, ...job.preferredSkills].slice(0, 6))
    ),
    coordinates: job.location
      ? getCoordinatesForLocation(job.location)
      : null,
  }))
}

async function searchCandidates(
  entities: NonNullable<AIResponse['entities']>,
  searchTerms: string[] = []
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { role: 'STUDENT', profilePublic: true }

  const hasEntityFilters =
    (entities.skills && entities.skills.length > 0) ||
    (entities.universities && entities.universities.length > 0) ||
    (entities.locations && entities.locations.length > 0)

  // University filter
  if (entities.universities && entities.universities.length > 0) {
    where.university = {
      contains: entities.universities[0],
      mode: 'insensitive',
    }
  }

  // Build search terms: combine entity skills + raw search terms for text matching
  const allSearchTerms = Array.from(new Set([
    ...(entities.skills || []),
    ...searchTerms,
  ]))

  // When we have any search terms (from entities or raw query), use a combined
  // approach: hasSome for exact array matches + contains for text search
  if (allSearchTerms.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = []

    // Array element exact matches (hasSome)
    if (entities.skills && entities.skills.length > 0) {
      conditions.push({
        projects: {
          some: {
            isPublic: true,
            OR: [
              { skills: { hasSome: entities.skills } },
              { technologies: { hasSome: entities.skills } },
              { tools: { hasSome: entities.skills } },
            ],
          },
        },
      })
    }

    // Text-based search (contains) for degree, bio, project title/description
    for (const term of allSearchTerms) {
      conditions.push({ degree: { contains: term, mode: 'insensitive' } })
      conditions.push({ bio: { contains: term, mode: 'insensitive' } })
      conditions.push({ tagline: { contains: term, mode: 'insensitive' } })
      conditions.push({
        projects: {
          some: {
            isPublic: true,
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { description: { contains: term, mode: 'insensitive' } },
            ],
          },
        },
      })
    }

    where.OR = conditions
  } else if (!hasEntityFilters) {
    // No filters at all — return empty instead of ALL students
    return []
  }

  const students = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      university: true,
      degree: true,
      gpa: true,
      gpaPublic: true,
      projects: {
        where: { isPublic: true },
        select: {
          skills: true,
          technologies: true,
          tools: true,
          discipline: true,
        },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return students.map((s) => {
    const allSkills = new Set<string>()
    for (const p of s.projects) {
      for (const sk of p.skills) allSkills.add(sk)
      for (const t of p.technologies) allSkills.add(t)
      for (const tl of p.tools) allSkills.add(tl)
    }

    return {
      id: s.id,
      initials: getInitials(s.firstName, s.lastName),
      university: s.university || null,
      major: s.degree || null,
      gpa: s.gpaPublic && s.gpa ? parseFloat(s.gpa) : null,
      skills: Array.from(allSkills).slice(0, 6),
      coordinates: s.university
        ? getCoordinatesForLocation(s.university)
        : null,
    }
  })
}

async function searchUniversity(
  entities: NonNullable<AIResponse['entities']>,
  intent: string | undefined,
  query: string,
  searchTerms: string[] = []
) {
  const lower = query.toLowerCase()
  const isStudentQuery =
    intent === 'student_search' ||
    lower.includes('student') ||
    lower.includes('studenti') ||
    lower.includes('gpa') ||
    lower.includes('candidate') ||
    lower.includes('candidat')

  // Try primary search first, fallback to the other type if empty
  if (isStudentQuery) {
    const candidates = await searchCandidates(entities, searchTerms)
    if (candidates.length > 0) {
      return { type: 'candidates' as const, results: candidates }
    }
    // Fallback: try jobs
    const jobs = await searchJobs(entities, searchTerms)
    if (jobs.length > 0) {
      return { type: 'jobs' as const, results: jobs }
    }
    return { type: 'candidates' as const, results: [] }
  }

  const jobs = await searchJobs(entities, searchTerms)
  if (jobs.length > 0) {
    return { type: 'jobs' as const, results: jobs }
  }
  // Fallback: try candidates
  const candidates = await searchCandidates(entities, searchTerms)
  if (candidates.length > 0) {
    return { type: 'candidates' as const, results: candidates }
  }
  return { type: 'jobs' as const, results: [] }
}

// --- Helper functions ---

function formatJobType(jobType: string): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    INTERNSHIP: 'Internship',
    CONTRACT: 'Contract',
    TEMPORARY: 'Temporary',
    VOLUNTEER: 'Volunteer',
  }
  return map[jobType] || jobType
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string
): string | null {
  const symbol = currency === 'EUR' ? '\u20AC' : currency === 'USD' ? '$' : currency
  if (min && max) {
    return `${symbol}${Math.round(min / 1000)}k - ${symbol}${Math.round(max / 1000)}k`
  }
  if (min) return `${symbol}${Math.round(min / 1000)}k+`
  if (max) return `Up to ${symbol}${Math.round(max / 1000)}k`
  return null
}

function getCoordinatesForLocation(
  location: string
): { lat: number; lng: number } | null {
  const lower = location.toLowerCase()
  const cities: Record<string, { lat: number; lng: number }> = {
    milan: { lat: 45.4642, lng: 9.19 },
    milano: { lat: 45.4642, lng: 9.19 },
    rome: { lat: 41.9028, lng: 12.4964 },
    roma: { lat: 41.9028, lng: 12.4964 },
    turin: { lat: 45.0703, lng: 7.6869 },
    torino: { lat: 45.0703, lng: 7.6869 },
    florence: { lat: 43.7696, lng: 11.2558 },
    firenze: { lat: 43.7696, lng: 11.2558 },
    bologna: { lat: 44.4949, lng: 11.3426 },
    naples: { lat: 40.8518, lng: 14.2681 },
    napoli: { lat: 40.8518, lng: 14.2681 },
    venice: { lat: 45.4408, lng: 12.3155 },
    venezia: { lat: 45.4408, lng: 12.3155 },
    padova: { lat: 45.4064, lng: 11.8768 },
    genova: { lat: 44.4056, lng: 8.9463 },
    bari: { lat: 41.1171, lng: 16.8719 },
    palermo: { lat: 38.1157, lng: 13.3615 },
    politecnico: { lat: 45.4642, lng: 9.19 },
    bocconi: { lat: 45.4506, lng: 9.1888 },
    sapienza: { lat: 41.9013, lng: 12.5148 },
    luiss: { lat: 41.9244, lng: 12.4969 },
  }

  for (const [key, coords] of Object.entries(cities)) {
    if (lower.includes(key)) return coords
  }
  return null
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  if (first && last) return `${first.toUpperCase()}.${last.toUpperCase()}.`
  return (first + last).toUpperCase() || 'U'
}

function generateSessionId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// --- Main handler ---

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const clientIp = getClientIp(request)
    if (clientIp !== 'unknown' && isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { query, type, sessionId: incomingSessionId } = body

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      )
    }

    if (!type || !['student', 'company', 'university'].includes(type)) {
      return NextResponse.json(
        { error: 'type must be student, company, or university' },
        { status: 400 }
      )
    }

    const sessionId = incomingSessionId || generateSessionId()

    // 0. Detect conversational follow-ups (without AI service they can't be handled)
    const aiResult = await callAIService(query, type, sessionId)

    if (!aiResult && isFollowUp(query)) {
      // Without AI service, we can't handle conversational follow-ups
      return NextResponse.json({
        message:
          'I can only process search queries in demo mode. Try describing what you\'re looking for — e.g. skills, field of study, or location!',
        results: [],
        suggestedActions: [],
        sessionId,
        resultCount: 0,
        resultType: type === 'company' ? 'candidates' : 'jobs',
      })
    }

    // 1. Extract entities and search terms
    const entities = aiResult?.entities || extractBasicEntities(query)
    const searchTerms = extractSearchTerms(query)
    const aiMessage = aiResult?.message || null
    const intent = aiResult?.intent
    const suggestedActions = aiResult?.suggested_actions || []

    // 2. Run Prisma queries based on demo type (with cross-search fallback)
    let results: unknown[] = []
    let resultType = 'jobs'

    if (type === 'student') {
      results = await searchJobs(entities, searchTerms)
      resultType = 'jobs'
    } else if (type === 'company') {
      results = await searchCandidates(entities, searchTerms)
      resultType = 'candidates'
    } else {
      const uniResult = await searchUniversity(entities, intent, query, searchTerms)
      results = uniResult.results
      resultType = uniResult.type
    }

    // 3. Build response message
    const queryTermsDisplay = searchTerms.slice(0, 3).join(', ')
    let message = aiMessage || ''
    if (!message) {
      if (results.length > 0) {
        if (resultType === 'jobs') {
          message = `I found **${results.length} job${results.length > 1 ? 's' : ''}** matching "${queryTermsDisplay}". Here are the top results:`
        } else {
          message = `I found **${results.length} candidate${results.length > 1 ? 's' : ''}** matching "${queryTermsDisplay}". Here are the top profiles:`
        }
      } else {
        // Better no-results message with context
        const suggestions = []
        if (queryTermsDisplay) {
          suggestions.push(`No results found for "${queryTermsDisplay}".`)
        }
        suggestions.push(
          'The demo searches real database entries. Try one of the example queries on the right, or use broader keywords like "design", "marketing", or "engineering".'
        )
        message = suggestions.join(' ')
      }
    }

    return NextResponse.json({
      message,
      results,
      suggestedActions,
      sessionId: aiResult?.session_id || sessionId,
      resultCount: results.length,
      resultType,
    })
  } catch (error) {
    console.error('AI search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
