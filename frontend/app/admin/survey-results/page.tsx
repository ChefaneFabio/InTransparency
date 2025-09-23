'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import {
  Download,
  Users,
  Building2,
  GraduationCap,
  School,
  TrendingUp,
  FileText,
  Filter,
  Mail,
  Send,
  Calendar,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'

// Mock survey data - in real app, this would come from your database
const mockSurveyResults = {
  overview: {
    totalResponses: 247,
    studentResponses: 156,
    companyResponses: 68,
    universityResponses: 23,
    completionRate: 87
  },
  timeline: [
    { date: '2024-01-01', students: 12, companies: 3, universities: 1 },
    { date: '2024-01-02', students: 18, companies: 5, universities: 2 },
    { date: '2024-01-03', students: 25, companies: 8, universities: 3 },
    { date: '2024-01-04', students: 34, companies: 12, universities: 5 },
    { date: '2024-01-05', students: 45, companies: 18, universities: 8 },
    { date: '2024-01-06', students: 67, companies: 25, universities: 12 },
    { date: '2024-01-07', students: 89, companies: 35, universities: 15 },
  ],
  responseQuality: [
    { category: 'Complete Responses', percentage: 87, count: 215 },
    { category: 'Partial Responses', percentage: 10, count: 25 },
    { category: 'Abandoned', percentage: 3, count: 7 },
  ],
  demographics: {
    students: {
      universities: [
        { name: 'Politecnico Milano', count: 42 },
        { name: 'Università Bocconi', count: 38 },
        { name: 'Università Statale', count: 29 },
        { name: 'Università Cattolica', count: 25 },
        { name: 'Others', count: 22 }
      ],
      graduationYears: [
        { year: '2024', count: 67 },
        { year: '2025', count: 54 },
        { year: '2026+', count: 23 },
        { year: 'Graduated', count: 12 }
      ]
    },
    companies: {
      industries: [
        { name: 'Technology', count: 28 },
        { name: 'Finance', count: 15 },
        { name: 'Manufacturing', count: 12 },
        { name: 'Consulting', count: 8 },
        { name: 'Others', count: 5 }
      ],
      companySizes: [
        { size: 'Large (1000+)', count: 35 },
        { size: 'Medium (201-1000)', count: 18 },
        { size: 'Small (51-200)', count: 10 },
        { size: 'Startup (1-50)', count: 5 }
      ]
    }
  },
  insights: {
    studentPriorities: [
      { feature: 'Project portfolios', percentage: 89 },
      { feature: 'Direct company contact', percentage: 78 },
      { feature: 'Skill verification', percentage: 71 },
      { feature: 'Course-to-career mapping', percentage: 65 },
      { feature: 'Professor endorsements', percentage: 52 }
    ],
    companyNeeds: [
      { need: 'Skill verification', percentage: 94 },
      { need: 'Pre-screened candidates', percentage: 87 },
      { need: 'Academic transparency', percentage: 73 },
      { need: 'Project-based assessment', percentage: 68 },
      { need: 'University integration', percentage: 58 }
    ],
    transparencyComfort: [
      { level: 'Fully comfortable', percentage: 45 },
      { level: 'Mostly comfortable', percentage: 38 },
      { level: 'Somewhat comfortable', percentage: 15 },
      { level: 'Not comfortable', percentage: 2 }
    ]
  }
}

const COLORS = ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554']

export default function SurveyResultsPage() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const exportToCSV = (data: any, filename: string) => {
    // Convert data to CSV format
    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(data).join(",") + "\n"
      + Object.values(data).join(",")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllResults = () => {
    // In real app, this would export comprehensive survey data
    console.log('Exporting all survey results...')
    alert('Survey results exported! (In real app, this would download a comprehensive CSV file)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-50/50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Survey Results Dashboard
              </h1>
              <p className="text-gray-600 mt-2">InTransparency Platform Survey Analytics</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <a href="/admin/send-surveys">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Surveys
                </a>
              </Button>
              <Button onClick={exportAllResults} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export All Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="responses">Raw Responses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSurveyResults.overview.totalResponses}</div>
                  <p className="text-xs text-gray-600">Across all user types</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Student Responses</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSurveyResults.overview.studentResponses}</div>
                  <p className="text-xs text-gray-600">63% of total responses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Company Responses</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSurveyResults.overview.companyResponses}</div>
                  <p className="text-xs text-gray-600">28% of total responses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockSurveyResults.overview.completionRate}%</div>
                  <p className="text-xs text-gray-600">High engagement rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Distribution</CardTitle>
                  <CardDescription>Survey responses by user type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Students', responses: mockSurveyResults.overview.studentResponses },
                      { name: 'Companies', responses: mockSurveyResults.overview.companyResponses },
                      { name: 'Universities', responses: mockSurveyResults.overview.universityResponses }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Timeline</CardTitle>
                  <CardDescription>Daily survey submissions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockSurveyResults.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="companies" stackId="1" stroke="#1d4ed8" fill="#1d4ed8" />
                      <Area type="monotone" dataKey="universities" stackId="1" stroke="#1e40af" fill="#1e40af" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response Quality Analysis</CardTitle>
                <CardDescription>Completion rates and response quality metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSurveyResults.responseQuality}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                      >
                        {mockSurveyResults.responseQuality.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quality Metrics</h3>
                    {mockSurveyResults.responseQuality.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Universities</CardTitle>
                  <CardDescription>Distribution of student responses by university</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSurveyResults.demographics.students.universities}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockSurveyResults.demographics.students.universities.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Graduation Years</CardTitle>
                  <CardDescription>When students are graduating</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSurveyResults.demographics.students.graduationYears}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Industries</CardTitle>
                  <CardDescription>Distribution of company responses by industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSurveyResults.demographics.companies.industries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Sizes</CardTitle>
                  <CardDescription>Distribution by company size</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSurveyResults.demographics.companies.companySizes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ size, percent }) => `${size}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockSurveyResults.demographics.companies.companySizes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Key Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Priorities</CardTitle>
                  <CardDescription>Top features students want in the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSurveyResults.insights.studentPriorities.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.feature}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Needs</CardTitle>
                  <CardDescription>Most requested features by companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSurveyResults.insights.companyNeeds.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.need}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transparency Comfort Level</CardTitle>
                <CardDescription>How comfortable users are with academic transparency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockSurveyResults.insights.transparencyComfort}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Responses Tab */}
          <TabsContent value="responses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Survey Data</CardTitle>
                <CardDescription>Download detailed survey responses for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(mockSurveyResults.demographics.students, 'student-responses')}
                    className="flex items-center"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Student Responses
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(mockSurveyResults.demographics.companies, 'company-responses')}
                    className="flex items-center"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Company Responses
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(mockSurveyResults.insights, 'insights-summary')}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Insights Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Survey Responses</CardTitle>
                <CardDescription>Latest survey submissions (anonymized)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, type: 'Student', university: 'Politecnico Milano', timestamp: '2 hours ago' },
                    { id: 2, type: 'Company', industry: 'Technology', timestamp: '4 hours ago' },
                    { id: 3, type: 'Student', university: 'Università Bocconi', timestamp: '6 hours ago' },
                    { id: 4, type: 'Company', industry: 'Finance', timestamp: '8 hours ago' },
                    { id: 5, type: 'University', name: 'Career Services', timestamp: '1 day ago' }
                  ].map((response) => (
                    <div key={response.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">{response.type}</Badge>
                        <span className="text-sm">
                          {response.type === 'Student' && `Student from ${response.university}`}
                          {response.type === 'Company' && `${response.industry} company`}
                          {response.type === 'University' && response.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{response.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}