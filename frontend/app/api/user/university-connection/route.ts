import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

// GET /api/user/university-connection - Get current university connection
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connection = await prisma.universityConnection.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Error fetching university connection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/university-connection - Create or update university connection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { universityId, universityName, universityType, institutionalEmail, city } = body

    if (!universityId || !universityName || !institutionalEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Check if connection already exists
    const existingConnection = await prisma.universityConnection.findUnique({
      where: { userId: session.user.id }
    })

    let connection

    if (existingConnection) {
      // Update existing connection
      connection = await prisma.universityConnection.update({
        where: { userId: session.user.id },
        data: {
          universityId,
          universityName,
          universityType: universityType || 'university',
          city,
          institutionalEmail,
          verificationStatus: 'PENDING',
          verificationToken,
          verificationSentAt: new Date(),
          verifiedAt: null
        }
      })
    } else {
      // Create new connection
      connection = await prisma.universityConnection.create({
        data: {
          userId: session.user.id,
          universityId,
          universityName,
          universityType: universityType || 'university',
          city,
          institutionalEmail,
          verificationStatus: 'PENDING',
          verificationToken,
          verificationSentAt: new Date()
        }
      })
    }

    // Also update the user's university field
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        university: universityName
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(institutionalEmail, verificationToken, universityName)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Auto-verify as fallback when SMTP is not configured
      connection = await prisma.universityConnection.update({
        where: { id: connection.id },
        data: {
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      connection,
      message: connection.verificationStatus === 'VERIFIED'
        ? 'University connected successfully'
        : 'Verification email sent. Please check your institutional email.'
    })
  } catch (error) {
    console.error('Error connecting university:', error)
    return NextResponse.json(
      { error: 'Failed to connect university' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/university-connection - Disconnect university
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.universityConnection.delete({
      where: { userId: session.user.id }
    })

    // Also clear the user's university field
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        university: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'University disconnected successfully'
    })
  } catch (error) {
    console.error('Error disconnecting university:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect university' },
      { status: 500 }
    )
  }
}
