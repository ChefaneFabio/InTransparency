import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { translateSkills } from '@/lib/skill-translation'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { skills, locale } = body

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'skills must be a non-empty array of strings' },
        { status: 400 }
      )
    }

    if (skills.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 skills per request' },
        { status: 400 }
      )
    }

    const translated = await translateSkills(skills, locale || 'en')

    return NextResponse.json({ translated })
  } catch (error) {
    console.error('Skills translate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
