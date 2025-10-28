'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  Building2,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Calendar,
  Shield,
  Zap,
  Brain,
  FileText,
  Code,
  Briefcase,
  Scale,
  Palette,
  Globe,
  Heart,
  Hammer
} from 'lucide-react'
import { motion } from 'framer-motion'

const disciplines = [
  {
    name: 'Computer Science',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    onboarding: 'Add your GitHub projects, thesis code, hackathons',
    topSkills: ['Python', 'React', 'Machine Learning', 'Cloud Computing'],
    searchVolume: 298,
    companies: ['Microsoft', 'Amazon', 'Reply', 'Accenture'],
    avgContacts: 18,
    placementRate: 89
  },
  {
    name: 'Economics/Business',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
    onboarding: 'Upload market analysis thesis, case competition results, Excel models',
    topSkills: ['Financial Modeling', 'Excel', 'PowerBI', 'ESG Analysis'],
    searchVolume: 327,
    companies: ['Deloitte', 'UniCredit', 'Intesa', 'McKinsey'],
    avgContacts: 16,
    placementRate: 85
  },
  {
    name: 'Mechanical Engineering',
    icon: Hammer,
    color: 'from-orange-500 to-red-500',
    onboarding: 'Link your CAD portfolio, capstone design project, simulations',
    topSkills: ['CAD', 'SolidWorks', 'CATIA', 'E-mobility'],
    searchVolume: 276,
    companies: ['Leonardo', 'FCA', 'Siemens', 'ENI'],
    avgContacts: 15,
    placementRate: 82
  },
  {
    name: 'Law',
    icon: Scale,
    color: 'from-purple-500 to-pink-500',
    onboarding: 'Upload moot court experience, legal clinic work, GDPR research',
    topSkills: ['Data Privacy', 'Corporate Law', 'International Law', 'Compliance'],
    searchVolume: 143,
    companies: ['Law Firms', 'Banks', 'EU Institutions', 'Corporations'],
    avgContacts: 12,
    placementRate: 78
  },
  {
    name: 'Architecture',
    icon: Palette,
    color: 'from-indigo-500 to-purple-500',
    onboarding: 'Upload design portfolio, competition entries, BIM projects',
    topSkills: ['BIM (Revit)', 'Sustainable Design', 'AutoCAD', '3D Modeling'],
    searchVolume: 198,
    companies: ['Engineering Firms', 'Construction', 'Design Studios'],
    avgContacts: 14,
    placementRate: 81
  },
  {
    name: 'Languages/Translation',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500',
    onboarding: 'Add translation portfolio, CEFR certifications, study abroad projects',
    topSkills: ['Chinese+German', 'Technical Translation', 'Localization', 'SDL Trados'],
    searchVolume: 87,
    companies: ['Translation Agencies', 'EU Institutions', 'Export Companies'],
    avgContacts: 11,
    placementRate: 73
  },
  {
    name: 'Psychology',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    onboarding: 'Add research papers, internship reports, clinical assessments',
    topSkills: ['HR Analytics', 'Organizational Behavior', 'SPSS', 'Research Methods'],
    searchVolume: 124,
    companies: ['HR Consultancies', 'Market Research', 'Clinics', 'Consulting'],
    avgContacts: 9,
    placementRate: 68
  },
  {
    name: 'Fashion Design (ITS)',
    icon: Palette,
    color: 'from-rose-500 to-pink-500',
    onboarding: 'Portfolio from fashion shows, brand collaborations, sustainable materials',
    topSkills: ['Sustainable Materials', 'Adobe Suite', 'Pattern Making', 'Textile Tech'],
    searchVolume: 98,
    companies: ['Armani', 'Prada', 'Valentino', 'Gucci'],
    avgContacts: 15,
    placementRate: 87
  }
]

const useCases = [
  {
    id: 'onboarding',
    title: '1. Student Onboarding & Profile Quality',
    icon: GraduationCap,
    description: 'Track completion across ALL departments, not just STEM',
    example: 'Economics student missing Excel dashboard → prompt to add. Architecture student without BIM → flag for completion.'
  },
  {
    id: 'relationships',
    title: '2. Company Relationship Management',
    icon: Building2,
    description: 'Industry-specific targeting based on actual search behavior',
    example: '"Hi Deloitte, you viewed 31 Economics + 18 Engineering students - want a joint recruiting session?"'
  },
  {
    id: 'counseling',
    title: '3. Targeted Career Counseling',
    icon: Lightbulb,
    description: 'Discipline-specific skills guidance from market data',
    example: '"Excel+PowerBI searched 89x → Tell Economics students to add data viz projects"'
  },
  {
    id: 'events',
    title: '4. Event Planning & Targeting',
    icon: Calendar,
    description: 'Stop inviting random companies - invite based on search data',
    example: 'Bocconi Career Day: Invite consulting (156 searches) not tech (12 searches)'
  },
  {
    id: 'reporting',
    title: '5. Placement Reporting',
    icon: BarChart3,
    description: 'Prove ROI to Dean for EVERY faculty, not just Engineering',
    example: 'Economics: 189 viewed, 54 contacted, 19 hired, 61 days avg time-to-hire'
  },
  {
    id: 'intervention',
    title: '6. Crisis Intervention',
    icon: AlertTriangle,
    description: 'Flag at-risk students and replicate success patterns',
    example: 'Business student 45 days to graduation, zero views → "Add case competition results!"'
  },
  {
    id: 'curriculum',
    title: '7. Curriculum Feedback',
    icon: Brain,
    description: 'Close skills gap by updating what\'s taught',
    example: 'To Architecture: "BIM mandatory in 85% of searches - make Revit required"'
  }
]

export default function CareerCentersPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplines[0])

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0 px-6 py-2 text-base">
              <Shield className="h-4 w-4 mr-2" />
              For Career Centers & Universities
            </Badge>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Strategic Career Services
              <br />
              Across ALL Disciplines
            </h1>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Not just tech. From Computer Science to Fashion Design, Economics to Architecture,
              Law to Psychology - <strong>data-driven career guidance for every department</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">16,000+ Students</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-semibold">All Disciplines</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Real-Time Analytics</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-lg px-8" asChild>
                <Link href="/contact">
                  Partner With Us
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 text-lg px-8" asChild>
                <Link href="/demo/advanced-search">
                  See Demo
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* All Disciplines Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-4">Works For Every Department</h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Each discipline gets tailored guidance based on what companies actually search for
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {disciplines.map((discipline, idx) => (
                <motion.div
                  key={discipline.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDiscipline(discipline)}
                  className="cursor-pointer"
                >
                  <Card className={`h-full transition-all ${
                    selectedDiscipline.name === discipline.name
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${discipline.color} flex items-center justify-center mb-4`}>
                        <discipline.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{discipline.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Searches:</span>
                          <Badge className="bg-primary/10 text-primary">{discipline.searchVolume}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Placement:</span>
                          <Badge className="bg-green-100 text-green-800">{discipline.placementRate}%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Company Search Intelligence - Key Feature */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Strategic Intelligence Hub
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                See Which Companies{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Search Your Students
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stop guessing. Start knowing. Full visibility into company behavior and hiring patterns.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Track Company Interest</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    See exactly which companies view your students and when.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-800">
                      <strong className="text-blue-900">"Deloitte viewed 31 Economics students"</strong>
                      <br />
                      <span className="text-gray-600">→ Time for warm outreach!</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Skill Demand Data</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Know what skills companies actually search for.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-800">
                      <strong className="text-green-900">"Excel searched 89 times"</strong>
                      <br />
                      <span className="text-gray-600">→ Tell Business students to add data viz!</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Early Intervention</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Identify at-risk students before graduation.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-800">
                      <strong className="text-orange-900">"87 seniors with zero views"</strong>
                      <br />
                      <span className="text-gray-600">→ Fix profiles before they graduate!</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-center">Transparency in Action</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      What You See
                    </h4>
                    <ul className="space-y-2 text-white/90">
                      <li>• Which companies viewed which students</li>
                      <li>• Most-searched skills by discipline</li>
                      <li>• Hiring patterns and trends</li>
                      <li>• Geographic demand (Milan vs Rome vs Europe)</li>
                      <li>• Students with zero/low visibility</li>
                      <li>• Time-to-hire averages by field</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Actions You Can Take
                    </h4>
                    <ul className="space-y-2 text-white/90">
                      <li>• Proactive company outreach (warm leads)</li>
                      <li>• Data-driven career counseling</li>
                      <li>• Curriculum feedback to departments</li>
                      <li>• Targeted event planning (right companies)</li>
                      <li>• Early intervention for at-risk students</li>
                      <li>• ROI reporting to administration</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xl font-semibold">
                    Result: <span className="underline">20-30% boost in placements</span> via data-driven decisions
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Selected Discipline Detail */}
          <Card className="mb-16 shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${selectedDiscipline.color} text-white`}>
              <div className="flex items-center gap-3">
                <selectedDiscipline.icon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">{selectedDiscipline.name}</CardTitle>
                  <p className="text-white/90 mt-1">How career centers use InTransparency</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Student Onboarding
                  </h3>
                  <p className="text-gray-700 mb-4 italic">"{selectedDiscipline.onboarding}"</p>

                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 mt-6">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Skills Searched
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiscipline.topSkills.map(skill => (
                      <Badge key={skill} className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Companies Searching
                  </h3>
                  <div className="space-y-2 mb-6">
                    {selectedDiscipline.companies.map(company => (
                      <div key={company} className="flex items-center justify-between bg-primary/10 px-4 py-2 rounded-lg">
                        <span className="font-medium">{company}</span>
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">{selectedDiscipline.searchVolume}</div>
                      <div className="text-sm text-gray-600">Monthly Searches</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">{selectedDiscipline.placementRate}%</div>
                      <div className="text-sm text-gray-600">Placement Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7 Use Cases */}
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-4">7 Ways Career Centers Use InTransparency</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              From onboarding to placement reporting - every step backed by data
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, idx) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                          <useCase.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{useCase.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">{useCase.description}</p>
                      <div className="bg-primary/10 border-l-4 border-primary p-3 rounded">
                        <p className="text-sm italic text-gray-700">{useCase.example}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <Card className="mb-16 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardTitle className="text-2xl font-display flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                Sample Dashboard: Economics Department
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">2,400</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-green-600 mb-2">327</div>
                  <div className="text-sm text-gray-600">Company Views</div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">54</div>
                  <div className="text-sm text-gray-600">Contacts Made</div>
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/20 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-secondary mb-2">19</div>
                  <div className="text-sm text-gray-600">Hires This Month</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Top Skills Searched</h3>
                  <div className="space-y-3">
                    {[
                      { skill: 'Excel Advanced', count: 89 },
                      { skill: 'Financial Modeling', count: 67 },
                      { skill: 'PowerBI', count: 61 },
                      { skill: 'ESG/Sustainability', count: 58 }
                    ].map(item => (
                      <div key={item.skill} className="flex items-center justify-between">
                        <span className="text-gray-700">{item.skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                              style={{ width: `${(item.count / 89) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-600">{item.count}x</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Companies Searching</h3>
                  <div className="space-y-3">
                    {[
                      { company: 'Deloitte', views: 23 },
                      { company: 'UniCredit', views: 19 },
                      { company: 'Intesa Sanpaolo', views: 17 },
                      { company: 'McKinsey', views: 14 }
                    ].map(item => (
                      <div key={item.company} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="font-medium">{item.company}</span>
                        <Badge className="bg-primary/10 text-primary">{item.views} views</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">At Risk: 87 graduating seniors with &lt;5 views</h4>
                    <p className="text-sm text-yellow-800">34 missing thesis projects on profile • Action needed before May graduation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Transform Career Services?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Enable data-driven career guidance across ALL disciplines with zero cost and zero burden
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule Demo
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link href="/demo/advanced-search">
                  Try Platform Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Always free • No credit card required • Set up in 48 hours
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
