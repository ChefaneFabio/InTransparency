'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
  Sparkles
} from 'lucide-react'
import { IMAGES } from '@/lib/images'

type TargetAudience = 'students' | 'institutes' | 'companies' | 'all'

interface Feature {
  id: string
  title: string
  description: string
  icon: any
  image: string
  targets: TargetAudience[]
  benefits: string[]
  status: 'live' | 'beta'
}

const features: Feature[] = [
  // Student Features
  {
    id: 'two-onboarding-paths',
    title: 'Two Ways to Join',
    description: 'University partner = opt-in streamlined profile from verified data. No university = upload projects + select courses.',
    icon: Upload,
    image: IMAGES.universityCampuses.graduation,
    targets: ['students'],
    benefits: [
      'University partners: consent via email, then streamlined profile',
      'Independent students upload projects',
      'AI identifies courses automatically',
      'Complete profile in < 5 minutes'
    ],
    status: 'live'
  },
  {
    id: 'ai-project-analysis',
    title: 'AI Project Analysis',
    description: 'Upload projects in ANY format (code, docs, presentations, designs) and our AI analyzes them to extract hard and soft skills.',
    icon: Brain,
    image: IMAGES.features.aiAnalysis,
    targets: ['students'],
    benefits: [
      'Works for ALL disciplines (Tech, Business, Law, Engineering, Design, etc.)',
      'Detects hard skills (Python, Excel, AutoCAD, etc.)',
      'Identifies soft skills (leadership, communication, creativity)',
      'Supports all project types (code, PDFs, presentations, portfolios)'
    ],
    status: 'live'
  },
  {
    id: 'complete-skill-profile',
    title: 'Complete Skill Profile',
    description: 'Comprehensive skill profile with hard skills, soft skills, courses, grades, and projects - all verified by university or AI.',
    icon: Award,
    image: IMAGES.students.student3,
    targets: ['students'],
    benefits: [
      'Hard + soft skills verified from projects',
      'University verification (if partner, with consent)',
      'Project portfolio included',
      'Course history with grades'
    ],
    status: 'live'
  },
  {
    id: 'ai-job-search',
    title: 'AI Job Search',
    description: 'Conversational AI search to find jobs that match your skills, location, and preferences.',
    icon: Search,
    image: IMAGES.features.search,
    targets: ['students'],
    benefits: [
      'Natural language search ("Marketing intern Milan")',
      'Matches based on your verified skills',
      'Location and availability filters',
      'Direct contact with recruiters'
    ],
    status: 'live'
  },
  {
    id: 'profile-visibility',
    title: 'Profile Visibility Analytics',
    description: 'See exactly which companies viewed your profile and when - complete transparency.',
    icon: Eye,
    image: IMAGES.features.dataAnalytics,
    targets: ['students'],
    benefits: [
      'See who viewed your profile',
      'Track company interest',
      'Understand which skills attracted views',
      'No hidden algorithms'
    ],
    status: 'live'
  },
  {
    id: 'verified-portfolios-students',
    title: 'Verified Portfolios',
    description: 'Your work is verified by your university (if partner) or our AI, proving skills are real.',
    icon: Shield,
    image: IMAGES.universities.library,
    targets: ['students'],
    benefits: [
      'University-backed verification',
      'AI skill validation',
      'Authenticated grades',
      'Trustworthy credentials'
    ],
    status: 'live'
  },

  // Company Features
  {
    id: 'ai-candidate-search',
    title: 'AI Candidate Search',
    description: 'Conversational search across ALL disciplines: "Marketing intern Milan creative portfolio" or "Civil Engineer Rome AutoCAD 28/30"',
    icon: Search,
    image: IMAGES.companies.office1,
    targets: ['companies'],
    benefits: [
      'Natural language search',
      'Search across ALL fields (Tech, Business, Law, etc.)',
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
    image: IMAGES.success.handshake,
    targets: ['companies'],
    benefits: [
      'Free registration (no credit card)',
      'Unlimited database exploration',
      'See all profiles (anonymized)',
      'Pay €10 only when you contact'
    ],
    status: 'live'
  },
  {
    id: 'verified-skills-companies',
    title: 'Verified Skills & Projects',
    description: 'See actual verified projects and institution-authenticated portfolios. Both hard and soft skills verified through academic work.',
    icon: Shield,
    image: IMAGES.universityCampuses.campus,
    targets: ['companies'],
    benefits: [
      'View real project work (code, designs, research)',
      'Institution-verified grades and achievements',
      'Hard and soft skills verified through coursework',
      'AI-analyzed competencies from projects'
    ],
    status: 'live'
  },
  {
    id: 'direct-messaging-companies',
    title: 'Direct Candidate Contact',
    description: 'Message candidates directly after unlocking contact. Get full name, email, phone, and LinkedIn.',
    icon: MessageSquare,
    image: IMAGES.recruiters.recruiter1,
    targets: ['companies'],
    benefits: [
      'Direct messaging system',
      'Full contact information',
      'AI-generated candidate CV',
      'Fast response times'
    ],
    status: 'live'
  },

  // Institute Features
  {
    id: 'company-search-intelligence',
    title: 'Company Search Intelligence',
    description: 'See which companies search your students: "Deloitte viewed 31 Economics students" = warm outreach opportunity.',
    icon: TrendingUp,
    image: IMAGES.features.dataAnalytics,
    targets: ['institutes'],
    benefits: [
      'Track which companies view students',
      'Identify warm outreach opportunities',
      'Understand employer interest patterns',
      'Build strategic partnerships'
    ],
    status: 'live'
  },
  {
    id: 'data-driven-counseling',
    title: 'Data-Driven Career Advice',
    description: 'Show students what skills are trending: "Excel searched 89x this month" = tell Business students to learn it.',
    icon: BarChart3,
    image: IMAGES.recruiters.recruiter2,
    targets: ['institutes'],
    benefits: [
      'See which skills companies search for',
      'Provide evidence-based career guidance',
      'Help students focus on in-demand skills',
      'Improve placement outcomes'
    ],
    status: 'live'
  },
  {
    id: 'early-intervention-alerts',
    title: 'Early Intervention Alerts',
    description: 'Flag at-risk students: "87 seniors graduating in 60 days with zero views" = proactive career support needed.',
    icon: Users,
    image: IMAGES.universityCampuses.campus,
    targets: ['institutes'],
    benefits: [
      'Identify students with low visibility',
      'Intervene before graduation',
      'Improve placement statistics',
      'Proactive career services'
    ],
    status: 'live'
  },
  {
    id: 'placement-dashboard',
    title: 'Placement Analytics Dashboard',
    description: 'Real-time statistics: contacts, hires, average time to hire. Prove your Career Center impact with data.',
    icon: BarChart3,
    image: IMAGES.features.matching,
    targets: ['institutes'],
    benefits: [
      'Track contacts → hires conversion',
      'Measure average time to hire',
      'Monitor student profile quality',
      'Generate impact reports'
    ],
    status: 'live'
  },
  {
    id: 'always-free-institutes',
    title: 'Always Free Platform',
    description: 'Zero cost forever for universities and ITS. You supply talent, we handle everything else.',
    icon: GraduationCap,
    image: IMAGES.universities.library,
    targets: ['institutes'],
    benefits: [
      'No setup fees',
      'No monthly costs',
      'No hidden charges',
      'Better than AlmaLaurea (€2,500/year)'
    ],
    status: 'live'
  },

  // Cross-audience Features
  {
    id: 'all-disciplines',
    title: 'All Disciplines Supported',
    description: 'Tech, Business, Law, Engineering, Architecture, Design, Psychology, Fashion - we analyze EVERYTHING.',
    icon: Award,
    image: IMAGES.students.student4,
    targets: ['all'],
    benefits: [
      'Computer Science & Tech',
      'Business & Economics',
      'Law & Legal Studies',
      'Engineering (Civil, Mechanical, etc.)',
      'Architecture & Design',
      'Psychology & Social Sciences',
      'Fashion & Creative Arts',
      'And more...'
    ],
    status: 'live'
  },

  // Transparency Features
  {
    id: 'explainable-ai-matching',
    title: 'Explainable AI Matching',
    description: 'Every match shows exactly WHY it was made. Companies state requirements clearly, AI explains alignment, and you get actionable feedback.',
    icon: Lightbulb,
    image: IMAGES.features.aiAnalysis,
    targets: ['all'],
    benefits: [
      'Transparent match scoring (e.g., "85% match")',
      'Clear alignment explanations ("Your Python project matches 3/4 requirements")',
      'Companies can leave notes: "Add AWS experience and you're perfect"',
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
    image: IMAGES.universityCampuses.campus,
    targets: ['companies', 'students'],
    benefits: [
      'Hard skills verified through projects and coursework',
      'Soft skills analyzed from teamwork and presentations',
      'Institution-authenticated grades and achievements',
      '92% match accuracy with verified data'
    ],
    status: 'live'
  },
  {
    id: 'bidirectional-transparency',
    title: 'Bidirectional Transparency',
    description: 'Companies explicitly state what skills and knowledge they need. Students get direct feedback via profile notes. No guessing, no hidden requirements.',
    icon: Eye,
    image: IMAGES.features.dataAnalytics,
    targets: ['all'],
    benefits: [
      'Companies leave notes on profiles with specific feedback',
      'Clear skill requirements stated upfront (not hidden)',
      'Students know exactly what to improve',
      'Institutions see real market demand from company notes',
      '25% less hiring bias with transparent criteria'
    ],
    status: 'live'
  },
  {
    id: 'consent-driven-sharing',
    title: 'Consent-Driven Data Sharing',
    description: 'Complete control over who sees what. See exactly which companies left notes, what they need, and why you're a fit (or not).',
    icon: Lock,
    image: IMAGES.students.student2,
    targets: ['students', 'institutes'],
    benefits: [
      'Opt-in data sharing controls',
      'See all company notes and feedback on your profile',
      'Know exactly what skills companies are seeking',
      'Revoke access anytime',
      'GDPR Article 15 compliant'
    ],
    status: 'live'
  },

  // AI Chatbot Features
  {
    id: 'student-ai-assistant',
    title: '24/7 AI Career Assistant',
    description: 'Conversational chatbot helps build your profile, find jobs, and get personalized career advice - all while gathering data transparently.',
    icon: Bot,
    image: IMAGES.features.aiAnalysis,
    targets: ['students'],
    benefits: [
      'Profile building guidance (projects, skills, courses)',
      'Job recommendations based on your verified skills',
      'Career advice specific to your discipline',
      'Skill demand insights ("Excel searched 89x this month")',
      '30% reduction in onboarding drop-offs',
      'Transparent data collection with GDPR compliance'
    ],
    status: 'live'
  },
  {
    id: 'institutional-feedback-loop',
    title: 'Institutional Feedback Loop',
    description: 'Learn from every interaction with structured feedback from companies, shared with you and your career center for continuous professional growth.',
    icon: MessageSquare,
    image: IMAGES.features.dataAnalytics,
    targets: ['students', 'companies', 'institutes'],
    benefits: [
      'Structured feedback after interviews (skills, performance, growth areas)',
      'Shared visibility: student + institution career center',
      'Actionable recommendations for skill development',
      'Company notes help students improve professionally',
      'Career centers gain market intelligence',
      'Institution-verified growth tracking'
    ],
    status: 'live'
  },
  {
    id: 'smart-application-assistant',
    title: 'Smart Application Assistant',
    description: 'AI-powered guidance during job applications. Get project suggestions, skill matching, and form completion help based on your verified profile.',
    icon: Bot,
    image: IMAGES.features.aiAnalysis,
    targets: ['students'],
    benefits: [
      'Smart form assistance with verified data auto-fill',
      'Project recommendations matching job requirements',
      'Skill gap analysis and suggestions',
      'Draft save & resume - never lose progress',
      '35% reduction in abandoned applications',
      'Completion tracking with actionable tips'
    ],
    status: 'live'
  },
  {
    id: 'academic-advocacy-network',
    title: 'Academic Advocacy Network',
    description: 'Institution-verified alumni success stories and student networking. Build professional connections through verified career journeys and peer referrals.',
    icon: Users,
    image: IMAGES.features.matching,
    targets: ['students', 'institutes'],
    benefits: [
      'Verified alumni success stories with career paths',
      'Institution-authenticated via .edu email verification',
      'Professional student networking (no gamification)',
      'Alumni advice for current students',
      'Career center insights from network growth',
      'Privacy-first with anonymization options'
    ],
    status: 'live'
  },
  {
    id: 'company-recruiting-assistant',
    title: 'AI Recruiting Assistant',
    description: 'Intelligent chatbot helps source candidates, explains match scores, and provides transparent recruiting guidance 24/7.',
    icon: Sparkles,
    image: IMAGES.features.matching,
    targets: ['companies'],
    benefits: [
      'Candidate sourcing tips across all disciplines',
      'Match score explanations (why 92% match?)',
      'Job description optimization guidance',
      'Skill demand trend insights',
      '40% higher engagement vs traditional search',
      'Transparent AI that shows reasoning'
    ],
    status: 'live'
  },
  {
    id: 'institution-partnership-assistant',
    title: 'AI Partnership Assistant',
    description: 'Institutional chatbot guides setup, explains analytics, and helps universities maximize student placements through data insights.',
    icon: MessageSquare,
    image: IMAGES.features.dataAnalytics,
    targets: ['institutes'],
    benefits: [
      'Free partnership onboarding guidance',
      'Dashboard analytics explanations',
      'Early intervention alert management',
      'European job opportunities search help',
      '20-30% more data gathered vs static forms',
      'Transparent conversation logging (GDPR compliant)'
    ],
    status: 'live'
  }
]

export default function FeaturesPage() {
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
              Platform Features
            </motion.h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Real features available today. No hype, just honest capabilities for students, institutes, and companies.
            </p>

            {/* Feature Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{features.length}</div>
                <div className="text-sm text-gray-700">Total Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{features.filter(f => f.status === 'live').length}</div>
                <div className="text-sm text-gray-700">Live Now</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-gray-700">Target Audiences</div>
              </div>
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
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200'
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
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
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
                      <p className="text-gray-700 text-sm">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      {/* Benefits List */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
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
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join InTransparency today. Students get complete platform access free forever.
                  Companies browse free, pay €10 per contact. Institutes always free.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/auth/register/role-selection">
                      Start Free
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
                      View Pricing
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
