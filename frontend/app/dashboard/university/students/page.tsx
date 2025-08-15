'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Download, UserPlus, Star, TrendingUp, Calendar, GraduationCap } from 'lucide-react'

const students = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    major: 'Computer Science',
    year: 'Senior',
    gpa: 3.8,
    projects: 12,
    skills: ['React', 'Python', 'Machine Learning'],
    employabilityScore: 92,
    lastActive: '2 hours ago',
    avatar: 'AJ',
    starred: true,
    jobOffers: 3,
    interviews: 8
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    major: 'Software Engineering',
    year: 'Junior',
    gpa: 3.9,
    projects: 8,
    skills: ['TypeScript', 'React', 'Node.js'],
    employabilityScore: 88,
    lastActive: '1 day ago',
    avatar: 'SC',
    starred: false,
    jobOffers: 1,
    interviews: 5
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@university.edu',
    major: 'Data Science',
    year: 'Senior',
    gpa: 3.7,
    projects: 15,
    skills: ['Python', 'SQL', 'TensorFlow'],
    employabilityScore: 85,
    lastActive: '3 hours ago',
    avatar: 'MR',
    starred: true,
    jobOffers: 2,
    interviews: 6
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@university.edu',
    major: 'Computer Science',
    year: 'Sophomore',
    gpa: 3.6,
    projects: 5,
    skills: ['Java', 'Python', 'Algorithms'],
    employabilityScore: 75,
    lastActive: '5 hours ago',
    avatar: 'ED',
    starred: false,
    jobOffers: 0,
    interviews: 2
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    major: 'Cybersecurity',
    year: 'Junior',
    gpa: 3.5,
    projects: 7,
    skills: ['Security', 'Linux', 'Networking'],
    employabilityScore: 82,
    lastActive: '1 hour ago',
    avatar: 'DK',
    starred: false,
    jobOffers: 1,
    interviews: 4
  }
]

const cohortStats = {
  totalStudents: 284,
  activeStudents: 256,
  avgEmployabilityScore: 84,
  placementRate: 78,
  avgSalary: 85000,
  topEmployers: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple']
}

export default function UniversityStudents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [majorFilter, setMajorFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState('employability')

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMajor = majorFilter === 'all' || student.major === majorFilter
    const matchesYear = yearFilter === 'all' || student.year === yearFilter
    
    return matchesSearch && matchesMajor && matchesYear
  }).sort((a, b) => {
    switch (sortBy) {
      case 'employability':
        return b.employabilityScore - a.employabilityScore
      case 'gpa':
        return b.gpa - a.gpa
      case 'projects':
        return b.projects - a.projects
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const getEmployabilityBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-blue-500">Good</Badge>
    if (score >= 70) return <Badge className="bg-yellow-500">Fair</Badge>
    return <Badge className="bg-red-500">Needs Improvement</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Track student progress and employment outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="placement">Placement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cohortStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {cohortStats.activeStudents} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Employability</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cohortStats.avgEmployabilityScore}</div>
                <p className="text-xs text-muted-foreground">
                  +3 points this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cohortStats.placementRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last cohort
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Starting Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(cohortStats.avgSalary / 1000).toFixed(0)}k</div>
                <p className="text-xs text-muted-foreground">
                  +$8k from last year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">147</div>
                <p className="text-xs text-muted-foreground">
                  This semester
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
                <CardDescription>
                  Students with highest employability scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.slice(0, 5).sort((a, b) => b.employabilityScore - a.employabilityScore).map((student, index) => (
                    <div key={student.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.major}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{student.employabilityScore}/100</p>
                        <p className="text-xs text-muted-foreground">{student.jobOffers} offers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Employers</CardTitle>
                <CardDescription>
                  Companies hiring our graduates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cohortStats.topEmployers.map((employer, index) => (
                    <div key={employer} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{employer}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {12 - index * 2} hires
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={majorFilter} onValueChange={setMajorFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Majors</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employability">Employability</SelectItem>
                    <SelectItem value="gpa">GPA</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          {student.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{student.major}</span>
                          <Badge variant="outline">{student.year}</Badge>
                          <span>GPA: {student.gpa}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getEmployabilityBadge(student.employabilityScore)}
                      <p className="text-sm text-muted-foreground">Score: {student.employabilityScore}/100</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{student.projects}</p>
                        <p className="text-sm text-muted-foreground">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{student.interviews}</p>
                        <p className="text-sm text-muted-foreground">Interviews</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{student.jobOffers}</p>
                        <p className="text-sm text-muted-foreground">Job Offers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{student.lastActive}</p>
                        <p className="text-sm text-muted-foreground">Last Active</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm">View Profile</Button>
                      <Button variant="outline" size="sm">Send Message</Button>
                      <Button variant="outline" size="sm">Export Report</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>GPA Distribution</CardTitle>
                <CardDescription>
                  Academic performance across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '3.8 - 4.0', count: 45, percentage: 18 },
                    { range: '3.5 - 3.79', count: 89, percentage: 35 },
                    { range: '3.0 - 3.49', count: 98, percentage: 39 },
                    { range: '2.5 - 2.99', count: 18, percentage: 7 },
                    { range: 'Below 2.5', count: 3, percentage: 1 }
                  ].map((item) => (
                    <div key={item.range} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.range}</span>
                        <span className="text-sm font-medium">{item.count} students ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employability Scores</CardTitle>
                <CardDescription>
                  Distribution of student employability ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '90-100', count: 32, percentage: 13, color: 'bg-green-500' },
                    { range: '80-89', count: 89, percentage: 35, color: 'bg-blue-500' },
                    { range: '70-79', count: 98, percentage: 39, color: 'bg-yellow-500' },
                    { range: '60-69', count: 28, percentage: 11, color: 'bg-orange-500' },
                    { range: 'Below 60', count: 5, percentage: 2, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.range} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.range}</span>
                        <span className="text-sm font-medium">{item.count} students ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="placement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Placement Status</CardTitle>
                <CardDescription>
                  Current job placement status of students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'Placed', count: 156, color: 'bg-green-500' },
                    { status: 'Interviewing', count: 45, color: 'bg-blue-500' },
                    { status: 'Searching', count: 67, color: 'bg-yellow-500' },
                    { status: 'Not Started', count: 16, color: 'bg-gray-500' }
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Ranges</CardTitle>
                <CardDescription>
                  Starting salary distribution for placed students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '$100k+', count: 23 },
                    { range: '$80k-$100k', count: 45 },
                    { range: '$60k-$80k', count: 67 },
                    { range: '$40k-$60k', count: 21 }
                  ].map((item) => (
                    <div key={item.range} className="flex items-center justify-between">
                      <span className="text-sm">{item.range}</span>
                      <span className="text-sm font-medium">{item.count} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>
                  Where our graduates are working
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { industry: 'Technology', count: 89 },
                    { industry: 'Financial Services', count: 34 },
                    { industry: 'Healthcare', count: 23 },
                    { industry: 'Consulting', count: 10 }
                  ].map((item) => (
                    <div key={item.industry} className="flex items-center justify-between">
                      <span className="text-sm">{item.industry}</span>
                      <span className="text-sm font-medium">{item.count} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}