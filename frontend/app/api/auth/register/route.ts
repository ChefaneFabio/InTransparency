import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authLimiter, getClientIp } from "@/lib/rate-limit"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  role: z.enum(["STUDENT", "RECRUITER", "UNIVERSITY", "TECHPARK", "PROFESSOR"]).optional(),
})

// Roles that anyone can self-assign through THIS generic endpoint.
// UNIVERSITY is intentionally excluded — it requires the dedicated
// /api/auth/register/academic-partner flow which also creates the Institution
// row + admin staff link. Allowing UNIVERSITY here would leave an orphan
// admin user with no institution to administer. TECHPARK and PROFESSOR
// remain admin-approved.
const SELF_ASSIGNABLE_ROLES = ["STUDENT", "RECRUITER"] as const

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

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        passwordHash,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        username,
        role,
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
