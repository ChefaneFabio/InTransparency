'use client'

import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const HUBSPOT_MEETING_URL = 'https://meetings-eu1.hubspot.com/fabio-chefane'

export function BookingSection() {
  const t = useTranslations('home.booking')

  return (
    <section className="py-12 sm:py-16">
      <div className="container max-w-3xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-12 sm:p-16 text-center">
          <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-5">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
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
      </div>
    </section>
  )
}
