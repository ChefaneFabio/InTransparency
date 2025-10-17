import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


// GET /api/students/[username]/public - Get public portfolio data
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        photo: true,
        bio: true,
        tagline: true,
        university: true,
        degree: true,
        graduationYear: true,
        gpa: true,
        gpaPublic: true,
        portfolioUrl: true,
        profilePublic: true,
        subscriptionTier: true,
        createdAt: true,
        projects: {
          where: {
            isPublic: true
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            technologies: true,
            githubUrl: true,
            liveUrl: true,
            imageUrl: true,
            featured: true,
            complexityScore: true,
            innovationScore: true,
            marketRelevance: true,
            aiInsights: true,
            views: true,
            recruiterViews: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.profilePublic) {
      return NextResponse.json({ error: 'Profile is private' }, { status: 403 })
    }

    // Get profile view stats
    const profileViews = await prisma.profileView.count({
      where: { profileUserId: user.id }
    })

    const recruiterViews = await prisma.profileView.count({
      where: {
        profileUserId: user.id,
        viewerRole: 'RECRUITER'
      }
    })

    // Get total project views
    const totalProjectViews = user.projects.reduce((sum, p) => sum + p.views, 0)

    // Calculate career readiness score
    const careerReadinessScore = calculateCareerReadinessScore(user)

    // Get recent profile viewers (anonymized)
    const recentViewers = await prisma.profileView.findMany({
      where: { profileUserId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        viewerRole: true,
        viewerCompany: true,
        createdAt: true
      }
    })

    // Calculate job match score (placeholder - would be based on AI matching)
    const jobMatches = Math.min(Math.floor(user.projects.length * 2.5 + recruiterViews * 0.5), 50)

    // Track this view
    const viewerId = request.headers.get('x-user-id')
    const sessionId = request.headers.get('x-session-id')
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')

    // Get viewer info if logged in
    let viewerRole = null
    let viewerCompany = null
    if (viewerId) {
      const viewer = await prisma.user.findUnique({
        where: { id: viewerId },
        select: { role: true, company: true }
      })
      viewerRole = viewer?.role || null
      viewerCompany = viewer?.company || null
    }

    // Record profile view
    await prisma.profileView.create({
      data: {
        profileUserId: user.id,
        profileUsername: user.username,
        viewerId: viewerId || undefined,
        viewerRole,
        viewerCompany,
        sessionId: sessionId || undefined,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined
      }
    })

    // Track analytics event
    await prisma.analytics.create({
      data: {
        userId: viewerId || undefined,
        eventType: 'PROFILE_VIEW',
        eventName: 'profile_view',
        properties: {
          profileUserId: user.id,
          profileUsername: user.username,
          viewerRole
        },
        sessionId: sessionId || undefined,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined,
        pageUrl: request.url,
        pagePath: `/students/${username}/public`
      }
    })

    // Return public portfolio data
    return NextResponse.json({
      student: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        photo: user.photo,
        bio: user.bio,
        tagline: user.tagline,
        university: user.university,
        degree: user.degree,
        graduationYear: user.graduationYear,
        gpa: user.gpaPublic ? user.gpa : null,
        isPremium: user.subscriptionTier !== 'FREE',
        memberSince: user.createdAt,
        stats: {
          profileViews,
          recruiterViews,
          projectViews: totalProjectViews,
          projects: user.projects.length,
          jobMatches
        },
        careerReadinessScore,
        projects: user.projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
          technologies: p.technologies,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
          imageUrl: p.imageUrl,
          featured: p.featured,
          scores: {
            complexity: p.complexityScore,
            innovation: p.innovationScore,
            marketRelevance: p.marketRelevance
          },
          aiInsights: p.aiInsights,
          stats: {
            views: p.views,
            recruiterViews: p.recruiterViews
          },
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })),
        recentViewers: recentViewers.map(v => ({
          role: v.viewerRole,
          company: v.viewerRole === 'RECRUITER' ? v.viewerCompany : null,
          viewedAt: v.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Calculate career readiness score (0-100)
function calculateCareerReadinessScore(user: any): number {
  let score = 0

  // Profile completion (30 points)
  if (user.firstName && user.lastName) score += 5
  if (user.photo) score += 5
  if (user.bio) score += 5
  if (user.tagline) score += 5
  if (user.university) score += 5
  if (user.degree) score += 5

  // Projects (40 points)
  const projectCount = user.projects.length
  if (projectCount >= 1) score += 10
  if (projectCount >= 3) score += 10
  if (projectCount >= 5) score += 10
  if (projectCount >= 10) score += 10

  // Project quality (30 points)
  const avgComplexity = user.projects.reduce((sum: number, p: any) => sum + (p.complexityScore || 0), 0) / Math.max(projectCount, 1)
  const avgInnovation = user.projects.reduce((sum: number, p: any) => sum + (p.innovationScore || 0), 0) / Math.max(projectCount, 1)

  if (avgComplexity >= 60) score += 10
  if (avgComplexity >= 80) score += 5
  if (avgInnovation >= 60) score += 10
  if (avgInnovation >= 80) score += 5

  return Math.min(score, 100)
}
