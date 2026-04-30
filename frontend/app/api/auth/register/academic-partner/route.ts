import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/auth/register/academic-partner
 *
 * Self-service registration for an academic partner (university, ITS, school).
 * Creates three rows atomically:
 *   1. User (role = UNIVERSITY, subscriptionTier defaults to FREE)
 *   2. Institution (plan defaults to CORE — full Free Core workspace)
 *   3. InstitutionStaff (role = INSTITUTION_ADMIN, links the user to the org)
 *
 * Slug is derived from institutionName; on collision a short random suffix is
 * appended. Rate-limited via the shared authLimiter.
 *
 * Note: prior policy required admin approval for UNIVERSITY signups. The
 * freemium-everywhere strategy (2026-04-26) relaxes that — institutions can
 * self-onboard onto Free Core with no human in the loop. Email verification
 * still applies as a soft check (emailVerified = false until confirmation).
 */

const registerSchema = z.object({
  // Admin user fields
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),

  // Institution fields
  institutionName: z.string().min(2, 'Institution name is required').max(200),
  institutionType: z.enum(['UNIVERSITY_PUBLIC', 'UNIVERSITY_PRIVATE', 'ITS', 'SCHOOL']),
  country: z.string().min(2).max(2).default('IT'),
})

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')         // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')             // alphanumeric only
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'institution'
}

async function uniqueSlug(base: string): Promise<string> {
  // First try the bare slug; on collision append a 6-char random suffix.
  // We don't loop forever — one retry is enough for ~10^9 slug-space.
  const existing = await prisma.institution.findUnique({ where: { slug: base }, select: { id: true } })
  if (!existing) return base
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base}-${suffix}`
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { success, resetIn } = authLimiter.check(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
      )
    }

    const body = await req.json()
    const data = registerSchema.parse(body)
    const email = data.email.toLowerCase()

    // Generic error for email collisions — prevents enumeration.
    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Unable to create account. Please try a different email or sign in.',
          code: 'EMAIL_EXISTS',
        },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)
    const username = email.split('@')[0] + '-' + Math.random().toString(36).substring(7)
    const slug = await uniqueSlug(slugify(data.institutionName))

    // Atomic create: user + institution + staff link. If any step fails the
    // entire transaction rolls back so we never leave half-orphan rows.
    const result = await prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          username,
          role: 'UNIVERSITY',
          emailVerified: false,
          profilePublic: false,
        },
      })

      const institution = await tx.institution.create({
        data: {
          name: data.institutionName.trim(),
          slug,
          type: data.institutionType,
          country: data.country,
          primaryAdminId: user.id,
          // plan defaults to CORE (Free Core), subscriptionStatus to INACTIVE.
        },
      })

      await tx.institutionStaff.create({
        data: {
          userId: user.id,
          institutionId: institution.id,
          role: 'INSTITUTION_ADMIN',
        },
      })

      return { user, institution }
    })

    // Issue verification token + send the verification email (best-effort).
    try {
      const { issueVerificationToken } = await import('@/lib/email-verification')
      const { sendAccountVerificationEmail } = await import('@/lib/email')
      const rawToken = await issueVerificationToken(result.user.email)
      const requestedLocale = (data as any).locale === 'it' ? 'it' : 'en'
      await sendAccountVerificationEmail(
        result.user.email,
        rawToken,
        result.user.firstName ?? '',
        requestedLocale
      )
    } catch (verificationErr) {
      console.error('[register/academic-partner] email verification dispatch failed:', verificationErr)
    }

    return NextResponse.json(
      {
        message: 'Academic partner registered successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
        },
        institution: {
          id: result.institution.id,
          slug: result.institution.slug,
          name: result.institution.name,
          plan: result.institution.plan,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Academic partner registration error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
