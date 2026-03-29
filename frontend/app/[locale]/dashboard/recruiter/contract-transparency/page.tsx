'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function RecruiterContractTransparencyPage() {
  const t = useTranslations('recruiterContractTransparency')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {/* Transparency Badge */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('badge.title')}</CardTitle>
            <Badge className="bg-primary/10 text-primary">{t('badge.status')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('badge.description')}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-sm mb-1">{t(`badge.criteria.${i}.title`)}</h3>
                <p className="text-xs text-muted-foreground">{t(`badge.criteria.${i}.description`)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What candidates see */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('candidateView.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('candidateView.description')}</p>
          <ul className="space-y-2 text-sm">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold flex-shrink-0">✓</span>
                <span>{t(`candidateView.items.${i}`)}</span>
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
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold flex-shrink-0">{i + 1}</span>
                <span>{t(`comingSoon.items.${i}`)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
