'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  Star,
  Zap,
  BookOpen,
  Eye,
  Lightbulb,
  ArrowRight,
  Users,
} from 'lucide-react'

interface SkillData {
  name: string
  firstSeen: string
  projectCount: number
  projects: string[]
  avgComplexity: number | null
  avgInnovation: number | null
  proficiency: 'exposure' | 'working' | 'proficient' | 'expert'
  proficiencyScore: number
}

interface TimelineData {
  hasData: boolean
  summary?: {
    totalSkills: number
    totalProjects: number
    expertSkills: number
    proficientSkills: number
    workingSkills: number
    exposureSkills: number
  }
  skills?: SkillData[]
  timeline?: Array<{ month: string; skillCount: number; newSkills: string[] }>
  transferableSkills?: Array<{ skill: string; category: string; confidence: number; evidence: string }>
  suggestions?: Array<{ skill: string; reason: string }>
}

const PROFICIENCY_COLORS: Record<string, string> = {
  expert: 'bg-green-100 text-green-800 border-green-300',
  proficient: 'bg-blue-100 text-blue-800 border-blue-300',
  working: 'bg-amber-100 text-amber-800 border-amber-300',
  exposure: 'bg-muted text-muted-foreground border-border',
}

const PROFICIENCY_PROGRESS: Record<string, number> = {
  expert: 100,
  proficient: 70,
  working: 45,
  exposure: 20,
}

export default function SkillsTimelinePage() {
  const [data, setData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/student/skills-timeline')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({ hasData: false }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!data?.hasData) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No skills data yet</h2>
        <p className="text-muted-foreground">Upload projects to start tracking your skill growth.</p>
      </div>
    )
  }

  const { summary, skills, timeline, transferableSkills, suggestions } = data

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Skills Timeline</h1>
        <p className="text-muted-foreground">Track how your skills grow with every project you build.</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Star className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-600">{summary.expertSkills}</div>
              <div className="text-xs text-muted-foreground">Expert</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Zap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-600">{summary.proficientSkills}</div>
              <div className="text-xs text-muted-foreground">Proficient</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-6 w-6 text-amber-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-amber-600">{summary.workingSkills}</div>
              <div className="text-xs text-muted-foreground">Working</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Eye className="h-6 w-6 text-muted-foreground/60 mx-auto mb-1" />
              <div className="text-2xl font-bold text-muted-foreground">{summary.exposureSkills}</div>
              <div className="text-xs text-muted-foreground">Exposure</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skills with Proficiency */}
      {skills && skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Skills by Proficiency</CardTitle>
            <CardDescription>{skills.length} skills across {summary?.totalProjects || 0} projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <div className="w-36 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground capitalize">{skill.name}</span>
                  </div>
                  <Progress value={PROFICIENCY_PROGRESS[skill.proficiency] || 0} className="flex-1 h-2" />
                  <Badge variant="outline" className={`text-xs w-24 justify-center ${PROFICIENCY_COLORS[skill.proficiency]}`}>
                    {skill.proficiency}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {skill.projectCount} project{skill.projectCount !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Timeline */}
      {timeline && timeline.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((month, i) => (
                <div key={month.month} className="flex items-start gap-4">
                  <div className="w-20 flex-shrink-0 text-sm font-medium text-foreground/80">{month.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={Math.min((month.skillCount / (timeline[timeline.length - 1]?.skillCount || 1)) * 100, 100)} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-12 text-right">{month.skillCount} skills</span>
                    </div>
                    {month.newSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {month.newSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            + {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Transferable Skills */}
        {transferableSkills && transferableSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Transferable Skills
              </CardTitle>
              <CardDescription>Soft skills detected from your project descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transferableSkills.map((ts) => (
                  <div key={ts.skill} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{ts.skill}</span>
                      <Badge variant="outline" className="text-xs">{ts.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{ts.evidence}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggested Next Skills */}
        {suggestions && suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Skills to Learn Next
              </CardTitle>
              <CardDescription>Based on your current skills, these would be easy to pick up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <div key={s.skill} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{s.skill}</span>
                      <span className="text-muted-foreground ml-1">— {s.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
