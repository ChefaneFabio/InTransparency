import { NextResponse } from 'next/server'

/**
 * Shared helpers for /api/agents/* endpoints.
 *
 * Design principles for the agent surface:
 *   1. All endpoints are READ-ONLY and public (no user auth required).
 *      Agents consume verified public data.
 *   2. Every response includes a @context pointer to our llms-full.txt so
 *      agents can self-ground in the platform's vocabulary.
 *   3. Responses are cacheable at the edge — no user-specific data.
 *   4. CORS open for cross-origin agent tooling.
 */

const BASE = 'https://www.in-transparency.com'

export function agentJson(payload: object, cacheSeconds = 300) {
  return NextResponse.json(
    {
      '@context': `${BASE}/llms-full.txt`,
      '@publisher': 'InTransparency',
      '@generatedAt': new Date().toISOString(),
      ...payload,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    }
  )
}

export function agentError(message: string, status = 404) {
  return NextResponse.json(
    { '@publisher': 'InTransparency', error: message },
    {
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
