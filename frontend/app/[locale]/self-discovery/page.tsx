'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, ChevronRight, ChevronLeft, Sparkles, AlertCircle, TrendingUp } from 'lucide-react'
import {
  CORE_VALUES,
  MOTIVATIONS,
  DEALBREAKERS,
  ENERGIZING_ACTIVITIES,
  STEPS,
} from '@/lib/self-discovery'
import ProjectTaggingStep, { type ProjectTagsMap } from '@/components/student/ProjectTaggingStep'

interface DiscoveryProfile {
  coreValues: string[]
  strengths: string[]
  energizingActivities: string[]
  drainingActivities: string[]
  motivations: string[]
  dealbreakers: string[]
  idealDayNarrative: string | null
  fiveYearNarrative: string | null
  selfAssessedSkills: Array<{ skill: string; level: number; evidence?: string }> | null
  projectTags: ProjectTagsMap | null
  discoveryInsights: any
  stepsCompleted: number
  completedAt: string | null
}

export default function SelfDiscoveryPage() {
  const t = useTranslations('selfDiscovery')
  const [profile, setProfile] = useState<DiscoveryProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step-local state
  const [values, setValues] = useState<string[]>([])
  const [strengths, setStrengths] = useState('')
  const [energizing, setEnergizing] = useState<string[]>([])
  const [draining, setDraining] = useState<string[]>([])
  const [motivations, setMotivations] = useState<string[]>([])
  const [dealbreakers, setDealbreakers] = useState<string[]>([])
  const [idealDay, setIdealDay] = useState('')
  const [fiveYear, setFiveYear] = useState('')
  const [selfSkills, setSelfSkills] = useState<Array<{ skill: string; level: number }>>([])
  const [newSkill, setNewSkill] = useState('')
  const [projectTags, setProjectTags] = useState<ProjectTagsMap>({})

  useEffect(() => {
    fetch('/api/student/self-discovery')
      .then(r => r.json())
      .then(data => {
        const p = data.profile
        if (p) {
          setProfile(p)
          setValues(p.coreValues ?? [])
          setStrengths((p.strengths ?? []).join('\n'))
          setEnergizing(p.energizingActivities ?? [])
          setDraining(p.drainingActivities ?? [])
          setMotivations(p.motivations ?? [])
          setDealbreakers(p.dealbreakers ?? [])
          setIdealDay(p.idealDayNarrative ?? '')
          setFiveYear(p.fiveYearNarrative ?? '')
          setSelfSkills(p.selfAssessedSkills ?? [])
          setProjectTags((p.projectTags as ProjectTagsMap) ?? {})
          setCurrentStep(Math.min(6, (p.stepsCompleted ?? 0) + 1))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const saveStep = async (step: number) => {
    setSaving(true)
    const data: any = {}
    if (step === 1) data.coreValues = values
    if (step === 2) {
      data.strengths = strengths.split('\n').map(s => s.trim()).filter(Boolean)
      data.energizingActivities = energizing
      data.drainingActivities = draining
    }
    if (step === 3) data.projectTags = projectTags
    if (step === 4) {
      data.motivations = motivations
      data.dealbreakers = dealbreakers
      data.idealDayNarrative = idealDay || null
      data.fiveYearNarrative = fiveYear || null
    }
    if (step === 5) data.selfAssessedSkills = selfSkills
    const res = await fetch('/api/student/self-discovery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, data }),
    })
    const body = await res.json()
    if (body.profile) setProfile(body.profile)
    setSaving(false)
  }

  const toggle = (arr: string[], setter: (v: string[]) => void, item: string) => {
    setter(arr.includes(item) ? arr.filter(a => a !== item) : [...arr, item])
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setSelfSkills([...selfSkills, { skill: newSkill.trim(), level: 2 }])
    setNewSkill('')
  }

  const progress = Math.round(((profile?.stepsCompleted ?? 0) / 6) * 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-6">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {t('badge')}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('intro')}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>{t('progress')}</span>
            <span>{t('progressCount', { current: currentStep, total: 6, percent: progress })}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t(`steps.${STEPS[currentStep - 1].key}.title` as any)}</CardTitle>
            <p className="text-sm text-muted-foreground">{t(`steps.${STEPS[currentStep - 1].key}.description` as any)}</p>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="flex flex-wrap gap-2">
                {CORE_VALUES.map(v => (
                  <Badge
                    key={v}
                    variant={values.includes(v) ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggle(values, setValues, v)}
                  >
                    {v}
                  </Badge>
                ))}
                <p className="w-full text-xs text-muted-foreground mt-2">
                  {t('steps.values.countSelected', { count: values.length })}
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('steps.strengths.flowLabel')}</label>
                  <Textarea
                    value={strengths}
                    onChange={e => setStrengths(e.target.value)}
                    placeholder={t('steps.strengths.flowPlaceholder')}
                    rows={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{t('steps.strengths.energizing')}</p>
                  <div className="flex flex-wrap gap-2">
                    {ENERGIZING_ACTIVITIES.map(a => (
                      <Badge
                        key={a}
                        variant={energizing.includes(a) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggle(energizing, setEnergizing, a)}
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{t('steps.strengths.draining')}</p>
                  <div className="flex flex-wrap gap-2">
                    {ENERGIZING_ACTIVITIES.map(a => (
                      <Badge
                        key={a}
                        variant={draining.includes(a) ? 'destructive' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggle(draining, setDraining, a)}
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <ProjectTaggingStep value={projectTags} onChange={setProjectTags} />
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">{t('steps.interests.motivations')}</p>
                  <div className="flex flex-wrap gap-2">
                    {MOTIVATIONS.map(m => (
                      <Badge
                        key={m}
                        variant={motivations.includes(m) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggle(motivations, setMotivations, m)}
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{t('steps.interests.dealbreakers')}</p>
                  <div className="flex flex-wrap gap-2">
                    {DEALBREAKERS.map(d => (
                      <Badge
                        key={d}
                        variant={dealbreakers.includes(d) ? 'destructive' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggle(dealbreakers, setDealbreakers, d)}
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('steps.interests.idealDayLabel')}</label>
                  <Textarea
                    value={idealDay}
                    onChange={e => setIdealDay(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('steps.interests.fiveYearLabel')}</label>
                  <Textarea
                    value={fiveYear}
                    onChange={e => setFiveYear(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder={t('steps.skills.addPlaceholder')}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <Button onClick={addSkill}>{t('steps.skills.addButton')}</Button>
                </div>
                <div className="space-y-2">
                  {selfSkills.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded">
                      <span className="flex-1 font-medium">{s.skill}</span>
                      <select
                        value={s.level}
                        onChange={e => {
                          const next = [...selfSkills]
                          next[idx] = { ...s, level: parseInt(e.target.value) }
                          setSelfSkills(next)
                        }}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value={1}>{t('steps.skills.levels.beginner')}</option>
                        <option value={2}>{t('steps.skills.levels.intermediate')}</option>
                        <option value={3}>{t('steps.skills.levels.advanced')}</option>
                        <option value={4}>{t('steps.skills.levels.expert')}</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelfSkills(selfSkills.filter((_, i) => i !== idx))}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 6 && profile?.discoveryInsights && (
              <div className="space-y-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {t('steps.reconcile.aligned')}
                    </h3>
                    {profile.discoveryInsights.aligned?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.discoveryInsights.aligned.map((a: any, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {a.skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('steps.reconcile.alignedEmpty')}</p>
                    )}
                  </CardContent>
                </Card>

                {profile.discoveryInsights.underestimates?.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        {t('steps.reconcile.underrated')}
                      </h3>
                      <ul className="text-sm space-y-1">
                        {profile.discoveryInsights.underestimates.map((u: any, idx: number) => (
                          <li key={idx}>
                            {t('steps.reconcile.underratedLine', { skill: u.skill, self: u.selfLevel, verified: u.verifiedLevel })}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {profile.discoveryInsights.unclaimed?.length > 0 && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        {t('steps.reconcile.unclaimed')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{t('steps.reconcile.unclaimedIntro')}</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.discoveryInsights.unclaimed.map((u: any, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {t('steps.reconcile.unclaimedBadge', { skill: u.skill, sources: u.sources })}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {profile.discoveryInsights.overestimates?.length > 0 && (
                  <Card className="bg-muted">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('steps.reconcile.overrated')}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{t('steps.reconcile.overratedIntro')}</p>
                      <ul className="text-sm space-y-1">
                        {profile.discoveryInsights.overestimates.map((o: any, idx: number) => (
                          <li key={idx}>
                            {t('steps.reconcile.overratedLine', { skill: o.skill, self: o.selfLevel, verified: o.verifiedLevel })}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('nav.back')}
          </Button>
          <Button
            onClick={async () => {
              await saveStep(currentStep)
              if (currentStep < 6) setCurrentStep(currentStep + 1)
            }}
            disabled={saving}
          >
            {saving ? t('nav.saving') : currentStep === 6 ? t('nav.done') : t('nav.continue')}
            {currentStep < 6 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
