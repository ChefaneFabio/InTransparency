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
  Sparkles,
  Target
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
    id: 'institution-verified-profiles',
    title: 'Institution-Verified Profiles (Replaces Opaque CVs)',
    description: 'No more self-reported CVs with inflated claims. Upload projects (theses, stage curriculare, code) → Your institution authenticates them → Companies see 100% verified competencies with source proof.',
    icon: Shield,
    image: IMAGES.universityCampuses.graduation,
    targets: ['students', 'institutes', 'companies'],
    benefits: [
      'Zero resume inflation: Every skill traceable to institution (Esse3/Moodle)',
      '100% authenticity: "Python verified by ITS G. Natta, 28/30 project grade"',
      'Project excerpts/links shown to companies with institutional stamp',
      'Solves 30% false positives in hiring vs. self-reported Indeed CVs',
      '80% faster screening for companies (92% verified match accuracy)',
      '25% higher response rates for students (credibility boost)'
    ],
    status: 'live'
  },
  {
    id: 'ai-project-analysis',
    title: 'AI Analysis + Institution Verification Workflow',
    description: 'Upload projects (code, theses, stage curriculare) → AI extracts skills (e.g., "Python in web app") → Institution reviews via dashboard → Approve with stamp → Profile goes live with 100% verified badge.',
    icon: Brain,
    image: IMAGES.features.aiAnalysis,
    targets: ['students', 'institutes'],
    benefits: [
      'AI initial scan: "Excel model built" extracted from uploaded project PDF',
      'Institution dashboard: "Endorse this project? Y/N" button (batch 50 in 1 hour)',
      'Final validation: "Verified by Politecnico Milano, 30/30 in ML thesis"',
      'Free core feature for institutions (Esse3/Moodle auto-import)',
      'Works for ALL disciplines: Tech, Business, Law, Engineering, Design',
      'EU AI Act compliant: Every skill traced to authenticated source'
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
      'Companies can leave notes: "Add AWS experience and you are perfect"',
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
    title: 'Bidirectional Requirement Visibility (Solves Company Opacity)',
    description: 'Companies MUST define 3-5 specific requirements (e.g., "Excel + communication for Milan marketing intern"). Students see exact needs. Institutions see aggregate trends. Every match shows reasoning via Transparency Panel.',
    icon: Eye,
    image: IMAGES.features.dataAnalytics,
    targets: ['all'],
    benefits: [
      'No vague job posts: Companies required to specify "Must-have: AutoCAD, preferred: 28/30 GPA"',
      'Transparency Panel: "92% fit because Python from your thesis matches their ML skills req"',
      'Students see: "This BMW internship seeks AutoCAD—your verified project matches 92%"',
      'Institutions dashboard: "Deloitte searched Contract Law 89x—advise law students"',
      'Full disclosure engine: No hidden scores, every match explained (EU AI Act compliant)',
      'Reduces mismatches by 35% vs. Indeed vague postings, 25% less bias'
    ],
    status: 'live'
  },
  {
    id: 'verification-log-audit-trail',
    title: 'Verification Log & Audit Trail',
    description: 'Complete transparency into who verified your competencies and when. See audit trail: "Your leadership skill from group project verified by Sapienza Roma on Oct 29, 2025—shared with BMW."',
    icon: FileCheck,
    image: IMAGES.students.student2,
    targets: ['students', 'institutes', 'companies'],
    benefits: [
      'Full audit trail: "Python skill verified by ITS G. Natta, Oct 29, 2025, 28/30 grade"',
      'Institutional stamp visible: "Competency authenticated by Politecnico Milano"',
      'Verification logs for students: "Your AutoCAD project endorsed—shared with 3 recruiters"',
      'Companies see source: "This skill verified Oct 29, 2025 via Esse3 import"',
      'GDPR Article 15 compliant: Complete data transparency',
      '100% traceability: Every skill → institution → date → context'
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

            {/* Service Model Badge */}
            <div className="flex justify-center mb-4">
              <div className="text-xs text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                Subscription-Free Service Model • Partner-Enabled
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
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
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
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-2 font-semibold text-green-700">Reverse Recruitment Marketplace</p>
                  <ul className="space-y-1.5">
                    <li>• Companies discover verified student profiles</li>
                    <li>• Students visible without applying (zero applications)</li>
                    <li>• AI candidate/job search with filters</li>
                    <li>• Profile visibility analytics for students</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-gray-600">
                    vs Indeed: Verified skills = 30% fewer fake CVs
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
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-2 font-semibold text-secondary">AI-Powered Connections</p>
                  <ul className="space-y-1.5">
                    <li>• Explainable AI: "92% fit because Python thesis"</li>
                    <li>• Bidirectional transparency (students see why)</li>
                    <li>• 92% verified accuracy (vs 60% self-reported)</li>
                    <li>• Full reasoning shown for every match</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-gray-600">
                    vs Manatal: Opaque scores, no explanations
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
                <CardContent className="text-xs text-gray-700">
                  <p className="mb-2 font-semibold text-gray-900">Enables Marketplace Trust</p>
                  <ul className="space-y-1">
                    <li>• Institution-verified profiles (not self-reported)</li>
                    <li>• Esse3/Moodle integration for auto-import</li>
                    <li>• Audit trails & verification logs</li>
                    <li>• 100% traceable competencies to source</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-gray-600">
                    Free vs AlmaLaurea €2,500/year
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
                <CardContent className="text-xs text-gray-700">
                  <p className="mb-2 font-semibold text-gray-900">Measure Marketplace Success</p>
                  <ul className="space-y-1">
                    <li>• Company search insights (who viewed students)</li>
                    <li>• Data-driven career counseling for institutions</li>
                    <li>• Early intervention alerts (zero-view students)</li>
                    <li>• Placement dashboards & MIUR reports</li>
                  </ul>
                  <p className="text-xs italic pt-2 mt-2 border-t text-gray-600">
                    Free vs Univariety €500/year
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
                    <Link href="/auth/register">
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
