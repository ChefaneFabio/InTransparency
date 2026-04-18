'use client'

import { useEffect, useState } from 'react'
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
  discoveryInsights: any
  stepsCompleted: number
  completedAt: string | null
}

export default function SelfDiscoveryPage() {
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
            Self-Discovery
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Capire chi sei, prima di mostrarti</h1>
          <p className="text-muted-foreground">
            Six steps to understand yourself before companies see your profile. There are no wrong
            answers. Everything here is yours — you choose what to share.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              Step {currentStep} of 6 — {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <p className="text-sm text-muted-foreground">{STEPS[currentStep - 1].description}</p>
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
                  {values.length} selected (aim for 5-7)
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    One sentence each — moments where you were in flow
                  </label>
                  <Textarea
                    value={strengths}
                    onChange={e => setStrengths(e.target.value)}
                    placeholder={'E.g., "I was debugging for 3 hours and loved every minute"\n"I explained a concept and saw the class understand"'}
                    rows={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Activities that energize you</p>
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
                  <p className="text-sm font-medium mb-2">Activities that drain you</p>
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  This step is completed directly on your project pages. Head to your projects and
                  tag roles, skills, and pride ratings on each one, then return here.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/dashboard/student/projects">Go to my projects</a>
                </Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">What motivates you</p>
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
                  <p className="text-sm font-medium mb-2">Dealbreakers</p>
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
                  <label className="text-sm font-medium">Describe an ideal workday</label>
                  <Textarea
                    value={idealDay}
                    onChange={e => setIdealDay(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Where you see yourself in 5 years</label>
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
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <Button onClick={addSkill}>Add</Button>
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
                        <option value={1}>Beginner</option>
                        <option value={2}>Intermediate</option>
                        <option value={3}>Advanced</option>
                        <option value={4}>Expert</option>
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
                      Well-aligned
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
                      <p className="text-sm text-muted-foreground">
                        Not enough verified data yet — complete a stage or verified project.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {profile.discoveryInsights.underestimates?.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        You&apos;re better than you think
                      </h3>
                      <ul className="text-sm space-y-1">
                        {profile.discoveryInsights.underestimates.map((u: any, idx: number) => (
                          <li key={idx}>
                            <strong>{u.skill}:</strong> you rated yourself {u.selfLevel}/4 but
                            your record shows {u.verifiedLevel}/4.
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
                        Skills you didn&apos;t claim
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your verified record shows these — consider adding them to your profile.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.discoveryInsights.unclaimed.map((u: any, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {u.skill} ({u.sources} sources)
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {profile.discoveryInsights.overestimates?.length > 0 && (
                  <Card className="bg-muted">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Areas to deepen</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Not a problem — just a sign of where to get more verified practice.
                      </p>
                      <ul className="text-sm space-y-1">
                        {profile.discoveryInsights.overestimates.map((o: any, idx: number) => (
                          <li key={idx}>
                            <strong>{o.skill}:</strong> self-rated {o.selfLevel}/4, verified{' '}
                            {o.verifiedLevel}/4 — take a stage or verified project to close the gap.
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
            Back
          </Button>
          <Button
            onClick={async () => {
              await saveStep(currentStep)
              if (currentStep < 6) setCurrentStep(currentStep + 1)
            }}
            disabled={saving}
          >
            {saving ? 'Saving…' : currentStep === 6 ? 'Done' : 'Save and continue'}
            {currentStep < 6 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
