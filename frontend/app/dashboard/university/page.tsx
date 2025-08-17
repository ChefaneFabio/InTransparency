'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  TrendingUp, 
  Award, 
  Eye, 
  GraduationCap,
  Building,
  Star,
  Briefcase,
  MessageSquare,
  Calendar,
  BarChart3,
  Plus,
  Settings,
  Download,
  Share,
  Filter,
  Search,
  MapPin,
  Code,
  Brain,
  Target,
  Zap,
  BookOpen,
  Trophy,
  Globe,
  ChevronRight,
  Activity,
  Clock,
  DollarSign,
  UserPlus
} from 'lucide-react'

export default function UniversityDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [recruiters, setRecruiters] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Mock comprehensive university dashboard data
      const mockStats = {
        totalStudents: 1247,
        activeStudents: 892,
        newStudentsThisMonth: 67,
        totalProjects: 3421,
        avgInnovationScore: 84,
        totalRecruiters: 156,
        activeJobPostings: 89,
        placementRate: 94,
        avgSalary: 118500,
        totalPlacements: 234,
        partnerCompanies: 78,
        industryDistribution: [
          { industry: 'Technology', percentage: 45, count: 105 },
          { industry: 'Fintech', percentage: 20, count: 47 },
          { industry: 'Healthcare', percentage: 15, count: 35 },
          { industry: 'Consulting', percentage: 12, count: 28 },
          { industry: 'Other', percentage: 8, count: 19 }
        ],
        topSkills: [
          { skill: 'React', count: 234, growth: '+12%' },
          { skill: 'Python', count: 189, growth: '+8%' },
          { skill: 'Machine Learning', count: 156, growth: '+25%' },
          { skill: 'Node.js', count: 145, growth: '+15%' },
          { skill: 'TypeScript', count: 134, growth: '+18%' }
        ],
        departmentPerformance: [
          { department: 'Computer Science', students: 456, avgScore: 88, placements: 89 },
          { department: 'Data Science', students: 234, avgScore: 91, placements: 67 },
          { department: 'Engineering', students: 321, avgScore: 82, placements: 78 },
          { department: 'Mathematics', students: 156, avgScore: 85, placements: 34 },
          { department: 'Business', students: 80, avgScore: 79, placements: 28 }
        ]
      }

      const mockStudents = [
        {
          id: 1,
          firstName: "Alex",
          lastName: "Johnson", 
          email: "alex.johnson@stanford.edu",
          major: "Computer Science",
          year: "Senior",
          gpa: "3.8",
          avatar: "/api/placeholder/40/40",
          projects: 5,
          avgInnovationScore: 87,
          profileViews: 234,
          recruiterViews: 43,
          applications: 12,
          interviews: 5,
          offers: 2,
          status: "Actively Interviewing",
          topSkills: ["React", "AI/ML", "Node.js"],
          lastActive: "2 hours ago",
          graduationDate: "2025-06-15",
          isEmployed: false
        },
        {
          id: 2,
          firstName: "Sarah",
          lastName: "Chen",
          email: "sarah.chen@stanford.edu", 
          major: "Computer Science & AI",
          year: "Senior",
          gpa: "3.9",
          avatar: "/api/placeholder/40/40",
          projects: 7,
          avgInnovationScore: 91,
          profileViews: 345,
          recruiterViews: 67,
          applications: 8,
          interviews: 6,
          offers: 3,
          status: "Offer Accepted",
          topSkills: ["Python", "TensorFlow", "Research"],
          lastActive: "1 day ago",
          graduationDate: "2024-06-15",
          isEmployed: true,
          employer: "Google",
          position: "AI Research Engineer",
          salary: 145000
        },
        {
          id: 3,
          firstName: "Michael",
          lastName: "Rodriguez",
          email: "michael.r@stanford.edu",
          major: "Data Science", 
          year: "Junior",
          gpa: "3.7",
          avatar: "/api/placeholder/40/40",
          projects: 4,
          avgInnovationScore: 83,
          profileViews: 178,
          recruiterViews: 29,
          applications: 6,
          interviews: 3,
          offers: 1,
          status: "Job Searching",
          topSkills: ["Python", "Machine Learning", "SQL"],
          lastActive: "3 hours ago",
          graduationDate: "2025-12-15",
          isEmployed: false
        }
      ]

      const mockRecruiters = [
        {
          id: 1,
          name: "Emily Carter",
          company: "Google",
          title: "Senior Technical Recruiter", 
          email: "emily.carter@google.com",
          avatar: "/api/placeholder/40/40",
          studentsViewed: 145,
          studentsContacted: 89,
          interviews: 34,
          hires: 12,
          responseRate: 78,
          avgResponseTime: "4 hours",
          activeJobs: 5,
          lastActive: "1 hour ago",
          joinedDate: "2023-09-15",
          specializations: ["AI/ML", "Backend Engineering", "Data Science"]
        },
        {
          id: 2,
          name: "David Kim",
          company: "Meta", 
          title: "University Recruiting Lead",
          email: "david.kim@meta.com",
          avatar: "/api/placeholder/40/40",
          studentsViewed: 267,
          studentsContacted: 134,
          interviews: 56,
          hires: 18,
          responseRate: 82,
          avgResponseTime: "3 hours",
          activeJobs: 8,
          lastActive: "30 minutes ago",
          joinedDate: "2023-08-20",
          specializations: ["Frontend Engineering", "Mobile Development", "Product Engineering"]
        }
      ]

      const mockPlacements = [
        {
          id: 1,
          studentName: "Sarah Chen",
          company: "Google",
          position: "AI Research Engineer",
          salary: 145000,
          startDate: "2024-07-01",
          major: "Computer Science & AI",
          gpa: "3.9",
          projects: 7,
          avgInnovationScore: 91,
          location: "Mountain View, CA",
          type: "Full-time"
        },
        {
          id: 2,
          studentName: "James Wilson",
          company: "Apple",
          position: "Software Engineer",
          salary: 135000,
          startDate: "2024-06-15",
          major: "Computer Science",
          gpa: "3.8",
          projects: 5,
          avgInnovationScore: 86,
          location: "Cupertino, CA", 
          type: "Full-time"
        },
        {
          id: 3,
          studentName: "Maria Garcia",
          company: "Tesla",
          position: "Data Scientist",
          salary: 125000,
          startDate: "2024-08-01",
          major: "Data Science",
          gpa: "3.9",
          projects: 6,
          avgInnovationScore: 89,
          location: "Austin, TX",
          type: "Full-time"
        }
      ]

      const mockAnalytics = {
        monthlyMetrics: {
          profileViews: 12456,
          applications: 678,
          interviews: 234,
          offers: 89,
          hires: 45
        },
        trends: {
          profileViewsGrowth: '+15%',
          applicationsGrowth: '+23%',
          interviewsGrowth: '+18%',
          offersGrowth: '+32%',
          hiresGrowth: '+28%'
        },
        topRecruitingCompanies: [
          { company: 'Google', hires: 23, avgSalary: 142000 },
          { company: 'Meta', hires: 18, avgSalary: 138000 },
          { company: 'Apple', hires: 15, avgSalary: 135000 },
          { company: 'Microsoft', hires: 12, avgSalary: 132000 },
          { company: 'Amazon', hires: 10, avgSalary: 128000 }
        ]
      }

      setStats(mockStats)
      setStudents(mockStudents)
      setRecruiters(mockRecruiters)
      setPlacements(mockPlacements)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">University Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Stanford University Career Services - Student Placement Analytics
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/university/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Advanced Analytics
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/university/reports">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/university/students">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newStudentsThisMonth} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Placement Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.placementRate}%</p>
                <p className="text-xs text-green-600 mt-1">
                  +2.5% from last year
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                <p className="text-3xl font-bold text-gray-900">${(stats.avgSalary / 1000).toFixed(0)}k</p>
                <p className="text-xs text-green-600 mt-1">
                  +8.2% from last year
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Recruiters</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRecruiters}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.partnerCompanies} companies
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Innovation</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgInnovationScore}</p>
                <p className="text-xs text-green-600 mt-1">
                  AI-powered scoring
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Department Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>
                  Student outcomes and placement rates by department
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/university/departments">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.departmentPerformance.map((dept: any) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{dept.students} students</span>
                        <span>Avg Score: {dept.avgScore}</span>
                        <span>{dept.placements} placements</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round((dept.placements / dept.students) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Placement Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Placements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Placements</CardTitle>
                <CardDescription>
                  Latest student job placements and offers
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/university/placements">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {placements.map((placement: any) => (
                  <div key={placement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {placement.studentName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{placement.studentName}</h3>
                      <p className="text-gray-600">{placement.position} at {placement.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{placement.major}</span>
                        <span>GPA: {placement.gpa}</span>
                        <span>{placement.projects} projects</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {placement.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${(placement.salary / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(placement.startDate).toLocaleDateString()}
                      </div>
                      <Badge variant="default" className="mt-1">
                        {placement.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Students */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>
                Students with highest innovation scores and recruiter interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student: any) => (
                  <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>
                        {student.firstName[0]}{student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-gray-600">{student.major} • {student.year}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>GPA: {student.gpa}</span>
                        <span>{student.projects} projects</span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {student.profileViews} views
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {student.lastActive}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.topSkills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {student.avgInnovationScore}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Innovation</div>
                      
                      <Badge 
                        variant={student.isEmployed ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {student.status}
                      </Badge>
                      
                      {student.isEmployed && (
                        <div className="text-xs text-gray-600 mt-1">
                          {student.employer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Monthly Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>
                Key recruitment metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <div className="text-right">
                  <span className="font-semibold">{analytics.monthlyMetrics.profileViews.toLocaleString()}</span>
                  <span className="text-xs text-green-600 ml-2">{analytics.trends.profileViewsGrowth}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Applications</span>
                <div className="text-right">
                  <span className="font-semibold">{analytics.monthlyMetrics.applications}</span>
                  <span className="text-xs text-green-600 ml-2">{analytics.trends.applicationsGrowth}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interviews</span>
                <div className="text-right">
                  <span className="font-semibold">{analytics.monthlyMetrics.interviews}</span>
                  <span className="text-xs text-green-600 ml-2">{analytics.trends.interviewsGrowth}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Offers</span>
                <div className="text-right">
                  <span className="font-semibold">{analytics.monthlyMetrics.offers}</span>
                  <span className="text-xs text-green-600 ml-2">{analytics.trends.offersGrowth}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hires</span>
                <div className="text-right">
                  <span className="font-semibold">{analytics.monthlyMetrics.hires}</span>
                  <span className="text-xs text-green-600 ml-2">{analytics.trends.hiresGrowth}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Recruiting Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Recruiting Companies</CardTitle>
              <CardDescription>
                Companies hiring the most students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topRecruitingCompanies.map((company: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{company.company}</p>
                      <p className="text-xs text-gray-500">${(company.avgSalary / 1000).toFixed(0)}k avg</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{company.hires}</div>
                      <div className="text-xs text-gray-500">hires</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
              <CardDescription>
                Where students are getting placed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.industryDistribution.map((industry: any) => (
                  <div key={industry.industry} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{industry.industry}</span>
                      <span className="text-sm text-gray-500">{industry.percentage}%</span>
                    </div>
                    <Progress value={industry.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Skills in Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Skills in Demand</CardTitle>
              <CardDescription>
                Most requested skills by recruiters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topSkills.map((skill: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{skill.skill}</p>
                      <p className="text-xs text-green-600">{skill.growth} growth</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700">{skill.count}</div>
                      <div className="text-xs text-gray-500">students</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/university/students/add">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/university/recruiters">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Recruiters
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/university/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Advanced Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/university/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  University Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}