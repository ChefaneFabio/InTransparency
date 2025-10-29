import { NextResponse } from 'next/server'

// Mock database - in production, import from alumni-story route
const mockVerificationTokens: Record<string, {
  storyId: string
  email: string
  verified: boolean
  verifiedAt?: string
}> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // In production: Verify token against database
    const tokenData = mockVerificationTokens[body.token]

    if (!tokenData) {
      // Mock verification for demo - always succeed
      mockVerificationTokens[body.token] = {
        storyId: `story_${Date.now()}`,
        email: 'verified@university.edu',
        verified: true,
        verifiedAt: new Date().toISOString()
      }

      return NextResponse.json({
        success: true,
        message: 'Alumni story verified successfully! Your story is now publicly visible.',
        verified: true
      })
    }

    if (tokenData.verified) {
      return NextResponse.json({
        success: false,
        error: 'This story has already been verified',
        verified: true
      }, { status: 400 })
    }

    // Mark as verified
    tokenData.verified = true
    tokenData.verifiedAt = new Date().toISOString()

    // In production: Update story in database to set verified=true and publiclyVisible=true

    return NextResponse.json({
      success: true,
      message: 'Alumni story verified successfully! Your story is now publicly visible.',
      verified: true,
      verifiedAt: tokenData.verifiedAt
    })

  } catch (error) {
    console.error('Error verifying alumni:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    const tokenData = mockVerificationTokens[token]

    if (!tokenData) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: 'Invalid or expired verification token'
      })
    }

    return NextResponse.json({
      success: true,
      valid: true,
      verified: tokenData.verified,
      verifiedAt: tokenData.verifiedAt,
      email: tokenData.email
    })

  } catch (error) {
    console.error('Error checking verification status:', error)
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    )
  }
}
