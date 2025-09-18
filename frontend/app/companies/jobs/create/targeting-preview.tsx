'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, GraduationCap, Users, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface TargetingPreviewProps {
  jobRequirements: {
    fieldsOfStudy: string[]
    requiredCourses: string[]
    projectExperience: string[]
    skills: string[]
  }
  location: string
  remoteOptions: string
}

export const TargetingPreview = ({ jobRequirements, location, remoteOptions }: TargetingPreviewProps) => {
  const [targeting, setTargeting] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Simulate targeting calculation
  useEffect(() => {
    if (jobRequirements.fieldsOfStudy.length > 0 || jobRequirements.requiredCourses.length > 0) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockTargeting = calculateMockTargeting(jobRequirements, location, remoteOptions)
        setTargeting(mockTargeting)
        setLoading(false)
      }, 1000)
    }
  }, [jobRequirements, location, remoteOptions])

  if (!targeting && !loading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Add academic requirements to see targeting preview
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Calculating targeting...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Targeting Overview */}
      <Card className={`border-l-4 ${
        targeting.totalReach > 100 ? 'border-l-green-500' : 
        targeting.totalReach > 50 ? 'border-l-yellow-500' : 'border-l-red-500'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Precision Targeting Results
          </CardTitle>
          <CardDescription>
            Only students with relevant academic background and geographic feasibility will see this job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-3xl font-bold ${
                targeting.totalReach > 100 ? 'text-green-600' : 
                targeting.totalReach > 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {targeting.totalReach}
              </div>
              <div className="text-sm text-gray-600">Qualified Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(targeting.averageMatchScore)}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {targeting.perfectMatches}
              </div>
              <div className="text-sm text-gray-600">Perfect Matches</div>
            </div>
          </div>
          
          {targeting.totalReach < 50 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Low reach detected.</strong> Consider broadening requirements or offering remote options to reach more qualified candidates.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(targeting.geographicBreakdown).map(([area, count]) => (
              <div key={area} className="flex items-center justify-between">
                <span className="text-sm font-medium">{area}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(Number(count) / targeting.totalReach) * 100} className="w-20 h-2" />
                  <span className="text-sm w-8">{String(count)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* University Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Target Universities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(targeting.universityBreakdown).map(([university, count]) => (
              <div key={university} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-sm">{university}</span>
                <Badge variant="secondary">{String(count)} students</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Program Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Programs Reached</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(targeting.programBreakdown).map(([program, count]) => (
              <div key={program} className="flex justify-between items-center">
                <span className="text-sm">{program}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(Number(count) / targeting.totalReach) * 100} className="w-16 h-2" />
                  <span className="text-sm w-6">{String(count)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Matching Candidates Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Matching Candidates (Preview)
          </CardTitle>
          <CardDescription>
            These students would see your job posting immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {targeting.topMatches.map((candidate: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{candidate.name}</div>
                  <div className="text-sm text-gray-600">
                    {candidate.degree} at {candidate.university}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">
                    {candidate.matchScore}% match
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {candidate.distance}km away
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      {targeting.suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {targeting.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Mock targeting calculation for demo
function calculateMockTargeting(requirements: any, location: string, remoteOptions: string) {
  // Simulate realistic targeting numbers based on requirements
  let baseReach = 200
  
  // Reduce reach based on specificity
  if (requirements.fieldsOfStudy.length > 0) baseReach *= 0.6
  if (requirements.requiredCourses.length > 2) baseReach *= 0.7
  if (requirements.projectExperience.length > 1) baseReach *= 0.8
  if (location && location !== 'Remote') baseReach *= 0.4
  if (remoteOptions === 'none') baseReach *= 0.6
  
  const totalReach = Math.max(Math.round(baseReach), 15)
  
  return {
    totalReach,
    averageMatchScore: 78 + Math.random() * 15,
    perfectMatches: Math.max(Math.round(totalReach * 0.15), 3),
    
    geographicBreakdown: location === 'Milano' ? {
      'Milano City (0-20km)': Math.round(totalReach * 0.4),
      'Milano Metro (20-50km)': Math.round(totalReach * 0.3),
      'Lombardy (50-100km)': Math.round(totalReach * 0.2),
      'Willing to relocate': Math.round(totalReach * 0.1)
    } : {
      'Local area (0-30km)': Math.round(totalReach * 0.6),
      'Regional (30-100km)': Math.round(totalReach * 0.25),
      'Willing to relocate': Math.round(totalReach * 0.15)
    },
    
    universityBreakdown: location === 'Milano' ? {
      'Politecnico di Milano': Math.round(totalReach * 0.35),
      'Bocconi University': Math.round(totalReach * 0.25),
      'Università Statale': Math.round(totalReach * 0.2),
      'Other Universities': Math.round(totalReach * 0.2)
    } : {
      'Local University': Math.round(totalReach * 0.5),
      'Regional Universities': Math.round(totalReach * 0.3),
      'Other Universities': Math.round(totalReach * 0.2)
    },
    
    programBreakdown: requirements.fieldsOfStudy.length > 0 ? 
      requirements.fieldsOfStudy.reduce((acc: any, field: string) => {
        acc[field] = Math.round(totalReach * (0.3 + Math.random() * 0.4))
        return acc
      }, {}) : {
        'Computer Science': Math.round(totalReach * 0.4),
        'Engineering': Math.round(totalReach * 0.3),
        'Related Programs': Math.round(totalReach * 0.3)
      },
    
    topMatches: [
      { name: 'Sofia R.', degree: 'Computer Engineering', university: 'Politecnico Milano', matchScore: 95, distance: 12 },
      { name: 'Marco B.', degree: 'Software Engineering', university: 'Politecnico Milano', matchScore: 92, distance: 8 },
      { name: 'Elena G.', degree: 'Computer Science', university: 'Bocconi', matchScore: 88, distance: 15 },
      { name: 'Luca M.', degree: 'Data Science', university: 'Statale', matchScore: 85, distance: 22 },
      { name: 'Anna C.', degree: 'Computer Engineering', university: 'Politecnico Milano', matchScore: 83, distance: 18 }
    ],
    
    suggestions: totalReach < 50 ? [
      'Consider adding "or equivalent experience" to broaden reach',
      'Offer hybrid/remote options to access talent from other cities',
      'Include related degree programs (e.g., Mathematics for CS roles)'
    ] : totalReach > 200 ? [
      'Requirements are well-balanced for good reach',
      'Consider adding specific technical skills to improve match quality'
    ] : [
      'Good targeting balance between reach and specificity',
      'Monitor application quality and adjust requirements if needed'
    ]
  }
}

export default TargetingPreview