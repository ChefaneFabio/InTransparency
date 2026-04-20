import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateAgent } from '@/lib/agent-auth'
import type { Prisma } from '@prisma/client'

/**
 * AgentWatchlists — saved queries an agent revisits.
 * Typical shape: { type: 'candidate-match', requiredSkills: [...], jobId: '...' }
 */

export async function POST(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:watchlist')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Untitled watchlist'
  const query = body.query
  if (!query || typeof query !== 'object') {
    return NextResponse.json({ error: 'query (object) required' }, { status: 400 })
  }
  const webhookSubscriptionId =
    typeof body.webhookSubscriptionId === 'string' ? body.webhookSubscriptionId : null
  if (webhookSubscriptionId) {
    const sub = await prisma.webhookSubscription.findUnique({ where: { id: webhookSubscriptionId } })
    if (!sub || sub.ownerId !== principal.userId) {
      return NextResponse.json({ error: 'webhookSubscriptionId does not belong to you' }, { status: 400 })
    }
  }

  const wl = await prisma.agentWatchlist.create({
    data: {
      ownerId: principal.userId,
      name,
      query: query as Prisma.InputJsonValue,
      webhookSubscriptionId,
    },
  })
  return NextResponse.json({ watchlist: wl })
}

export async function GET(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:watchlist')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lists = await prisma.agentWatchlist.findMany({
    where: { ownerId: principal.userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ watchlists: lists })
}

export async function DELETE(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:watchlist')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const wl = await prisma.agentWatchlist.findUnique({ where: { id } })
  if (!wl || wl.ownerId !== principal.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  await prisma.agentWatchlist.delete({ where: { id } })
  return NextResponse.json({ deleted: true })
}
