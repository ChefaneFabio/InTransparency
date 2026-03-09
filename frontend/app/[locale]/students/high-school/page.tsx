'use client'

import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  ArrowRight,
  Briefcase,
  Shield,
  BookOpen,
  CalendarDays,
  FileCheck,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Transparenty } from '@/components/mascot/Transparenty'

export default function HighSchoolStudentsPage() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Transparenty size={90} mood="waving" />
            <Badge className="mt-4 mb-4 bg-primary text-white">
              PCTO &bull; Stage &bull; Prima Esperienza
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Inizia il Tuo Percorso{' '}
              <span className="text-primary">Professionale</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Documenta le tue competenze PCTO, mostra i tuoi progetti alle aziende
              e trova il primo stage o lavoro. Tutto gratis.
            </p>
            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
              Your school verifies your skills. Companies discover you. No applications needed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/auth/register?role=student">
                  Crea il Tuo Profilo Gratis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">Come Funziona</Link>
              </Button>
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              Cosa Puoi Fare con InTransparency
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileCheck,
                  title: 'Documenta i PCTO',
                  text: 'Carica i progetti svolti durante stage, tirocini e alternanza. La tua scuola li verifica con un badge ufficiale.',
                },
                {
                  icon: Star,
                  title: 'Fatti Scoprire',
                  text: 'Le aziende cercano studenti con competenze specifiche. Il tuo profilo verificato ti rende visibile senza candidarti.',
                },
                {
                  icon: Briefcase,
                  title: 'Primo Stage o Lavoro',
                  text: 'Quando un\'azienda trova il tuo profilo, ti contatta direttamente. Stage PCTO, tirocinio o primo impiego.',
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* How it works for you */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-10">
                <h3 className="text-2xl font-display font-bold text-center mb-8">
                  Come Funziona in 4 Passi
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {[
                    { step: '1', title: 'Registrati Gratis', desc: 'Crea il tuo account in 2 minuti. Nessun costo.' },
                    { step: '2', title: 'Carica i Progetti', desc: 'Aggiungi attività PCTO, stage, lavori scolastici.' },
                    { step: '3', title: 'La Scuola Verifica', desc: 'I docenti confermano con badge istituzionale.' },
                    { step: '4', title: 'Vieni Scoperto', desc: 'Le aziende ti trovano e ti contattano direttamente.' },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="bg-white/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-xl font-bold">{item.step}</span>
                      </div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* PCTO hours info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge variant="secondary" className="mb-3">PCTO</Badge>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Ogni Ora PCTO Conta
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      La legge prevede 210 ore per istituti tecnici e 90 ore per licei.
                      Con InTransparency, ogni progetto e attività che svolgi diventa parte
                      del tuo portfolio professionale verificato.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Documenta stage, tirocini e progetti scolastici</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Badge di verifica dalla tua scuola</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Utile per il curriculum e l&apos;orientamento post-diploma</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                      <CalendarDays className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">210h</div>
                      <div className="text-xs text-muted-foreground">Istituti Tecnici</div>
                    </Card>
                    <Card className="text-center p-4">
                      <BookOpen className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">90h</div>
                      <div className="text-xs text-muted-foreground">Licei</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Shield className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-muted-foreground">Verificato</div>
                    </Card>
                    <Card className="text-center p-4">
                      <TrendingUp className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">Free</div>
                      <div className="text-xs text-muted-foreground">Per Sempre</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-display font-bold mb-4">
              Pronto a Iniziare?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Crea il tuo profilo gratuito e inizia a costruire il tuo portfolio professionale. Le aziende ti stanno cercando.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/register?role=student">
                Crea il Tuo Profilo Gratis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
