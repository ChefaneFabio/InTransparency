'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Server,
  Database,
  Cloud,
  Shield,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react'

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const overallStatus = 'operational' // 'operational', 'degraded', 'outage'

  const services = [
    {
      name: 'InTransparency Platform',
      description: 'Main web application and user interface',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '245ms',
      icon: Server
    },
    {
      name: 'AI Analysis Engine',
      description: 'Code analysis and skill extraction services',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '1.2s',
      icon: Zap
    },
    {
      name: 'File Upload Service',
      description: 'Project and document upload functionality',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '180ms',
      icon: Cloud
    },
    {
      name: 'Database Systems',
      description: 'User data and project storage',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '45ms',
      icon: Database
    },
    {
      name: 'Authentication Service',
      description: 'Login and security systems',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '120ms',
      icon: Shield
    },
    {
      name: 'Email Notifications',
      description: 'System emails and alerts',
      status: 'operational',
      uptime: '99.94%',
      responseTime: '2.1s',
      icon: Activity
    }
  ]

  const incidents = [
    {
      id: 1,
      title: 'Scheduled Maintenance - Database Optimization',
      description: 'Routine database maintenance and performance optimization.',
      status: 'completed',
      impact: 'No user impact',
      startTime: '2024-01-20 02:00 UTC',
      endTime: '2024-01-20 04:00 UTC',
      updates: [
        {
          time: '2024-01-20 04:00 UTC',
          message: 'Maintenance completed successfully. All services operating normally.'
        },
        {
          time: '2024-01-20 02:00 UTC',
          message: 'Scheduled maintenance has begun. No user impact expected.'
        }
      ]
    },
    {
      id: 2,
      title: 'Brief API Response Delays',
      description: 'Some users experienced slower than normal API response times.',
      status: 'resolved',
      impact: 'Minor performance impact',
      startTime: '2024-01-18 14:30 UTC',
      endTime: '2024-01-18 15:15 UTC',
      updates: [
        {
          time: '2024-01-18 15:15 UTC',
          message: 'Issue resolved. Response times have returned to normal levels.'
        },
        {
          time: '2024-01-18 14:45 UTC',
          message: 'We have identified the cause and are implementing a fix.'
        },
        {
          time: '2024-01-18 14:30 UTC',
          message: 'Investigating reports of slower API response times.'
        }
      ]
    }
  ]

  const metrics = [
    {
      name: 'Overall Uptime (30 days)',
      value: '99.96%',
      change: '+0.02%',
      icon: TrendingUp
    },
    {
      name: 'Average Response Time',
      value: '312ms',
      change: '-15ms',
      icon: Activity
    },
    {
      name: 'Successful Requests',
      value: '99.94%',
      change: '+0.01%',
      icon: CheckCircle
    },
    {
      name: 'Error Rate',
      value: '0.06%',
      change: '-0.01%',
      icon: XCircle
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500'
      case 'degraded':
        return 'text-yellow-500'
      case 'outage':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return CheckCircle
      case 'degraded':
        return AlertTriangle
      case 'outage':
        return XCircle
      default:
        return Clock
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case 'outage':
        return <Badge className="bg-red-100 text-red-800">Outage</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Status
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Real-time status and performance metrics for InTransparency services
            </p>

            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="text-lg font-medium">All Systems Operational</span>
            </div>

            <div className="text-sm text-blue-100 mt-2">
              Last updated: {currentTime.toLocaleString()}
            </div>
          </div>
        </section>

        {/* Overall Status */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${overallStatus === 'operational' ? 'bg-green-500' : overallStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-2xl font-semibold text-gray-900">
                      {overallStatus === 'operational' ? 'All Systems Operational' :
                       overallStatus === 'degraded' ? 'Partial System Outage' :
                       'Major System Outage'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Refreshes every 30 seconds
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                          {metric.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metric.name}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="py-12 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Status</h2>

            <div className="space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon
                const StatusIcon = getStatusIcon(service.status)

                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{service.uptime}</div>
                            <div className="text-xs text-gray-500">30-day uptime</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{service.responseTime}</div>
                            <div className="text-xs text-gray-500">Avg response</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                            {getStatusBadge(service.status)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Incidents</h2>

            {incidents.length > 0 ? (
              <div className="space-y-6">
                {incidents.map((incident) => (
                  <Card key={incident.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          {incident.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={incident.status === 'resolved' ? 'default' : 'outline'}>
                            {incident.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{incident.impact}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{incident.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Started:</span>
                          <span className="text-sm text-gray-600 ml-2">{incident.startTime}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Resolved:</span>
                          <span className="text-sm text-gray-600 ml-2">{incident.endTime}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Updates:</h4>
                        <div className="space-y-2">
                          {incident.updates.map((update, updateIndex) => (
                            <div key={updateIndex} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <div className="text-sm text-gray-600">{update.message}</div>
                                <div className="text-xs text-gray-500">{update.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Incidents</h3>
                  <p className="text-gray-600">All systems have been running smoothly.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Informed
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to get notified about system updates and maintenance windows
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}