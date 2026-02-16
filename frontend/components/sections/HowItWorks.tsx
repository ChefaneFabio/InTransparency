'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Upload,
  Brain,
  Target,
  Clock
} from 'lucide-react'
import { useTranslations } from 'next-intl'

const stepIcons = [Upload, Brain, Target]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const t = useTranslations('home.howItWorksPage')

  // Get step data from translations
  const getStep = (index: number) => {
    const statsObj = t.raw(`steps.${index}.stats`) as Record<string, string>
    const statsKeys = Object.keys(statsObj)
    const statsValues = Object.values(statsObj)

    return {
      id: index + 1,
      title: t(`steps.${index}.title`),
      description: t(`steps.${index}.description`),
      details: [
        t(`steps.${index}.details.0`),
        t(`steps.${index}.details.1`),
        t(`steps.${index}.details.2`),
        t(`steps.${index}.details.3`)
      ],
      stats: {
        key1: statsKeys[0] as string,
        value1: statsValues[0] as string,
        key2: statsKeys[1] as string,
        value2: statsValues[1] as string
      },
      color: 'from-primary to-secondary'
    }
  }

  const steps = [0, 1, 2].map(i => getStep(i))

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentStep = steps[activeStep]

  return (
    <section id="how-it-works" className="relative py-16 overflow-hidden hero-bg">
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold text-foreground mb-6">
            {t('title')} {' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          <div className="flex justify-center items-center space-x-4">
            <Button
              variant={isAutoPlaying ? "default" : "outline"}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              size="sm"
            >
              {isAutoPlaying ? t('pauseDemo') : t('playDemo')}
            </Button>
            <span className="text-sm text-foreground/80">{t('autoAdvancing')}</span>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="flex space-x-2 p-2">
            {steps.map((step, index) => {
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-500 whitespace-nowrap ${
                    activeStep === index
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105`
                      : 'bg-card text-muted-foreground hover:bg-muted shadow border'
                  }`}
                >
                  {(() => { const StepIcon = stepIcons[index]; return <StepIcon className="h-4 w-4 mr-2" /> })()}
                  <span className="font-medium">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Step Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left: Step Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {(() => { const StepIcon = stepIcons[activeStep]; return (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <StepIcon className="h-7 w-7 text-white" />
                </div>
              ) })()}
              <div>
                <div className="text-sm font-medium text-foreground/80 mb-1">{t('step')} {currentStep.id}</div>
                <h3 className="text-3xl font-bold text-foreground">{currentStep.title}</h3>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>

            <div className="space-y-3">
              {currentStep.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{detail}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{currentStep.stats.value1}</div>
                <div className="text-sm text-foreground/80 capitalize">{currentStep.stats.key1}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{currentStep.stats.value2}</div>
                <div className="text-sm text-foreground/80 capitalize">{currentStep.stats.key2}</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="relative">
            <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-card to-muted/50 overflow-hidden">
              <CardContent className="p-0">
                {/* Step 0: Upload */}
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50">
                      <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h5 className="font-semibold text-foreground mb-4">{t('steps.0.visual.uploadTitle')}</h5>
                      <div className="space-y-2">
                        {['main.py', 'README.md', 'requirements.txt', 'docs/'].map((file, index) => (
                          <div key={index} className="bg-card rounded p-3 text-sm text-muted-foreground flex items-center">
                            📄 <span className="ml-2">{file}</span>
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('steps.0.visual.uploadProgress')}</span>
                        <span className="text-sm text-primary">85%</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Analysis */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-purple-100"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      <h5 className="font-semibold text-foreground">{t('steps.1.visual.analysisTitle')}</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">85</div>
                        <div className="text-sm text-muted-foreground">{t('steps.1.visual.innovationScore')}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">92</div>
                        <div className="text-sm text-muted-foreground">{t('steps.1.visual.codeQuality')}</div>
                      </div>
                    </div>

                    <div>
                      <h6 className="font-medium text-foreground mb-3">{t('steps.1.visual.skillsDetected')}</h6>
                      <div className="flex flex-wrap gap-2">
                        {['Python', 'Machine Learning', 'Web Development', 'APIs'].map((skill, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Connect with Companies */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Target className="h-6 w-6 text-green-500 mr-2" />
                      <h5 className="font-semibold text-foreground">{t('steps.2.visual.matchesTitle')}</h5>
                    </div>
                    <div className="space-y-3">
                      {[
                        { company: 'TechCorp', role: 'ML Engineer', match: 94 },
                        { company: 'DataFlow', role: 'Full Stack Dev', match: 89 }
                      ].map((match, index) => (
                        <div key={index} className="bg-card rounded-lg p-4 border border-border shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="font-semibold text-foreground">{match.role}</h6>
                              <p className="text-sm text-muted-foreground">{match.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{match.match}%</div>
                              <div className="text-xs text-foreground/80">{t('steps.2.visual.match')}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                      <div className="text-sm text-orange-700">{t('steps.2.visual.realTimeNotifications')}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Animated Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
