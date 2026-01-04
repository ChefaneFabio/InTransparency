'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Zap,
  Award,
  Briefcase,
  Code,
  Search,
  Euro,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Scale,
  Palette
} from 'lucide-react'
import { motion } from 'framer-motion'

const universityFaculties = [
  {
    name: 'Ingegneria e STEM',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    skills: ['Software Development', 'Data Science', 'Machine Learning', 'Cloud Computing'],
    avgPlacement: 89
  },
  {
    name: 'Economia e Management',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    skills: ['Financial Analysis', 'Business Strategy', 'Marketing', 'Consulting'],
    avgPlacement: 82
  },
  {
    name: 'Giurisprudenza',
    icon: Scale,
    color: 'from-purple-500 to-indigo-500',
    skills: ['Legal Research', 'Contract Law', 'Corporate Law', 'Compliance'],
    avgPlacement: 75
  },
  {
    name: 'Design e Comunicazione',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    skills: ['UX/UI Design', 'Graphic Design', 'Digital Marketing', 'Brand Strategy'],
    avgPlacement: 78
  },
  {
    name: 'Scienze Umanistiche',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    skills: ['Content Writing', 'Research', 'Cultural Analysis', 'Education'],
    avgPlacement: 68
  }
]

export default function PerUniversitaPage() {
  const [selectedFaculty, setSelectedFaculty] = useState(universityFaculties[0])

  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
              Marketplace Gratuito • Fai Assumere i Tuoi Laureati
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              Connetti i Tuoi Laureati alle{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Aziende che Cercano Talenti Verificati
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              Marketplace gratuito che connette i tuoi studenti alle aziende. La verifica istituzionale dà ai laureati un vantaggio competitivo. Traccia il successo con analytics gratuiti.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              <strong>100% Gratis per Sempre:</strong> Nessun costo di setup, nessun abbonamento. Zero costi vs AlmaLaurea (€2.500/anno).
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">€0</div>
                <div className="text-sm text-gray-700">Costo per Sempre</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-700">Risparmio vs Agenzie</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">Diretto</div>
                <div className="text-sm text-gray-700">Contatto Aziende-Studenti</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
                asChild
              >
                <Link href="/auth/register?role=institution">
                  Registra la Tua Università
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/pricing">
                  Scopri Come Funziona
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* How It Benefits Universities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Come il Marketplace Aiuta la Tua Università
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Studenti Scoperti dalle Aziende</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Le aziende cercano laureati verificati</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Gli studenti non candidano - vengono contattati</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>La verifica istituzionale = segnale di fiducia</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Matching AI Trasparente</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>"92% match: Python dal progetto di tesi"</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Competenze verificate = punteggi più alti</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Spiegazioni AI trasparenti</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Traccia il Tuo Impatto</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>Vedi quali aziende visualizzano i tuoi studenti</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>Report esportabili per ANVUR</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>Allerte per intervento precoce</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Faculty Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Tutte le Facoltà Supportate
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Da Ingegneria a Giurisprudenza - le aziende cercano laureati di ogni disciplina
            </p>

            {/* Faculty Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {universityFaculties.map((faculty) => {
                const Icon = faculty.icon
                return (
                  <button
                    key={faculty.name}
                    onClick={() => setSelectedFaculty(faculty)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedFaculty.name === faculty.name
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {faculty.name}
                  </button>
                )
              })}
            </div>

            {/* Selected Faculty Details */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      {selectedFaculty.name}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Competenze Ricercate dalle Aziende:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFaculty.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-white">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Come Vengono Assunti i Laureati</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/10 rounded-full p-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">1. Studente Carica Progetto/Tesi</p>
                            <p className="text-xs text-gray-600">Con voto e competenze dimostrate</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">2. L'Università Verifica</p>
                            <p className="text-xs text-gray-600">"Verificato da Politecnico di Milano, 110/110"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/10 rounded-full p-2">
                            <Search className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">3. Le Aziende Scoprono</p>
                            <p className="text-xs text-gray-600">Cercano "{selectedFaculty.skills[0]}" → trovano il laureato</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500/10 rounded-full p-2">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">4. Laureato Assunto</p>
                            <p className="text-xs text-gray-600">L'azienda paga €10 per contattare → Colloquio → Assunzione</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Perché le Università Scelgono InTransparency
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">100% Gratis per Sempre</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Zero costi di setup o abbonamento</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>vs AlmaLaurea €2.500/anno risparmiati</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Le aziende pagano, non le università</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Contatto Diretto</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Nessun intermediario tra azienda e studente</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Le aziende contattano direttamente</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>98% risparmio vs agenzie interinali</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardHeader className="text-center">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Report per ANVUR</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Traccia il placement con dati verificabili</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Vedi quali aziende assumono i tuoi laureati</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Esporta report per accreditamento</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-primary to-secondary border-0 text-white">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-center mb-8">
                  Inizia in 3 Passaggi
                </h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Registra l'Università</h4>
                    <p className="text-white/90 text-sm">
                      Crea account gratuito → Verifica email .edu → Dashboard attiva in 5 minuti
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Studenti Caricano Progetti</h4>
                    <p className="text-white/90 text-sm">
                      Studenti si iscrivono gratis → Caricano tesi e progetti → Tu verifichi con badge istituzionale
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Monitora le Assunzioni</h4>
                    <p className="text-white/90 text-sm">
                      Le aziende scoprono studenti → Analytics: "23 studenti contattati" → Traccia il successo
                    </p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="shadow-xl"
                  >
                    <Link href="/auth/register?role=institution">
                      Registra la Tua Università Gratis
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    ✓ Setup 5 min  ✓ €0 per sempre  ✓ Aziende che assumono  ✓ Report ANVUR
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Pronto a Far Assumere i Tuoi Laureati?
                </h3>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Unisciti al marketplace gratuito che connette laureati verificati alle aziende.
                  Setup in 5 minuti. Zero costi. Traccia il placement.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
                    asChild
                  >
                    <Link href="/auth/register?role=institution">
                      Registra Università Gratis
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/contact">
                      Parla con Noi
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  ✓ €0 per sempre  ✓ 98% risparmio vs agenzie  ✓ Report ANVUR
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
