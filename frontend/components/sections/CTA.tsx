'use client'

import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useSegment } from '@/lib/segment-context'
import { motion } from 'framer-motion'

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
    <section className="py-20 sm:py-28 bg-foreground text-background">
      <div className="container max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t('title')}
            <br />
            <span className="text-primary italic">{t('titleHighlight')}</span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-background/70 max-w-xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="mt-10">
            <p className="text-sm font-medium text-background/50 mb-3">
              {t(`segments.${translationKey}.title`)}
            </p>
            <p className="text-base text-background/60 mb-8 max-w-md mx-auto">
              {t(`segments.${translationKey}.description`)}
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 text-base px-8 py-6">
              <Link href={segment === 'institutions' ? '/contact' : '/auth/register'}>
                {t(`segments.${translationKey}.cta`)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
