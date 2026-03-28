'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCircle2,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Lightbulb,
  Zap,
  ArrowRight,
  Shield,
  Code2,
  Briefcase,
  Sparkles,
} from 'lucide-react'

interface ReadinessBriefData {
  hasData: boolean
  message?: string
  studentName?: string
  degree?: string
  university?: string
  summary?: {
    totalProjects: number
    verifiedProjects: number
    avgInnovation: number | null
    avgComplexity: number | null
    primaryDiscipline: string
    teamProjects: number
    soloProjects: number
  }
  coreTechnologies?: Array<{ name: string; projectCount: number }>
  topCompetencies?: Array<{ name: string; averageScore: number; projectCount: number }>
  softSkills?: Array<{ name: string; score: number }>
  readyToAssignTasks?: Array<{ task: string; confidence: 'high' | 'medium'; reason: string }>
  onboardingPath?: { first30: string[]; next30: string[]; next30to90: string[] }
  teamFit?: { bestFitRoles: string[]; workStyle: string; collaborationNote: string }
  strengths?: string[]
  growthAreas?: string[]
  recommendations?: string[]
  projectHighlights?: Array<{ projectTitle: string; summary: string; highlights: string[] }>
}

interface ReadinessBriefProps {
  studentId: string
}

export default function ReadinessBrief({ studentId }: ReadinessBriefProps) {
  const t = useTranslations('recruiterComponents')
  const [data, setData] = useState<ReadinessBriefData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/recruiter/readiness-brief/${studentId}`)
        if (!res.ok) throw new Error('Failed to load readiness brief')
        const briefData = await res.json()
        setData(briefData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBrief()
  }, [studentId])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground">{error || t('unableToLoad')}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data.hasData) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">{data.message || t('noProjectData')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {data.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-primary">{data.summary.totalProjects}</div>
              <div className="text-xs text-gray-600">{t('projectsAnalyzed')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {data.summary.verifiedProjects}/{data.summary.totalProjects}
              </div>
              <div className="text-xs text-gray-600">{t('verified')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-primary">{data.summary.avgComplexity ?? '—'}</div>
              <div className="text-xs text-gray-600">{t('avgComplexity')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-primary">{data.summary.avgInnovation ?? '—'}</div>
              <div className="text-xs text-gray-600">{t('avgInnovation')}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ready-to-Assign Tasks */}
      {data.readyToAssignTasks && data.readyToAssignTasks.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('readyToAssign')}
            </CardTitle>
            <CardDescription>
              {t('readyToAssignDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.readyToAssignTasks.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="mt-0.5">
                    {item.confidence === 'high' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Zap className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.task}</span>
                      <Badge
                        variant="outline"
                        className={item.confidence === 'high'
                          ? 'border-green-300 text-green-700 bg-green-50'
                          : 'border-amber-300 text-amber-700 bg-amber-50'
                        }
                      >
                        {item.confidence === 'high' ? t('highConfidence') : t('growingSkill')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onboarding Path */}
      {data.onboardingPath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('onboardingPath')}
            </CardTitle>
            <CardDescription>
              {t('onboardingPathDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* First 30 days */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    30
                  </div>
                  <span className="font-semibold text-gray-900">{t('first30Days')}</span>
                  <Badge variant="outline" className="text-xs">{t('orientation')}</Badge>
                </div>
                <ul className="space-y-2 ml-10">
                  {data.onboardingPath.first30.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Days 30–60 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    60
                  </div>
                  <span className="font-semibold text-gray-900">{t('days30to60')}</span>
                  <Badge variant="outline" className="text-xs">{t('growing')}</Badge>
                </div>
                <ul className="space-y-2 ml-10">
                  {data.onboardingPath.next30.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Days 60–90 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    90
                  </div>
                  <span className="font-semibold text-gray-900">{t('days60to90')}</span>
                  <Badge variant="outline" className="text-xs">{t('autonomy')}</Badge>
                </div>
                <ul className="space-y-2 ml-10">
                  {data.onboardingPath.next30to90.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Fit & Core Technologies */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team Fit */}
        {data.teamFit && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t('teamFit')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('bestFitRoles')}</p>
                <div className="flex flex-wrap gap-2">
                  {data.teamFit.bestFitRoles.map((role) => (
                    <Badge key={role} className="bg-primary/10 text-primary border-primary/30">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('workStyle')}</p>
                <p className="text-sm font-medium text-gray-900">{data.teamFit.workStyle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 italic">{data.teamFit.collaborationNote}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Core Technologies */}
        {data.coreTechnologies && data.coreTechnologies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                {t('coreTech')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.coreTechnologies.map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min(tech.projectCount * 25, 100)} className="w-24 h-2" />
                      <span className="text-xs text-gray-500 w-16 text-right">
                        {tech.projectCount} {tech.projectCount !== 1 ? t('projects') : t('project')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {data.strengths && data.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                {t('strengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {data.growthAreas && data.growthAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                {t('growthAreas')}
              </CardTitle>
              <CardDescription>{t('growthAreasDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.growthAreas.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{g}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Project Highlights */}
      {data.projectHighlights && data.projectHighlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('aiProjectAnalysis')}
            </CardTitle>
            <CardDescription>{t('aiProjectAnalysisDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.projectHighlights.map((ph, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">{ph.projectTitle}</h4>
                <p className="text-sm text-gray-700 mb-2">{ph.summary}</p>
                {ph.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ph.highlights.map((h, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{h}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('recommendations')}
            </CardTitle>
            <CardDescription>{t('recommendationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('softSkills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.softSkills.map((skill) => (
                <div key={skill.name} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{skill.score}</div>
                  <div className="text-xs text-gray-600">{skill.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
