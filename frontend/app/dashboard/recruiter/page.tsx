'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  Search, 
  Eye, 
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Briefcase,
  Filter,
  Plus,
  BarChart3,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Award,
  Code,
  Brain,
  Target,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobPostings, setJobPostings] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Mock data
      const mockStats = {
        totalCandidates: 1247,
        activeCandidates: 892,
        newThisWeek: 34,
        totalJobPostings: 12,
        activeJobPostings: 8,
        applicationRate: 23.5,
        responseRate: 67,
        avgTimeToHire: 18,
        topSkillsInDemand: [
          { skill: 'React', count: 234 },
          { skill: 'Node.js', count: 189 },
          { skill: 'Python', count: 156 },
          { skill: 'TypeScript', count: 145 }
        ]
      }

      const mockCandidates = [
        {
          id: 1,
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@university.edu",
          university: "Stanford University",
          degree: "Computer Science",
          graduationYear: "2025",
          avatar: "/api/placeholder/40/40",
          matchScore: 94,
          skills: ["React", "TypeScript", "Node.js", "AI"],
          projects: 5,
          avgInnovationScore: 87,
          lastActive: "2 hours ago",
          status: "active",
          isBookmarked: true,
          location: "San Francisco, CA",
          topProject: "AI-Powered Task Management",
          gpa: "3.8"
        },
        {
          id: 2,
          firstName: "Sarah",
          lastName: "Chen",
          email: "sarah.chen@mit.edu",
          university: "MIT",
          degree: "Computer Science & AI",
          graduationYear: "2024",
          avatar: "/api/placeholder/40/40",
          matchScore: 92,
          skills: ["Python", "TensorFlow", "React", "AWS"],
          projects: 7,
          avgInnovationScore: 91,
          lastActive: "1 day ago",
          status: "active",
          isBookmarked: false,
          location: "Boston, MA",
          topProject: "ML-Based Trading Algorithm",
          gpa: "3.9"
        },
        {
          id: 3,
          firstName: "Michael",
          lastName: "Rodriguez",
          email: "michael.r@berkeley.edu",
          university: "UC Berkeley",
          degree: "EECS",
          graduationYear: "2025",
          avatar: "/api/placeholder/40/40",
          matchScore: 89,
          skills: ["Java", "Spring", "PostgreSQL", "Docker"],
          projects: 4,
          avgInnovationScore: 83,
          lastActive: "3 hours ago",
          status: "active",
          isBookmarked: true,
          location: "Berkeley, CA",
          topProject: "Distributed Systems Monitor",
          gpa: "3.7"
        }
      ]

      const mockJobPostings = [
        {
          id: 1,
          title: "Senior Full Stack Developer",
          department: "Engineering",
          location: "San Francisco, CA",
          type: "Full-time",
          postedDate: "2024-01-20",
          applications: 45,
          views: 234,
          status: "active",
          salary: "$120k - $160k"
        },
        {
          id: 2,
          title: "AI Engineer",
          department: "AI Research",
          location: "Remote",
          type: "Full-time",
          postedDate: "2024-01-18",
          applications: 67,
          views: 189,
          status: "active",
          salary: "$130k - $180k"
        }
      ]

      const mockActivity = [
        {
          type: "application",
          description: "Alex Johnson applied to Senior Full Stack Developer",
          time: "30 minutes ago",
          icon: "📋"
        },
        {
          type: "view",
          description: "Sarah Chen viewed your AI Engineer position",
          time: "1 hour ago",
          icon: "👀"
        },
        {
          type: "message",
          description: "New message from Michael Rodriguez",
          time: "2 hours ago",
          icon: "💬"
        },
        {
          type: "bookmark",
          description: "You bookmarked Emma Wilson",
          time: "3 hours ago",
          icon: "⭐"
        }
      ]

      setStats(mockStats)
      setCandidates(mockCandidates)
      setJobPostings(mockJobPostings)
      setRecentActivity(mockActivity)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async (candidateId: number) => {
    setCandidates((candidates || []).map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, isBookmarked: !candidate.isBookmarked } 
        : candidate
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_: any, i: number) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Find and connect with top talent from leading universities
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/recruiter/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/recruiter/candidates">
              <Search className="mr-2 h-4 w-4" />
              Search Candidates
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCandidates}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newThisWeek} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Job Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeJobPostings}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalJobPostings} total posts
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Application Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.applicationRate}%</p>
                <p className="text-xs text-green-600 mt-1">
                  +2.1% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
                <p className="text-xs text-green-600 mt-1">
                  +5.2% improvement
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Candidates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Matching Candidates</CardTitle>
                <CardDescription>
                  Candidates with highest match scores for your requirements
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/recruiter/candidates">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(candidates || []).slice(0, 3).map((candidate: any) => (
                  <div key={candidate.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-blue-600">
                            {candidate.matchScore}%
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(candidate.id)}
                            className={candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                          >
                            <Star className={`h-4 w-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span>{candidate.degree} • {candidate.university}</span>
                        <span>Class of {candidate.graduationYear}</span>
                        <span>GPA: {candidate.gpa}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center">
                          <Code className="h-3 w-3 mr-1" />
                          {candidate.projects} projects
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {candidate.avgInnovationScore} avg score
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {(candidate.skills || []).slice(0, 3).map((skill: any) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Postings Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Job Postings Performance</CardTitle>
              <CardDescription>
                Track how your job postings are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(jobPostings || []).map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{job.department}</span>
                        <span>{job.location}</span>
                        <span>{job.salary}</span>
                        <Badge variant="outline" className="text-xs">
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{job.applications}</div>
                        <div className="text-xs text-gray-500">Applications</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{job.views}</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/recruiter/jobs/${job.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/recruiter/post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/recruiter/candidates">
                  <Search className="mr-2 h-4 w-4" />
                  Search Candidates
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/recruiter/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/recruiter/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills in Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Skills in Demand</CardTitle>
              <CardDescription>
                Most sought-after skills in your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topSkillsInDemand.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(item.count / 250) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hiring Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Applications</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Screening</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Technical Interview</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Final Round</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Offer Extended</span>
                  <span className="font-semibold text-green-600">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}