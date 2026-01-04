'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ArrowLeftRight,
  Building2,
  GraduationCap,
  MessageSquare,
  Search,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react'

interface BidirectionalCommunicationProps {
  locale?: string
}

export function BidirectionalCommunication({ locale = 'it' }: BidirectionalCommunicationProps) {
  const isItalian = locale === 'it'

  const content = {
    it: {
      badge: 'Come Funziona la Comunicazione',
      title: 'Le Aziende Ti Contattano Per Prime',
      subtitle: 'Niente candidature. Niente CV. Le aziende cercano nel marketplace e ti scrivono direttamente.',

      traditionalTitle: 'Modello Tradizionale',
      traditionalSubtitle: 'Tu invii candidature, speri in una risposta',
      traditionalSteps: [
        { text: 'Studente cerca offerte di lavoro', icon: Search },
        { text: 'Invia decine di CV', icon: ArrowRight },
        { text: 'Aspetta risposta (spesso mai)', icon: XCircle },
        { text: 'Compete con centinaia di candidati', icon: XCircle }
      ],

      ourTitle: 'InTransparency',
      ourSubtitle: 'Le aziende ti trovano e ti contattano',
      ourSteps: [
        { text: 'Carica progetti verificati', icon: GraduationCap },
        { text: 'Azienda cerca competenze specifiche', icon: Search },
        { text: 'Ti trova nel marketplace', icon: CheckCircle },
        { text: 'Ti contatta direttamente', icon: MessageSquare }
      ],

      flowTitle: 'Il Flusso di Comunicazione',
      flowStep1Title: '1. L\'Azienda Cerca',
      flowStep1Desc: 'HR cerca "React developer con esperienza in e-commerce" nel marketplace',
      flowStep2Title: '2. Ti Trova',
      flowStep2Desc: 'Il tuo portfolio verificato appare: "92% match - progetto e-commerce verificato da Politecnico"',
      flowStep3Title: '3. Ti Contatta',
      flowStep3Desc: 'L\'azienda paga €10 e ti manda un messaggio diretto',
      flowStep4Title: '4. Rispondi',
      flowStep4Desc: 'Ricevi notifica, leggi il messaggio, rispondi se interessato',

      benefitsTitle: 'Perché Funziona Meglio',
      benefits: [
        { title: 'Zero Candidature', desc: 'Non perdi tempo a candidarti ovunque' },
        { title: 'Contatti Qualificati', desc: 'Solo aziende interessate alle tue competenze' },
        { title: 'Comunicazione Diretta', desc: 'Nessun intermediario, parli direttamente con HR' },
        { title: 'Potere Negoziale', desc: 'Sei tu a essere cercato, non il contrario' }
      ]
    },
    en: {
      badge: 'How Communication Works',
      title: 'Companies Contact You First',
      subtitle: 'No applications. No CVs. Companies search the marketplace and message you directly.',

      traditionalTitle: 'Traditional Model',
      traditionalSubtitle: 'You send applications, hope for a response',
      traditionalSteps: [
        { text: 'Student searches for jobs', icon: Search },
        { text: 'Sends dozens of CVs', icon: ArrowRight },
        { text: 'Waits for response (often never)', icon: XCircle },
        { text: 'Competes with hundreds of candidates', icon: XCircle }
      ],

      ourTitle: 'InTransparency',
      ourSubtitle: 'Companies find you and reach out',
      ourSteps: [
        { text: 'Upload verified projects', icon: GraduationCap },
        { text: 'Company searches for specific skills', icon: Search },
        { text: 'Finds you in marketplace', icon: CheckCircle },
        { text: 'Contacts you directly', icon: MessageSquare }
      ],

      flowTitle: 'The Communication Flow',
      flowStep1Title: '1. Company Searches',
      flowStep1Desc: 'HR searches "React developer with e-commerce experience" in marketplace',
      flowStep2Title: '2. Finds You',
      flowStep2Desc: 'Your verified portfolio appears: "92% match - e-commerce project verified by Politecnico"',
      flowStep3Title: '3. Contacts You',
      flowStep3Desc: 'Company pays €10 and sends you a direct message',
      flowStep4Title: '4. You Reply',
      flowStep4Desc: 'You get notified, read the message, reply if interested',

      benefitsTitle: 'Why This Works Better',
      benefits: [
        { title: 'Zero Applications', desc: 'Don\'t waste time applying everywhere' },
        { title: 'Qualified Contacts', desc: 'Only companies interested in your skills' },
        { title: 'Direct Communication', desc: 'No middlemen, talk directly to HR' },
        { title: 'Negotiating Power', desc: 'You\'re being sought, not the other way around' }
      ]
    }
  }

  const t = content[isItalian ? 'it' : 'en']

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            <ArrowLeftRight className="h-3 w-3 mr-1" />
            {t.badge}
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Comparison: Traditional vs InTransparency */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Traditional */}
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-bold text-lg text-red-900">{t.traditionalTitle}</h3>
                <p className="text-sm text-red-700">{t.traditionalSubtitle}</p>
              </div>
              <div className="space-y-3">
                {t.traditionalSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-red-800">{step.text}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* InTransparency */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-bold text-lg text-green-900">{t.ourTitle}</h3>
                <p className="text-sm text-green-700">{t.ourSubtitle}</p>
              </div>
              <div className="space-y-3">
                {t.ourSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-green-800">{step.text}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual Flow */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">{t.flowTitle}</h3>
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { title: t.flowStep1Title, desc: t.flowStep1Desc, icon: Building2, color: 'blue' },
              { title: t.flowStep2Title, desc: t.flowStep2Desc, icon: Search, color: 'purple' },
              { title: t.flowStep3Title, desc: t.flowStep3Desc, icon: MessageSquare, color: 'green' },
              { title: t.flowStep4Title, desc: t.flowStep4Desc, icon: GraduationCap, color: 'orange' }
            ].map((step, i) => {
              const Icon = step.icon
              const colors: Record<string, string> = {
                blue: 'bg-blue-100 text-blue-600 border-blue-200',
                purple: 'bg-purple-100 text-purple-600 border-purple-200',
                green: 'bg-green-100 text-green-600 border-green-200',
                orange: 'bg-orange-100 text-orange-600 border-orange-200'
              }
              return (
                <div key={i} className="relative">
                  <Card className={`h-full border-2 ${colors[step.color].split(' ')[2]}`}>
                    <CardContent className="pt-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colors[step.color].split(' ').slice(0, 2).join(' ')} mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-sm mb-2">{step.title}</h4>
                      <p className="text-xs text-gray-600">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">{t.benefitsTitle}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {t.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
