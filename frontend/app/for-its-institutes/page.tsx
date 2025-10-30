'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  AlertTriangle,
  Zap,
  Database,
  Award,
  Briefcase,
  Code,
  Hammer,
  Palette,
  Search,
  Euro,
  Clock,
  FileCheck,
  Building2,
  GraduationCap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { IMAGES } from '@/lib/images'

const itsAcademies = [
  {
    name: 'ITS G. Natta',
    area: 'Chimica e Biotecnologie',
    location: 'Bergamo',
    students: 120,
    topSkills: ['Process Engineering', 'Quality Control', 'Lab Analysis', 'Regulatory Compliance']
  },
  {
    name: 'ITS IFOA',
    area: 'Meccatronica e Automazione',
    location: 'Reggio Emilia',
    students: 150,
    topSkills: ['PLC Programming', 'Industrial Automation', 'Robotics', 'IoT']
  },
  {
    name: 'ITS Rizzoli',
    area: 'ICT e Tecnologie Digitali',
    location: 'Milano',
    students: 180,
    topSkills: ['Full-Stack Development', 'Cloud Computing', 'Cybersecurity', 'AI/ML']
  },
  {
    name: 'ITS Turismo e Ospitalità',
    area: 'Tourism Management',
    location: 'Venezia',
    students: 90,
    topSkills: ['Hospitality Management', 'Event Planning', 'Digital Marketing', 'Revenue Management']
  }
]

const itsFocusAreas = [
  {
    area: 'Meccanica e Meccatronica',
    icon: Hammer,
    color: 'from-orange-500 to-red-500',
    skills: ['CAD/CAM', 'CNC Programming', 'Industry 4.0', 'Maintenance'],
    companies: ['Leonardo', 'FCA', 'Siemens', 'Bosch'],
    avgPlacement: 87,
    searchVolume: 143
  },
  {
    area: 'ICT e Tecnologie Digitali',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    skills: ['Web Development', 'Cybersecurity', 'Cloud', 'IoT'],
    companies: ['Reply', 'Engineering', 'Accenture', 'IBM'],
    avgPlacement: 92,
    searchVolume: 198
  },
  {
    area: 'Chimica e Biotecnologie',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    skills: ['Process Control', 'GMP', 'Lab Techniques', 'Regulatory Affairs'],
    companies: ['Sanofi', 'Novartis', 'BASF', 'Enel Green Power'],
    avgPlacement: 85,
    searchVolume: 76
  },
  {
    area: 'Design e Comunicazione',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    skills: ['Graphic Design', 'UX/UI', 'Video Editing', 'Social Media'],
    companies: ['Design Studios', 'Agencies', 'Media Companies'],
    avgPlacement: 78,
    searchVolume: 89
  }
]

export default function ITSInstitutesPage() {
  const [selectedArea, setSelectedArea] = useState(itsFocusAreas[0])

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
              Per ITS Academies • 100% Gratis
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              ITS: Il Tuo{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sistema di Verifica Gratuito
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              Integrazione Esse3/Moodle gratuita. Tu autentichi le competenze degli studenti (30/30, progetti, tirocini) - le aziende si fidano del tuo sigillo. Traccia il placement con analytics.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              <strong>Subscription-Free Service Model:</strong> Verifica + Matching + Discovery + Analytics - tutto gratis per sempre. Zero costi vs AlmaLaurea (€2.500/anno).
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">€0</div>
                <div className="text-sm text-gray-700">Per Sempre</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-700">Competenze Verificate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">4</div>
                <div className="text-sm text-gray-700">Servizi Gratuiti</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg"
                asChild
              >
                <Link href="/auth/register/role-selection">
                  Diventa Partner Gratuito
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/pricing">
                  Vedi Dettagli Servizi
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Four Services for ITS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Quattro Servizi Gratuiti per il Tuo ITS
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Sistema di verifica partner-enabled, zero abbonamenti, scalabile a 100K+ utenti
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Verification Service */}
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-base">Servizio Verifica</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">GRATIS per ITS</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-primary">Auto-import & Autentica</p>
                  <ul className="space-y-1">
                    <li>• Integrazione Esse3/Moodle</li>
                    <li>• ITS approva progetti (batch 50 in 1 ora)</li>
                    <li>• "Verificato da ITS G. Natta, 28/30"</li>
                    <li>• Competenze 100% tracciabili</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    vs AlmaLaurea: €2.500/anno
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service */}
              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-secondary to-primary p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-base">Servizio Matching</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">GRATIS per Studenti</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-secondary">AI Trasparente</p>
                  <ul className="space-y-1">
                    <li>• "92% fit: AutoCAD da progetto ITS"</li>
                    <li>• Requisiti aziende visibili</li>
                    <li>• Spiegazioni complete match</li>
                    <li>• 25% più assunzioni ITS</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    vs CV Indeed: 30% falsi positivi
                  </p>
                </CardContent>
              </Card>

              {/* Discovery Service */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-base">Servizio Discovery</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Naviga GRATIS, €10/contatto</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-green-700">Reverse Recruitment</p>
                  <ul className="space-y-1">
                    <li>• Aziende cercano pool verificati ITS</li>
                    <li>• Studenti zero candidature</li>
                    <li>• Progetti + sigillo ITS visibili</li>
                    <li>• 80% screening più veloce</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    vs CV autoriportati: -35% mismatch
                  </p>
                </CardContent>
              </Card>

              {/* Analytics Service */}
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-base">Servizio Analytics</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Dashboard GRATIS</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-purple-700">Career Intelligence</p>
                  <ul className="space-y-1">
                    <li>• "Siemens visto 23 studenti ITS"</li>
                    <li>• "PLC ricercato 76x"</li>
                    <li>• Alert intervento precoce</li>
                    <li>• Prova 85% placement boost a MIUR</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    vs Univariety: €500/anno subs
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                <strong>Progettato per Scalare:</strong> Costruito per 100K+ utenti • Nessun abbonamento • Paghi solo ciò che usi
              </p>
            </div>
          </motion.div>

          {/* ITS Focus Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Aree Tecniche ITS Supportate
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Tutti i settori ITS con competenze verificate: dalla meccatronica alle biotecnologie
            </p>

            {/* Area Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {itsFocusAreas.map((area) => {
                const Icon = area.icon
                return (
                  <button
                    key={area.area}
                    onClick={() => setSelectedArea(area)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedArea.area === area.area
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {area.area}
                  </button>
                )
              })}
            </div>

            {/* Selected Area Details */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      {selectedArea.area}
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                        {selectedArea.avgPlacement}% Placement
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Competenze Chiave Verificate:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-white">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Aziende che Cercano:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.companies.map((company) => (
                            <Badge key={company} className="bg-green-100 text-green-800">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <strong className="text-primary">{selectedArea.searchVolume} ricerche/mese</strong> per competenze in quest'area
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Esempio: Workflow Verifica ITS</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Database className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">1. Auto-import da Esse3/Moodle</p>
                            <p className="text-xs text-gray-600">Progetto tirocinio, voto 28/30, competenze estratte</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/10 rounded-full p-2">
                            <FileCheck className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">2. Dashboard ITS: "Approva?"</p>
                            <p className="text-xs text-gray-600">Batch 50 progetti in 1 ora con un click</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">3. Profilo Studente Live</p>
                            <p className="text-xs text-gray-600">"Verificato da {selectedArea.area.split(' ')[0]} ITS, 28/30"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500/10 rounded-full p-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">4. Analytics ITS</p>
                            <p className="text-xs text-gray-600">"47 giorni media assunzione con tuo sigillo"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ITS Academies Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              ITS Pilota in Italia
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Esempi di ITS che possono beneficiare del sistema di verifica gratuito
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {itsAcademies.map((its) => (
                <Card key={its.name} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{its.students} studenti</Badge>
                    </div>
                    <CardTitle className="text-base">{its.name}</CardTitle>
                    <p className="text-xs text-gray-600">{its.area}</p>
                    <p className="text-xs text-gray-500">{its.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-gray-900 mb-2">Top Competenze:</p>
                    <div className="space-y-1">
                      {its.topSkills.map((skill) => (
                        <div key={skill} className="flex items-center text-xs text-gray-700">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Why ITS Should Choose InTransparency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Perché InTransparency per il Tuo ITS?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">100% Gratis per Sempre</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Zero costi setup o mensili</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>vs AlmaLaurea €2.500/anno</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>vs Univariety €500/anno</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Tutti i 4 servizi inclusi gratis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardHeader className="text-center">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Risparmio Tempo</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Batch approval: 50 progetti in 1 ora</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Auto-import Esse3/Moodle (no data entry)</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Dashboard analytics automatica</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Proiettato 40+ ore/mese risparmiate</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Credibilità ITS</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Il tuo sigillo aumenta placement 25%</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Aziende fidano "Verificato da ITS X"</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Prova impatto 85% a MIUR con dati</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Track: "47 giorni media assunzione"</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Integration Workflow */}
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
                  Come Partire: 3 Step Integrazione
                </h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Registra ITS</h4>
                    <p className="text-white/90 text-sm">
                      Click "Diventa Partner" → Scegli "Istituto" → Email .edu verificata → Dashboard attiva in 5 minuti
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Connetti Esse3/Moodle</h4>
                    <p className="text-white/90 text-sm">
                      API integration gratuita → Import automatico voti/progetti → Noi gestiamo tutto (zero lavoro IT per te)
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Approva & Traccia</h4>
                    <p className="text-white/90 text-sm">
                      Dashboard: "50 progetti da approvare" → Click → Analytics: "23 studenti contattati da aziende"
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
                    <Link href="/auth/register/role-selection">
                      Inizia Ora - Gratis per Sempre
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    ✓ Setup 5 minuti  ✓ Zero costi  ✓ Integrazione Esse3/Moodle  ✓ Support italiano
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ for ITS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Domande Frequenti ITS
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">È davvero gratis per sempre?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Sì, 100% gratis. Tutti e 4 i servizi (Verifica, Matching, Discovery, Analytics) inclusi senza costi.
                    Le aziende pagano €10 per contattare i candidati - questo finanzia il sistema.
                    Tu non paghi mai nulla.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">L'integrazione Esse3/Moodle è complicata?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    No, API integration gestita da noi. Setup 1 ora con il nostro team.
                    Import automatico voti, progetti, tirocini. Zero lavoro IT per te dopo setup iniziale.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Come approviamo i progetti studenti?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Dashboard: "50 progetti da approvare" → Click "Approva batch" → Fatto.
                    1 ora per 50 approvazioni. AI pre-analizza, tu validi finale con tuo sigillo ITS.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Come tracciamo il placement con MIUR?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Analytics dashboard: "47 giorni media assunzione", "23 studenti assunti via tuo sigillo", "85% placement boost".
                    Export report per MIUR con dati verificabili.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quali competenze ITS possiamo verificare?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Tutte: Meccatronica, ICT, Chimica, Design, Turismo, ecc.
                    Hard skills (CAD, PLC, Python) + soft skills (teamwork, problem solving) da progetti/tirocini.
                    AI estrae, tu autentichi con 30/30 o gradi ITS.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">GDPR compliant per dati studenti?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    100% compliant. Studenti consentono via email prima di import.
                    Audit trail completo: "Competenza X verificata da ITS Y il 29 Oct 2025".
                    Studenti controllano cosa è condiviso.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Pronto a Rendere Verificabili i Tuoi Studenti ITS?
                </h3>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Unisciti al sistema di verifica gratuito. Setup 5 minuti. Zero costi. Prova impatto 85% placement a MIUR.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                    asChild
                  >
                    <Link href="/auth/register/role-selection">
                      Diventa Partner ITS Gratuito
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/how-it-works">
                      Vedi Come Funziona
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  ✓ 100% gratis per sempre  ✓ Esse3/Moodle integration  ✓ 4 servizi inclusi  ✓ Support italiano
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
