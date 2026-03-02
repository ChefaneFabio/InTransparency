'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Award, Shield, TrendingUp, User } from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface CandidateData {
  candidate: {
    id: string
    firstName: string | null
    lastName: string | null
    university: string | null
    degree: string | null
    country: string
  }
  trustScore: {
    verifiedProjects: number
    totalProjects: number
    endorsementCount: number
  }
  skills: Array<{ name: string; industryTerms: string[] }>
  projects: Array<{
    innovationScore: number | null
    complexityScore: number | null
    marketRelevance: number | null
    verificationStatus: string
  }>
  grades: Array<{
    normalizedGrade: number | null
  }>
  prediction: {
    probability: number
  } | null
  matchScore: number | null
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

export default function CompareCandidatesPage() {
  const searchParams = useSearchParams()
  const candidateIds = searchParams.get('candidates')?.split(',').filter(Boolean) || []
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (candidateIds.length === 0) return
    const fetchComparison = async () => {
      try {
        const res = await fetch('/api/decision-pack/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateIds }),
        })
        if (res.ok) {
          const data = await res.json()
          setCandidates(data.candidates)
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false)
      }
    }
    fetchComparison()
  }, [searchParams])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No candidates to compare. Select candidates from the search page.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

  // Build radar chart data for comparison
  const metrics = ['Innovation', 'Complexity', 'Relevance', 'Verification', 'Endorsements']
  const radarData = metrics.map((metric) => {
    const point: Record<string, unknown> = { metric }
    candidates.forEach((c, i) => {
      const name = [c.candidate.firstName, c.candidate.lastName].filter(Boolean).join(' ') || `Candidate ${i + 1}`
      const avgInnovation = c.projects.reduce((s, p) => s + (p.innovationScore || 0), 0) / Math.max(c.projects.length, 1)
      const avgComplexity = c.projects.reduce((s, p) => s + (p.complexityScore || 0), 0) / Math.max(c.projects.length, 1)
      const avgRelevance = c.projects.reduce((s, p) => s + (p.marketRelevance || 0), 0) / Math.max(c.projects.length, 1)
      const verifiedPct = c.projects.length > 0
        ? (c.trustScore.verifiedProjects / c.projects.length) * 100
        : 0
      const endorseScore = Math.min(c.trustScore.endorsementCount * 33, 100)

      const values: Record<string, number> = {
        Innovation: avgInnovation,
        Complexity: avgComplexity,
        Relevance: avgRelevance,
        Verification: verifiedPct,
        Endorsements: endorseScore,
      }
      point[name] = Math.round(values[metric] || 0)
    })
    return point
  })

  const candidateNames = candidates.map((c, i) =>
    [c.candidate.firstName, c.candidate.lastName].filter(Boolean).join(' ') || `Candidate ${i + 1}`
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Candidate Comparison
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(candidates.length, 3)} gap-4`}>
        {candidates.map((c, i) => (
          <Card key={c.candidate.id} className={`border-t-4`} style={{ borderTopColor: COLORS[i] }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: COLORS[i] }}
                >
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{candidateNames[i]}</p>
                  <p className="text-xs text-gray-500">{c.candidate.university}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Placement</span>
                  <span className="font-semibold">
                    {c.prediction ? `${Math.round(c.prediction.probability * 100)}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified Projects</span>
                  <span className="font-semibold">
                    {c.trustScore.verifiedProjects}/{c.trustScore.totalProjects}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Endorsements</span>
                  <span className="font-semibold">{c.trustScore.endorsementCount}</span>
                </div>
                {c.matchScore !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Match</span>
                    <span className="font-semibold">{c.matchScore}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Grade</span>
                  <span className="font-semibold">
                    {c.grades.length > 0
                      ? `${Math.round(
                          c.grades.reduce((s, g) => s + (g.normalizedGrade || 0), 0) /
                            c.grades.length
                        )}/100`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href={`/dashboard/recruiter/decision-pack/${c.candidate.id}`}>
                  View Full Dossier
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                {candidateNames.map((name, i) => (
                  <Radar
                    key={name}
                    name={name}
                    dataKey={name}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.15}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skills Overlap */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(candidates.length, 3)} gap-4`}>
            {candidates.map((c, i) => (
              <div key={c.candidate.id}>
                <p className="font-medium text-sm mb-2" style={{ color: COLORS[i] }}>
                  {candidateNames[i]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 10).map((s) => (
                    <Badge key={s.name} variant="secondary" className="text-xs">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
