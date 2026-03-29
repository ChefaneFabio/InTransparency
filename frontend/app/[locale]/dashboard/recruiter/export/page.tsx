'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { Loader2 } from 'lucide-react'

const EXPORT_KEYS = ['savedCandidates', 'pipeline', 'analytics', 'evaluations'] as const

export default function RecruiterExportPage() {
  const t = useTranslations('recruiterExport')
  const [exporting, setExporting] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const handleExport = async (key: string) => {
    setExporting(key)
    setToast(null)
    // Simulate a brief delay then show coming soon
    await new Promise((resolve) => setTimeout(resolve, 800))
    setToast(t('comingSoonExport'))
    setExporting(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {toast && (
        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {toast}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {EXPORT_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg">{t(`exports.${key}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t(`exports.${key}.description`)}
              </p>
              <Button
                onClick={() => handleExport(key)}
                disabled={exporting !== null}
                variant="outline"
                size="sm"
              >
                {exporting === key ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t(`exports.${key}.button`)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('scheduled.title')}
            <Badge variant="outline">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                {t(`scheduled.items.${i}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('api.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('api.description')}</p>
          <Link href="/developers">
            <Button variant="outline" size="sm">
              {t('api.button')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
