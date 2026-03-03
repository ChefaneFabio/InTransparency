'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Users,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  BarChart3,
  Play,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// ============================================================================
// TYPES
// ============================================================================

interface Assessment {
  id: string
  assessmentType: string
  status: string
  timeStarted: string
  timeCompleted: string | null
  certificateId: string | null
  bigFiveProfile: {
    personality: string | null
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  } | null
  discProfile: {
    primaryStyle: string | null
    dominance: number
    influence: number
    steadiness: number
    compliance: number
  } | null
  competencyProfile: {
    overallScore: number | null
    topStrengths: unknown
  } | null
}

interface AssessmentQuestion {
  id: string
  questionText: string
  questionType: string
  dimension: string
  options: unknown
}

// ============================================================================
// ASSESSMENT TYPE CONFIGS
// ============================================================================

const ASSESSMENT_TYPES = [
  {
    type: 'BIG_FIVE',
    label: 'Big Five Personality',
    description: 'Measures openness, conscientiousness, extraversion, agreeableness, and emotional stability',
    icon: Brain,
    color: 'blue',
    time: '10 min',
    questions: 25,
  },
  {
    type: 'DISC',
    label: 'DISC Behavioral',
    description: 'Identifies your communication and work style: Dominance, Influence, Steadiness, Compliance',
    icon: Users,
    color: 'purple',
    time: '8 min',
    questions: 20,
  },
  {
    type: 'COMPETENCY',
    label: 'Core Competencies',
    description: 'Assesses leadership, teamwork, problem-solving, communication, and more',
    icon: Target,
    color: 'green',
    time: '10 min',
    questions: 24,
  },
  {
    type: 'FULL',
    label: 'Full Assessment',
    description: 'Complete all three assessments for your most comprehensive profile',
    icon: Award,
    color: 'amber',
    time: '30 min',
    questions: 69,
  },
]

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CertificationsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)

  // Active assessment flow
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null)
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/assessments')
      if (res.ok) {
        const data = await res.json()
        setAssessments(data.assessments || [])
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err)
    } finally {
      setLoading(false)
    }
  }

  const startAssessment = async (type: string) => {
    setStarting(type)
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentType: type }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to start assessment')
        return
      }

      const data = await res.json()
      const assessmentId = data.assessment.id

      // Fetch questions
      const qRes = await fetch(`/api/assessments/${assessmentId}`)
      if (qRes.ok) {
        const qData = await qRes.json()
        setActiveAssessment(assessmentId)
        setQuestions(qData.questions || [])
        setCurrentIndex(0)
        setAnswers({})
        setCompleted(false)
      }
    } catch (err) {
      console.error('Failed to start assessment:', err)
    } finally {
      setStarting(null)
    }
  }

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const submitAssessment = async () => {
    if (!activeAssessment) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/assessments/${activeAssessment}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: answers,
          complete: true,
        }),
      })

      if (res.ok) {
        setCompleted(true)
        await fetchAssessments()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to submit assessment')
      }
    } catch (err) {
      console.error('Failed to submit:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================================
  // ACTIVE ASSESSMENT VIEW (question flow)
  // ============================================================================

  if (activeAssessment && !completed) {
    const q = questions[currentIndex]
    const progress = questions.length > 0 ? Math.round(((currentIndex) / questions.length) * 100) : 0
    const answered = q ? answers[q.id] !== undefined : false
    const allAnswered = questions.every((q) => answers[q.id] !== undefined)

    return (
      <div className="max-w-2xl mx-auto pb-8">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        {q && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
                {q.dimension}
              </p>
              <p className="text-lg font-medium text-gray-900 mb-6">
                {q.questionText}
              </p>

              {/* Likert scale */}
              <div className="space-y-2">
                {[
                  { value: 1, label: 'Strongly Disagree' },
                  { value: 2, label: 'Disagree' },
                  { value: 3, label: 'Neutral' },
                  { value: 4, label: 'Agree' },
                  { value: 5, label: 'Strongly Agree' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(q.id, option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                      answers[q.id] === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[q.id] === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[q.id] === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!answered}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={submitAssessment}
                disabled={!allAnswered || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Assessment
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Quick nav dots */}
        <div className="flex flex-wrap gap-1 mt-6 justify-center">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600'
                  : answers[q.id] !== undefined
                    ? 'bg-green-400'
                    : 'bg-gray-200'
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  // ============================================================================
  // COMPLETION VIEW
  // ============================================================================

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
        <p className="text-gray-600 mb-6">
          Your responses have been analyzed. View your results below.
        </p>
        <Button
          onClick={() => {
            setActiveAssessment(null)
            setCompleted(false)
          }}
        >
          View Results
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    )
  }

  // ============================================================================
  // MAIN DASHBOARD VIEW
  // ============================================================================

  const completedAssessments = assessments.filter((a) => a.status === 'COMPLETED')
  const latestBigFive = completedAssessments.find((a) => a.bigFiveProfile)
  const latestDISC = completedAssessments.find((a) => a.discProfile)
  const latestCompetency = completedAssessments.find((a) => a.competencyProfile)

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Psychometric Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Take assessments to certify your soft skills and behavioral profile
          </p>
        </div>
      </div>

      {/* Results section - only show if there are completed assessments */}
      {completedAssessments.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Big Five Radar */}
          {latestBigFive?.bigFiveProfile && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  Big Five Personality
                </CardTitle>
                {latestBigFive.bigFiveProfile.personality && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    {latestBigFive.bigFiveProfile.personality}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart
                    data={[
                      { trait: 'Open', score: latestBigFive.bigFiveProfile.openness },
                      { trait: 'Consc.', score: latestBigFive.bigFiveProfile.conscientiousness },
                      { trait: 'Extra.', score: latestBigFive.bigFiveProfile.extraversion },
                      { trait: 'Agree.', score: latestBigFive.bigFiveProfile.agreeableness },
                      { trait: 'Stabil.', score: 100 - latestBigFive.bigFiveProfile.neuroticism },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                  >
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* DISC Profile */}
          {latestDISC?.discProfile && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  DISC Profile
                </CardTitle>
                {latestDISC.discProfile.primaryStyle && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    {latestDISC.discProfile.primaryStyle}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Dominance', value: latestDISC.discProfile.dominance, color: 'bg-red-500' },
                  { label: 'Influence', value: latestDISC.discProfile.influence, color: 'bg-yellow-500' },
                  { label: 'Steadiness', value: latestDISC.discProfile.steadiness, color: 'bg-green-500' },
                  { label: 'Compliance', value: latestDISC.discProfile.compliance, color: 'bg-blue-500' },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{dim.label}</span>
                      <span className="font-medium">{dim.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Competency Profile */}
          {latestCompetency?.competencyProfile && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Core Competencies
                </CardTitle>
                {latestCompetency.competencyProfile.overallScore && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    Score: {latestCompetency.competencyProfile.overallScore}/100
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {latestCompetency.competencyProfile.topStrengths ? (
                  <div className="space-y-2">
                    {(Array.isArray(latestCompetency.competencyProfile.topStrengths)
                      ? (latestCompetency.competencyProfile.topStrengths as string[])
                      : []
                    ).map((s: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Assessments */}
      <h2 className="font-medium text-gray-900 mb-3">
        {completedAssessments.length > 0 ? 'Take Another Assessment' : 'Available Assessments'}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {ASSESSMENT_TYPES.map((at) => {
          const existing = assessments.find(
            (a) => a.assessmentType === at.type && a.status === 'COMPLETED'
          )
          const inProgress = assessments.find(
            (a) => a.assessmentType === at.type && a.status === 'IN_PROGRESS'
          )
          const IconComponent = at.icon

          return (
            <Card key={at.type} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${at.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-5 w-5 text-${at.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{at.label}</h3>
                      {existing && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                      )}
                      {inProgress && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">In Progress</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{at.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {at.questions} questions · ~{at.time}
                      </span>
                      <Button
                        size="sm"
                        variant={existing ? 'outline' : 'default'}
                        onClick={() => startAssessment(at.type)}
                        disabled={starting === at.type}
                      >
                        {starting === at.type ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : existing ? (
                          <>Retake</>
                        ) : inProgress ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Past assessments list */}
      {assessments.length > 0 && (
        <>
          <h2 className="font-medium text-gray-900 mb-3">Assessment History</h2>
          <div className="space-y-2">
            {assessments.map((a) => {
              const config = ASSESSMENT_TYPES.find((t) => t.type === a.assessmentType)
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                >
                  <div className={`w-8 h-8 rounded bg-gray-100 flex items-center justify-center`}>
                    {config ? <config.icon className="h-4 w-4 text-gray-500" /> : <BarChart3 className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {config?.label || a.assessmentType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.timeStarted).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      a.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {a.status === 'COMPLETED' ? (
                      <><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" /> In Progress</>
                    )}
                  </Badge>
                  {a.certificateId && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
