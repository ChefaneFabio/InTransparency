'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const HUBSPOT_MEETING_URL = 'https://meetings-eu1.hubspot.com/fabio-chefane'

export function BookingSection() {
  const t = useTranslations('home.booking')

  return (
    <section className="py-20">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold text-foreground mb-3">
          {t('title')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('subtitle')}
        </p>
        <Button asChild size="lg">
          <a href={HUBSPOT_MEETING_URL} target="_blank" rel="noopener noreferrer">
            {t('cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          {t('note')}
        </p>
      </div>
    </section>
  )
}
