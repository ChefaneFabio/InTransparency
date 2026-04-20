'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Linkedin,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  TrendingUp,
  Bell,
  Mail
} from 'lucide-react'

export default function LinkedInIntegrationPage() {
  const router = useRouter()
  const t = useTranslations('linkedinIntegration')
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNotifyMe = async () => {
    if (!email) return

    // In production, save to database
    console.log('Notify email:', email)
    setIsSubscribed(true)
  }

  const benefits = [
    {
      icon: Users,
      title: t('benefits.connections.title'),
      description: t('benefits.connections.description')
    },
    {
      icon: Briefcase,
      title: t('benefits.portfolio.title'),
      description: t('benefits.portfolio.description')
    },
    {
      icon: TrendingUp,
      title: t('benefits.visibility.title'),
      description: t('benefits.visibility.description')
    },
    {
      icon: Bell,
      title: t('benefits.notifications.title'),
      description: t('benefits.notifications.description')
    }
  ]

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToDashboard')}
        </Button>

        {/* Main Card */}
        <Card className="overflow-hidden">
          <div className="bg-primary p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <Linkedin className="h-10 w-10 text-primary" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white mb-2">{t('comingSoon')}</Badge>
                <h1 className="text-3xl font-bold">{t('heroTitle')}</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              {t('heroDescription')}
            </p>
          </div>

          <CardContent className="p-8">
            {/* Benefits */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('benefitsHeading')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('roadmap.heading')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">{t('roadmap.step1.label')}</span>
                  <Badge variant="outline" className="bg-primary/5 text-green-700">{t('roadmap.statusDone')}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-700">{t('roadmap.step2.label')}</span>
                  <Badge variant="outline" className="bg-primary/5 text-blue-700">{t('roadmap.statusInProgress')}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">{t('roadmap.step3.label')}</span>
                  <Badge variant="outline">{t('roadmap.statusPlanned')}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">{t('roadmap.step4.label')}</span>
                  <Badge variant="outline">{t('roadmap.statusPlanned')}</Badge>
                </div>
              </div>
            </div>

            {/* Notify Me Form */}
            <div className="border-t pt-8">
              {isSubscribed ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('notify.successHeading')}
                  </h3>
                  <p className="text-gray-600">
                    {t('notify.successMessage')}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    {t('notify.heading')}
                  </h3>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder={t('notify.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleNotifyMe}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t('notify.submit')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {t('altActions.message')}
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/student/profile/edit')}>
            {t('altActions.cta')}
          </Button>
        </div>
      </div>
    </div>
  )
}
