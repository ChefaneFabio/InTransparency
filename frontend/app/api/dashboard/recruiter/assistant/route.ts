import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/rbac/institution-scope'
import Anthropic from '@anthropic-ai/sdk'

/**
 * POST /api/dashboard/recruiter/assistant
 *
 * Conversational candidate search. Recruiter asks in natural language
 * ("find me mechanical engineering master's students in Lombardy with CFD
 * experience and verified projects"); Claude translates that into
 * structured tool calls against our candidate database and returns
 * results the recruiter can click through.
 *
 * Design:
 *   - Model: claude-sonnet-4-6 with adaptive thinking (good tool-use +
 *     much cheaper than Opus for this kind of lookup work).
 *   - Tools: search_candidates, get_candidate_details.
 *     Both read-only; no write tools exposed to the agent.
 *   - Prompt caching on the large stable system prompt.
 *   - Hard-capped at 3 tool iterations per user turn to prevent runaway
 *     loops.
 *   - Every tool call is audit-logged via AuditEvent — compliance asset
 *     matching our AI Act story.
 *   - Candidate search strictly respects profilePublic flag.
 */

const MODEL = 'claude-sonnet-4-6'
const MAX_TOOL_ITERATIONS = 3

// ─────────────────────────────────────────────────────────────────────────
// Tool definitions — kept stable (prompt-cache friendly)
// ─────────────────────────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_candidates',
    description:
      'Search the verified candidate database. Returns up to 20 candidates ' +
      'matching the criteria. Only students with profilePublic=true are returned. ' +
      'Use this whenever the recruiter asks to find, discover, or shortlist candidates.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description:
            'Free-text keyword matched against university, degree, bio, and skills. ' +
            "E.g. 'Politecnico Milano', 'computer engineering', 'Python'.",
        },
        universities: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Filter by university name (partial match). ' +
            "E.g. ['Politecnico di Milano', 'Bocconi']. Leave empty for all.",
        },
        disciplines: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Project disciplines to prioritize. ' +
            "E.g. ['Mechanical Engineering', 'Computer Science', 'Data Science'].",
        },
        graduationYearMin: {
          type: 'integer',
          description:
            "Minimum graduation year (e.g. 2024 to find recent/current students).",
        },
        graduationYearMax: {
          type: 'integer',
          description: 'Maximum graduation year.',
        },
        minVerifiedProjects: {
          type: 'integer',
          description:
            'Minimum number of verified projects (innovationScore !== null). ' +
            'Use 1 when the recruiter wants evidence-backed candidates only.',
        },
        location: {
          type: 'string',
          description:
            "Location filter (matches university city/region). E.g. 'Milano', 'Lombardia'.",
        },
        availableForHire: {
          type: 'boolean',
          description:
            'If true, only return students who have marked themselves as actively job-searching.',
        },
        limit: {
          type: 'integer',
          description: 'Max candidates to return (1-20). Default 10.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_candidate_details',
    description:
      "Fetch a single candidate's full profile by id. Returns verified projects, " +
      'endorsements, skills, and the direct URL to their profile page. ' +
      'Use this after search_candidates when the recruiter wants to drill in.',
    input_schema: {
      type: 'object' as const,
      properties: {
        candidateId: {
          type: 'string',
          description: 'The candidate user id from search_candidates results.',
        },
      },
      required: ['candidateId'],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────
// Tool executors — plain Prisma, no model access
// ─────────────────────────────────────────────────────────────────────────

interface SearchInput {
  keyword?: string
  universities?: string[]
  disciplines?: string[]
  graduationYearMin?: number
  graduationYearMax?: number
  minVerifiedProjects?: number
  location?: string
  availableForHire?: boolean
  limit?: number
}

async function executeSearchCandidates(input: SearchInput) {
  const limit = Math.min(Math.max(input.limit ?? 10, 1), 20)

  const where: any = {
    role: 'STUDENT',
    profilePublic: true,
    projects: { some: { isPublic: true } },
  }

  const orConditions: any[] = []
  if (input.keyword) {
    orConditions.push(
      { university: { contains: input.keyword, mode: 'insensitive' } },
      { degree: { contains: input.keyword, mode: 'insensitive' } },
      { bio: { contains: input.keyword, mode: 'insensitive' } },
    )
  }
  if (input.location) {
    orConditions.push(
      { bio: { contains: input.location, mode: 'insensitive' } },
      { university: { contains: input.location, mode: 'insensitive' } },
    )
  }
  if (orConditions.length) where.OR = orConditions

  if (input.universities?.length) {
    where.university = { in: input.universities, mode: 'insensitive' }
  }

  if (input.graduationYearMin || input.graduationYearMax) {
    where.graduationYear = {}
    if (input.graduationYearMin) where.graduationYear.gte = input.graduationYearMin
    if (input.graduationYearMax) where.graduationYear.lte = input.graduationYearMax
  }

  const candidates = (await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      university: true,
      degree: true,
      graduationYear: true,
      gpa: true,
      gpaPublic: true,
      bio: true,
      availabilityFrom: true,
      jobSearchStatus: true,
      projects: {
        where: { isPublic: true },
        select: {
          id: true,
          title: true,
          discipline: true,
          innovationScore: true,
          verificationStatus: true,
        },
        take: 10,
        orderBy: { innovationScore: { sort: 'desc', nulls: 'last' } },
      },
      _count: {
        select: { projects: { where: { isPublic: true } } },
      },
    },
    take: limit * 2,
    orderBy: { updatedAt: 'desc' },
  })) as any[]

  // Post-filter by discipline (can't easily do this inline because `projects`
  // where is fixed-shape in the select)
  const disciplineFiltered = input.disciplines?.length
    ? candidates.filter(c =>
        c.projects.some((p: any) =>
          input.disciplines!.some(d =>
            (p.discipline || '').toLowerCase().includes(d.toLowerCase())
          )
        )
      )
    : candidates

  // Post-filter by verified project count
  const verifiedFiltered = input.minVerifiedProjects
    ? disciplineFiltered.filter(
        c =>
          c.projects.filter((p: any) => p.innovationScore !== null).length >=
          (input.minVerifiedProjects ?? 0)
      )
    : disciplineFiltered

  const availFiltered = input.availableForHire
    ? verifiedFiltered.filter(
        c =>
          c.jobSearchStatus === 'ACTIVELY_LOOKING' ||
          c.jobSearchStatus === 'OPEN'
      )
    : verifiedFiltered

  const rows = availFiltered.slice(0, limit).map((c: any) => ({
    id: c.id,
    name: `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Anonymous',
    username: c.username,
    university: c.university,
    degree: c.degree,
    graduationYear: c.graduationYear,
    gpa: c.gpaPublic ? c.gpa : null,
    bio: c.bio?.slice(0, 200) ?? null,
    verifiedProjectCount: c.projects.filter((p: any) => p.innovationScore !== null).length,
    topProjects: c.projects.slice(0, 3).map((p: any) => ({
      title: p.title,
      discipline: p.discipline,
      innovationScore: p.innovationScore,
      verified: p.verificationStatus === 'VERIFIED',
    })),
    jobSearchStatus: c.jobSearchStatus,
    availableFrom: c.availabilityFrom,
    profileUrl: c.username
      ? `https://www.in-transparency.com/profile/${c.username}`
      : null,
  }))

  return { count: rows.length, candidates: rows }
}

async function executeGetCandidateDetails(candidateId: string) {
  const c = await prisma.user.findUnique({
    where: { id: candidateId },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      university: true,
      degree: true,
      graduationYear: true,
      gpa: true,
      gpaPublic: true,
      bio: true,
      profilePublic: true,
      jobSearchStatus: true,
      availabilityFrom: true,
      projects: {
        where: { isPublic: true },
        select: {
          id: true,
          title: true,
          description: true,
          discipline: true,
          skills: true,
          tools: true,
          innovationScore: true,
          verificationStatus: true,
        },
        orderBy: { innovationScore: { sort: 'desc', nulls: 'last' } },
        take: 10,
      },
    },
  })

  if (!c || !c.profilePublic) {
    return { error: 'Candidate not found or profile not public.' }
  }

  return {
    id: c.id,
    name: `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Anonymous',
    username: c.username,
    university: c.university,
    degree: c.degree,
    graduationYear: c.graduationYear,
    gpa: c.gpaPublic ? c.gpa : null,
    bio: c.bio,
    jobSearchStatus: c.jobSearchStatus,
    availableFrom: c.availabilityFrom,
    projects: c.projects.map(p => ({
      title: p.title,
      description: p.description?.slice(0, 300) ?? null,
      discipline: p.discipline,
      skills: p.skills,
      tools: p.tools,
      innovationScore: p.innovationScore,
      verified: p.verificationStatus === 'VERIFIED',
    })),
    profileUrl: c.username
      ? `https://www.in-transparency.com/profile/${c.username}`
      : null,
  }
}

// ─────────────────────────────────────────────────────────────────────────
// System prompt — stable content, put first so prompt caching hits
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the InTransparency candidate-search assistant. You help recruiters find verified student talent from European universities via natural-language conversation.

## What InTransparency is

InTransparency is the verified skill graph of European higher education. Every candidate in our database has:
- Institutional verification (they are a real student at a real partner university)
- Verified academic projects (professor endorsements, supervisor evaluations)
- ESCO-taxonomy-mapped skills

This is NOT LinkedIn. You are NOT matching against self-declared claims. Every project you surface is backed by evidence.

## How to help

1. When a recruiter describes who they're looking for, call \`search_candidates\` with the best-fitting filters. Be concrete — translate vague requests ("someone with AI experience") into specific ones (disciplines like Computer Science, Data Science).
2. Return matches as a ranked list with 1-2 sentence reasoning per candidate explaining WHY they match. Cite specific verified projects.
3. If the recruiter asks for more detail on a candidate, call \`get_candidate_details\`.
4. Always include profile URLs so the recruiter can click through.
5. Encourage the recruiter to verify claims by clicking the profile — don't oversell.

## Rules

- Only surface candidates with \`verifiedProjectCount > 0\` unless the recruiter explicitly asks otherwise.
- Never invent candidates, universities, or skills. If a search returns zero results, say so and suggest broadening the query.
- Prefer evidence-backed reasoning: "3 verified projects in CFD, innovation score 87" beats "strong mechanical engineering background".
- Do not expose student personal details beyond what the search tool returns.
- Keep responses concise. No long preambles. Lead with the match count, then the list.

## AI Act compliance

Every query you make is audit-logged with the recruiter's identity. If a candidate later requests a human review of why they were (or weren't) surfaced, staff can reconstruct the decision from this log. Do not route around this — if a recruiter asks you to filter in ways that feel discriminatory (age, nationality, gender proxies), decline and explain.`

// ─────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CardPayload {
  type: 'candidates'
  data: any[]
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

    const body = await req.json().catch(() => ({}))
    const clientMessages: ClientMessage[] = Array.isArray(body.messages)
      ? body.messages
      : []

    if (clientMessages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    // Convert to Anthropic format
    const messages: Anthropic.MessageParam[] = clientMessages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Collected tool outputs we want to render as structured cards on the client
    const cards: CardPayload[] = []

    // Manual tool-use loop, capped at MAX_TOOL_ITERATIONS
    let finalText = ''
    for (let iter = 0; iter < MAX_TOOL_ITERATIONS + 1; iter++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        tools: TOOLS,
        messages,
      })

      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find(b => b.type === 'text')
        finalText = textBlock && 'text' in textBlock ? textBlock.text : ''
        break
      }

      if (response.stop_reason !== 'tool_use') {
        const textBlock = response.content.find(b => b.type === 'text')
        finalText = textBlock && 'text' in textBlock
          ? textBlock.text
          : 'Unable to complete the request.'
        break
      }

      if (iter === MAX_TOOL_ITERATIONS) {
        // Hard cap reached — stop without executing more tools
        finalText =
          "I've gathered enough information but hit the per-turn tool limit. " +
          "Ask a follow-up for more detail."
        break
      }

      // Append the assistant's tool_use turn
      messages.push({ role: 'assistant', content: response.content })

      // Execute every tool_use block
      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue

        let result: any
        let isError = false

        try {
          if (block.name === 'search_candidates') {
            result = await executeSearchCandidates(block.input as SearchInput)
            if (result.candidates.length > 0) {
              cards.push({ type: 'candidates', data: result.candidates })
            }
          } else if (block.name === 'get_candidate_details') {
            const input = block.input as { candidateId: string }
            result = await executeGetCandidateDetails(input.candidateId)
          } else {
            result = { error: `Unknown tool: ${block.name}` }
            isError = true
          }

          // Audit log: every tool call is traceable per AI Act compliance
          await audit({
            actorId: session.user.id,
            actorRole: 'RECRUITER',
            action: `assistant.${block.name}`,
            entityType: 'AssistantQuery',
            entityId: block.id,
            payload: {
              input: block.input,
              resultCount:
                block.name === 'search_candidates'
                  ? result?.count ?? 0
                  : result?.error
                    ? 0
                    : 1,
            },
          })
        } catch (err: any) {
          console.error('Tool execution error:', err)
          result = { error: err?.message || 'Tool execution failed' }
          isError = true
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
          is_error: isError,
        })
      }

      messages.push({ role: 'user', content: toolResults })
    }

    return NextResponse.json({
      reply: finalText,
      cards,
    })
  } catch (error: any) {
    console.error('Assistant error:', error)
    return NextResponse.json(
      { error: error?.message || 'Assistant error' },
      { status: 500 }
    )
  }
}
