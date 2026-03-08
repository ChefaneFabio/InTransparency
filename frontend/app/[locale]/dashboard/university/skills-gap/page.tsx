'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Briefcase,
} from 'lucide-react'

interface SkillGapItem {
  skill: string
  demandScore: number
  studentCount: number
  gapSeverity: number
}

interface SkillGapData {
  gaps: SkillGapItem[]
  strengths: SkillGapItem[]
  studentCount: number
  jobCount: number
  generatedAt: string
}

function getSeverityColor(severity: number): string {
  if (severity >= 60) return 'bg-red-500'
  if (severity >= 40) return 'bg-orange-500'
  if (severity >= 20) return 'bg-yellow-500'
  return 'bg-blue-400'
}

function getSeverityLabel(severity: number): string {
  if (severity >= 60) return 'Critical'
  if (severity >= 40) return 'High'
  if (severity >= 20) return 'Moderate'
  return 'Low'
}

export default function SkillsGapPage() {
  const [data, setData] = useState<SkillGapData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/skills-gap')
        if (res.ok) {
          setData(await res.json())
        }
      } catch (error) {
        console.error('Failed to fetch skills gap:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-blue-300 animate-pulse mb-4" />
          <p className="text-gray-500">Analyzing skills data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">Unable to generate skills gap report.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skills Gap Heatmap</h1>
        <p className="text-gray-600 mt-1">
          Compare your students&apos; skills against market demand
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.studentCount}</p>
                <p className="text-sm text-gray-600">Students analyzed</p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.jobCount}</p>
                <p className="text-sm text-gray-600">Active jobs scanned</p>
              </div>
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{data.gaps.length}</p>
                <p className="text-sm text-gray-600">Skill gaps found</p>
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{data.strengths.length}</p>
                <p className="text-sm text-gray-600">Strengths identified</p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Gap Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Skills Gaps — High Market Demand, Low Student Coverage
          </CardTitle>
          <CardDescription>
            These skills are in demand by employers but underrepresented in your students&apos; portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.gaps.length > 0 ? (
            <div className="space-y-3">
              {data.gaps.map((gap) => (
                <div key={gap.skill} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{gap.skill}</span>
                      <Badge className={`text-xs text-white ${getSeverityColor(gap.gapSeverity)}`}>
                        {getSeverityLabel(gap.gapSeverity)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Demand: {gap.demandScore}%</span>
                      <span>Students: {gap.studentCount}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div
                      className="bg-red-200 rounded-l"
                      style={{ width: `${Math.min(gap.demandScore, 100)}%` }}
                      title={`Market demand: ${gap.demandScore}%`}
                    >
                      <div className="h-full bg-red-500 rounded-l opacity-80" style={{ width: '100%' }} />
                    </div>
                    <div
                      className="bg-primary/50 rounded-r opacity-60"
                      style={{
                        width: `${Math.min(
                          data.studentCount > 0
                            ? (gap.studentCount / data.studentCount) * 100
                            : 0,
                          100
                        )}%`,
                      }}
                      title={`Student coverage: ${gap.studentCount} students`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  Market demand
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary/50 rounded opacity-60" />
                  Student coverage
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p>No significant skill gaps detected!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Strengths — Your Students Excel Here
          </CardTitle>
          <CardDescription>
            Skills where your student coverage exceeds market demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.strengths.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s) => (
                <Badge
                  key={s.skill}
                  variant="outline"
                  className="text-green-700 border-green-300 bg-primary/5 px-3 py-1"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  <span className="capitalize">{s.skill}</span>
                  <span className="ml-1 text-gray-500">({s.studentCount} students)</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No clear strengths detected yet. Encourage students to add more skills to their projects.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Generated timestamp */}
      <p className="text-xs text-gray-400 text-right">
        Report generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
