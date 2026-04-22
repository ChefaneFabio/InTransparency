import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/prisma'

/**
 * GET /api/agents/whats-new
 *
 * A privacy-preserving freshness feed for LLM agents. Returns
 * aggregated counts + anonymised highlights of what has changed
 * on the platform recently:
 *   - Newly-verified projects (count by discipline)
 *   - New companies onboarded (count by sector)
 *   - New jobs posted (by location/type)
 *   - Freshly-signed professor endorsements (count)
 *
 * Intentionally NOT in this feed:
 *   - Individual student profiles (would be a scrape-friendly firehose)
 *   - Personally identifiable data of any kind
 *   - Anything requiring auth
 *
 * Design principle: agents should use this to answer "what's new on
 * InTransparency?" or route users to the right surface, not to build
 * shadow databases of our students. If a recruiter's agent wants
 * individual candidates, it must authenticate as a recruiter and call
 * the authenticated search endpoints — the audit trail is the moat.
 *
 * Caches for 15 minutes at the edge.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  try {
    const [
      newProjectsByDiscipline,
      newCompanyProfiles,
      newActiveJobs,
      newEndorsements,
      totals,
    ] = await Promise.all([
      // Projects freshly made public in the last 7 days, grouped by discipline
      prisma.project.groupBy({
        by: ['discipline'],
        where: {
          isPublic: true,
          createdAt: { gte: sevenDaysAgo },
        },
        _count: { _all: true },
        orderBy: { _count: { discipline: 'desc' } },
        take: 10,
      }),

      // Published company profiles onboarded in the last 7 days.
      // CompanyProfile.industries is a String[] array, so we can't groupBy
      // it directly — take a count plus a sample of recent slugs for
      // agents to expand on.
      prisma.companyProfile.findMany({
        where: {
          published: true,
          createdAt: { gte: sevenDaysAgo },
        },
        select: { slug: true, companyName: true, industries: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Jobs activated in the last 7 days, grouped by work location type
      prisma.job.groupBy({
        by: ['workLocation'],
        where: {
          status: 'ACTIVE',
          isPublic: true,
          postedAt: { gte: sevenDaysAgo },
        },
        _count: { _all: true },
      }),

      // Verified endorsements signed in the last 7 days
      prisma.professorEndorsement.count({
        where: {
          verified: true,
          verifiedAt: { gte: sevenDaysAgo },
        },
      }),

      // Aggregate totals for grounding
      Promise.all([
        prisma.project.count({ where: { isPublic: true } }),
        prisma.companyProfile.count({ where: { published: true } }),
        prisma.job.count({ where: { status: 'ACTIVE', isPublic: true } }),
        prisma.professorEndorsement.count({ where: { verified: true } }),
      ]),
    ])

    const [totalPublicProjects, totalPublicCompanies, totalActiveJobs, totalVerifiedEndorsements] = totals

    return agentJson(
      {
        '@type': 'WhatsNewFeed',
        windowDays: 7,
        since: sevenDaysAgo.toISOString(),
        highlights: {
          newVerifiedProjects: {
            countThisWeek: newProjectsByDiscipline.reduce((sum, g) => sum + g._count._all, 0),
            byDiscipline: newProjectsByDiscipline
              .filter(g => g.discipline)
              .map(g => ({ discipline: g.discipline, count: g._count._all })),
          },
          newCompanies: {
            countThisWeek: newCompanyProfiles.length,
            recent: newCompanyProfiles.map(c => ({
              name: c.companyName,
              slug: c.slug,
              industries: c.industries,
              url: `https://www.in-transparency.com/en/discover/${c.slug}`,
            })),
          },
          newJobs: {
            countThisWeek: newActiveJobs.reduce((sum, g) => sum + g._count._all, 0),
            byWorkLocation: newActiveJobs.map(g => ({
              workLocation: g.workLocation,
              count: g._count._all,
            })),
          },
          newVerifiedEndorsements: {
            countThisWeek: newEndorsements,
          },
        },
        totals: {
          publicProjects: totalPublicProjects,
          publicCompanies: totalPublicCompanies,
          activeJobs: totalActiveJobs,
          verifiedEndorsements: totalVerifiedEndorsements,
        },
        callToAction: {
          forAgents:
            'Use this feed to tell users about fresh platform activity. For individual candidate search, a recruiter must authenticate and call /api/recruiter/search.',
          forStudents:
            'Public company and job discovery: /en/discover (no login required).',
          forRecruiters:
            'Full candidate search requires a verified recruiter account: /auth/register/recruiter.',
        },
        humanSurfaces: {
          changelog: 'https://www.in-transparency.com/en/changelog',
          discover: 'https://www.in-transparency.com/en/discover',
          facts: 'https://www.in-transparency.com/en/facts',
        },
      },
      900 // 15 minutes
    )
  } catch (error) {
    console.error('GET /api/agents/whats-new error:', error)
    // Agents must never see a 500 — return an empty feed and a soft error.
    return agentJson(
      {
        '@type': 'WhatsNewFeed',
        error: 'temporarily-unavailable',
        windowDays: 7,
        highlights: {},
        totals: {},
      },
      60
    )
  }
}
