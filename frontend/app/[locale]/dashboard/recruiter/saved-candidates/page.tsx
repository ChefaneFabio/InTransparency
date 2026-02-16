'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import {
  Bookmark,
  Users,
  Filter,
  Search,
  Star,
  MapPin,
  GraduationCap,
  Calendar,
  MessageSquare,
  ExternalLink,
  Heart,
  Trash2,
  FolderPlus,
  Grid,
  List,
  SortDesc,
  AlertCircle
} from 'lucide-react'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

interface SavedCandidate {
  id: string
  candidateId: string
  folder: string
  notes: string
  rating: number
  tags: string[]
  savedAt: string
  candidate: {
    id: string
    firstName: string
    lastName: string
    university: string
    degree: string
    graduationYear: number
    photo?: string
    gpa: number
    projectCount: number
  }
}

export default function SavedCandidatesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  // Fetch saved candidates
  const fetchSavedCandidates = useCallback((folder?: string) => {
    setLoading(true)
    setError(null)
    const url = folder && folder !== 'all'
      ? `/api/dashboard/recruiter/saved-candidates?folder=${encodeURIComponent(folder)}`
      : '/api/dashboard/recruiter/saved-candidates'

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load saved candidates')
        return res.json()
      })
      .then(data => {
        setSavedCandidates(data.savedCandidates || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchSavedCandidates(selectedFolder)
  }, [fetchSavedCandidates, selectedFolder])

  // Unsave a candidate
  const handleUnsave = async (candidateId: string) => {
    setRemovingIds(prev => {
      const next = new Set(Array.from(prev))
      next.add(candidateId)
      return next
    })
    try {
      const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId })
      })
      if (!res.ok) throw new Error('Failed to remove candidate')
      setSavedCandidates(prev => prev.filter(sc => sc.candidateId !== candidateId))
    } catch {
      alert('Failed to remove candidate. Please try again.')
    } finally {
      setRemovingIds(prev => {
        const next = new Set(Array.from(prev))
        next.delete(candidateId)
        return next
      })
    }
  }

  // Move to folder
  const handleMoveToFolder = async (savedId: string, folder: string) => {
    try {
      const res = await fetch(`/api/dashboard/recruiter/saved-candidates/${savedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
      })
      if (!res.ok) throw new Error('Failed to move candidate')
      fetchSavedCandidates(selectedFolder)
    } catch {
      alert('Failed to move candidate. Please try again.')
    }
  }

  // Build folder list from data
  const allFolders = Array.from(
    savedCandidates.reduce((acc, sc) => {
      if (sc.folder) acc.add(sc.folder)
      return acc
    }, new Set<string>())
  )

  const folders = [
    { id: 'all', name: 'All Saved', count: savedCandidates.length, color: 'gray' },
    ...allFolders.map(f => ({
      id: f,
      name: f.charAt(0).toUpperCase() + f.slice(1).replace(/-/g, ' '),
      count: savedCandidates.filter(sc => sc.folder === f).length,
      color: f === 'favorites' ? 'red' : f.includes('senior') ? 'blue' : f.includes('ml') ? 'purple' : 'green'
    }))
  ]

  const filteredCandidates = savedCandidates.filter(sc => {
    const name = `${sc.candidate.firstName} ${sc.candidate.lastName}`.toLowerCase()
    const matchesSearch = searchQuery === '' ||
      name.includes(searchQuery.toLowerCase()) ||
      sc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sc.candidate.university.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getFolderColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-muted text-foreground',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800'
    }
    return colors[color] || colors.gray
  }

  const totalSaved = savedCandidates.length
  const favoritesCount = savedCandidates.filter(sc => sc.folder === 'favorites').length
  const avgRating = savedCandidates.length > 0
    ? Math.round((savedCandidates.reduce((sum, c) => sum + (c.rating || 0), 0) / savedCandidates.length) * 10) / 10
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Saved Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Manage and organize your saved candidate profiles
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bookmark className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{totalSaved}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{favoritesCount}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Folders</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{allFolders.length}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedFolder === folder.id
                      ? getFolderColor(folder.color)
                      : 'bg-muted text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span>{folder.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Button variant="outline" size="sm">
                <SortDesc className="h-4 w-4 mr-2" />
                Sort
              </Button>

              <Button size="sm">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-36" />
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Failed to load candidates</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => fetchSavedCandidates(selectedFolder)}>
                Try Again
              </Button>
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCandidates.map((sc) => {
                const candidate = sc.candidate
                const name = `${candidate.firstName} ${candidate.lastName}`
                const initials = name.split(' ').map(n => n[0]).join('')
                const isRemoving = removingIds.has(sc.candidateId)

                return (
                  <Card key={sc.id} className={`hover:shadow-lg transition-shadow ${isRemoving ? 'opacity-50' : ''}`}>
                    <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-4'}>
                      <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center space-x-4'}>
                        {/* Avatar and Basic Info */}
                        <div className={viewMode === 'grid' ? 'flex items-center space-x-3' : 'flex-shrink-0'}>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {initials}
                          </div>
                          {viewMode === 'grid' && (
                            <div>
                              <h3 className="font-semibold text-foreground">{name}</h3>
                              <p className="text-muted-foreground text-sm">{candidate.degree}</p>
                            </div>
                          )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          {viewMode === 'list' && (
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground">{name}</h3>
                                <p className="text-muted-foreground text-sm">{candidate.degree}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-sm text-muted-foreground">{sc.rating || '-'}</span>
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                  GPA: {candidate.gpa}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className={viewMode === 'grid' ? 'space-y-3' : 'space-y-2'}>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {candidate.university}
                              <span className="mx-2">&bull;</span>
                              <Calendar className="h-4 w-4 mr-1" />
                              {candidate.graduationYear}
                            </div>

                            {viewMode === 'grid' && (
                              <>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span className="text-muted-foreground">{sc.rating || '-'}</span>
                                  </div>
                                  <span className="font-medium text-muted-foreground">
                                    GPA: {candidate.gpa}
                                  </span>
                                </div>

                                <div>
                                  <p className="text-sm text-foreground/80 font-medium mb-1">Projects:</p>
                                  <p className="text-sm text-muted-foreground">{candidate.projectCount} project{candidate.projectCount !== 1 ? 's' : ''}</p>
                                </div>
                              </>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {sc.tags.slice(0, viewMode === 'grid' ? 4 : 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {sc.tags.length > (viewMode === 'grid' ? 4 : 3) && (
                                <Badge variant="outline" className="text-xs">
                                  +{sc.tags.length - (viewMode === 'grid' ? 4 : 3)}
                                </Badge>
                              )}
                            </div>

                            {sc.folder && (
                              <Badge variant="secondary" className="text-xs">
                                {sc.folder}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className={viewMode === 'grid' ? 'flex justify-between items-center pt-4 border-t' : 'flex items-center space-x-2'}>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/dashboard/recruiter/candidates/${sc.candidateId}`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              onClick={() => handleMoveToFolder(sc.id, 'favorites')}
                              title="Move to favorites"
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                              onClick={() => handleUnsave(sc.candidateId)}
                              disabled={isRemoving}
                              title="Remove from saved"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved candidates"
              description="Save candidates from search results to review later"
              action={{
                label: 'Browse Candidates',
                href: '/dashboard/recruiter/candidates',
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
