'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ApplicationAssistant } from '@/components/chat/ApplicationAssistant'
import { Building2, Save, Send, ArrowLeft, CheckCircle, Clock } from 'lucide-react'

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  // Mock data - replace with actual API calls
  const [job, setJob] = useState({
    id: jobId,
    title: 'Software Engineer',
    company: 'Tech Company S.p.A.',
    location: 'Milan, Italy',
    requirements: ['Python', 'React', 'TypeScript', 'Problem Solving', 'Team Collaboration']
  })

  const [studentProfile, setStudentProfile] = useState({
    projects: [
      {
        id: 'proj_1',
        title: 'E-commerce Platform',
        skills: ['Python', 'React', 'PostgreSQL'],
        description: 'Full-stack e-commerce platform with payment integration'
      },
      {
        id: 'proj_2',
        title: 'Data Visualization Dashboard',
        skills: ['TypeScript', 'D3.js', 'React'],
        description: 'Interactive dashboard for analyzing sales data'
      },
      {
        id: 'proj_3',
        title: 'Mobile App - Fitness Tracker',
        skills: ['React Native', 'Firebase', 'Team Collaboration'],
        description: 'Collaborative project with 3 teammates'
      }
    ],
    skills: ['Python', 'React', 'TypeScript', 'JavaScript', 'Git', 'Team Collaboration'],
    courses: [
      { name: 'Advanced Programming', grade: 29 },
      { name: 'Web Development', grade: 30 },
      { name: 'Database Systems', grade: 28 }
    ]
  })

  // Form state
  const [formData, setFormData] = useState({
    selectedProjects: [] as string[],
    selectedSkills: [] as string[],
    coverLetter: '',
    whyThisRole: '',
    availability: '',
    salaryExpectation: '',
    additionalInfo: ''
  })

  const [draftId, setDraftId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load draft on mount
  useEffect(() => {
    loadDraft()
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.selectedProjects.length > 0 || formData.coverLetter || formData.whyThisRole) {
        saveDraft()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData])

  // Calculate completion percentage
  useEffect(() => {
    calculateCompletion()
  }, [formData])

  const loadDraft = async () => {
    try {
      const response = await fetch(`/api/applications/draft?studentId=student_123&jobId=${jobId}`)
      const data = await response.json()

      if (data.success && data.drafts.length > 0) {
        const draft = data.drafts[0]
        setDraftId(draft.id)
        setFormData(draft.formData)
        setCompletionPercentage(draft.completionPercentage)
        setLastSaved(new Date(draft.lastUpdated))
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }

  const saveDraft = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student_123',
          jobId,
          jobTitle: job.title,
          companyName: job.company,
          formData,
          status: 'draft'
        })
      })

      const data = await response.json()

      if (data.success) {
        setDraftId(data.draft.id)
        setCompletionPercentage(data.draft.completionPercentage)
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (completionPercentage < 80) {
      alert('Please complete at least 80% of the application before submitting')
      return
    }

    setSubmitting(true)

    try {
      // Save as submitted
      await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student_123',
          jobId,
          jobTitle: job.title,
          companyName: job.company,
          formData,
          status: 'submitted'
        })
      })

      // In production: Create actual application
      alert('Application submitted successfully!')
      router.push('/dashboard/student/applications')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const calculateCompletion = () => {
    const fields = [
      formData.selectedProjects.length > 0,
      formData.selectedSkills.length >= 3,
      formData.whyThisRole.length >= 100,
      formData.availability.length > 0,
      formData.coverLetter.length >= 200
    ]

    const completed = fields.filter(Boolean).length
    setCompletionPercentage(Math.round((completed / fields.length) * 100))
  }

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.action === 'add-project' && suggestion.data?.projectId) {
      setFormData({
        ...formData,
        selectedProjects: [...formData.selectedProjects, suggestion.data.projectId]
      })
      saveDraft()
    } else if (suggestion.action === 'auto-add-skills' && suggestion.data?.skills) {
      setFormData({
        ...formData,
        selectedSkills: Array.from(new Set([...formData.selectedSkills, ...suggestion.data.skills]))
      })
      saveDraft()
    }
  }

  const toggleProject = (projectId: string) => {
    setFormData({
      ...formData,
      selectedProjects: formData.selectedProjects.includes(projectId)
        ? formData.selectedProjects.filter(id => id !== projectId)
        : [...formData.selectedProjects, projectId]
    })
  }

  const toggleSkill = (skill: string) => {
    setFormData({
      ...formData,
      selectedSkills: formData.selectedSkills.includes(skill)
        ? formData.selectedSkills.filter(s => s !== skill)
        : [...formData.selectedSkills, skill]
    })
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-display font-bold">{job.title}</h1>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Application Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Relevant Projects</CardTitle>
                <p className="text-sm text-gray-600">Choose projects that demonstrate required skills</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentProfile.projects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => toggleProject(project.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.selectedProjects.includes(project.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {formData.selectedProjects.includes(project.id) && (
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Highlight Your Skills</CardTitle>
                <p className="text-sm text-gray-600">Select at least 3 relevant skills (recommended: 5-7)</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills.map(skill => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`cursor-pointer transition-all ${
                        formData.selectedSkills.includes(skill)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                      {formData.selectedSkills.includes(skill) && (
                        <CheckCircle className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why This Role */}
            <Card>
              <CardHeader>
                <CardTitle>Why This Role?</CardTitle>
                <p className="text-sm text-gray-600">Explain your interest (100-300 words)</p>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.whyThisRole}
                  onChange={(e) => setFormData({ ...formData, whyThisRole: e.target.value })}
                  placeholder="Example: I'm excited about this role because..."
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.whyThisRole.length} / 300 characters
                </p>
              </CardContent>
            </Card>

            {/* Cover Letter (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter <span className="text-gray-400 text-sm font-normal">(Optional)</span></CardTitle>
                <p className="text-sm text-gray-600">Personalized message to the hiring team</p>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Dear Hiring Team,..."
                  className="w-full h-40 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.coverLetter.length} characters
                </p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <p className="text-sm text-gray-600">When can you start?</p>
              </CardHeader>
              <CardContent>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select availability</option>
                  <option value="immediately">Immediately</option>
                  <option value="2-weeks">2 weeks notice</option>
                  <option value="1-month">1 month</option>
                  <option value="after-graduation">After graduation</option>
                </select>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={saveDraft}
                disabled={saving}
                variant="outline"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting || completionPercentage < 80}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>

            {completionPercentage < 80 && (
              <p className="text-sm text-center text-yellow-600">
                Complete at least 80% to submit ({Math.max(0, 80 - completionPercentage)}% remaining)
              </p>
            )}
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <ApplicationAssistant
              jobId={jobId}
              jobTitle={job.title}
              jobRequirements={job.requirements}
              studentProfile={studentProfile}
              currentFormData={formData}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
