'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Building2, Briefcase, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
  const t = useTranslations('home')

  const cardKeys = ['students', 'universities', 'companies'] as const
  const icons = [GraduationCap, Building2, Briefcase]
  const colors = ['text-blue-600', 'text-purple-600', 'text-green-600']
  const bgs = ['bg-blue-100', 'bg-purple-100', 'bg-green-100']

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('valueProposition.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('valueProposition.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cardKeys.map((key, index) => {
            const Icon = icons[index]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl ${bgs[index]} mb-4`}>
                  <Icon className={`h-6 w-6 ${colors[index]}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t(`valueProposition.cards.${key}.title`)}
                </h3>
                <ul className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{t(`valueProposition.cards.${key}.benefits.${i}`)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
