import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import prisma from '@/lib/prisma'

export const maxDuration = 25

/**
 * POST /api/ai/career-coach
 * Personalized AI career advisor that knows the student's verified profile.
 * Can answer questions about career paths, skill development, job market, abroad opportunities.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = getClientIp(request)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { messages = [], locale = 'en' } = await request.json()
    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Get full student context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true, university: true, degree: true, country: true,
        graduationYear: true, skills: true, interests: true, location: true,
        desiredOccupation: true, preferredSectors: true, preferredLocations: true,
        willingToRelocate: true, willingToRelocateAbroad: true,
        projects: {
          select: { title: true, skills: true, tools: true, discipline: true, verificationStatus: true },
          take: 10, orderBy: { createdAt: 'desc' },
        },
        applications: { select: { job: { select: { title: true, companyName: true, status: true } } }, take: 5, orderBy: { createdAt: 'desc' } },
      },
    })

    // Get job market snapshot
    const topJobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: { title: true, requiredSkills: true, location: true, jobType: true },
      take: 30,
      orderBy: { createdAt: 'desc' },
    })

    const verifiedProjects = user?.projects.filter(p => p.verificationStatus === 'VERIFIED').length || 0
    const totalProjects = user?.projects.length || 0
    const allSkills = user?.projects.flatMap(p => [...p.skills, ...p.tools]) || []
    const uniqueSkills = Array.from(new Set(allSkills.map(s => s.toLowerCase())))

    const lang = locale === 'it' ? 'Italian' : 'English'

    const systemPrompt = `You are an expert career coach for InTransparency, a platform that connects students with recruiters through verified academic portfolios.

You have access to this student's VERIFIED profile — unlike generic career advice, your guidance is based on real, institution-backed data.

STUDENT PROFILE:
- Name: ${user?.firstName || 'Student'}
- University: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}
- Country: ${user?.country || 'IT'}
- Expected Graduation: ${user?.graduationYear || 'Not specified'}
- Location: ${user?.location || 'Not specified'}
- Verified Skills: ${uniqueSkills.join(', ') || 'None yet'}
- Projects: ${totalProjects} total, ${verifiedProjects} verified
- Desired Role: ${user?.desiredOccupation || 'Not specified'}
- Preferred Sectors: ${user?.preferredSectors?.join(', ') || 'Not specified'}
- Preferred Locations: ${user?.preferredLocations?.join(', ') || 'Not specified'}
- Willing to relocate: ${user?.willingToRelocate ? 'Yes' : 'No'}
- Willing to go abroad: ${user?.willingToRelocateAbroad ? 'Yes' : 'No'}
- Recent applications: ${user?.applications?.map(a => `${(a.job as any)?.title} at ${(a.job as any)?.companyName}`).join(', ') || 'None'}

CURRENT JOB MARKET (${topJobs.length} active listings):
${topJobs.slice(0, 15).map(j => `- ${j.title} (${j.location || 'Remote'}) — needs: ${j.requiredSkills.slice(0, 5).join(', ')}`).join('\n')}

YOUR ADVANTAGES AS A COACH ON THIS PLATFORM:
- You know the student's REAL skills (verified through projects, not self-declared)
- Projects are endorsed by professors — this is a trust signal for employers
- You can compare against the actual job market (not generic advice)
- The platform has institutional connections — verified students get priority

RULES:
- Respond in ${lang}
- Be direct and actionable — not vague motivational talk
- Reference specific skills and projects the student has
- When discussing abroad opportunities, be specific about countries and what's needed
- If the student asks about a country, mention visa/work permit considerations for EU citizens
- Suggest concrete next steps (courses to take, skills to learn, companies to target)
- Never be condescending about the student's level — meet them where they are`

    const claudeMessages = messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error('Career coach error:', error)
    return NextResponse.json({ error: 'Failed to get advice' }, { status: 500 })
  }
}
