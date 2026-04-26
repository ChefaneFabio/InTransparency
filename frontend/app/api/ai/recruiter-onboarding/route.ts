import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'

/**
 * POST /api/ai/recruiter-onboarding
 *
 * Conversational onboarding for new recruiters. The chat extracts:
 *   - Company info (name, industry, size, location, description, seekingType)
 *   - First job draft (title, description, type, location, skills)
 *
 * On each turn the AI returns a JSON envelope: { reply, extracted, complete }.
 *   - reply       → message shown to the recruiter
 *   - extracted   → fields to merge into RecruiterSettings + draft Job
 *   - complete    → true once we have enough to write to the DB and exit
 *
 * When `complete=true` and the request body has `confirm: true`, we upsert
 * RecruiterSettings and create a DRAFT Job. The client then redirects the
 * recruiter to /dashboard/recruiter/jobs/<id> for final review.
 */

const SYSTEM_PROMPT = `You are the InTransparency Hiring Advisor — the conversational onboarding for a new recruiter signing up for a hiring platform.

YOUR JOB:
Through 3-4 short turns, learn enough to pre-fill (a) the recruiter's company profile and (b) a first draft job they want to publish.

ASK ABOUT (in this order, batched naturally):
1. Their company in 1-2 sentences (what they do, rough size). You may already have a name from email — confirm and probe.
2. The role they're hiring for (title, type, location, why now).
3. The must-have skills/experience and any nice-to-have signals.
4. Compensation if they want to share (always optional).

OUTPUT FORMAT:
On EVERY turn, reply with ONE JSON object — no markdown fences, no commentary outside the JSON:

{
  "reply": "string — what to say to the recruiter, 1-3 sentences, warm but efficient",
  "extracted": {
    "companyName": "...",
    "companyIndustry": "...",
    "companySize": "1-10" | "11-50" | "51-200" | "201-500" | "500+",
    "companyLocation": "...",
    "companyDescription": "...",
    "seekingType": "HIRE" | "PROJECTS" | "BOTH",
    "job": {
      "title": "...",
      "description": "...",
      "responsibilities": "...",
      "requirements": "...",
      "niceToHave": "...",
      "jobType": "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE",
      "workLocation": "ONSITE" | "REMOTE" | "HYBRID",
      "location": "...",
      "salaryMin": 0,
      "salaryMax": 0,
      "hardSkills": ["..."],
      "softSkills": ["..."],
      "designSkills": ["..."],
      "domainKnowledge": ["..."],
      "languages": ["..."],
      "requiredSkills": ["..."],
      "preferredSkills": ["..."],
      "experience": "...",
      "education": "..."
    }
  },
  "complete": false
}

RULES:
- Only include fields you've actually learned this turn or earlier — omit unknown ones.
- SKILLS MUST BE CATEGORIZED. Never lump everything into requiredSkills.
  - hardSkills = technical/tools/frameworks/programming languages (Rust, AWS, Linux, Figma, Assembly)
  - softSkills = interpersonal/behavioral (Communication, Teamwork, Leadership, Problem solving)
  - designSkills = design-specific only (UX research, Visual design, Prototyping)
  - domainKnowledge = industry/domain expertise (Manufacturing, Fintech, Healthcare)
  - languages = SPOKEN languages with optional CEFR level (Italian, German B2). NEVER programming languages.
  - requiredSkills = backwards-compat union (concat the four buckets above).
- "complete" goes true ONLY when you have at least: companyName, companyDescription, AND a job with title + description + jobType + at least 3 categorized skills (across the typed buckets).
- When complete, your "reply" should ask "Want me to save this and open the draft for review?" — wait for confirmation.
- Italian-language users are common. Mirror their language.
- Be warm but quick. Do not ask 5 things at once. 1-2 questions per turn.`

interface ExtractedJob {
  title?: string
  description?: string
  responsibilities?: string
  requirements?: string
  niceToHave?: string
  jobType?: string
  workLocation?: string
  location?: string
  salaryMin?: number
  salaryMax?: number
  // Typed skill buckets
  hardSkills?: string[]
  softSkills?: string[]
  designSkills?: string[]
  domainKnowledge?: string[]
  languages?: string[]
  // Legacy unions
  requiredSkills?: string[]
  preferredSkills?: string[]
  experience?: string
  education?: string
}

interface Extracted {
  companyName?: string
  companyIndustry?: string
  companySize?: string
  companyLocation?: string
  companyDescription?: string
  seekingType?: string
  job?: ExtractedJob
}

interface Turn {
  reply: string
  extracted: Extracted
  complete: boolean
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = getClientIp(req)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = Array.isArray(body.messages)
      ? body.messages
      : []
    const accumulated: Extracted = body.accumulated || {}
    const confirm = body.confirm === true
    const seedDomainName = typeof body.seedCompanyName === 'string' ? body.seedCompanyName : undefined

    // ── If client asks to commit, write to DB and exit ──
    if (confirm && accumulated.companyName) {
      const userId = session.user.id

      await prisma.recruiterSettings.upsert({
        where: { userId },
        create: {
          userId,
          companyName: accumulated.companyName,
          companyIndustry: accumulated.companyIndustry || null,
          companySize: accumulated.companySize || null,
          companyLocation: accumulated.companyLocation || null,
          companyDescription: accumulated.companyDescription || null,
          seekingType: (accumulated.seekingType as any) || 'BOTH',
        },
        update: {
          companyName: accumulated.companyName,
          companyIndustry: accumulated.companyIndustry ?? undefined,
          companySize: accumulated.companySize ?? undefined,
          companyLocation: accumulated.companyLocation ?? undefined,
          companyDescription: accumulated.companyDescription ?? undefined,
          seekingType: (accumulated.seekingType as any) ?? undefined,
        },
      })

      let jobId: string | null = null
      const j = accumulated.job
      if (j && j.title && j.description) {
        const slug =
          (j.title || 'job')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 60) +
          '-' +
          Date.now().toString(36)

        // Persist typed skill buckets. Build requiredSkills as the union of
        // hard + soft + design + domain so back-compat search/agents code
        // continues to see the full skill set.
        const hard   = Array.isArray(j.hardSkills)      ? j.hardSkills      : []
        const soft   = Array.isArray(j.softSkills)      ? j.softSkills      : []
        const design = Array.isArray(j.designSkills)    ? j.designSkills    : []
        const domain = Array.isArray(j.domainKnowledge) ? j.domainKnowledge : []
        const langs  = Array.isArray(j.languages)       ? j.languages       : []
        // If the AI returned a flat requiredSkills (legacy or fallback), trust
        // the typed buckets when they exist; otherwise use the flat array.
        const requiredUnion = (hard.length || soft.length || design.length || domain.length)
          ? [...hard, ...soft, ...design, ...domain]
          : (Array.isArray(j.requiredSkills) ? j.requiredSkills : [])

        const created = await prisma.job.create({
          data: {
            recruiterId: userId,
            companyName: accumulated.companyName,
            companyIndustry: accumulated.companyIndustry || null,
            companySize: accumulated.companySize || null,
            title: j.title,
            description: j.description,
            responsibilities: j.responsibilities || null,
            requirements: j.requirements || null,
            niceToHave: j.niceToHave || null,
            jobType: (j.jobType as any) || 'FULL_TIME',
            workLocation: (j.workLocation as any) || 'HYBRID',
            location: j.location || accumulated.companyLocation || null,
            salaryMin: j.salaryMin || null,
            salaryMax: j.salaryMax || null,
            salaryCurrency: 'EUR',
            hardSkills:      hard,
            softSkills:      soft,
            designSkills:    design,
            domainKnowledge: domain,
            languages:       langs,
            requiredSkills:  requiredUnion,
            preferredSkills: Array.isArray(j.preferredSkills) ? j.preferredSkills : [],
            experience: j.experience || null,
            education: j.education || null,
            status: 'DRAFT',
            slug,
          },
        })
        jobId = created.id
      }

      return NextResponse.json({
        committed: true,
        jobId,
        redirectTo: jobId ? `/dashboard/recruiter/jobs/${jobId}` : '/dashboard/recruiter/settings',
      })
    }

    // ── Otherwise, run a conversational turn ──
    const seedHint = seedDomainName
      ? `\n\nThe recruiter signed up with a work email that suggests the company name is "${seedDomainName}". Confirm before assuming.`
      : ''

    const accumulatedHint =
      Object.keys(accumulated).length > 0
        ? `\n\nALREADY KNOWN (do not re-ask):\n${JSON.stringify(accumulated, null, 2)}`
        : ''

    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'RECRUITER' : 'YOU'}: ${m.content}`)
      .join('\n')

    const result = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT + seedHint + accumulatedHint,
      messages: [
        {
          role: 'user',
          content: `Conversation so far:\n\n${conversationText || '(start of conversation)'}\n\nReply now with the JSON envelope.`,
        },
      ],
    })

    const raw = result.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    let turn: Turn
    try {
      turn = JSON.parse(cleaned)
    } catch {
      // Graceful fallback: treat the whole text as the reply, no extraction
      turn = { reply: raw, extracted: {}, complete: false }
    }

    return NextResponse.json(turn)
  } catch (error: any) {
    console.error('recruiter-onboarding error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process turn' },
      { status: 500 }
    )
  }
}
