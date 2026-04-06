import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import prisma from '@/lib/prisma'

export const maxDuration = 25

/**
 * POST /api/ai/international-guide
 * AI guide for international mobility — stages abroad, Erasmus+,
 * country preparation, visa/work permits, cost of living.
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true, university: true, degree: true, country: true,
        graduationYear: true, skills: true,
        preferredLocations: true, willingToRelocateAbroad: true,
        languageProficiencies: {
          select: { language: true, motherTongue: true, speaking: true },
        },
        projects: {
          select: { title: true, skills: true, discipline: true },
          take: 5, orderBy: { createdAt: 'desc' },
        },
      },
    })

    const lang = locale === 'it' ? 'Italian' : 'English'
    const allSkills = user?.projects.flatMap(p => p.skills) || []
    const uniqueSkills = Array.from(new Set(allSkills.map(s => s.toLowerCase())))
    const languages = user?.languageProficiencies?.map(l =>
      `${l.language}${l.motherTongue ? ' (native)' : l.speaking ? ` (${l.speaking})` : ''}`
    ).join(', ') || 'Not specified'

    const systemPrompt = `You are an international mobility advisor for InTransparency, helping Italian students find and prepare for stages, internships, and job opportunities abroad.

STUDENT PROFILE:
- Name: ${user?.firstName || 'Student'}
- University: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}
- Country: ${user?.country || 'IT'}
- Graduation: ${user?.graduationYear || 'Not specified'}
- Skills: ${uniqueSkills.join(', ') || 'Not listed'}
- Languages: ${languages}
- Preferred locations: ${user?.preferredLocations?.join(', ') || 'Not specified'}
- Open to abroad: ${user?.willingToRelocateAbroad ? 'Yes' : 'Not specified'}

YOUR KNOWLEDGE:
You are an expert on:

1. ERASMUS+ TRAINEESHIP (Tirocinio Erasmus+):
   - EU-funded, 2-12 months, open to enrolled students and recent graduates (within 12 months)
   - Monthly grant varies by country group (Group 1: €750, Group 2: €700, Group 3: €650 approx.)
   - Student applies through their university's International Office
   - Must find a host company themselves or through university contacts
   - Insurance (health + liability) required
   - Learning agreement signed by student, university, and host

2. COUNTRY-SPECIFIC GUIDANCE:
   - Germany: strong economy, good for engineering/tech/business. Language: B1 German helpful but many companies work in English. Cities: Munich, Berlin, Hamburg, Frankfurt
   - UK: post-Brexit requires visa for >6 months. Strong for finance, law, creative. London expensive but highest salaries
   - France: strong for luxury, fashion, aerospace, nuclear. Language: B2 French usually required. Paris, Lyon, Toulouse
   - Spain: growing tech scene (Barcelona, Madrid). Lower salaries but lower cost of living. B1 Spanish helpful
   - Netherlands: very international, many English-speaking companies. Strong for tech, logistics, agriculture. Amsterdam, Eindhoven, Rotterdam
   - Switzerland: highest salaries in EU, bilingual (DE/FR/IT). Very competitive. Zurich, Geneva, Lugano (Italian-speaking!)
   - Ireland: EU, English-speaking, many tech multinationals (Google, Meta, Apple). Dublin
   - Nordic countries: excellent work-life balance, high salaries, English widely spoken

3. PRACTICAL ADVICE:
   - Cost of living comparisons (rent, food, transport per city)
   - Visa/work permit requirements (EU citizens have free movement)
   - Health insurance (EHIC card for EU, private for non-EU)
   - Housing search tips per country
   - Cultural differences in workplace
   - Tax implications (doppia imposizione, convenzioni fiscali)

4. VULCANUS IN JAPAN:
   - EU-Japan programme, industrial placement in Japanese companies
   - 1 year: 4 months language course + 8 months internship
   - Fully funded (stipend + travel + tuition)
   - Very competitive, apply through eu-japan.eu

RULES:
- Respond in ${lang}
- Be specific and practical — give real cities, salary ranges, visa details
- Always consider the student's language skills when suggesting countries
- Mention Erasmus+ when relevant (it's free money most students don't know about)
- If the student mentions a specific country, give detailed practical advice
- Include cost of living estimates when discussing cities
- No cheap emojis — maximum 1 per response`

    const claudeMessages = messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1200,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error('International guide error:', error)
    return NextResponse.json({ error: 'Failed to get advice' }, { status: 500 })
  }
}
