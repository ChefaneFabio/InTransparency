'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  School,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send
} from 'lucide-react'

interface UniversitySurveyData {
  // Institution Information
  universityName: string
  country: string
  institutionSize: string
  role: string

  // Student Placement Challenges
  placementChallenges: string[]
  currentPlacementRate: string
  industryPartnerships: string

  // Career Services
  careerServicesOffered: string[]
  studentPreparation: string
  employerFeedback: string

  // Platform Integration
  dataIntegration: string
  transparencyComfort: string
  desiredFeatures: string[]

  // Platform Development
  mostImportantFeature: string
  pricingModel: string
  additionalComments: string
}

export default function UniversitySurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(Date.now())

  const [surveyData, setSurveyData] = useState<UniversitySurveyData>({
    universityName: '',
    country: '',
    institutionSize: '',
    role: '',
    placementChallenges: [],
    currentPlacementRate: '',
    industryPartnerships: '',
    careerServicesOffered: [],
    studentPreparation: '',
    employerFeedback: '',
    dataIntegration: '',
    transparencyComfort: '',
    desiredFeatures: [],
    mostImportantFeature: '',
    pricingModel: '',
    additionalComments: ''
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Submit survey data to backend
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyType: 'university',
          responses: surveyData,
          metadata: {
            completionTime: Date.now() - startTime,
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      const result = await response.json()
      console.log('Survey submitted successfully:', result)

      setSubmitted(true)
      setTimeout(() => {
        router.push('/survey/thank-you?type=university')
      }, 3000)
    } catch (error) {
      console.error('Error submitting survey:', error)
      // Still show success for demo purposes
      setSubmitted(true)
      setTimeout(() => {
        router.push('/survey/thank-you?type=university')
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckboxChange = (field: keyof UniversitySurveyData, value: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-4">
              Your insights will help us build the perfect platform for universities and career services.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-50/50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/survey" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <School className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">University Survey</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {currentStep === 1 && "Institution Information"}
              {currentStep === 2 && "Student Placement Challenges"}
              {currentStep === 3 && "Career Services"}
              {currentStep === 4 && "Platform Integration"}
              {currentStep === 5 && "Platform Development"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Institution Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="university">University/Institution Name</Label>
                  <Input
                    id="university"
                    placeholder="e.g., Politecnico di Milano"
                    value={surveyData.universityName}
                    onChange={(e) => setSurveyData(prev => ({...prev, universityName: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Italy"
                    value={surveyData.country}
                    onChange={(e) => setSurveyData(prev => ({...prev, country: e.target.value}))}
                  />
                </div>

                <div>
                  <Label>Institution Size</Label>
                  <RadioGroup
                    value={surveyData.institutionSize}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, institutionSize: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small">Small (Under 5,000 students)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium (5,000-20,000 students)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large">Large (20,000-50,000 students)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-large" id="very-large" />
                      <Label htmlFor="very-large">Very Large (50,000+ students)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Career Services Director, Academic Administrator"
                    value={surveyData.role}
                    onChange={(e) => setSurveyData(prev => ({...prev, role: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Student Placement Challenges */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>What are your biggest challenges in student placement? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Students lack industry-relevant skills',
                      'Employers have unclear expectations',
                      'Limited industry partnerships',
                      'Students struggle with job search skills',
                      'Mismatch between curriculum and market needs',
                      'Geographic limitations for opportunities',
                      'Students lack confidence in abilities',
                      'Difficulty tracking placement outcomes'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.placementChallenges.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('placementChallenges', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>What's your current graduate placement rate?</Label>
                  <RadioGroup
                    value={surveyData.currentPlacementRate}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, currentPlacementRate: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="below-50" id="below-50" />
                      <Label htmlFor="below-50">Below 50%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50-70" id="50-70" />
                      <Label htmlFor="50-70">50-70%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="70-85" id="70-85" />
                      <Label htmlFor="70-85">70-85%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="above-85" id="above-85" />
                      <Label htmlFor="above-85">Above 85%</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="partnerships">Describe your current industry partnerships and how they work</Label>
                  <Textarea
                    id="partnerships"
                    placeholder="Tell us about your relationships with companies, internship programs, career fairs, etc."
                    value={surveyData.industryPartnerships}
                    onChange={(e) => setSurveyData(prev => ({...prev, industryPartnerships: e.target.value}))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Career Services */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>What career services do you currently offer? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Individual career counseling',
                      'Resume and CV review services',
                      'Interview preparation workshops',
                      'Job search strategy sessions',
                      'Industry networking events',
                      'Career fairs and employer meetings',
                      'Alumni mentorship programs',
                      'Internship placement services',
                      'Professional skills workshops',
                      'Online job portal access'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.careerServicesOffered.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('careerServicesOffered', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="preparation">How do you currently prepare students for the job market?</Label>
                  <Textarea
                    id="preparation"
                    placeholder="Describe your approach to preparing students for professional careers..."
                    value={surveyData.studentPreparation}
                    onChange={(e) => setSurveyData(prev => ({...prev, studentPreparation: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="feedback">What feedback do you receive from employers about your graduates?</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share common themes in employer feedback, both positive and areas for improvement..."
                    value={surveyData.employerFeedback}
                    onChange={(e) => setSurveyData(prev => ({...prev, employerFeedback: e.target.value}))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Platform Integration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>How comfortable would you be integrating student academic data with a transparency platform?</Label>
                  <RadioGroup
                    value={surveyData.dataIntegration}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, dataIntegration: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-comfortable" id="integration-very" />
                      <Label htmlFor="integration-very">Very comfortable - would enhance our services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable" id="integration-comfortable" />
                      <Label htmlFor="integration-comfortable">Comfortable - with proper privacy controls</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="integration-neutral" />
                      <Label htmlFor="integration-neutral">Neutral - need more information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uncomfortable" id="integration-uncomfortable" />
                      <Label htmlFor="integration-uncomfortable">Uncomfortable - privacy concerns</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>How comfortable are you with academic transparency for student outcomes?</Label>
                  <RadioGroup
                    value={surveyData.transparencyComfort}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, transparencyComfort: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fully-comfortable" id="transparency-full" />
                      <Label htmlFor="transparency-full">Fully comfortable - transparency improves outcomes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly-comfortable" id="transparency-mostly" />
                      <Label htmlFor="transparency-mostly">Mostly comfortable - with student consent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-comfortable" id="transparency-somewhat" />
                      <Label htmlFor="transparency-somewhat">Somewhat comfortable - only positive outcomes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-comfortable" id="transparency-not" />
                      <Label htmlFor="transparency-not">Not comfortable - prefer current privacy</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Which platform features would be most valuable for your institution? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Real-time placement tracking and analytics',
                      'Employer feedback collection system',
                      'Student skill gap identification',
                      'Industry trend analysis for curriculum',
                      'Alumni career progression tracking',
                      'Employer engagement and partnership tools',
                      'Student career readiness assessment',
                      'Automated placement reporting'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.desiredFeatures.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('desiredFeatures', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Platform Development */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="important-feature">What's the most important feature for a university career services platform?</Label>
                  <Textarea
                    id="important-feature"
                    placeholder="Describe the one feature that would make this platform invaluable to your institution..."
                    value={surveyData.mostImportantFeature}
                    onChange={(e) => setSurveyData(prev => ({...prev, mostImportantFeature: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which pricing model would work best for your institution?</Label>
                  <RadioGroup
                    value={surveyData.pricingModel}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, pricingModel: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="per-student" id="pricing-student" />
                      <Label htmlFor="pricing-student">Per student enrolled pricing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="institutional-license" id="pricing-institution" />
                      <Label htmlFor="pricing-institution">Institutional license (flat rate)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="placement-based" id="pricing-placement" />
                      <Label htmlFor="pricing-placement">Success-based pricing (per placement)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="freemium" id="pricing-freemium-uni" />
                      <Label htmlFor="pricing-freemium-uni">Free basic tier with premium features</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="government-funded" id="pricing-government" />
                      <Label htmlFor="pricing-government">Government or education authority funded</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="additional-comments">Any additional thoughts about improving student career outcomes?</Label>
                  <Textarea
                    id="additional-comments"
                    placeholder="Share any other ideas, concerns, or feedback about career services and student placement..."
                    value={surveyData.additionalComments}
                    onChange={(e) => setSurveyData(prev => ({...prev, additionalComments: e.target.value}))}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Survey
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}