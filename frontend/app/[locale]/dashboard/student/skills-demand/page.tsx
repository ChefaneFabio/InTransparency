'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Briefcase,
  ArrowRight,
} from 'lucide-react'

interface DemandData {
  totalJobs: number
  mySkillCount: number
  marketMatchPercent: number
  topDemanded: Array<{ skill: string; total: number; required: number; preferred: number; iHaveIt: boolean }>
  gaps: Array<{ skill: string; demandCount: number; requiredIn: number; preferredIn: number; exampleJobs: string[] }>
  strengths: Array<{ skill: string; demandCount: number }>
  risingSkills: Array<{ skill: string; recentMentions: number }>
}

export default function SkillsDemandPage() {
  const [data, setData] = useState<DemandData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/student/skills-demand')
      .then(res => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No demand data available</h2>
        <p className="text-muted-foreground">Skills demand will appear when companies post jobs on the platform.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Skills Demand</h1>
        <p className="text-muted-foreground">What companies are looking for right now — and how you compare.</p>
      </div>

      {/* Market Match */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={data.marketMatchPercent >= 60 ? 'border-green-300' : data.marketMatchPercent >= 35 ? 'border-amber-300' : 'border-red-300'}>
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-1 text-primary" />
            <div className={`text-3xl font-bold ${
              data.marketMatchPercent >= 60 ? 'text-green-600' : data.marketMatchPercent >= 35 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {data.marketMatchPercent}%
            </div>
            <div className="text-xs text-muted-foreground">Market Match</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-1 text-primary" />
            <div className="text-3xl font-bold text-primary">{data.mySkillCount}</div>
            <div className="text-xs text-muted-foreground">Your Skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Briefcase className="h-6 w-6 mx-auto mb-1 text-primary" />
            <div className="text-3xl font-bold text-primary">{data.totalJobs}</div>
            <div className="text-xs text-muted-foreground">Active Jobs Analyzed</div>
          </CardContent>
        </Card>
      </div>

      {/* Gaps — what to learn */}
      {data.gaps.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Skills to Develop
            </CardTitle>
            <CardDescription>In-demand skills you don't have yet — learning these increases your match rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.gaps.map((gap) => (
                <div key={gap.skill} className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground capitalize">{gap.skill}</span>
                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                      {gap.demandCount} jobs
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Required in {gap.requiredIn} jobs, preferred in {gap.preferredIn}
                  </div>
                  {gap.exampleJobs.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      e.g. {gap.exampleJobs[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths — what I already have */}
      {data.strengths.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Your In-Demand Skills
            </CardTitle>
            <CardDescription>Skills you have that companies are actively searching for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.strengths.map((s) => (
                <div key={s.skill} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-foreground capitalize">{s.skill}</span>
                  <span className="text-xs text-green-700">{s.demandCount} jobs want this</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Demanded Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Most Demanded Skills</CardTitle>
          <CardDescription>Top 20 skills across all active job listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.topDemanded.map((s) => {
              const maxDemand = data.topDemanded[0]?.total || 1
              return (
                <div key={s.skill} className="flex items-center gap-3">
                  {s.iHaveIt ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border flex-shrink-0" />
                  )}
                  <span className="text-sm w-32 flex-shrink-0 capitalize">{s.skill}</span>
                  <Progress value={(s.total / maxDemand) * 100} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-16 text-right">{s.total} jobs</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rising Skills */}
      {data.risingSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.risingSkills.map((s) => (
                <Badge key={s.skill} className="bg-primary/10 text-primary border-primary/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {s.skill} ({s.recentMentions})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
