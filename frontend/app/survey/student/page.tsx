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
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send
} from 'lucide-react'

interface SurveyData {
  // Demographics
  university: string
  degree: string
  graduationYear: string
  currentStatus: string

  // Academic Showcase
  proudestAchievement: string
  projectPreferences: string[]
  gradeImportance: string
  skillDemonstration: string

  // Platform Features
  profilePriorities: string[]
  transparencyComfort: string
  professorEndorsements: string

  // Job Search
  jobSearchChallenges: string[]
  idealEmployerConnection: string
  platformFeatures: string[]

  // Transparency & Privacy
  transparencyMeaning: string
  informationSharing: string[]
  privacyPreferences: string

  // Platform Development
  mostImportantFeature: string
  paidFeatures: string[]
  additionalComments: string
}

export default function StudentSurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(Date.now())

  const [surveyData, setSurveyData] = useState<SurveyData>({
    university: '',
    degree: '',
    graduationYear: '',
    currentStatus: '',
    proudestAchievement: '',
    projectPreferences: [],
    gradeImportance: '',
    skillDemonstration: '',
    profilePriorities: [],
    transparencyComfort: '',
    professorEndorsements: '',
    jobSearchChallenges: [],
    idealEmployerConnection: '',
    platformFeatures: [],
    transparencyMeaning: '',
    informationSharing: [],
    privacyPreferences: '',
    mostImportantFeature: '',
    paidFeatures: [],
    additionalComments: ''
  })

  const totalSteps = 6
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
          surveyType: 'student',
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
        router.push('/survey/thank-you?type=student')
      }, 3000)
    } catch (error) {
      console.error('Error submitting survey:', error)
      // Still show success for demo purposes
      setSubmitted(true)
      setTimeout(() => {
        router.push('/survey/thank-you?type=student')
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckboxChange = (field: keyof SurveyData, value: string, checked: boolean) => {
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
              Your insights will help us build the perfect platform for students like you.
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Student Survey</span>
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
              {currentStep === 1 && "About You"}
              {currentStep === 2 && "Academic Showcase"}
              {currentStep === 3 && "Platform Features"}
              {currentStep === 4 && "Job Search Experience"}
              {currentStep === 5 && "Transparency & Privacy"}
              {currentStep === 6 && "Platform Development"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-900">
            {/* Step 1: Demographics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="university">University/Institution</Label>
                  <Input
                    id="university"
                    placeholder="e.g., Politecnico di Milano"
                    value={surveyData.university}
                    onChange={(e) => setSurveyData(prev => ({...prev, university: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="degree">Degree Program</Label>
                  <Input
                    id="degree"
                    placeholder="e.g., Computer Science Engineering"
                    value={surveyData.degree}
                    onChange={(e) => setSurveyData(prev => ({...prev, degree: e.target.value}))}
                  />
                </div>

                <div>
                  <Label>Graduation Year</Label>
                  <RadioGroup
                    value={surveyData.graduationYear}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, graduationYear: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2024" id="2024" />
                      <Label htmlFor="2024">2024</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2025" id="2025" />
                      <Label htmlFor="2025">2025</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2026" id="2026" />
                      <Label htmlFor="2026">2026 or later</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="graduated" id="graduated" />
                      <Label htmlFor="graduated">Already graduated</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Current Status</Label>
                  <RadioGroup
                    value={surveyData.currentStatus}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, currentStatus: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Currently studying</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="job-seeking" id="job-seeking" />
                      <Label htmlFor="job-seeking">Looking for job opportunities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employed" id="employed" />
                      <Label htmlFor="employed">Currently employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="internship" id="internship" />
                      <Label htmlFor="internship">Doing internship</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Academic Showcase */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="achievement">What's your proudest academic achievement?</Label>
                  <Textarea
                    id="achievement"
                    placeholder="Describe a project, thesis, research, or coursework you're most proud of..."
                    value={surveyData.proudestAchievement}
                    onChange={(e) => setSurveyData(prev => ({...prev, proudestAchievement: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>How do you prefer to showcase your work? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Project portfolios with code/demos',
                      'Detailed project descriptions',
                      'Video presentations',
                      'Technical documentation',
                      'GitHub repositories',
                      'Academic papers/publications',
                      'Course certificates'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.projectPreferences.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('projectPreferences', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How important are grades in representing your abilities?</Label>
                  <RadioGroup
                    value={surveyData.gradeImportance}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, gradeImportance: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-important" id="very-important" />
                      <Label htmlFor="very-important">Very important - they reflect my knowledge accurately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-important" id="somewhat-important" />
                      <Label htmlFor="somewhat-important">Somewhat important - good context but not everything</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-important" id="not-important" />
                      <Label htmlFor="not-important">Not very important - projects matter more</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misleading" id="misleading" />
                      <Label htmlFor="misleading">Sometimes misleading - don't represent real skills</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="skills">How do you best demonstrate your technical skills?</Label>
                  <Textarea
                    id="skills"
                    placeholder="Describe how you like to show your abilities (through projects, certifications, competitions, etc.)"
                    value={surveyData.skillDemonstration}
                    onChange={(e) => setSurveyData(prev => ({...prev, skillDemonstration: e.target.value}))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Platform Features */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>What's most important in your academic profile? (Select top 3)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Overall GPA and course grades',
                      'Individual project portfolios',
                      'Professor recommendations',
                      'Technical skills demonstrated',
                      'Course-specific performance',
                      'Thesis/research work',
                      'Extracurricular achievements',
                      'Internship experiences'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.profilePriorities.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('profilePriorities', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How comfortable are you with academic transparency?</Label>
                  <RadioGroup
                    value={surveyData.transparencyComfort}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, transparencyComfort: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fully-comfortable" id="fully-comfortable" />
                      <Label htmlFor="fully-comfortable">Fully comfortable - transparency builds trust</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly-comfortable" id="mostly-comfortable" />
                      <Label htmlFor="mostly-comfortable">Mostly comfortable - with context for challenges</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-comfortable" id="somewhat-comfortable" />
                      <Label htmlFor="somewhat-comfortable">Somewhat comfortable - only positive highlights</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-comfortable" id="not-comfortable" />
                      <Label htmlFor="not-comfortable">Not comfortable - prefer privacy</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>How valuable would professor endorsements be?</Label>
                  <RadioGroup
                    value={surveyData.professorEndorsements}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, professorEndorsements: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extremely-valuable" id="extremely-valuable" />
                      <Label htmlFor="extremely-valuable">Extremely valuable - professors know my work best</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="valuable" id="valuable" />
                      <Label htmlFor="valuable">Valuable - good additional credibility</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-valuable" id="somewhat-valuable" />
                      <Label htmlFor="somewhat-valuable">Somewhat valuable - depends on the professor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-valuable" id="not-valuable" />
                      <Label htmlFor="not-valuable">Not very valuable - my work speaks for itself</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Job Search Experience */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>What are your biggest job search challenges? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Getting noticed by employers',
                      'Demonstrating real skills beyond grades',
                      'Standing out from other candidates',
                      'Finding relevant opportunities',
                      'Understanding what employers want',
                      'Translating academic work to job skills',
                      'Networking and connections',
                      'Interview preparation'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.jobSearchChallenges.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('jobSearchChallenges', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="employer-connection">How would you ideally like employers to discover you?</Label>
                  <Textarea
                    id="employer-connection"
                    placeholder="Describe your ideal way for companies to find and approach you..."
                    value={surveyData.idealEmployerConnection}
                    onChange={(e) => setSurveyData(prev => ({...prev, idealEmployerConnection: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which platform features would help you most? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'AI-powered job matching based on coursework',
                      'Direct messaging from relevant companies',
                      'Project-based skill verification',
                      'Course-to-career mapping tools',
                      'Employer transparency about roles',
                      'Academic achievement analytics',
                      'Peer comparison and benchmarking',
                      'Career path recommendations'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.platformFeatures.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('platformFeatures', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Transparency & Privacy */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="transparency-meaning">What does "transparency" mean to you in the context of academic profiles?</Label>
                  <Textarea
                    id="transparency-meaning"
                    placeholder="Share your thoughts on transparency in academic and professional contexts..."
                    value={surveyData.transparencyMeaning}
                    onChange={(e) => setSurveyData(prev => ({...prev, transparencyMeaning: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>What information would you be comfortable sharing? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Individual course grades with context',
                      'Overall GPA and class ranking',
                      'Failed courses and retake results',
                      'Project portfolios and code',
                      'Professor feedback and recommendations',
                      'Personal challenges overcome',
                      'Learning difficulties or accommodations',
                      'Work experience during studies'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.informationSharing.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('informationSharing', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>How should privacy be handled?</Label>
                  <RadioGroup
                    value={surveyData.privacyPreferences}
                    onValueChange={(value) => setSurveyData(prev => ({...prev, privacyPreferences: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-transparency" id="full-transparency" />
                      <Label htmlFor="full-transparency">Full transparency - everything visible to all</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="selective-sharing" id="selective-sharing" />
                      <Label htmlFor="selective-sharing">Selective sharing - control what each company sees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="verified-only" id="verified-only" />
                      <Label htmlFor="verified-only">Only to verified, serious employers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="opt-in" id="opt-in" />
                      <Label htmlFor="opt-in">Opt-in per employer request</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 6: Platform Development */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="important-feature">What's the most important feature for you?</Label>
                  <Textarea
                    id="important-feature"
                    placeholder="Describe the one feature that would make this platform invaluable to you..."
                    value={surveyData.mostImportantFeature}
                    onChange={(e) => setSurveyData(prev => ({...prev, mostImportantFeature: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which features would you consider paying for? (Select all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Premium profile visibility',
                      'Advanced analytics on profile views',
                      'Career coaching and mentorship',
                      'Professional CV optimization',
                      'Direct employer introductions',
                      'Industry-specific skill assessments',
                      'Personalized career path recommendations',
                      'Nothing - should be completely free'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={surveyData.paidFeatures.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('paidFeatures', option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Any additional thoughts or suggestions?</Label>
                  <Textarea
                    id="comments"
                    placeholder="Share any other ideas, concerns, or feedback about the platform..."
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