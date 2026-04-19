'use client'

import { useMemo, useState } from 'react'
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
 * Assumptions are conservative and surfaced. Clicking "show math" reveals
 * the exact coefficients so the deal conversation stays honest.
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

// Conservative, defensible assumptions — each has a source-citation plan.
const ASSUMPTIONS = {
  // Average hours/year career services spend on manual placement tracking
  // per active student profile. Conservative — real data suggests higher.
  hoursPerStudentPerYear: 0.4,

  // Hours saved per event using our digital check-in + matching tools
  hoursSavedPerEvent: 3,

  // Fully-loaded hourly cost of a career-services FTE in Italy (€/hr)
  // Based on average €35k salary + ~50% loaded cost ÷ 1800 productive hours
  hourlyCostEuros: 29,

  // Share of staff time currently spent on activities we automate
  automatableShareOfFte: 0.25,

  // Annual FTE hours
  hoursPerFte: 1800,
}

function currency(n: number): string {
  return n.toLocaleString('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export function SavingsCalculator() {
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

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          What your university would save
        </CardTitle>
        <p className="text-muted-foreground">
          Conservative estimate based on your scale. Adjust the inputs; every coefficient is
          defensible and visible below.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Active student profiles"
            value={inputs.students}
            onChange={n => setInputs({ ...inputs, students: n })}
            min={100}
            step={100}
          />
          <Field
            label="Career-services staff (FTE)"
            value={inputs.staff}
            onChange={n => setInputs({ ...inputs, staff: n })}
            min={1}
            step={1}
          />
          <Field
            label="Events per year (orientation, recruiting, panels)"
            value={inputs.events}
            onChange={n => setInputs({ ...inputs, events: n })}
            min={0}
            step={5}
          />
          <Field
            label="Current placement-tool spend (€/yr)"
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
              Staff hours freed / year
            </div>
            <div className="text-3xl font-bold text-emerald-700">
              {Math.round(breakdown.totalHoursSaved).toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              ≈ {(breakdown.totalHoursSaved / ASSUMPTIONS.hoursPerFte).toFixed(1)} FTE equivalent
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-blue-50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-700 mb-2">
              <TrendingDown className="h-3 w-3" />
              Labour cost saved
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {currency(breakdown.laborSavings)}
            </div>
            <div className="text-xs text-blue-600 mt-1">reallocated to high-value work</div>
          </div>
          <div className="rounded-xl border p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary mb-2">
              <Euro className="h-3 w-3" />
              Total annual saving
            </div>
            <div className="text-3xl font-bold text-primary">{currency(breakdown.total)}</div>
            <div className="text-xs text-primary/80 mt-1">
              Includes {currency(breakdown.toolSavings)} tool replacement
            </div>
          </div>
        </div>

        {/* Show math */}
        <div className="pt-2">
          <Button variant="ghost" size="sm" onClick={() => setShowMath(v => !v)}>
            <BarChart3 className="h-3 w-3 mr-1" />
            {showMath ? 'Hide' : 'Show'} the math
          </Button>
          {showMath && (
            <div className="mt-3 p-4 bg-muted/40 rounded-lg text-xs space-y-2 text-muted-foreground">
              <div className="font-semibold text-foreground">Assumptions</div>
              <ul className="space-y-1 list-disc pl-5">
                <li>
                  <strong>{ASSUMPTIONS.hoursPerStudentPerYear} hrs/student/year</strong> currently spent on manual
                  placement tracking → {Math.round(breakdown.studentTrackingHours).toLocaleString()} hrs
                </li>
                <li>
                  <strong>{ASSUMPTIONS.hoursSavedPerEvent} hrs/event</strong> saved via digital check-ins + auto-matching →{' '}
                  {Math.round(breakdown.eventHours).toLocaleString()} hrs
                </li>
                <li>
                  <strong>{(ASSUMPTIONS.automatableShareOfFte * 100).toFixed(0)}%</strong> of each FTE&apos;s time is spent on
                  activities we automate → {Math.round(breakdown.fteHoursFreed).toLocaleString()} hrs
                </li>
                <li>
                  <strong>€{ASSUMPTIONS.hourlyCostEuros}/hr</strong> fully-loaded career-services FTE cost
                  (Italy, avg. €35k salary + 50% loaded cost ÷ {ASSUMPTIONS.hoursPerFte} productive hours)
                </li>
              </ul>
              <p className="pt-2 text-xs italic">
                Coefficients are deliberately conservative. Universities we&apos;ve spoken to often
                report higher manual overhead than these assumptions capture.
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button size="lg" asChild>
            <Link href="/contact?role=university">
              Get a tailored estimate for your institution
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Badge variant="outline" className="text-xs">
            Universities pay nothing — employers fund the platform
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
