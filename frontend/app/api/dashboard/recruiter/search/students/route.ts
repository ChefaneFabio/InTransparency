import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { buildExpandedSkillSet, buildStudentDisciplines, computeJobMatch } from '@/lib/job-matching'
import { decisionLabel, type MatchFactor } from '@/lib/match-explanation'
import { compileSkillQuery, extractPositiveTerms } from '@/lib/boolean-skill-match'

/**
 * GET /api/dashboard/recruiter/search/students
 * Search students with filters: search, university, skills, gpaMin, minProjects,
 * graduationYear, location, major. Supports pagination via page & limit.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const university = searchParams.get('university') || ''
    const skillsParam = searchParams.get('skills') || ''
    const gpaMinParam = searchParams.get('gpaMin') || ''
    const minProjectsParam = searchParams.get('minProjects') || ''
    const graduationYear = searchParams.get('graduationYear') || ''
    const location = searchParams.get('location') || ''
    const major = searchParams.get('major') || ''
    const jobId = searchParams.get('jobId') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit

    // If a jobId is provided, load the job to compute evidence-weighted matches per candidate.
    type MatchContext = {
      id: string
      title: string
      requiredSkills: string[]
      preferredSkills: string[]
      targetDisciplines: string[]
    } | null
    let matchContext: MatchContext = null
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: {
          id: true, title: true,
          requiredSkills: true, preferredSkills: true, targetDisciplines: true,
        },
      })
      if (job) {
        matchContext = {
          id: job.id,
          title: job.title,
          requiredSkills: job.requiredSkills || [],
          preferredSkills: job.preferredSkills || [],
          targetDisciplines: job.targetDisciplines || [],
        }
      }
    }

    // Parse skills: supports boolean expressions ("React AND (Node OR Python) NOT Java"),
    // comma-separated lists ("react, node"), or a single term.
    const skillPredicate = skillsParam ? compileSkillQuery(skillsParam) : null
    // Positive terms are used for the Prisma pre-filter. NOT/OR-excluded skills are
    // applied post-fetch via the predicate.
    const skills: string[] = skillsParam
      ? extractPositiveTerms(skillsParam)
      : []
    const usingBooleanSkills = skillsParam
      ? /\b(AND|OR|NOT)\b/i.test(skillsParam) || /[()"]/.test(skillsParam)
      : false

    const gpaMin = gpaMinParam ? parseFloat(gpaMinParam) : null

    const minProjects = minProjectsParam ? parseInt(minProjectsParam, 10) : null

    // Build the where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      role: 'STUDENT',
      profilePublic: true,
    }

    // Text search across name/email/bio
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ]
    }

    // University filter — also match exchange students at this university
    if (university) {
      const uniConditions = [
        { university: { contains: university, mode: 'insensitive' as const } },
        {
          exchangeEnrollments: {
            some: {
              status: 'ACTIVE',
              OR: [
                { homeUniversityName: { contains: university, mode: 'insensitive' as const } },
                { hostUniversityName: { contains: university, mode: 'insensitive' as const } },
              ],
            },
          },
        },
      ]
      // Use AND to not overwrite text search OR
      if (!where.AND) where.AND = []
      where.AND.push({ OR: uniConditions })
    }

    // Major / degree filter (contains match)
    if (major) {
      where.degree = { contains: major, mode: 'insensitive' }
    }

    // Graduation year (exact match)
    if (graduationYear) {
      where.graduationYear = graduationYear
    }

    // Location filter - search across location field and university as fallback
    if (location) {
      // Use AND to combine with existing OR conditions
      const locationConditions = [
        { location: { contains: location, mode: 'insensitive' as const } },
        { university: { contains: location, mode: 'insensitive' as const } },
      ]
      if (!where.AND) where.AND = []
      where.AND.push({ OR: locationConditions })
    }

    // Skills filter: find students who have projects with matching skills/technologies
    if (skills.length > 0) {
      where.projects = {
        some: {
          isPublic: true,
          OR: [
            { skills: { hasSome: skills } },
            { technologies: { hasSome: skills } },
          ],
        },
      }
    }

    // minProjects: filter users where project count >= minProjects
    if (minProjects !== null && minProjects > 0) {
      // We handle this with a having clause by fetching then filtering,
      // or by using a nested count condition
      if (!where.projects) {
        where.projects = {}
      }
      // Prisma doesn't support _count in where directly, so we'll post-filter
    }

    // For gpaMin, we'll also need to post-filter since gpa is stored as String
    // First, get a larger set if we need post-filtering
    const needsPostFilter = (gpaMin !== null) || (minProjects !== null && minProjects > 0) || usingBooleanSkills

    // If we need post-filtering, fetch more to compensate for filtered-out results
    const fetchLimit = needsPostFilter ? limit * 5 : limit
    const fetchSkip = needsPostFilter ? 0 : skip

    const [students, totalRaw] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          bio: true,
          tagline: true,
          photo: true,
          createdAt: true,
          subscriptionTier: true,
          exchangeEnrollments: {
            where: { status: 'ACTIVE' },
            select: {
              programType: true,
              homeUniversityName: true,
              homeCountry: true,
              hostUniversityName: true,
              hostCountry: true,
            },
            take: 1,
          },
          _count: {
            select: { projects: true },
          },
          projects: {
            where: { isPublic: true },
            select: {
              id: true,
              title: true,
              technologies: true,
              skills: true,
              tools: true,
              competencies: true,
              discipline: true,
              innovationScore: true,
              verificationStatus: true,
            },
            orderBy: { innovationScore: 'desc' },
            take: 10,
          },
        },
        orderBy: [
          { projects: { _count: 'desc' } },
          { createdAt: 'desc' },
        ],
        take: needsPostFilter ? fetchLimit : limit,
        skip: fetchSkip,
      }),
      prisma.user.count({ where }),
    ])

    // Sort STUDENT_PREMIUM users first for priority in search results
    students.sort((a: any, b: any) => {
      const aPremium = a.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      const bPremium = b.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      if (bPremium !== aPremium) return bPremium - aPremium
      return 0
    })

    // Post-filter for gpaMin and minProjects
    let filtered = students

    if (gpaMin !== null) {
      filtered = filtered.filter(s => {
        if (!s.gpa) return false
        const gpaValue = parseFloat(s.gpa)
        return !isNaN(gpaValue) && gpaValue >= gpaMin
      })
    }

    if (minProjects !== null && minProjects > 0) {
      filtered = filtered.filter(s => s._count.projects >= minProjects)
    }

    // Boolean skill predicate: apply the full NOT / OR / AND expression against the
    // candidate's expanded (ESCO-aware) skill set from all their project skills.
    if (usingBooleanSkills && skillPredicate) {
      const checked = await Promise.all(
        filtered.map(async (s: any) => {
          const projects = (s.projects || []).map((p: any) => ({
            technologies: p.technologies || [],
            skills: p.skills || [],
            tools: p.tools || [],
            competencies: p.competencies || [],
            discipline: p.discipline || '',
          }))
          const expanded = await buildExpandedSkillSet(projects)
          return skillPredicate(expanded) ? s : null
        })
      )
      filtered = checked.filter(Boolean) as typeof filtered
    }

    // Calculate total after post-filtering
    let total = totalRaw
    if (needsPostFilter) {
      // For post-filtered queries, we need to estimate the total
      // If we post-filtered, count how many passed from our larger fetch
      const passRate = students.length > 0 ? filtered.length / students.length : 0
      total = Math.round(totalRaw * passRate)
    }

    // Apply pagination to post-filtered results
    const paginatedResults = needsPostFilter
      ? filtered.slice(skip, skip + limit)
      : filtered

    // If matching against a job, compute evidence-weighted match score per candidate.
    // Verified projects weight 1.0×, unverified 0.6×. Discipline match + verified-depth bonus.
    let scoredResults = paginatedResults
    if (matchContext) {
      const job = matchContext
      const scored = await Promise.all(
        paginatedResults.map(async (s: any) => {
          const projects = (s.projects || []).map((p: any) => ({
            technologies: p.technologies || [],
            skills: p.skills || [],
            tools: p.tools || [],
            competencies: p.competencies || [],
            discipline: p.discipline || '',
          }))
          const verifiedProjects = (s.projects || []).filter((p: any) => p.verificationStatus === 'VERIFIED')
          const verifiedCount = verifiedProjects.length
          const totalProjects = (s.projects || []).length

          // Expanded (ESCO-aware) full set — captures synonyms
          const expanded = await buildExpandedSkillSet(projects)
          // Verified-only subset — skills backed by a verified project
          const verifiedSet = new Set<string>()
          for (const p of verifiedProjects) {
            for (const term of [...(p.technologies || []), ...(p.skills || []), ...(p.tools || []), ...(p.competencies || [])]) {
              verifiedSet.add(String(term).toLowerCase().trim())
            }
          }

          const disciplines = buildStudentDisciplines(projects)
          const base = computeJobMatch(expanded, disciplines, {
            id: job.id,
            requiredSkills: job.requiredSkills,
            preferredSkills: job.preferredSkills,
            targetDisciplines: job.targetDisciplines,
          })

          // Evidence weight: fraction of matched required skills that are VERIFIED.
          const reqMatchedVerified = base.matchedSkills.filter(sk =>
            verifiedSet.has(sk.toLowerCase().trim())
          ).length
          const evidenceRatio = base.matchedSkills.length > 0
            ? reqMatchedVerified / base.matchedSkills.length
            : 0
          // Self-declared (unverified) match counts 0.6×; verified 1.0×. Blend and re-weight.
          const evidenceMultiplier = 0.6 + 0.4 * evidenceRatio // ranges 0.6 → 1.0

          // Verified-depth bonus: up to +10 points when candidate has 3+ verified projects
          const depthBonus = Math.min(10, verifiedCount * 3)

          const matchScore = Math.min(100, Math.round(base.matchScore * evidenceMultiplier + depthBonus))

          const factors: MatchFactor[] = [
            {
              name: 'requiredSkills',
              category: 'skills',
              weight: 60,
              value: `${base.matchedSkills.length} of ${job.requiredSkills.length}`,
              contribution: Math.round((base.matchedSkills.length / Math.max(1, job.requiredSkills.length)) * 60),
              evidence: base.matchedSkills.map(sk => ({ type: 'skill' as const, label: sk })),
              humanReason: `${base.matchedSkills.length}/${job.requiredSkills.length} required skills matched`,
            },
            {
              name: 'preferredSkills',
              category: 'skills',
              weight: 25,
              value: `${base.matchedPreferred.length} of ${job.preferredSkills.length}`,
              contribution: Math.round((base.matchedPreferred.length / Math.max(1, job.preferredSkills.length)) * 25),
              evidence: base.matchedPreferred.map(sk => ({ type: 'skill' as const, label: sk })),
              humanReason: `${base.matchedPreferred.length}/${job.preferredSkills.length} preferred skills matched`,
            },
            {
              name: 'verifiedEvidence',
              category: 'verified_evidence',
              weight: 10,
              value: `${reqMatchedVerified} verified / ${base.matchedSkills.length} matched · ${verifiedCount} verified projects`,
              contribution: Math.round(evidenceRatio * 10 + Math.min(5, verifiedCount)),
              evidence: verifiedProjects.slice(0, 5).map((p: any) => ({ type: 'project' as const, label: p.title })),
              humanReason: evidenceRatio > 0
                ? `${Math.round(evidenceRatio * 100)}% of matched skills are backed by verified projects`
                : 'Skills are self-declared (no verified project evidence yet)',
            },
            {
              name: 'disciplineFit',
              category: 'skills',
              weight: 5,
              value: base.disciplineMatch ? 'match' : 'no match',
              contribution: base.disciplineMatch ? 5 : 0,
              humanReason: base.disciplineMatch ? 'Discipline aligns with job target' : 'Discipline differs from job target',
            },
          ]

          return {
            ...s,
            __match: {
              matchScore,
              decisionLabel: decisionLabel(matchScore),
              matchedSkills: base.matchedSkills,
              missingSkills: base.missingSkills,
              matchedPreferred: base.matchedPreferred,
              verifiedCount,
              totalProjects,
              factors,
            },
          }
        })
      )
      scored.sort((a: any, b: any) => (b.__match?.matchScore ?? 0) - (a.__match?.matchScore ?? 0))
      scoredResults = scored
    }

    // Format the response
    const formattedStudents = scoredResults.map((s: any) => {
      const exchange = s.exchangeEnrollments?.[0] || null
      return {
        id: s.id,
        name: [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Anonymous',
        initials: getInitials(s.firstName, s.lastName),
        email: s.email,
        university: s.university || null,
        degree: s.degree || null,
        graduationYear: s.graduationYear || null,
        gpa: s.gpaPublic && s.gpa ? parseFloat(s.gpa) : null,
        bio: s.bio || null,
        tagline: s.tagline || null,
        photo: s.photo || null,
        projectCount: s._count.projects,
        isPremium: s.subscriptionTier === 'STUDENT_PREMIUM',
        isErasmus: !!exchange,
        exchange: exchange
          ? {
              programType: exchange.programType,
              homeUniversity: exchange.homeUniversityName,
              homeCountry: exchange.homeCountry,
              hostUniversity: exchange.hostUniversityName,
              hostCountry: exchange.hostCountry,
            }
          : null,
        topProjects: (s.projects || []).slice(0, 3).map((p: any) => ({
          id: p.id,
          title: p.title,
          skills: p.skills,
          technologies: p.technologies,
          innovationScore: p.innovationScore,
          verificationStatus: p.verificationStatus,
        })),
        projects: (s.projects || []).slice(0, 3).map((p: any) => ({
          id: p.id,
          title: p.title,
          discipline: p.discipline || 'OTHER',
          innovationScore: p.innovationScore,
          verificationStatus: p.verificationStatus,
        })),
        match: s.__match || null,
      }
    })

    return NextResponse.json({
      jobContext: matchContext ? { id: matchContext.id, title: matchContext.title } : null,
      students: formattedStudents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error searching students:', error)
    return NextResponse.json(
      { error: 'Failed to search students' },
      { status: 500 }
    )
  }
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}
