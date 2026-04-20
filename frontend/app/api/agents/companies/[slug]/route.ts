import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { agentJson, agentError } from '../../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/agents/companies/[slug]
 *
 * Single company profile — full agent-friendly payload including values,
 * mission, offices, FAQs. Only exposes published profiles.
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  const { slug } = await ctx.params
  const profile = await prisma.companyProfile.findUnique({
    where: { slug },
    select: {
      companyName: true,
      slug: true,
      logoUrl: true,
      tagline: true,
      description: true,
      foundedYear: true,
      headquarters: true,
      industries: true,
      sizeCategory: true,
      websiteUrl: true,
      linkedinUrl: true,
      mission: true,
      vision: true,
      values: true,
      cultureTags: true,
      countries: true,
      officeLocations: true,
      faqs: true,
      verified: true,
      published: true,
      followerCount: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!profile || !profile.published) return agentError('Company profile not found', 404)

  return agentJson({
    '@type': 'CompanyProfile',
    name: profile.companyName,
    slug: profile.slug,
    tagline: profile.tagline,
    description: profile.description,
    foundedYear: profile.foundedYear,
    headquarters: profile.headquarters,
    industries: profile.industries,
    cultureTags: profile.cultureTags,
    sizeCategory: profile.sizeCategory,
    websiteUrl: profile.websiteUrl,
    linkedinUrl: profile.linkedinUrl,
    mission: profile.mission,
    vision: profile.vision,
    values: profile.values,
    countries: profile.countries,
    offices: profile.officeLocations,
    faqs: profile.faqs,
    platformVerified: profile.verified,
    followerCount: profile.followerCount,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    url: `https://www.in-transparency.com/en/c/${profile.slug}`,
    logoUrl: profile.logoUrl,
  })
}
