import { NextRequest } from 'next/server'
import { resolveEscoUri } from '@/lib/esco'
import { agentJson, agentError } from '../../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ term: string }>
}

/**
 * GET /api/agents/esco/[term]
 *
 * Resolve a skill term to its ESCO URI. Example: /api/agents/esco/python
 * Useful when an agent wants to normalize a user's skill vocabulary to the
 * EU-standard taxonomy before matching.
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  const { term } = await ctx.params
  const decoded = decodeURIComponent(term)
  const resolved = await resolveEscoUri(decoded)
  if (!resolved) return agentError(`No ESCO mapping found for "${decoded}"`, 404)

  return agentJson(
    {
      '@type': 'EscoMapping',
      query: decoded,
      escoUri: resolved.uri,
      preferredLabel: resolved.preferred,
      source: resolved.source,
      taxonomyVersion: '1.2.0',
      taxonomyOrigin: 'European Commission ESCO',
    },
    3600
  )
}
