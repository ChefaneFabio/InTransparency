'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Users,
  MessageCircle,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Building2,
  Star,
  Code,
  Eye,
  Send,
  Calendar,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Heart,
  Award,
  Target,
  BookOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function DemoPage() {
  const [activeUserType, setActiveUserType] = useState('recruiter')
  const [demoStep, setDemoStep] = useState(0)

  // Demo data
  const demoStudents = [
    {
      name: "Alex Chen",
      university: "Stanford University",
      major: "Computer Science",
      skills: ["React", "Python", "Machine Learning"],
      gpa: 3.8,
      projects: 5,
      matchScore: 95
    },
    {
      name: "Maria Rodriguez",
      university: "MIT",
      major: "Software Engineering",
      skills: ["Java", "Spring", "AWS"],
      gpa: 3.9,
      projects: 4,
      matchScore: 88
    }
  ]

  const demoJobs = [
    {
      title: "Frontend Developer",
      company: "TechCorp",
      location: "San Francisco",
      salary: "$95k-$120k",
      applicants: 23,
      matches: 89
    },
    {
      title: "Data Scientist Intern",
      company: "DataFlow Inc",
      location: "New York",
      salary: "$25-35/hour",
      applicants: 15,
      matches: 67
    }
  ]

  const RecruiterDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">👔 Recruiter Dashboard</h2>
        <p className="text-gray-600">Trova e assumi i migliori studenti da qualsiasi università</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-500" />
              Ricerca Studenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Cerca tra 500,000+ studenti con filtri avanzati
            </p>
            <div className="space-y-2">
              <Badge variant="outline">Skills: React, Python</Badge>
              <Badge variant="outline">GPA: 3.5+</Badge>
              <Badge variant="outline">Laurea: 2024-2025</Badge>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Search className="h-4 w-4 mr-1" />
              Cerca Ora
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
              Contatto Diretto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Invia messaggi personalizzati agli studenti
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Response Rate</div>
              <div className="text-2xl font-bold text-green-600">67%</div>
              <div className="text-xs text-gray-500">247 messaggi inviati</div>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Send className="h-4 w-4 mr-1" />
              Invia Messaggio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-purple-500" />
              Gestione Applicazioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Traccia il processo di hiring completo
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nuove</span>
                <Badge>15</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Colloqui</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Offerte</span>
                <Badge variant="outline">3</Badge>
              </div>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Eye className="h-4 w-4 mr-1" />
              Vedi Tutto
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risultati Ricerca Studenti</CardTitle>
          <CardDescription>Trovati 247 studenti che corrispondono ai tuoi criteri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoStudents.map((student, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.university} • {student.major}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">GPA: {student.gpa}</Badge>
                      <Badge variant="outline">{student.projects} progetti</Badge>
                      <Badge className="bg-green-500">{student.matchScore}% match</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Profilo
                  </Button>
                  <Button size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contatta
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const StudentDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">🎓 Student Dashboard</h2>
        <p className="text-gray-600">Mostra i tuoi progetti e connettiti con le aziende migliori</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              I Miei Progetti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Progetti caricati</div>
              <div className="text-xs text-green-600 mt-1">+2 questo mese</div>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Code className="h-4 w-4 mr-1" />
              Carica Progetto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-500" />
              Visite Profilo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">89</div>
              <div className="text-sm text-gray-600">Visite questo mese</div>
              <div className="text-xs text-green-600 mt-1">+23% vs scorso mese</div>
            </div>
            <Button size="sm" className="w-full mt-3" variant="outline">
              <TrendingUp className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
              Opportunità
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">Job matches</div>
              <div className="text-xs text-blue-600 mt-1">3 nuove oggi</div>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Briefcase className="h-4 w-4 mr-1" />
              Vedi Jobs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-red-500" />
              Messaggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">7</div>
              <div className="text-sm text-gray-600">Da recruiters</div>
              <div className="text-xs text-blue-600 mt-1">2 non letti</div>
            </div>
            <Button size="sm" className="w-full mt-3">
              <MessageCircle className="h-4 w-4 mr-1" />
              Leggi
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>I Miei Progetti</CardTitle>
            <CardDescription>I tuoi lavori migliori con analisi AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">E-commerce Platform</h3>
                <Badge className="bg-green-500">9.2/10 Quality</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Piattaforma completa con React, Node.js e MongoDB
              </p>
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">MongoDB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">127 recruiters hanno visto</div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Dettagli
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">AI Chat Bot</h3>
                <Badge className="bg-blue-500">8.7/10 Innovation</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Chatbot intelligente con Python e TensorFlow
              </p>
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">TensorFlow</Badge>
                <Badge variant="outline">NLP</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">89 recruiters hanno visto</div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Dettagli
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunità di Lavoro</CardTitle>
            <CardDescription>Jobs che corrispondono al tuo profilo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoJobs.map((job, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{job.title}</h3>
                  <Badge className="bg-purple-500">95% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {job.company} • {job.location}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-600">{job.salary}</span>
                  <span className="text-sm text-gray-500">{job.applicants} candidati</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Send className="h-4 w-4 mr-1" />
                    Applica
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const CareerServiceDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">🏫 Career Services Dashboard</h2>
        <p className="text-gray-600">Gestisci il successo professionale dei tuoi studenti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Studenti Attivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600">Profili attivi</div>
              <div className="text-xs text-green-600 mt-1">+156 questo mese</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-green-500" />
              Aziende Partner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">Partner attivi</div>
              <div className="text-xs text-blue-600 mt-1">12 nuove questo mese</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-purple-500" />
              Placement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">Entro 6 mesi</div>
              <div className="text-xs text-green-600 mt-1">+7% vs anno scorso</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Stipendio Medio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">€45k</div>
              <div className="text-sm text-gray-600">Primo lavoro</div>
              <div className="text-xs text-green-600 mt-1">+12% vs anno scorso</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Studenti</CardTitle>
            <CardDescription>Performance e outcomes dei tuoi studenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Profili completati</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Progetti caricati</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                  </div>
                  <span className="text-sm font-medium">73%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Attivi nella ricerca</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '91%'}}></div>
                  </div>
                  <span className="text-sm font-medium">91%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partner Aziende</CardTitle>
            <CardDescription>Le tue partnerships più attive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">T</div>
                  <div>
                    <div className="font-medium">TechCorp</div>
                    <div className="text-sm text-gray-500">Technology</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">23 assunzioni</div>
                  <div className="text-xs text-gray-500">Ultimo anno</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">D</div>
                  <div>
                    <div className="font-medium">DataFlow Inc</div>
                    <div className="text-sm text-gray-500">Data Science</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">15 assunzioni</div>
                  <div className="text-xs text-gray-500">Ultimo anno</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">F</div>
                  <div>
                    <div className="font-medium">FinTech Solutions</div>
                    <div className="text-sm text-gray-500">Financial Tech</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">11 assunzioni</div>
                  <div className="text-xs text-gray-500">Ultimo anno</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const FeatureShowcase = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">🚀 Tutte le Funzionalità InTransparency</h2>
        <p className="text-gray-600 text-lg">La piattaforma completa che connette università, studenti e aziende</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center">
              <Search className="h-6 w-6 mr-2" />
              Per i Recruiters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Cerca 500k+ studenti da qualsiasi università</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Messaggi diretti con AI matching</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Gestione completa del hiring process</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Analytics avanzate e insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Integrazione ATS e automazioni</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              Per gli Studenti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Portfolio progetti con analisi AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Job matching intelligente</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Contatti diretti da aziende top</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Privacy e controllo completo</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Career insights e suggerimenti</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              Per le Università
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">API complete per integrazione SIS</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Analytics placement e outcomes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Partnership aziende gestite</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Compliance GDPR/FERPA</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Curriculum optimization insights</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">🌟 Funzionalità Uniche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold">AI-Powered Matching</h3>
              <p className="text-sm text-gray-600 mt-1">
                Algoritmi avanzati per perfect matches
              </p>
            </div>
            <div className="text-center p-4">
              <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Cross-University</h3>
              <p className="text-sm text-gray-600 mt-1">
                Accesso a studenti da qualsiasi università
              </p>
            </div>
            <div className="text-center p-4">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Privacy First</h3>
              <p className="text-sm text-gray-600 mt-1">
                Controllo completo dei dati personali
              </p>
            </div>
            <div className="text-center p-4">
              <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold">Project-Based</h3>
              <p className="text-sm text-gray-600 mt-1">
                Valutazione basata su lavori reali
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🚀 InTransparency Demo Completa
            </h1>
            <p className="text-xl text-gray-600">
              Scopri tutte le funzionalità per recruiters, studenti e career services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeUserType} onValueChange={setActiveUserType} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="recruiter" className="text-sm">
                👔 Recruiter
              </TabsTrigger>
              <TabsTrigger value="student" className="text-sm">
                🎓 Student
              </TabsTrigger>
              <TabsTrigger value="career" className="text-sm">
                🏫 University
              </TabsTrigger>
              <TabsTrigger value="features" className="text-sm">
                ⭐ Features
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recruiter">
            <RecruiterDemo />
          </TabsContent>

          <TabsContent value="student">
            <StudentDemo />
          </TabsContent>

          <TabsContent value="career">
            <CareerServiceDemo />
          </TabsContent>

          <TabsContent value="features">
            <FeatureShowcase />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setActiveUserType('recruiter')}
            >
              <Search className="h-5 w-5 mr-2" />
              Prova da Recruiter
            </Button>
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setActiveUserType('student')}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Prova da Student
            </Button>
            <Button
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => setActiveUserType('career')}
            >
              <Building2 className="h-5 w-5 mr-2" />
              Prova da University
            </Button>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="outline" size="lg">
              📚 Documentazione API
            </Button>
            <Button variant="outline" size="lg">
              💼 Registra la tua Azienda
            </Button>
            <Button variant="outline" size="lg">
              🎓 Registra la tua Università
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}