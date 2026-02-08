'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Calendar, Building, MapPin, Clock, ExternalLink, AlertCircle, FileText, Briefcase } from 'lucide-react'

interface ApplicationData {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  interviewDate: string | null
  interviewType: string | null
  interviewNotes: string | null
  offerDetails: any | null
  coverLetter: string | null
  job: {
    id: string
    title: string
    companyName: string
    companyLogo: string | null
    jobType: string
    workLocation: string
    location: string | null
  }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Applied', color: 'bg-gray-500' },
  REVIEWING: { label: 'Under Review', color: 'bg-yellow-500' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-blue-500' },
  INTERVIEW: { label: 'Interview', color: 'bg-indigo-500' },
  OFFER: { label: 'Offer Received', color: 'bg-green-500' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-700' },
  REJECTED: { label: 'Not Selected', color: 'bg-red-500' },
  WITHDRAWN: { label: 'Withdrawn', color: 'bg-gray-400' },
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  TEMPORARY: 'Temporary',
  FREELANCE: 'Freelance',
}

export default function StudentApplications() {
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchApplications = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/applications')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load applications')
        return res.json()
      })
      .then(data => {
        setApplications(data.applications || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true
    const query = searchTerm.toLowerCase()
    return (
      app.job.title.toLowerCase().includes(query) ||
      app.job.companyName.toLowerCase().includes(query)
    )
  })

  const interviewApps = filteredApplications.filter(app => app.status === 'INTERVIEW')
  const offerApps = filteredApplications.filter(app => app.status === 'OFFER' || app.status === 'ACCEPTED')

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-500' }
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Track your job applications and interview schedule</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchApplications}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track your job applications and interview schedule
        </p>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">
            All Applications ({filteredApplications.length})
          </TabsTrigger>
          <TabsTrigger value="interviews">
            Interviews ({interviewApps.length})
          </TabsTrigger>
          <TabsTrigger value="offers">
            Offers ({offerApps.length})
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* All Applications */}
        <TabsContent value="applications" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Start applying to jobs to track your applications here.</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map(app => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{app.job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {app.job.companyName}
                        </div>
                        {app.job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {app.job.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {JOB_TYPE_LABELS[app.job.jobType] || app.job.jobType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Applied on {formatDate(app.createdAt)}
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Interviews */}
        <TabsContent value="interviews" className="space-y-4">
          {interviewApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                <p className="text-gray-600">Interview invitations will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            interviewApps.map(app => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{app.job.title}</CardTitle>
                      <CardDescription>{app.job.companyName}</CardDescription>
                    </div>
                    <Badge>Interview</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {app.interviewDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(app.interviewDate).toLocaleString()}</span>
                      </div>
                    )}
                    {app.interviewType && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{app.interviewType}</Badge>
                      </div>
                    )}
                    {app.job.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{app.job.location}</span>
                      </div>
                    )}
                  </div>
                  {app.interviewNotes && (
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{app.interviewNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Offers */}
        <TabsContent value="offers" className="space-y-4">
          {offerApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-600">Job offers will appear here when received.</p>
              </CardContent>
            </Card>
          ) : (
            offerApps.map(app => {
              const offer = app.offerDetails as Record<string, any> | null
              return (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{app.job.title}</CardTitle>
                        <CardDescription>{app.job.companyName}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {offer && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {offer.salary && (
                          <div>
                            <p className="text-sm text-muted-foreground">Salary</p>
                            <p className="text-xl font-bold text-green-600">{offer.salary}</p>
                          </div>
                        )}
                        {offer.startDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">{offer.startDate}</p>
                          </div>
                        )}
                        {offer.benefits && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground mb-1">Benefits</p>
                            <p className="text-sm">{typeof offer.benefits === 'string' ? offer.benefits : JSON.stringify(offer.benefits)}</p>
                          </div>
                        )}
                        {offer.deadline && (
                          <div>
                            <p className="text-sm text-muted-foreground">Response Deadline</p>
                            <p className="font-medium">{offer.deadline}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Last updated {formatDate(app.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
