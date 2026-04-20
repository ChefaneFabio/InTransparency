import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { agentJson, agentError } from '../../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/agents/jobs/[id]
 *
 * Single active job posting. Full description + skill lists.
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  const { id } = await ctx.params
  const job = await prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      companyLogo: true,
      location: true,
      workLocation: true,
      jobType: true,
      requiredSkills: true,
      preferredSkills: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  if (!job || job.status !== 'ACTIVE') return agentError('Job not found or inactive', 404)

  return agentJson({
    '@type': 'JobPosting',
    id: job.id,
    title: job.title,
    description: job.description,
    hiringOrganization: {
      name: job.companyName,
      logo: job.companyLogo,
    },
    location: job.location,
    workLocationType: job.workLocation,
    employmentType: job.jobType,
    requiredSkills: job.requiredSkills,
    preferredSkills: job.preferredSkills,
    postedAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    url: `https://www.in-transparency.com/en/explore/jobs/${job.id}`,
  })
}
