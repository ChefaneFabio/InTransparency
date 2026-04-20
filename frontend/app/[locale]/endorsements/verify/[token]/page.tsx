'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Award,
  CheckCircle,
  XCircle,
  Loader2,
  GraduationCap,
  BookOpen,
  Star,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'

interface EndorsementData {
  id: string
  studentName: string
  studentEmail: string
  studentUniversity: string
  project: {
    id: string
    title: string
    description: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
  }
  courseName: string
  courseCode: string
  semester: string
}

export default function EndorsementVerifyPage() {
  const params = useParams()
  const t = useTranslations('endorsementsVerify')
  const token = params.token as string

  const [endorsement, setEndorsement] = useState<EndorsementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [action, setAction] = useState<'verify' | 'decline' | null>(null)

  // Form state
  const [endorsementText, setEndorsementText] = useState('')
  const [rating, setRating] = useState(0)
  const [grade, setGrade] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  // Per-competency ratings
  const predefinedCompetencies = [
    { key: 'criticalThinking', label: t('compCriticalThinking') },
    { key: 'teamwork', label: t('compTeamwork') },
    { key: 'technicalSkills', label: t('compTechnicalSkills') },
    { key: 'communication', label: t('compCommunication') },
    { key: 'creativity', label: t('compCreativity') },
    { key: 'problemSolving', label: t('compProblemSolving') },
  ]
  const [competencyRatings, setCompetencyRatings] = useState<Record<string, number>>({})

  const toggleCompetency = (competency: string) => {
    setCompetencyRatings(prev => {
      const next = { ...prev }
      if (competency in next) {
        delete next[competency]
      } else {
        next[competency] = 3 // default rating
      }
      return next
    })
  }

  const setCompetencyRating = (competency: string, value: number) => {
    setCompetencyRatings(prev => ({ ...prev, [competency]: value }))
  }

  useEffect(() => {
    const fetchEndorsement = async () => {
      try {
        const res = await fetch(`/api/endorsements/verify/${token}`)
        if (res.ok) {
          const data = await res.json()
          setEndorsement(data.endorsement)
        } else {
          const data = await res.json()
          setError(data.error || t('invalidLink'))
        }
      } catch {
        setError(t('loadError'))
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      fetchEndorsement()
    }
  }, [token, t])

  const handleSubmit = async (submitAction: 'verify' | 'decline') => {
    setSubmitting(true)
    setAction(submitAction)
    try {
      const res = await fetch(`/api/endorsements/verify/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: submitAction === 'decline' ? 'decline' : 'verify',
          endorsementText,
          rating: rating || undefined,
          grade: grade || undefined,
          skills,
          competencyRatings: Object.keys(competencyRatings).length > 0 ? competencyRatings : undefined,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || t('submitError'))
      }
    } catch {
      setError(t('submitError2'))
    } finally {
      setSubmitting(false)
    }
  }

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('unableToLoad')}</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">
              {t('unableToLoadHint')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            {action === 'verify' ? (
              <>
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('thankYou')}</h2>
                <p className="text-gray-600">
                  {t('thankYouDesc')}
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('responseRecorded')}</h2>
                <p className="text-gray-600">
                  {t('responseRecordedDesc')}
                </p>
              </>
            )}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                {t.rich('aboutIntransparency', { strong: (chunks) => <strong>{chunks}</strong> })}
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={`/professor/dashboard?token=${token}`}>
                  {t('openProfessorPortal')}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!endorsement) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-900">InTransparency</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle')}</h1>
          <p className="text-gray-600 mt-1">{t('pageSubtitle')}</p>
        </div>

        {/* Student & Project Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              {t('studentInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('student')}</p>
                <p className="font-medium">{endorsement.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('university')}</p>
                <p className="font-medium">{endorsement.studentUniversity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('course')}</p>
                <p className="font-medium">{endorsement.courseName} ({endorsement.courseCode})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('semester')}</p>
                <p className="font-medium">{endorsement.semester}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t('project')}: {endorsement.project.title}
            </CardTitle>
            <CardDescription>{endorsement.project.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {endorsement.project.technologies && endorsement.project.technologies.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('technologies')}</p>
                <div className="flex flex-wrap gap-1">
                  {endorsement.project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              {endorsement.project.githubUrl && (
                <a href={endorsement.project.githubUrl} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-primary hover:underline flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> {t('github')}
                </a>
              )}
              {endorsement.project.liveUrl && (
                <a href={endorsement.project.liveUrl} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-primary hover:underline flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> {t('liveDemo')}
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Endorsement Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('yourEndorsement')}</CardTitle>
            <CardDescription>
              {t('yourEndorsementDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Rating */}
            <div>
              <Label>{t('overallRating')}</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rating === 0 ? t('rateClick') :
                 rating <= 2 ? t('rateBelow') :
                 rating === 3 ? t('rateAverage') :
                 rating === 4 ? t('rateAbove') : t('rateExceptional')}
              </p>
            </div>

            {/* Per-Competency Ratings */}
            <div>
              <Label>{t('competencyRatings')}</Label>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                {t('competencyRatingsDesc')}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedCompetencies.map((comp) => {
                  const isActive = comp.key in competencyRatings
                  return (
                    <Badge
                      key={comp.key}
                      variant={isActive ? 'default' : 'outline'}
                      className={`cursor-pointer transition-colors ${
                        isActive ? 'bg-primary hover:bg-blue-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleCompetency(comp.key)}
                    >
                      {comp.label}
                    </Badge>
                  )
                })}
              </div>
              {Object.keys(competencyRatings).length > 0 && (
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  {Array.from(Object.entries(competencyRatings)).map(([comp, val]) => {
                    const labelObj = predefinedCompetencies.find(c => c.key === comp)
                    const displayLabel = labelObj ? labelObj.label : comp
                    return (
                    <div key={comp} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{displayLabel}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCompetencyRating(comp, star)}
                            className="p-0.5 transition-transform"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Written endorsement */}
            <div>
              <Label htmlFor="endorsementText">{t('writtenEndorsement')}</Label>
              <Textarea
                id="endorsementText"
                placeholder={t('writtenPlaceholder')}
                value={endorsementText}
                onChange={(e) => setEndorsementText(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Grade */}
            <div>
              <Label htmlFor="grade">{t('courseGrade')}</Label>
              <Input
                id="grade"
                placeholder={t('gradePlaceholder')}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-1 max-w-xs"
              />
            </div>

            {/* Skills */}
            <div>
              <Label>{t('keySkills')}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder={t('skillsPlaceholder')}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>{t('add')}</Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} &times;
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleSubmit('verify')}
                disabled={submitting}
                className="flex-1 bg-primary hover:bg-green-700"
              >
                {submitting && action === 'verify' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {t('endorseStudent')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit('decline')}
                disabled={submitting}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {submitting && action === 'decline' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {t('decline')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          {t('linkExpires')}
        </p>
      </div>
    </div>
  )
}
