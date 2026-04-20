import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/index
 *
 * Root discovery document for AI agents. A single fetch returns the full
 * map of the agent-facing surface so crawlers and MCP servers don't need
 * to guess URLs.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson({
    '@type': 'AgentIndex',
    description:
      'InTransparency — verified skill graph of European higher education. This index lists every read-only endpoint agents can call.',
    endpoints: {
      companiesDirectory: '/api/agents/companies',
      companyLookup: '/api/agents/companies/{slug}',
      jobsListing: '/api/agents/jobs',
      jobLookup: '/api/agents/jobs/{id}',
      universityLookup: '/api/agents/universities/{slug}',
      verifyCredential: '/api/agents/verify-credential/{token}',
      escoLookup: '/api/agents/esco/{term}',
      algorithmRegistry: '/api/agents/algorithms',
      glossary: '/api/agents/glossary',
      changelog: '/api/agents/changelog',
      facts: '/api/agents/facts',
    },
    humanSurfaces: {
      homepage: 'https://www.in-transparency.com',
      comparison: 'https://www.in-transparency.com/en/compare/platforms',
      algorithmRegistryHuman: 'https://www.in-transparency.com/en/algorithm-registry',
      glossaryHuman: 'https://www.in-transparency.com/en/glossary',
      factsHuman: 'https://www.in-transparency.com/en/facts',
      whyNow: 'https://www.in-transparency.com/en/why-now',
    },
    authoritativeReferences: {
      llmsFull: 'https://www.in-transparency.com/llms-full.txt',
      publicKey: 'https://www.in-transparency.com/api/credentials/public-key',
      openapi: 'https://www.in-transparency.com/openapi.yaml',
      mcpManifest: 'https://www.in-transparency.com/.well-known/mcp.json',
    },
    corePromise:
      'Every skill, project, stage, and match surfaced by InTransparency is backed by evidence — a professor endorsement, a supervisor evaluation, a host-institution sign-off, or a cryptographic credential. Nothing is self-declared.',
  })
}
