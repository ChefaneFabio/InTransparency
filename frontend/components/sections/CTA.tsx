'use client'

import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function CTA() {
  const t = useTranslations('home.cta')

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

        {/* Three paths — clean text layout, not 3 big cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {(['students', 'universities', 'companies'] as const).map((seg) => (
            <div key={seg}>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t(`segments.${seg}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {t(`segments.${seg}.description`)}
              </p>
              <Button
                asChild
                variant={seg === 'companies' ? 'default' : 'outline'}
                size="sm"
              >
                <Link href={seg === 'universities' ? '/contact' : '/auth/register'}>
                  {t(`segments.${seg}.cta`)}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
