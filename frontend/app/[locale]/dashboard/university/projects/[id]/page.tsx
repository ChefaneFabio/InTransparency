'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Calendar,
  Users,
  FileText,
  Star
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  photo: string | null
  university: string | null
  degree: string | null
  graduationYear: string | null
  gpa: string | null
}

interface Endorsement {
  id: string
  professorName: string
  professorEmail: string
  professorTitle: string | null
  department: string | null
  university: string
  courseName: string | null
  courseCode: string | null
  semester: string | null
  grade: string | null
  endorsementText: string | null
  skills: string[]
  rating: number | null
  verified: boolean
  status: string
  verifiedAt: string | null
}

interface Course {
  id: string
  courseName: string
  courseCode: string
  department: string | null
  semester: string
  academicYear: string
  professorName: string | null
  professorEmail: string | null
  description: string | null
  credits: number | null
  universityVerified: boolean
}

interface ProjectFile {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
  fileSize: number
}

interface Project {
  id: string
  title: string
  description: string
  discipline: string
  projectType: string | null
  technologies: string[]
  skills: string[]
  tools: string[]
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  images: string[]
  videos: string[]
  duration: string | null
  teamSize: number | null
  role: string | null
  client: string | null
  outcome: string | null
  courseName: string | null
  courseCode: string | null
  semester: string | null
  academicYear: string | null
  grade: string | null
  professor: string | null
  verificationStatus: string
  verificationMessage: string | null
  verifiedBy: string | null
  verifiedAt: string | null
  universityVerified: boolean
  complexityScore: number | null
  innovationScore: number | null
  marketRelevance: number | null
  aiInsights: any
  createdAt: string
}

export default function ProjectVerificationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/dashboard/university/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data.project)
        setStudent(data.student)
        setEndorsements(data.endorsements || [])
        setCourse(data.course)
        setFiles(data.files || [])
        setMessage(data.project.verificationMessage || '')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchData()
    }
  }, [projectId])

  const handleAction = async (action: 'verify' | 'reject' | 'request_info') => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/dashboard/university/projects/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          message: message || undefined,
        })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to update verification:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'NEEDS_INFO':
        return (
          <Badge className="bg-orange-100 text-orange-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Needs Info
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!project || !student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/university/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  const isVerified = project.verificationStatus === 'VERIFIED'
  const verifiedEndorsements = endorsements.filter(e => e.status === 'VERIFIED')

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/university/projects">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex items-start gap-4">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-blue-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
              <p className="text-gray-600 mt-1">
                {project.discipline?.replace(/_/g, ' ')}
                {project.projectType && ` - ${project.projectType}`}
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge(project.verificationStatus)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.outcome && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Outcome</h4>
                  <p className="text-gray-700">{project.outcome}</p>
                </div>
              )}

              {/* Skills & Technologies */}
              {(project.skills.length > 0 || project.technologies.length > 0) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>

              {/* Project Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                {project.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{project.duration}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{project.teamSize} {project.teamSize === 1 ? 'person' : 'people'}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span>{project.role}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Context */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Context</CardTitle>
              <CardDescription>
                Course and academic information for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(project.courseName || course?.courseName) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Course</h4>
                    <p className="text-gray-900">
                      {project.courseCode || course?.courseCode}
                      {' - '}
                      {project.courseName || course?.courseName}
                    </p>
                  </div>
                )}
                {(project.semester || course?.semester) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Semester</h4>
                    <p className="text-gray-900">{project.semester || course?.semester}</p>
                  </div>
                )}
                {(project.professor || course?.professorName) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Professor</h4>
                    <p className="text-gray-900">{project.professor || course?.professorName}</p>
                  </div>
                )}
                {project.grade && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Grade</h4>
                    <p className="text-gray-900 font-semibold">{project.grade}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professor Endorsements */}
          {verifiedEndorsements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Professor Endorsements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verifiedEndorsements.map((endorsement) => (
                  <div key={endorsement.id} className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{endorsement.professorName}</p>
                        <p className="text-sm text-gray-600">
                          {endorsement.professorTitle && `${endorsement.professorTitle}, `}
                          {endorsement.department && `${endorsement.department}, `}
                          {endorsement.university}
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    {endorsement.endorsementText && (
                      <p className="text-gray-700 mt-3 italic">
                        "{endorsement.endorsementText}"
                      </p>
                    )}
                    {endorsement.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {endorsement.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(file.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.photo || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {student.degree && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Degree</span>
                    <span className="text-gray-900">{student.degree}</span>
                  </div>
                )}
                {student.graduationYear && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Graduation</span>
                    <span className="text-gray-900">{student.graduationYear}</span>
                  </div>
                )}
                {student.gpa && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">GPA</span>
                    <span className="text-gray-900">{student.gpa}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isVerified ? 'Verification Status' : 'Verify Project'}
              </CardTitle>
              <CardDescription>
                {isVerified
                  ? 'This project has been verified'
                  : 'Review and verify this project for the student\'s portfolio'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isVerified && (
                <>
                  <div className="space-y-2">
                    <Label>Message (optional)</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add feedback or reason for rejection..."
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      onClick={() => handleAction('verify')}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Project
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAction('request_info')}
                        disabled={actionLoading}
                      >
                        Request Info
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('reject')}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {isVerified && project.verifiedAt && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verified on</span>
                    <span className="text-gray-900">
                      {new Date(project.verifiedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {project.verificationMessage && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700">{project.verificationMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Scores */}
          {(project.complexityScore || project.innovationScore || project.marketRelevance) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.complexityScore && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Complexity</span>
                        <span className="font-medium">{project.complexityScore}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${project.complexityScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {project.innovationScore && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Innovation</span>
                        <span className="font-medium">{project.innovationScore}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${project.innovationScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {project.marketRelevance && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Market Relevance</span>
                        <span className="font-medium">{project.marketRelevance}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${project.marketRelevance}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
