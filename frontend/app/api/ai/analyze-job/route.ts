import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { buildSystemPrompt, runConversationTurn } from '@/lib/ai-conversation'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

// AI conversation turn — long Anthropic call. 60s prevents 408 timeouts.
export const maxDuration = 60

const JOB_FIELDS = [
  { name: 'title', description: 'Job title (e.g. "Frontend Developer", "Marketing Intern")', required: true },
  { name: 'description', description: 'Full job description (2-5 sentences)', required: true },
  { name: 'responsibilities', description: 'Key responsibilities (bullet points)' },
  { name: 'requirements', description: 'Required qualifications and experience' },
  { name: 'niceToHave', description: 'Nice-to-have qualifications' },
  { name: 'jobType', description: 'One of: FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE', required: true },
  { name: 'workLocation', description: 'One of: ONSITE, REMOTE, HYBRID', required: true },
  { name: 'location', description: 'City, Country (e.g. "Milano, Italy")' },
  { name: 'remoteOk', description: 'Whether remote work is allowed (true/false)' },
  { name: 'salaryMin', description: 'Minimum salary (number, in EUR)' },
  { name: 'salaryMax', description: 'Maximum salary (number, in EUR)' },
  { name: 'salaryPeriod', description: '"yearly", "monthly", or "hourly"' },
  // Typed skill buckets — DO NOT lump everything into requiredSkills.
  // Categorize each extracted skill into the right bucket.
  { name: 'hardSkills', description: 'Technical/tooling skills only — programming languages, frameworks, libraries, tools, platforms. Examples: "Rust", "AWS", "Linux", "Figma", "PostgreSQL", "Assembly".' },
  { name: 'softSkills', description: 'Interpersonal/behavioral skills only. Examples: "Communication", "Teamwork", "Leadership", "Problem solving", "Time management", "Adaptability".' },
  { name: 'designSkills', description: 'Design-specific skills if the role is design-related. Examples: "UX research", "Visual design", "Prototyping", "Design systems", "Accessibility". OMIT for non-design roles.' },
  { name: 'domainKnowledge', description: 'Industry/domain expertise. Examples: "Manufacturing", "Fintech", "E-commerce", "Healthcare", "Legal tech", "EdTech".' },
  { name: 'languages', description: 'Spoken/written languages with optional CEFR level. Examples: ["Italian", "English B2", "German C1"]. NEVER programming languages here.' },
  // Legacy unions for back-compat — populate as the union of the typed buckets above.
  { name: 'requiredSkills', description: 'Backwards-compat union — populate as concat(hardSkills, softSkills, designSkills, domainKnowledge). Do not add new items here that are missing from the typed buckets.' },
  { name: 'preferredSkills', description: 'Array of preferred/nice-to-have skills (typed-bucket categorization not required for preferred).' },
  { name: 'education', description: 'Required education level (e.g. "Bachelor\'s", "Master\'s", "Non richiesta")' },
  { name: 'experience', description: 'Required experience (e.g. "0-1 years", "3-5 years")' },
  { name: 'companyName', description: 'Company name' },
  { name: 'companyIndustry', description: 'Industry sector' },
  { name: 'applicationUrl', description: 'External application URL (if not using platform)' },
  { name: 'expiresAt', description: 'Application deadline' },
]

const CONVERSATION_GUIDE = `
1. After the first message: Extract job title, description, type, location, and required skills. Ask about compensation and work arrangement.
2. After learning basics: Ask about requirements (education, experience, languages) and nice-to-haves.
3. Then: Ask about application process (deadline, external URL, custom questions).
4. When complete: Summarize the job posting and confirm it's ready to publish.

Be smart: if the recruiter pastes a full job description, extract everything at once and just confirm.`

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

    const { messages = [], currentData = {}, locale = 'en' } = await request.json()
    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt({
      role: 'job posting assistant',
      description: 'Help recruiters create compelling job postings. Extract structured data from their description and ask smart follow-up questions to build a complete listing that attracts the right candidates.',
      fields: JOB_FIELDS,
      currentData,
      locale,
      conversationGuide: CONVERSATION_GUIDE,
    })

    const result = await runConversationTurn(systemPrompt, messages)

    return NextResponse.json({
      message: result.message,
      jobData: result.data,
      completeness: result.completeness,
    })
  } catch (error) {
    console.error('Analyze job error:', error)
    return NextResponse.json({ message: '', jobData: {}, completeness: 0 }, { status: 500 })
  }
}
