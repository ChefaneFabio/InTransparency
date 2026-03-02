'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, Send, CheckCircle, Building2 } from 'lucide-react'

const ratingCategories = [
  { key: 'overallRating', label: 'Overall Experience', required: true },
  { key: 'workLifeBalance', label: 'Work-Life Balance', required: false },
  { key: 'mentorship', label: 'Mentorship Quality', required: false },
  { key: 'learningOpportunity', label: 'Learning Opportunity', required: false },
  { key: 'compensation', label: 'Compensation', required: false },
  { key: 'cultureFit', label: 'Culture Fit', required: false },
]

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-5 w-5 ${
              star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [title, setTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!companyName || !ratings.overallRating || !reviewText) {
      setError('Please fill in company name, overall rating, and your review.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          jobTitle: jobTitle || undefined,
          title: title || undefined,
          reviewText,
          pros: pros || undefined,
          cons: cons || undefined,
          isAnonymous,
          ...ratings,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to submit review')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
            <p className="text-gray-600">
              Thank you for sharing your experience. Your review helps other students make informed decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Write an Employer Review</h1>
        <p className="text-gray-600 mt-1">
          Share your internship or placement experience to help fellow students
        </p>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name *</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Accenture, Reply, Deloitte..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your Role / Job Title</label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ratings</CardTitle>
          <CardDescription>Rate your experience (1-5 stars)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratingCategories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {cat.label} {cat.required && '*'}
              </span>
              <StarRating
                value={ratings[cat.key] || 0}
                onChange={(v) => setRatings({ ...ratings, [cat.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Written Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Review Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a sentence"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your Experience *</label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe your overall experience working here..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-green-700 mb-1 block">Pros</label>
              <Textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="What did you like?"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 mb-1 block">Cons</label>
              <Textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="What could be improved?"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Submit */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Submit anonymously</span>
              <p className="text-xs text-gray-500">Your name won&apos;t be shown, only your university</p>
            </div>
          </label>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
