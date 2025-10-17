import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


// Rate limiting map (simple in-memory solution)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] ?? realIp ?? 'unknown'
  return ip
}

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = parseInt(process.env.RATE_LIMIT_PER_IP || '10')
  const windowMs = 60 * 60 * 1000 // 1 hour

  const record = rateLimitMap.get(ip)

  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

// Validation schemas
const validateStudentSurvey = (data: any) => {
  const required = ['university', 'degree', 'graduationYear', 'currentStatus']
  return required.every(field => data[field] && data[field].trim() !== '')
}

const validateCompanySurvey = (data: any) => {
  const required = ['companyName', 'industry', 'companySize', 'hiringVolume']
  return required.every(field => data[field] && data[field].trim() !== '')
}

const validateUniversitySurvey = (data: any) => {
  const required = ['universityName', 'studentCount', 'region']
  return required.every(field => data[field] && data[field].trim() !== '')
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)

    // Check rate limit
    if (clientIp !== 'unknown' && isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { surveyType, responses, metadata } = body

    // Validate survey type
    if (!['student', 'company', 'university'].includes(surveyType)) {
      return NextResponse.json(
        { error: 'Invalid survey type' },
        { status: 400 }
      )
    }

    // Validate required fields based on survey type
    let isValid = false
    switch (surveyType) {
      case 'student':
        isValid = validateStudentSurvey(responses)
        break
      case 'company':
        isValid = validateCompanySurvey(responses)
        break
      case 'university':
        isValid = validateUniversitySurvey(responses)
        break
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get additional metadata
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    // Store in general survey response table (always)
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        surveyType,
        responses,
        metadata: {
          ...metadata,
          ipAddress: clientIp,
          userAgent,
          referrer
        },
        ipAddress: clientIp,
        userAgent,
        referrer,
        completionTime: metadata?.completionTime || null
      }
    })

    // Additionally store in specific table for structured queries
    let structuredResponse = null

    try {
      switch (surveyType) {
        case 'student':
          structuredResponse = await prisma.studentSurvey.create({
            data: {
              university: responses.university,
              degree: responses.degree,
              graduationYear: responses.graduationYear,
              currentStatus: responses.currentStatus,
              proudestAchievement: responses.proudestAchievement || null,
              projectPreferences: responses.projectPreferences || null,
              gradeImportance: responses.gradeImportance || null,
              skillDemonstration: responses.skillDemonstration || null,
              profilePriorities: responses.profilePriorities || null,
              transparencyComfort: responses.transparencyComfort || null,
              professorEndorsements: responses.professorEndorsements || null,
              jobSearchChallenges: responses.jobSearchChallenges || null,
              idealEmployerConnection: responses.idealEmployerConnection || null,
              platformFeatures: responses.platformFeatures || null,
              transparencyMeaning: responses.transparencyMeaning || null,
              informationSharing: responses.informationSharing || null,
              privacyPreferences: responses.privacyPreferences || null,
              additionalFeatures: responses.additionalFeatures || null,
              betaParticipation: responses.betaParticipation || false,
              emailAddress: responses.emailAddress || null,
              ipAddress: clientIp,
              userAgent,
              referrer,
              completionTime: metadata?.completionTime || null
            }
          })
          break

        case 'company':
          structuredResponse = await prisma.companySurvey.create({
            data: {
              companyName: responses.companyName,
              industry: responses.industry,
              companySize: responses.companySize,
              hiringVolume: responses.hiringVolume,
              currentMethods: responses.currentMethods || null,
              biggestChallenges: responses.biggestChallenges || null,
              timeToHire: responses.timeToHire || null,
              importantFactors: responses.importantFactors || null,
              projectsImportance: responses.projectsImportance || null,
              technicalEvaluation: responses.technicalEvaluation || null,
              softSkills: responses.softSkills || null,
              dealBreakers: responses.dealBreakers || null,
              valuableFeatures: responses.valuableFeatures || null,
              missingCredentials: responses.missingCredentials || null,
              transparencyLevel: responses.transparencyLevel || null,
              currentTools: responses.currentTools || null,
              monthlyBudget: responses.monthlyBudget || null,
              decisionMakers: responses.decisionMakers || null,
              additionalFeatures: responses.additionalFeatures || null,
              pilotParticipation: responses.pilotParticipation || false,
              contactEmail: responses.contactEmail || null,
              ipAddress: clientIp,
              userAgent,
              referrer,
              completionTime: metadata?.completionTime || null
            }
          })
          break

        case 'university':
          structuredResponse = await prisma.universitySurvey.create({
            data: {
              universityName: responses.universityName,
              studentCount: responses.studentCount,
              primaryPrograms: responses.primaryPrograms || null,
              region: responses.region,
              placementRate: responses.placementRate || null,
              biggestChallenges: responses.biggestChallenges || null,
              industryGaps: responses.industryGaps || null,
              currentServices: responses.currentServices || null,
              toolsUsed: responses.toolsUsed || null,
              successMetrics: responses.successMetrics || null,
              dataIntegration: responses.dataIntegration || null,
              studentAdoption: responses.studentAdoption || null,
              privacyConcerns: responses.privacyConcerns || null,
              administrativeNeeds: responses.administrativeNeeds || null,
              additionalFeatures: responses.additionalFeatures || null,
              pilotParticipation: responses.pilotParticipation || false,
              contactEmail: responses.contactEmail || null,
              ipAddress: clientIp,
              userAgent,
              referrer,
              completionTime: metadata?.completionTime || null
            }
          })
          break
      }
    } catch (structuredError) {
      // If structured storage fails, we still have the JSON response
      console.error('Failed to store structured response:', structuredError)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully',
      id: surveyResponse.id,
      structuredId: structuredResponse?.id || null
    })

  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit survey. Please try again.' },
      { status: 500 }
    )
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect()
  }
}

// GET endpoint to check API health
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Survey API is running',
    timestamp: new Date().toISOString()
  })
}