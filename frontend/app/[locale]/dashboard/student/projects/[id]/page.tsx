'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Eye,
  Share,
  Github,
  ExternalLink,
  Edit3,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Award,
  BookOpen,
  Globe,
  Lock,
  Heart
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import BadgeExportPanel from '@/components/badges/BadgeExportPanel'
import EndorsementRequestForm from '@/components/dashboard/student/EndorsementRequestForm'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const currentUserId = (session?.user as any)?.id
  const isOwner = project && currentUserId === project.userId

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch project')
        return
      }

      setProject(data.project)
    } catch (err) {
      console.error('Failed to fetch project:', err)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/projects/${params.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          router.push('/dashboard/student/projects')
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to delete project')
        }
      } catch (err) {
        console.error('Failed to delete project:', err)
        alert('Failed to delete project')
      }
    }
  }

  const shareProject = async () => {
    const url = `${window.location.origin}/projects/${project.id}`
    try {
      await navigator.share({
        title: project.title,
        text: project.description,
        url: url
      })
    } catch (err) {
      navigator.clipboard.writeText(url)
      alert('Project link copied to clipboard!')
    }
  }

  // Parse aiInsights JSON
  const getAiInsights = () => {
    if (!project?.aiInsights) return null
    try {
      return typeof project.aiInsights === 'string'
        ? JSON.parse(project.aiInsights)
        : project.aiInsights
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error === 'Access denied' ? 'Access Denied' : 'Project Not Found'}
        </h1>
        <p className="text-gray-600 mb-6">
          {error === 'Access denied'
            ? 'You don\'t have permission to view this project.'
            : 'The project you\'re looking for doesn\'t exist or has been removed.'}
        </p>
        <Button asChild>
          <Link href="/dashboard/student/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  const allTechnologies = [
    ...(project.technologies || []),
    ...(project.skills || []),
    ...(project.tools || [])
  ]
  const aiInsights = getAiInsights()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/student/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={shareProject}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/student/projects/${project.id}/edit`}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteProject} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Project Header */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <Badge variant={project.isPublic ? 'default' : 'secondary'}>
              {project.isPublic ? (
                <><Globe className="mr-1 h-3 w-3" /> Public</>
              ) : (
                <><Lock className="mr-1 h-3 w-3" /> Private</>
              )}
            </Badge>
          </div>

          {(project.discipline || project.projectType) && (
            <div className="flex items-center gap-2 mb-3">
              {project.discipline && (
                <Badge variant="outline">{project.discipline.replace(/_/g, ' ')}</Badge>
              )}
              {project.projectType && (
                <Badge variant="outline">{project.projectType}</Badge>
              )}
            </div>
          )}

          <p className="text-lg text-gray-600 mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
            {project.teamSize && (
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {project.teamSize} team member{project.teamSize > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{project.views || 0}</div>
              <div className="text-xs text-gray-700">Views</div>
            </CardContent>
          </Card>
          {project.innovationScore != null && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{project.innovationScore}</div>
                <div className="text-xs text-gray-700">Innovation</div>
              </CardContent>
            </Card>
          )}
          {project.complexityScore != null && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{project.complexityScore}</div>
                <div className="text-xs text-gray-700">Complexity</div>
              </CardContent>
            </Card>
          )}
          {project.marketRelevance != null && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{project.marketRelevance}</div>
                <div className="text-xs text-gray-700">Market Relevance</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Project Images */}
              {project.images && project.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.images.map((image: string, index: number) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Technologies / Skills / Tools */}
              {allTechnologies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technologies & Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Technologies</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech: string) => (
                              <Badge key={tech} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill: string) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.tools && project.tools.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Tools</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.map((tool: string) => (
                              <Badge key={tool} variant="outline">{tool}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Context */}
              {(project.duration || project.role || project.client || project.outcome) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Context</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.duration && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-gray-900">{project.duration}</p>
                        </div>
                      )}
                      {project.role && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Role</p>
                          <p className="text-gray-900">{project.role}</p>
                        </div>
                      )}
                      {project.client && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Client</p>
                          <p className="text-gray-900">{project.client}</p>
                        </div>
                      )}
                      {project.outcome && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Outcome</p>
                          <p className="text-gray-900">{project.outcome}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Endorsements */}
              {project.endorsements && project.endorsements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-primary" />
                      Verified Endorsements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.endorsements.map((e: any) => (
                      <div key={e.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{e.professorName}</p>
                            <p className="text-sm text-gray-600">
                              {e.professorTitle}{e.department ? `, ${e.department}` : ''}
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
                            {e.skills.map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {!project.aiAnalyzed ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No AI Analysis Yet</p>
                    <p className="text-sm">AI analysis will be generated after project submission.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-secondary" />
                        AI Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.innovationScore != null && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Innovation</span>
                            <span className="font-semibold">{project.innovationScore}/100</span>
                          </div>
                          <Progress value={project.innovationScore} className="h-2" />
                        </div>
                      )}
                      {project.complexityScore != null && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Complexity</span>
                            <span className="font-semibold">{project.complexityScore}/100</span>
                          </div>
                          <Progress value={project.complexityScore} className="h-2" />
                        </div>
                      )}
                      {project.marketRelevance != null && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Market Relevance</span>
                            <span className="font-semibold">{project.marketRelevance}/100</span>
                          </div>
                          <Progress value={project.marketRelevance} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Insights from JSON */}
                  {aiInsights && (
                    <>
                      {/* Summary */}
                      {aiInsights.summary && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Brain className="mr-2 h-5 w-5 text-primary" />
                              AI Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{aiInsights.summary}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Strengths (was keyInsights — fixed mismatch) */}
                      {aiInsights.strengths && aiInsights.strengths.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Award className="mr-2 h-5 w-5 text-primary" />
                              Key Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {aiInsights.strengths.map((item: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-primary/50 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {aiInsights.improvements && aiInsights.improvements.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                              Improvement Suggestions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {aiInsights.improvements.map((item: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Detected Competencies with scores (fixed from skillsIdentified) */}
                      {aiInsights.detectedCompetencies && aiInsights.detectedCompetencies.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="mr-2 h-5 w-5 text-primary" />
                              Detected Competencies
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {aiInsights.detectedCompetencies.map((comp: any, i: number) => {
                              const isRated = typeof comp === 'object' && comp.name
                              const name = isRated ? comp.name : comp
                              const score = isRated ? comp.score : null
                              const evidence = isRated ? comp.evidence : null
                              return (
                                <div key={i}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-900">{name}</span>
                                    {score != null && (
                                      <span className="text-gray-600">{score}/100</span>
                                    )}
                                  </div>
                                  {score != null && (
                                    <Progress value={score} className="h-2 mb-1" />
                                  )}
                                  {evidence && (
                                    <p className="text-xs text-gray-500">{evidence}</p>
                                  )}
                                </div>
                              )
                            })}
                          </CardContent>
                        </Card>
                      )}

                      {/* Soft Skills */}
                      {aiInsights.softSkills && aiInsights.softSkills.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Heart className="mr-2 h-5 w-5 text-pink-500" />
                              Soft Skills
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {aiInsights.softSkills.map((skill: any, i: number) => (
                              <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-900">{skill.name}</span>
                                  {skill.score != null && (
                                    <span className="text-gray-600">{skill.score}/100</span>
                                  )}
                                </div>
                                {skill.score != null && (
                                  <Progress value={skill.score} className="h-2 mb-1" />
                                )}
                                {skill.evidence && (
                                  <p className="text-xs text-gray-500">{skill.evidence}</p>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Recommendations */}
                      {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="mr-2 h-5 w-5 text-primary" />
                              Recommendations
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {aiInsights.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-primary/50 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              {(project.courseName || project.professor || project.grade || project.semester) ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Academic Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.courseName && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Course</p>
                          <p className="text-gray-900">
                            {project.courseName}
                            {project.courseCode && ` (${project.courseCode})`}
                          </p>
                        </div>
                      )}
                      {project.professor && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Professor</p>
                          <p className="text-gray-900">{project.professor}</p>
                        </div>
                      )}
                      {project.semester && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Semester</p>
                          <p className="text-gray-900">
                            {project.semester}
                            {project.academicYear && ` (${project.academicYear})`}
                          </p>
                        </div>
                      )}
                      {project.grade && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Grade</p>
                          <p className="text-gray-900">{project.grade}</p>
                          {project.normalizedGrade && (
                            <p className="text-xs text-primary mt-0.5">
                              Normalized: {Math.round(project.normalizedGrade)}/100
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {project.universityVerified && (
                      <div className="mt-4 flex items-center text-primary">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">University Verified</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No Academic Info</p>
                    <p className="text-sm">Add course details by editing this project.</p>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {project.certifications && project.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.certifications.map((cert: string) => (
                        <Badge key={cert} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.githubUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Repository
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {isOwner && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/dashboard/student/projects/${project.id}/edit`}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Project
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Professor Endorsement - request or view status */}
          {isOwner && (
            <EndorsementRequestForm
              projectId={project.id}
              projectTitle={project.title}
              courseName={project.courseName}
              professor={project.professor}
              university={project.user?.university}
              existingEndorsements={project.endorsements || []}
            />
          )}

          {/* Verification Badge Export */}
          {project.universityVerified && project.verificationStatus === 'VERIFIED' && (
            <BadgeExportPanel
              projectId={project.id}
              projectTitle={project.title}
            />
          )}

          {/* Project Owner */}
          {project.user && (
            <Card>
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  {project.user.photo ? (
                    <img src={project.user.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {(project.user.firstName?.[0] || '') + (project.user.lastName?.[0] || '')}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {project.user.firstName} {project.user.lastName}
                    </p>
                    {project.user.university && (
                      <p className="text-sm text-gray-600">{project.user.university}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Views</span>
                <span className="font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-gray-400" />
                  {project.views || 0}
                </span>
              </div>
              {project.recruiterViews > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recruiter Views</span>
                  <span className="font-medium">{project.recruiterViews}</span>
                </div>
              )}
              {project.innovationScore != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Innovation Score</span>
                  <span className="font-semibold">{project.innovationScore}/100</span>
                </div>
              )}
              {project.complexityScore != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Complexity</span>
                  <span className="font-semibold">{project.complexityScore}/100</span>
                </div>
              )}
              {project.marketRelevance != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Market Relevance</span>
                  <span className="font-semibold">{project.marketRelevance}/100</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files */}
          {project.files && project.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.files.map((file: any) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded hover:bg-gray-50 text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-700 truncate">{file.name || file.url}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
