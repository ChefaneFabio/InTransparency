'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
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
  SortDesc
} from 'lucide-react'

export default function SavedCandidatesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const folders = [
    { id: 'all', name: 'All Saved', count: 24, color: 'gray' },
    { id: 'favorites', name: 'Favorites', count: 8, color: 'red' },
    { id: 'senior-roles', name: 'Senior Roles', count: 12, color: 'blue' },
    { id: 'ml-engineers', name: 'ML Engineers', count: 6, color: 'purple' },
    { id: 'new-grads', name: 'New Graduates', count: 4, color: 'green' }
  ]

  const savedCandidates = [
    {
      id: 1,
      name: 'Alex Chen',
      title: 'Computer Science Student',
      university: 'Stanford University',
      location: 'San Francisco, CA',
      graduation: '2024',
      skills: ['Python', 'Machine Learning', 'React', 'TensorFlow'],
      projects: 3,
      aiScore: 94,
      savedDate: '2024-01-15',
      folders: ['favorites', 'ml-engineers'],
      avatar: null,
      topProject: 'AI-Powered Recommendation System',
      experience: 'Internship at Google',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sarah Martinez',
      title: 'Software Engineering Student',
      university: 'MIT',
      location: 'Boston, MA',
      graduation: '2024',
      skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
      projects: 5,
      aiScore: 89,
      savedDate: '2024-01-14',
      folders: ['senior-roles'],
      avatar: null,
      topProject: 'Distributed E-commerce Platform',
      experience: 'Internship at Amazon',
      rating: 4.6
    },
    {
      id: 3,
      name: 'David Kim',
      title: 'Data Science Student',
      university: 'UC Berkeley',
      location: 'Berkeley, CA',
      graduation: '2025',
      skills: ['Python', 'R', 'SQL', 'Tableau', 'Pandas'],
      projects: 4,
      aiScore: 91,
      savedDate: '2024-01-13',
      folders: ['ml-engineers', 'favorites'],
      avatar: null,
      topProject: 'Predictive Analytics Dashboard',
      experience: 'Research Assistant',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Emma Thompson',
      title: 'Computer Science Student',
      university: 'Carnegie Mellon',
      location: 'Pittsburgh, PA',
      graduation: '2024',
      skills: ['C++', 'JavaScript', 'Node.js', 'MongoDB'],
      projects: 6,
      aiScore: 87,
      savedDate: '2024-01-12',
      folders: ['senior-roles'],
      avatar: null,
      topProject: 'Real-time Collaboration Tool',
      experience: 'Freelance Developer',
      rating: 4.5
    },
    {
      id: 5,
      name: 'Michael Rodriguez',
      title: 'Software Engineering Student',
      university: 'Georgia Tech',
      location: 'Atlanta, GA',
      graduation: '2025',
      skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
      projects: 2,
      aiScore: 82,
      savedDate: '2024-01-11',
      folders: ['new-grads'],
      avatar: null,
      topProject: 'Social Media Analytics Tool',
      experience: 'Part-time Developer',
      rating: 4.3
    }
  ]

  const filteredCandidates = savedCandidates.filter(candidate => {
    const matchesFolder = selectedFolder === 'all' || candidate.folders.includes(selectedFolder)
    const matchesSearch = searchQuery === '' ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      candidate.university.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFolder && matchesSearch
  })

  const getFolderColor = (color: string) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Candidates</h1>
        <p className="text-gray-600 mt-2">
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
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{savedCandidates.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">
                  {folders.find(f => f.id === 'favorites')?.count || 0}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Avg AI Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(savedCandidates.reduce((sum, c) => sum + c.aiScore, 0) / savedCandidates.length)}
                </p>
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
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
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
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
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
          {filteredCandidates.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-4'}>
                    <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center space-x-4'}>
                      {/* Avatar and Basic Info */}
                      <div className={viewMode === 'grid' ? 'flex items-center space-x-3' : 'flex-shrink-0'}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {viewMode === 'grid' && (
                          <div>
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                            <p className="text-gray-600 text-sm">{candidate.title}</p>
                          </div>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {viewMode === 'list' && (
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                              <p className="text-gray-600 text-sm">{candidate.title}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-600">{candidate.rating}</span>
                              </div>
                              <span className={`text-sm font-medium ${getAIScoreColor(candidate.aiScore)}`}>
                                AI: {candidate.aiScore}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className={viewMode === 'grid' ? 'space-y-3' : 'space-y-2'}>
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {candidate.university}
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            {candidate.graduation}
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {candidate.location}
                          </div>

                          {viewMode === 'grid' && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-gray-600">{candidate.rating}</span>
                                </div>
                                <span className={`font-medium ${getAIScoreColor(candidate.aiScore)}`}>
                                  AI Score: {candidate.aiScore}
                                </span>
                              </div>

                              <div>
                                <p className="text-sm text-gray-700 font-medium mb-1">Top Project:</p>
                                <p className="text-sm text-gray-600">{candidate.topProject}</p>
                              </div>
                            </>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, viewMode === 'grid' ? 4 : 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > (viewMode === 'grid' ? 4 : 3) && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - (viewMode === 'grid' ? 4 : 3)}
                              </Badge>
                            )}
                          </div>
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
                            <Link href={`/dashboard/recruiter/candidates/${candidate.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved candidates found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Start saving candidates you\'re interested in'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/recruiter/candidates">
                    Browse Candidates
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}