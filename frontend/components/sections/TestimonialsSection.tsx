'use client'

import { GraduationCap, Building2, Briefcase } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
  const t = useTranslations('home')

  const cardKeys = ['students', 'universities', 'companies'] as const
  const icons = [GraduationCap, Building2, Briefcase]

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-display font-bold text-foreground sm:text-4xl">
            {t('valueProposition.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('valueProposition.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cardKeys.map((key, index) => {
            const Icon = icons[index]
            return (
              <div
                key={key}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t(`valueProposition.cards.${key}.title`)}
                </h3>
                <ul className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      <span>{t(`valueProposition.cards.${key}.benefits.${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
