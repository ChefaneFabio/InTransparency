'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { VerificationFlowMockup } from '@/components/mockups/VerificationFlowMockup'
import { AIMatchingMockup } from '@/components/mockups/AIMatchingMockup'
import { AnalyticsMockup } from '@/components/mockups/AnalyticsMockup'

export function TestimonialsSection() {
  const t = useTranslations('home.valueProposition')

  const sections = [
    { mockup: <VerificationFlowMockup />, reverse: false },
    { mockup: <AIMatchingMockup />, reverse: true },
    { mockup: <AnalyticsMockup />, reverse: false },
  ] as const

  const cardKeys = ['students', 'universities', 'companies'] as const

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-20 max-w-5xl mx-auto">
          {cardKeys.map((key, index) => {
            const section = sections[index]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  section.reverse ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Mockup */}
                <div className={section.reverse ? 'lg:order-2' : 'lg:order-1'}>
                  {section.mockup}
                </div>

                {/* Text — short and punchy */}
                <div className={section.reverse ? 'lg:order-1' : 'lg:order-2'}>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                    {t(`cards.${key}.title`)}
                  </h3>
                  <ul className="space-y-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{t(`cards.${key}.benefits.${i}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
