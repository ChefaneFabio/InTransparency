'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Send,
  Trophy,
  Users,
  XCircle
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Challenge {
  id: string
  title: string
  description: string
  problemStatement?: string
  expectedOutcome?: string
  companyName: string
  companyLogo?: string
  discipline: string
  challengeType: string
  requiredSkills: string[]
  tools: string[]
  teamSizeMin: number
  teamSizeMax: number
  estimatedDuration?: string
  applicationDeadline?: string
  startDate?: string
  endDate?: string
  mentorshipOffered: boolean
  compensation?: string
  equipmentProvided?: string
  status: string
  maxSubmissions: number
  recruiter?: {
    id: string
    firstName?: string
    lastName?: string
    company?: string
    photo?: string
  }
  universityApprovals?: Array<{
    courseName?: string
    courseCode?: string
    semester?: string
    professorName?: string
  }>
  _count?: {
    submissions: number
  }
}

interface Submission {
  id: string
  status: string
  applicationText?: string
  proposalUrl?: string
  submissionTitle?: string
  submissionDescription?: string
  submissionUrl?: string
  documentationUrl?: string
  companyFeedback?: string
  companyRating?: number
  createdAt: string
  submittedAt?: string
}

export default function StudentChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const isIt = locale === 'it'
  const challengeId = params.id as string

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [mySubmission, setMySubmission] = useState<Submission | null>(null)
  const [canApply, setCanApply] = useState(false)
  const [spotsRemaining, setSpotsRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    applicationText: '',
    proposalUrl: '',
    resumeUrl: '',
    isTeamProject: false,
    teamName: '',
    courseName: '',
    courseCode: '',
    semester: ''
  })

  // Work submission form state
  const [submissionForm, setSubmissionForm] = useState({
    submissionTitle: '',
    submissionDescription: '',
    submissionUrl: '',
    documentationUrl: ''
  })

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/student/challenges/${challengeId}`)
      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
        setMySubmission(data.mySubmission)
        setCanApply(data.canApply)
        setSpotsRemaining(data.spotsRemaining)

        if (data.mySubmission) {
          setSubmissionForm({
            submissionTitle: data.mySubmission.submissionTitle || '',
            submissionDescription: data.mySubmission.submissionDescription || '',
            submissionUrl: data.mySubmission.submissionUrl || '',
            documentationUrl: data.mySubmission.documentationUrl || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (challengeId) {
      fetchData()
    }
  }, [challengeId])

  const handleApply = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/challenges/${challengeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationForm)
      })

      if (response.ok) {
        fetchData()
        setShowApplyForm(false)
      }
    } catch (error) {
      console.error('Failed to apply:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitWork = async () => {
    if (!mySubmission) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/submissions/${mySubmission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submissionForm,
          action: 'submit'
        })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to submit work:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleConvertToProject = async () => {
    if (!mySubmission) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/student/submissions/${mySubmission.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        router.push('/dashboard/student/projects')
      }
    } catch (error) {
      console.error('Failed to convert to project:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getSubmissionStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      APPLIED: { label: isIt ? 'Candidato' : 'Applied', className: 'bg-primary/10 text-primary', icon: <Clock className="h-3 w-3" /> },
      SELECTED: { label: isIt ? 'Selezionato' : 'Selected', className: 'bg-primary/10 text-primary', icon: <CheckCircle className="h-3 w-3" /> },
      IN_PROGRESS: { label: isIt ? 'In corso' : 'In Progress', className: 'bg-primary/10 text-primary', icon: <Clock className="h-3 w-3" /> },
      SUBMITTED: { label: isIt ? 'Inviato' : 'Submitted', className: 'bg-orange-100 text-orange-700', icon: <Send className="h-3 w-3" /> },
      REVISION_REQUESTED: { label: isIt ? 'Revisione richiesta' : 'Revision Needed', className: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
      APPROVED: { label: isIt ? 'Approvato' : 'Approved', className: 'bg-primary/10 text-primary', icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { label: isIt ? 'Rifiutato' : 'Rejected', className: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> }
    }
    const config = configs[status] || configs.APPLIED
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">{isIt ? 'Challenge non trovata' : 'Challenge not found'}</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/student/challenges">{isIt ? 'Torna alle challenge' : 'Back to Challenges'}</Link>
        </Button>
      </div>
    )
  }

  const daysUntilDeadline = challenge.applicationDeadline
    ? Math.ceil((new Date(challenge.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pt-2">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/student/challenges">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {isIt ? 'Indietro' : 'Back'}
          </Link>
        </Button>
        <MetricHero gradient="student">
          <div className="flex items-start gap-4">
            {challenge.companyLogo ? (
              <img
                src={challenge.companyLogo}
                alt={challenge.companyName}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground">{challenge.title}</h1>
              <p className="text-muted-foreground mt-1">{challenge.companyName}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{challenge.challengeType.replace(/_/g, ' ')}</Badge>
                {challenge.mentorshipOffered && (
                  <Badge className="bg-primary/5 text-primary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {isIt ? 'Mentorship' : 'Mentorship'}
                  </Badge>
                )}
                {challenge.compensation && (
                  <Badge className="bg-yellow-50 text-yellow-700">{challenge.compensation}</Badge>
                )}
              </div>
            </div>
            {mySubmission && getSubmissionStatusBadge(mySubmission.status)}
          </div>
        </MetricHero>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Details */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4">{isIt ? 'Panoramica della challenge' : 'Challenge Overview'}</h3>
              <div className="space-y-4">
              <p className="text-foreground/80">{challenge.description}</p>

              {challenge.problemStatement && (
                <div>
                  <h4 className="font-medium text-foreground mb-1">{isIt ? 'Problema' : 'Problem Statement'}</h4>
                  <p className="text-foreground/80">{challenge.problemStatement}</p>
                </div>
              )}

              {challenge.expectedOutcome && (
                <div>
                  <h4 className="font-medium text-foreground mb-1">{isIt ? 'Risultato atteso' : 'Expected Outcome'}</h4>
                  <p className="text-foreground/80">{challenge.expectedOutcome}</p>
                </div>
              )}
              </div>
            </div>
          </GlassCard>

          {/* Skills & Tools */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4">{isIt ? 'Competenze e strumenti richiesti' : 'Required Skills & Tools'}</h3>
              <div className="space-y-4">
              {challenge.requiredSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{isIt ? 'Competenze' : 'Skills'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {challenge.tools.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{isIt ? 'Strumenti' : 'Tools'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.tools.map((tool) => (
                      <Badge key={tool} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          </GlassCard>

          {/* My Submission Status */}
          {mySubmission && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{isIt ? 'La tua candidatura' : 'Your Submission'}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isIt ? 'Candidato il' : 'Applied on'} {new Date(mySubmission.createdAt).toLocaleDateString(locale)}
                </p>
                <div className="space-y-4">
                {/* Show submission form for IN_PROGRESS or REVISION_REQUESTED */}
                {['IN_PROGRESS', 'REVISION_REQUESTED', 'SELECTED'].includes(mySubmission.status) && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{isIt ? 'Titolo dell\'elaborato' : 'Submission Title'}</Label>
                      <Input
                        value={submissionForm.submissionTitle}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionTitle: e.target.value })}
                        placeholder={isIt ? 'Titolo del tuo lavoro' : 'Title of your work'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isIt ? 'Descrizione' : 'Description'}</Label>
                      <Textarea
                        value={submissionForm.submissionDescription}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionDescription: e.target.value })}
                        placeholder={isIt ? 'Descrivi la tua soluzione...' : 'Describe your solution...'}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isIt ? 'URL elaborato (GitHub, Demo, ecc.)' : 'Submission URL (GitHub, Demo, etc.)'}</Label>
                      <Input
                        value={submissionForm.submissionUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submissionUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isIt ? 'URL documentazione (opzionale)' : 'Documentation URL (optional)'}</Label>
                      <Input
                        value={submissionForm.documentationUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, documentationUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <Button onClick={handleSubmitWork} disabled={actionLoading || !submissionForm.submissionUrl}>
                      {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Send className="h-4 w-4 mr-2" />
                      {isIt ? 'Invia lavoro' : 'Submit Work'}
                    </Button>
                  </div>
                )}

                {/* Show feedback for APPROVED */}
                {mySubmission.status === 'APPROVED' && (
                  <div className="space-y-4">
                    {mySubmission.companyFeedback && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-medium text-primary mb-2">{isIt ? 'Feedback dell\'azienda' : 'Company Feedback'}</h4>
                        <p className="text-primary">{mySubmission.companyFeedback}</p>
                      </div>
                    )}
                    <Button onClick={handleConvertToProject} disabled={actionLoading}>
                      {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isIt ? 'Aggiungi al portfolio' : 'Add to My Portfolio'}
                    </Button>
                  </div>
                )}

                {/* Waiting states */}
                {mySubmission.status === 'APPLIED' && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-primary">
                      {isIt ? 'La tua candidatura e in valutazione da parte dell\'azienda. Sarai avvisato quando verrai selezionato.' : 'Your application is being reviewed by the company. You will be notified when selected.'}
                    </p>
                  </div>
                )}

                {mySubmission.status === 'SUBMITTED' && (
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-orange-700">
                      {isIt ? 'Il tuo lavoro e stato inviato ed e in revisione da parte dell\'azienda.' : 'Your work has been submitted and is being reviewed by the company.'}
                    </p>
                    {mySubmission.submissionUrl && (
                      <a
                        href={mySubmission.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-600 hover:underline mt-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {isIt ? 'Vedi elaborato' : 'View Submission'}
                      </a>
                    )}
                  </div>
                )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Apply Form */}
          {showApplyForm && !mySubmission && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-4">{isIt ? 'Candidati alla challenge' : 'Apply to Challenge'}</h3>
                <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{isIt ? 'Perche vuoi lavorare a questa challenge? *' : 'Why do you want to work on this challenge? *'}</Label>
                  <Textarea
                    value={applicationForm.applicationText}
                    onChange={(e) => setApplicationForm({ ...applicationForm, applicationText: e.target.value })}
                    placeholder={isIt ? 'Descrivi il tuo interesse e l\'esperienza rilevante...' : 'Describe your interest and relevant experience...'}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isIt ? 'URL proposta (opzionale)' : 'Proposal URL (optional)'}</Label>
                  <Input
                    value={applicationForm.proposalUrl}
                    onChange={(e) => setApplicationForm({ ...applicationForm, proposalUrl: e.target.value })}
                    placeholder={isIt ? 'Link alla tua proposta di progetto' : 'Link to your project proposal'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isIt ? 'URL CV (opzionale)' : 'Resume URL (optional)'}</Label>
                  <Input
                    value={applicationForm.resumeUrl}
                    onChange={(e) => setApplicationForm({ ...applicationForm, resumeUrl: e.target.value })}
                    placeholder={isIt ? 'Link al tuo CV' : 'Link to your resume'}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>{isIt ? 'Progetto di team' : 'Team Project'}</Label>
                    <p className="text-sm text-muted-foreground">{isIt ? 'Ti stai candidando come parte di un team?' : 'Are you applying as part of a team?'}</p>
                  </div>
                  <Switch
                    checked={applicationForm.isTeamProject}
                    onCheckedChange={(checked) => setApplicationForm({ ...applicationForm, isTeamProject: checked })}
                  />
                </div>

                {applicationForm.isTeamProject && (
                  <div className="space-y-2">
                    <Label>{isIt ? 'Nome del team' : 'Team Name'}</Label>
                    <Input
                      value={applicationForm.teamName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, teamName: e.target.value })}
                      placeholder={isIt ? 'Nome del tuo team' : 'Your team name'}
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowApplyForm(false)}>
                    {isIt ? 'Annulla' : 'Cancel'}
                  </Button>
                  <Button onClick={handleApply} disabled={actionLoading || !applicationForm.applicationText}>
                    {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isIt ? 'Invia candidatura' : 'Submit Application'}
                  </Button>
                </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply CTA */}
          {!mySubmission && !showApplyForm && (
            <GlassCard hover={false} gradient="primary">
              <div className="p-5 pt-6 text-center">
                <Trophy className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{isIt ? 'Ti interessa?' : 'Interested?'}</h3>
                {canApply ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      {spotsRemaining} {isIt ? 'posti rimanenti' : 'spots remaining'}
                    </p>
                    <Button className="w-full" onClick={() => setShowApplyForm(true)}>
                      {isIt ? 'Candidati ora' : 'Apply Now'}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {spotsRemaining <= 0
                      ? (isIt ? 'Questa challenge e al completo' : 'This challenge is full')
                      : (isIt ? 'Le candidature sono chiuse' : 'Applications are closed')}
                  </p>
                )}
              </div>
            </GlassCard>
          )}

          {/* Challenge Info */}
          <GlassCard hover={false}>
            <div className="p-5">
              <h3 className="text-base font-semibold mb-4">{isIt ? 'Dettagli challenge' : 'Challenge Details'}</h3>
              <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground/60" />
                <span className="text-muted-foreground">{isIt ? 'Team:' : 'Team:'}</span>
                <span>{challenge.teamSizeMin}-{challenge.teamSizeMax} {isIt ? 'persone' : 'people'}</span>
              </div>
              {challenge.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{isIt ? 'Durata:' : 'Duration:'}</span>
                  <span>{challenge.estimatedDuration}</span>
                </div>
              )}
              {daysUntilDeadline !== null && (
                <div className={`flex items-center gap-2 ${daysUntilDeadline <= 7 ? 'text-orange-600' : ''}`}>
                  <Calendar className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{isIt ? 'Scadenza:' : 'Deadline:'}</span>
                  <span>{daysUntilDeadline > 0 ? `${daysUntilDeadline} ${isIt ? 'giorni rimanenti' : 'days left'}` : (isIt ? 'Scaduta' : 'Passed')}</span>
                </div>
              )}
              {challenge.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{isIt ? 'Inizio:' : 'Starts:'}</span>
                  <span>{new Date(challenge.startDate).toLocaleDateString(locale)}</span>
                </div>
              )}
              </div>
            </div>
          </GlassCard>

          {/* University Approval */}
          {challenge.universityApprovals && challenge.universityApprovals.length > 0 && (
            <GlassCard hover={false}>
              <div className="p-5">
                <h3 className="text-base font-semibold mb-4">{isIt ? 'Crediti formativi' : 'Course Credit'}</h3>
                {challenge.universityApprovals.map((approval, i) => (
                  <div key={i} className="text-sm">
                    {approval.courseCode && <p className="font-medium">{approval.courseCode}</p>}
                    {approval.courseName && <p className="text-muted-foreground">{approval.courseName}</p>}
                    {approval.semester && <p className="text-muted-foreground">{approval.semester}</p>}
                    {approval.professorName && <p className="text-muted-foreground">Prof. {approval.professorName}</p>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
