'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Download,
  RefreshCw,
  Users,
  Building2,
  School,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'

export default function SurveyAdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch statistics
      const statsResponse = await fetch('/api/surveys/stats')
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch recent responses
      const responsesResponse = await fetch('/api/surveys/responses?limit=50')
      const responsesData = await responsesResponse.json()
      if (responsesData.success) {
        setResponses(responsesData.data)
      }
    } catch (error) {
      console.error('Error fetching survey data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const exportToCSV = async (type: string) => {
    try {
      const response = await fetch(`/api/surveys/export?type=${type}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-responses-${type}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <Users className="h-4 w-4" />
      case 'company':
        return <Building2 className="h-4 w-4" />
      case 'university':
        return <School className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-700'
      case 'company':
        return 'bg-green-100 text-green-700'
      case 'university':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading survey data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Survey Responses Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and analyze survey submissions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
                <BarChart className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Student Surveys</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.byType?.student || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total > 0
                  ? `${Math.round((stats.byType.student / stats.total) * 100)}% of total`
                  : 'No data'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Company Surveys</CardTitle>
                <Building2 className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.byType?.company || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total > 0
                  ? `${Math.round((stats.byType.company / stats.total) * 100)}% of total`
                  : 'No data'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Completion Time</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.averageCompletionTime ? `${stats.averageCompletionTime}s` : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Average time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="responses">Recent Responses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          {/* Recent Responses Tab */}
          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Survey Responses</CardTitle>
                    <CardDescription>View and manage survey submissions</CardDescription>
                  </div>
                  <Button
                    onClick={fetchData}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stats?.recentResponses && stats.recentResponses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Completion Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentResponses.map((response: any) => (
                        <TableRow key={response.id}>
                          <TableCell className="font-mono text-xs">
                            {response.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(response.surveyType)}>
                              <span className="flex items-center gap-1">
                                {getTypeIcon(response.surveyType)}
                                {response.surveyType}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(response.createdAt), 'MMM d, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {response.completionTime
                              ? `${Math.round(response.completionTime / 1000)}s`
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No survey responses yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Distribution</CardTitle>
                  <CardDescription>Breakdown by survey type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Students</span>
                      <span className="text-sm text-gray-600">{stats?.byType?.student || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Companies</span>
                      <span className="text-sm text-gray-600">{stats?.byType?.company || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Universities</span>
                      <span className="text-sm text-gray-600">{stats?.byType?.university || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Trends</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <TrendingUp className="h-8 w-8 mr-2" />
                    <span>Chart visualization coming soon</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Survey Data</CardTitle>
                <CardDescription>Download survey responses in CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => exportToCSV('student')}
                    variant="outline"
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Student Surveys
                  </Button>
                  <Button
                    onClick={() => exportToCSV('company')}
                    variant="outline"
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Company Surveys
                  </Button>
                  <Button
                    onClick={() => exportToCSV('university')}
                    variant="outline"
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export University Surveys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}