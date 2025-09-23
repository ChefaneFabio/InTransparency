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
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send
} from 'lucide-react'

interface CompanySurveyData {
  // Company Information
  companyName: string
  industry: string
  companySize: string
  role: string
  hiringVolume: string

  // Current Recruitment Process
  currentPainPoints: string[]
  graduateHiringChallenges: string
  screeningTime: string
  averageCostPerHire: string

  // Candidate Evaluation
  evaluationCriteria: string[]
  skillVerificationMethods: string[]
  gradeImportance: string
  projectImportance: string

  // Platform Features
  idealCandidateProfile: string
  desiredFeatures: string[]
  transparencyValue: string

  // Recruitment Tools & Costs
  currentTools: string[]
  toolSatisfaction: string
  budgetRange: string

  // Academic Information Value
  academicDataValue: string[]
  professorEndorsementValue: string
  universityPartnerships: string

  // Platform Development
  mostImportantFeature: string
  pricingPreferences: string
  pilotInterest: string
  additionalComments: string
}

export default function CompanySurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [surveyData, setSurveyData] = useState<CompanySurveyData>({
    companyName: '',
    industry: '',
    companySize: '',
    role: '',
    hiringVolume: '',
    currentPainPoints: [],
    graduateHiringChallenges: '',
    screeningTime: '',
    averageCostPerHire: '',
    evaluationCriteria: [],
    skillVerificationMethods: [],
    gradeImportance: '',
    projectImportance: '',
    idealCandidateProfile: '',
    desiredFeatures: [],
    transparencyValue: '',
    currentTools: [],
    toolSatisfaction: '',
    budgetRange: '',
    academicDataValue: [],
    professorEndorsementValue: '',
    universityPartnerships: '',
    mostImportantFeature: '',
    pricingPreferences: '',
    pilotInterest: '',
    additionalComments: ''
  })

  const totalSteps = 7
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Store survey data (in real app, send to backend)
    console.log('Company Survey Data:', surveyData)

    setSubmitted(true)
    setTimeout(() => {
      router.push('/survey/thank-you?type=company')
    }, 3000)
  }

  const handleCheckboxChange = (field: keyof CompanySurveyData, value: string, checked: boolean) => {
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
              Your insights will help us build the perfect recruitment platform for companies like yours.
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">Company Survey</span>
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
              {currentStep === 1 && "Company Information"}
              {currentStep === 2 && "Current Recruitment Process"}
              {currentStep === 3 && "Candidate Evaluation"}
              {currentStep === 4 && "Platform Features"}
              {currentStep === 5 && "Recruitment Tools & Costs"}
              {currentStep === 6 && "Academic Information Value"}
              {currentStep === 7 && "Platform Development"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Evoca Group"
                    value={surveyData.companyName}
                    onChange={(e) => setSurveyData(prev => ({...prev, companyName: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Food & Beverage, Technology, Finance"
                    value={surveyData.industry}
                    onChange={(e) => setSurveyData(prev => ({...prev, industry: e.target.value}))}
                  />
                </div>

                <div>
                  <Label>Company Size</Label>
                  <RadioGroup
                    value={surveyData.companySize}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, companySize: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="startup" id="startup" />
                      <Label htmlFor="startup">Startup (1-50 employees)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small">Small (51-200 employees)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium (201-1000 employees)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large">Large (1000+ employees)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., HR Manager, Talent Acquisition, Recruiter"
                    value={surveyData.role}
                    onChange={(e) => setSurveyData(prev => ({...prev, role: e.target.value}))}
                  />
                </div>

                <div>
                  <Label>How many graduates do you hire per year?</Label>
                  <RadioGroup
                    value={surveyData.hiringVolume}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, hiringVolume: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-5" id="1-5" />
                      <Label htmlFor="1-5">1-5 graduates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6-20" id="6-20" />
                      <Label htmlFor="6-20">6-20 graduates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="21-50" id="21-50" />
                      <Label htmlFor="21-50">21-50 graduates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50+" id="50+" />
                      <Label htmlFor="50+">50+ graduates</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Current Recruitment Process */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>What are your biggest recruitment pain points? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Too many unqualified applications',
                      'Time-consuming initial screening',
                      'Difficulty verifying skills and qualifications',
                      'High cost per hire',
                      'Low quality of candidates',
                      'Candidates not matching job requirements',
                      'Geographic limitations',
                      'Long time-to-hire'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.currentPainPoints.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('currentPainPoints', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="challenges">What makes evaluating graduates particularly challenging?</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Describe specific challenges you face when hiring recent graduates..."
                    value={surveyData.graduateHiringChallenges}
                    onChange={(e) => setSurveyData(prev => ({...prev, graduateHiringChallenges: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>How much time do you spend on initial CV screening per position?</Label>
                  <RadioGroup
                    value={surveyData.screeningTime}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, screeningTime: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-5 hours" id="1-5-hours" />
                      <Label htmlFor="1-5-hours">1-5 hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6-15 hours" id="6-15-hours" />
                      <Label htmlFor="6-15-hours">6-15 hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="16-30 hours" id="16-30-hours" />
                      <Label htmlFor="16-30-hours">16-30 hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30+ hours" id="30-hours" />
                      <Label htmlFor="30-hours">30+ hours</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>What's your average cost per graduate hire (including agency fees, time, etc.)?</Label>
                  <RadioGroup
                    value={surveyData.averageCostPerHire}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, averageCostPerHire: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="€500-2000" id="500-2000" />
                      <Label htmlFor="500-2000">€500-2,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="€2000-5000" id="2000-5000" />
                      <Label htmlFor="2000-5000">€2,000-5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="€5000-10000" id="5000-10000" />
                      <Label htmlFor="5000-10000">€5,000-10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="€10000+" id="10000+" />
                      <Label htmlFor="10000+">€10,000+</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Candidate Evaluation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>What criteria do you prioritize when evaluating graduates? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Academic performance (GPA/grades)',
                      'Relevant coursework and specializations',
                      'Project portfolios and practical work',
                      'Technical skills demonstrated',
                      'Problem-solving ability',
                      'Communication skills',
                      'Cultural fit and personality',
                      'Internship and work experience'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.evaluationCriteria.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('evaluationCriteria', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How do you currently verify candidates' skills? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Technical interviews',
                      'Coding tests/assessments',
                      'Reference checks',
                      'Portfolio reviews',
                      'Trial periods/assignments',
                      'Certificate verification',
                      'University transcript requests',
                      'We don\'t verify - rely on self-reporting'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.skillVerificationMethods.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('skillVerificationMethods', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How important are academic grades to you?</Label>
                  <RadioGroup
                    value={surveyData.gradeImportance}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, gradeImportance: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-important" id="grades-very" />
                      <Label htmlFor="grades-very">Very important - strong predictor of performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-important" id="grades-somewhat" />
                      <Label htmlFor="grades-somewhat">Somewhat important - good context</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-important" id="grades-not" />
                      <Label htmlFor="grades-not">Not very important - practical skills matter more</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misleading" id="grades-misleading" />
                      <Label htmlFor="grades-misleading">Sometimes misleading - don't reflect job readiness</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>How important are project portfolios and practical work?</Label>
                  <RadioGroup
                    value={surveyData.projectImportance}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, projectImportance: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extremely-important" id="projects-extremely" />
                      <Label htmlFor="projects-extremely">Extremely important - best predictor of success</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-important" id="projects-very" />
                      <Label htmlFor="projects-very">Very important - shows practical application</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-important" id="projects-somewhat" />
                      <Label htmlFor="projects-somewhat">Somewhat important - nice to have</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-important" id="projects-not" />
                      <Label htmlFor="projects-not">Not important - prefer structured assessments</Label>
                    </div>
                  </RadioGroup>
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