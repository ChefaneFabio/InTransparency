import { NextResponse } from 'next/server'

// Types for referral tracking
export interface Referral {
  id: string
  referrerId: string // Student who made the referral
  referredEmail: string
  referredName?: string

  // Referral details
  createdAt: string
  status: 'pending' | 'signed-up' | 'profile-completed' | 'first-application'
  completedStages: string[]

  // Institution tracking
  institutionId: string
  referrerName: string
}

// Mock database
const mockReferrals: Referral[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.referrerId || !body.referredEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: referrerId and referredEmail' },
        { status: 400 }
      )
    }

    // Validate email
    if (!body.referredEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check for duplicate referral
    const existingReferral = mockReferrals.find(
      r => r.referrerId === body.referrerId && r.referredEmail === body.referredEmail
    )

    if (existingReferral) {
      return NextResponse.json(
        { error: 'You have already referred this email address' },
        { status: 400 }
      )
    }

    // Create referral
    const referral: Referral = {
      id: `ref_${Date.now()}`,
      referrerId: body.referrerId,
      referredEmail: body.referredEmail,
      referredName: body.referredName || '',

      createdAt: new Date().toISOString(),
      status: 'pending',
      completedStages: [],

      institutionId: body.institutionId || '',
      referrerName: body.referrerName || ''
    }

    mockReferrals.push(referral)

    // In production: Send referral email to referred person
    // await sendReferralEmail(referral.referredEmail, referral.referrerId)

    return NextResponse.json({
      success: true,
      referralId: referral.id,
      message: `Referral sent to ${referral.referredEmail}! You'll earn points when they sign up.`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating referral:', error)
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const referrerId = searchParams.get('referrerId')
    const institutionId = searchParams.get('institutionId')

    if (!referrerId && !institutionId) {
      return NextResponse.json(
        { error: 'Either referrerId or institutionId is required' },
        { status: 400 }
      )
    }

    let filteredReferrals = [...mockReferrals]

    // Filter by referrer
    if (referrerId) {
      filteredReferrals = filteredReferrals.filter(r => r.referrerId === referrerId)
    }

    // Filter by institution (for career center view)
    if (institutionId) {
      filteredReferrals = filteredReferrals.filter(r => r.institutionId === institutionId)
    }

    // Sort by most recent
    filteredReferrals.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Calculate statistics
    const stats = {
      total: filteredReferrals.length,
      pending: filteredReferrals.filter(r => r.status === 'pending').length,
      signedUp: filteredReferrals.filter(r => r.status === 'signed-up').length,
      profileCompleted: filteredReferrals.filter(r => r.status === 'profile-completed').length,
      firstApplication: filteredReferrals.filter(r => r.status === 'first-application').length
    }

    return NextResponse.json({
      success: true,
      referrals: filteredReferrals,
      stats
    })

  } catch (error) {
    console.error('Error fetching referrals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    if (!body.referralId || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: referralId and status' },
        { status: 400 }
      )
    }

    const referralIndex = mockReferrals.findIndex(r => r.id === body.referralId)

    if (referralIndex === -1) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      )
    }

    const referral = mockReferrals[referralIndex]

    // Update status
    referral.status = body.status

    // Add completed stage
    if (!referral.completedStages.includes(body.status)) {
      referral.completedStages.push(body.status)
    }

    mockReferrals[referralIndex] = referral

    return NextResponse.json({
      success: true,
      referral,
      message: 'Referral status updated successfully'
    })

  } catch (error) {
    console.error('Error updating referral:', error)
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    )
  }
}
