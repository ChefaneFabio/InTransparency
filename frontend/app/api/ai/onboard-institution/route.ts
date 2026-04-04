import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { buildSystemPrompt, runConversationTurn } from '@/lib/ai-conversation'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

const UNIVERSITY_FIELDS = [
  { name: 'name', description: 'Full institution name', required: true },
  { name: 'shortName', description: 'Abbreviation/acronym (e.g. "PoliMi", "UniBo")' },
  { name: 'description', description: 'Brief description of the institution (2-4 sentences)' },
  { name: 'website', description: 'Website URL' },
  { name: 'email', description: 'Contact email' },
  { name: 'phone', description: 'Contact phone' },
  { name: 'address', description: 'Street address' },
  { name: 'city', description: 'City', required: true },
  { name: 'region', description: 'Region/Province' },
  { name: 'country', description: 'Country (ISO code, default IT)', required: true },
  { name: 'programs', description: 'Array of academic programs/departments offered' },
  { name: 'studentCount', description: 'Approximate number of students' },
  { name: 'focusAreas', description: 'Array of key focus areas (e.g. "Engineering", "Business", "Design")' },
  { name: 'partnershipGoals', description: 'What the institution hopes to achieve on the platform' },
]

const TECHPARK_FIELDS = [
  { name: 'parkName', description: 'Tech park / innovation hub name', required: true },
  { name: 'parkType', description: 'One of: PUBLIC, PRIVATE, MIXED (default PRIVATE)' },
  { name: 'description', description: 'Brief description of the park (2-4 sentences)' },
  { name: 'website', description: 'Website URL' },
  { name: 'email', description: 'Contact email' },
  { name: 'phone', description: 'Contact phone' },
  { name: 'address', description: 'Street address' },
  { name: 'city', description: 'City', required: true },
  { name: 'region', description: 'Region/Province' },
  { name: 'country', description: 'Country (ISO code, default IT)', required: true },
  { name: 'focusAreas', description: 'Array of innovation focus areas (e.g. "AI", "Biotech", "Industry 4.0")' },
  { name: 'memberCompanyCount', description: 'Number of member companies' },
  { name: 'foundedYear', description: 'Year the park was founded' },
  { name: 'subdivisions', description: 'Array of subdivision/department names within the park' },
]

const UNI_GUIDE = `
1. After first message: Extract name, city, country, description. Ask about programs and focus areas.
2. Then: Ask about contact details (website, email, phone) and student count.
3. Then: Ask what they hope to achieve on the platform (placement tracking, recruiter connections, student verification).
4. When complete: Welcome them and confirm their profile is ready.`

const TECHPARK_GUIDE = `
1. After first message: Extract park name, city, country, type, description. Ask about focus areas and member companies.
2. Then: Ask about contact details (website, email, phone) and founded year.
3. Then: Ask about subdivisions/departments and what they want from the platform.
4. When complete: Welcome them and confirm their profile is ready.`

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ip = getClientIp(request)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { messages = [], currentData = {}, locale = 'en', type = 'university' } = await request.json()
    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    const isTechPark = type === 'techpark'

    const systemPrompt = buildSystemPrompt({
      role: isTechPark ? 'tech park onboarding assistant' : 'academic institution onboarding assistant',
      description: isTechPark
        ? 'Help tech parks and innovation hubs set up their profile on InTransparency. Gather information about their focus areas, member companies, and what they offer to students and startups.'
        : 'Help universities, schools, and ITS institutes set up their profile on InTransparency. Gather information about their programs, students, and what they want to achieve on the platform (placement tracking, recruiter connections, student portfolio verification).',
      fields: isTechPark ? TECHPARK_FIELDS : UNIVERSITY_FIELDS,
      currentData,
      locale,
      conversationGuide: isTechPark ? TECHPARK_GUIDE : UNI_GUIDE,
    })

    const result = await runConversationTurn(systemPrompt, messages)

    return NextResponse.json({
      message: result.message,
      profileData: result.data,
      completeness: result.completeness,
    })
  } catch (error) {
    console.error('Onboard institution error:', error)
    return NextResponse.json({ message: '', profileData: {}, completeness: 0 }, { status: 500 })
  }
}
