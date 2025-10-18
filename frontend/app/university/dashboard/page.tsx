'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  GraduationCap, 
  Building2,
  Eye,
  MessageSquare,
  Download,
  Upload
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  degree: string
  gpa: number
  profileStatus: 'draft' | 'pending' | 'verified' | 'published'
  completionRate: number
  companyViews: number
  interviewInvites: number
  professorEndorsements: number
}

interface CompanyEngagement {
  company: string
  studentsViewed: number
  interviewInvites: number
  hires: number
  avgSalary: number
}

export default function UniversityDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [studentsToVerify, setStudentsToVerify] = useState(12)
  
  // Mock data
  const students: Student[] = [
    {
      id: '1',
      name: 'Sofia Romano',
      email: 'sofia.romano@student.polimi.it',
      degree: 'Computer Engineering',
      gpa: 29.2,
      profileStatus: 'verified',
      completionRate: 95,
      companyViews: 45,
      interviewInvites: 8,
      professorEndorsements: 2
    },
    {
      id: '2',
      name: 'Marco Bianchi',
      email: 'marco.bianchi@student.polimi.it',
      degree: 'Data Science',
      gpa: 28.5,
      profileStatus: 'pending',
      completionRate: 80,
      companyViews: 12,
      interviewInvites: 2,
      professorEndorsements: 1
    },
    {
      id: '3',
      name: 'Elena Rossi',
      email: 'elena.rossi@student.polimi.it',
      degree: 'Software Engineering',
      gpa: 27.8,
      profileStatus: 'draft',
      completionRate: 60,
      companyViews: 0,
      interviewInvites: 0,
      professorEndorsements: 0
    }
  ]

  const companyEngagement: CompanyEngagement[] = [
    {
      company: 'Microsoft',
      studentsViewed: 23,
      interviewInvites: 5,
      hires: 1,
      avgSalary: 55000
    },
    {
      company: 'Amazon',
      studentsViewed: 18,
      interviewInvites: 4,
      hires: 1,
      avgSalary: 52000
    },
    {
      company: 'Bending Spoons',
      studentsViewed: 15,
      interviewInvites: 3,
      hires: 0,
      avgSalary: 0
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'pending':
        return <Badge className="bg-yellow-400 text-gray-900">Pending Review</Badge>
      case 'published':
        return <Badge className="bg-blue-100 text-blue-800">Published</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">University Dashboard</h1>
          <p className="text-gray-600">Politecnico di Milano - Career Services</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Progress value={82} className="h-2" />
                <p className="text-xs text-gray-700 mt-1">82% with complete profiles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Placement Rate</p>
                  <p className="text-3xl font-bold">94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-green-600">+12% vs last year</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Company Partners</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-purple-600">15 new this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Starting Salary</p>
                  <p className="text-3xl font-bold">€48K</p>
                </div>
                <GraduationCap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-orange-600">+8% vs industry avg</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions Alert */}
        {studentsToVerify > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  You have {studentsToVerify} student profiles pending verification.
                </span>
                <Button size="sm">Review Profiles</Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="companies">Company Engagement</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Microsoft interviewed Sofia Romano</p>
                        <p className="text-xs text-gray-700">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New company partner: Tech Startup Inc.</p>
                        <p className="text-xs text-gray-700">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">5 students completed their profiles</p>
                        <p className="text-xs text-gray-700">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>Based on company engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(students || [])
                      .filter(s => s.profileStatus === 'verified')
                      .sort((a, b) => b.companyViews - a.companyViews)
                      .slice(0, 3)
                      .map((student, i) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.degree} • GPA: {student.gpa}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{student.companyViews} views</p>
                            <p className="text-xs text-gray-700">{student.interviewInvites} interviews</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Profiles</CardTitle>
                    <CardDescription>Manage and monitor student profiles</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="Search students..." className="max-w-sm" />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Profile Status</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Company Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(students || []).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.degree}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.gpa}/30</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.profileStatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={student.completionRate} className="w-16 h-2" />
                            <span className="text-sm">{student.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-600" />
                            <span>{student.companyViews}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            {student.profileStatus === 'pending' && (
                              <Button size="sm">Verify</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Engagement Tab */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Engagement Analytics</CardTitle>
                <CardDescription>Track how companies interact with your students</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Students Viewed</TableHead>
                      <TableHead>Interview Invites</TableHead>
                      <TableHead>Hires</TableHead>
                      <TableHead>Avg Salary</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyEngagement.map((company, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{company.company}</TableCell>
                        <TableCell>{company.studentsViewed}</TableCell>
                        <TableCell>{company.interviewInvites}</TableCell>
                        <TableCell>{company.hires}</TableCell>
                        <TableCell>
                          {company.avgSalary > 0 ? `€${company.avgSalary.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {company.studentsViewed > 0 
                              ? Math.round((company.interviewInvites / company.studentsViewed) * 100)
                              : 0
                            }%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <div className="space-y-6">
              {/* Pending Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Pending Verifications
                  </CardTitle>
                  <CardDescription>
                    Students waiting for transcript and profile verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.filter(s => s.profileStatus === 'pending').map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.degree} • GPA: {student.gpa}/30</p>
                          <p className="text-sm text-gray-700">Submitted: 2 days ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verification Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Verification Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Academic Records</h4>
                        <p className="text-sm text-gray-600">Verify transcript authenticity and course grades</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Project Validation</h4>
                        <p className="text-sm text-gray-600">Confirm project descriptions and outcomes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Identity Verification</h4>
                        <p className="text-sm text-gray-600">Ensure student identity matches university records</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}