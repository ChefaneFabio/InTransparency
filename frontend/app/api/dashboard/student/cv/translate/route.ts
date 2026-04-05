import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'

export const maxDuration = 30

/**
 * POST /api/dashboard/student/cv/translate
 * AI-translates the student's CV content into a target language.
 * Premium feature — leverages institutional verification as trust signal.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetLanguage = 'English' } = await request.json()

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true, lastName: true, bio: true, tagline: true,
        university: true, degree: true, location: true,
        workExperience: true, thesisTitle: true,
        desiredOccupation: true, preferredSectors: true,
        projects: {
          select: { title: true, description: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build the content to translate
    const sections: Record<string, string> = {}
    if (user.bio) sections.bio = user.bio
    if (user.tagline) sections.tagline = user.tagline
    if (user.thesisTitle) sections.thesisTitle = user.thesisTitle
    if (user.desiredOccupation) sections.desiredOccupation = user.desiredOccupation

    const workExps = Array.isArray(user.workExperience) ? user.workExperience : []
    for (let i = 0; i < workExps.length; i++) {
      const exp = workExps[i] as any
      if (exp.description) sections[`work_${i}_description`] = exp.description
      if (exp.role) sections[`work_${i}_role`] = exp.role
    }

    for (let i = 0; i < user.projects.length; i++) {
      const p = user.projects[i]
      if (p.description) sections[`project_${i}_description`] = p.description
    }

    if (Object.keys(sections).length === 0) {
      return NextResponse.json({ translations: {}, message: 'Nothing to translate' })
    }

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Translate the following CV content into ${targetLanguage}. Keep it professional, concise, and appropriate for a CV/resume. Maintain the same meaning but adapt to ${targetLanguage} conventions.

Return ONLY a JSON object with the same keys, translated values:

${JSON.stringify(sections, null, 2)}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    let translations: Record<string, string> = {}
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      translations = JSON.parse(cleaned)
    } catch {
      translations = {}
    }

    return NextResponse.json({ translations, targetLanguage })
  } catch (error) {
    console.error('CV translate error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
