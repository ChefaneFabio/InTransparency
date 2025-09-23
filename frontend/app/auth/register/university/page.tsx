'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  School,
  CheckCircle,
  ArrowLeft,
  Trophy
} from 'lucide-react'

export default function UniversityRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    jobTitle: '',
    message: '',
    acceptTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)

    setTimeout(() => {
      router.push('/dashboard/university')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your interest!</h2>
            <p className="text-gray-600 mb-4">
              Your university partnership request has been submitted. Our team will contact you within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              InTransparency
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">University Partnership Request</h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/register/role-selection">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Role
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <School className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>University Information</CardTitle>
                <CardDescription>Tell us about your institution</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john.doe@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>

              <div>
                <Label htmlFor="university">University Name</Label>
                <Input
                  id="university"
                  required
                  placeholder="Stanford University"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({...prev, university: e.target.value}))}
                />
              </div>

              <div>
                <Label htmlFor="jobTitle">Your Job Title</Label>
                <Input
                  id="jobTitle"
                  required
                  placeholder="Director of Career Services"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({...prev, jobTitle: e.target.value}))}
                />
              </div>

              <div>
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your needs and requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    required
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, acceptTerms: checked as boolean}))}
                  />
                  <div className="text-sm">
                    <span>I agree to the </span>
                    <Link href="/legal/terms" className="text-blue-600 hover:text-blue-500" target="_blank">
                      Terms of Service
                    </Link>
                    <span> and </span>
                    <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-500" target="_blank">
                      Privacy Policy
                    </Link>
                  </div>
                </label>
              </div>

              <Alert className="border-purple-200 bg-purple-50">
                <Trophy className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-700">
                  <strong>Ready to transform your career services!</strong> Our team will contact you within 24 hours
                  to schedule a personalized demo.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}