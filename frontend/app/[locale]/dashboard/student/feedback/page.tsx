'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FeedbackDisplay } from '@/components/feedback/FeedbackDisplay'
import { MessageSquare, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react'
import { CompanyFeedback } from '@/app/api/feedback/company-to-student/route'

export default function StudentFeedbackPage() {
  const [feedback, setFeedback] = useState<CompanyFeedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback/company-to-student')
        const data = await response.json()

        if (data.success) {
          setFeedback(data.feedback)
        }
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [])

  // Calculate statistics
  const totalFeedback = feedback.length
  const skillsEvaluated = feedback.reduce((acc, f) =>
    acc + (f.skillsDemonstrated?.length || 0), 0
  )
  const areasForGrowth = feedback.reduce((acc, f) =>
    acc + (f.areasForGrowth?.length || 0), 0
  )

  // Get most common skills mentioned
  const allSkills = feedback.flatMap(f => f.skillsDemonstrated || [])
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill.skill] = (acc[skill.skill] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">Institutional Feedback</h1>
          </div>
          <p className="text-gray-600">
            Learn from every interaction with verified career insights from companies
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Feedback
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalFeedback}</div>
              <p className="text-xs text-gray-600 mt-1">
                {totalFeedback === 0 ? 'Apply to jobs to receive feedback' : 'From interview experiences'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Skills Evaluated
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{skillsEvaluated}</div>
              <p className="text-xs text-gray-600 mt-1">
                {skillsEvaluated === 0 ? 'No skills evaluated yet' : 'Verified through interviews'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Growth Opportunities
                </CardTitle>
                <Lightbulb className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{areasForGrowth}</div>
              <p className="text-xs text-gray-600 mt-1">
                {areasForGrowth === 0 ? 'No recommendations yet' : 'Actionable insights'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Skills Summary */}
        {topSkills.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Your Most Evaluated Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topSkills.map(([skill, count]) => (
                  <Badge key={skill} className="bg-primary/10 text-primary px-4 py-2">
                    {skill} <span className="ml-2 text-xs">({count} {count === 1 ? 'time' : 'times'})</span>
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                These skills were most frequently recognized by companies during your interviews
              </p>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">How Institutional Feedback Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
                  <strong>After Interviews</strong>
                </div>
                <p className="text-gray-600">Companies provide structured feedback on skills, performance, and growth areas</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</span>
                  <strong>Shared Visibility</strong>
                </div>
                <p className="text-gray-600">You and your career center receive the feedback to help you improve professionally</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</span>
                  <strong>Continuous Growth</strong>
                </div>
                <p className="text-gray-600">Use insights to refine skills, update projects, and ace future interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Feedback History</h2>
          <FeedbackDisplay feedback={feedback} />
        </div>
      </div>
    </div>
  )
}
