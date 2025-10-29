'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Building2, Mail, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface CareerStep {
  role: string
  company: string
  duration: string
  year: number
}

export default function SubmitAlumniStoryPage() {
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    alumniName: '',
    graduationYear: new Date().getFullYear() - 1,
    degree: '',
    institution: '',
    currentRole: '',
    currentCompany: '',
    story: '',
    adviceForStudents: '',
    verificationEmail: '',
    anonymous: false
  })

  const [careerPath, setCareerPath] = useState<CareerStep[]>([
    { role: '', company: '', duration: '', year: new Date().getFullYear() }
  ])

  const [keySkills, setKeySkills] = useState<string[]>([''])

  const handleAddCareerStep = () => {
    setCareerPath([...careerPath, { role: '', company: '', duration: '', year: new Date().getFullYear() }])
  }

  const handleRemoveCareerStep = (index: number) => {
    setCareerPath(careerPath.filter((_, i) => i !== index))
  }

  const handleUpdateCareerStep = (index: number, field: keyof CareerStep, value: string | number) => {
    const updated = [...careerPath]
    updated[index] = { ...updated[index], [field]: value }
    setCareerPath(updated)
  }

  const handleAddSkill = () => {
    setKeySkills([...keySkills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    setKeySkills(keySkills.filter((_, i) => i !== index))
  }

  const handleUpdateSkill = (index: number, value: string) => {
    const updated = [...keySkills]
    updated[index] = value
    setKeySkills(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate email
      if (!formData.verificationEmail.endsWith('.edu')) {
        alert('Please use your institutional (.edu) email address')
        setSubmitting(false)
        return
      }

      // Filter empty skills and career steps
      const validSkills = keySkills.filter(s => s.trim().length > 0)
      const validCareerPath = careerPath.filter(step => step.role && step.company)

      const response = await fetch('/api/advocacy/alumni-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keySkills: validSkills,
          careerPath: validCareerPath
        })
      })

      const data = await response.json()

      if (data.success) {
        setVerificationToken(data.verificationToken)
        setStep('verification')
      } else {
        alert(data.error || 'Failed to submit story. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting story:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-primary">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-full">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Check Your Email</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Verification required to publish your story</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-8">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Verification Email Sent</h3>
                      <p className="text-sm text-blue-800">
                        We've sent a verification link to <strong>{formData.verificationEmail}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Next Steps:</h3>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">1</span>
                      </div>
                      <div>
                        <p className="text-sm">Check your email inbox at {formData.verificationEmail}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">2</span>
                      </div>
                      <div>
                        <p className="text-sm">Click the verification link in the email</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">3</span>
                      </div>
                      <div>
                        <p className="text-sm">Your story will be published and visible to students</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">For Demo Purposes:</h4>
                  <p className="text-xs text-gray-600 mb-2">Your verification token:</p>
                  <code className="block bg-white border px-3 py-2 rounded text-xs break-all">
                    {verificationToken}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    In production, you would receive an email with a clickable link.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href="/advocacy/alumni-stories" className="flex-1">
                    <Button variant="outline" className="w-full">
                      View All Stories
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setStep('success')}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-green-500">
            <CardContent className="py-12 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Thank You!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your success story will inspire current students once you verify your email.
                We appreciate you sharing your journey!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/advocacy/alumni-stories">
                  <Button size="lg">
                    View Alumni Stories
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold mb-4">
            Share Your Success Story
          </h1>
          <p className="text-xl text-white/90">
            Inspire current students by sharing your career journey.
            Your verified story shows real paths from graduation to success.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Alumni Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.alumniName}
                      onChange={(e) => setFormData({ ...formData, alumniName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Graduation Year *</label>
                    <input
                      type="number"
                      required
                      min="1950"
                      max={new Date().getFullYear()}
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree *</label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="e.g., Computer Science, Engineering"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution *</label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g., Politecnico di Milano"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Institutional Email (.edu) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.verificationEmail}
                    onChange={(e) => setFormData({ ...formData, verificationEmail: e.target.value })}
                    placeholder="your.name@university.edu"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send a verification link to this email. Must be a .edu address.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    Make my story anonymous (show as "{formData.degree} Graduate")
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Current Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Role *</label>
                    <input
                      type="text"
                      required
                      value={formData.currentRole}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Company *</label>
                    <input
                      type="text"
                      required
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      placeholder="e.g., Google, Microsoft"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Path */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Career Journey (Optional)</CardTitle>
                  <Button type="button" size="sm" onClick={handleAddCareerStep}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Show your career progression from graduation to current role
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerPath.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Step {index + 1}</span>
                      {careerPath.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCareerStep(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Role"
                        value={step.role}
                        onChange={(e) => handleUpdateCareerStep(index, 'role', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={step.company}
                        onChange={(e) => handleUpdateCareerStep(index, 'company', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 2 years)"
                        value={step.duration}
                        onChange={(e) => handleUpdateCareerStep(index, 'duration', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={step.year}
                        onChange={(e) => handleUpdateCareerStep(index, 'year', parseInt(e.target.value))}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Story */}
            <Card>
              <CardHeader>
                <CardTitle>Your Success Story *</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Share your journey, challenges, and how you achieved success (200-1000 words)
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  required
                  minLength={200}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Example: After graduating with a degree in Computer Science, I started as a junior developer at a small startup. The biggest challenge was..."
                  className="w-full h-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.story.length} / 1000 characters (min 200)
                </p>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Key Skills That Helped You</CardTitle>
                  <Button type="button" size="sm" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keySkills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., Python, Problem Solving, Leadership"
                        value={skill}
                        onChange={(e) => handleUpdateSkill(index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      {keySkills.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advice */}
            <Card>
              <CardHeader>
                <CardTitle>Advice for Current Students</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  What would you tell students who want to follow a similar path?
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.adviceForStudents}
                  onChange={(e) => setFormData({ ...formData, adviceForStudents: e.target.value })}
                  placeholder="Example: Focus on building real projects, not just taking courses. Network early and don't be afraid to apply for positions that seem out of reach..."
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Link href="/advocacy/alumni-stories" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                {submitting ? 'Submitting...' : 'Submit Story'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
