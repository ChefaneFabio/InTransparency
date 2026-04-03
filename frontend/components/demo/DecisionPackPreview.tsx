'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Shield, Star, TrendingUp } from 'lucide-react'
import type { DecisionPackData } from '@/lib/decision-pack'

interface DecisionPackPreviewProps {
  data: DecisionPackData | null
}

export default function DecisionPackPreview({ data }: DecisionPackPreviewProps) {
  if (!data) return null
  const { candidate, trustScore, skills, projects, prediction: placementPrediction } = data

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <p className="text-sm text-gray-600">{candidate.tagline}</p>
              <p className="text-sm text-primary mt-1">
                {candidate.university} — {candidate.degree}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Verified Profile</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {trustScore.verifiedProjects}/{trustScore.totalProjects} projects verified
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Verified Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.slice(0, 4).map((skill) => (
              <div key={skill.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium">{skill.name}</p>
                  <p className="text-xs text-gray-500">{skill.evidenceSources.length} evidence sources</p>
                </div>
                <Badge variant={skill.verifiedLevel === 'Advanced' ? 'default' : 'secondary'} className="text-xs">
                  {skill.verifiedLevel}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Project */}
      {projects[0] && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Top Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{projects[0].title}</p>
                  <p className="text-xs text-gray-500">Grade: {projects[0].gradeDisplay}</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary/20">
                  {projects[0].verificationStatus}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded bg-primary/5">
                  <p className="text-lg font-bold text-primary">{projects[0].innovationScore}</p>
                  <p className="text-xs text-gray-500">Innovation</p>
                </div>
                <div className="text-center p-2 rounded bg-primary/5">
                  <p className="text-lg font-bold text-primary">{projects[0].complexityScore}</p>
                  <p className="text-xs text-gray-500">Complexity</p>
                </div>
                <div className="text-center p-2 rounded bg-primary/5">
                  <p className="text-lg font-bold text-primary">{projects[0].marketRelevance}</p>
                  <p className="text-xs text-gray-500">Market Fit</p>
                </div>
              </div>
              {projects[0].endorsements[0] && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm italic text-gray-700">
                    &ldquo;{projects[0].endorsements[0].endorsementText}&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    — {projects[0].endorsements[0].professorName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placement Prediction */}
      {placementPrediction && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Placement Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-3xl font-bold text-primary">
                {Math.round(placementPrediction.probability * 100)}%
              </div>
              <Progress value={placementPrediction.probability * 100} className="flex-1" />
            </div>
            <div className="space-y-1">
              {placementPrediction.topFactors.map((f: any, i: number) => (
                <p key={i} className="text-xs text-gray-600">
                  <span className="font-medium">{f.factor}:</span> {f.description}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
