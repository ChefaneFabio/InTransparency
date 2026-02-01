'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2 } from 'lucide-react'

interface ChallengeFormData {
  title: string
  description: string
  problemStatement: string
  expectedOutcome: string
  challengeType: string
  discipline: string
  requiredSkills: string[]
  tools: string[]
  teamSizeMin: number
  teamSizeMax: number
  estimatedDuration: string
  startDate: string
  endDate: string
  applicationDeadline: string
  targetCourses: string[]
  targetSemesters: string[]
  creditWorth: number | null
  targetUniversities: string[]
  maxSubmissions: number
  mentorshipOffered: boolean
  compensation: string
  equipmentProvided: string
  companyName: string
  companyLogo: string
  companyIndustry: string
}

interface ChallengeFormProps {
  initialData?: Partial<ChallengeFormData>
  challengeId?: string
  mode?: 'create' | 'edit'
}

const challengeTypes = [
  { value: 'CAPSTONE', label: 'Capstone Project' },
  { value: 'INTERNSHIP', label: 'Internship Project' },
  { value: 'COURSE_PROJECT', label: 'Course Project' },
  { value: 'THESIS', label: 'Thesis / Dissertation' },
  { value: 'HACKATHON', label: 'Hackathon' },
  { value: 'RESEARCH', label: 'Research Project' }
]

const disciplines = [
  { value: 'TECHNOLOGY', label: 'Technology & Software' },
  { value: 'BUSINESS', label: 'Business & Finance' },
  { value: 'DESIGN', label: 'Design & UX' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'SCIENCE', label: 'Science & Research' },
  { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
  { value: 'ARTS', label: 'Arts & Media' },
  { value: 'LAW', label: 'Law & Policy' },
  { value: 'OTHER', label: 'Other' }
]

export function ChallengeForm({ initialData, challengeId, mode = 'create' }: ChallengeFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<ChallengeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    problemStatement: initialData?.problemStatement || '',
    expectedOutcome: initialData?.expectedOutcome || '',
    challengeType: initialData?.challengeType || 'CAPSTONE',
    discipline: initialData?.discipline || 'TECHNOLOGY',
    requiredSkills: initialData?.requiredSkills || [],
    tools: initialData?.tools || [],
    teamSizeMin: initialData?.teamSizeMin || 1,
    teamSizeMax: initialData?.teamSizeMax || 4,
    estimatedDuration: initialData?.estimatedDuration || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    applicationDeadline: initialData?.applicationDeadline || '',
    targetCourses: initialData?.targetCourses || [],
    targetSemesters: initialData?.targetSemesters || [],
    creditWorth: initialData?.creditWorth || null,
    targetUniversities: initialData?.targetUniversities || [],
    maxSubmissions: initialData?.maxSubmissions || 10,
    mentorshipOffered: initialData?.mentorshipOffered || false,
    compensation: initialData?.compensation || '',
    equipmentProvided: initialData?.equipmentProvided || '',
    companyName: initialData?.companyName || '',
    companyLogo: initialData?.companyLogo || '',
    companyIndustry: initialData?.companyIndustry || ''
  })

  const [newSkill, setNewSkill] = useState('')
  const [newTool, setNewTool] = useState('')

  const handleChange = (field: keyof ChallengeFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addToArray = (field: 'requiredSkills' | 'tools', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
    }
  }

  const removeFromArray = (field: 'requiredSkills' | 'tools', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (action: 'save' | 'publish') => {
    setLoading(true)
    setError('')

    try {
      const url = mode === 'edit' && challengeId
        ? `/api/challenges/${challengeId}`
        : '/api/challenges'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save challenge')
      }

      const challenge = await response.json()

      if (action === 'publish') {
        const publishResponse = await fetch(`/api/challenges/${challenge.id}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skipReview: false })
        })

        if (!publishResponse.ok) {
          const data = await publishResponse.json()
          throw new Error(data.error || 'Failed to publish challenge')
        }
      }

      router.push('/dashboard/recruiter/challenges')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 4

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`h-2 flex-1 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
            <CardDescription>
              Describe the challenge you want students to work on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Build a Customer Analytics Dashboard"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide a brief overview of the challenge..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                value={formData.problemStatement}
                onChange={(e) => handleChange('problemStatement', e.target.value)}
                placeholder="What problem are you trying to solve?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedOutcome">Expected Outcome</Label>
              <Textarea
                id="expectedOutcome"
                value={formData.expectedOutcome}
                onChange={(e) => handleChange('expectedOutcome', e.target.value)}
                placeholder="What deliverables do you expect from students?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Challenge Type</Label>
                <Select
                  value={formData.challengeType}
                  onValueChange={(value) => handleChange('challengeType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Discipline</Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) => handleChange('discipline', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Requirements */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Skills</CardTitle>
            <CardDescription>
              Define the skills and team structure needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('requiredSkills', newSkill)
                      setNewSkill('')
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addToArray('requiredSkills', newSkill)
                    setNewSkill('')
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('requiredSkills', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tools & Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="Add a tool..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('tools', newTool)
                      setNewTool('')
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addToArray('tools', newTool)
                    setNewTool('')
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tool}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('tools', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Team Size</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.teamSizeMin}
                  onChange={(e) => handleChange('teamSizeMin', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Team Size</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.teamSizeMax}
                  onChange={(e) => handleChange('teamSizeMax', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Maximum Submissions</Label>
              <Input
                type="number"
                min="1"
                value={formData.maxSubmissions}
                onChange={(e) => handleChange('maxSubmissions', parseInt(e.target.value) || 10)}
              />
              <p className="text-xs text-gray-500">
                Maximum number of students/teams that can be selected
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Timeline */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline & Dates</CardTitle>
            <CardDescription>
              Set the schedule for your challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Estimated Duration</Label>
              <Input
                value={formData.estimatedDuration}
                onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                placeholder="e.g., 3 months, 1 semester"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleChange('applicationDeadline', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Benefits & Company */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits & Company Info</CardTitle>
            <CardDescription>
              What do you offer students?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label>Mentorship Offered</Label>
                <p className="text-sm text-gray-500">
                  Will you provide mentorship during the project?
                </p>
              </div>
              <Switch
                checked={formData.mentorshipOffered}
                onCheckedChange={(checked) => handleChange('mentorshipOffered', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Compensation</Label>
              <Input
                value={formData.compensation}
                onChange={(e) => handleChange('compensation', e.target.value)}
                placeholder="e.g., $500 stipend, Gift card, Course credits"
              />
            </div>

            <div className="space-y-2">
              <Label>Equipment/Resources Provided</Label>
              <Input
                value={formData.equipmentProvided}
                onChange={(e) => handleChange('equipmentProvided', e.target.value)}
                placeholder="e.g., Cloud credits, Software licenses"
              />
            </div>

            <hr className="my-4" />

            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Industry</Label>
              <Input
                value={formData.companyIndustry}
                onChange={(e) => handleChange('companyIndustry', e.target.value)}
                placeholder="e.g., Technology, Finance, Healthcare"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo URL</Label>
              <Input
                value={formData.companyLogo}
                onChange={(e) => handleChange('companyLogo', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {step < totalSteps ? (
            <Button onClick={() => setStep(s => Math.min(totalSteps, s + 1))}>
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleSubmit('save')}
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit('publish')}
                disabled={loading || !formData.title || !formData.description}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Publish Challenge
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
