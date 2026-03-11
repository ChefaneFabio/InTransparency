import { NextRequest, NextResponse } from 'next/server'
import { normalizeGrade, getSupportedCountries } from '@/lib/grades/ects-normalization'

// POST /api/grades/normalize - Normalize a grade to ECTS scale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade, country } = body

    if (!grade || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: grade, country' },
        { status: 400 }
      )
    }

    const result = normalizeGrade(grade, country)

    if (!result) {
      const supported = getSupportedCountries()
      const countryCodes = supported.map((c) => c.code)

      return NextResponse.json(
        {
          error: 'Unable to normalize grade. Check that the grade format and country are valid.',
          supportedCountries: countryCodes,
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error normalizing grade:', error)
    return NextResponse.json(
      { error: 'Failed to normalize grade' },
      { status: 500 }
    )
  }
}
