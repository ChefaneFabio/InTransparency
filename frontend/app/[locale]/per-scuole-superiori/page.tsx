'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
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
  Hammer,
  Palette,
  Search,
  Euro,
  Clock,
  FileCheck,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Wrench,
  HeartHandshake,
  CalendarDays
} from 'lucide-react'
import { motion } from 'framer-motion'

const highSchoolExamples = [
  {
    name: 'ITIS Galileo Galilei',
    area: 'Informatica e Telecomunicazioni',
    location: 'Roma',
    students: 450,
    topActivities: ['Stage Aziendale', 'Progetto Web', 'Laboratorio IoT', 'Certificazione Cisco']
  },
  {
    name: 'IIS Leonardo da Vinci',
    area: 'Meccanica e Meccatronica',
    location: 'Milano',
    students: 380,
    topActivities: ['PCTO in Azienda', 'Progetto CAD/CAM', 'Automazione Industriale', 'Sicurezza']
  },
  {
    name: 'ITIS Enrico Fermi',
    area: 'Chimica e Biotecnologie',
    location: 'Bologna',
    students: 320,
    topActivities: ['Laboratorio Analisi', 'Stage Farmaceutico', 'Progetto Ambiente', 'Qualità']
  },
  {
    name: 'IIS Aldini Valeriani',
    area: 'Elettronica ed Elettrotecnica',
    location: 'Bologna',
    students: 410,
    topActivities: ['PCTO Energia', 'Domotica', 'Progetto Arduino', 'Manutenzione']
  }
]

const pctoAreas = [
  {
    area: 'Informatica e Digitale',
    icon: Code,
    skills: ['Web Development', 'Database', 'Networking', 'Cybersecurity'],
    companies: ['Accenture', 'Reply', 'Engineering', 'Capgemini'],
    avgPlacement: 72,
    pctoHours: 210
  },
  {
    area: 'Meccanica e Meccatronica',
    icon: Hammer,
    skills: ['CAD/CAM', 'CNC', 'Automazione', 'Manutenzione'],
    companies: ['FCA', 'Ducati', 'Brembo', 'Dallara'],
    avgPlacement: 68,
    pctoHours: 210
  },
  {
    area: 'Chimica e Biotecnologie',
    icon: Award,
    skills: ['Analisi Chimica', 'Controllo Qualità', 'Laboratorio', 'Ambiente'],
    companies: ['BASF', 'Sanofi', 'Chiesi', 'Hera'],
    avgPlacement: 65,
    pctoHours: 210
  },
  {
    area: 'Grafica e Comunicazione',
    icon: Palette,
    skills: ['Graphic Design', 'Video Editing', 'Social Media', 'Stampa'],
    companies: ['Agenzie Creative', 'Tipografie', 'Media Company'],
    avgPlacement: 60,
    pctoHours: 210
  }
]

export default function HighSchoolsPage() {
  const [selectedArea, setSelectedArea] = useState(pctoAreas[0])

  return (
    <div className="min-h-screen segment-university hero-bg">
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
            <Badge className="mb-4 bg-primary text-white">
              PCTO &bull; Stage &bull; Prima Esperienza Lavorativa
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              Collega i Tuoi Studenti alle{' '}
              <span className="text-primary">
                Aziende del Territorio
              </span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-4">
              Piattaforma gratuita per gestire PCTO, stage e prime esperienze lavorative.
              Le aziende cercano studenti con competenze verificate dalla tua scuola.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Modello freemium per istituti scolastici. Nessun costo di setup.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-primary shadow-lg" asChild>
                <Link href="/auth/register">
                  Inizia Gratuitamente
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">
                  Scopri Come Funziona
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* What is PCTO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge variant="secondary" className="mb-3">Normativa MIUR</Badge>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                      PCTO: Percorsi per le Competenze Trasversali e l&apos;Orientamento
                    </h2>
                    <p className="text-foreground/80 mb-4">
                      La legge 145/2018 prevede almeno <strong>210 ore</strong> per gli istituti tecnici
                      e <strong>90 ore</strong> per i licei. InTransparency aiuta la tua scuola a:
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Trovare aziende partner per stage e tirocini</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Documentare le competenze acquisite con verifica istituzionale</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Tracciare ore e attività per il reporting MIUR</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Preparare gli studenti al primo inserimento lavorativo</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                      <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">210h</div>
                      <div className="text-xs text-muted-foreground">Ore minime Istituti Tecnici</div>
                    </Card>
                    <Card className="text-center p-4">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">90h</div>
                      <div className="text-xs text-muted-foreground">Ore minime Licei</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">3°-5°</div>
                      <div className="text-xs text-muted-foreground">Anni coinvolti</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-muted-foreground">Competenze verificate</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How the Platform Helps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Come la Piattaforma Aiuta la Tua Scuola
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <HeartHandshake className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Connessione Scuola-Azienda</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Aziende cercano studenti con competenze specifiche</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Stage e PCTO organizzati sulla piattaforma</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>La verifica della scuola = segnale di qualità</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Contatto diretto azienda-studente</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileCheck className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Gestione PCTO Semplificata</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Studenti caricano progetti e attività</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Docenti verificano con badge istituzionale</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Tracciamento ore automatico</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Report pronti per il MIUR</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary/80 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Orientamento e Placement</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>Quali aziende cercano i tuoi studenti</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>Competenze più richieste dal mercato</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>Dati per orientare la didattica</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>Alert: &quot;Studente X: 0 visualizzazioni in 30 giorni&quot;</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Servizi per le Scuole Superiori
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Piattaforma marketplace con livello di verifica istituzionale
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-primary text-white">SERVIZIO PRINCIPALE</Badge>
                  <CardTitle className="text-lg">Marketplace Stage e PCTO</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Gratuito per le scuole</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-foreground">Le aziende trovano i tuoi studenti</p>
                  <ul className="space-y-1.5">
                    <li>&#8226; Aziende cercano studenti per stage e PCTO</li>
                    <li>&#8226; Studenti visibili senza candidarsi</li>
                    <li>&#8226; Badge di verifica della scuola = fiducia</li>
                    <li>&#8226; Le aziende pagano per contattare, la scuola no</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-primary/80 text-white">SERVIZIO PRINCIPALE</Badge>
                  <CardTitle className="text-lg">Matching Intelligente</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Gratuito per gli studenti</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-primary">AI Trasparente per il Matching</p>
                  <ul className="space-y-1.5">
                    <li>&#8226; AI abbina competenze a requisiti aziendali</li>
                    <li>&#8226; Competenze verificate migliorano la visibilità</li>
                    <li>&#8226; Le aziende vedono l&apos;endorsement della scuola</li>
                    <li>&#8226; Spiegazioni trasparenti del matching</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-border hover:border-border transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-muted-foreground p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Verifica Istituzionale</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Livello Qualità</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80 space-y-1.5">
                  <p className="font-semibold text-foreground">Fiducia nel Marketplace</p>
                  <ul className="space-y-1">
                    <li>&#8226; Workflow di verifica manuale o API</li>
                    <li>&#8226; Docenti verificano progetti e voti</li>
                    <li>&#8226; &quot;Verificato da ITIS Galilei, 8/10&quot;</li>
                    <li>&#8226; Approvazione in batch per classi intere</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-border transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-muted-foreground p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Analytics e Report</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Traccia l&apos;Impatto</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80 space-y-1.5">
                  <p className="font-semibold text-foreground">Misura il Successo dei PCTO</p>
                  <ul className="space-y-1">
                    <li>&#8226; &quot;Siemens ha visualizzato 15 studenti&quot;</li>
                    <li>&#8226; &quot;Competenza CAD cercata 43 volte&quot;</li>
                    <li>&#8226; Export report per MIUR e RAV</li>
                    <li>&#8226; Alert di intervento precoce</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* PCTO Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Tutti gli Indirizzi Supportati
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dall&apos;informatica alla meccanica — aziende che cercano attivamente studenti
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {pctoAreas.map((area) => {
                const Icon = area.icon
                return (
                  <button
                    key={area.area}
                    onClick={() => setSelectedArea(area)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedArea.area === area.area
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {area.area}
                  </button>
                )
              })}
            </div>

            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      {selectedArea.area}
                      <Badge className="bg-primary text-white">
                        {selectedArea.avgPlacement}% Placement
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">Competenze che le aziende cercano:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-card">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">Aziende che assumono:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.companies.map((company) => (
                            <Badge key={company} className="bg-primary/10 text-foreground">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm text-foreground/80">
                          <strong className="text-primary">{selectedArea.pctoHours} ore PCTO</strong> previste per questo indirizzo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Come Funziona per lo Studente</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">1. Lo studente carica il progetto PCTO</p>
                            <p className="text-xs text-muted-foreground">Progetto su {selectedArea.skills[0]}, voto 8/10</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">2. Il docente verifica</p>
                            <p className="text-xs text-muted-foreground">Badge: &quot;Verificato da {selectedArea.area.split(' ')[0]} - ITIS&quot;</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Search className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">3. L&apos;azienda scopre lo studente</p>
                            <p className="text-xs text-muted-foreground">Cerca &quot;{selectedArea.skills[0]}&quot; → trova lo studente verificato</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">4. Stage o primo lavoro</p>
                            <p className="text-xs text-muted-foreground">Azienda contatta → Colloquio → Stage PCTO o assunzione</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Perché le Scuole Scelgono InTransparency
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">PCTO più Efficaci</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Studenti scoperti dalle aziende</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Aziende contattano proattivamente</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Traccia risultati e metriche</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Competenze verificate = vantaggio competitivo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Gratuito per le Scuole</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Zero costi di attivazione</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Funzionalità core incluse</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Le aziende pagano per contattare</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Opzioni enterprise disponibili</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Report per MIUR e RAV</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Metriche di placement PCTO</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Quali aziende assumono i tuoi diplomati</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Export report per il RAV</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Alert di intervento precoce</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Get Started Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-primary border-0 text-primary-foreground">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-center mb-8">
                  Inizia in 3 Passi
                </h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Registra la Scuola</h4>
                    <p className="text-white/90 text-sm">
                      Account gratuito → Email .edu verificata → Dashboard attiva in 5 minuti
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Gli Studenti Caricano i Progetti</h4>
                    <p className="text-white/90 text-sm">
                      Studenti si iscrivono gratis → Caricano progetti PCTO → I docenti verificano
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Traccia i Risultati</h4>
                    <p className="text-white/90 text-sm">
                      Le aziende scoprono gli studenti → Analytics: &quot;15 studenti contattati&quot; → Monitora il successo
                    </p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" variant="secondary" asChild className="shadow-xl">
                    <Link href="/auth/register">
                      Inizia Gratuitamente
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    Attivazione rapida. Report per MIUR e RAV inclusi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* School Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Scuole che Potrebbero Beneficiarne
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Esempi di istituti che migliorerebbero il placement degli studenti con il marketplace verificato
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highSchoolExamples.map((school) => (
                <Card key={school.name} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{school.students} studenti</Badge>
                    </div>
                    <CardTitle className="text-base">{school.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{school.area}</p>
                    <p className="text-xs text-muted-foreground">{school.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-foreground mb-2">Attività PCTO:</p>
                    <div className="space-y-1">
                      {school.topActivities.map((activity) => (
                        <div key={activity} className="flex items-center text-xs text-foreground/80">
                          <CheckCircle className="h-3 w-3 text-primary mr-1" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Domande Frequenti
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Come funziona per i PCTO?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Gli studenti caricano i progetti svolti durante i PCTO (stage, tirocini, attività in azienda).
                    I docenti verificano con il badge istituzionale. Le aziende cercano studenti con competenze
                    specifiche e li contattano direttamente per stage o primo impiego.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quanto costa per la scuola?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Il servizio base è completamente gratuito per le scuole. Le aziende pagano per contattare
                    gli studenti. Opzioni enterprise disponibili per istituti con esigenze avanzate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Funziona anche per l&apos;alternanza scuola-lavoro?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Sì, la piattaforma supporta tutte le forme di alternanza: PCTO, stage curriculari,
                    tirocini formativi e prime esperienze lavorative. Ogni attività può essere documentata
                    e verificata dalla scuola.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Come funziona la verifica?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Gli studenti caricano i progetti e i docenti li verificano attraverso la dashboard.
                    La verifica aggiunge un badge istituzionale che aumenta la visibilità e la credibilità
                    dello studente nel marketplace.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Possiamo usarlo per il RAV?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Sì, la dashboard analytics fornisce dati esportabili utili per il Rapporto di
                    Autovalutazione: metriche di placement, competenze più richieste, aziende che
                    hanno contattato gli studenti.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Anche i licei possono usare la piattaforma?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>
                    Assolutamente sì. Anche i licei hanno l&apos;obbligo di 90 ore PCTO. La piattaforma
                    aiuta a documentare le competenze trasversali acquisite e a connettere gli studenti
                    con opportunità formative e lavorative.
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
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Pronto a Collegare i Tuoi Studenti alle Aziende?
                </h3>
                <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                  Unisciti al marketplace gratuito che connette studenti verificati alle aziende.
                  Attivazione in 5 minuti. Zero costi. Report per MIUR e RAV.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-primary shadow-lg" asChild>
                    <Link href="/auth/register">
                      Inizia Gratuitamente
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/pricing">
                      Prezzi e Opzioni
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  PCTO, stage e primo impiego — tutto in un&apos;unica piattaforma
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
