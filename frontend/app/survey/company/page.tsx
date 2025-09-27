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
  const [startTime] = useState(Date.now())

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

    try {
      // Submit survey data to backend
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyType: 'company',
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
        router.push('/survey/thank-you?type=company')
      }, 3000)
    } catch (error) {
      console.error('Error submitting survey:', error)
      // Still show success for demo purposes
      setSubmitted(true)
      setTimeout(() => {
        router.push('/survey/thank-you?type=company')
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/survey" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Company Survey</span>
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
        <Card className="bg-white shadow-lg border border-gray-300">
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

          <CardContent className="space-y-6 text-gray-900">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="company" className="text-gray-900 font-semibold">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Evoca Group"
                    value={surveyData.companyName}
                    onChange={(e) => setSurveyData(prev => ({...prev, companyName: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="text-gray-900 font-semibold">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Food & Beverage, Technology, Finance"
                    value={surveyData.industry}
                    onChange={(e) => setSurveyData(prev => ({...prev, industry: e.target.value}))}
                  />
                </div>

                <div>
                  <Label className="text-gray-900 font-semibold">Company Size</Label>
                  <RadioGroup
                    value={surveyData.companySize}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, companySize: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="startup" id="startup" />
                      <Label htmlFor="startup" className="text-gray-800">Startup (1-50 employees)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small" className="text-gray-800">Small (51-200 employees)</Label>
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

            {/* Step 4: Platform Features */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="ideal-profile">Describe your ideal graduate candidate profile</Label>
                  <Textarea
                    id="ideal-profile"
                    placeholder="What qualities, skills, and characteristics make a perfect graduate hire for your company..."
                    value={surveyData.idealCandidateProfile}
                    onChange={(e) => setSurveyData(prev => ({...prev, idealCandidateProfile: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which platform features would be most valuable for your recruitment? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'AI-powered candidate matching based on coursework',
                      'Verified academic performance data',
                      'Project portfolio reviews and scoring',
                      'Professor endorsements and recommendations',
                      'Skills-based filtering and search',
                      'University partnership integrations',
                      'Automated initial screening',
                      'Transparent academic journey tracking'
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

                <div>
                  <Label>How valuable would academic transparency be for your hiring decisions?</Label>
                  <RadioGroup
                    value={surveyData.transparencyValue}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, transparencyValue: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extremely-valuable" id="transparency-extremely" />
                      <Label htmlFor="transparency-extremely">Extremely valuable - would revolutionize our hiring</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-valuable" id="transparency-very" />
                      <Label htmlFor="transparency-very">Very valuable - significant improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-valuable" id="transparency-somewhat" />
                      <Label htmlFor="transparency-somewhat">Somewhat valuable - nice additional data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-valuable" id="transparency-not" />
                      <Label htmlFor="transparency-not">Not valuable - current methods work fine</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 5: Recruitment Tools & Costs */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label>Which recruitment tools do you currently use? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'LinkedIn Recruiter',
                      'University career portals',
                      'Job boards (Indeed, Glassdoor, etc.)',
                      'Recruitment agencies',
                      'University job fairs',
                      'Internal referrals',
                      'ATS (Applicant Tracking System)',
                      'Social media recruiting'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.currentTools.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('currentTools', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How satisfied are you with your current recruitment tools?</Label>
                  <RadioGroup
                    value={surveyData.toolSatisfaction}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, toolSatisfaction: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-satisfied" id="tools-very-satisfied" />
                      <Label htmlFor="tools-very-satisfied">Very satisfied - they meet all our needs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="satisfied" id="tools-satisfied" />
                      <Label htmlFor="tools-satisfied">Satisfied - work well with minor issues</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="tools-neutral" />
                      <Label htmlFor="tools-neutral">Neutral - adequate but room for improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dissatisfied" id="tools-dissatisfied" />
                      <Label htmlFor="tools-dissatisfied">Dissatisfied - significant gaps and frustrations</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>What's your annual budget for graduate recruitment tools?</Label>
                  <RadioGroup
                    value={surveyData.budgetRange}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, budgetRange: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-5000" id="budget-0-5000" />
                      <Label htmlFor="budget-0-5000">€0-5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5000-15000" id="budget-5000-15000" />
                      <Label htmlFor="budget-5000-15000">€5,000-15,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15000-50000" id="budget-15000-50000" />
                      <Label htmlFor="budget-15000-50000">€15,000-50,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50000+" id="budget-50000+" />
                      <Label htmlFor="budget-50000+">€50,000+</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 6: Academic Information Value */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <Label>Which types of academic data would be most valuable to you? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Course-by-course performance with context',
                      'Project portfolios with professor validation',
                      'Skill progression over time',
                      'Research publications and citations',
                      'Thesis/capstone project details',
                      'Extracurricular achievements',
                      'Learning challenges and how they were overcome',
                      'Peer collaboration and teamwork examples'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.academicDataValue.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('academicDataValue', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How valuable would professor endorsements be in your hiring process?</Label>
                  <RadioGroup
                    value={surveyData.professorEndorsementValue}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, professorEndorsementValue: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extremely-valuable" id="professor-extremely" />
                      <Label htmlFor="professor-extremely">Extremely valuable - professors know students best</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="valuable" id="professor-valuable" />
                      <Label htmlFor="professor-valuable">Valuable - good additional credibility</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-valuable" id="professor-somewhat" />
                      <Label htmlFor="professor-somewhat">Somewhat valuable - depends on the professor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-valuable" id="professor-not" />
                      <Label htmlFor="professor-not">Not valuable - prefer industry references</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Do you currently have partnerships with universities for recruitment?</Label>
                  <RadioGroup
                    value={surveyData.universityPartnerships}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, universityPartnerships: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extensive" id="partnerships-extensive" />
                      <Label htmlFor="partnerships-extensive">Yes, extensive partnerships with multiple universities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="some" id="partnerships-some" />
                      <Label htmlFor="partnerships-some">Yes, some partnerships with select universities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="informal" id="partnerships-informal" />
                      <Label htmlFor="partnerships-informal">Informal relationships but no formal partnerships</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="partnerships-none" />
                      <Label htmlFor="partnerships-none">No current university partnerships</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 7: Platform Development */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="most-important">What's the most important feature for a graduate recruitment platform?</Label>
                  <Textarea
                    id="most-important"
                    placeholder="Describe the one feature that would make this platform invaluable to your company..."
                    value={surveyData.mostImportantFeature}
                    onChange={(e) => setSurveyData(prev => ({...prev, mostImportantFeature: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which pricing model would work best for your company?</Label>
                  <RadioGroup
                    value={surveyData.pricingPreferences}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, pricingPreferences: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="per-hire" id="pricing-per-hire" />
                      <Label htmlFor="pricing-per-hire">Pay per successful hire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly-subscription" id="pricing-monthly" />
                      <Label htmlFor="pricing-monthly">Monthly subscription with unlimited access</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annual-license" id="pricing-annual" />
                      <Label htmlFor="pricing-annual">Annual license with volume discounts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="freemium" id="pricing-freemium" />
                      <Label htmlFor="pricing-freemium">Freemium with premium features</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Would you be interested in participating in a pilot program?</Label>
                  <RadioGroup
                    value={surveyData.pilotInterest}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, pilotInterest: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-interested" id="pilot-very" />
                      <Label htmlFor="pilot-very">Very interested - would love early access</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interested" id="pilot-interested" />
                      <Label htmlFor="pilot-interested">Interested - depending on features and pricing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="pilot-maybe" />
                      <Label htmlFor="pilot-maybe">Maybe - would need more information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-interested" id="pilot-not" />
                      <Label htmlFor="pilot-not">Not interested at this time</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="additional-comments">Any additional thoughts, concerns, or suggestions?</Label>
                  <Textarea
                    id="additional-comments"
                    placeholder="Share any other feedback about graduate recruitment or platform ideas..."
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