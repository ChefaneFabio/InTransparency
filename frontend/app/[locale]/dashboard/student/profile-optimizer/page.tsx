'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Lightbulb,
  Zap,
  Target,
  Brain,
  FileText,
  Camera,
  Edit,
  Plus,
  ArrowRight,
  BarChart3,
} from 'lucide-react'

interface ProfileData {
  user: any
  skills: { name: string; level: number; projectCount: number }[]
  stats: {
    profileViews: number
    recruiterViews: number
    totalApplications: number
    totalProjects: number
  }
  profileCompletion: number
  completionItems: { field: string; label: string; filled: boolean }[]
  projects: any[]
  githubUrl: string | null
}

export default function ProfileOptimizerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'cv-generator'>('overview')
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const cvTemplates = [
    {
      id: 'tech-modern',
      name: 'Tech Modern',
      description: 'Clean, modern design perfect for tech roles',
      matchTypes: ['Software Engineering', 'Data Science', 'Product Management'],
      popularity: 94,
    },
    {
      id: 'academic-formal',
      name: 'Academic Formal',
      description: 'Traditional format ideal for research and academic positions',
      matchTypes: ['Research', 'PhD Applications', 'Academic Roles'],
      popularity: 87,
    },
    {
      id: 'startup-creative',
      name: 'Startup Creative',
      description: 'Bold, creative layout for startup and design roles',
      matchTypes: ['Design', 'Marketing', 'Startup Roles'],
      popularity: 76,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Failed to load profile data'}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { profileCompletion, completionItems, stats, skills, projects } = data

  // Derive sub-scores from real data
  const completeness = profileCompletion
  const visibility = data.user.profilePublic ? Math.min(100, 60 + (stats.profileViews > 0 ? 20 : 0) + (skills.length > 3 ? 20 : 0)) : 30
  const engagement = Math.min(100, (stats.totalApplications > 0 ? 30 : 0) + (stats.totalProjects > 0 ? 30 : 0) + (stats.profileViews > 10 ? 20 : 0) + (skills.length > 5 ? 20 : 0))
  const marketability = Math.min(100, (skills.length > 0 ? 30 : 0) + (projects.length >= 3 ? 30 : 0) + (data.user.bio ? 20 : 0) + (data.user.tagline ? 20 : 0))

  // Derive suggestions from unfilled completion items
  const suggestionMap: Record<string, { priority: string; impact: number; suggestion: string; action: string }> = {
    photo: { priority: 'high', impact: 8.5, suggestion: 'Add a professional headshot to increase profile views by 40%', action: 'Upload Photo' },
    bio: { priority: 'high', impact: 9.0, suggestion: 'Write a compelling bio to help recruiters understand your goals', action: 'Add Bio' },
    tagline: { priority: 'medium', impact: 7.5, suggestion: 'Add a short tagline that summarizes your professional identity', action: 'Add Tagline' },
    university: { priority: 'medium', impact: 7.0, suggestion: 'Specify your university to improve matching with relevant employers', action: 'Add University' },
    degree: { priority: 'medium', impact: 6.8, suggestion: 'Add your degree program to help recruiters assess fit', action: 'Add Degree' },
    graduationYear: { priority: 'low', impact: 6.0, suggestion: 'Add graduation year so recruiters know your availability', action: 'Add Year' },
    gpa: { priority: 'low', impact: 5.5, suggestion: 'Adding your GPA can strengthen your profile for academic roles', action: 'Add GPA' },
    projects: { priority: 'high', impact: 9.2, suggestion: 'Upload at least one project to showcase your skills to recruiters', action: 'Add Project' },
    firstName: { priority: 'high', impact: 8.0, suggestion: 'Add your first name for recruiters to address you properly', action: 'Add Name' },
    lastName: { priority: 'high', impact: 8.0, suggestion: 'Add your last name to complete your profile identity', action: 'Add Name' },
  }

  const suggestions = completionItems
    .filter((item) => !item.filled && suggestionMap[item.field])
    .map((item) => ({
      field: item.field,
      label: item.label,
      completed: false,
      ...suggestionMap[item.field],
    }))
    .sort((a, b) => b.impact - a.impact)

  // Derive strengths from filled completion items
  const strengths = completionItems
    .filter((item) => item.filled)
    .map((item) => item.label)

  const profileInsights = [
    { metric: 'Profile Views', value: stats.profileViews, subtitle: 'Last 30 days' },
    { metric: 'Recruiter Views', value: stats.recruiterViews, subtitle: 'Last 30 days' },
    { metric: 'Applications', value: stats.totalApplications, subtitle: 'Total submitted' },
    { metric: 'Projects', value: stats.totalProjects, subtitle: 'In portfolio' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Optimizer</h1>
        <p className="text-gray-600 mt-2">
          Enhance your profile visibility and maximize your career opportunities
        </p>
      </div>

      {/* Profile Score Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Score</h2>
              <p className="text-gray-600">Based on your profile completeness and engagement</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(profileCompletion)} mb-2`}>
                {profileCompletion}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Completeness', value: completeness },
              { label: 'Visibility', value: visibility },
              { label: 'Engagement', value: engagement },
              { label: 'Marketability', value: marketability },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className={`text-sm font-bold ${getScoreColor(item.value)}`}>
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {profileInsights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{insight.metric}</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</p>
              <p className="text-sm text-gray-500">{insight.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-2 inline" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4 mr-2 inline" />
          Suggestions ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab('cv-generator')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'cv-generator'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 mr-2 inline" />
          AI CV Generator
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Profile Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strengths.length === 0 ? (
                <p className="text-gray-500 text-sm">Complete your profile to see your strengths here.</p>
              ) : (
                <div className="space-y-4">
                  {strengths.map((label) => (
                    <div key={label} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                    </div>
                  ))}
                  {skills.length > 0 && (
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Technical Skills ({skills.length})</p>
                        <p className="text-sm text-gray-600">
                          Top: {skills.slice(0, 3).map((s) => s.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">Profile is complete!</p>
                  <p className="text-sm text-gray-600">Great job! Your profile has all key fields filled in.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={suggestion.field} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                        idx === 0 ? 'bg-red-100' : idx === 1 ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <span className={`font-bold text-sm ${
                          idx === 0 ? 'text-red-600' : idx === 1 ? 'text-yellow-600' : 'text-blue-600'
                        }`}>{idx + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{suggestion.label}</p>
                        <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Optimization Suggestions
              </span>
              <Badge className="bg-blue-100 text-blue-800">
                {suggestions.length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Done!</h3>
                <p className="text-gray-600">Your profile is fully optimized. Keep your projects and skills up to date!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.field} className="p-6 rounded-lg border-2 border-gray-200 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                            suggestion.priority === 'medium' ? 'bg-yellow-400 text-gray-900' :
                            'bg-green-100 text-green-800'
                          }>
                            {suggestion.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700">
                            +{suggestion.impact} impact score
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{suggestion.label}</h3>
                        <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
                      </div>
                      <div className="ml-6">
                        <Button>
                          <Zap className="h-3 w-3 mr-1" />
                          {suggestion.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'cv-generator' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered CV Generator
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Generate tailored CVs for different job types using your profile data and AI optimization
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-blue-900">Smart CV Generation</p>
                    <p className="text-sm text-blue-700">
                      Our AI analyzes job requirements and optimizes your CV for maximum impact
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cvTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-600" />
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Popularity</span>
                          <span className="text-sm font-medium text-gray-900">{template.popularity}%</span>
                        </div>
                        <Progress value={template.popularity} className="h-1" />
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-700">Best for:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.matchTypes.map((type, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="flex-1" disabled>
                          <Download className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <Button size="lg" disabled>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Custom CV
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Coming Soon — AI-powered CV generation based on your profile data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
