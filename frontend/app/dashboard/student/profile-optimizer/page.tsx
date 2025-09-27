'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Upload,
  Lightbulb,
  Zap,
  Target,
  Award,
  Brain,
  FileText,
  Camera,
  Edit,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  Heart,
  MessageSquare
} from 'lucide-react'

export default function ProfileOptimizerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'cv-generator'>('overview')

  const profileScore = {
    overall: 87,
    completeness: 92,
    visibility: 84,
    engagement: 79,
    marketability: 91
  }

  const optimizationSuggestions = [
    {
      category: 'Profile Photo',
      priority: 'high',
      impact: 8.5,
      current: 'No professional photo uploaded',
      suggestion: 'Add a professional headshot to increase profile views by 40%',
      action: 'Upload Photo',
      completed: false
    },
    {
      category: 'Project Descriptions',
      priority: 'high',
      impact: 9.2,
      current: '3 projects with basic descriptions',
      suggestion: 'Enhance project descriptions with technical details and impact metrics',
      action: 'Improve Descriptions',
      completed: false
    },
    {
      category: 'Skills Keywords',
      priority: 'medium',
      impact: 7.8,
      current: '12 skills listed',
      suggestion: 'Add trending skills: TypeScript, Docker, AWS to match 73% more jobs',
      action: 'Add Skills',
      completed: true
    },
    {
      category: 'GitHub Integration',
      priority: 'medium',
      impact: 7.3,
      current: 'GitHub connected but not optimized',
      suggestion: 'Pin top repositories and add detailed README files',
      action: 'Optimize GitHub',
      completed: false
    },
    {
      category: 'Academic Achievements',
      priority: 'low',
      impact: 6.1,
      current: 'Basic GPA and courses listed',
      suggestion: 'Add honors, awards, and relevant coursework details',
      action: 'Add Achievements',
      completed: true
    }
  ]

  const cvTemplates = [
    {
      id: 'tech-modern',
      name: 'Tech Modern',
      description: 'Clean, modern design perfect for tech roles',
      matchTypes: ['Software Engineering', 'Data Science', 'Product Management'],
      popularity: 94,
      preview: '/api/cv-previews/tech-modern.png'
    },
    {
      id: 'academic-formal',
      name: 'Academic Formal',
      description: 'Traditional format ideal for research and academic positions',
      matchTypes: ['Research', 'PhD Applications', 'Academic Roles'],
      popularity: 87,
      preview: '/api/cv-previews/academic-formal.png'
    },
    {
      id: 'startup-creative',
      name: 'Startup Creative',
      description: 'Bold, creative layout for startup and design roles',
      matchTypes: ['Design', 'Marketing', 'Startup Roles'],
      popularity: 76,
      preview: '/api/cv-previews/startup-creative.png'
    }
  ]

  const profileInsights = [
    {
      metric: 'Profile Views',
      value: 247,
      change: '+23%',
      period: 'this month',
      trend: 'up'
    },
    {
      metric: 'Recruiter Interest',
      value: 18,
      change: '+45%',
      period: 'this week',
      trend: 'up'
    },
    {
      metric: 'Job Match Rate',
      value: '89%',
      change: '+12%',
      period: 'improvement',
      trend: 'up'
    },
    {
      metric: 'Response Rate',
      value: '67%',
      change: '+8%',
      period: 'this month',
      trend: 'up'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Optimizer</h1>
        <p className="text-gray-600 mt-2">
          Enhance your profile visibility and maximize your career opportunities with AI-powered insights
        </p>
      </div>

      {/* Profile Score Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Score</h2>
              <p className="text-gray-600">Based on industry standards and recruiter preferences</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(profileScore.overall)} mb-2`}>
                {profileScore.overall}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Completeness</span>
                <span className={`text-sm font-bold ${getScoreColor(profileScore.completeness)}`}>
                  {profileScore.completeness}%
                </span>
              </div>
              <Progress value={profileScore.completeness} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Visibility</span>
                <span className={`text-sm font-bold ${getScoreColor(profileScore.visibility)}`}>
                  {profileScore.visibility}%
                </span>
              </div>
              <Progress value={profileScore.visibility} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Engagement</span>
                <span className={`text-sm font-bold ${getScoreColor(profileScore.engagement)}`}>
                  {profileScore.engagement}%
                </span>
              </div>
              <Progress value={profileScore.engagement} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Marketability</span>
                <span className={`text-sm font-bold ${getScoreColor(profileScore.marketability)}`}>
                  {profileScore.marketability}%
                </span>
              </div>
              <Progress value={profileScore.marketability} className="h-2" />
            </div>
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
              <p className="text-sm text-green-600">
                {insight.change} {insight.period}
              </p>
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
          Suggestions ({optimizationSuggestions.filter(s => !s.completed).length})
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
          {/* Profile Strength Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Profile Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Strong Academic Performance</p>
                    <p className="text-sm text-gray-600">3.8 GPA from top-tier university</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Diverse Project Portfolio</p>
                    <p className="text-sm text-gray-600">5 well-documented technical projects</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Relevant Technical Skills</p>
                    <p className="text-sm text-gray-600">High-demand skills in current tech stack</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Active Community Engagement</p>
                    <p className="text-sm text-gray-600">Regular GitHub contributions and tech meetups</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add Professional Photo</p>
                    <p className="text-sm text-gray-600">Profiles with photos get 40% more views</p>
                    <Button size="sm" className="mt-2">
                      <Camera className="h-3 w-3 mr-1" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Enhance Project Details</p>
                    <p className="text-sm text-gray-600">Add impact metrics and technical depth</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Projects
                    </Button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add Trending Skills</p>
                    <p className="text-sm text-gray-600">Include TypeScript, Docker, AWS</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Skills
                    </Button>
                  </div>
                </div>
              </div>
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
                AI-Powered Optimization Suggestions
              </span>
              <Badge className="bg-blue-100 text-blue-800">
                {optimizationSuggestions.filter(s => !s.completed).length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
              {optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className={`p-6 rounded-lg border-2 ${
                  suggestion.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority.toUpperCase()}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-700">
                            +{suggestion.impact} impact score
                          </span>
                        </div>
                        {suggestion.completed && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {suggestion.category}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Current: </span>
                          <span className="text-gray-600">{suggestion.current}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Suggestion: </span>
                          <span className="text-gray-600">{suggestion.suggestion}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      {!suggestion.completed ? (
                        <Button>
                          <Zap className="h-3 w-3 mr-1" />
                          {suggestion.action}
                        </Button>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Done</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'cv-generator' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
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
                {cvTemplates.map((template, index) => (
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
                        <Button size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <Button size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Custom CV
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Let AI create a personalized CV optimized for your target role
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}