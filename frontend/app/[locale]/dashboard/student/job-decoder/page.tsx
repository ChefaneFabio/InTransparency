'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  FileText,
  Target,
  DollarSign,
  BookOpen,
} from 'lucide-react'

interface DecodedJob {
  roleSummary: string
  requirements: {
    mustHave: string[]
    niceToHave: string[]
    explanation: string
  }
  jargonDecoded: Array<{ term: string; meaning: string }>
  salaryEstimate: { range: string; note: string }
  matchAnalysis: {
    matchPercent: number
    matchingSkills: string[]
    missingSkills: string[]
    verdict: string
  }
  redFlags: string[]
  applicationTips: string[]
}

export default function JobDecoderPage() {
  const t = useTranslations('jobDecoder')

  const [jobText, setJobText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DecodedJob | null>(null)

  const decodeJob = async () => {
    if (jobText.length < 50) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/dashboard/student/decode-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobAdText: jobText }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setResult(data.analysis)
    } catch {
      alert(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t('input.title')}
          </CardTitle>
          <CardDescription>{t('input.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('input.placeholder')}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {jobText.length} / 5000 {t('input.characters')}
            </span>
            <Button onClick={decodeJob} disabled={loading || jobText.length < 50} size="lg">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('input.analyzing')}</>
              ) : (
                <><Search className="mr-2 h-5 w-5" />{t('input.decode')}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Role Summary */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-900">{result.roleSummary}</p>
            </CardContent>
          </Card>

          {/* Match Analysis */}
          <Card className={
            result.matchAnalysis.matchPercent >= 70 ? 'border-green-300' :
            result.matchAnalysis.matchPercent >= 40 ? 'border-amber-300' :
            'border-red-300'
          }>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t('results.yourMatch')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${
                  result.matchAnalysis.matchPercent >= 70 ? 'text-green-600' :
                  result.matchAnalysis.matchPercent >= 40 ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {result.matchAnalysis.matchPercent}%
                </div>
                <Progress value={result.matchAnalysis.matchPercent} className="flex-1 h-3" />
              </div>
              <p className="text-sm text-gray-700">{result.matchAnalysis.verdict}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> {t('results.matching')}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.matchAnalysis.matchingSkills.map((s) => (
                      <Badge key={s} className="bg-green-100 text-green-800 text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> {t('results.missing')}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.matchAnalysis.missingSkills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs border-red-300 text-red-700">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>{t('results.requirements')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">{t('results.mustHave')}</h4>
                <ul className="space-y-1">
                  {result.requirements.mustHave.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">{t('results.niceToHave')}</h4>
                <ul className="space-y-1">
                  {result.requirements.niceToHave.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">{result.requirements.explanation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Jargon Decoded */}
          {result.jargonDecoded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('results.jargon')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.jargonDecoded.map((j, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">{j.term}</Badge>
                      <p className="text-sm text-gray-700">{j.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salary & Red Flags */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  {t('results.salary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">{result.salaryEstimate.range}</div>
                <p className="text-sm text-gray-600">{result.salaryEstimate.note}</p>
              </CardContent>
            </Card>

            {result.redFlags.length > 0 && (
              <Card className="border-amber-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                    {t('results.redFlags')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.redFlags.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                {t('results.tips')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.applicationTips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
