'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import {
  Download,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  MapPin,
} from 'lucide-react'

interface ImportedJob {
  id: string
  title: string
  location: string | null
  department: string | null
}

export default function ImportJobsPage() {
  const t = useTranslations('dashboard.recruiter.importJobs')
  const [url, setUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    companyName: string
    imported: number
    total: number
    jobs: ImportedJob[]
  } | null>(null)
  const [error, setError] = useState('')

  const importJobs = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/dashboard/recruiter/import-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, companyName: companyName || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Import failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {t('importFromUrl')}
          </CardTitle>
          <CardDescription>
            {t('worksWithAnyPage')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">{t('careerPageUrl')}</label>
            <Input
              placeholder="https://company.com/careers or /lavora-con-noi"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">{t('companyNameLabel')}</label>
            <Input
              placeholder="e.g. Satispay"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <Button onClick={importJobs} disabled={!url || loading} className="w-full" size="lg">
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('analyzing')}</>
            ) : (
              <><Download className="mr-2 h-5 w-5" />{t('importJobs')}</>
            )}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card className={result.imported > 0 ? 'border-green-300' : 'border-amber-300'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className={`h-5 w-5 ${result.imported > 0 ? 'text-green-600' : 'text-amber-600'}`} />
              {result.imported > 0 ? `Imported ${result.imported} jobs from ${result.companyName}` : `No jobs found on this page`}
            </CardTitle>
          </CardHeader>
          {result.jobs.length > 0 && (
            <CardContent>
              <div className="space-y-3">
                {result.jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{job.title}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        )}
                        {job.department && <Badge variant="outline" className="text-xs">{job.department}</Badge>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/recruiter/jobs`}>
                        <ExternalLink className="h-3 w-3 mr-1" /> View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
