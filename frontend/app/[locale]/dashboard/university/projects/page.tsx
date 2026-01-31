'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Loader2,
  FolderOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  Award,
  Eye
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  photo: string | null
  degree: string | null
  graduationYear: string | null
}

interface Project {
  id: string
  title: string
  description: string
  discipline: string
  projectType: string | null
  skills: string[]
  imageUrl: string | null
  courseName: string | null
  courseCode: string | null
  semester: string | null
  professor: string | null
  grade: string | null
  verificationStatus: string
  universityVerified: boolean
  createdAt: string
  student: Student
  hasProfessorEndorsement: boolean
}

interface Stats {
  total: number
  pending: number
  verified: number
  rejected: number
  needsInfo: number
}

export default function UniversityProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    needsInfo: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams()
        if (activeTab !== 'all') {
          params.set('status', activeTab)
        }
        if (disciplineFilter !== 'all') {
          params.set('discipline', disciplineFilter)
        }

        const response = await fetch(`/api/dashboard/university/projects?${params}`)
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects)
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [activeTab, disciplineFilter])

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'NEEDS_INFO':
        return (
          <Badge className="bg-orange-100 text-orange-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Needs Info
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-semibold text-gray-900">Project Verification</h1>
        <p className="text-gray-600 mt-1">
          Review and verify student projects linked to courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.needsInfo}</p>
                <p className="text-sm text-gray-600">Needs Info</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="ENGINEERING">Engineering</SelectItem>
                    <SelectItem value="DESIGN">Design</SelectItem>
                    <SelectItem value="SCIENCE">Science</SelectItem>
                    <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                    <SelectItem value="LAW">Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <ProjectsList projects={filteredProjects} getStatusBadge={getStatusBadge} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <ProjectsList projects={filteredProjects} getStatusBadge={getStatusBadge} />
            </TabsContent>
            <TabsContent value="verified" className="mt-0">
              <ProjectsList projects={filteredProjects} getStatusBadge={getStatusBadge} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-0">
              <ProjectsList projects={filteredProjects} getStatusBadge={getStatusBadge} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectsList({
  projects,
  getStatusBadge
}: {
  projects: Project[]
  getStatusBadge: (status: string) => JSX.Element
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">
          Projects with course links from your students will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/university/projects/${project.id}`}
          className="block"
        >
          <div className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/30 transition-all">
            {/* Project Image */}
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="h-8 w-8 text-blue-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusBadge(project.verificationStatus)}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                {/* Student Info */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.student.photo || undefined} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {project.student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{project.student.name}</span>
                </div>

                {/* Course Info */}
                {project.courseName && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[150px]">
                      {project.courseCode ? `${project.courseCode} - ` : ''}
                      {project.courseName}
                    </span>
                  </div>
                )}

                {/* Professor Endorsement */}
                {project.hasProfessorEndorsement && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Endorsed
                  </Badge>
                )}

                {/* Grade */}
                {project.grade && (
                  <Badge variant="secondary" className="text-xs">
                    Grade: {project.grade}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
