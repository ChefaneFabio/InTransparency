import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

/**
 * GET /api/companies/profile?slug=xyz
 * Public read of a company profile (only if published).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const profile = await prisma.companyProfile.findUnique({
    where: { slug },
    include: { _count: { select: { follows: true } } },
  })
  if (!profile || !profile.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ profile: { ...profile, followerCount: profile._count.follows } })
}

/**
 * PUT /api/companies/profile
 * Upsert the current recruiter's company profile.
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const companyName = (body.companyName ?? user.company ?? '').trim()
  if (!companyName) {
    return NextResponse.json({ error: 'companyName required' }, { status: 400 })
  }

  const slug = body.slug ? slugify(body.slug) : slugify(companyName)

  const profile = await prisma.companyProfile.upsert({
    where: { companyName },
    create: {
      companyName,
      slug,
      logoUrl: body.logoUrl ?? null,
      coverUrl: body.coverUrl ?? null,
      tagline: body.tagline ?? null,
      description: body.description ?? null,
      foundedYear: body.foundedYear ?? null,
      headquarters: body.headquarters ?? null,
      industries: body.industries ?? [],
      sizeCategory: body.sizeCategory ?? null,
      websiteUrl: body.websiteUrl ?? null,
      linkedinUrl: body.linkedinUrl ?? null,
      mission: body.mission ?? null,
      vision: body.vision ?? null,
      values: body.values ?? [],
      cultureTags: body.cultureTags ?? [],
      countries: body.countries ?? [],
      officeLocations: body.officeLocations ?? [],
      heroVideoUrl: body.heroVideoUrl ?? null,
      gallery: body.gallery ?? [],
      faqs: body.faqs ?? [],
      claimedBy: user.id,
      claimedAt: new Date(),
      published: body.published ?? false,
    },
    update: {
      slug,
      logoUrl: body.logoUrl ?? undefined,
      coverUrl: body.coverUrl ?? undefined,
      tagline: body.tagline ?? undefined,
      description: body.description ?? undefined,
      foundedYear: body.foundedYear ?? undefined,
      headquarters: body.headquarters ?? undefined,
      industries: body.industries ?? undefined,
      sizeCategory: body.sizeCategory ?? undefined,
      websiteUrl: body.websiteUrl ?? undefined,
      linkedinUrl: body.linkedinUrl ?? undefined,
      mission: body.mission ?? undefined,
      vision: body.vision ?? undefined,
      values: body.values ?? undefined,
      cultureTags: body.cultureTags ?? undefined,
      countries: body.countries ?? undefined,
      officeLocations: body.officeLocations ?? undefined,
      heroVideoUrl: body.heroVideoUrl ?? undefined,
      gallery: body.gallery ?? undefined,
      faqs: body.faqs ?? undefined,
      published: body.published ?? undefined,
    },
  })

  return NextResponse.json({ profile })
}
