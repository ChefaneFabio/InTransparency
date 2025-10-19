'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Target,
  Zap,
  Shield,
  Globe,
  BarChart3,
  MessageSquare,
  Calendar,
  Award,
  Eye,
  Settings,
  Database,
  Brain,
  Network,
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  PlayCircle,
  Download,
  Upload,
  Link,
  Clock,
  Filter,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
  Lock,
  Key,
  Bell,
  Mail,
  Phone,
  Video,
  Mic,
  Share2,
  BookOpen,
  Code,
  Palette,
  Camera,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface Feature {
  id: string
  category: string
  title: string
  description: string
  icon: any
  status: string
  benefits: string[]
  demoUrl: string
  color: string
}

const featureCategories = [
  {
    id: 'all',
    name: 'All Features',
    count: 45,
    icon: Layers
  },
  {
    id: 'talent-discovery',
    name: 'Talent Discovery',
    count: 8,
    icon: Search
  },
  {
    id: 'geographic-mapping',
    name: 'Geographic Mapping',
    count: 6,
    icon: Globe
  },
  {
    id: 'ai-matching',
    name: 'AI Matching',
    count: 7,
    icon: Brain
  },
  {
    id: 'communication',
    name: 'Communication',
    count: 5,
    icon: MessageSquare
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    count: 8,
    icon: BarChart3
  },
  {
    id: 'platform',
    name: 'Platform Features',
    count: 11,
    icon: Settings
  }
]

const features = [
  // Talent Discovery Features
  {
    id: 'advanced-search',
    category: 'talent-discovery',
    title: 'Advanced Talent Search',
    description: 'Multi-faceted search engine with filters for skills, location, experience, education, and more.',
    icon: Search,
    status: 'live',
    benefits: ['Boolean search operators', 'Saved search alerts', 'Real-time results', 'Export capabilities'],
    demoUrl: '/dashboard/recruiter/advanced-search',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'skill-matching',
    category: 'talent-discovery',
    title: 'Smart Skill Matching',
    description: 'AI-powered skill matching that goes beyond keyword matching to understand context and proficiency.',
    icon: Target,
    status: 'live',
    benefits: ['Semantic skill matching', 'Proficiency levels', 'Skill gap analysis', 'Certification verification'],
    demoUrl: '/dashboard/recruiter/talent-discovery',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'candidate-discovery',
    category: 'talent-discovery',
    title: 'Passive Candidate Discovery',
    description: 'Find talented individuals who aren\'t actively job searching but are open to opportunities.',
    icon: Eye,
    status: 'live',
    benefits: ['Hidden talent pools', 'Interest indicators', 'Passive engagement', 'Opportunity matching'],
    demoUrl: '/dashboard/recruiter/candidates',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'university-partnerships',
    category: 'talent-discovery',
    title: 'University Partnerships',
    description: 'Direct integration with universities to access verified student and graduate profiles.',
    icon: GraduationCap,
    status: 'live',
    benefits: ['Verified academic records', 'Early talent access', 'Campus recruiting', 'Alumni networks'],
    demoUrl: '/dashboard/university',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'talent-pipeline',
    category: 'talent-discovery',
    title: 'Talent Pipeline Management',
    description: 'Build and manage talent pools for future opportunities with automated engagement.',
    icon: Network,
    status: 'beta',
    benefits: ['Pipeline tracking', 'Automated nurturing', 'Talent pools', 'Future opportunities'],
    demoUrl: '/dashboard/recruiter/saved-candidates',
    color: 'bg-cyan-50 border-cyan-200'
  },
  {
    id: 'diversity-sourcing',
    category: 'talent-discovery',
    title: 'Diversity-First Sourcing',
    description: 'Built-in tools to promote diverse hiring practices and track diversity metrics.',
    icon: Users,
    status: 'live',
    benefits: ['Bias reduction', 'Diversity metrics', 'Inclusive sourcing', 'Equal opportunity'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'talent-scoring',
    category: 'talent-discovery',
    title: 'Intelligent Talent Scoring',
    description: 'AI-driven scoring system that evaluates candidates based on multiple factors.',
    icon: Star,
    status: 'live',
    benefits: ['Multi-factor scoring', 'Predictive analytics', 'Custom criteria', 'Performance indicators'],
    demoUrl: '/dashboard/recruiter/talent-analytics',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    id: 'project-analysis',
    category: 'talent-discovery',
    title: 'Academic Project Analysis',
    description: 'Deep analysis of student projects to assess real-world skills and potential.',
    icon: Code,
    status: 'beta',
    benefits: ['Code quality assessment', 'Project complexity', 'Innovation metrics', 'Technical skills'],
    demoUrl: '/dashboard/student/projects',
    color: 'bg-teal-50 border-teal-200'
  },

  // Geographic Mapping Features
  {
    id: 'global-talent-map',
    category: 'geographic-mapping',
    title: 'Global Talent Mapping',
    description: 'Interactive world map showing talent distribution, density, and availability by region.',
    icon: Globe,
    status: 'live',
    benefits: ['Real-time mapping', 'Talent density heatmaps', 'Regional insights', 'Migration patterns'],
    demoUrl: '/geographic-talent-search',
    color: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'location-intelligence',
    category: 'geographic-mapping',
    title: 'Location Intelligence',
    description: 'Advanced geographic analytics including cost of living, market dynamics, and talent clusters.',
    icon: MapPin,
    status: 'live',
    benefits: ['Market analysis', 'Cost comparisons', 'Talent clusters', 'Competitive landscape'],
    demoUrl: '/geographic-talent-search',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'remote-workforce',
    category: 'geographic-mapping',
    title: 'Remote Workforce Mapping',
    description: 'Specialized tools for building and managing distributed remote teams.',
    icon: Monitor,
    status: 'live',
    benefits: ['Remote talent pools', 'Time zone optimization', 'Cultural fit analysis', 'Remote onboarding'],
    demoUrl: '/dashboard/recruiter/geographic-search',
    color: 'bg-slate-50 border-slate-200'
  },
  {
    id: 'market-expansion',
    category: 'geographic-mapping',
    title: 'Market Expansion Planning',
    description: 'Data-driven insights for expanding into new geographic markets.',
    icon: TrendingUp,
    status: 'beta',
    benefits: ['Market viability', 'Talent availability', 'Competition analysis', 'Growth projections'],
    demoUrl: '/dashboard/recruiter/talent-analytics',
    color: 'bg-violet-50 border-violet-200'
  },
  {
    id: 'proximity-search',
    category: 'geographic-mapping',
    title: 'Proximity-Based Search',
    description: 'Find talent within specific distances from offices, universities, or other locations.',
    icon: Target,
    status: 'live',
    benefits: ['Radius search', 'Commute analysis', 'Local talent pools', 'Geographic preferences'],
    demoUrl: '/geographic-talent-search',
    color: 'bg-amber-50 border-amber-200'
  },
  {
    id: 'migration-tracking',
    category: 'geographic-mapping',
    title: 'Talent Migration Insights',
    description: 'Track talent movement patterns and predict future migration trends.',
    icon: Activity,
    status: 'coming-soon',
    benefits: ['Migration patterns', 'Trend prediction', 'Brain drain analysis', 'Opportunity mapping'],
    demoUrl: '#',
    color: 'bg-rose-50 border-rose-200'
  },

  // AI Matching Features
  {
    id: 'intelligent-matching',
    category: 'ai-matching',
    title: 'AI-Powered Matching Engine',
    description: 'Advanced machine learning algorithms that continuously improve match quality.',
    icon: Brain,
    status: 'live',
    benefits: ['Learning algorithms', 'Pattern recognition', 'Predictive matching', 'Success optimization'],
    demoUrl: '/dashboard/recruiter/talent-discovery',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'personality-matching',
    category: 'ai-matching',
    title: 'Personality & Culture Fit',
    description: 'Advanced psychometric analysis to ensure cultural and personality alignment.',
    icon: Users,
    status: 'beta',
    benefits: ['Personality assessment', 'Culture alignment', 'Team dynamics', 'Work style matching'],
    demoUrl: '/dashboard/student/profile-optimizer',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'career-trajectory',
    category: 'ai-matching',
    title: 'Career Trajectory Prediction',
    description: 'AI models that predict career growth paths and potential for various roles.',
    icon: TrendingUp,
    status: 'beta',
    benefits: ['Growth prediction', 'Career planning', 'Potential assessment', 'Long-term value'],
    demoUrl: '/dashboard/student/analytics',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'skill-gap-analysis',
    category: 'ai-matching',
    title: 'Automated Skill Gap Analysis',
    description: 'Identify skill gaps and recommend training or alternative candidates.',
    icon: Target,
    status: 'live',
    benefits: ['Gap identification', 'Training recommendations', 'Alternative matches', 'Skill development'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-cyan-50 border-cyan-200'
  },
  {
    id: 'success-prediction',
    category: 'ai-matching',
    title: 'Job Success Prediction',
    description: 'Predict likelihood of success in specific roles based on historical data.',
    icon: Star,
    status: 'beta',
    benefits: ['Success scoring', 'Performance prediction', 'Risk assessment', 'Confidence intervals'],
    demoUrl: '/dashboard/recruiter/talent-analytics',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    id: 'continuous-learning',
    category: 'ai-matching',
    title: 'Continuous Learning System',
    description: 'AI that learns from hiring outcomes to improve future recommendations.',
    icon: Brain,
    status: 'live',
    benefits: ['Outcome learning', 'Model improvement', 'Feedback loops', 'Accuracy enhancement'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'semantic-search',
    category: 'ai-matching',
    title: 'Semantic Job Matching',
    description: 'Understanding context and meaning beyond keywords for better job-candidate fit.',
    icon: Search,
    status: 'live',
    benefits: ['Context understanding', 'Semantic analysis', 'Intent recognition', 'Better relevance'],
    demoUrl: '/dashboard/recruiter/jobs',
    color: 'bg-teal-50 border-teal-200'
  },

  // Communication Features
  {
    id: 'messaging-system',
    category: 'communication',
    title: 'Integrated Messaging',
    description: 'Built-in communication platform for seamless candidate and employer interaction.',
    icon: MessageSquare,
    status: 'live',
    benefits: ['Real-time messaging', 'File sharing', 'Message history', 'Automated responses'],
    demoUrl: '/dashboard/student/messages',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'video-interviews',
    category: 'communication',
    title: 'Integrated Video Interviews',
    description: 'Built-in video interviewing platform with recording and assessment tools.',
    icon: Video,
    status: 'beta',
    benefits: ['HD video calls', 'Interview recording', 'Assessment tools', 'Scheduling integration'],
    demoUrl: '/dashboard/recruiter/candidates',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'notification-system',
    category: 'communication',
    title: 'Smart Notifications',
    description: 'Intelligent notification system that keeps all parties informed without overwhelming.',
    icon: Bell,
    status: 'live',
    benefits: ['Smart filtering', 'Customizable alerts', 'Priority levels', 'Digest summaries'],
    demoUrl: '/dashboard',
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'collaboration-tools',
    category: 'communication',
    title: 'Team Collaboration',
    description: 'Tools for hiring teams to collaborate on candidate evaluation and decision making.',
    icon: Users,
    status: 'live',
    benefits: ['Team discussions', 'Shared notes', 'Decision tracking', 'Collaborative scoring'],
    demoUrl: '/dashboard/recruiter/candidates',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'automated-outreach',
    category: 'communication',
    title: 'Automated Outreach',
    description: 'Intelligent automation for initial candidate outreach with personalized messages.',
    icon: Mail,
    status: 'beta',
    benefits: ['Personalized templates', 'A/B testing', 'Response tracking', 'Follow-up sequences'],
    demoUrl: '/dashboard/recruiter/saved-candidates',
    color: 'bg-indigo-50 border-indigo-200'
  },

  // Analytics & Insights
  {
    id: 'recruitment-analytics',
    category: 'analytics',
    title: 'Advanced Recruitment Analytics',
    description: 'Comprehensive analytics dashboard with KPIs, trends, and predictive insights.',
    icon: BarChart3,
    status: 'live',
    benefits: ['KPI tracking', 'Trend analysis', 'Predictive insights', 'Custom reports'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'market-intelligence',
    category: 'analytics',
    title: 'Market Intelligence',
    description: 'Real-time market data including salary benchmarks, skill demand, and competition.',
    icon: TrendingUp,
    status: 'live',
    benefits: ['Salary benchmarks', 'Skill demand trends', 'Market insights', 'Competitive analysis'],
    demoUrl: '/dashboard/recruiter/talent-analytics',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'diversity-metrics',
    category: 'analytics',
    title: 'Diversity & Inclusion Metrics',
    description: 'Track and improve diversity across all stages of the recruitment process.',
    icon: Users,
    status: 'live',
    benefits: ['Diversity tracking', 'Bias detection', 'Inclusion metrics', 'Progress monitoring'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'performance-tracking',
    category: 'analytics',
    title: 'Hiring Performance Tracking',
    description: 'Monitor hiring team performance, process efficiency, and outcome quality.',
    icon: Activity,
    status: 'live',
    benefits: ['Performance metrics', 'Process optimization', 'Quality tracking', 'Team comparisons'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    id: 'predictive-analytics',
    category: 'analytics',
    title: 'Predictive Workforce Analytics',
    description: 'Forecast hiring needs, talent availability, and market changes.',
    icon: Brain,
    status: 'beta',
    benefits: ['Demand forecasting', 'Supply prediction', 'Trend analysis', 'Strategic planning'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-cyan-50 border-cyan-200'
  },
  {
    id: 'roi-analysis',
    category: 'analytics',
    title: 'Recruitment ROI Analysis',
    description: 'Measure return on investment for different recruitment strategies and channels.',
    icon: PieChart,
    status: 'live',
    benefits: ['Cost analysis', 'Channel effectiveness', 'ROI calculation', 'Budget optimization'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'custom-reports',
    category: 'analytics',
    title: 'Custom Report Builder',
    description: 'Build custom reports and dashboards tailored to specific business needs.',
    icon: FileText,
    status: 'beta',
    benefits: ['Custom metrics', 'Flexible reporting', 'Automated delivery', 'Data visualization'],
    demoUrl: '/dashboard/recruiter/analytics',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'benchmark-comparison',
    category: 'analytics',
    title: 'Industry Benchmarking',
    description: 'Compare your recruitment metrics against industry standards and competitors.',
    icon: BarChart3,
    status: 'coming-soon',
    benefits: ['Industry comparisons', 'Peer benchmarking', 'Performance ranking', 'Best practices'],
    demoUrl: '#',
    color: 'bg-slate-50 border-slate-200'
  },

  // Platform Features
  {
    id: 'mobile-app',
    category: 'platform',
    title: 'Mobile Applications',
    description: 'Full-featured mobile apps for iOS and Android with offline capabilities.',
    icon: Smartphone,
    status: 'live',
    benefits: ['Native apps', 'Offline access', 'Push notifications', 'Mobile optimization'],
    demoUrl: '/mobile',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'api-integration',
    category: 'platform',
    title: 'API & Integrations',
    description: 'Comprehensive APIs and pre-built integrations with popular HR and ATS systems.',
    icon: Link,
    status: 'live',
    benefits: ['REST APIs', 'Webhook support', 'ATS integration', 'Custom connectors'],
    demoUrl: '/docs/api',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'security-compliance',
    category: 'platform',
    title: 'Enterprise Security',
    description: 'Bank-level security with SOC2, GDPR compliance, and advanced data protection.',
    icon: Shield,
    status: 'live',
    benefits: ['Data encryption', 'Compliance certifications', 'Access controls', 'Audit trails'],
    demoUrl: '/security',
    color: 'bg-red-50 border-red-200'
  },
  {
    id: 'customization',
    category: 'platform',
    title: 'White-Label Customization',
    description: 'Complete platform customization with your branding, workflows, and requirements.',
    icon: Palette,
    status: 'enterprise',
    benefits: ['Custom branding', 'Workflow configuration', 'UI customization', 'Feature toggles'],
    demoUrl: '/enterprise',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'multi-language',
    category: 'platform',
    title: 'Multi-Language Support',
    description: 'Platform available in 25+ languages with automatic translation capabilities.',
    icon: Globe,
    status: 'live',
    benefits: ['25+ languages', 'Auto-translation', 'Localized content', 'Cultural adaptation'],
    demoUrl: '/languages',
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'workflow-automation',
    category: 'platform',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and create custom workflows for your recruitment process.',
    icon: Zap,
    status: 'beta',
    benefits: ['Process automation', 'Custom triggers', 'Workflow designer', 'Time savings'],
    demoUrl: '/dashboard/admin',
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'data-export',
    category: 'platform',
    title: 'Advanced Data Export',
    description: 'Export data in multiple formats with scheduled exports and data transformation.',
    icon: Download,
    status: 'live',
    benefits: ['Multiple formats', 'Scheduled exports', 'Data transformation', 'Bulk operations'],
    demoUrl: '/dashboard/admin',
    color: 'bg-cyan-50 border-cyan-200'
  },
  {
    id: 'user-management',
    category: 'platform',
    title: 'Advanced User Management',
    description: 'Comprehensive user management with roles, permissions, and team organization.',
    icon: Users,
    status: 'live',
    benefits: ['Role-based access', 'Team management', 'Permission controls', 'User analytics'],
    demoUrl: '/dashboard/admin',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    id: 'backup-recovery',
    category: 'platform',
    title: 'Backup & Recovery',
    description: 'Automated backups with point-in-time recovery and disaster recovery capabilities.',
    icon: Database,
    status: 'live',
    benefits: ['Automated backups', 'Point-in-time recovery', 'Disaster recovery', 'Data integrity'],
    demoUrl: '/dashboard/admin',
    color: 'bg-slate-50 border-slate-200'
  },
  {
    id: 'performance-optimization',
    category: 'platform',
    title: 'Performance Optimization',
    description: 'Advanced caching, CDN integration, and performance monitoring for optimal speed.',
    icon: Zap,
    status: 'live',
    benefits: ['Fast loading', 'Global CDN', 'Performance monitoring', 'Optimization tools'],
    demoUrl: '/status',
    color: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'customer-support',
    category: 'platform',
    title: '24/7 Customer Support',
    description: 'Round-the-clock support with dedicated success managers and comprehensive training.',
    icon: MessageSquare,
    status: 'live',
    benefits: ['24/7 availability', 'Dedicated managers', 'Training programs', 'Knowledge base'],
    demoUrl: '/support',
    color: 'bg-pink-50 border-pink-200'
  }
]

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(feature => feature.category === selectedCategory)

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; color: string } } = {
      'live': { label: 'Live', color: 'bg-green-100 text-green-800' },
      'beta': { label: 'Beta', color: 'bg-blue-100 text-blue-800' },
      'coming-soon': { label: 'Coming Soon', color: 'bg-yellow-400 text-gray-900' },
      'enterprise': { label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
    }
    const config = statusConfig[status] || statusConfig.live
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Feature Overview
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Discover all the powerful features that make InTransparency the most comprehensive talent discovery platform
            </p>

            {/* Feature Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{features.length}</div>
                <div className="text-sm text-gray-700">Total Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{features.filter(f => f.status === 'live').length}</div>
                <div className="text-sm text-gray-700">Live Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{features.filter(f => f.status === 'beta').length}</div>
                <div className="text-sm text-gray-700">Beta Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{featureCategories.length - 1}</div>
                <div className="text-sm text-gray-700">Categories</div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {featureCategories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.id === 'all' ? features.length : features.filter(f => f.category === category.id).length}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className={`${feature.color} transition-all hover:shadow-lg cursor-pointer h-full`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full bg-white shadow-sm`}>
                        <Icon className="h-6 w-6 text-gray-700" />
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                    <CardTitle className="text-gray-900 text-lg">{feature.title}</CardTitle>
                    <p className="text-gray-700 text-sm">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    {/* Benefits List */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {feature.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                        {feature.benefits.length > 3 && (
                          <li className="text-xs text-gray-700">
                            +{feature.benefits.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {feature.demoUrl !== '#' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => window.open(feature.demoUrl, '_blank')}
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Try Demo
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Feature Detail Modal/Section */}
          <AnimatePresence>
            {selectedFeature && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedFeature(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${selectedFeature.color.replace('border-', 'bg-').replace('50', '100')}`}>
                        <selectedFeature.icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedFeature.title}</CardTitle>
                        <p className="text-gray-700 mt-1">{selectedFeature.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFeature(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">All Benefits & Features:</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {selectedFeature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {selectedFeature.demoUrl !== '#' && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open(selectedFeature.demoUrl, '_blank')}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Try Live Demo
                        </Button>
                      )}
                      <Button variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Documentation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Experience All These Features?
                </h3>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Get started with InTransparency today and unlock the power of AI-driven talent discovery
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = '/auth/register/role-selection'}
                  >
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/demo'}
                  >
                    Watch Demo
                    <PlayCircle className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}