/**
 * Agent authentication — API keys for agents acting on behalf of users.
 *
 * Reuses the existing ApiKey model with agent-specific scopes:
 *   - agent:read       — call any /api/agents/* read endpoint
 *   - agent:watchlist  — create and read AgentWatchlists
 *   - agent:webhook    — create and manage WebhookSubscriptions
 *   - agent:write      — reserved for future write operations
 *
 * Key format: "ita_<20 random bytes base64url>". Stored as SHA-256 hash.
 */

import prisma from './prisma'
import crypto from 'crypto'

export type AgentScope = 'agent:read' | 'agent:watchlist' | 'agent:webhook' | 'agent:write'

export interface AgentPrincipal {
  userId: string
  apiKeyId: string
  scopes: string[]
}

export function generateAgentKey(): { key: string; hash: string; prefix: string } {
  const raw = crypto.randomBytes(20).toString('base64url')
  const key = `ita_${raw}`
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  const prefix = key.slice(0, 12) + '...'
  return { key, hash, prefix }
}

/**
 * Authenticate a request bearing an agent API key (via Authorization header
 * or `X-InTransparency-Key` header). Returns the principal if valid + scope
 * is granted; returns null otherwise.
 */
export async function authenticateAgent(
  req: Request,
  requiredScope: AgentScope
): Promise<AgentPrincipal | null> {
  const header =
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    req.headers.get('x-intransparency-key')
  if (!header || !header.startsWith('ita_')) return null

  const hash = crypto.createHash('sha256').update(header).digest('hex')
  const key = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
    select: { id: true, userId: true, scopes: true, revokedAt: true, expiresAt: true },
  })
  if (!key) return null
  if (key.revokedAt) return null
  if (key.expiresAt && key.expiresAt < new Date()) return null
  if (!key.scopes.includes(requiredScope) && !key.scopes.includes('agent:write')) {
    return null
  }

  // Update lastUsedAt async — don't block
  prisma.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } }).catch(() => {})

  return {
    userId: key.userId,
    apiKeyId: key.id,
    scopes: key.scopes,
  }
}
