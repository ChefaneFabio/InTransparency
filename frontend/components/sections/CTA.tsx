'use client'

import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useSegment } from '@/lib/segment-context'

const segmentToKey = {
  students: 'students',
  institutions: 'universities',
  companies: 'companies',
} as const

export function CTA() {
  const t = useTranslations('home.cta')
  const { segment } = useSegment()

  const segKeys = ['students', 'institutions', 'companies'] as const

  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">
          {t('title')}{' '}
          <span className="text-primary">{t('titleHighlight')}</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {segKeys.map((seg) => {
            const translationKey = segmentToKey[seg]
            const isActive = segment === seg
            return (
              <div
                key={seg}
                className={`rounded-lg p-4 transition-all ${
                  isActive ? 'bg-primary/5 border border-primary/20 ring-1 ring-primary/10' : ''
                }`}
              >
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {t(`segments.${translationKey}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {t(`segments.${translationKey}.description`)}
                </p>
                <Button
                  asChild
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                >
                  <Link href={seg === 'institutions' ? '/contact' : '/auth/register'}>
                    {t(`segments.${translationKey}.cta`)}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
