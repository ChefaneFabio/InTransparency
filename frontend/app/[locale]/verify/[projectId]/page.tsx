import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Shield, BookOpen, Calendar, CheckCircle, User } from 'lucide-react'
import { normalizeGrade, formatGradeForDisplay } from '@/lib/grade-normalization'

interface Props {
  params: Promise<{ projectId: string; locale: string }>
}

/**
 * Public verification page — no auth required.
 * Shows verified project details, endorsements, institution info.
 */
export default async function VerifyProjectPage({ params }: Props) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          university: true,
          degree: true,
          country: true,
        },
      },
      endorsements: {
        where: { status: 'VERIFIED' },
        select: {
          professorName: true,
          professorTitle: true,
          department: true,
          university: true,
          endorsementText: true,
          rating: true,
          skills: true,
          verifiedAt: true,
        },
      },
      portableBadges: {
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!project || project.verificationStatus !== 'VERIFIED') {
    notFound()
  }

  const badge = project.portableBadges[0]
  const country = project.user?.country || 'IT'

  // Compute normalized grade if available
  let normalizedDisplay: string | null = null
  if (project.grade) {
    const normalized = normalizeGrade(project.grade, country)
    if (normalized !== null) {
      normalizedDisplay = `${normalized}/100`
    }
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://intransparency.eu'}/verify/${projectId}`

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900">Verified Project</h1>
              <p className="text-green-700 text-sm mt-1">
                This project has been verified by the student&apos;s institution.
                All information has been authenticated.
              </p>
              {project.verifiedAt && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Verified on {new Date(project.verifiedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              {project.discipline && (
                <Badge variant="outline" className="mt-2">
                  {project.discipline.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{project.description}</p>

          {/* Skills */}
          {(project.skills.length > 0 || project.technologies.length > 0) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Verified Skills</p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student & Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900">
              {project.user?.firstName} {project.user?.lastName}
            </p>
            {project.user?.university && (
              <p className="text-sm text-gray-600 mt-1">{project.user.university}</p>
            )}
            {project.user?.degree && (
              <p className="text-sm text-gray-600">{project.user.degree}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Academic Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.courseName && (
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="text-gray-900">
                  {project.courseName}
                  {project.courseCode && ` (${project.courseCode})`}
                </p>
              </div>
            )}
            {project.grade && (
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="text-gray-900">
                  {project.grade}
                  {normalizedDisplay && (
                    <span className="text-sm text-gray-500 ml-2">
                      (normalized: {normalizedDisplay})
                    </span>
                  )}
                </p>
              </div>
            )}
            {project.semester && (
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="text-gray-900">{project.semester}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Professor Endorsements */}
      {project.endorsements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              Professor Endorsements ({project.endorsements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.endorsements.map((e, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{e.professorName}</p>
                    <p className="text-sm text-gray-600">
                      {e.professorTitle}
                      {e.department && `, ${e.department}`}
                    </p>
                    {e.university && (
                      <p className="text-sm text-gray-500">{e.university}</p>
                    )}
                  </div>
                  {e.rating && (
                    <Badge variant="default">{e.rating}/5</Badge>
                  )}
                </div>
                {e.endorsementText && (
                  <p className="text-gray-700 text-sm mt-2">{e.endorsementText}</p>
                )}
                {e.skills && e.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {e.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Badge Hash / Integrity */}
      {badge && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Content hash: </span>
              <code className="text-xs bg-gray-200 px-2 py-0.5 rounded font-mono">
                {badge.contentHash.substring(0, 16)}...
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Verify at: {verifyUrl}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
