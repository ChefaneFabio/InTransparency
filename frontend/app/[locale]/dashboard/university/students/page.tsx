'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import { Search, Download, UserPlus, GraduationCap, CheckCircle, Globe } from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  major: string
  year: string
  gpa: number | null
  projects: number
  applications: number
  verified: boolean
  profilePublic: boolean
  lastActive: string | null
  joinedAt: string
  avatar: string
  photo: string | null
}

interface Stats {
  totalStudents: number
  verifiedStudents: number
  activeProfiles: number
}

interface ApiResponse {
  students: Student[]
  total: number
  page: number
  totalPages: number
  stats: Stats
  filters: {
    degrees: string[]
  }
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function UniversityStudents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [majorFilter, setMajorFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [degrees, setDegrees] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (majorFilter !== 'all') params.set('major', majorFilter)
      if (yearFilter !== 'all') params.set('year', yearFilter)
      params.set('page', String(currentPage))
      params.set('limit', '50')

      const res = await fetch(`/api/dashboard/university/students?${params.toString()}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch students (${res.status})`)
      }

      const data: ApiResponse = await res.json()
      setStudents(data.students)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setStats(data.stats)
      setDegrees(data.filters.degrees)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, majorFilter, yearFilter, currentPage])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, majorFilter, yearFilter])

  // Client-side sort (API returns by createdAt desc)
  const sortedStudents = Array.from(students).sort((a, b) => {
    switch (sortBy) {
      case 'gpa':
        return (b.gpa ?? 0) - (a.gpa ?? 0)
      case 'projects':
        return b.projects - a.projects
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
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
          <Link href="./students/add">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Enrolled in your university
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Students</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.verifiedStudents ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats && stats.totalStudents > 0
                        ? `${Math.round((stats.verifiedStudents / stats.totalStudents) * 100)}% verified`
                        : '0% verified'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats?.activeProfiles ?? 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats && stats.totalStudents > 0
                        ? `${Math.round((stats.activeProfiles / stats.totalStudents) * 100)}% public profiles`
                        : '0% public profiles'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Students by Projects</CardTitle>
                <CardDescription>
                  Students with the most projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(students)
                      .sort((a, b) => b.projects - a.projects)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback>{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.major || 'No major'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{student.projects} projects</p>
                            <p className="text-xs text-muted-foreground">{student.applications} applications</p>
                          </div>
                        </div>
                      ))}
                    {students.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Most recently active students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(students)
                      .filter(s => s.lastActive)
                      .sort((a, b) => new Date(b.lastActive!).getTime() - new Date(a.lastActive!).getTime())
                      .slice(0, 5)
                      .map((student) => (
                        <div key={student.id} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback>{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.major || 'No major'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{formatRelativeTime(student.lastActive)}</p>
                          </div>
                        </div>
                      ))}
                    {students.filter(s => s.lastActive).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                    )}
                  </div>
                )}
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
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                    ))}
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
                    <SelectItem value="gpa">GPA</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error state */}
          {error && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-red-500 text-center">{error}</p>
                <div className="flex justify-center mt-2">
                  <Button variant="outline" size="sm" onClick={fetchStudents}>Retry</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-56" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="text-center">
                            <Skeleton className="h-8 w-10 mx-auto mb-1" />
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Students List */}
          {!loading && !error && (
            <>
              <div className="grid gap-6">
                {sortedStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.photo || ''} />
                            <AvatarFallback>{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              {student.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{student.major || 'No major'}</span>
                              {student.year && <Badge variant="outline">{student.year}</Badge>}
                              {student.gpa !== null && <span>GPA: {student.gpa}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          {student.profilePublic ? (
                            <Badge className="bg-green-500">Public Profile</Badge>
                          ) : (
                            <Badge variant="secondary">Private Profile</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{student.projects}</p>
                            <p className="text-sm text-muted-foreground">Projects</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{student.applications}</p>
                            <p className="text-sm text-muted-foreground">Applications</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm">{student.gpa !== null ? student.gpa.toFixed(2) : 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">GPA</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm">{formatRelativeTime(student.lastActive)}</p>
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

              {/* Empty state */}
              {sortedStudents.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No students found matching your filters.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {sortedStudents.length} of {total} students
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center px-3 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Static data - real analytics coming soon
                </p>
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Static data - real analytics coming soon
                </p>
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Static data - real analytics coming soon
                </p>
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Static data - real analytics coming soon
                </p>
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Static data - real analytics coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
