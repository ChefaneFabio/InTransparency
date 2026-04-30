'use client'

import { useTranslations, useLocale } from 'next-intl'
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
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

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
  const locale = useLocale()
  const isIt = locale === 'it'
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
          <Badge className="bg-primary/10 text-primary">
            <CheckCircle className="h-3 w-3 mr-1" />
            {isIt ? 'Verificato' : 'Verified'}
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            {isIt ? 'Rifiutato' : 'Rejected'}
          </Badge>
        )
      case 'NEEDS_INFO':
        return (
          <Badge className="bg-orange-100 text-orange-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            {isIt ? 'Servono info' : 'Needs Info'}
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            {isIt ? 'In revisione' : 'Pending Review'}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project || !student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">{isIt ? 'Progetto non trovato' : 'Project not found'}</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/university/projects">{isIt ? 'Torna ai progetti' : 'Back to Projects'}</Link>
        </Button>
      </div>
    )
  }

  const isVerified = project.verificationStatus === 'VERIFIED'
  const verifiedEndorsements = endorsements.filter(e => e.status === 'VERIFIED')

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <MetricHero gradient="primary">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/university/projects">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {isIt ? 'Indietro' : 'Back'}
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
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-blue-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{project.title}</h1>
                <p className="text-muted-foreground mt-1">
                  {project.discipline?.replace(/_/g, ' ')}
                  {project.projectType && ` - ${project.projectType}`}
                </p>
              </div>
            </div>
          </div>
          {getStatusBadge(project.verificationStatus)}
        </div>
      </MetricHero>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4">{isIt ? 'Dettagli del progetto' : 'Project Details'}</h3>
              <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{isIt ? 'Descrizione' : 'Description'}</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.outcome && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{isIt ? 'Risultato' : 'Outcome'}</h4>
                  <p className="text-foreground/80">{project.outcome}</p>
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
                      {isIt ? 'Vedi codice' : 'View Code'}
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {isIt ? 'Demo live' : 'Live Demo'}
                    </a>
                  </Button>
                )}
              </div>

              {/* Project Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                {project.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground/60" />
                    <span>{project.duration}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground/60" />
                    <span>{project.teamSize} {isIt ? (project.teamSize === 1 ? 'persona' : 'persone') : (project.teamSize === 1 ? 'person' : 'people')}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-muted-foreground/60" />
                    <span>{project.role}</span>
                  </div>
                )}
              </div>
              </div>
            </div>
          </GlassCard>

          {/* Academic Context */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{isIt ? 'Contesto accademico' : 'Academic Context'}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isIt ? 'Informazioni di corso e accademiche per la verifica' : 'Course and academic information for verification'}
              </p>
              <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(project.courseName || course?.courseName) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{isIt ? 'Corso' : 'Course'}</h4>
                    <p className="text-foreground">
                      {project.courseCode || course?.courseCode}
                      {' - '}
                      {project.courseName || course?.courseName}
                    </p>
                  </div>
                )}
                {(project.semester || course?.semester) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{isIt ? 'Semestre' : 'Semester'}</h4>
                    <p className="text-foreground">{project.semester || course?.semester}</p>
                  </div>
                )}
                {(project.professor || course?.professorName) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{isIt ? 'Docente' : 'Professor'}</h4>
                    <p className="text-foreground">{project.professor || course?.professorName}</p>
                  </div>
                )}
                {project.grade && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{isIt ? 'Voto' : 'Grade'}</h4>
                    <p className="text-foreground font-semibold">{project.grade}</p>
                  </div>
                )}
              </div>
              </div>
            </div>
          </GlassCard>

          {/* Professor Endorsements */}
          {verifiedEndorsements.length > 0 && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  {isIt ? 'Endorsement docenti' : 'Professor Endorsements'}
                </h3>
                <div className="space-y-4">
                {verifiedEndorsements.map((endorsement) => (
                  <div key={endorsement.id} className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{endorsement.professorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {endorsement.professorTitle && `${endorsement.professorTitle}, `}
                          {endorsement.department && `${endorsement.department}, `}
                          {endorsement.university}
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isIt ? 'Verificato' : 'Verified'}
                      </Badge>
                    </div>
                    {endorsement.endorsementText && (
                      <p className="text-foreground/80 mt-3 italic">
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
                </div>
              </div>
            </GlassCard>
          )}

          {/* Files */}
          {files.length > 0 && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-4">{isIt ? 'File allegati' : 'Attached Files'}</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground/60" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground/60" />
                    </a>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-base font-semibold mb-3">{isIt ? 'Studente' : 'Student'}</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.photo || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {student.degree && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isIt ? 'Laurea' : 'Degree'}</span>
                    <span className="text-foreground">{student.degree}</span>
                  </div>
                )}
                {student.graduationYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isIt ? 'Anno laurea' : 'Graduation'}</span>
                    <span className="text-foreground">{student.graduationYear}</span>
                  </div>
                )}
                {student.gpa && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GPA</span>
                    <span className="text-foreground">{student.gpa}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Verification Form */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-base font-semibold">
                {isVerified ? (isIt ? 'Stato verifica' : 'Verification Status') : (isIt ? 'Verifica progetto' : 'Verify Project')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isVerified
                  ? (isIt ? 'Questo progetto e stato verificato' : 'This project has been verified')
                  : (isIt ? 'Rivedi e verifica questo progetto per il portfolio dello studente' : 'Review and verify this project for the student\'s portfolio')
                }
              </p>
              <div className="space-y-4">
              {!isVerified && (
                <>
                  <div className="space-y-2">
                    <Label>{isIt ? 'Messaggio (opzionale)' : 'Message (optional)'}</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isIt ? 'Aggiungi feedback o motivo del rifiuto...' : 'Add feedback or reason for rejection...'}
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
                      {isIt ? 'Verifica progetto' : 'Verify Project'}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAction('request_info')}
                        disabled={actionLoading}
                      >
                        {isIt ? 'Chiedi info' : 'Request Info'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('reject')}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isIt ? 'Rifiuta' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {isVerified && project.verifiedAt && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isIt ? 'Verificato il' : 'Verified on'}</span>
                    <span className="text-foreground">
                      {new Date(project.verifiedAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>
              )}

              {project.verificationMessage && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{isIt ? 'Messaggio' : 'Message'}</p>
                  <p className="text-sm text-foreground/80">{project.verificationMessage}</p>
                </div>
              )}
              </div>
            </div>
          </GlassCard>

          {/* AI Scores */}
          {(project.complexityScore || project.innovationScore || project.marketRelevance) && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-base font-semibold mb-3">{isIt ? 'Analisi AI' : 'AI Analysis'}</h3>
                <div className="space-y-3">
                  {project.complexityScore && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isIt ? 'Complessita' : 'Complexity'}</span>
                        <span className="font-medium">{project.complexityScore}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${project.complexityScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {project.innovationScore && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isIt ? 'Innovazione' : 'Innovation'}</span>
                        <span className="font-medium">{project.innovationScore}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/50 rounded-full"
                          style={{ width: `${project.innovationScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {project.marketRelevance && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{isIt ? 'Rilevanza di mercato' : 'Market Relevance'}</span>
                        <span className="font-medium">{project.marketRelevance}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/50 rounded-full"
                          style={{ width: `${project.marketRelevance}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
