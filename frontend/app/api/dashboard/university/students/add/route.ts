import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendWelcomeEmail } from '@/lib/email'

// POST /api/dashboard/university/students/add
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const body = await req.json()
    const { firstName, lastName, email, department, degree, enrollmentYear, expectedGraduation } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    // Generate temp password
    const tempPassword = crypto.randomBytes(8).toString('base64').slice(0, 12)
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    const student = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: 'STUDENT',
        firstName,
        lastName,
        university: universityName,
        degree: degree || department || null,
        graduationYear: expectedGraduation || null,
        emailVerified: false,
        profilePublic: false,
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(email, tempPassword, universityName)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        email: student.email,
        name: `${firstName} ${lastName}`,
      },
      message: 'Student added successfully',
    })
  } catch (error) {
    console.error('Error adding student:', error)
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 })
  }
}
