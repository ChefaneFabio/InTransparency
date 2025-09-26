'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  AlertCircle,
  RotateCw as Sync,
  Database,
  School,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  RefreshCw,
  ExternalLink,
  Download,
  Upload,
  Calendar,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react'

interface UniversityConnection {
  universityId: string
  universityName: string
  logoUrl?: string
  website: string
  isConnected: boolean
  connectionType: 'direct_api' | 'portal_scraping' | 'manual_upload' | 'email_integration'
  lastSync: string
  syncStatus: 'success' | 'warning' | 'error' | 'syncing'
  dataTypes: {
    transcripts: boolean
    courses: boolean
    grades: boolean
    projects: boolean
    extracurriculars: boolean
    recommendations: boolean
  }
  syncFrequency: 'real_time' | 'daily' | 'weekly' | 'manual'
  recordsCount: {
    courses: number
    grades: number
    projects: number
    certificates: number
  }
  verificationLevel: 'verified' | 'pending' | 'unverified'
}

interface SyncActivity {
  id: string
  timestamp: string
  type: 'transcript_update' | 'new_course' | 'grade_change' | 'project_upload' | 'verification'
  description: string
  status: 'success' | 'failed' | 'pending'
  details: string
}

interface UniversityIntegrationProps {
  userId?: string
}

export function UniversityIntegration({ userId }: UniversityIntegrationProps) {
  const [connection, setConnection] = useState<UniversityConnection | null>(null)
  const [activities, setActivities] = useState<SyncActivity[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date())

  useEffect(() => {
    loadUniversityConnection()
    loadSyncActivities()

    // Set up real-time sync simulation
    const interval = setInterval(() => {
      simulateRealTimeSync()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const loadUniversityConnection = () => {
    // Mock university connection data
    const mockConnection: UniversityConnection = {
      universityId: 'bocconi',
      universityName: 'Università Bocconi',
      logoUrl: '/api/placeholder/40/40',
      website: 'https://www.unibocconi.it',
      isConnected: true,
      connectionType: 'direct_api',
      lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      syncStatus: 'success',
      dataTypes: {
        transcripts: true,
        courses: true,
        grades: true,
        projects: true,
        extracurriculars: false,
        recommendations: true
      },
      syncFrequency: 'real_time',
      recordsCount: {
        courses: 24,
        grades: 142,
        projects: 8,
        certificates: 5
      },
      verificationLevel: 'verified'
    }

    setConnection(mockConnection)
  }

  const loadSyncActivities = () => {
    const mockActivities: SyncActivity[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: 'grade_change',
        description: 'Grade updated for Machine Learning course',
        status: 'success',
        details: 'Grade changed from 29 to 30L - imported from university portal'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'new_course',
        description: 'New course enrollment detected',
        status: 'success',
        details: 'Advanced Data Structures (CS401) - Spring 2024 semester'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'project_upload',
        description: 'Project submission synced',
        status: 'success',
        details: 'Final project for Web Development course uploaded to university portal'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        type: 'transcript_update',
        description: 'Official transcript updated',
        status: 'success',
        details: 'Semester GPA: 28.5/30 - Official transcript downloaded from registrar'
      }
    ]

    setActivities(mockActivities)
  }

  const simulateRealTimeSync = () => {
    // Simulate random sync activity
    if (Math.random() > 0.7) { // 30% chance of new activity
      const newActivity: SyncActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: ['grade_change', 'new_course', 'project_upload'][Math.floor(Math.random() * 3)] as any,
        description: 'Real-time sync detected changes',
        status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
        details: 'Automatically synced from university database'
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]) // Keep last 10 activities
      setLastSyncTime(new Date())
    }
  }

  const manualSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)

    try {
      const steps = [
        'Connecting to university database...',
        'Checking for transcript updates...',
        'Syncing course enrollments...',
        'Updating grade records...',
        'Importing project submissions...',
        'Finalizing sync...'
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setSyncProgress(((i + 1) / steps.length) * 100)
      }

      // Add successful sync activity
      const syncActivity: SyncActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'transcript_update',
        description: 'Manual sync completed',
        status: 'success',
        details: 'All university records successfully synchronized'
      }

      setActivities(prev => [syncActivity, ...prev])
      setLastSyncTime(new Date())

      if (connection) {
        setConnection(prev => prev ? { ...prev, lastSync: new Date().toISOString(), syncStatus: 'success' } : null)
      }

    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case 'direct_api': return 'Direct API'
      case 'portal_scraping': return 'Portal Integration'
      case 'manual_upload': return 'Manual Upload'
      case 'email_integration': return 'Email Integration'
      default: return 'Unknown'
    }
  }

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'direct_api': return <Database className="h-4 w-4" />
      case 'portal_scraping': return <Globe className="h-4 w-4" />
      case 'manual_upload': return <Upload className="h-4 w-4" />
      case 'email_integration': return <Bell className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'syncing': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transcript_update': return <Download className="h-4 w-4 text-blue-600" />
      case 'new_course': return <BookOpen className="h-4 w-4 text-green-600" />
      case 'grade_change': return <TrendingUp className="h-4 w-4 text-purple-600" />
      case 'project_upload': return <Upload className="h-4 w-4 text-orange-600" />
      case 'verification': return <Shield className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (!connection) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No University Connected</h3>
            <p className="text-gray-600 mb-4">
              Connect your university account to automatically sync your academic records
            </p>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Connect University
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            University Integration
          </CardTitle>
          <CardDescription>
            Real-time synchronization with your university's academic systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {connection.logoUrl ? (
                  <img src={connection.logoUrl} alt={connection.universityName} className="w-10 h-10 object-contain" />
                ) : (
                  <School className="h-6 w-6 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{connection.universityName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getSyncStatusColor(connection.syncStatus)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 bg-blue-100">
                    {getConnectionTypeIcon(connection.connectionType)}
                    <span className="ml-1">{getConnectionTypeLabel(connection.connectionType)}</span>
                  </Badge>
                  {connection.verificationLevel === 'verified' && (
                    <Badge variant="outline" className="text-green-600 bg-green-100">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="text-gray-600">Last sync</div>
                <div className="font-medium">{formatTimeAgo(connection.lastSync)}</div>
              </div>
              <Button
                variant="outline"
                onClick={manualSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Sync className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </div>

          {isSyncing && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm">Synchronizing with university database...</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
              <p className="text-xs text-gray-600 mt-1">{syncProgress.toFixed(0)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Overview */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Data Overview</TabsTrigger>
          <TabsTrigger value="activity">Sync Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-blue-600">{connection.recordsCount.courses}</div>
                  <BookOpen className="h-4 w-4 ml-2 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">Courses Synced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-green-600">{connection.recordsCount.grades}</div>
                  <Award className="h-4 w-4 ml-2 text-green-600" />
                </div>
                <div className="text-sm text-gray-600">Grade Records</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-purple-600">{connection.recordsCount.projects}</div>
                  <BarChart3 className="h-4 w-4 ml-2 text-purple-600" />
                </div>
                <div className="text-sm text-gray-600">Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-orange-600">{connection.recordsCount.certificates}</div>
                  <Shield className="h-4 w-4 ml-2 text-orange-600" />
                </div>
                <div className="text-sm text-gray-600">Certificates</div>
              </CardContent>
            </Card>
          </div>

          {/* Data Types */}
          <Card>
            <CardHeader>
              <CardTitle>Synchronized Data Types</CardTitle>
              <CardDescription>
                Data automatically imported from your university's systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(connection.dataTypes || {}).map(([type, enabled]) => (
                  <div key={type} className="flex items-center gap-3 p-3 border rounded-lg">
                    {enabled ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className={`capitalize ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sync Activity</CardTitle>
              <CardDescription>
                Real-time updates from your university database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(activities || []).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{activity.description}</span>
                        <Badge variant="outline" className={
                          activity.status === 'success' ? 'text-green-600 bg-green-100' :
                          activity.status === 'failed' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.details}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Preferences</CardTitle>
              <CardDescription>
                Configure how your academic data is synchronized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sync Frequency</h4>
                    <p className="text-sm text-gray-600">How often to check for updates</p>
                  </div>
                  <Badge variant="outline" className="text-blue-600 bg-blue-100">
                    {connection.syncFrequency.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Grade Updates</h4>
                    <p className="text-sm text-gray-600">Sync new grades immediately</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Project Submissions</h4>
                    <p className="text-sm text-gray-600">Import project uploads from university portal</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Official Transcripts</h4>
                    <p className="text-sm text-gray-600">Download official transcripts automatically</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Sync
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    University Portal
                  </Button>
                  <Button variant="destructive" className="ml-auto">
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}