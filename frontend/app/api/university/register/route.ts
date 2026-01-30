import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/university/register - Register a new university
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, domain, contactEmail, contactName, type, city, region } = body

    if (!name || !domain || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: name, domain, contactEmail' },
        { status: 400 }
      )
    }

    // Validate email matches domain
    const emailDomain = contactEmail.split('@')[1]
    if (emailDomain !== domain) {
      return NextResponse.json(
        { error: 'Contact email must match university domain' },
        { status: 400 }
      )
    }

    // Check if university with this domain already exists
    const existing = await prisma.university.findUnique({
      where: { domain }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A university with this domain is already registered' },
        { status: 409 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create university
    const university = await prisma.university.create({
      data: {
        name,
        slug,
        domain,
        type: type || 'UNIVERSITY',
        contactEmail,
        contactName,
        city,
        region,
        country: 'IT',
        status: 'PENDING',
        verificationToken,
      }
    })

    // TODO: Send verification email
    // await sendVerificationEmail(contactEmail, verificationToken, name)

    console.log(`University registered: ${name} (${domain})`)
    console.log(`Verification link: /api/university/verify?token=${verificationToken}`)

    return NextResponse.json({
      success: true,
      message: 'University registered. Please check your email to verify your domain.',
      university: {
        id: university.id,
        name: university.name,
        domain: university.domain,
        status: university.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error registering university:', error)
    return NextResponse.json(
      { error: 'Failed to register university. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/university/register - Get registration status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const domain = searchParams.get('domain')

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter required' },
        { status: 400 }
      )
    }

    const university = await prisma.university.findUnique({
      where: { domain },
      select: {
        id: true,
        name: true,
        domain: true,
        status: true,
        domainVerified: true,
        createdAt: true
      }
    })

    if (!university) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      exists: true,
      university
    })

  } catch (error) {
    console.error('Error checking university:', error)
    return NextResponse.json(
      { error: 'Failed to check university status' },
      { status: 500 }
    )
  }
}
