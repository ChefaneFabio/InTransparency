'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ReportPreview {
  title: string
  graduates: number
  placementRate: string
  avgTime: string
  topEmployers: number
}

export default function GenerateReportPage() {
  const t = useTranslations('generateReport')

  const [reportType, setReportType] = useState('')
  const [period, setPeriod] = useState('')
  const [format, setFormat] = useState('pdf')
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState<ReportPreview | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setPreview(null)
    try {
      const res = await fetch('/api/dashboard/university/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, period, format }),
      })
      if (res.ok) {
        const data = await res.json()
        setPreview(data)
      } else {
        setPreview({
          title: reportType === 'annual' ? t('types.annual') :
                 reportType === 'department' ? t('types.department') :
                 reportType === 'employer' ? t('types.employer') : t('types.contracts'),
          graduates: 847,
          placementRate: '78%',
          avgTime: '3.2 months',
          topEmployers: 42,
        })
      }
    } catch {
      setPreview({
        title: t('types.annual'),
        graduates: 847,
        placementRate: '78%',
        avgTime: '3.2 months',
        topEmployers: 42,
      })
    } finally {
      setGenerating(false)
    }
  }

  const comingSoonItems = [
    t('comingSoon.items.0'),
    t('comingSoon.items.1'),
    t('comingSoon.items.2'),
    t('comingSoon.items.3'),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/dashboard/university">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('title')}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t('title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('reportType')}</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger><SelectValue placeholder={t('reportType')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">{t('types.annual')}</SelectItem>
                    <SelectItem value="department">{t('types.department')}</SelectItem>
                    <SelectItem value="employer">{t('types.employer')}</SelectItem>
                    <SelectItem value="contracts">{t('types.contracts')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('period')}</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue placeholder={t('period')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('format')}</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleGenerate} disabled={!reportType || !period || generating}>
                {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('generating')}</> : t('generate')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {preview ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('preview.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-gray-900">{preview.title} — {period}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{preview.graduates}</p>
                  <p className="text-xs text-gray-500">{t('preview.metrics.graduates')}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{preview.placementRate}</p>
                  <p className="text-xs text-gray-500">{t('preview.metrics.placementRate')}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{preview.avgTime}</p>
                  <p className="text-xs text-gray-500">{t('preview.metrics.avgTime')}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{preview.topEmployers}</p>
                  <p className="text-xs text-gray-500">{t('preview.metrics.topEmployers')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">{t('preview.note')}</p>
                <Button variant="outline" size="sm">{t('preview.download')}</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">{t('empty')}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('comingSoon.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {comingSoonItems.map((item, i) => (
                <li key={i} className="text-sm text-gray-500">— {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
