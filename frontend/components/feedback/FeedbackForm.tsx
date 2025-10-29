'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, TrendingUp, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

interface Skill {
  skill: string
  rating: 'not-assessed' | 'developing' | 'proficient' | 'advanced'
  notes: string
}

interface FeedbackFormProps {
  applicationId: string
  studentName: string
  position: string
  companyId: string
  studentId: string
  onSubmitSuccess?: () => void
}

export function FeedbackForm({
  applicationId,
  studentName,
  position,
  companyId,
  studentId,
  onSubmitSuccess
}: FeedbackFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [skills, setSkills] = useState<Skill[]>([
    { skill: '', rating: 'not-assessed', notes: '' }
  ])
  const [areasForGrowth, setAreasForGrowth] = useState([''])
  const [interviewPerformance, setInterviewPerformance] = useState({
    communication: 'good' as const,
    technicalKnowledge: 'good' as const,
    problemSolving: 'good' as const,
    culturalFit: 'good' as const
  })
  const [constructiveFeedback, setConstructiveFeedback] = useState('')
  const [recommendations, setRecommendations] = useState('')

  const addSkillRow = () => {
    setSkills([...skills, { skill: '', rating: 'not-assessed', notes: '' }])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    setSkills(updated)
  }

  const addGrowthArea = () => {
    setAreasForGrowth([...areasForGrowth, ''])
  }

  const updateGrowthArea = (index: number, value: string) => {
    const updated = [...areasForGrowth]
    updated[index] = value
    setAreasForGrowth(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty skills and growth areas
      const validSkills = skills.filter(s => s.skill.trim() !== '')
      const validGrowthAreas = areasForGrowth.filter(a => a.trim() !== '')

      const response = await fetch('/api/feedback/company-to-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          companyId,
          studentId,
          skillsDemonstrated: validSkills,
          areasForGrowth: validGrowthAreas,
          interviewPerformance,
          constructiveFeedback,
          recommendationsForStudent: recommendations,
          positionTitle: position,
          visibleToStudent: true,
          visibleToInstitution: true,
          sharedWithCareerCenter: true
        })
      })

      if (response.ok) {
        setSuccess(true)
        onSubmitSuccess?.()
      } else {
        alert('Failed to submit feedback. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-green-50 border-2 border-green-300">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">Feedback Submitted!</h3>
          <p className="text-gray-700">
            Your institutional feedback has been shared with {studentName} and their career center.
            This helps students grow and improves academic-industry alignment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Institutional Feedback Form</CardTitle>
          </div>
          <p className="text-gray-600">
            Provide constructive feedback for <strong>{studentName}</strong> - {position}
          </p>
          <Badge className="mt-2 bg-primary/10 text-primary">
            Shared with student + institution career center
          </Badge>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Skills Demonstrated */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Skills Demonstrated in Interview</h3>
            </div>

            {skills.map((skill, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g., Python, Communication)"
                  value={skill.skill}
                  onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={skill.rating}
                  onChange={(e) => updateSkill(index, 'rating', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="not-assessed">Not Assessed</option>
                  <option value="developing">Developing</option>
                  <option value="proficient">Proficient</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  type="text"
                  placeholder="Brief note (optional)"
                  value={skill.notes}
                  onChange={(e) => updateSkill(index, 'notes', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSkillRow}
              className="mt-2"
            >
              + Add Another Skill
            </Button>
          </div>

          {/* Interview Performance */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Interview Performance</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {(['communication', 'technicalKnowledge', 'problemSolving', 'culturalFit'] as const).map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {category.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <select
                    value={interviewPerformance[category]}
                    onChange={(e) => setInterviewPerformance({
                      ...interviewPerformance,
                      [category]: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="not-assessed">Not Assessed</option>
                    <option value="needs-improvement">Needs Improvement</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Growth */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold">Areas for Growth</h3>
            </div>

            {areasForGrowth.map((area, index) => (
              <input
                key={index}
                type="text"
                placeholder="e.g., Add AWS experience for cloud roles"
                value={area}
                onChange={(e) => updateGrowthArea(index, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGrowthArea}
              className="mt-2"
            >
              + Add Another Area
            </Button>
          </div>

          {/* Constructive Feedback (Required) */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Constructive Feedback <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Help the student understand their performance and what they can improve
            </p>
            <textarea
              required
              value={constructiveFeedback}
              onChange={(e) => setConstructiveFeedback(e.target.value)}
              placeholder="Example: Strong Python skills demonstrated in technical assessment. Consider adding AWS experience for cloud engineering roles. Communication was clear and professional throughout."
              className="w-full px-3 py-2 border rounded-lg h-32"
              minLength={50}
            />
          </div>

          {/* Recommendations (Optional) */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Recommendations for Student
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Suggest specific actions, courses, or experiences
            </p>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Example: Consider taking an AWS certification course. Practice system design interviews. Continue building projects that showcase distributed systems knowledge."
              className="w-full px-3 py-2 border rounded-lg h-24"
            />
          </div>

          {/* Submit */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong className="text-blue-900">Institutional Feedback Loop:</strong> Your feedback helps
                students improve and provides valuable market insights to career centers. All feedback is
                constructive and focused on growth.
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !constructiveFeedback.trim()}
            className="w-full bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            {loading ? 'Submitting...' : 'Submit Institutional Feedback'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
