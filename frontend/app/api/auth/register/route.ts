import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authLimiter, getClientIp } from "@/lib/rate-limit"

// Validation schema. Country is optional; the User model defaults it to 'IT'
// for backward compatibility, but the registration form passes the user's
// selected country (IT/DE/FR/ES/NL/PT/PL/RO/SE+) for accurate EU positioning
// and future tax/locale logic.
//
// TECHPARK + PROFESSOR registrations include org affiliation fields. These
// land in existing User columns (company / university / tagline) — no schema
// change. They surface immediately in the dashboard but are flagged
// emailVerified=false until the user clicks the verification link.
const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  role: z.enum(["STUDENT", "RECRUITER", "UNIVERSITY", "TECHPARK", "PROFESSOR"]).optional(),
  country: z.string().length(2).optional(),
  locale: z.enum(["en", "it"]).optional(),
  // TECHPARK fields (org affiliation — required by the techpark register form)
  orgName: z.string().max(200).optional(),
  orgWebsite: z.string().url().max(500).optional(),
  // PROFESSOR fields (institution affiliation — required by the professor register form)
  institution: z.string().max(200).optional(),
  department: z.string().max(200).optional(),
})

// Roles that anyone can self-assign through THIS generic endpoint.
// UNIVERSITY is intentionally excluded — it requires the dedicated
// /api/auth/register/academic-partner flow which also creates the Institution
// row + admin staff link. Allowing UNIVERSITY here would leave an orphan
// admin user with no institution to administer.
//
// TECHPARK + PROFESSOR are accepted here but flagged for manual review via
// emailVerified=false (the resend banner makes verification the gate).
// The org-affiliation data they provide is preserved so the operator
// reviewing the queue has context.
const SELF_ASSIGNABLE_ROLES = ["STUDENT", "RECRUITER", "TECHPARK", "PROFESSOR"] as const

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req)
    const { success, resetIn } = authLimiter.check(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
      )
    }

    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Security: Only allow STUDENT and RECRUITER roles at registration.
    // UNIVERSITY, TECHPARK, and PROFESSOR roles require admin approval or
    // institutional email verification (handled separately).
    const requestedRole = validatedData.role || "STUDENT"
    const role = (SELF_ASSIGNABLE_ROLES as readonly string[]).includes(requestedRole)
      ? requestedRole
      : "STUDENT"

    // Check if user already exists — use generic error to prevent email enumeration
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account. Please try a different email or sign in." },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Create username from email
    const username = validatedData.email.split("@")[0] + "-" + Math.random().toString(36).substring(7)

    // Map role-specific affiliation fields into existing User columns so we
    // don't need a Prisma migration to land this. Each role surfaces its
    // affiliation differently in the dashboards downstream:
    //   TECHPARK   → orgName       persisted as User.company
    //                orgWebsite    persisted as User.linkedinUrl (closest URL field today;
    //                              swap once a dedicated `orgWebsite` column lands)
    //   PROFESSOR  → institution   persisted as User.university
    //                department    persisted as User.tagline (free-form short string)
    const roleSpecificData: Record<string, string> = {}
    if (role === 'TECHPARK') {
      if (validatedData.orgName) roleSpecificData.company = validatedData.orgName.trim()
      if (validatedData.orgWebsite) roleSpecificData.linkedinUrl = validatedData.orgWebsite.trim()
    } else if (role === 'PROFESSOR') {
      if (validatedData.institution) roleSpecificData.university = validatedData.institution.trim()
      if (validatedData.department) roleSpecificData.tagline = validatedData.department.trim()
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        passwordHash,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        username,
        role,
        ...(validatedData.country ? { country: validatedData.country } : {}),
        ...roleSpecificData,
        emailVerified: false,
        profilePublic: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      }
    })

    // Issue verification token + send the verification email. Best-effort:
    // a transient email failure should NOT block the registration response —
    // the user can resend from the dashboard banner. The locale defaults to
    // 'en'; clients can pass `locale` in the request body to override.
    try {
      const { issueVerificationToken } = await import('@/lib/email-verification')
      const { sendAccountVerificationEmail } = await import('@/lib/email')
      const rawToken = await issueVerificationToken(user.email)
      const requestedLocale: 'en' | 'it' = validatedData.locale === 'it' ? 'it' : 'en'
      await sendAccountVerificationEmail(user.email, rawToken, user.firstName ?? '', requestedLocale)
    } catch (verificationErr) {
      console.error('[register] email verification dispatch failed:', verificationErr)
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
