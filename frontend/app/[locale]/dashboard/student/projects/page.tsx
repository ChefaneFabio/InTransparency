'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { ProjectCard } from '@/components/dashboard/student/ProjectCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  Eye, 
  Heart, 
  Share,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchProjects()
  }, [user])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects?userId=${user?.id}`)
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((project: any) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech: any) => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((project: any) => project.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((project: any) => project.status === statusFilter)
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      let aVal, bVal

      switch (sortBy) {
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'innovation_score':
          aVal = a.innovationScore || 0
          bVal = b.innovationScore || 0
          break
        case 'complexity_level':
          const complexityOrder: any = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }
          aVal = complexityOrder[a.complexityLevel] || 0
          bVal = complexityOrder[b.complexityLevel] || 0
          break
        case 'updated_at':
          aVal = new Date(a.updatedAt)
          bVal = new Date(b.updatedAt)
          break
        default: // created_at
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredProjects(filtered)
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const ProjectActions = ({ project }: { project: any }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/student/projects/${project.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/student/projects/${project.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Project
          </Link>
        </DropdownMenuItem>
        {project.repositoryUrl && (
          <DropdownMenuItem asChild>
            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Repository
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/student/projects/${project.id}/analytics`}>
            <Eye className="mr-2 h-4 w-4" />
            View Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => deleteProject(project.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-700">Manage and showcase your work</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_: any, i: number) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-700 mt-1">
            Manage and showcase your academic and personal projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
              <div className="ml-2 text-sm text-gray-700 font-medium">Total Projects</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'analyzed').length}
              </div>
              <div className="ml-2 text-sm text-gray-700 font-medium">Analyzed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(projects.reduce((acc, p) => acc + (p.innovationScore || 0), 0) / projects.length) || 0}
              </div>
              <div className="ml-2 text-sm text-gray-700 font-medium">Avg Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">
                {projects.reduce((acc, p) => acc + (p.stats?.views || 0), 0)}
              </div>
              <div className="ml-2 text-sm text-gray-700 font-medium">Total Views</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="mobile-development">Mobile Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="machine-learning">Machine Learning</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="game-development">Game Development</SelectItem>
                  <SelectItem value="iot">IoT</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_analysis">Pending</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="analyzed">Analyzed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="updated_at">Updated Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="innovation_score">Innovation Score</SelectItem>
                  <SelectItem value="complexity_level">Complexity</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Content */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            {projects.length === 0 ? (
              <div>
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-700 mb-6">
                  Start showcasing your work by uploading your first project.
                </p>
                <Button asChild>
                  <Link href="/dashboard/student/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload First Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-700 mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setStatusFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => (
                <div key={project.id} className="relative group">
                  <ProjectCard project={project} />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ProjectActions project={project} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project: any) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🚀</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              <Link 
                                href={`/dashboard/student/projects/${project.id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {project.title}
                              </Link>
                            </h3>
                            <p className="text-gray-700 mt-1 line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="text-xs">
                                {project.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.complexityLevel}
                              </Badge>
                              {(project.technologies || []).slice(0, 3).map((tech: any, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-800 font-medium">
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {project.stats?.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {project.stats?.likes || 0}
                              </span>
                              <span className="flex items-center">
                                <Share className="h-4 w-4 mr-1" />
                                {project.stats?.shares || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {project.innovationScore}/100
                          </div>
                          <div className="text-xs text-gray-800 font-medium">Innovation</div>
                        </div>
                        <ProjectActions project={project} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}