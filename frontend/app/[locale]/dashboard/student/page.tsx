'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { ProjectCard } from '@/components/dashboard/student/ProjectCard'
import { EnhancedProjectCard } from '@/components/dashboard/student/EnhancedProjectCard'
import { SmartRecommendations } from '@/components/dashboard/student/SmartRecommendations'
import { ProfileCard } from '@/components/dashboard/student/ProfileCard'
import { JobMatches } from '@/components/dashboard/student/JobMatches'
import { ActivityFeed } from '@/components/dashboard/student/ActivityFeed'
import { StatsCard } from '@/components/dashboard/shared/StatsCard'
import { QuickActions } from '@/components/dashboard/shared/QuickActions'
import { UniversityIntegration } from '@/components/dashboard/UniversityIntegration'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageCenter } from '@/components/messaging/MessageCenter'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { Plus, TrendingUp, Users, Briefcase, Eye, Star, ArrowRight, Share2, Gift, Copy, Globe, Check } from 'lucide-react'
import Link from 'next/link'
import { ReferralPrompt } from '@/components/referrals/ReferralPrompt'
import { ShareButtons } from '@/components/social/ShareButtons'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { trackUpgradePrompt, trackUpgradeInteraction, ConversionTrigger, PlanType } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [promptTrigger, setPromptTrigger] = useState<any>('student-project-limit')
  const [referralCount, setReferralCount] = useState(0)
  const [referralData, setReferralData] = useState<any>(null)
  const [profilePublic, setProfilePublic] = useState(false)
  const [portfolioLinkCopied, setPortfolioLinkCopied] = useState(false)

  // TODO: Get from user.subscriptionTier once added to AuthContext
  const userPlan = 'free' // Default to free for demo

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch user's projects
        const projectsResponse = await fetch(`/api/projects?userId=${user?.id}`)
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])

        // Fetch job matches
        const matchesResponse = await fetch(`/api/matches/recommendations/${user?.id}`)
        const matchesData = await matchesResponse.json()
        setMatches(matchesData.matches || [])

        // Fetch analytics
        const analyticsResponse = await fetch(`/api/analytics/dashboard/${user?.id}`)
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.analytics || {})

        // Fetch referral data
        const token = localStorage.getItem('token')
        if (token) {
          const referralResponse = await fetch('/api/referrals', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const referralData = await referralResponse.json()
          setReferralCount(referralData.totalReferrals || 0)
          setReferralData(referralData)
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Trigger upgrade prompts based on user behavior
  useEffect(() => {
    if (userPlan === 'free' && projects.length > 0 && matches.length > 0) {
      // Trigger 1: Project limit reached (5 projects)
      if (projects.length >= 5) {
        setPromptTrigger('student-project-limit')
        setShowUpgradePrompt(true)
        trackUpgradePrompt(ConversionTrigger.PROJECT_LIMIT_REACHED, PlanType.PRO_STUDENT, {
          projectCount: projects.length
        })
      }
      // Trigger 2: After viewing 3+ matches
      else if (matches.length >= 3) {
        setPromptTrigger('student-after-match')
        setShowUpgradePrompt(true)
        trackUpgradePrompt(ConversionTrigger.MATCH_THRESHOLD_3, PlanType.PRO_STUDENT, {
          matchCount: matches.length
        })
      }
    }
  }, [userPlan, projects.length, matches.length])

  const handleUpgradeClick = () => {
    trackUpgradeInteraction(
      'clicked',
      promptTrigger === 'student-project-limit'
        ? ConversionTrigger.PROJECT_LIMIT_REACHED
        : ConversionTrigger.MATCH_THRESHOLD_3,
      PlanType.PRO_STUDENT
    )
    router.push('/pricing?highlight=pro_student')
  }

  const handleTogglePortfolio = async (checked: boolean) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profilePublic: checked })
      })

      if (response.ok) {
        setProfilePublic(checked)
      }
    } catch (error) {
      console.error('Failed to update portfolio visibility:', error)
    }
  }

  const copyPortfolioLink = async () => {
    const portfolioUrl = `${window.location.origin}/students/${(user as any)?.username}/public`
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setPortfolioLinkCopied(true)
      setTimeout(() => setPortfolioLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDismissPrompt = () => {
    trackUpgradeInteraction(
      'dismissed',
      promptTrigger === 'student-project-limit'
        ? ConversionTrigger.PROJECT_LIMIT_REACHED
        : ConversionTrigger.MATCH_THRESHOLD_3,
      PlanType.PRO_STUDENT
    )
    setShowUpgradePrompt(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: TrendingUp,
      description: 'Projects uploaded',
      trend: '+2 this month'
    },
    {
      title: 'Profile Views',
      value: analytics?.profileViews || 0,
      icon: Eye,
      description: 'Profile visits',
      trend: '+12% vs last month'
    },
    {
      title: 'Job Matches',
      value: matches.length,
      icon: Briefcase,
      description: 'Relevant opportunities',
      trend: '+5 new matches'
    },
    {
      title: 'Network',
      value: analytics?.connections || 0,
      icon: Users,
      description: 'Professional connections',
      trend: '+8 connections'
    }
  ]

  const quickActions: Array<{
    title: string;
    description: string;
    href: string;
    icon: any;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  }> = [
    {
      title: 'Upload New Project',
      description: 'Share your latest work',
      href: '/dashboard/student/projects/new',
      icon: Plus,
      color: 'blue'
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile current',
      href: '/dashboard/student/profile/edit',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Browse Jobs',
      description: 'Explore opportunities',
      href: '/dashboard/student/jobs',
      icon: Briefcase,
      color: 'purple'
    },
    {
      title: 'View Analytics',
      description: 'Track your progress',
      href: '/dashboard/student/analytics',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
      {/* Contextual Upgrade Prompt - Shows based on user behavior */}
      {showUpgradePrompt && userPlan === 'free' && (
        <div className="mb-6">
          <ReferralPrompt
            triggerType={promptTrigger}
            contextData={{
              projectCount: projects.length,
              matchCount: matches.length
            }}
            onDismiss={handleDismissPrompt}
            onAction={handleUpgradeClick}
          />
        </div>
      )}

      {/* Enhanced Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}! 🚀
                </h1>
                <p className="text-lg text-gray-700 mt-2">
                  Your academic excellence meets professional opportunities
                </p>
              </div>

              {/* Career Readiness Score */}
              <div className="flex items-center space-x-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-gray-600">Career Ready</div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div className="text-sm text-gray-600">+5% this month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" asChild>
                <Link href="/dashboard/student/projects/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Upload Project
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg" asChild>
                <Link href="/linkedin-integration">
                  <Users className="mr-2 h-5 w-5" />
                  Connect LinkedIn
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-20">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-4 -translate-x-4 opacity-20">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  index === 0 ? 'from-blue-500 to-blue-600' :
                  index === 1 ? 'from-green-500 to-green-600' :
                  index === 2 ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>

              {/* Progress bar for visual enhancement */}
              <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${
                    index === 0 ? 'from-blue-500 to-blue-600 w-4/5' :
                    index === 1 ? 'from-green-500 to-green-600 w-3/4' :
                    index === 2 ? 'from-purple-500 to-purple-600 w-full' :
                    'from-orange-500 to-orange-600 w-2/3'
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Smart Actions */}
          <Card className="border-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI-Powered Recommendations</CardTitle>
                  <CardDescription>
                    Personalized actions to boost your career readiness
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Priority Action */}
              <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-500 rounded-lg">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800">Priority Action</h4>
                      <p className="text-sm text-amber-700">Add a Machine Learning project to match 87% of AI jobs</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    Start Now
                  </Button>
                </div>
              </div>

              {/* Smart Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href} className="group">
                    <div className="p-4 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${
                          action.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          action.color === 'green' ? 'from-green-500 to-green-600' :
                          action.color === 'purple' ? 'from-purple-500 to-purple-600' :
                          'from-orange-500 to-orange-600'
                        } group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium">
                          {action.color === 'blue' ? '+15% job matches' :
                           action.color === 'green' ? '+12% profile views' :
                           action.color === 'purple' ? '+8 new opportunities' :
                           '+20% career readiness'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Projects Showcase */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                <p className="text-gray-600">
                  AI-analyzed projects with career impact insights
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/student/projects">
                  View All Projects
                </Link>
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-6">
                {/* Mock enhanced projects with AI analysis */}
                {[
                  {
                    id: '1',
                    title: 'E-commerce Platform',
                    description: 'Full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and inventory management.',
                    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
                    category: 'Full-Stack Development',
                    githubUrl: 'https://github.com/user/ecommerce',
                    liveUrl: 'https://ecommerce-demo.vercel.app',
                    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
                    featured: true,
                    aiAnalysis: {
                      complexityScore: 85,
                      skillsDetected: ['Full-Stack Development', 'Database Design', 'API Development', 'Payment Integration'],
                      industryRelevance: ['E-commerce', 'Fintech', 'SaaS'],
                      improvementSuggestions: ['Add microservices architecture', 'Implement advanced search with Elasticsearch'],
                      careerImpact: 'This project demonstrates enterprise-level development skills and could lead to senior developer roles in e-commerce or fintech companies.'
                    },
                    metrics: {
                      views: 234,
                      likes: 45,
                      recruiterInterest: 12,
                      similarityToJobs: 92
                    },
                    collaborators: ['John Doe', 'Jane Smith']
                  },
                  {
                    id: '2',
                    title: 'Machine Learning Classifier',
                    description: 'Image classification model using TensorFlow and CNN architecture. Achieves 94% accuracy on test dataset with data augmentation techniques.',
                    technologies: ['Python', 'TensorFlow', 'OpenCV', 'Jupyter', 'NumPy'],
                    category: 'Machine Learning',
                    githubUrl: 'https://github.com/user/ml-classifier',
                    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
                    aiAnalysis: {
                      complexityScore: 78,
                      skillsDetected: ['Machine Learning', 'Computer Vision', 'Data Science', 'Python'],
                      industryRelevance: ['AI/ML', 'Healthcare', 'Automotive'],
                      improvementSuggestions: ['Deploy model with FastAPI', 'Add real-time inference capabilities'],
                      careerImpact: 'Strong foundation for ML engineer roles at tech companies focusing on AI applications.'
                    },
                    metrics: {
                      views: 187,
                      likes: 32,
                      recruiterInterest: 8,
                      similarityToJobs: 87
                    }
                  }
                ].map((project) => (
                  <EnhancedProjectCard
                    key={project.id}
                    project={project}
                    interactive={true}
                    onViewProject={(id) => console.log('View project', id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Plus className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Your First Project
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Get AI-powered analysis, career impact insights, and connect with recruiters who value real work over just grades.
                  </p>
                  <div className="space-y-3">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                      <Link href="/dashboard/student/projects/new">
                        <Plus className="mr-2 h-5 w-5" />
                        Upload Project
                      </Link>
                    </Button>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        AI Analysis
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        Career Impact
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                        Recruiter Visibility
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Smart AI-Powered Job Recommendations */}
          <div>
            <SmartRecommendations
              studentProfile={{
                courses: [
                  { name: 'Machine Learning', grade: 29 },
                  { name: 'Web Development', grade: 28 },
                  { name: 'Statistics', grade: 30 },
                  { name: 'Data Mining', grade: 30 },
                  { name: 'Computer Vision', grade: 27 }
                ],
                projects: [
                  { title: 'E-commerce Platform', technologies: ['React', 'Node.js', 'PostgreSQL'], category: 'Full-Stack' },
                  { title: 'ML Classifier', technologies: ['Python', 'TensorFlow', 'OpenCV'], category: 'Machine Learning' },
                  { title: 'Financial Analysis Tool', technologies: ['Python', 'Pandas', 'Plotly'], category: 'Data Science' }
                ],
                skills: ['JavaScript', 'Python', 'React', 'TensorFlow', 'SQL', 'Docker'],
                preferences: {
                  jobTypes: ['Full-time', 'Internship'],
                  locations: ['Milano', 'Remote'],
                  industries: ['Tech', 'AI/ML', 'Fintech']
                }
              }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Share Profile Card - VIRAL FEATURE */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share Your Profile
              </CardTitle>
              <CardDescription className="text-purple-100">
                Get 3x more recruiter views by sharing your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-white/90">
                  Students who share their profile get discovered faster
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    const url = `https://intransparency.com/students/${user?.id}/public`
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/20"
                  onClick={() => {
                    const url = `https://intransparency.com/students/${user?.id}/public`
                    navigator.clipboard.writeText(url)
                    alert('Portfolio link copied!')
                  }}
                >
                  Copy Portfolio Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <ProfileCard user={user} />

          {/* Referral Program Card - VIRAL FEATURE */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Gift className="h-5 w-5 mr-2" />
                Invite Friends, Get Premium Free 🎁
              </CardTitle>
              <CardDescription className="text-blue-700">
                {referralCount >= 3
                  ? `You've unlocked rewards! Keep going for more.`
                  : `You're ${3 - referralCount} friend${3 - referralCount === 1 ? '' : 's'} away from 1 month Premium!`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm font-bold text-blue-600">{referralCount}/3 invited</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((referralCount / 3) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {referralCount >= 3
                      ? '✅ 1 month Premium unlocked!'
                      : `${3 - referralCount} more to unlock 1 month Premium FREE`
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/dashboard/student/referrals">
                      <Gift className="mr-2 h-4 w-4" />
                      {referralCount > 0 ? 'View Your Referrals' : 'Get Your Referral Link'}
                    </Link>
                  </Button>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p className={referralCount >= 3 ? 'text-green-600 font-semibold' : ''}>
                      ✅ 3 invites → 1 month Premium FREE
                    </p>
                    <p className={referralCount >= 10 ? 'text-green-600 font-semibold' : ''}>
                      ✅ 10 invites → 6 months Premium FREE
                    </p>
                    <p className={referralCount >= 50 ? 'text-green-600 font-semibold' : ''}>
                      ✅ 50 invites → Lifetime Premium FREE
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Public Portfolio Toggle */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <Globe className="h-5 w-5 mr-2" />
                Public Portfolio
              </CardTitle>
              <CardDescription className="text-green-700">
                Let recruiters discover you by making your portfolio public
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-sm text-gray-600">
                    {profilePublic ? 'Your portfolio is public' : 'Your portfolio is private'}
                  </p>
                </div>
                <Switch
                  checked={profilePublic}
                  onCheckedChange={handleTogglePortfolio}
                />
              </div>

              {profilePublic && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Your Portfolio Link:</p>
                    <div className="flex gap-2">
                      <Input
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/students/${(user as any)?.username}/public`}
                        readOnly
                        className="text-sm"
                      />
                      <Button onClick={copyPortfolioLink} variant="outline" size="sm">
                        {portfolioLinkCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <ShareButtons
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/students/${(user as any)?.username}/public`}
                    title="Check out my verified portfolio on InTransparency!"
                    description="View my university-verified projects and skills"
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-blue-900 mb-1">💡 Pro tip:</p>
                    <p className="text-blue-800">
                      Share your portfolio on LinkedIn to get 3x more recruiter views!
                    </p>
                  </div>
                </div>
              )}

              {!profilePublic && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                  <p className="mb-2">📌 Make your portfolio public to:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Get discovered by recruiters</li>
                    <li>• Share your work on social media</li>
                    <li>• Boost your online presence</li>
                    <li>• Each portfolio is a landing page for InTransparency</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* University Integration */}
          <UniversityIntegration
            userId={user?.id?.toString()}
          />

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed userId={user?.id} />
            </CardContent>
          </Card>

          {/* Tips & Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Career Tips</CardTitle>
              <CardDescription>
                Boost your profile and job prospects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Complete your profile</h4>
                <p className="text-sm text-gray-600">
                  Profiles with photos get 5x more views
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Add project descriptions</h4>
                <p className="text-sm text-gray-600">
                  Detailed descriptions improve AI analysis
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Connect with peers</h4>
                <p className="text-sm text-gray-600">
                  Networking leads to opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Track your journey towards your career goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="skills" className="space-y-4">
            <TabsList>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">JavaScript</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-gray-600">React</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">Python</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-gray-600">Projects uploaded</div>
                <div className="mt-2 text-sm text-green-600">+2 this month</div>
              </div>
            </TabsContent>
            
            <TabsContent value="network">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-gray-900">{analytics?.connections || 0}</div>
                <div className="text-gray-600">Professional connections</div>
                <div className="mt-2 text-sm text-green-600">+8 this week</div>
              </div>
            </TabsContent>
            
            <TabsContent value="goals">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Land first internship</div>
                    <div className="text-sm text-gray-600">Target: Summer 2024</div>
                  </div>
                  <div className="text-green-600 font-medium">75%</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Complete 5 projects</div>
                    <div className="text-sm text-gray-600">Current: {projects.length}/5</div>
                  </div>
                  <div className="text-blue-600 font-medium">{Math.round((projects.length / 5) * 100)}%</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <MessageCenter />
      <NotificationCenter />
    </div>
  )
}