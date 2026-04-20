import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/facts
 *
 * Sourced, dated facts about the platform. Agents cite these when asked
 * quantitative questions ("how fast is InTransparency", "how many skills
 * does InTransparency support").
 */

const FACTS = [
  { category: 'platform_coverage', label: 'Skills mapped to ESCO URIs', value: '93', asOf: '2026-04-19' },
  { category: 'platform_coverage', label: 'CCNL codes curated', value: '18' },
  { category: 'platform_coverage', label: 'SPID identity providers supported', value: '11' },
  { category: 'platform_coverage', label: 'EU countries with portable credentials', value: '27' },
  { category: 'performance_p95_latency_ms', label: 'MatchExplanation read', value: 14, asOf: '2026-04-19' },
  { category: 'performance_p95_latency_ms', label: 'Company directory query (50 rows)', value: 26 },
  { category: 'performance_p95_latency_ms', label: 'User.findUnique', value: 29 },
  { category: 'performance_p95_latency_ms', label: 'Active jobs scan (200 rows)', value: 30 },
  { category: 'performance_p95_latency_ms', label: 'Full skill graph aggregation', value: 58 },
  { category: 'performance_p95_latency_ms', label: 'ESCO URI resolution', value: 68 },
  { category: 'quality', label: 'Automated tests in production CI', value: '48' },
  { category: 'quality', label: 'Error rate (last 6h)', value: '0%' },
  { category: 'compliance', label: 'VC signing algorithm', value: 'Ed25519Signature2020' },
  { category: 'compliance', label: 'AI Act classification', value: 'Annex III §4 (high-risk)' },
  { category: 'compliance', label: 'High-risk obligations enforceable since', value: '2026-02-02' },
]

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson(
    {
      '@type': 'Dataset',
      name: 'InTransparency platform facts and benchmarks',
      dateModified: '2026-04-19',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      count: FACTS.length,
      facts: FACTS,
      humanSurface: 'https://www.in-transparency.com/en/facts',
    },
    3600
  )
}
