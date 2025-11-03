'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  TrendingDown,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

interface Competitor {
  name: string
  annualCost: number
  features: string[]
}

const competitors: Record<string, Competitor> = {
  linkedinRecruiter: {
    name: 'LinkedIn Recruiter Lite',
    annualCost: 9200, // ~$10,000/year
    features: ['Basic search', 'InMail credits', 'Self-reported profiles', 'Opaque algorithms']
  },
  handshake: {
    name: 'Handshake Premium',
    annualCost: 5000,
    features: ['University network', 'Student search', 'Self-reported data', 'US-focused']
  },
  greenhouse: {
    name: 'Greenhouse ATS',
    annualCost: 8000,
    features: ['Applicant tracking', 'Custom workflows', 'Integrations', 'Annual contract']
  }
}

interface SavingsCalculatorProps {
  defaultHires?: number
  competitor?: 'linkedinRecruiter' | 'handshake' | 'greenhouse'
  showComparison?: boolean
  className?: string
}

export function SavingsCalculator({
  defaultHires = 10,
  competitor = 'linkedinRecruiter',
  showComparison = true,
  className = ''
}: SavingsCalculatorProps) {
  const [hiresPerYear, setHiresPerYear] = useState(defaultHires)

  const competitorData = competitors[competitor]
  const COST_PER_CONTACT = 10 // €10 per contact

  const calculations = useMemo(() => {
    const competitorCost = competitorData.annualCost
    const ourCost = hiresPerYear * COST_PER_CONTACT
    const savings = competitorCost - ourCost
    const savingsPercentage = Math.round((savings / competitorCost) * 100)

    return {
      competitorCost,
      ourCost,
      savings,
      savingsPercentage,
      contactsNeeded: Math.ceil(competitorCost / COST_PER_CONTACT)
    }
  }, [hiresPerYear, competitorData])

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-blue-600" />
          Calculate Your Savings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          See how much you'll save compared to traditional recruiting platforms
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Hire Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              How many candidates do you contact per year?
            </label>
            <Badge variant="secondary" className="text-lg font-bold px-3">
              {hiresPerYear}
            </Badge>
          </div>

          <Slider
            value={[hiresPerYear]}
            onValueChange={(value) => setHiresPerYear(value[0])}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 hire</span>
            <span>100+ hires</span>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="space-y-3">
          {/* Competitor Cost */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-900">
                {competitorData.name}
              </span>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(calculations.competitorCost)}
              </span>
            </div>
            <p className="text-xs text-red-700">
              Fixed annual subscription • {hiresPerYear} contacts = {formatCurrency(Math.round(calculations.competitorCost / hiresPerYear))} per contact
            </p>
          </div>

          {/* Our Cost */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">
                InTransparency
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(calculations.ourCost)}
              </span>
            </div>
            <p className="text-xs text-green-700">
              Pay-per-contact • {hiresPerYear} contacts × €10 = {formatCurrency(calculations.ourCost)}
            </p>
          </div>

          {/* Savings */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">YOUR TOTAL SAVINGS</p>
                <p className="text-4xl font-bold text-blue-600">
                  {formatCurrency(calculations.savings)}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  That's <strong>{calculations.savingsPercentage}% cheaper</strong> than {competitorData.name}!
                </p>
              </div>
              <div className="text-center bg-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-green-500">
                <div>
                  <p className="text-2xl font-bold text-green-600">{calculations.savingsPercentage}%</p>
                  <p className="text-xs text-green-700">OFF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You Can Do With Savings */}
        {calculations.savings > 1000 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              What you can do with {formatCurrency(calculations.savings)}:
            </p>
            <ul className="space-y-1 text-sm text-purple-800">
              {calculations.savings >= 5000 && (
                <li>• Hire a full-time junior developer for 2-3 months</li>
              )}
              {calculations.savings >= 3000 && (
                <li>• Launch a marketing campaign to attract better candidates</li>
              )}
              {calculations.savings >= 1000 && (
                <li>• Invest in employee training and development</li>
              )}
              <li>• Expand your recruiting budget by {calculations.savingsPercentage}%</li>
            </ul>
          </div>
        )}

        {/* Feature Comparison */}
        {showComparison && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">What you get with InTransparency:</h4>
            <div className="grid gap-2">
              {[
                'Institution-verified profiles (can\'t fake)',
                'Video presentations (see communication skills)',
                'Verified grades and projects',
                'Integrated skills testing',
                'Pay only for contacts you make',
                'No annual contracts or commitments'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Start Free Trial
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Break-even Note */}
        {calculations.contactsNeeded > hiresPerYear && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-800">
              💡 <strong>Pro tip:</strong> You'd need to contact{' '}
              <strong>{calculations.contactsNeeded} candidates</strong> before InTransparency
              becomes more expensive than {competitorData.name}. Most recruiters contact fewer than 50 per year!
            </p>
          </div>
        )}

        {/* Competitor Selector */}
        <div className="flex gap-2 flex-wrap justify-center">
          <p className="text-xs text-muted-foreground w-full text-center mb-2">
            Compare with:
          </p>
          {Object.entries(competitors).map(([key, comp]) => (
            <Button
              key={key}
              variant={competitor === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHiresPerYear(defaultHires)} // Reset when switching
              className="text-xs"
            >
              {comp.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for landing page hero
export function SavingsCalculatorCompact({ className = '' }: { className?: string }) {
  const [hires, setHires] = useState(12)
  const linkedinCost = 9200
  const ourCost = hires * 10
  const savings = linkedinCost - ourCost
  const savingsPercent = Math.round((savings / linkedinCost) * 100)

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4 text-center">Calculate Your Savings</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Contacts per year: <strong>{hires}</strong>
          </label>
          <Slider
            value={[hires]}
            onValueChange={(v) => setHires(v[0])}
            min={1}
            max={50}
            className="w-full"
          />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">LinkedIn Recruiter:</span>
            <span className="font-semibold">€{linkedinCost.toLocaleString()}/year</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>InTransparency:</span>
            <span className="font-semibold">€{ourCost}/year</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg">
            <span className="font-bold">You Save:</span>
            <span className="font-bold text-blue-600">
              €{savings.toLocaleString()} ({savingsPercent}%)
            </span>
          </div>
        </div>

        <Button className="w-full">
          Start Free Trial
        </Button>
      </div>
    </div>
  )
}
