'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  Download,
  Shield,
  Target,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

interface DecisionPackData {
  candidate: {
    id: string
    firstName: string | null
    lastName: string | null
    university: string | null
    degree: string | null
    country: string
    tagline: string | null
  }
  trustScore: {
    verifiedProjects: number
    totalProjects: number
    endorsementCount: number
    universityVerified: boolean
  }
  skills: Array<{
    name: string
    industryTerms: string[]
    evidenceSources: string[]
    verifiedLevel: string
  }>
  projects: Array<{
    id: string
    title: string
    discipline: string
    grade: string | null
    normalizedGrade: number | null
    innovationScore: number | null
    complexityScore: number | null
    marketRelevance: number | null
    verificationStatus: string
    skills: string[]
    endorsements: Array<{
      professorName: string
      rating: number | null
      endorsementText: string | null
    }>
  }>
  grades: Array<{
    projectTitle: string
    originalGrade: string
    country: string
    normalizedGrade: number | null
    displayInCountry: Record<string, string>
  }>
  prediction: {
    probability: number
    topFactors: Array<{ factor: string; impact: number; description: string }>
  } | null
  matchScore: number | null
  generatedAt: string
}

export default function DecisionPackPage() {
  const params = useParams()
  const candidateId = params.candidateId as string
  const [data, setData] = useState<DecisionPackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const res = await fetch(`/api/decision-pack/${candidateId}`)
        if (!res.ok) {
          const err = await res.json()
          setError(err.error || 'Failed to load decision pack')
          return
        }
        setData(await res.json())
      } catch {
        setError('Failed to load decision pack')
      } finally {
        setLoading(false)
      }
    }
    fetchPack()
  }, [candidateId])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {error === 'Contact access required. Purchase a contact credit first.'
            ? 'Contact Access Required'
            : 'Error'}
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

  // Build radar chart data from top projects
  const radarData = data.projects.slice(0, 5).map((p) => ({
    project: p.title.length > 20 ? p.title.substring(0, 17) + '...' : p.title,
    innovation: p.innovationScore || 0,
    complexity: p.complexityScore || 0,
    relevance: p.marketRelevance || 0,
  }))

  const fullName = [data.candidate.firstName, data.candidate.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/api/decision-pack/${candidateId}/pdf`} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      {/* Candidate Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                {data.candidate.university && (
                  <p className="text-gray-600">{data.candidate.university}</p>
                )}
                {data.candidate.degree && (
                  <p className="text-gray-500 text-sm">{data.candidate.degree}</p>
                )}
                {data.candidate.tagline && (
                  <p className="text-gray-700 mt-1">{data.candidate.tagline}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {data.prediction && (
                <Badge
                  className={`text-lg px-3 py-1 ${
                    data.prediction.probability >= 0.75
                      ? 'bg-primary/10 text-green-700'
                      : data.prediction.probability >= 0.5
                      ? 'bg-primary/10 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {Math.round(data.prediction.probability * 100)}% placement
                </Badge>
              )}
              {data.matchScore !== null && (
                <Badge variant="outline">
                  <Target className="mr-1 h-3 w-3" />
                  {data.matchScore}% job match
                </Badge>
              )}
              {data.trustScore.universityVerified && (
                <Badge className="bg-primary/10 text-green-700">
                  <Shield className="mr-1 h-3 w-3" />
                  University Verified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Evidence Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            Skills Evidence Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">Skill</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">Industry Terms</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">Evidence</th>
                  <th className="text-left py-2 font-medium text-gray-600">Level</th>
                </tr>
              </thead>
              <tbody>
                {data.skills.slice(0, 15).map((skill, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-900">{skill.name}</td>
                    <td className="py-2 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {skill.industryTerms.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {skill.evidenceSources.slice(0, 2).join(', ')}
                    </td>
                    <td className="py-2">
                      <Badge
                        variant={skill.verifiedLevel === 'Institution Verified' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {skill.verifiedLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Radar Chart */}
      {radarData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Analysis Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="project" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Innovation" dataKey="innovation" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  <Radar name="Complexity" dataKey="complexity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Radar name="Relevance" dataKey="relevance" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professor Endorsements */}
      {data.projects.some((p) => p.endorsements.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Professor Endorsements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.projects
              .flatMap((p) =>
                p.endorsements.map((e) => ({ ...e, projectTitle: p.title }))
              )
              .map((e, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{e.professorName}</p>
                      <p className="text-xs text-gray-500">for: {e.projectTitle}</p>
                    </div>
                    {e.rating && <Badge>{e.rating}/5</Badge>}
                  </div>
                  {e.endorsementText && (
                    <p className="text-sm text-gray-700 mt-1">{e.endorsementText}</p>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Grade Provenance */}
      {data.grades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Grade Provenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-gray-600">Project</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-600">Original</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-600">Normalized</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-600">IT</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-600">DE</th>
                    <th className="text-left py-2 font-medium text-gray-600">UK</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grades.map((g, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-900">{g.projectTitle}</td>
                      <td className="py-2 pr-4">{g.originalGrade} ({g.country})</td>
                      <td className="py-2 pr-4 font-semibold">
                        {g.normalizedGrade !== null ? `${g.normalizedGrade}/100` : '-'}
                      </td>
                      <td className="py-2 pr-4">{g.displayInCountry.IT || '-'}</td>
                      <td className="py-2 pr-4">{g.displayInCountry.DE || '-'}</td>
                      <td className="py-2">{g.displayInCountry.UK || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Walkthroughs */}
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio ({data.projects.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.projects.map((p) => (
            <div key={p.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{p.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {p.discipline.replace(/_/g, ' ')}
                    </Badge>
                    {p.verificationStatus === 'VERIFIED' && (
                      <Badge className="bg-primary/10 text-green-700 text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm">
                  {p.innovationScore !== null && (
                    <div className="text-gray-600">
                      Innovation: <span className="font-semibold">{p.innovationScore}</span>
                    </div>
                  )}
                </div>
              </div>
              {p.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.skills.slice(0, 6).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Prediction Factors */}
      {data.prediction && data.prediction.topFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Placement Probability Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.prediction.topFactors.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    f.impact > 0 ? 'bg-primary/50' : 'bg-red-400'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{f.description}</p>
                </div>
                <span className={`text-sm font-medium ${
                  f.impact > 0 ? 'text-primary' : 'text-red-500'
                }`}>
                  {f.impact > 0 ? '+' : ''}{f.impact}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
