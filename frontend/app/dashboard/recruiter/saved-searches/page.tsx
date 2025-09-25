'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Search,
  Bell,
  Clock,
  Users,
  Filter,
  BookmarkPlus,
  Play,
  Pause,
  Edit,
  Trash2,
  Settings,
  Eye,
  TrendingUp,
  Calendar,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Star,
  MapPin,
  GraduationCap,
  Zap,
  Plus
} from 'lucide-react'

export default function SavedSearchesPage() {
  const [activeTab, setActiveTab] = useState<'searches' | 'alerts'>('searches')
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    push: true,
    frequency: 'daily'
  })

  const savedSearches = [
    {
      id: 1,
      name: 'Senior ML Engineers - Bay Area',
      description: 'Machine Learning Engineers with 3+ years experience in San Francisco Bay Area',
      filters: {
        skills: ['Python', 'TensorFlow', 'PyTorch'],
        location: 'San Francisco Bay Area',
        experience: '3+ years',
        universities: ['Stanford', 'MIT', 'Berkeley'],
        gpa: '3.5+'
      },
      candidateCount: 127,
      newMatches: 8,
      lastRun: '2 hours ago',
      isActive: true,
      alertsEnabled: true,
      createdDate: '2024-01-15',
      tags: ['Priority', 'ML Team']
    },
    {
      id: 2,
      name: 'New Graduate Developers',
      description: 'Recent Computer Science graduates from top-tier universities',
      filters: {
        skills: ['JavaScript', 'React', 'Node.js'],
        graduation: '2024',
        universities: ['MIT', 'CMU', 'Stanford', 'Harvard'],
        gpa: '3.7+'
      },
      candidateCount: 89,
      newMatches: 12,
      lastRun: '1 day ago',
      isActive: true,
      alertsEnabled: false,
      createdDate: '2024-01-10',
      tags: ['Entry Level']
    },
    {
      id: 3,
      name: 'Full Stack - Remote OK',
      description: 'Full Stack developers open to remote work opportunities',
      filters: {
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        location: 'Remote',
        experience: '2-5 years',
        availability: 'Open to work'
      },
      candidateCount: 234,
      newMatches: 15,
      lastRun: '6 hours ago',
      isActive: true,
      alertsEnabled: true,
      createdDate: '2024-01-08',
      tags: ['Remote', 'Full Stack']
    },
    {
      id: 4,
      name: 'Data Scientists - Healthcare',
      description: 'Data Scientists with healthcare or biotech experience',
      filters: {
        skills: ['Python', 'R', 'SQL', 'Machine Learning'],
        industry: 'Healthcare',
        experience: '2+ years',
        projects: 'Healthcare related'
      },
      candidateCount: 56,
      newMatches: 3,
      lastRun: '12 hours ago',
      isActive: false,
      alertsEnabled: false,
      createdDate: '2024-01-05',
      tags: ['Healthcare', 'Data Science']
    }
  ]

  const recentAlerts = [
    {
      id: 1,
      searchName: 'Senior ML Engineers - Bay Area',
      type: 'new_matches',
      message: '8 new candidates match your search criteria',
      timestamp: '2 hours ago',
      candidates: ['Alex Chen', 'Sarah Kim', 'David Rodriguez'],
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      searchName: 'New Graduate Developers',
      type: 'trending_skill',
      message: 'TypeScript is trending among your target candidates (+23%)',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 3,
      searchName: 'Full Stack - Remote OK',
      type: 'market_insight',
      message: 'Remote work preferences increased 15% in your search area',
      timestamp: '2 days ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 4,
      searchName: 'Senior ML Engineers - Bay Area',
      type: 'competition_alert',
      message: 'High competition detected: 3 companies targeting similar profiles',
      timestamp: '3 days ago',
      isRead: false,
      priority: 'high'
    }
  ]

  const alertTypes = [
    { type: 'new_matches', label: 'New Matches', icon: Users, enabled: true },
    { type: 'trending_skills', label: 'Trending Skills', icon: TrendingUp, enabled: true },
    { type: 'market_insights', label: 'Market Insights', icon: Zap, enabled: false },
    { type: 'competition', label: 'Competition Alerts', icon: AlertCircle, enabled: true }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'new_matches': return Users
      case 'trending_skill': return TrendingUp
      case 'market_insight': return Zap
      case 'competition_alert': return AlertCircle
      default: return Bell
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Searches & Alerts</h1>
        <p className="text-gray-600 mt-2">
          Manage your saved searches and stay updated with intelligent alerts
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Searches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.reduce((sum, s) => sum + s.candidateCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.reduce((sum, s) => sum + s.newMatches, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.filter(s => s.alertsEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('searches')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'searches'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="h-4 w-4 mr-2 inline" />
          Saved Searches ({savedSearches.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'alerts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="h-4 w-4 mr-2 inline" />
          Alerts ({recentAlerts.filter(a => !a.isRead).length})
        </button>
      </div>

      {activeTab === 'searches' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BookmarkPlus className="h-5 w-5 mr-2" />
                Your Saved Searches
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {savedSearches.map((search) => (
                <Card key={search.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                          <div className="flex items-center space-x-2">
                            {search.isActive ? (
                              <Badge className="bg-green-100 text-green-800">
                                <Play className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-600">
                                <Pause className="h-3 w-3 mr-1" />
                                Paused
                              </Badge>
                            )}
                            {search.alertsEnabled && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Bell className="h-3 w-3 mr-1" />
                                Alerts On
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{search.description}</p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {search.filters.skills?.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {search.filters.skills?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{search.filters.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {search.filters.location}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Universities</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              {search.filters.universities?.[0] || 'Any'}
                              {search.filters.universities && search.filters.universities.length > 1 && (
                                <span className="ml-1">+{search.filters.universities.length - 1}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Experience</p>
                            <p className="text-sm text-gray-600">{search.filters.experience || search.filters.graduation}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {search.candidateCount} candidates
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                              <span className="text-green-600 font-medium">{search.newMatches} new</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Updated {search.lastRun}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {search.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Results
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm">Email Notifications</span>
                      </div>
                      <Switch
                        checked={alertSettings.email}
                        onCheckedChange={(checked) =>
                          setAlertSettings(prev => ({ ...prev, email: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm">Push Notifications</span>
                      </div>
                      <Switch
                        checked={alertSettings.push}
                        onCheckedChange={(checked) =>
                          setAlertSettings(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Alert Types</h4>
                  <div className="space-y-3">
                    {alertTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <div key={type.type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-gray-600" />
                            <span className="text-sm">{type.label}</span>
                          </div>
                          <Switch checked={type.enabled} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Alert Frequency</h4>
                    <p className="text-sm text-gray-600">How often should we send you alert summaries?</p>
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={alertSettings.frequency}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, frequency: e.target.value }))}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Alerts
                </span>
                <Button variant="outline" size="sm">
                  Mark All Read
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type)
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                        !alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      } hover:bg-gray-50`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(alert.priority)}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{alert.searchName}</p>
                          <div className="flex items-center space-x-2">
                            {!alert.isRead && (
                              <Badge className="bg-blue-100 text-blue-800">New</Badge>
                            )}
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-2">{alert.message}</p>

                        {alert.candidates && (
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-xs text-gray-500">Top matches:</p>
                            {alert.candidates.slice(0, 3).map((candidate, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {candidate}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline">View All Alerts</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}