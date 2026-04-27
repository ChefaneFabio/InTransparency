'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingDown, Clock, Euro, BarChart3, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'

/**
 * Savings calculator for universities.
 *
 * Inputs: student count, career-service FTE headcount, annual events, current
 * placement-tracking tool cost. Outputs: estimated annual savings vs the
 * average university's current stack.
 *
 * Coefficients (`ASSUMPTIONS`) are conservative and surfaced via "show math".
 * All copy resolves through `forUniversities.savings.calculator` (next-intl).
 */

interface Inputs {
  students: number
  staff: number
  events: number
  currentToolAnnualEuros: number
}

const DEFAULTS: Inputs = {
  students: 10000,
  staff: 5,
  events: 120,
  currentToolAnnualEuros: 8000,
}

const ASSUMPTIONS = {
  hoursPerStudentPerYear: 0.4,
  hoursSavedPerEvent: 3,
  hourlyCostEuros: 29,
  automatableShareOfFte: 0.25,
  hoursPerFte: 1800,
}

function currency(n: number, locale: string): string {
  return n.toLocaleString(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export function SavingsCalculator() {
  const t = useTranslations('forUniversities.savings.calculator')
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const [showMath, setShowMath] = useState(false)

  const breakdown = useMemo(() => {
    const studentTrackingHours = inputs.students * ASSUMPTIONS.hoursPerStudentPerYear
    const eventHours = inputs.events * ASSUMPTIONS.hoursSavedPerEvent
    const fteHoursFreed = inputs.staff * ASSUMPTIONS.hoursPerFte * ASSUMPTIONS.automatableShareOfFte
    const totalHoursSaved = studentTrackingHours + eventHours + fteHoursFreed
    const laborSavings = totalHoursSaved * ASSUMPTIONS.hourlyCostEuros
    const toolSavings = inputs.currentToolAnnualEuros
    const total = laborSavings + toolSavings
    return {
      studentTrackingHours,
      eventHours,
      fteHoursFreed,
      totalHoursSaved,
      laborSavings,
      toolSavings,
      total,
    }
  }, [inputs])

  const fmtNumber = (n: number) => Math.round(n).toLocaleString()

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          {t('title')}
        </CardTitle>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label={t('fields.students')}
            value={inputs.students}
            onChange={n => setInputs({ ...inputs, students: n })}
            min={100}
            step={100}
          />
          <Field
            label={t('fields.staff')}
            value={inputs.staff}
            onChange={n => setInputs({ ...inputs, staff: n })}
            min={1}
            step={1}
          />
          <Field
            label={t('fields.events')}
            value={inputs.events}
            onChange={n => setInputs({ ...inputs, events: n })}
            min={0}
            step={5}
          />
          <Field
            label={t('fields.currentTool')}
            value={inputs.currentToolAnnualEuros}
            onChange={n => setInputs({ ...inputs, currentToolAnnualEuros: n })}
            min={0}
            step={500}
          />
        </div>

        {/* Output */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border p-4 bg-emerald-50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-700 mb-2">
              <Clock className="h-3 w-3" />
              {t('outputs.hoursLabel')}
            </div>
            <div className="text-3xl font-bold text-emerald-700">
              {fmtNumber(breakdown.totalHoursSaved)}
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              {t('outputs.hoursSubtitle', {
                fte: (breakdown.totalHoursSaved / ASSUMPTIONS.hoursPerFte).toFixed(1),
              })}
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-blue-50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-700 mb-2">
              <TrendingDown className="h-3 w-3" />
              {t('outputs.laborLabel')}
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {currency(breakdown.laborSavings, 'en-EU')}
            </div>
            <div className="text-xs text-blue-600 mt-1">{t('outputs.laborSubtitle')}</div>
          </div>
          <div className="rounded-xl border p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary mb-2">
              <Euro className="h-3 w-3" />
              {t('outputs.totalLabel')}
            </div>
            <div className="text-3xl font-bold text-primary">{currency(breakdown.total, 'en-EU')}</div>
            <div className="text-xs text-primary/80 mt-1">
              {t('outputs.totalSubtitle', { amount: currency(breakdown.toolSavings, 'en-EU') })}
            </div>
          </div>
        </div>

        {/* Show math */}
        <div className="pt-2">
          <Button variant="ghost" size="sm" onClick={() => setShowMath(v => !v)}>
            <BarChart3 className="h-3 w-3 mr-1" />
            {showMath ? t('math.hide') : t('math.show')}
          </Button>
          {showMath && (
            <div className="mt-3 p-4 bg-muted/40 rounded-lg text-xs space-y-2 text-muted-foreground">
              <div className="font-semibold text-foreground">{t('math.title')}</div>
              <ul className="space-y-1 list-disc pl-5">
                <li>
                  {t.rich('math.items.0', {
                    hours: ASSUMPTIONS.hoursPerStudentPerYear,
                    total: fmtNumber(breakdown.studentTrackingHours),
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich('math.items.1', {
                    hours: ASSUMPTIONS.hoursSavedPerEvent,
                    total: fmtNumber(breakdown.eventHours),
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich('math.items.2', {
                    percent: Math.round(ASSUMPTIONS.automatableShareOfFte * 100),
                    total: fmtNumber(breakdown.fteHoursFreed),
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich('math.items.3', {
                    cost: ASSUMPTIONS.hourlyCostEuros,
                    hours: ASSUMPTIONS.hoursPerFte,
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </li>
              </ul>
              <p className="pt-2 text-xs italic">{t('math.footer')}</p>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button size="lg" asChild>
            <Link href="/contact?role=university">
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Badge variant="outline" className="text-xs">
            {t('badge')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min: number
  step: number
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
