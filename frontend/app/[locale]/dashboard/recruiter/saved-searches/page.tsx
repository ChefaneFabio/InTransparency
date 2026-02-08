'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Bell,
  Clock,
  Users,
  BookmarkPlus,
  Play,
  Pause,
  Trash2,
  Eye,
  TrendingUp,
  AlertCircle,
  MapPin,
  GraduationCap,
  Zap,
  RefreshCw,
} from 'lucide-react'
import { Link } from '@/navigation'

interface SavedSearchFilters {
  search?: string
  university?: string
  skills?: string | string[]
  major?: string
  graduationYear?: string
  location?: string
  [key: string]: unknown
}

interface SavedSearch {
  id: string
  name: string
  description: string | null
  filters: SavedSearchFilters
  isActive: boolean
  alertsEnabled: boolean
  alertFrequency: string
  candidateCount: number
  newMatches: number
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
}

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSearches = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/recruiter/saved-searches')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch')
      }
      const data = await res.json()
      setSavedSearches(data.savedSearches || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load saved searches')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSearches()
  }, [fetchSearches])

  const handleToggleActive = async (search: SavedSearch) => {
    setActionLoading(search.id)
    try {
      const res = await fetch(`/api/dashboard/recruiter/saved-searches/${search.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !search.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setSavedSearches(prev =>
        prev.map(s => s.id === search.id ? data.savedSearch : s)
      )
    } catch (err) {
      console.error('Toggle active error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleAlerts = async (search: SavedSearch) => {
    setActionLoading(search.id)
    try {
      const res = await fetch(`/api/dashboard/recruiter/saved-searches/${search.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertsEnabled: !search.alertsEnabled }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setSavedSearches(prev =>
        prev.map(s => s.id === search.id ? data.savedSearch : s)
      )
    } catch (err) {
      console.error('Toggle alerts error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this saved search?')) return
    setActionLoading(id)
    try {
      const res = await fetch(`/api/dashboard/recruiter/saved-searches/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      setSavedSearches(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const formatTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return `${Math.floor(seconds / 604800)} weeks ago`
  }

  const getFilterSummary = (filters: SavedSearchFilters) => {
    const parts: string[] = []
    if (filters.search) parts.push(`"${filters.search}"`)
    if (filters.university) parts.push(filters.university)
    if (filters.major) parts.push(filters.major)
    if (filters.graduationYear) parts.push(`Class of ${filters.graduationYear}`)
    if (filters.location) parts.push(filters.location)
    const skills = typeof filters.skills === 'string'
      ? filters.skills.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(filters.skills) ? filters.skills : []
    if (skills.length > 0) parts.push(`${skills.length} skill${skills.length !== 1 ? 's' : ''}`)
    return parts
  }

  const getFilterSkills = (filters: SavedSearchFilters): string[] => {
    if (typeof filters.skills === 'string') {
      return filters.skills.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (Array.isArray(filters.skills)) {
      return filters.skills
    }
    return []
  }

  const activeSearches = savedSearches.filter(s => s.isActive)
  const totalMatches = savedSearches.reduce((sum, s) => sum + s.candidateCount, 0)
  const totalNew = savedSearches.reduce((sum, s) => sum + s.newMatches, 0)
  const alertsEnabled = savedSearches.filter(s => s.alertsEnabled).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Searches & Alerts</h1>
        </div>
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load saved searches</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); setLoading(true); fetchSearches() }}>
            Retry
          </Button>
        </Card>
      </div>
    )
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
                <p className="text-2xl font-bold text-gray-900">{activeSearches.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New Matches</p>
                <p className="text-2xl font-bold text-gray-900">{totalNew}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alertsEnabled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Searches List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BookmarkPlus className="h-5 w-5 mr-2" />
              Your Saved Searches ({savedSearches.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchSearches() }}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/recruiter/advanced-search">
                  <Search className="h-4 w-4 mr-1" />
                  New Search
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {savedSearches.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved searches yet</h3>
              <p className="text-gray-600 mb-4">
                Save your searches to quickly access them later and get alerts on new matches
              </p>
              <Button asChild>
                <Link href="/dashboard/recruiter/advanced-search">Create Your First Search</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedSearches.map((search) => {
                const skills = getFilterSkills(search.filters)
                const isActioning = actionLoading === search.id

                return (
                  <Card key={search.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
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
                                  Alerts {search.alertFrequency}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {search.description && (
                            <p className="text-gray-600 mb-3 text-sm">{search.description}</p>
                          )}

                          {/* Filter details */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            {skills.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500">Skills</p>
                                <div className="flex flex-wrap gap-1">
                                  {skills.slice(0, 2).map(skill => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {skills.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{skills.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {search.filters.university && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500">University</p>
                                <div className="flex items-center text-sm text-gray-600">
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  {search.filters.university}
                                </div>
                              </div>
                            )}

                            {search.filters.location && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500">Location</p>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {search.filters.location}
                                </div>
                              </div>
                            )}

                            {search.filters.major && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500">Major</p>
                                <p className="text-sm text-gray-600">{search.filters.major}</p>
                              </div>
                            )}

                            {search.filters.graduationYear && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500">Graduation</p>
                                <p className="text-sm text-gray-600">{search.filters.graduationYear}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {search.candidateCount} candidates
                              </div>
                              {search.newMatches > 0 && (
                                <div className="flex items-center">
                                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                                  <span className="text-green-600 font-medium">{search.newMatches} new</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Updated {formatTimeAgo(search.lastRunAt)}
                              </div>
                            </div>

                            <div className="text-xs text-gray-400">
                              Created {new Date(search.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActioning}
                              onClick={() => handleToggleActive(search)}
                            >
                              {search.isActive ? (
                                <><Pause className="h-3 w-3 mr-1" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3 mr-1" /> Activate</>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActioning}
                              onClick={() => handleToggleAlerts(search)}
                            >
                              <Bell className={`h-3 w-3 mr-1 ${search.alertsEnabled ? 'text-blue-600' : ''}`} />
                              {search.alertsEnabled ? 'Alerts On' : 'Alerts Off'}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/recruiter/students/search?${buildSearchParams(search.filters)}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View Results
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isActioning}
                              onClick={() => handleDelete(search.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function buildSearchParams(filters: SavedSearchFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', String(filters.search))
  if (filters.university) params.set('university', String(filters.university))
  if (filters.major) params.set('major', String(filters.major))
  if (filters.graduationYear) params.set('graduationYear', String(filters.graduationYear))
  if (filters.location) params.set('location', String(filters.location))
  if (filters.skills) {
    const skills = typeof filters.skills === 'string' ? filters.skills : filters.skills.join(',')
    params.set('skills', skills)
  }
  return params.toString()
}
