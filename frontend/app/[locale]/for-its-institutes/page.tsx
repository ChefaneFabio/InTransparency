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
  GraduationCap,
  Sparkles
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

          {/* Hero Section - MARKETPLACE FIRST */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              Free Marketplace • Get Your Students Hired
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              Connect Your Graduates to{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Companies Seeking Verified Skills
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              Free three-sided marketplace connecting your ITS students to companies actively hiring. Your institutional verification gives graduates a competitive edge. Track placement success with free analytics.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              <strong>100% Free Forever:</strong> No setup fees, no monthly costs, no subscriptions.
            </p>

            {/* Quick Stats - Marketplace Focused */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">87%</div>
                <div className="text-sm text-gray-700">Avg Placement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-gray-700">Students Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">€0</div>
                <div className="text-sm text-gray-700">Cost Forever</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                asChild
              >
                <Link href="/auth/register">
                  Join Free Marketplace
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/pricing">
                  See How It Works
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* How Marketplace Benefits ITS - NEW SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              How the Marketplace Helps Your ITS
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Students Get Discovered</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Companies search 10K+ verified graduates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Students don't apply - companies reach out</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Your verification badge = trust signal</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>25% more placements than traditional methods</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">AI-Powered Matching</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Companies see "92% fit: AutoCAD from ITS project"</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Verified skills = higher match scores</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Transparent AI explanations</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>80% faster screening vs CVs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Track Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>See which companies viewed your students</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>"47 days avg time-to-hire"</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>Prove 85% placement to MIUR</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                      <span>Early intervention alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Four Services - REORDERED (Marketplace First) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Four Free Services
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Marketplace platform with verification quality layer - all free forever
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Discovery Service - PRIMARY (Larger card) */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-green-600 text-white">PRIMARY SERVICE</Badge>
                  <CardTitle className="text-lg">Discovery Service</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Browse FREE, €10/contact</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-green-700">Reverse Recruitment</p>
                  <ul className="space-y-1.5">
                    <li>• Companies search verified ITS talent pool</li>
                    <li>• Students visible without applying</li>
                    <li>• Your verification badge = quality signal</li>
                    <li>• Companies pay €10 to contact, you get credit</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    University-verified credentials employers trust
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service - PRIMARY (Larger card) */}
              <Card className="border-2 border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-secondary to-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-secondary text-white">PRIMARY SERVICE</Badge>
                  <CardTitle className="text-lg">Matching Service</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">FREE for Students</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-secondary">Transparent AI Matching</p>
                  <ul className="space-y-1.5">
                    <li>• "92% fit: AutoCAD from ITS project"</li>
                    <li>• Verified skills = higher match scores</li>
                    <li>• Companies see your institutional endorsement</li>
                    <li>• 25% more successful placements</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-gray-600">
                    80% faster candidate screening
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Verification Service - SECONDARY (Smaller card) */}
              <Card className="border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Verification Service</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Quality Layer</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-1.5">
                  <p className="font-semibold text-gray-900">Enables Marketplace Trust</p>
                  <ul className="space-y-1">
                    <li>• Manual or API verification workflow</li>
                    <li>• You verify projects/grades</li>
                    <li>• "Verified by ITS G. Natta, 28/30"</li>
                    <li>• Batch approve 50 in 1 hour</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Analytics Service - SECONDARY (Smaller card) */}
              <Card className="border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Analytics Service</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Track Impact</Badge>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-1.5">
                  <p className="font-semibold text-gray-900">Measure Placement Success</p>
                  <ul className="space-y-1">
                    <li>• "Siemens viewed 23 ITS students"</li>
                    <li>• "PLC skills searched 76x"</li>
                    <li>• Export reports for MIUR</li>
                    <li>• Early intervention alerts</li>
                  </ul>
                </CardContent>
              </Card>
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
              All ITS Areas Supported
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              From mechatronics to biotech - companies actively hiring ITS graduates
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
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        {selectedArea.avgPlacement}% Placement
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Verified Skills Companies Seek:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-white">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Companies Hiring:</p>
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
                          <strong className="text-primary">{selectedArea.searchVolume} company searches/month</strong> for skills in this area
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">How Students Get Hired</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/10 rounded-full p-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">1. Student Uploads ITS Project</p>
                            <p className="text-xs text-gray-600">Project on {selectedArea.skills[0]}, grade 28/30</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">2. Your ITS Verifies</p>
                            <p className="text-xs text-gray-600">Badge: "Verified by {selectedArea.area.split(' ')[0]} ITS"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/10 rounded-full p-2">
                            <Search className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">3. Companies Discover</p>
                            <p className="text-xs text-gray-600">Siemens searches "{selectedArea.skills[0]}" → finds student</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500/10 rounded-full p-2">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">4. Student Gets Hired</p>
                            <p className="text-xs text-gray-600">Company pays €10 to contact → Interview → Hired in 47 days</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose InTransparency - REFRAMED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Why ITS Choose InTransparency
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Better Placement Outcomes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>25% higher placement rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Companies proactively reach out</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>47 days avg time-to-hire</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Verified skills = competitive edge</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">100% Free Forever</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Zero setup or monthly costs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>100% free platform forever</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Companies pay, not institutions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>All 4 services included</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardHeader className="text-center">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Track Impact for MIUR</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Prove 85% placement with data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>See which companies hiring your grads</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Export reports for funding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Early intervention alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Integration Workflow - SIMPLIFIED */}
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
                  Get Started in 3 Steps
                </h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Register ITS</h4>
                    <p className="text-white/90 text-sm">
                      Create free account → Email .edu verified → Dashboard active in 5 minutes
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Students Upload Projects</h4>
                    <p className="text-white/90 text-sm">
                      Students join free → Upload ITS projects → You verify with your institutional badge
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Track Placements</h4>
                    <p className="text-white/90 text-sm">
                      Companies discover students → Analytics: "23 students contacted" → Track hiring success
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
                    <Link href="/auth/register">
                      Join Free Marketplace Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    ✓ Setup 5 min  ✓ €0 forever  ✓ 10K+ companies hiring  ✓ Track placements
                  </p>
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
              ITS That Could Benefit
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Examples of ITS that would increase student placement through verified marketplace
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {itsAcademies.map((its) => (
                <Card key={its.name} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{its.students} students</Badge>
                    </div>
                    <CardTitle className="text-base">{its.name}</CardTitle>
                    <p className="text-xs text-gray-600">{its.area}</p>
                    <p className="text-xs text-gray-500">{its.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-gray-900 mb-2">Skills Companies Seek:</p>
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

          {/* FAQ for ITS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How does the marketplace help our students?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Companies browse 10K+ verified graduates and proactively reach out to students with matching skills.
                    Students don't apply - they get discovered. Your institutional verification gives them a competitive edge.
                    25% more placements than traditional job boards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Is it really free forever?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Yes, 100% free. All 4 services (Discovery, Matching, Verification, Analytics) included.
                    Companies pay €10 per contact - this finances the platform.
                    No hidden costs, no annual fees.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How does verification work?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Students manually upload projects and you verify them through our simple dashboard.
                    For larger institutions, we can set up API integration (contact us for details). Zero IT work for you after setup.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Can we add Career Day tools?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Yes! Optional Premium Embed add-on (€500/year) includes Career Day platform with QR codes, interview booking, and branded widgets.
                    But core marketplace is always free. See pricing page for details.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How do we track placement for MIUR reporting?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Free analytics dashboard shows: "47 days avg time-to-hire", "23 students hired via platform", "85% placement boost".
                    Export reports for MIUR with verifiable data.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What if students don't get discovered?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p>
                    Analytics show you early warnings: "Student X: 0 views in 30 days - skills mismatch?"
                    You can intervene early, update skills/projects, or offer career counseling. Prevention vs reaction.
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
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Ready to Get Your ITS Students Hired?
                </h3>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join the free marketplace connecting verified ITS graduates to companies actively hiring.
                  Setup in 5 minutes. Zero costs. Track placement success.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                    asChild
                  >
                    <Link href="/auth/register">
                      Join Free Marketplace
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/pricing">
                      See Pricing & Add-ons
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  ✓ €0 forever  ✓ 10K+ companies  ✓ 87% avg placement  ✓ Track impact for MIUR
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
