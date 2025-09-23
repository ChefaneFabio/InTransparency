'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Sparkles,
  Target,
  TrendingUp,
  Brain,
  Users,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Award,
  ChevronRight,
  BookOpen,
  Code,
  Building2,
  Briefcase
} from 'lucide-react'

interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract'
  salaryRange: string
  matchScore: number
  aiInsights: {
    whyPerfectMatch: string[]
    skillGaps: string[]
    careerImpact: string
    learningOpportunities: string[]
  }
  urgency: 'high' | 'medium' | 'low'
  applicationDeadline: string
  requirements: {
    courses: string[]
    projects: string[]
    skills: string[]
  }
  companyInsights: {
    size: string
    growth: string
    techStack: string[]
    culture: string[]
  }
}

interface SmartRecommendationsProps {
  studentProfile?: {
    courses: Array<{ name: string; grade: number }>
    projects: Array<{ title: string; technologies: string[]; category: string }>
    skills: string[]
    preferences: {
      jobTypes: string[]
      locations: string[]
      industries: string[]
    }
  }
}

export function SmartRecommendations({ studentProfile }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    generateSmartRecommendations()
  }, [studentProfile])

  const generateSmartRecommendations = () => {
    setLoading(true)
    setTimeout(() => {
      const mockRecommendations: JobRecommendation[] = [
        {
          id: '1',
          title: 'ML Engineer',
          company: 'TechCorp Milano',
          location: 'Milano, Italy',
          type: 'Full-time',
          salaryRange: '45,000 - 55,000 EUR',
          matchScore: 95,
          urgency: 'high',
          applicationDeadline: '2025-10-15',
          aiInsights: {
            whyPerfectMatch: [
              'Your Machine Learning course (29/30) exceeds their requirement (25/30)',
              'Your Computer Vision project perfectly aligns with their main product',
              'Your Python and TensorFlow skills match 100% of their tech stack'
            ],
            skillGaps: ['Docker containerization', 'MLOps pipelines'],
            careerImpact: 'This role could accelerate your ML career by 2+ years, offering direct mentorship from senior engineers',
            learningOpportunities: ['Production ML systems', 'Large-scale data processing', 'A/B testing frameworks']
          },
          requirements: {
            courses: ['Machine Learning', 'Statistics', 'Linear Algebra'],
            projects: ['ML Classification', 'Computer Vision'],
            skills: ['Python', 'TensorFlow', 'SQL']
          },
          companyInsights: {
            size: '50-200 employees',
            growth: '+150% revenue last year',
            techStack: ['Python', 'TensorFlow', 'Kubernetes', 'AWS'],
            culture: ['Remote-first', 'Learning-focused', 'Fast-paced']
          }
        },
        {
          id: '2',
          title: 'Frontend Developer',
          company: 'DesignTech',
          location: 'Remote',
          type: 'Internship',
          salaryRange: '1,200 - 1,500 EUR/month',
          matchScore: 88,
          urgency: 'medium',
          applicationDeadline: '2025-10-30',
          aiInsights: {
            whyPerfectMatch: [
              'Your Web Development project showcases React expertise they need',
              'Your UI/UX design background aligns with their design-first approach',
              'Your academic performance (28.5 GPA) meets their excellence standard'
            ],
            skillGaps: ['TypeScript', 'Testing frameworks'],
            careerImpact: 'Perfect stepping stone to full-stack development with design sensibility',
            learningOpportunities: ['Design systems', 'User research', 'A/B testing']
          },
          requirements: {
            courses: ['Web Development', 'Human-Computer Interaction'],
            projects: ['React Application', 'Mobile App UI'],
            skills: ['React', 'CSS', 'JavaScript']
          },
          companyInsights: {
            size: '20-50 employees',
            growth: 'Series A funded',
            techStack: ['React', 'Node.js', 'Figma', 'PostgreSQL'],
            culture: ['Design-driven', 'Collaborative', 'Innovation-focused']
          }
        },
        {
          id: '3',
          title: 'Data Scientist',
          company: 'FinanceAI',
          location: 'Milano, Italy',
          type: 'Full-time',
          salaryRange: '50,000 - 65,000 EUR',
          matchScore: 92,
          urgency: 'high',
          applicationDeadline: '2025-10-10',
          aiInsights: {
            whyPerfectMatch: [
              'Your Statistics and Data Mining courses (both 30/30) exceed requirements',
              'Your Financial Data Analysis project directly applies to their domain',
              'Your research methodology aligns with their data-driven approach'
            ],
            skillGaps: ['Financial modeling', 'Risk analytics'],
            careerImpact: 'Launch into high-growth fintech sector with significant learning potential',
            learningOpportunities: ['Financial markets', 'Regulatory compliance', 'Real-time analytics']
          },
          requirements: {
            courses: ['Statistics', 'Data Mining', 'Mathematics'],
            projects: ['Data Analysis', 'Financial Modeling'],
            skills: ['Python', 'R', 'SQL', 'Tableau']
          },
          companyInsights: {
            size: '100-500 employees',
            growth: 'IPO planned 2026',
            techStack: ['Python', 'Spark', 'Kafka', 'MongoDB'],
            culture: ['Data-driven', 'Fast-growth', 'Results-oriented']
          }
        }
      ]
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1500)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'high-match') return rec.matchScore >= 90
    if (activeFilter === 'urgent') return rec.urgency === 'high'
    if (activeFilter === 'remote') return rec.location.includes('Remote')
    return true
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span>AI is analyzing your profile and finding perfect matches...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Job Matching
          </CardTitle>
          <CardDescription>
            Our AI analyzed your academic profile, projects, and career goals to find opportunities where you'll excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{recommendations.length}</div>
              <div className="text-sm text-gray-600">Perfect Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(recommendations.reduce((acc, rec) => acc + rec.matchScore, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {recommendations.filter(rec => rec.urgency === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Urgent Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {recommendations.filter(rec => rec.location.includes('Remote')).length}
              </div>
              <div className="text-sm text-gray-600">Remote Options</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Matches', icon: Target },
          { key: 'high-match', label: '90%+ Match', icon: Star },
          { key: 'urgent', label: 'Apply Soon', icon: Clock },
          { key: 'remote', label: 'Remote OK', icon: MapPin }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(key)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Job Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((job) => (
          <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Job Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <Badge className={getUrgencyColor(job.urgency)}>
                        {job.urgency === 'high' ? '🔥 Urgent' : job.urgency === 'medium' ? '⚡ Apply Soon' : '✓ Good Timing'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="font-medium text-green-600">{job.salaryRange}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>

                <Tabs defaultValue="insights" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="insights" className="text-xs">AI Insights</TabsTrigger>
                    <TabsTrigger value="requirements" className="text-xs">Requirements</TabsTrigger>
                    <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
                    <TabsTrigger value="growth" className="text-xs">Career Impact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights" className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        Why You're a Perfect Match
                      </h4>
                      <div className="space-y-1">
                        {job.aiInsights.whyPerfectMatch.map((reason, i) => (
                          <div key={i} className="text-xs text-green-700 flex items-start gap-1">
                            <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    {job.aiInsights.skillGaps.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Quick Skills to Add
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {job.aiInsights.skillGaps.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-orange-100 text-orange-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Courses
                        </h5>
                        <div className="space-y-1">
                          {job.requirements.courses.map((course, i) => (
                            <div key={i} className="text-xs text-blue-700">{course}</div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          Projects
                        </h5>
                        <div className="space-y-1">
                          {job.requirements.projects.map((project, i) => (
                            <div key={i} className="text-xs text-purple-700">{project}</div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Skills
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {job.requirements.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="company" className="space-y-3">
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-indigo-800 mb-2">Company Info</h5>
                          <div className="space-y-1 text-xs text-indigo-700">
                            <div>Size: {job.companyInsights.size}</div>
                            <div>Growth: {job.companyInsights.growth}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-indigo-800 mb-2">Culture</h5>
                          <div className="flex flex-wrap gap-1">
                            {job.companyInsights.culture.map((trait, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-indigo-100 text-indigo-700">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="growth" className="space-y-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-emerald-800 mb-2 flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Career Impact
                      </h4>
                      <p className="text-xs text-emerald-700 mb-3">{job.aiInsights.careerImpact}</p>
                      <h5 className="text-sm font-medium text-emerald-800 mb-2">You'll Learn:</h5>
                      <div className="grid grid-cols-2 gap-1">
                        {job.aiInsights.learningOpportunities.map((opportunity, i) => (
                          <div key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                            <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                            {opportunity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      View Company
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Alert>
          <Target className="h-4 w-4" />
          <AlertDescription>
            No jobs match your current filters. Try adjusting your search criteria or check back later for new opportunities.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}