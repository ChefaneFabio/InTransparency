import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// GET /api/university/verify?token=xxx - Verify university domain
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token required' },
        { status: 400 }
      )
    }

    // Find university by verification token
    const university = await prisma.university.findUnique({
      where: { verificationToken: token }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 404 }
      )
    }

    if (university.domainVerified) {
      return NextResponse.json({
        success: true,
        message: 'Domain already verified',
        university: {
          id: university.id,
          name: university.name,
          status: university.status
        }
      })
    }

    // Generate API key for the university
    const apiKey = `uk_${crypto.randomBytes(24).toString('hex')}`

    // Update university as verified
    const updatedUniversity = await prisma.university.update({
      where: { id: university.id },
      data: {
        domainVerified: true,
        domainVerifiedAt: new Date(),
        status: 'APPROVED',
        approvedAt: new Date(),
        apiKey,
        apiKeyCreatedAt: new Date(),
        verificationToken: null // Clear token after use
      }
    })

    console.log(`University verified: ${university.name}`)

    // Redirect to dashboard or return success
    return NextResponse.json({
      success: true,
      message: 'Domain verified successfully! You can now import students.',
      university: {
        id: updatedUniversity.id,
        name: updatedUniversity.name,
        status: updatedUniversity.status,
        apiKey // Return API key once, university should store it securely
      },
      nextStep: '/dashboard/university'
    })

  } catch (error) {
    console.error('Error verifying university:', error)
    return NextResponse.json(
      { error: 'Failed to verify university' },
      { status: 500 }
    )
  }
}

// POST /api/university/verify - Resend verification email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain } = body

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain required' },
        { status: 400 }
      )
    }

    const university = await prisma.university.findUnique({
      where: { domain }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    if (university.domainVerified) {
      return NextResponse.json(
        { error: 'University already verified' },
        { status: 400 }
      )
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    await prisma.university.update({
      where: { id: university.id },
      data: { verificationToken }
    })

    // TODO: Send verification email
    // await sendVerificationEmail(university.contactEmail, verificationToken, university.name)

    console.log(`Resent verification for: ${university.name}`)
    console.log(`New verification link: /api/university/verify?token=${verificationToken}`)

    return NextResponse.json({
      success: true,
      message: 'Verification email resent'
    })

  } catch (error) {
    console.error('Error resending verification:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification' },
      { status: 500 }
    )
  }
}
