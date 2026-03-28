'use client'

import { motion } from 'framer-motion'
import { GraduationCap, CheckCircle, Zap, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function TrustIndicators() {
  const t = useTranslations('home')

  const features = [
    {
      titleKey: 'trustIndicators.features.0.title' as const,
      descriptionKey: 'trustIndicators.features.0.description' as const,
      icon: CheckCircle,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      titleKey: 'trustIndicators.features.1.title' as const,
      descriptionKey: 'trustIndicators.features.1.description' as const,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      titleKey: 'trustIndicators.features.2.title' as const,
      descriptionKey: 'trustIndicators.features.2.description' as const,
      icon: GraduationCap,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      titleKey: 'trustIndicators.features.3.title' as const,
      descriptionKey: 'trustIndicators.features.3.description' as const,
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container">
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-3`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="text-lg font-semibold text-gray-900">{t(feature.titleKey)}</div>
                <div className="text-sm text-gray-600">{t(feature.descriptionKey)}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <div className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium">
            {t('trustIndicators.badges.freemium')}
          </div>
          <div className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium">
            {t('trustIndicators.badges.gdpr')}
          </div>
          <div className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium">
            {t('trustIndicators.badges.verified')}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
