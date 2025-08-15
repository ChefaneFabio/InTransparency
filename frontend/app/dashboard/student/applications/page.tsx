'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Calendar, Building, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react'

const applications = [
  {
    id: '1',
    jobTitle: 'Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$80,000 - $100,000',
    appliedDate: '2024-01-15',
    status: 'Under Review',
    statusColor: 'bg-yellow-500',
    matchScore: 92,
    type: 'Full-time',
    description: 'Build modern web applications using React and TypeScript...'
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    appliedDate: '2024-01-12',
    status: 'Interview Scheduled',
    statusColor: 'bg-blue-500',
    matchScore: 88,
    type: 'Full-time',
    description: 'Work on both frontend and backend development...'
  },
  {
    id: '3',
    jobTitle: 'React Developer Intern',
    company: 'BigTech Solutions',
    location: 'New York, NY',
    salary: '$25/hour',
    appliedDate: '2024-01-10',
    status: 'Rejected',
    statusColor: 'bg-red-500',
    matchScore: 78,
    type: 'Internship',
    description: 'Summer internship building user interfaces...'
  },
  {
    id: '4',
    jobTitle: 'Software Engineer',
    company: 'InnovateTech',
    location: 'Austin, TX',
    salary: '$85,000 - $110,000',
    appliedDate: '2024-01-08',
    status: 'Offer Received',
    statusColor: 'bg-green-500',
    matchScore: 95,
    type: 'Full-time',
    description: 'Join our engineering team to build scalable applications...'
  },
  {
    id: '5',
    jobTitle: 'Junior Developer',
    company: 'WebCraft Agency',
    location: 'Seattle, WA',
    salary: '$70,000 - $85,000',
    appliedDate: '2024-01-05',
    status: 'Applied',
    statusColor: 'bg-gray-500',
    matchScore: 82,
    type: 'Full-time',
    description: 'Create responsive websites for clients...'
  }
]

const interviews = [
  {
    id: '1',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    date: '2024-01-20',
    time: '2:00 PM',
    type: 'Technical Interview',
    interviewer: 'John Smith - CTO',
    location: 'Video Call',
    status: 'Upcoming'
  },
  {
    id: '2',
    jobTitle: 'Frontend Developer',
    company: 'TechCorp Inc.',
    date: '2024-01-18',
    time: '10:00 AM',
    type: 'HR Screening',
    interviewer: 'Sarah Johnson - HR Manager',
    location: 'Phone Call',
    status: 'Completed'
  }
]

export default function StudentApplications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase().replace(' ', '-') === statusFilter
    const matchesType = typeFilter === 'all' || app.type.toLowerCase() === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string, statusColor: string) => {
    return (
      <Badge className={`${statusColor} text-white`}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track your job applications and interview schedule
        </p>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="offer-received">Offer Received</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{application.jobTitle}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {application.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {application.salary}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(application.status, application.statusColor)}
                      <div className="text-sm text-muted-foreground">
                        Match: {application.matchScore}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {application.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <div className="grid gap-6">
            {interviews.map((interview) => (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{interview.jobTitle}</CardTitle>
                      <CardDescription>{interview.company}</CardDescription>
                    </div>
                    <Badge variant={interview.status === 'Upcoming' ? 'default' : 'secondary'}>
                      {interview.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{interview.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{interview.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{interview.location}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Interviewer</p>
                      <p className="font-medium">{interview.interviewer}</p>
                    </div>
                    {interview.status === 'Upcoming' && (
                      <div className="flex gap-2">
                        <Button size="sm">Join Call</Button>
                        <Button variant="outline" size="sm">Reschedule</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Software Engineer - InnovateTech</CardTitle>
              <CardDescription>Full-time position in Austin, TX</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Salary</h4>
                    <p className="text-2xl font-bold text-green-600">$95,000</p>
                    <p className="text-sm text-muted-foreground">Base salary per year</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Health, dental, vision insurance</li>
                      <li>• 401k with company match</li>
                      <li>• 3 weeks PTO + holidays</li>
                      <li>• $2,000 learning budget</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Response Deadline</h4>
                  <p className="text-sm text-muted-foreground">January 25, 2024</p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700">Accept Offer</Button>
                  <Button variant="outline">Negotiate</Button>
                  <Button variant="destructive">Decline</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}