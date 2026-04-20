'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, CheckCircle, Clock, XCircle, FileText, Award } from 'lucide-react'

interface PriorLearningAssessment {
  id: string
  studentId: string
  studentName: string
  experienceType: string
  description: string
  yearsExperience: number | null
  evidenceUrls: string[]
  recognizedSkills: Array<{ skill: string; level: string; evidence: string }> | null
  creditEquivalent: number | null
  status: string
  reviewerNotes: string | null
  reviewedAt: string | null
  createdAt: string
}

interface Stats {
  total: number
  submitted: number
  underReview: number
  approved: number
  rejected: number
}

export default function PriorLearningPage() {
  const t = useTranslations('priorLearning')
  const [assessments, setAssessments] = useState<PriorLearningAssessment[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  // Review form
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [reviewStatus, setReviewStatus] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewCredits, setReviewCredits] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/prior-learning')
      const data = await res.json()
      setAssessments(data.assessments || [])
      setStats(data.stats || { total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 })
    } catch (err) {
      console.error('Failed to fetch prior learning data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReview = async (assessmentId: string) => {
    if (!reviewStatus) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/prior-learning', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          status: reviewStatus,
          reviewerNotes: reviewNotes || undefined,
          creditEquivalent: reviewCredits ? parseInt(reviewCredits) : undefined,
        }),
      })
      if (res.ok) {
        setReviewingId(null)
        setReviewStatus('')
        setReviewNotes('')
        setReviewCredits('')
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to review assessment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const experienceTypeLabels: Record<string, string> = {
    work: t('experienceTypes.work'),
    self_taught: t('experienceTypes.selfTaught'),
    informal: t('experienceTypes.informal'),
    non_formal: t('experienceTypes.nonFormal'),
  }

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    SUBMITTED: { label: t('status.submitted'), variant: 'secondary' },
    UNDER_REVIEW: { label: t('status.underReview'), variant: 'outline' },
    APPROVED: { label: t('status.approved'), variant: 'default' },
    REJECTED: { label: t('status.rejected'), variant: 'destructive' },
  }

  const filterAssessments = (tab: string) => {
    if (tab === 'pending') return assessments.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW')
    if (tab === 'approved') return assessments.filter((a) => a.status === 'APPROVED')
    return assessments
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT')

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><FileText className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('stats.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.submitted + stats.underReview}</p>
                <p className="text-sm text-muted-foreground">{t('stats.inReview')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">{t('stats.approved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">{t('stats.rejected')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">{t('tabs.pending', { count: stats.submitted + stats.underReview })}</TabsTrigger>
          <TabsTrigger value="approved">{t('tabs.approved', { count: stats.approved })}</TabsTrigger>
          <TabsTrigger value="all">{t('tabs.all', { count: stats.total })}</TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'all'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {filterAssessments(tab).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('empty.noAssessments')}</p>
                </CardContent>
              </Card>
            ) : (
              filterAssessments(tab).map((a) => {
                const cfg = statusConfig[a.status] || { label: a.status, variant: 'outline' as const }
                return (
                  <Card key={a.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{a.studentName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{experienceTypeLabels[a.experienceType] || a.experienceType}</Badge>
                            <Badge variant={cfg.variant}>{cfg.label}</Badge>
                            {a.yearsExperience && (
                              <span className="text-xs text-muted-foreground">{t('labels.years', { count: a.yearsExperience })}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                      </div>

                      <p className="text-sm text-muted-foreground">{a.description}</p>

                      {a.recognizedSkills && Array.isArray(a.recognizedSkills) && a.recognizedSkills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-1">{t('labels.recognizedSkills')}</p>
                          <div className="flex flex-wrap gap-1">
                            {a.recognizedSkills.map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {s.skill} ({s.level})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {a.creditEquivalent && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{t('labels.creditsEquivalent', { count: a.creditEquivalent })}</span>
                        </div>
                      )}

                      {a.reviewerNotes && (
                        <div className="bg-muted/50 rounded p-3">
                          <p className="text-xs font-medium mb-1">{t('labels.reviewerNotes')}</p>
                          <p className="text-sm">{a.reviewerNotes}</p>
                        </div>
                      )}

                      {/* Review form */}
                      {(a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW') && reviewingId !== a.id && (
                        <Button variant="outline" size="sm" onClick={() => { setReviewingId(a.id); setReviewStatus(''); setReviewNotes(''); setReviewCredits('') }}>
                          {t('actions.evaluate')}
                        </Button>
                      )}

                      {reviewingId === a.id && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <p className="text-sm font-medium">{t('reviewForm.heading')}</p>
                          <div className="grid gap-3 md:grid-cols-3">
                            <div>
                              <label className="text-xs font-medium mb-1 block">{t('reviewForm.decisionLabel')}</label>
                              <Select value={reviewStatus} onValueChange={setReviewStatus}>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('reviewForm.selectPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="APPROVED">{t('reviewForm.approve')}</SelectItem>
                                  <SelectItem value="REJECTED">{t('reviewForm.reject')}</SelectItem>
                                  <SelectItem value="UNDER_REVIEW">{t('reviewForm.underReview')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block">{t('reviewForm.creditsLabel')}</label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={reviewCredits}
                                onChange={(e) => setReviewCredits(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block">{t('reviewForm.notesLabel')}</label>
                              <Input
                                placeholder={t('reviewForm.notesPlaceholder')}
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReview(a.id)} disabled={submitting || !reviewStatus}>
                              {submitting ? t('actions.submitting') : t('actions.confirm')}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setReviewingId(null)}>
                              {t('actions.cancel')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
