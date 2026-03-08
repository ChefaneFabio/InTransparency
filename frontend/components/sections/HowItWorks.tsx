'use client'

import { Upload, Brain, Target } from 'lucide-react'
import { useTranslations } from 'next-intl'

const stepIcons = [Upload, Brain, Target]

export function HowItWorks() {
  const t = useTranslations('home.howItWorksPage')

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-foreground sm:text-4xl">
            {t('title')}{' '}
            <span className="text-primary">{t('titleHighlight')}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps — static layout, no carousel */}
        <div className="space-y-12">
          {[0, 1, 2].map((index) => {
            const Icon = stepIcons[index]
            const statsObj = t.raw(`steps.${index}.stats`) as Record<string, string>
            const statsEntries = Object.entries(statsObj)

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-6"
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                  <span className="text-4xl font-display font-bold text-primary/20 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t(`steps.${index}.title`)}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t(`steps.${index}.description`)}
                  </p>

                  <ul className="space-y-2">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                        {t(`steps.${index}.details.${i}`)}
                      </li>
                    ))}
                  </ul>

                  {/* Stats — shown inline, no flashy boxes */}
                  {statsEntries.length > 0 && (
                    <div className="mt-4 flex gap-6">
                      {statsEntries.map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-semibold text-foreground">{value}</span>
                          <span className="ml-1 text-muted-foreground capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
