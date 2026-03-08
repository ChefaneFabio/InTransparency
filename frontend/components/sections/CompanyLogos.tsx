'use client'

import { useTranslations } from 'next-intl'
import { GraduationCap, Building2, Shield, FileCheck2 } from 'lucide-react'

export function CompanyLogos() {
  const t = useTranslations('socialProof')

  const stats = [
    {
      icon: GraduationCap,
      value: t('stats.universities.value'),
      label: t('stats.universities.label'),
      color: 'text-primary bg-primary/5',
    },
    {
      icon: FileCheck2,
      value: t('stats.profiles.value'),
      label: t('stats.profiles.label'),
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      icon: Shield,
      value: t('stats.verified.value'),
      label: t('stats.verified.label'),
      color: 'text-primary bg-primary/5',
    },
    {
      icon: Building2,
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
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('badges.verified')}
          </div>
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('badges.freeForStudents')}
          </div>
          <div className="px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {t('badges.noSubscription')}
          </div>
        </div>
      </div>
    </section>
  )
}
