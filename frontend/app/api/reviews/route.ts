import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/reviews?company=CompanyName
 * Public: Get reviews for a company.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const company = url.searchParams.get('company')

    if (!company) {
      return NextResponse.json({ error: 'Company name required' }, { status: 400 })
    }

    const reviews = await prisma.employerReview.findMany({
      where: {
        companyName: { equals: company, mode: 'insensitive' },
        isPublished: true,
        flagged: false,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            university: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Compute aggregates
    const ratings = reviews.map((r) => r.overallRating)
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

    const categoryAverages: Record<string, number> = {}
    const categories = ['workLifeBalance', 'mentorship', 'learningOpportunity', 'compensation', 'cultureFit'] as const
    for (const cat of categories) {
      const vals = reviews.map((r) => r[cat]).filter((v): v is number => v !== null)
      if (vals.length > 0) {
        categoryAverages[cat] = vals.reduce((a, b) => a + b, 0) / vals.length
      }
    }

    return NextResponse.json({
      company,
      reviewCount: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
      categoryAverages,
      reviews: reviews.map((r) => ({
        id: r.id,
        overallRating: r.overallRating,
        workLifeBalance: r.workLifeBalance,
        mentorship: r.mentorship,
        learningOpportunity: r.learningOpportunity,
        compensation: r.compensation,
        cultureFit: r.cultureFit,
        title: r.title,
        reviewText: r.reviewText,
        pros: r.pros,
        cons: r.cons,
        jobTitle: r.jobTitle,
        isAnonymous: r.isAnonymous,
        isVerified: r.isVerified,
        reviewer: r.isAnonymous
          ? { university: r.reviewer.university }
          : {
              firstName: r.reviewer.firstName,
              lastName: r.reviewer.lastName,
              photo: r.reviewer.photo,
              university: r.reviewer.university,
            },
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/reviews
 * Create a new employer review. Student auth required.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      companyName,
      jobTitle,
      department,
      overallRating,
      workLifeBalance,
      mentorship,
      learningOpportunity,
      compensation,
      cultureFit,
      title,
      reviewText,
      pros,
      cons,
      isAnonymous,
    } = body

    if (!companyName || !overallRating || !reviewText) {
      return NextResponse.json(
        { error: 'Company name, overall rating, and review text are required' },
        { status: 400 }
      )
    }

    if (overallRating < 1 || overallRating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    // Check if user already reviewed this company
    const existing = await prisma.employerReview.findFirst({
      where: {
        reviewerId: session.user.id,
        companyName: { equals: companyName, mode: 'insensitive' },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this company' },
        { status: 409 }
      )
    }

    // Check if review is verified via placement record
    const placement = await prisma.placement.findFirst({
      where: {
        studentId: session.user.id,
        companyName: { equals: companyName, mode: 'insensitive' },
      },
    })

    const review = await prisma.employerReview.create({
      data: {
        reviewerId: session.user.id,
        companyName,
        jobTitle: jobTitle || null,
        department: department || null,
        overallRating,
        workLifeBalance: workLifeBalance || null,
        mentorship: mentorship || null,
        learningOpportunity: learningOpportunity || null,
        compensation: compensation || null,
        cultureFit: cultureFit || null,
        title: title || null,
        reviewText,
        pros: pros || null,
        cons: cons || null,
        isAnonymous: isAnonymous || false,
        isVerified: !!placement,
        placementId: placement?.id || null,
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Review create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
