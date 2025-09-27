'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  ArrowRight,
  CheckCircle,
  Users,
  Brain,
  Target,
  Sparkles,
  Upload,
  BarChart3,
  MessageSquare,
  GraduationCap,
  Building2,
  Star,
  Clock,
  Zap,
  TrendingUp,
  Search,
  MessageCircle,
  Briefcase,
  Code,
  Eye,
  Send,
  Calendar,
  Globe,
  Shield,
  Heart,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react'

export default function DemoPage() {
  const [activeUserType, setActiveUserType] = useState('video')
  const [demoStep, setDemoStep] = useState(0)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const demoSections = [
    {
      id: 'upload',
      title: '1. Upload Your Project',
      description: 'Simply upload your academic projects, code repositories, or documentation',
      icon: Upload,
      color: 'bg-blue-500',
      features: ['Drag & drop interface', 'Multiple file formats', 'GitHub integration'],
      mockData: {
        projectName: 'E-Commerce AI Recommendation System',
        files: ['README.md', 'main.py', 'requirements.txt', 'screenshots/'],
        technologies: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL']
      }
    },
    {
      id: 'analysis',
      title: '2. AI Analysis',
      description: 'Our AI analyzes your code, documentation, and project complexity',
      icon: Brain,
      color: 'bg-purple-500',
      features: ['Code quality assessment', 'Innovation scoring', 'Skill extraction'],
      mockData: {
        innovationScore: 85,
        complexityLevel: 'Advanced',
        skillsDetected: ['Machine Learning', 'Web Development', 'Database Design', 'API Development'],
        codeQuality: 92
      }
    },
    {
      id: 'story',
      title: '3. Story Generation',
      description: 'Transform technical details into compelling professional narratives',
      icon: MessageSquare,
      color: 'bg-green-500',
      features: ['Professional storytelling', 'Industry terminology', 'Impact highlighting'],
      mockData: {
        story: "Developed an intelligent e-commerce recommendation system that increased user engagement by 40%. Leveraged machine learning algorithms to analyze customer behavior patterns and deliver personalized product suggestions. Built a scalable web application with RESTful APIs, demonstrating strong full-stack development skills and business impact awareness."
      }
    },
    {
      id: 'matching',
      title: '4. Smart Matching',
      description: 'Get matched with relevant job opportunities and collaboration requests',
      icon: Target,
      color: 'bg-orange-500',
      features: ['Skills-based matching', 'Industry preferences', 'Real-time opportunities'],
      mockData: {
        matches: [
          { company: 'TechCorp', role: 'ML Engineer Intern', match: 94 },
          { company: 'DataFlow', role: 'Full Stack Developer', match: 89 },
          { company: 'InnovateLab', role: 'Software Engineer', match: 87 }
        ]
      }
    }
  ]

  const stats = [
    { label: 'Students Helped', value: '50,000+', icon: GraduationCap },
    { label: 'Projects Analyzed', value: '125,000+', icon: Brain },
    { label: 'Job Matches Made', value: '8,500+', icon: Target },
    { label: 'Companies Partnered', value: '1,200+', icon: Building2 }
  ]

  // Auto-progress demo
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentDemo(curr => (curr + 1) % demoSections.length)
            return 0
          }
          return prev + 2
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, demoSections.length])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const goToSection = (index: number) => {
    setCurrentDemo(index)
    setProgress(0)
  }

  const currentSection = demoSections[currentDemo]

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

  const VideoDemo = () => (
    <div className="space-y-16">
      {/* Interactive Platform Demo */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Experience InTransparency Live
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Explore our interactive demo to see how quickly students get matched with perfect job opportunities
        </p>

        {/* Live Demo Visualization */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Interactive Demo Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="h-8 w-8 ml-1" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">Interactive Platform Tour</h3>
                <p className="text-blue-100">Click below to explore each feature step-by-step</p>
              </div>
            </div>

            {/* Demo Content Visualization */}
            <div className="absolute inset-0 p-8">
              <div className="grid grid-cols-2 gap-4 h-full opacity-30">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="w-full h-4 bg-white/20 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-white/20 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-white/20 rounded"></div>
                    <div className="h-8 bg-white/20 rounded"></div>
                    <div className="h-8 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Play Button Overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1" />
                )}
              </div>
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={togglePlay} size="lg">
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause Tour
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Interactive Tour
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/register">
              Try It Yourself
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Interactive Step-by-Step Demo */}
      <div>
        <h3 className="text-3xl font-bold text-center mb-8">Interactive Platform Tour</h3>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-4 p-2">
            {demoSections.map((section, index) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    currentDemo === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-blue-50 shadow'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Step Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${currentSection.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                <currentSection.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{currentSection.title}</h4>
                <p className="text-gray-600">{currentSection.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {currentSection.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => goToSection((currentDemo + 1) % demoSections.length)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">
                  Try It Now
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Mock Interface */}
          <div className="relative">
            <Card className="p-6 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="p-0">
                {currentDemo === 0 && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50">
                      <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h5 className="font-semibold text-gray-900 mb-2">{currentSection.mockData.projectName}</h5>
                      <div className="space-y-2">
                        {currentSection.mockData.files?.map((file, index) => (
                          <div key={index} className="bg-white rounded p-2 text-sm text-gray-600">
                            📄 {file}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentSection.mockData.technologies?.map((tech, index) => (
                        <Badge key={index} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentDemo === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-blue-100"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-900">Analyzing Project...</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentSection.mockData.innovationScore}</div>
                        <div className="text-sm text-gray-600">Innovation Score</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-purple-600">{currentSection.mockData.complexityLevel}</div>
                        <div className="text-sm text-gray-600">Complexity</div>
                      </div>
                    </div>

                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Skills Detected:</h6>
                      <div className="flex flex-wrap gap-2">
                        {currentSection.mockData.skillsDetected?.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentDemo === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                      <h5 className="font-semibold text-gray-900">Professional Story Generated</h5>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {currentSection.mockData.story}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>✨ AI-optimized for ATS systems</span>
                      <span>📊 Industry-relevant keywords</span>
                    </div>
                  </div>
                )}

                {currentDemo === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Target className="h-6 w-6 text-green-500 mr-2" />
                      <h5 className="font-semibold text-gray-900">Job Matches Found</h5>
                    </div>
                    <div className="space-y-3">
                      {currentSection.mockData.matches?.map((match, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="font-semibold text-gray-900">{match.role}</h6>
                              <p className="text-sm text-gray-600">{match.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{match.match}%</div>
                              <div className="text-xs text-gray-500">match</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Floating Animation Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-3xl p-12 text-center border border-slate-200 shadow-lg">
        <h3 className="text-3xl font-bold mb-8 text-gray-900">Platform Impact</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-teal-600" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InTransparency Platform Demo
              </h1>
              <p className="text-gray-600 mt-2">See how we transform academic projects into career opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  ← Back to Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">
                  Start Free Trial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeUserType} onValueChange={setActiveUserType} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="video" className="text-sm">
                🎬 Video Demo
              </TabsTrigger>
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

          <TabsContent value="video">
            <VideoDemo />
          </TabsContent>

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
        <div className="mt-12 text-center space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setActiveUserType('recruiter')}
            >
              <Search className="h-5 w-5 mr-2" />
              Try Recruiter View
            </Button>
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setActiveUserType('student')}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Try Student View
            </Button>
            <Button
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => setActiveUserType('career')}
            >
              <Building2 className="h-5 w-5 mr-2" />
              Try University View
            </Button>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Projects?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of students who are already using InTransparency to showcase their work and advance their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/auth/register">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}