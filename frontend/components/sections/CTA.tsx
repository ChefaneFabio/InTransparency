'use client'

import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useSegment } from '@/lib/segment-context'
import { motion } from 'framer-motion'
import { MobileAppMockup } from '@/components/mockups/MobileAppMockup'

const segmentToKey = {
  students: 'students',
  institutions: 'universities',
  companies: 'companies',
} as const

export function CTA() {
  const t = useTranslations('home.cta')
  const { segment } = useSegment()

  const translationKey = segmentToKey[segment]

  return (
    <section className="py-24 sm:py-32 bg-foreground text-background">
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text + CTA */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {t('title')}{' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h2>
            <p className="mt-5 text-lg text-background/70 max-w-lg">
              {t('subtitle')}
            </p>

            <div className="mt-10">
              <h3 className="text-base font-semibold mb-2">
                {t(`segments.${translationKey}.title`)}
              </h3>
              <p className="text-sm text-background/60 mb-5">
                {t(`segments.${translationKey}.description`)}
              </p>
              <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                <Link href={segment === 'institutions' ? '/contact' : '/auth/register'}>
                  {t(`segments.${translationKey}.cta`)}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: mobile mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <MobileAppMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
