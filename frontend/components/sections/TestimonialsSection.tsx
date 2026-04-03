'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Shield, Zap, BarChart3 } from 'lucide-react'

export function TestimonialsSection() {
  const t = useTranslations('home.valueProposition')

  const sectionIcons = [
    <div key="v" className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center"><Shield className="h-20 w-20 text-primary/40" /></div>,
    <div key="a" className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl flex items-center justify-center"><Zap className="h-20 w-20 text-purple-400/40" /></div>,
    <div key="b" className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl flex items-center justify-center"><BarChart3 className="h-20 w-20 text-green-400/40" /></div>,
  ]

  const sections = [
    { mockup: sectionIcons[0], reverse: false },
    { mockup: sectionIcons[1], reverse: true },
    { mockup: sectionIcons[2], reverse: false },
  ]

  const cardKeys = ['students', 'universities', 'companies'] as const

  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-foreground sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-24 max-w-5xl mx-auto">
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
                  <h3 className="text-2xl font-bold text-foreground mb-3">
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
