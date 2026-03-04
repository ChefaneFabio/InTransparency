import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/linkedin/share
 *
 * Generates a LinkedIn share URL for the authenticated user's public profile
 * or a specific project. Returns the share URL and pre-formatted text.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'profile' // 'profile' or 'project'
    const projectId = searchParams.get('projectId')

    const baseUrl = process.env.NEXTAUTH_URL || 'https://intransparency.eu'
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        university: true,
        degree: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let shareUrl: string
    let shareText: string

    if (type === 'project' && projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id, isPublic: true },
        select: { title: true, discipline: true },
      })

      if (!project) {
        return NextResponse.json({ error: 'Project not found or not public' }, { status: 404 })
      }

      shareUrl = `${baseUrl}/explore/projects/${projectId}`
      shareText = `Check out my verified project "${project.title}" on InTransparency — where academic achievements are institution-verified and AI-analyzed.\n\n#InTransparency #VerifiedPortfolio #${project.discipline || 'Students'}`
    } else {
      shareUrl = user.username
        ? `${baseUrl}/students/${user.username}`
        : `${baseUrl}/explore`

      const degree = user.degree ? ` studying ${user.degree}` : ''
      const university = user.university ? ` at ${user.university}` : ''

      shareText = `I've built my verified portfolio on InTransparency${degree}${university}. My projects and skills are institution-verified — no CV inflation here!\n\n#InTransparency #VerifiedPortfolio #Hiring #Students`
    }

    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

    return NextResponse.json({
      shareUrl,
      linkedInShareUrl,
      shareText,
      profileName: `${user.firstName} ${user.lastName}`,
    })
  } catch (error) {
    console.error('Error generating LinkedIn share:', error)
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 })
  }
}
