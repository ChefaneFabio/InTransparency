import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'
import Anthropic from '@anthropic-ai/sdk'

/**
 * POST /api/dashboard/university/assistant
 *
 * Conversational staff assistant for ITS / universities. Staff asks in
 * natural language ("which placements are at risk this week?", "who
 * hasn't had a placement yet this year?"), Claude translates that into
 * read-only queries against the institution's workspace data.
 *
 * PREMIUM-gated: a CORE institution can see the assistant UI but
 * writes/reads through this endpoint require PREMIUM. All tool calls
 * are audit-logged with the institution id, the user id, and the
 * resolved query — this is the compliance artifact we sell to
 * universities worried about AI Act obligations.
 *
 * Tools are strictly read-only. The assistant cannot change stages,
 * send messages, or touch student data directly — it reports what
 * exists and lets the staff take action in the workspace UIs.
 */

const MODEL = 'claude-sonnet-4-6'
const MAX_TOOL_ITERATIONS = 3

// ─────────────────────────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'list_at_risk_placements',
    description:
      'Return placements that need staff attention: tutors missing, ' +
      "overdue deadlines, or no hours logged in the last 7+ days. " +
      'Use this for "what needs my attention" / "risk" questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        riskType: {
          type: 'string',
          enum: ['no_hours', 'overdue_deadline', 'no_tutor', 'any'],
          description:
            "Type of risk to filter by, or 'any' for all. Default 'any'.",
        },
        limit: {
          type: 'integer',
          description: 'Max rows to return (1-30). Default 15.',
        },
      },
      required: [],
    },
  },
  {
    name: 'list_students_without_placement',
    description:
      "Return affiliated students who don't have an active placement. " +
      'Useful for "who still needs a stage" questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description:
            "Optional program name filter (e.g. 'ITS Automation', 'Industry 4.0').",
        },
        limit: {
          type: 'integer',
          description: 'Max rows to return (1-50). Default 20.',
        },
      },
      required: [],
    },
  },
  {
    name: 'summarize_placement_stats',
    description:
      'Return aggregate placement statistics for the institution: count by ' +
      'stage, count by offer type, outcomes. Useful for dashboards and ' +
      'reports ("how many tirocini this semester", "placement rate").',
    input_schema: {
      type: 'object' as const,
      properties: {
        since: {
          type: 'string',
          description:
            'ISO date filter (only count placements with startDate >= since). ' +
            "E.g. '2025-09-01' for academic year 2025-26.",
        },
      },
      required: [],
    },
  },
  {
    name: 'list_stale_company_leads',
    description:
      "Return companies in the CRM pipeline that haven't been contacted in " +
      'the given number of days. Useful for outreach prioritization.',
    input_schema: {
      type: 'object' as const,
      properties: {
        daysSinceContact: {
          type: 'integer',
          description: 'Minimum days since last contact/activity. Default 30.',
        },
        limit: {
          type: 'integer',
          description: 'Max companies to return. Default 15.',
        },
      },
      required: [],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────

async function executeAtRisk(
  institutionId: string,
  input: { riskType?: string; limit?: number },
) {
  const limit = Math.min(Math.max(input.limit ?? 15, 1), 30)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const placements = await prisma.placement.findMany({
    where: { institutionId },
    include: {
      student: { select: { firstName: true, lastName: true } },
      currentStage: { select: { name: true } },
      deadlines: {
        where: { completedAt: null, dueAt: { lt: new Date() } },
        select: { id: true, label: true, dueAt: true },
      },
    },
    take: 100,
    orderBy: { updatedAt: 'desc' },
  })

  const now = Date.now()
  const risks = placements
    .map(p => {
      const risk = {
        noHours:
          !!p.plannedHours &&
          (!p.lastHoursLoggedAt ||
            now - new Date(p.lastHoursLoggedAt).getTime() > 7 * 86_400_000),
        overdueDeadline: p.deadlines.length > 0,
        noTutor: !p.academicTutorId || !p.companyTutorUserId,
      }
      return { p, risk }
    })
    .filter(({ risk }) => {
      if (input.riskType === 'no_hours') return risk.noHours
      if (input.riskType === 'overdue_deadline') return risk.overdueDeadline
      if (input.riskType === 'no_tutor') return risk.noTutor
      return risk.noHours || risk.overdueDeadline || risk.noTutor
    })
    .slice(0, limit)
    .map(({ p, risk }) => ({
      id: p.id,
      student: `${p.student?.firstName ?? ''} ${p.student?.lastName ?? ''}`.trim() || 'Unknown',
      company: p.companyName,
      stage: p.currentStage?.name ?? null,
      risks: Object.entries(risk)
        .filter(([, v]) => v)
        .map(([k]) => k),
      daysSinceHours: p.lastHoursLoggedAt
        ? Math.round((now - new Date(p.lastHoursLoggedAt).getTime()) / 86_400_000)
        : null,
      overdueDeadlines: p.deadlines.length,
      detailUrl: `/dashboard/university/placement-pipeline/${p.id}`,
    }))

  return { count: risks.length, placements: risks }
}

async function executeStudentsWithoutPlacement(
  institutionId: string,
  input: { program?: string; limit?: number },
) {
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 50)

  const affiliations = await prisma.institutionAffiliation.findMany({
    where: {
      institutionId,
      status: 'ACTIVE',
      ...(input.program
        ? { program: { contains: input.program, mode: 'insensitive' } }
        : {}),
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          graduationYear: true,
        },
      },
    },
    take: 200,
  })

  // Filter to those without an active placement at THIS institution
  const studentIds = affiliations.map(a => a.studentId)
  const placementsByStudent = await prisma.placement.findMany({
    where: {
      institutionId,
      studentId: { in: studentIds },
      outcome: null, // no final outcome = still in progress OR never started
    },
    select: { studentId: true },
  })
  const studentsWithPlacement = new Set(placementsByStudent.map(p => p.studentId))

  const withoutPlacement = affiliations
    .filter(a => !studentsWithPlacement.has(a.studentId))
    .slice(0, limit)
    .map(a => ({
      id: a.studentId,
      name: `${a.student.firstName ?? ''} ${a.student.lastName ?? ''}`.trim() || 'Unknown',
      email: a.student.email,
      program: a.program,
      graduationYear: a.student.graduationYear,
    }))

  return { count: withoutPlacement.length, students: withoutPlacement }
}

async function executePlacementStats(
  institutionId: string,
  input: { since?: string },
) {
  const sinceDate = input.since ? new Date(input.since) : undefined
  const where: any = { institutionId }
  if (sinceDate && !isNaN(sinceDate.getTime())) {
    where.startDate = { gte: sinceDate }
  }

  const [total, byStage, byOfferType, byOutcome] = await Promise.all([
    prisma.placement.count({ where }),
    prisma.placement.groupBy({
      by: ['currentStageId'],
      where,
      _count: { _all: true },
    }),
    prisma.placement.groupBy({
      by: ['offerType'],
      where,
      _count: { _all: true },
    }),
    prisma.placement.groupBy({
      by: ['outcome'],
      where: { ...where, outcome: { not: null } },
      _count: { _all: true },
    }),
  ])

  const stageNames = await prisma.placementStage.findMany({
    where: {
      institutionId,
      id: {
        in: byStage.map(s => s.currentStageId).filter((x): x is string => !!x),
      },
    },
    select: { id: true, name: true },
  })
  const stageNameById = new Map(stageNames.map(s => [s.id, s.name]))

  return {
    total,
    byStage: byStage.map(s => ({
      stage: s.currentStageId ? stageNameById.get(s.currentStageId) ?? 'Unknown' : 'No stage',
      count: s._count._all,
    })),
    byOfferType: byOfferType.map(o => ({ offerType: o.offerType, count: o._count._all })),
    byOutcome: byOutcome.map(o => ({ outcome: o.outcome, count: o._count._all })),
  }
}

async function executeStaleCompanyLeads(
  institutionId: string,
  input: { daysSinceContact?: number; limit?: number },
) {
  const days = input.daysSinceContact ?? 30
  const limit = Math.min(Math.max(input.limit ?? 15, 1), 50)
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const leads = await prisma.companyLead.findMany({
    where: {
      institutionId,
      updatedAt: { lt: cutoff },
    },
    include: {
      currentStage: { select: { name: true } },
    },
    orderBy: { updatedAt: 'asc' },
    take: limit,
  })

  return {
    count: leads.length,
    companies: leads.map(l => ({
      id: l.id,
      name: l.externalName || 'Senza nome',
      sector: l.sector,
      stage: l.currentStage?.name ?? null,
      lastActivityAt: l.updatedAt,
      daysSinceContact: Math.floor(
        (Date.now() - new Date(l.updatedAt).getTime()) / 86_400_000
      ),
      detailUrl: `/dashboard/university/crm/${l.id}`,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the InTransparency staff assistant for an institutional career office (university or ITS).

## Role

Help the staff member quickly find what needs attention in their placement pipeline, company CRM, and student roster — all via natural language conversation.

## Tools

You have read-only query tools. You cannot edit records; you surface what's there. When the staff asks about:
- At-risk placements → list_at_risk_placements
- Students without placements → list_students_without_placement
- Aggregate stats → summarize_placement_stats
- Stale company outreach → list_stale_company_leads

Always provide clickable detail URLs from tool results so staff can act on findings.

## Rules

- Be concise. Staff are busy. Lead with the count and the top items.
- Never invent data. If a query returns nothing, say so and suggest an alternative filter.
- Use Italian by default (the staff operates in Italian). Switch to English if the user asks or writes in English.
- Every response should end with a concrete action the staff can take ("Apri il placement X per loggare le ore", "Contatta l'azienda Y").
- Respect privacy: if asked to list students, return names but don't surface emails or other PII unless the staff explicitly asks.

## AI Act compliance

Every query is audit-logged with your institution id and the staff member id. If a student later requests a review of how they were categorized, the log is reproducible. Don't attempt to bypass this.`

// ─────────────────────────────────────────────────────────────────────────

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CardPayload {
  type: string
  data: any
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scope = await getUserScope(session.user.id)
    if (!scope || scope.staffInstitutionIds.length === 0) {
      return NextResponse.json(
        { error: 'Only institution staff can use this assistant' },
        { status: 403 }
      )
    }

    // Use the first staff institution (typical staff work at one institution)
    const institutionId = scope.staffInstitutionIds[0]

    // PREMIUM-gate
    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(institutionId, 'assistant.query')
      if (gate) return gate
    }

    const body = await req.json().catch(() => ({}))
    const clientMessages: ClientMessage[] = Array.isArray(body.messages)
      ? body.messages
      : []
    if (clientMessages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const messages: Anthropic.MessageParam[] = clientMessages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const cards: CardPayload[] = []
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
          : 'Richiesta non completata.'
        break
      }

      if (iter === MAX_TOOL_ITERATIONS) {
        finalText =
          'Ho raggiunto il limite di query per turno. Fammi una domanda di follow-up per approfondire.'
        break
      }

      messages.push({ role: 'assistant', content: response.content })

      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue

        let result: any
        let isError = false

        try {
          switch (block.name) {
            case 'list_at_risk_placements':
              result = await executeAtRisk(institutionId, block.input as any)
              if (result.placements?.length)
                cards.push({ type: 'at-risk-placements', data: result.placements })
              break
            case 'list_students_without_placement':
              result = await executeStudentsWithoutPlacement(institutionId, block.input as any)
              if (result.students?.length)
                cards.push({ type: 'students', data: result.students })
              break
            case 'summarize_placement_stats':
              result = await executePlacementStats(institutionId, block.input as any)
              cards.push({ type: 'stats', data: result })
              break
            case 'list_stale_company_leads':
              result = await executeStaleCompanyLeads(institutionId, block.input as any)
              if (result.companies?.length)
                cards.push({ type: 'stale-leads', data: result.companies })
              break
            default:
              result = { error: `Unknown tool: ${block.name}` }
              isError = true
          }

          await audit({
            actorId: session.user.id,
            actorRole: 'INSTITUTION_STAFF',
            action: `assistant.${block.name}`,
            entityType: 'AssistantQuery',
            entityId: block.id,
            payload: { input: block.input },
            institutionId,
          })
        } catch (err: any) {
          console.error('Tool error:', err)
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

    return NextResponse.json({ reply: finalText, cards })
  } catch (error: any) {
    console.error('Staff assistant error:', error)
    return NextResponse.json(
      { error: error?.message || 'Assistant error' },
      { status: 500 }
    )
  }
}
