import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { agentJson } from '../_lib/response'
import { directoryLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/jobs
 *
 * Active job listings. Supports skill + location + company filters.
 * Returns skills in their original terms plus ESCO URIs where mapped.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(directoryLimiter, req)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const skill = searchParams.get('skill')?.trim()
  const location = searchParams.get('location')?.trim()
  const company = searchParams.get('company')?.trim()
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))

  const where: any = { status: 'ACTIVE' }
  if (skill) where.requiredSkills = { has: skill }
  if (location)
    where.location = { contains: location, mode: 'insensitive' }
  if (company)
    where.companyName = { contains: company, mode: 'insensitive' }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      companyName: true,
      location: true,
      workLocation: true,
      jobType: true,
      requiredSkills: true,
      preferredSkills: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return agentJson({
    '@type': 'JobListing',
    query: { skill: skill ?? null, location: location ?? null, company: company ?? null, limit },
    count: jobs.length,
    jobs: jobs.map(j => ({
      id: j.id,
      title: j.title,
      companyName: j.companyName,
      location: j.location,
      workLocation: j.workLocation,
      jobType: j.jobType,
      requiredSkills: j.requiredSkills,
      preferredSkills: j.preferredSkills,
      postedAt: j.createdAt.toISOString(),
      updatedAt: j.updatedAt.toISOString(),
      url: `https://www.in-transparency.com/en/explore/jobs/${j.id}`,
      detailEndpoint: `/api/agents/jobs/${j.id}`,
    })),
  })
}
