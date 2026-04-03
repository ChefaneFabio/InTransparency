'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'

type StepType = 'intro' | 'followUp' | 'final'

interface SequenceStep {
  id: number
  type: StepType
  delayDays: number
}

const STEP_TYPES: StepType[] = ['intro', 'followUp', 'final']

export default function OutreachPage() {
  const t = useTranslations('recruiterOutreach')
  const [sequenceName, setSequenceName] = useState('')
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: 1, type: 'intro', delayDays: 0 },
  ])
  const [saving, setSaving] = useState(false)
  const [nextId, setNextId] = useState(2)

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { id: nextId, type: 'followUp', delayDays: 3 },
    ])
    setNextId((prev) => prev + 1)
  }

  const updateStepType = (id: number, type: StepType) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, type } : s))
    )
  }

  const updateStepDelay = (id: number, delayDays: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, delayDays } : s))
    )
  }

  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((s) => s.id !== id))
  }

  const handleSave = async () => {
    if (!sequenceName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/recruiter/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sequenceName,
          steps: steps.map(s => ({ type: s.type, subject: '', body: '', delayDays: s.delayDays })),
        }),
      })
      if (res.ok) {
        setSequenceName('')
        setSteps([{ id: 1, type: 'intro', delayDays: 0 }])
        setNextId(2)
      }
    } catch (err) {
      console.error('Failed to save outreach template:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {/* Section 1: Active Sequences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('sequences.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm font-medium text-muted-foreground">
              {t('sequences.empty')}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {t('sequences.emptyDesc')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Create Sequence */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('create.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/80 block mb-1.5">
              {t('create.name')}
            </label>
            <Input
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              placeholder={t('create.namePlaceholder')}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80 block mb-2">
              {t('create.steps')}
            </label>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                >
                  <span className="text-xs font-medium text-muted-foreground/60 w-6">
                    {index + 1}.
                  </span>

                  <select
                    value={step.type}
                    onChange={(e) =>
                      updateStepType(step.id, e.target.value as StepType)
                    }
                    className="text-sm border rounded-md px-2 py-1.5 bg-white flex-1"
                  >
                    {STEP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`create.stepTypes.${type}`)}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      max={30}
                      value={step.delayDays}
                      onChange={(e) =>
                        updateStepDelay(step.id, parseInt(e.target.value) || 0)
                      }
                      className="w-16 text-center text-sm"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {t('create.delay')}
                    </span>
                  </div>

                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(step.id)}
                      className="text-muted-foreground/60 hover:text-red-500 text-sm"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addStep}
              className="mt-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t('create.addStep')}
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !sequenceName.trim()}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            {t('create.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: Coming Soon */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            {t('comingSoon.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-muted-foreground/40 mt-0.5">&#x2022;</span>
                {t(`comingSoon.items.${i}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
