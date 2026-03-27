'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Search,
  Lightbulb,
  ArrowRight,
  Loader2,
  Info,
} from 'lucide-react'

interface RedFlag {
  severity: 'critical' | 'warning'
  message: string
  detail: string
}

interface ContractCheckResult {
  contractType: {
    key: string
    nameIT: string
    nameEN: string
    riskLevel: 'low' | 'medium' | 'high'
    maxDuration: number | null
    typicalForJuniors: boolean
  }
  assessment: {
    overallRisk: 'low' | 'medium' | 'high'
    overallMessage: string
    criticalFlags: number
    warningFlags: number
  }
  redFlags: RedFlag[]
  payFairness: {
    status: 'fair' | 'low' | 'below_minimum' | 'unknown'
    detail: string
    ccnlMinimum?: number
  }
  rights: Record<string, boolean>
  tips: string[]
}

const CONTRACT_TYPES = [
  { value: 'tempo_indeterminato', label: 'Tempo Indeterminato', labelEN: 'Permanent' },
  { value: 'tempo_determinato', label: 'Tempo Determinato', labelEN: 'Fixed-Term' },
  { value: 'apprendistato', label: 'Apprendistato', labelEN: 'Apprenticeship' },
  { value: 'stage', label: 'Stage Extracurriculare', labelEN: 'Extracurricular Internship' },
  { value: 'tirocinio', label: 'Tirocinio Curriculare', labelEN: 'Curricular Internship' },
  { value: 'partita_iva', label: 'Partita IVA', labelEN: 'Freelance / Self-Employment' },
  { value: 'cococo', label: 'Co.Co.Co.', labelEN: 'Coordinated Collaboration' },
  { value: 'somministrazione', label: 'Somministrazione', labelEN: 'Agency Work' },
  { value: 'collaborazione_occasionale', label: 'Collaborazione Occasionale', labelEN: 'Occasional Collaboration' },
]

const CCNL_OPTIONS = [
  { value: 'commercio', label: 'Commercio' },
  { value: 'metalmeccanico', label: 'Metalmeccanico' },
  { value: 'terziario', label: 'Terziario' },
  { value: 'informatica', label: 'Informatica / TLC' },
  { value: 'studi_professionali', label: 'Studi Professionali' },
]

export default function ContractTransparencyPage() {
  const t = useTranslations('contractTransparency')

  // Checker form state
  const [contractType, setContractType] = useState('')
  const [ccnl, setCcnl] = useState('')
  const [livello, setLivello] = useState('')
  const [ralOffered, setRalOffered] = useState('')
  const [monthlyNet, setMonthlyNet] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [durationMonths, setDurationMonths] = useState('')
  const [hasFixedSchedule, setHasFixedSchedule] = useState<boolean | undefined>(undefined)
  const [worksOnSite, setWorksOnSite] = useState<boolean | undefined>(undefined)
  const [providesOwnTools, setProvidesOwnTools] = useState<boolean | undefined>(undefined)
  const [hasExclusivity, setHasExclusivity] = useState<boolean | undefined>(undefined)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ContractCheckResult | null>(null)

  const handleCheck = async () => {
    if (!contractType) return
    setLoading(true)
    setResult(null)

    try {
      const body: Record<string, unknown> = { contractType }
      if (ccnl) body.ccnl = ccnl
      if (livello) body.livello = livello
      if (ralOffered) body.ralOffered = Number(ralOffered)
      if (monthlyNet) body.monthlyNet = Number(monthlyNet)
      if (hoursPerWeek) body.hoursPerWeek = Number(hoursPerWeek)
      if (durationMonths) body.durationMonths = Number(durationMonths)
      if (hasFixedSchedule !== undefined) body.hasFixedSchedule = hasFixedSchedule
      if (worksOnSite !== undefined) body.worksOnSite = worksOnSite
      if (providesOwnTools !== undefined) body.providesOwnTools = providesOwnTools
      if (hasExclusivity !== undefined) body.hasExclusivity = hasExclusivity

      const res = await fetch('/api/dashboard/student/contract-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Check failed')
      const data = await res.json()
      setResult(data)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFreelanceType = contractType === 'partita_iva' || contractType === 'cococo'
  const isInternship = contractType === 'stage' || contractType === 'tirocinio'

  const RIGHTS_LABELS: Record<string, { label: string; description: string }> = {
    minimumPay: { label: t('rights.minimumPay'), description: t('rights.minimumPayDesc') },
    tfr: { label: t('rights.tfr'), description: t('rights.tfrDesc') },
    sickLeave: { label: t('rights.sickLeave'), description: t('rights.sickLeaveDesc') },
    paidVacation: { label: t('rights.paidVacation'), description: t('rights.paidVacationDesc') },
    unemploymentBenefits: { label: t('rights.unemployment'), description: t('rights.unemploymentDesc') },
    pensionContributions: { label: t('rights.pension'), description: t('rights.pensionDesc') },
    noticePeriod: { label: t('rights.noticePeriod'), description: t('rights.noticePeriodDesc') },
    overtimeProtection: { label: t('rights.overtime'), description: t('rights.overtimeDesc') },
    maternityPaternity: { label: t('rights.maternity'), description: t('rights.maternityDesc') },
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <Tabs defaultValue="checker" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checker" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t('tabs.checker')}
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('tabs.guide')}
          </TabsTrigger>
          <TabsTrigger value="redflags" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('tabs.redFlags')}
          </TabsTrigger>
        </TabsList>

        {/* ─── CONTRACT CHECKER ─── */}
        <TabsContent value="checker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t('checker.title')}
              </CardTitle>
              <CardDescription>{t('checker.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.contractType')} *</label>
                <select
                  value={contractType}
                  onChange={(e) => { setContractType(e.target.value); setResult(null) }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t('checker.selectType')}</option>
                  {CONTRACT_TYPES.map(ct => (
                    <option key={ct.value} value={ct.value}>{ct.label} ({ct.labelEN})</option>
                  ))}
                </select>
              </div>

              {/* CCNL & Livello — only for employment contracts */}
              {contractType && !isFreelanceType && !isInternship && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.ccnl')}</label>
                    <select
                      value={ccnl}
                      onChange={(e) => setCcnl(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t('checker.selectCcnl')}</option>
                      {CCNL_OPTIONS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.livello')}</label>
                    <Input
                      placeholder={t('checker.livelloPlaceholder')}
                      value={livello}
                      onChange={(e) => setLivello(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Pay */}
              <div className="grid grid-cols-2 gap-4">
                {!isInternship && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.ral')}</label>
                    <Input
                      type="number"
                      placeholder="e.g. 24000"
                      value={ralOffered}
                      onChange={(e) => setRalOffered(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.monthlyNet')}</label>
                  <Input
                    type="number"
                    placeholder="e.g. 1400"
                    value={monthlyNet}
                    onChange={(e) => setMonthlyNet(e.target.value)}
                  />
                </div>
              </div>

              {/* Hours & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.hours')}</label>
                  <Input
                    type="number"
                    placeholder="e.g. 40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('checker.duration')}</label>
                  <Input
                    type="number"
                    placeholder="e.g. 12"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                  />
                </div>
              </div>

              {/* Freelance-specific questions */}
              {isFreelanceType && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-amber-900">{t('checker.freelanceQuestions')}</p>
                  {[
                    { label: t('checker.fixedSchedule'), state: hasFixedSchedule, setter: setHasFixedSchedule },
                    { label: t('checker.worksOnSite'), state: worksOnSite, setter: setWorksOnSite },
                    { label: t('checker.ownTools'), state: providesOwnTools, setter: setProvidesOwnTools },
                    { label: t('checker.exclusivity'), state: hasExclusivity, setter: setHasExclusivity },
                  ].map((q) => (
                    <div key={q.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{q.label}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => q.setter(true)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            q.state === true ? 'bg-amber-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {t('checker.yes')}
                        </button>
                        <button
                          onClick={() => q.setter(false)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            q.state === false ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {t('checker.no')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleCheck}
                disabled={!contractType || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('checker.checking')}</>
                ) : (
                  <><Shield className="mr-2 h-5 w-5" />{t('checker.checkButton')}</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <Card className={
                result.assessment.overallRisk === 'high' ? 'border-red-300 bg-red-50' :
                result.assessment.overallRisk === 'medium' ? 'border-amber-300 bg-amber-50' :
                'border-green-300 bg-green-50'
              }>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      result.assessment.overallRisk === 'high' ? 'bg-red-100' :
                      result.assessment.overallRisk === 'medium' ? 'bg-amber-100' :
                      'bg-green-100'
                    }`}>
                      {result.assessment.overallRisk === 'high' ? (
                        <XCircle className="h-8 w-8 text-red-600" />
                      ) : result.assessment.overallRisk === 'medium' ? (
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {result.contractType.nameIT}
                        <Badge className="ml-3" variant={
                          result.assessment.overallRisk === 'high' ? 'destructive' :
                          result.assessment.overallRisk === 'medium' ? 'outline' :
                          'default'
                        }>
                          {t(`risk.${result.assessment.overallRisk}`)}
                        </Badge>
                      </h3>
                      <p className="text-gray-700 mt-1">{result.assessment.overallMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Red Flags */}
              {result.redFlags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      {t('results.redFlags')} ({result.redFlags.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.redFlags.map((flag, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          flag.severity === 'critical'
                            ? 'border-red-200 bg-red-50'
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {flag.severity === 'critical' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          )}
                          <span className="font-semibold text-gray-900">{flag.message}</span>
                          <Badge variant={flag.severity === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                            {flag.severity === 'critical' ? t('severity.critical') : t('severity.warning')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 ml-7">{flag.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Pay Fairness */}
              {result.payFairness.status !== 'unknown' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('results.payFairness')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg ${
                      result.payFairness.status === 'fair' ? 'bg-green-50 border border-green-200' :
                      result.payFairness.status === 'below_minimum' ? 'bg-red-50 border border-red-200' :
                      'bg-amber-50 border border-amber-200'
                    }`}>
                      <p className="text-sm text-gray-700">{result.payFairness.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Your Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('results.yourRights')}
                  </CardTitle>
                  <CardDescription>{t('results.yourRightsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(result.rights).map(([key, hasRight]) => {
                      const meta = RIGHTS_LABELS[key]
                      if (!meta) return null
                      return (
                        <div key={key} className={`flex items-start gap-3 p-3 rounded-lg ${hasRight ? 'bg-green-50' : 'bg-gray-50'}`}>
                          {hasRight ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-sm text-gray-900">{meta.label}</div>
                            <div className="text-xs text-gray-600">{meta.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              {result.tips.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      {t('results.tips')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* ─── CONTRACT GUIDE ─── */}
        <TabsContent value="guide" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('guide.title')}</h2>
            <p className="text-gray-600">{t('guide.subtitle')}</p>
          </div>

          {CONTRACT_TYPES.map((ct) => {
            const key = ct.value as string
            return (
              <Card key={key} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{ct.label}</CardTitle>
                    <Badge variant="outline" className="text-xs">{ct.labelEN}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">{t(`guide.types.${key}.description`)}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {[
                      { label: t('guide.labels.protection'), value: t(`guide.types.${key}.protection`) },
                      { label: t('guide.labels.typicalDuration'), value: t(`guide.types.${key}.duration`) },
                      { label: t('guide.labels.bestFor'), value: t(`guide.types.${key}.bestFor`) },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded p-2">
                        <div className="text-gray-500 mb-0.5">{item.label}</div>
                        <div className="font-medium text-gray-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ─── RED FLAGS ─── */}
        <TabsContent value="redflags" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('redFlags.title')}</h2>
            <p className="text-gray-600">{t('redFlags.subtitle')}</p>
          </div>

          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-l-4 border-l-red-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  {t(`redFlags.items.${i}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{t(`redFlags.items.${i}.description`)}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{t('redFlags.whatToDo')}</span>
                  </div>
                  <p className="text-sm text-green-700">{t(`redFlags.items.${i}.action`)}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Sindacato CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-white/90" />
              <h3 className="text-xl font-bold mb-2">{t('redFlags.unionTitle')}</h3>
              <p className="text-white/80 mb-4 text-sm">{t('redFlags.unionDescription')}</p>
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                <Badge className="bg-white/20 text-white border-white/30">CGIL</Badge>
                <Badge className="bg-white/20 text-white border-white/30">CISL</Badge>
                <Badge className="bg-white/20 text-white border-white/30">UIL</Badge>
                <Badge className="bg-white/20 text-white border-white/30">Nidil</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
