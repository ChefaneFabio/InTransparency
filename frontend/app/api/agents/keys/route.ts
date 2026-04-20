import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { generateAgentKey, type AgentScope } from '@/lib/agent-auth'

/**
 * POST /api/agents/keys
 *   Create a new agent API key for the current user. Returns the plaintext
 *   key exactly once. Scopes must be an array of agent:* scopes.
 *
 * GET /api/agents/keys
 *   List this user's keys (prefix only — never returns the full key).
 *
 * DELETE /api/agents/keys?id=xxx
 *   Revoke a specific key.
 */

const ALLOWED_SCOPES: AgentScope[] = ['agent:read', 'agent:watchlist', 'agent:webhook', 'agent:write']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Agent key'
  const requestedScopes = Array.isArray(body.scopes) ? (body.scopes as string[]) : ['agent:read']
  const scopes = requestedScopes.filter(s => (ALLOWED_SCOPES as string[]).includes(s))
  if (scopes.length === 0) scopes.push('agent:read')

  const { key, hash, prefix } = generateAgentKey()

  const record = await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      keyHash: hash,
      keyPrefix: prefix,
      scopes,
    },
    select: { id: true, name: true, keyPrefix: true, scopes: true, createdAt: true },
  })

  return NextResponse.json({
    ...record,
    key, // one-time display
    message: 'Store this key safely — it will never be shown again.',
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id, revokedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      lastUsedAt: true,
      createdAt: true,
      expiresAt: true,
    },
  })
  return NextResponse.json({ keys })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const existing = await prisma.apiKey.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } })
  return NextResponse.json({ revoked: true })
}
