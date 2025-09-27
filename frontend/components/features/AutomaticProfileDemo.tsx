'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Database,
  CheckCircle,
  User,
  FileText,
  Code,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Shield,
  RefreshCw,
  TrendingUp,
  Brain,
  Link,
  Download
} from 'lucide-react'

interface ProfileSection {
  id: string
  name: string
  icon: any
  items: number
  status: 'pending' | 'importing' | 'analyzing' | 'complete'
}

export function AutomaticProfileDemo() {
  const [isImporting, setIsImporting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [profileComplete, setProfileComplete] = useState(false)
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    { id: 'personal', name: 'Personal Information', icon: User, items: 5, status: 'pending' },
    { id: 'education', name: 'Academic Records', icon: GraduationCap, items: 48, status: 'pending' },
    { id: 'projects', name: 'Projects & Research', icon: Code, items: 12, status: 'pending' },
    { id: 'courses', name: 'Coursework', icon: BookOpen, items: 32, status: 'pending' },
    { id: 'skills', name: 'Skills & Competencies', icon: Briefcase, items: 45, status: 'pending' },
    { id: 'achievements', name: 'Awards & Certifications', icon: Award, items: 8, status: 'pending' },
  ])

  const totalItems = profileSections.reduce((sum, section) => sum + section.items, 0)
  const [itemsImported, setItemsImported] = useState(0)

  const startImport = () => {
    setIsImporting(true)
    setCurrentStep(0)
    setProfileComplete(false)
    setItemsImported(0)

    // Simulate progressive import
    profileSections.forEach((section, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
        setProfileSections(prev =>
          prev.map((s, i) => ({
            ...s,
            status: i < index ? 'complete' : i === index ? 'importing' : 'pending'
          }))
        )

        // Animate item counter
        let imported = 0
        const increment = section.items / 20
        const timer = setInterval(() => {
          imported += increment
          if (imported >= section.items) {
            imported = section.items
            clearInterval(timer)

            // Mark as analyzing
            setTimeout(() => {
              setProfileSections(prev =>
                prev.map((s, i) => ({
                  ...s,
                  status: i === index ? 'analyzing' : s.status
                }))
              )

              // Mark as complete
              setTimeout(() => {
                setProfileSections(prev =>
                  prev.map((s, i) => ({
                    ...s,
                    status: i === index ? 'complete' : s.status
                  }))
                )

                if (index === profileSections.length - 1) {
                  setTimeout(() => {
                    setIsImporting(false)
                    setProfileComplete(true)
                  }, 500)
                }
              }, 800)
            }, 400)
          }

          setItemsImported(prev => Math.min(prev + increment, totalItems))
        }, 50)
      }, index * 2000)
    })
  }

  const getStatusIcon = (status: ProfileSection['status']) => {
    switch (status) {
      case 'importing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      case 'analyzing':
        return <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: ProfileSection['status']) => {
    switch (status) {
      case 'importing':
        return 'Importing...'
      case 'analyzing':
        return 'AI Analyzing...'
      case 'complete':
        return 'Complete'
      default:
        return 'Waiting'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Automatic Profile Creation
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          No manual CV building. No data entry. Just connect and go.
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-700">
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-yellow-500" />
            30 seconds to complete profile
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1 text-green-500" />
            100% verified data
          </div>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
            AI-enhanced descriptions
          </div>
        </div>
      </div>

      {/* Import Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-6 w-6 mr-2 text-blue-600" />
              University Data Integration
            </div>
            {profileComplete && (
              <Badge className="bg-green-100 text-green-800">
                Profile Complete!
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isImporting && !profileComplete ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Link className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Connect Your University Account
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  One click imports all your academic data: transcripts, projects, courses, skills, and achievements.
                </p>
              </div>
              <Button
                size="lg"
                onClick={startImport}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Database className="h-5 w-5 mr-2" />
                Connect University & Import Data
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-700 mt-3">
                Demo: Simulates importing {totalItems} data points from university systems
              </p>
            </div>
          ) : (
            <>
              {/* Progress Overview */}
              {isImporting && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Importing Profile Data
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(itemsImported)} of {totalItems} items
                    </span>
                  </div>
                  <Progress value={(itemsImported / totalItems) * 100} className="h-3" />
                  <div className="flex items-center text-sm text-gray-600">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Analyzing with AI to create professional descriptions...
                  </div>
                </div>
              )}

              {/* Section Status */}
              <div className="grid md:grid-cols-2 gap-4">
                {(profileSections || []).map((section) => {
                  const Icon = section.icon
                  return (
                    <div
                      key={section.id}
                      className={`p-4 rounded-lg border transition-all ${
                        section.status === 'complete'
                          ? 'bg-green-50 border-green-200'
                          : section.status === 'importing'
                          ? 'bg-blue-50 border-blue-200 animate-pulse'
                          : section.status === 'analyzing'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Icon className={`h-5 w-5 mr-2 ${
                            section.status === 'complete' ? 'text-green-600' :
                            section.status === 'importing' ? 'text-blue-600' :
                            section.status === 'analyzing' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{section.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {section.items} items
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs">
                          {getStatusIcon(section.status)}
                          <span className="ml-1">{getStatusText(section.status)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Completion Summary */}
              {profileComplete && (
                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Profile Successfully Created!
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <FileText className="h-4 w-4 mr-2 text-gray-700" />
                          <span>{totalItems} data points imported</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Brain className="h-4 w-4 mr-2 text-purple-500" />
                          <span>12 projects AI-analyzed</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                          <span>45 skills identified</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Award className="h-4 w-4 mr-2 text-yellow-500" />
                          <span>100% profile complete</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Profile
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export as CV
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save 15+ Hours</h4>
              <p className="text-sm text-gray-600">
                No manual data entry. Your entire academic history imported instantly.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Enhanced</h4>
              <p className="text-sm text-gray-600">
                Projects automatically analyzed and explained in professional language.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Always Current</h4>
              <p className="text-sm text-gray-600">
                Profile automatically updates as you complete courses and projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}