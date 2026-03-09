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
        return <RefreshCw className="h-4 w-4 animate-spin text-primary" />
      case 'analyzing':
        return <Brain className="h-4 w-4 text-primary animate-pulse" />
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-primary" />
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
          Streamlined Profile Creation (Consent-Based)
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Email invitation → Click to consent → Verified profile created. No manual CV building.
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-700">
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-primary" />
            30 seconds to complete profile
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1 text-primary" />
            100% verified data
          </div>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-primary" />
            AI-enhanced descriptions
          </div>
        </div>
      </div>

      {/* Import Card */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-6 w-6 mr-2 text-primary" />
              University Data Integration
            </div>
            {profileComplete && (
              <Badge className="bg-primary/10 text-green-800">
                Profile Complete!
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isImporting && !profileComplete ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Link className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Consent & Connect Your University Data
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  After you consent via email, we import your verified academic data: transcripts, projects, courses, skills, and achievements.
                </p>
              </div>
              <Button
                size="lg"
                onClick={startImport}
                className="bg-primary hover:bg-blue-700 text-white"
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
                          ? 'bg-primary/5 border-primary/20'
                          : section.status === 'importing'
                          ? 'bg-primary/5 border-primary/20 animate-pulse'
                          : section.status === 'analyzing'
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Icon className={`h-5 w-5 mr-2 ${
                            section.status === 'complete' ? 'text-primary' :
                            section.status === 'importing' ? 'text-primary' :
                            section.status === 'analyzing' ? 'text-primary' :
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
                <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <CheckCircle className="h-8 w-8 text-primary" />
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
                          <Brain className="h-4 w-4 mr-2 text-primary" />
                          <span>12 projects AI-analyzed</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          <span>45 skills identified</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Award className="h-4 w-4 mr-2 text-primary" />
                          <span>100% profile complete</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button className="bg-primary hover:bg-blue-700 text-white">
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
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save 15+ Hours</h4>
              <p className="text-sm text-gray-600">
                No manual data entry. Your entire academic history imported instantly.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Enhanced</h4>
              <p className="text-sm text-gray-600">
                Projects automatically analyzed and explained in professional language.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Always Current</h4>
              <p className="text-sm text-gray-600">
                Profile updates with your consent as you complete courses and projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}