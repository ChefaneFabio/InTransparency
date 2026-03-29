'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  ScanSearch,
  Target,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useSegment } from '@/lib/segment-context'

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const { segment } = useSegment()
  const t = useTranslations('home.howItWorks.' + segment)

  const statsObj = (index: number) => {
    const raw = t.raw(`steps.${index}.stats`) as Record<string, string>
    return Object.entries(raw)
  }

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-5xl">
            {t('title')}{' '}
            <span className="text-primary font-display italic">{t('titleHighlight')}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card rounded-lg p-1 border border-border">
            {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeStep === index
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-current/10 text-xs font-bold">{index + 1}</span>
                  <span className="hidden sm:inline">{t(`steps.${index}.title`)}</span>
                  <span className="sm:hidden">{t('step')} {index + 1}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Step content — left text + right visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
          >
            {/* Left: details */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary/20 tabular-nums">
                  {String(activeStep + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {t('step')} {activeStep + 1}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {t(`steps.${activeStep}.title`)}
                  </h3>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t(`steps.${activeStep}.description`)}
              </p>

              <ul className="space-y-3 mb-6">
                {[0, 1].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                    {t(`steps.${activeStep}.details.${i}`)}
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="flex gap-6 pt-4 border-t border-border">
                {statsObj(activeStep).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-lg font-semibold text-foreground tabular-nums">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual demo */}
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                {/* Step 0: Upload */}
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center bg-primary/5">
                      <Upload className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                      <p className="font-medium text-foreground text-sm mb-4">
                        {t('steps.0.visual.uploadTitle')}
                      </p>
                      <div className="space-y-2">
                        {['main.py', 'README.md', 'requirements.txt', 'docs/'].map((file) => (
                          <div key={file} className="bg-card rounded-md px-3 py-2 text-sm text-muted-foreground flex items-center border border-border">
                            <FileText className="h-3.5 w-3.5 mr-2 text-primary/50" />
                            <span>{file}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('steps.0.visual.uploadProgress')}
                        </span>
                        <span className="text-xs font-medium text-primary tabular-nums">85%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Analysis */}
                {activeStep === 1 && (
                  <div className="space-y-5">
                    <div className="text-center py-4">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <div className="absolute inset-0 rounded-full border-4 border-muted" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ScanSearch className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <p className="font-medium text-foreground text-sm">
                        {t('steps.1.visual.analysisTitle')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-foreground tabular-nums">85</div>
                        <div className="text-xs text-muted-foreground">{t('steps.1.visual.innovationScore')}</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-foreground tabular-nums">92</div>
                        <div className="text-xs text-muted-foreground">{t('steps.1.visual.codeQuality')}</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">{t('steps.1.visual.skillsDetected')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Python', 'Machine Learning', 'Web Development', 'APIs'].map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Connect */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <p className="font-medium text-foreground text-sm">{t('steps.2.visual.matchesTitle')}</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { company: 'TechCorp', role: 'ML Engineer', match: 94 },
                        { company: 'DataFlow', role: 'Full Stack Dev', match: 89 },
                      ].map((item) => (
                        <div key={item.company} className="rounded-lg p-4 border border-border bg-card">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground text-sm">{item.role}</p>
                              <p className="text-xs text-muted-foreground">{item.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary tabular-nums">{item.match}%</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {t('steps.2.visual.match')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2 text-center justify-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{t('steps.2.visual.realTimeNotifications')}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
