'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Eye,
  Lightbulb,
  Lock,
  FileCheck,
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TransparencyPage() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0 px-6 py-2 text-base">
                <Shield className="h-4 w-4 mr-2" />
                Our Transparency Commitment
              </Badge>

              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Verified Skills
                </span>
                <br />
                Clear Explanations
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Institution-verified hard and soft skills. Explainable AI matching. Direct company feedback. Complete transparency for students, companies, and institutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                  <Link href="/features">
                    See Our Features
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo/ai-search">Try Live Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Challenge */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              The Hiring Challenge
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Traditional hiring relies on self-reported CVs and unexplained match scores
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">Self-Reported Skills</h3>
                  </div>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <div>
                        <strong>Hard to verify</strong> technical and soft skills
                        <p className="text-sm text-gray-600">Resume skills often don't match actual capabilities</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <div>
                        <strong>30% skill mismatch</strong> in hires
                        <p className="text-sm text-gray-600">Institutional verification closes this gap</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <div>
                        <strong>Time-consuming validation</strong>
                        <p className="text-sm text-gray-600">Recruiters spend hours verifying credentials</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-2 border-purple-200">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-900">Unexplained Matching</h3>
                  </div>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">•</span>
                      <div>
                        <strong>Limited transparency</strong> in match reasons
                        <p className="text-sm text-gray-600">Students don't know what to improve</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">•</span>
                      <div>
                        <strong>70% want more clarity</strong> from AI tools
                        <p className="text-sm text-gray-600">Explainable matching builds trust</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">•</span>
                      <div>
                        <strong>Feedback helps everyone</strong>
                        <p className="text-sm text-gray-600">Clear requirements reduce bias by 25%</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="py-20">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              Our Transparency Model
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Four pillars of complete transparency across the platform
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">1. Verified Competencies</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Hard and soft skills verified through institutional data and project analysis.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Hard skills: Verified through projects, code, designs, research
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Soft skills: Analyzed from teamwork, leadership, presentations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Institution-authenticated grades, courses, and achievements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <strong>92% match accuracy</strong> vs 65% for traditional methods
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">2. Explainable AI</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Every match shows exactly WHY. Companies can add notes with feedback.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Transparent match scoring (e.g., "85% match")
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Clear explanations ("Your Python project matches 3/4 requirements")
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Company notes: "Add AWS experience and you're perfect"
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <strong>85% higher trust</strong> in transparent AI (EU studies)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">3. Bidirectional Transparency</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Companies state requirements clearly. Students get actionable feedback. No guessing games.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      Companies explicitly state what skills/knowledge they need
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      Companies leave notes on profiles with specific feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      Students know exactly what to improve (e.g., "Add AWS experience")
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <strong>25% less hiring bias</strong> with transparent requirements
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">4. Consent & Audit Trails</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Complete control over data. See all company notes and feedback on your profile.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      Opt-in data sharing controls
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      See all company notes and what they're looking for
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      Revoke access anytime
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <strong>GDPR Article 15 compliant</strong>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits by Audience */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-12">
              Transparency Benefits Everyone
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">For Students</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• See which companies viewed your profile</li>
                    <li>• Understand why you were/weren't selected</li>
                    <li>• Know exactly what skills jobs require</li>
                    <li>• Trust that your skills are fairly represented</li>
                    <li>• No more black-box rejections</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">For Companies</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Verified skills, not resume inflation</li>
                    <li>• Explainable matches with reasoning</li>
                    <li>• See actual project work before contacting</li>
                    <li>• 92% match accuracy saves time</li>
                    <li>• €10 per contact vs €8K/year subscriptions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">For Institutions</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Track which companies view students</li>
                    <li>• Data-driven career counseling</li>
                    <li>• Early intervention for at-risk students</li>
                    <li>• Curriculum feedback from market demand</li>
                    <li>• 20-30% boost in placements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-20">
          <div className="container max-w-6xl">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-display font-bold mb-4">The Impact of Transparency</h2>
                <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                  Real data showing how transparency improves outcomes for everyone
                </p>

                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-5xl font-bold mb-2">92%</div>
                    <div className="text-white/90">Match Accuracy</div>
                    <div className="text-sm text-white/70 mt-1">(vs 65% for ATS)</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">85%</div>
                    <div className="text-white/90">Higher Trust</div>
                    <div className="text-sm text-white/70 mt-1">(EU AI transparency studies)</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">25%</div>
                    <div className="text-white/90">Less Bias</div>
                    <div className="text-sm text-white/70 mt-1">(with transparent criteria)</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">20-30%</div>
                    <div className="text-white/90">More Placements</div>
                    <div className="text-sm text-white/70 mt-1">(data-driven decisions)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Experience True Transparency
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join a platform where verified skills, explainable AI, and mutual visibility create better matches for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                <Link href="/auth/register/role-selection">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo/ai-search">Try Live Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span>Explainable AI</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
