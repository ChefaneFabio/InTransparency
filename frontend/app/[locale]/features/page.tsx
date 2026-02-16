'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Brain,
  Upload,
  Search,
  BarChart3,
  MessageSquare,
  Eye,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Award,
  Lightbulb,
  Lock,
  FileCheck,
  Bot,
  Sparkles,
  Target
} from 'lucide-react'
// TODO: Add translations for features array data
type TargetAudience = 'students' | 'institutes' | 'companies' | 'all'

interface Feature {
  id: string
  title: string
  description: string
  icon: any
  targets: TargetAudience[]
  benefits: string[]
  status: 'live' | 'beta'
}

const features: Feature[] = [
  // Student Features
  {
    id: 'institution-verified-profiles',
    title: 'Institution-Verified Profiles (Replaces Opaque CVs)',
    description: 'No more self-reported CVs with inflated claims. Upload projects (theses, stage curriculare, code) → Your institution authenticates them → Companies see verified competencies with source proof.',
    icon: Shield,
    targets: ['students', 'institutes', 'companies'],
    benefits: [
      'Every skill traceable to institution',
      'Skills verified with project grades',
      'Faster screening with verified data'
    ],
    status: 'live'
  },
  {
    id: 'ai-project-analysis',
    title: 'AI Analysis + Institution Verification Workflow',
    description: 'Upload projects (code, theses, stage curriculare) → AI extracts skills (e.g., "Python in web app") → Institution reviews via dashboard → Approve with stamp → Profile goes live with verified badge.',
    icon: Brain,
    targets: ['students', 'institutes'],
    benefits: [
      'AI extracts skills, institution endorses with one click',
      'Works for ALL disciplines: Tech, Business, Law, Design',
      'EU AI Act compliant: every skill traced to source'
    ],
    status: 'live'
  },
  {
    id: 'complete-skill-profile',
    title: 'Complete Skill Profile',
    description: 'Comprehensive skill profile with hard skills, soft skills, courses, grades, and projects - all verified by university or AI.',
    icon: Award,
    targets: ['students'],
    benefits: [
      'Hard + soft skills verified from projects',
      'University verification with consent',
      'Course history with grades'
    ],
    status: 'live'
  },
  {
    id: 'ai-job-search',
    title: 'AI Job Search',
    description: 'Conversational AI search to find jobs that match your skills, location, and preferences.',
    icon: Search,
    targets: ['students'],
    benefits: [
      'Natural language search ("Marketing intern Milan")',
      'Matches based on your verified skills',
      'Location and availability filters'
    ],
    status: 'live'
  },
  {
    id: 'profile-visibility',
    title: 'Profile Visibility Analytics',
    description: 'See exactly which companies viewed your profile and when - complete transparency.',
    icon: Eye,
    targets: ['students'],
    benefits: [
      'See who viewed your profile',
      'Track company interest',
      'No hidden algorithms'
    ],
    status: 'live'
  },
  {
    id: 'verified-portfolios-students',
    title: 'Verified Portfolios',
    description: 'Your work is verified by your university (if partner) or our AI, proving skills are real.',
    icon: Shield,
    targets: ['students'],
    benefits: [
      'University-backed verification',
      'AI skill validation',
      'Authenticated grades'
    ],
    status: 'live'
  },

  // Company Features
  {
    id: 'ai-candidate-search',
    title: 'AI Candidate Search',
    description: 'Conversational search across ALL disciplines: "Marketing intern Milan creative portfolio" or "Civil Engineer Rome AutoCAD 28/30"',
    icon: Search,
    targets: ['companies'],
    benefits: [
      'Natural language search across all fields',
      'Filter by skills, location, grades',
      'See verified projects + soft skills'
    ],
    status: 'live'
  },
  {
    id: 'browse-free-pay-per-contact',
    title: 'Browse Free, Pay Per Contact',
    description: 'Unlimited free browsing of all profiles. Only pay €10 when you decide to contact a specific candidate.',
    icon: Zap,
    targets: ['companies'],
    benefits: [
      'Free registration, no credit card',
      'Unlimited browsing of anonymized profiles',
      'Pay €10 only when you contact'
    ],
    status: 'live'
  },
  {
    id: 'verified-skills-companies',
    title: 'Verified Skills & Projects',
    description: 'See actual verified projects and institution-authenticated portfolios. Both hard and soft skills verified through academic work.',
    icon: Shield,
    targets: ['companies'],
    benefits: [
      'View real project work (code, designs, research)',
      'Institution-verified grades and achievements',
      'Hard and soft skills verified through coursework'
    ],
    status: 'live'
  },
  {
    id: 'direct-messaging-companies',
    title: 'Direct Candidate Contact',
    description: 'Message candidates directly after unlocking contact. Get full name, email, phone, and LinkedIn.',
    icon: MessageSquare,
    targets: ['companies'],
    benefits: [
      'Direct messaging system',
      'Full contact information revealed',
      'AI-generated candidate CV'
    ],
    status: 'live'
  },

  // Institute Features
  {
    id: 'company-search-intelligence',
    title: 'Company Search Intelligence',
    description: 'See which companies search your students: "Deloitte viewed 31 Economics students" = warm outreach opportunity.',
    icon: TrendingUp,
    targets: ['institutes'],
    benefits: [
      'Track which companies view students',
      'Identify warm outreach opportunities',
      'Understand employer interest patterns'
    ],
    status: 'live'
  },
  {
    id: 'data-driven-counseling',
    title: 'Data-Driven Career Advice',
    description: 'Show students what skills are trending: "Excel searched 89x this month" = tell Business students to learn it.',
    icon: BarChart3,
    targets: ['institutes'],
    benefits: [
      'See which skills companies search for',
      'Evidence-based career guidance',
      'Help students focus on in-demand skills'
    ],
    status: 'live'
  },
  {
    id: 'early-intervention-alerts',
    title: 'Early Intervention Alerts',
    description: 'Flag at-risk students: "87 seniors graduating in 60 days with zero views" = proactive career support needed.',
    icon: Users,
    targets: ['institutes'],
    benefits: [
      'Identify students with low visibility',
      'Intervene before graduation',
      'Improve placement statistics'
    ],
    status: 'live'
  },
  {
    id: 'placement-dashboard',
    title: 'Placement Analytics Dashboard',
    description: 'Real-time statistics: contacts, hires, average time to hire. Prove your Career Center impact with data.',
    icon: BarChart3,
    targets: ['institutes'],
    benefits: [
      'Track contacts to hires conversion',
      'Measure average time to hire',
      'Generate impact reports'
    ],
    status: 'live'
  },
  {
    id: 'always-free-institutes',
    title: 'Always Free Platform',
    description: 'Zero cost forever for universities and ITS. You supply talent, we handle everything else.',
    icon: GraduationCap,
    targets: ['institutes'],
    benefits: [
      'No setup fees, core features included',
      'Enterprise options available',
      'You supply talent, we handle the rest'
    ],
    status: 'live'
  },

  // Cross-audience Features
  {
    id: 'all-disciplines',
    title: 'All Disciplines Supported',
    description: 'Tech, Business, Law, Engineering, Architecture, Design, Psychology, Fashion - we analyze EVERYTHING.',
    icon: Award,
    targets: ['all'],
    benefits: [
      'Tech, Business, Law, Engineering',
      'Architecture, Design, Psychology',
      'Fashion, Creative Arts, and more'
    ],
    status: 'live'
  },

  // Transparency Features
  {
    id: 'explainable-ai-matching',
    title: 'Explainable AI Matching',
    description: 'Every match shows exactly WHY it was made. Companies state requirements clearly, AI explains alignment, and you get actionable feedback.',
    icon: Lightbulb,
    targets: ['all'],
    benefits: [
      'Transparent match scoring with explanations',
      'No hidden criteria or bias',
      'GDPR-compliant AI transparency'
    ],
    status: 'live'
  },
  {
    id: 'verified-competencies',
    title: 'Institution-Verified Skills',
    description: 'Hard skills (Python, Excel, CAD) and soft skills (teamwork, leadership, communication) verified through projects, courses, and institutional data.',
    icon: FileCheck,
    targets: ['companies', 'students'],
    benefits: [
      'Hard skills verified through projects',
      'Soft skills analyzed from teamwork',
      'Institution-authenticated grades'
    ],
    status: 'live'
  },
  {
    id: 'bidirectional-transparency',
    title: 'Bidirectional Requirement Visibility (Solves Company Opacity)',
    description: 'Companies MUST define 3-5 specific requirements (e.g., "Excel + communication for Milan marketing intern"). Students see exact needs. Institutions see aggregate trends. Every match shows reasoning via Transparency Panel.',
    icon: Eye,
    targets: ['all'],
    benefits: [
      'Companies specify clear requirements',
      'Transparency Panel explains match reasoning',
      'Full disclosure: every match explained'
    ],
    status: 'live'
  },
  {
    id: 'verification-log-audit-trail',
    title: 'Verification Log & Audit Trail',
    description: 'Complete transparency into who verified your competencies and when. See audit trail: "Your leadership skill from group project verified by Sapienza Roma on Oct 29, 2025—shared with BMW."',
    icon: FileCheck,
    targets: ['students', 'institutes', 'companies'],
    benefits: [
      'Full audit trail for every verified skill',
      'Institutional stamp visible to all parties',
      'GDPR Article 15 compliant transparency'
    ],
    status: 'live'
  },

  // AI Chatbot Features
  {
    id: 'student-ai-assistant',
    title: '24/7 AI Career Assistant',
    description: 'Conversational chatbot helps build your profile, find jobs, and get personalized career advice - all while gathering data transparently.',
    icon: Bot,
    targets: ['students'],
    benefits: [
      'Profile building and job recommendations',
      'Career advice specific to your discipline',
      'Transparent data collection, GDPR compliant'
    ],
    status: 'live'
  },
  {
    id: 'institutional-feedback-loop',
    title: 'Institutional Feedback Loop',
    description: 'Learn from every interaction with structured feedback from companies, shared with you and your career center for continuous professional growth.',
    icon: MessageSquare,
    targets: ['students', 'companies', 'institutes'],
    benefits: [
      'Structured feedback after interviews',
      'Shared visibility: student + career center',
      'Actionable skill development recommendations'
    ],
    status: 'live'
  },
  {
    id: 'smart-application-assistant',
    title: 'Smart Application Assistant',
    description: 'AI-powered guidance during job applications. Get project suggestions, skill matching, and form completion help based on your verified profile.',
    icon: Bot,
    targets: ['students'],
    benefits: [
      'Smart form assistance with auto-fill',
      'Project recommendations matching jobs',
      'Skill gap analysis and suggestions'
    ],
    status: 'live'
  },
  {
    id: 'academic-advocacy-network',
    title: 'Academic Advocacy Network',
    description: 'Institution-verified alumni success stories and student networking. Build professional connections through verified career journeys and peer referrals.',
    icon: Users,
    targets: ['students', 'institutes'],
    benefits: [
      'Verified alumni success stories',
      'Professional networking, no gamification',
      'Privacy-first with anonymization options'
    ],
    status: 'live'
  },
  {
    id: 'company-recruiting-assistant',
    title: 'AI Recruiting Assistant',
    description: 'Intelligent chatbot helps source candidates, explains match scores, and provides transparent recruiting guidance 24/7.',
    icon: Sparkles,
    targets: ['companies'],
    benefits: [
      'Candidate sourcing across all disciplines',
      'Match score explanations',
      'Transparent AI that shows reasoning'
    ],
    status: 'live'
  },
  {
    id: 'institution-partnership-assistant',
    title: 'AI Partnership Assistant',
    description: 'Institutional chatbot guides setup, explains analytics, and helps universities maximize student placements through data insights.',
    icon: MessageSquare,
    targets: ['institutes'],
    benefits: [
      'Free partnership onboarding guidance',
      'Dashboard analytics explanations',
      'Early intervention alert management'
    ],
    status: 'live'
  }
]

export default function FeaturesPage() {
  const t = useTranslations('features')
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience>('all')

  const filteredFeatures = selectedAudience === 'all'
    ? features
    : features.filter(f => f.targets.includes(selectedAudience) || f.targets.includes('all'))

  const audienceConfig = {
    all: { name: 'All Features', icon: Award, color: 'from-primary to-secondary' },
    students: { name: 'For Students', icon: GraduationCap, color: 'from-primary to-secondary' },
    institutes: { name: 'For Institutes', icon: Building2, color: 'from-primary to-secondary' },
    companies: { name: 'For Companies', icon: Briefcase, color: 'from-primary to-secondary' }
  }

  const getTargetBadges = (targets: TargetAudience[]) => {
    if (targets.includes('all')) return [{ label: 'All', color: 'bg-gray-100 text-gray-800' }]

    return targets.map(target => {
      const config: { [key: string]: { label: string; color: string } } = {
        students: { label: 'Students', color: 'bg-blue-100 text-blue-800' },
        institutes: { label: 'Institutes', color: 'bg-purple-100 text-purple-800' },
        companies: { label: 'Companies', color: 'bg-green-100 text-green-800' }
      }
      return config[target]
    })
  }

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
            <motion.h1
              className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {t('hero.title')}
            </motion.h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Feature Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{features.length}</div>
                <div className="text-sm text-foreground/80">Total Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{features.filter(f => f.status === 'live').length}</div>
                <div className="text-sm text-foreground/80">Live Now</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-foreground/80">Target Audiences</div>
              </div>
            </div>

            {/* Service Model Badge */}
            <div className="flex justify-center mb-4">
              <div className="text-xs text-muted-foreground bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                Freemium Model
              </div>
            </div>
          </motion.div>

          {/* Four Services Overview - WITH VISUAL HIERARCHY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Four Services - Marketplace Platform
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Marketplace services (Discovery, Matching) powered by verification quality layer (Verification, Analytics)
            </p>

            {/* PRIMARY SERVICES - Larger cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Discovery Service - PRIMARY */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-green-600 text-white text-xs">PRIMARY SERVICE</Badge>
                  <CardTitle className="text-lg">Discovery Service</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">Browse FREE, €10/contact</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p className="mb-2 font-semibold text-green-700">Reverse Recruitment Marketplace</p>
                  <ul className="space-y-1.5">
                    <li>• Companies discover verified student profiles</li>
                    <li>• Students visible without applying (zero applications)</li>
                    <li>• AI candidate/job search with filters</li>
                    <li>• Profile visibility analytics for students</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-muted-foreground">
                    Verified skills reduce fake applications
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service - PRIMARY */}
              <Card className="border-2 border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-gradient-to-br from-secondary to-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-secondary text-white text-xs">PRIMARY SERVICE</Badge>
                  <CardTitle className="text-lg">Matching Service</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">FREE for Students</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p className="mb-2 font-semibold text-secondary">AI-Powered Connections</p>
                  <ul className="space-y-1.5">
                    <li>• Explainable AI matching</li>
                    <li>• Bidirectional transparency (students see why)</li>
                    <li>• Higher accuracy with institutional data</li>
                    <li>• Full reasoning shown for every match</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-muted-foreground">
                    Transparent AI: Every match fully explained
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* SECONDARY SERVICES - Smaller cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Verification Service - SECONDARY */}
              <Card className="border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Verification Service</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Quality Layer</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80">
                  <p className="mb-2 font-semibold text-foreground">Enables Marketplace Trust</p>
                  <ul className="space-y-1">
                    <li>• Institution-verified profiles (not self-reported)</li>
                    <li>• Manual verification or API integration</li>
                    <li>• Audit trails & verification logs</li>
                    <li>• Fully traceable competencies to source</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-muted-foreground">
                    Freemium for universities
                  </p>
                </CardContent>
              </Card>

              {/* Analytics Service - SECONDARY */}
              <Card className="border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">Analytics Service</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">Track Impact</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80">
                  <p className="mb-2 font-semibold text-foreground">Measure Marketplace Success</p>
                  <ul className="space-y-1">
                    <li>• Company search insights (who viewed students)</li>
                    <li>• Data-driven career counseling for institutions</li>
                    <li>• Early intervention alerts (zero-view students)</li>
                    <li>• Placement dashboards & MIUR reports</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-muted-foreground">
                    Analytics included in freemium
                  </p>
                </CardContent>
              </Card>
            </div>

          </motion.div>

          {/* Audience Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {(Object.keys(audienceConfig) as TargetAudience[]).map((audience) => {
                const config = audienceConfig[audience]
                const Icon = config.icon
                const count = audience === 'all'
                  ? features.length
                  : features.filter(f => f.targets.includes(audience) || f.targets.includes('all')).length

                return (
                  <button
                    key={audience}
                    onClick={() => setSelectedAudience(audience)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedAudience === audience
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-100 bg-white border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {count}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredFeatures.map((feature, index) => {
              const Icon = feature.icon
              const targetBadges = getTargetBadges(feature.targets)

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                >
                  <Card className="transition-all hover:shadow-2xl h-full bg-white/90 backdrop-blur-sm border-gray-200">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {targetBadges.map((badge, idx) => (
                            <Badge key={idx} className={badge.color}>
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CardTitle className="text-foreground text-lg">{feature.title}</CardTitle>
                      <p className="text-foreground/80 text-sm">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      {/* Benefits List */}
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2 text-sm">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm text-foreground/80">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-to-r from-primary to-secondary border-0 shadow-2xl">
              <CardContent className="py-12 px-6">
                <h3 className="text-3xl font-display font-bold text-white mb-4">
                  {t('cta.title')}
                </h3>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/auth/register">
                      {t('cta.primaryButton')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/pricing">
                      {t('cta.secondaryButton')}
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-white/80 mt-6">
                  ✓ No credit card required  ✓ Always free for students  ✓ Always free for institutes
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
