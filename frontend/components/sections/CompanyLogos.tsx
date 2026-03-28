'use client'

import { useTranslations } from 'next-intl'

export function CompanyLogos() {
  const t = useTranslations('socialProof')

  const stats = [
    {
      value: t('stats.universities.value'),
      label: t('stats.universities.label'),
      color: 'text-primary bg-primary/5',
    },
    {
      value: t('stats.profiles.value'),
      label: t('stats.profiles.label'),
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      value: t('stats.verified.value'),
      label: t('stats.verified.label'),
      color: 'text-primary bg-primary/5',
    },
    {
      value: t('stats.sectors.value'),
      label: t('stats.sectors.label'),
      color: 'text-primary bg-primary/5',
    },
  ]

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium">
            {t('badges.verified')}
          </div>
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium">
            {t('badges.freeForStudents')}
          </div>
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium">
            {t('badges.noSubscription')}
          </div>
        </div>
      </div>
    </section>
  )
}
