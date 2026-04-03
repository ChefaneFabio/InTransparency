import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { profilePublic, portfolioUrl, firstName, lastName, bio, photo, university, degree, graduationYear, company, jobTitle, skills } = body

    // Gate portfolioUrl behind STUDENT_PREMIUM
    if (portfolioUrl !== undefined && portfolioUrl !== null && portfolioUrl !== '') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true }
      })

      if (user?.subscriptionTier !== 'STUDENT_PREMIUM') {
        return NextResponse.json({
          error: 'Custom portfolio URL requires a Premium subscription',
          upgradeUrl: '/dashboard/student/upgrade',
        }, { status: 403 })
      }
    }

    // Build update data — only set fields that were provided
    const updateData: any = {}
    if (profilePublic !== undefined) updateData.profilePublic = profilePublic
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl || null
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (bio !== undefined) updateData.bio = bio
    if (photo !== undefined) updateData.photo = photo
    if (university !== undefined) updateData.university = university
    if (degree !== undefined) updateData.degree = degree
    if (graduationYear !== undefined) updateData.graduationYear = graduationYear
    if (company !== undefined) updateData.company = company
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle
    if (skills !== undefined) updateData.skills = skills

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        profilePublic: true,
        portfolioUrl: true,
        username: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        photo: true,
        bio: true,
        university: true,
        degree: true,
        graduationYear: true,
        profilePublic: true,
        totpEnabled: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
