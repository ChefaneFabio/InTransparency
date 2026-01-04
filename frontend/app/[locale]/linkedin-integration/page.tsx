'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      title: 'Importa Connessioni',
      description: 'Sincronizza le tue connessioni LinkedIn per trovare opportunità nella tua rete'
    },
    {
      icon: Briefcase,
      title: 'Portfolio Unificato',
      description: 'Combina il tuo profilo LinkedIn con i progetti verificati di InTransparency'
    },
    {
      icon: TrendingUp,
      title: 'Maggiore Visibilità',
      description: 'I recruiter vedranno il tuo profilo completo con competenze verificate'
    },
    {
      icon: Bell,
      title: 'Notifiche Smart',
      description: 'Ricevi alert quando le tue connessioni LinkedIn cercano talenti'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Dashboard
        </Button>

        {/* Main Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <Linkedin className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white mb-2">Coming Soon</Badge>
                <h1 className="text-3xl font-bold">Integrazione LinkedIn</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Stiamo lavorando per integrare LinkedIn con InTransparency. Presto potrai
              sincronizzare il tuo profilo e le tue connessioni per massimizzare le opportunità.
            </p>
          </div>

          <CardContent className="p-8">
            {/* Benefits */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Cosa potrai fare con l'integrazione LinkedIn
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Roadmap
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Importazione manuale del profilo</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Completato</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-700">OAuth LinkedIn integration</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">In sviluppo</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">Sincronizzazione connessioni</span>
                  <Badge variant="outline">Pianificato</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">Inviti automatici</span>
                  <Badge variant="outline">Pianificato</Badge>
                </div>
              </div>
            </div>

            {/* Notify Me Form */}
            <div className="border-t pt-8">
              {isSubscribed ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Grazie per l'interesse!
                  </h3>
                  <p className="text-gray-600">
                    Ti avviseremo non appena l'integrazione LinkedIn sarà disponibile.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Vuoi essere avvisato quando sarà disponibile?
                  </h3>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="La tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleNotifyMe}>
                      <Mail className="h-4 w-4 mr-2" />
                      Avvisami
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
            Nel frattempo, puoi aggiungere manualmente le tue informazioni LinkedIn al tuo profilo
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/student/profile/edit')}>
            Modifica Profilo
          </Button>
        </div>
      </div>
    </div>
  )
}
