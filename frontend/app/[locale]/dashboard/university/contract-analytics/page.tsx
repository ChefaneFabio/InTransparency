'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function UniversityContractAnalyticsPage() {
  const t = useTranslations('universityContractAnalytics')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-primary">{t(`stats.${i}.value`)}</p>
              <p className="text-sm text-muted-foreground">{t(`stats.${i}.label`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What this tracks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('tracking.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('tracking.description')}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-sm mb-1">{t(`tracking.items.${i}.title`)}</h3>
                <p className="text-xs text-muted-foreground">{t(`tracking.items.${i}.description`)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Early Warning */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-lg">{t('earlyWarning.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t('earlyWarning.description')}</p>
          <ul className="space-y-2 text-sm">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold flex-shrink-0">!</span>
                <span>{t(`earlyWarning.examples.${i}`)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Coming soon */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">{t('comingSoon.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('comingSoon.description')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
