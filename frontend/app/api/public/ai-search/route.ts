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

// --- Fallback entity extraction (keyword-based) ---
function extractBasicEntities(query: string) {
  const lower = query.toLowerCase()

  const cityKeywords: Record<string, string> = {
    milano: 'Milan',
    milan: 'Milan',
    roma: 'Rome',
    rome: 'Rome',
    torino: 'Turin',
    turin: 'Turin',
    firenze: 'Florence',
    florence: 'Florence',
    bologna: 'Bologna',
    napoli: 'Naples',
    naples: 'Naples',
    venezia: 'Venice',
    venice: 'Venice',
    padova: 'Padova',
    genova: 'Genova',
    bari: 'Bari',
    palermo: 'Palermo',
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

  const skillKeywords = [
    'react', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java',
    'node', 'figma', 'photoshop', 'illustrator', 'ui', 'ux', 'design',
    'graphic', 'marketing', 'seo', 'data', 'machine learning', 'ml', 'ai',
    'cybersecurity', 'security', 'network', 'cloud', 'aws', 'docker',
    'sql', 'database', 'excel', 'financial', 'accounting', 'legal', 'law',
    'communication', 'consulting', 'business', 'analytics', 'devops',
    'mobile', 'ios', 'android', 'flutter', 'swift', 'kotlin',
  ]

  const skills: string[] = []
  for (const skill of skillKeywords) {
    if (lower.includes(skill)) skills.push(skill)
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

async function searchJobs(entities: NonNullable<AIResponse['entities']>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isPublic: true, status: 'ACTIVE' }

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

  // Skills filter via OR on multiple fields
  if (entities.skills && entities.skills.length > 0) {
    const skillTerms = entities.skills
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillConditions: any[] = [
      { requiredSkills: { hasSome: skillTerms } },
      { preferredSkills: { hasSome: skillTerms } },
    ]
    for (const term of skillTerms) {
      skillConditions.push({ title: { contains: term, mode: 'insensitive' } })
      skillConditions.push({
        description: { contains: term, mode: 'insensitive' },
      })
    }

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: skillConditions }]
      delete where.OR
    } else {
      where.OR = skillConditions
    }
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
  entities: NonNullable<AIResponse['entities']>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { role: 'STUDENT', profilePublic: true }

  // University filter
  if (entities.universities && entities.universities.length > 0) {
    where.university = {
      contains: entities.universities[0],
      mode: 'insensitive',
    }
  }

  // Skills filter via projects
  if (entities.skills && entities.skills.length > 0) {
    where.projects = {
      some: {
        isPublic: true,
        OR: [
          { skills: { hasSome: entities.skills } },
          { technologies: { hasSome: entities.skills } },
          { tools: { hasSome: entities.skills } },
        ],
      },
    }
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
  query: string
) {
  const lower = query.toLowerCase()
  const isStudentQuery =
    intent === 'student_search' ||
    lower.includes('student') ||
    lower.includes('studenti') ||
    lower.includes('gpa') ||
    lower.includes('candidate') ||
    lower.includes('candidat')

  if (isStudentQuery) {
    return { type: 'candidates' as const, results: await searchCandidates(entities) }
  }
  return { type: 'jobs' as const, results: await searchJobs(entities) }
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

    // 1. Call AI service (with fallback)
    const aiResult = await callAIService(query, type, sessionId)
    const entities = aiResult?.entities || extractBasicEntities(query)
    const aiMessage = aiResult?.message || null
    const intent = aiResult?.intent
    const suggestedActions = aiResult?.suggested_actions || []

    // 2. Run Prisma queries based on demo type
    let results: unknown[] = []
    let resultType = 'jobs'

    if (type === 'student') {
      results = await searchJobs(entities)
      resultType = 'jobs'
    } else if (type === 'company') {
      results = await searchCandidates(entities)
      resultType = 'candidates'
    } else {
      const uniResult = await searchUniversity(entities, intent, query)
      results = uniResult.results
      resultType = uniResult.type
    }

    // 3. Build response message
    let message = aiMessage || ''
    if (!message) {
      // Fallback message when AI service is unavailable
      if (results.length > 0) {
        if (resultType === 'jobs') {
          message = `I found **${results.length} jobs** matching your search. Here are the top results:`
        } else {
          message = `I found **${results.length} candidates** matching your criteria. Here are the top profiles:`
        }
      } else {
        message =
          'No results found for your search. Try broadening your criteria or using different keywords.'
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
