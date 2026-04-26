import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'

// Anthropic calls with 2000 max_tokens routinely take 15-30s. Without an
// explicit maxDuration, Vercel cuts the function at the platform default
// (10-15s on most plans), causing 408 timeouts that the UI surfaces as
// "Request timeout" errors. 60s gives generous headroom.
export const maxDuration = 60

// POST /api/dashboard/recruiter/hiring-advisor
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { messages, context } = await req.json()

    // Get company context
    const settings = await prisma.recruiterSettings.findUnique({
      where: { userId: session.user.id },
      select: { companyName: true, companyIndustry: true, companyWebsite: true, companySize: true },
    })

    const activeJobs = await prisma.job.findMany({
      where: { recruiterId: session.user.id, status: 'ACTIVE' },
      select: { title: true, jobType: true, location: true },
      take: 10,
    })

    const recentHires = await prisma.savedCandidate.count({
      where: { recruiterId: session.user.id, folder: 'hired' },
    })

    const systemPrompt = `You are an expert Hiring Advisor for InTransparency, a platform connecting companies with university talent in Italy and Europe.

Company context:
- Company: ${settings?.companyName || user.company || 'Unknown'}
- Industry: ${settings?.companyIndustry || 'Not specified'}
- Company size: ${settings?.companySize || 'Not specified'}
- Active jobs: ${activeJobs.map(j => j.title).join(', ') || 'None'}
- Total hires on platform: ${recentHires}

You help recruiters with:
1. **Job Description Writing** — Craft compelling, inclusive JDs that attract top university talent. Include salary transparency tips (Italian market context).
2. **Salary Benchmarking** — Provide Italian/European entry-level and mid-level salary ranges by role and industry. Use real market data ranges.
3. **Interview Strategy** — Suggest structured interview questions, competency frameworks, and evaluation rubrics tailored to the role.
4. **Candidate Evaluation** — Help assess candidates objectively: what to look for in portfolios, projects, and university backgrounds.
5. **Hiring Strategy** — Advise on employer branding, university partnerships, talent pipeline building, and reducing time-to-hire.
6. **Legal & Compliance** — Italian employment law basics: contract types (tempo determinato/indeterminato, stage, apprendistato), notice periods, trial periods, CCNL references.
7. **Onboarding Best Practices** — First 90 days planning, mentorship setup, performance milestones.
8. **Diversity & Inclusion** — Inclusive hiring practices, bias reduction in screening, accessible job postings.

Guidelines:
- Be specific and actionable, not generic. Give concrete examples.
- When discussing salaries, use EUR ranges appropriate for the Italian market.
- Reference Italian employment law specifics when relevant (contratto a tempo determinato, CCNL, etc.).
- If asked about a specific role, tailor advice to that role's typical requirements.
- Keep responses focused and professional but approachable.
- Format with markdown: headers, bullet points, bold for key terms.
- If the recruiter describes a problem, diagnose it before prescribing solutions.
- Answer in the same language the recruiter uses (Italian or English).`

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Hiring advisor error:', error)
    return NextResponse.json({ error: 'Failed to get advice' }, { status: 500 })
  }
}
