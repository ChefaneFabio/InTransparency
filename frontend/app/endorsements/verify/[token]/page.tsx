'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2, Star } from 'lucide-react'

export default function EndorsementVerificationPage() {
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [endorsement, setEndorsement] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    endorsementText: '',
    skills: [] as string[],
    rating: 0,
    grade: ''
  })

  useEffect(() => {
    fetchEndorsement()
  }, [token])

  const fetchEndorsement = async () => {
    try {
      const response = await fetch(`/api/endorsements/verify/${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load endorsement')
      }

      setEndorsement(data.endorsement)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (action: 'verify' | 'decline') => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/endorsements/verify/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          action: action === 'decline' ? 'decline' : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const skillOptions = [
    'Problem Solving',
    'Critical Thinking',
    'Code Quality',
    'Innovation',
    'Technical Depth',
    'Collaboration',
    'Documentation',
    'Testing'
  ]

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !endorsement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16">
          <div className="container max-w-2xl">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
                <p className="text-gray-700">{error}</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16">
          <div className="container max-w-2xl">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-700">
                  Your endorsement has been submitted successfully.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Endorse Student Project
            </h1>
            <p className="text-gray-600">
              Your endorsement helps students showcase their verified skills to employers
            </p>
          </div>

          {/* Student & Project Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-semibold">{endorsement?.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{endorsement?.studentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">University:</span>
                <span>{endorsement?.studentUniversity}</span>
              </div>
              {endorsement?.courseName && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span>{endorsement.courseName} ({endorsement.courseCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Semester:</span>
                    <span>{endorsement.semester}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project: {endorsement?.project?.title}</CardTitle>
              <CardDescription>{endorsement?.project?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endorsement?.project?.technologies?.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Technologies Used</Label>
                  <div className="flex flex-wrap gap-2">
                    {endorsement.project.technologies.map((tech: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {endorsement?.project?.githubUrl && (
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">GitHub</Label>
                  <a
                    href={endorsement.project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {endorsement.project.githubUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endorsement Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Endorsement</CardTitle>
              <CardDescription>
                Please provide your assessment of this student's work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="mb-3 block">Overall Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFormData(prev => ({ ...prev, rating }))}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div>
                <Label htmlFor="grade" className="mb-2 block">
                  Grade Received (Optional)
                </Label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select grade...</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="Pass">Pass</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <Label className="mb-3 block">Skills Demonstrated</Label>
                <div className="grid grid-cols-2 gap-3">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                        formData.skills.includes(skill)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label htmlFor="endorsement" className="mb-2 block">
                  Comments (Optional)
                </Label>
                <Textarea
                  id="endorsement"
                  rows={4}
                  placeholder="Share your thoughts on the student's performance, work quality, or any notable achievements..."
                  value={formData.endorsementText}
                  onChange={(e) => setFormData(prev => ({ ...prev, endorsementText: e.target.value }))}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => handleSubmit('decline')}
              disabled={submitting}
            >
              Decline
            </Button>
            <Button
              onClick={() => handleSubmit('verify')}
              disabled={submitting || formData.rating === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Endorsement'
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
