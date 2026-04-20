import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { authenticateAgent } from '@/lib/agent-auth'
import type { WebhookEventType } from '@/lib/webhooks'

const VALID_EVENTS: WebhookEventType[] = [
  'match.created',
  'credential.issued',
  'credential.revoked',
  'stage.completed',
  'exchange.completed',
]

/**
 * Agent-authenticated webhook management.
 *
 * POST   — create a subscription, returns the HMAC secret exactly once
 * GET    — list the caller's subscriptions (secrets redacted)
 * DELETE — deactivate a subscription
 */

export async function POST(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:webhook')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const url = String(body.url || '')
  const events = Array.isArray(body.events) ? (body.events as string[]) : []

  if (!/^https:\/\//.test(url)) {
    return NextResponse.json({ error: 'url must be https' }, { status: 400 })
  }
  const selected = events.filter(e => (VALID_EVENTS as string[]).includes(e))
  if (selected.length === 0) {
    return NextResponse.json(
      { error: 'events[] required; choose from ' + VALID_EVENTS.join(', ') },
      { status: 400 }
    )
  }

  const secret = crypto.randomBytes(32).toString('hex')
  const sub = await prisma.webhookSubscription.create({
    data: {
      ownerId: principal.userId,
      url,
      secret,
      events: selected,
    },
    select: {
      id: true,
      url: true,
      events: true,
      active: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    ...sub,
    secret,
    message:
      'Store the secret — we use HMAC-SHA256 to sign every delivery in X-InTransparency-Signature. The secret is never shown again.',
  })
}

export async function GET(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:webhook')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subs = await prisma.webhookSubscription.findMany({
    where: { ownerId: principal.userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      events: true,
      active: true,
      lastDeliveryAt: true,
      lastSuccessAt: true,
      lastFailureAt: true,
      consecutiveFailures: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ subscriptions: subs })
}

export async function DELETE(req: NextRequest) {
  const principal = await authenticateAgent(req, 'agent:webhook')
  if (!principal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const sub = await prisma.webhookSubscription.findUnique({ where: { id } })
  if (!sub || sub.ownerId !== principal.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  await prisma.webhookSubscription.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ deactivated: true })
}
