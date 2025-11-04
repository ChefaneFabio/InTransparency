'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreVertical, Users, Eye, Calendar, DollarSign, MapPin, Clock } from 'lucide-react'

const jobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2024-01-15',
    status: 'Active',
    applicants: 23,
    views: 145,
    description: 'We are looking for a senior frontend developer with expertise in React and TypeScript...',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Testing experience'],
    tags: ['React', 'TypeScript', 'JavaScript', 'CSS']
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    posted: '2024-01-12',
    status: 'Active',
    applicants: 34,
    views: 189,
    description: 'Join our team to build scalable web applications using modern technologies...',
    requirements: ['3+ years full-stack experience', 'Node.js', 'Database experience'],
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    posted: '2024-01-10',
    status: 'Paused',
    applicants: 18,
    views: 98,
    description: 'Seeking a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines...',
    requirements: ['AWS experience', 'Docker/Kubernetes', 'CI/CD setup'],
    tags: ['AWS', 'Docker', 'Kubernetes', 'Jenkins']
  },
  {
    id: '4',
    title: 'Product Manager Intern',
    department: 'Product',
    location: 'New York, NY',
    type: 'Internship',
    salary: '$25/hour',
    posted: '2024-01-08',
    status: 'Closed',
    applicants: 67,
    views: 234,
    description: 'Summer internship opportunity for aspiring product managers...',
    requirements: ['Product management interest', 'Analytical skills', 'Communication'],
    tags: ['Product Management', 'Analytics', 'Strategy']
  },
  {
    id: '5',
    title: 'UX Designer',
    department: 'Design',
    location: 'Seattle, WA',
    type: 'Contract',
    salary: '$80 - $100/hour',
    posted: '2024-01-05',
    status: 'Active',
    applicants: 19,
    views: 123,
    description: 'Contract position for an experienced UX designer to lead design initiatives...',
    requirements: ['5+ years UX design', 'Figma proficiency', 'User research'],
    tags: ['UX Design', 'Figma', 'User Research', 'Prototyping']
  }
]

export default function RecruiterJobs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === 'all' || job.type.toLowerCase().replace('-', '') === typeFilter.replace('-', '')
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-500',
      'Paused': 'bg-yellow-500',
      'Closed': 'bg-red-500',
      'Draft': 'bg-gray-500'
    }
    return <Badge className={`${colors[status as keyof typeof colors]} text-white`}>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage your job listings and track applications
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">161</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">789</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              days per position
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{job.department}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(job.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Job</DropdownMenuItem>
                      <DropdownMenuItem>View Applications</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>
                        {job.status === 'Active' ? 'Pause Job' : 'Activate Job'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} applicants
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {job.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(job.posted).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Applications ({job.applicants})
                    </Button>
                    <Button size="sm">Edit Job</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}