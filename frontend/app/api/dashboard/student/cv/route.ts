import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { CvDocument, CvData, CvStyle } from '@/lib/cv-template'

/**
 * GET /api/dashboard/student/cv?style=classic
 * Generates a PDF CV from the student's profile, projects, and exchange data.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const style = (url.searchParams.get('style') === 'modern' ? 'modern' : 'classic') as CvStyle

    const [profile, projects, exchanges, assessments] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          bio: true,
          tagline: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          linkedinUrl: true,
          githubUrl: true,
          portfolioUrl: true,
          location: true,
          workExperience: true,
          // Thesis
          thesisTitle: true,
          thesisSubject: true,
          thesisSupervisor: true,
          thesisKeywords: true,
          // Career Preferences
          desiredOccupation: true,
          preferredSectors: true,
          preferredAreas: true,
          preferredLocations: true,
          willingToRelocate: true,
          willingToRelocateAbroad: true,
          willingToTravel: true,
          continuingStudies: true,
          continuingStudiesType: true,
          // Relations
          languageProficiencies: { orderBy: { createdAt: 'asc' as const } },
          certifications: { orderBy: { createdAt: 'desc' as const } },
        },
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        select: {
          title: true,
          description: true,
          skills: true,
          technologies: true,
          verificationStatus: true,
          grade: true,
          courseName: true,
          complexityScore: true,
          _count: {
            select: {
              endorsements: { where: { status: 'VERIFIED' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.exchangeEnrollment.findMany({
        where: { studentId: user.id },
        select: {
          homeUniversityName: true,
          hostUniversityName: true,
          homeCountry: true,
          hostCountry: true,
          programType: true,
          status: true,
        },
      }),
      prisma.softSkillAssessment.findMany({
        where: {
          userId: user.id,
          status: { in: ['COMPLETED', 'CERTIFIED'] },
        },
        select: {
          assessmentType: true,
          bigFiveProfile: {
            select: {
              openness: true,
              conscientiousness: true,
              extraversion: true,
              agreeableness: true,
              neuroticism: true,
              personality: true,
              strengths: true,
              careerFit: true,
            },
          },
          discProfile: {
            select: {
              dominance: true,
              influence: true,
              steadiness: true,
              compliance: true,
              primaryStyle: true,
              idealTeamRole: true,
            },
          },
          competencyProfile: {
            select: {
              communication: true,
              teamwork: true,
              leadership: true,
              problemSolving: true,
              adaptability: true,
              emotionalIntelligence: true,
              timeManagement: true,
              conflictResolution: true,
              overallScore: true,
              topStrengths: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Derive skills from projects (same logic as profile route)
    const skillMap = new Map<string, { level: number; projectCount: number }>()
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      const allSkills = p.skills.concat(p.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        const existing = skillMap.get(skill)
        if (existing) {
          existing.projectCount += 1
          existing.level = Math.min(100, existing.level + 10)
        } else {
          skillMap.set(skill, { level: 40, projectCount: 1 })
        }
      }
      const bonus = Math.round((p.complexityScore || 0) / 10)
      for (let j = 0; j < allSkills.length; j++) {
        const existing = skillMap.get(allSkills[j])
        if (existing) {
          existing.level = Math.min(100, existing.level + bonus)
        }
      }
    }

    const skills = Array.from(skillMap.entries())
      .map(([name, data]) => ({ name, level: data.level, projectCount: data.projectCount }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 20)

    // Extract latest assessment profiles
    let bigFive = null as CvData['bigFive']
    let disc = null as CvData['disc']
    let competency = null as CvData['competency']
    for (let i = 0; i < assessments.length; i++) {
      const a = assessments[i]
      if (!bigFive && a.bigFiveProfile) {
        const bf = a.bigFiveProfile
        bigFive = {
          openness: bf.openness,
          conscientiousness: bf.conscientiousness,
          extraversion: bf.extraversion,
          agreeableness: bf.agreeableness,
          neuroticism: bf.neuroticism,
          personality: bf.personality,
          strengths: bf.strengths,
          careerFit: bf.careerFit,
        }
      }
      if (!disc && a.discProfile) {
        const d = a.discProfile
        disc = {
          dominance: d.dominance,
          influence: d.influence,
          steadiness: d.steadiness,
          compliance: d.compliance,
          primaryStyle: d.primaryStyle,
          idealTeamRole: d.idealTeamRole,
        }
      }
      if (!competency && a.competencyProfile) {
        const c = a.competencyProfile
        competency = {
          communication: c.communication,
          teamwork: c.teamwork,
          leadership: c.leadership,
          problemSolving: c.problemSolving,
          adaptability: c.adaptability,
          emotionalIntelligence: c.emotionalIntelligence,
          timeManagement: c.timeManagement,
          conflictResolution: c.conflictResolution,
          overallScore: c.overallScore,
          topStrengths: c.topStrengths,
        }
      }
    }

    const cvData: CvData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      university: profile.university,
      degree: profile.degree,
      graduationYear: profile.graduationYear,
      gpa: profile.gpa ? Number(profile.gpa) : null,
      gpaPublic: profile.gpaPublic,
      bio: profile.bio,
      tagline: profile.tagline,
      linkedinUrl: profile.linkedinUrl,
      githubUrl: profile.githubUrl,
      portfolioUrl: profile.portfolioUrl,
      location: profile.location,
      skills,
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        skills: p.skills,
        technologies: p.technologies,
        verificationStatus: p.verificationStatus,
        endorsementCount: p._count.endorsements,
        grade: p.grade,
        courseName: p.courseName,
      })),
      exchanges: exchanges.map((e) => ({
        homeUniversityName: e.homeUniversityName,
        hostUniversityName: e.hostUniversityName,
        homeCountry: e.homeCountry,
        hostCountry: e.hostCountry,
        programType: e.programType,
        status: e.status,
      })),
      bigFive,
      disc,
      competency,
      languages: (profile as any).languageProficiencies?.map((lp: any) => ({
        language: lp.language,
        motherTongue: lp.motherTongue,
        reading: lp.reading,
        writing: lp.writing,
        listening: lp.listening,
        speaking: lp.speaking,
        interaction: lp.interaction,
      })) || [],
      certifications: (profile as any).certifications?.map((c: any) => ({
        name: c.name,
        issuer: c.issuer,
        dateObtained: c.dateObtained ? c.dateObtained.toISOString().split('T')[0] : null,
        expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : null,
        credentialId: c.credentialId,
        credentialUrl: c.credentialUrl,
      })) || [],
      workExperience: Array.isArray((profile as any).workExperience) ? (profile as any).workExperience : [],
      thesisTitle: (profile as any).thesisTitle,
      thesisSubject: (profile as any).thesisSubject,
      thesisSupervisor: (profile as any).thesisSupervisor,
      thesisKeywords: (profile as any).thesisKeywords || [],
      careerPreferences: (profile as any).desiredOccupation || (profile as any).preferredSectors?.length > 0 ? {
        desiredOccupation: (profile as any).desiredOccupation,
        preferredSectors: (profile as any).preferredSectors || [],
        preferredAreas: (profile as any).preferredAreas || [],
        preferredLocations: (profile as any).preferredLocations || [],
        willingToRelocate: (profile as any).willingToRelocate || false,
        willingToRelocateAbroad: (profile as any).willingToRelocateAbroad || false,
        willingToTravel: (profile as any).willingToTravel || false,
        continuingStudies: (profile as any).continuingStudies || false,
        continuingStudiesType: (profile as any).continuingStudiesType,
      } : null,
    }

    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'student'

    const pdfBuffer = await renderToBuffer(
      React.createElement(CvDocument, { data: cvData, style }) as any
    )
    const uint8 = new Uint8Array(pdfBuffer)

    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv-${fullName.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('CV PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CV' },
      { status: 500 }
    )
  }
}
