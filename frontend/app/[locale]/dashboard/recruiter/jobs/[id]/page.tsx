'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { ArrowLeft, MapPin, Clock, Users, Eye, Edit, Trash2 } from 'lucide-react'

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id

  // Sample job data - would come from API
  const job = {
    id: jobId,
    title: 'Junior Frontend Developer',
    location: 'Milano, Italy',
    type: 'Full-time',
    salary: '€30,000 - €40,000',
    posted: '3 days ago',
    status: 'Active',
    applications: 12,
    views: 89,
    description: 'We are looking for a talented Junior Frontend Developer to join our team...',
    requirements: [
      'Experience with React and TypeScript',
      'Understanding of modern CSS',
      'Good communication skills',
      'Passion for learning'
    ]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recruiter/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Posted {job.posted}
              </span>
              <Badge variant="secondary">{job.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{job.applications}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{job.views}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.round((job.applications / job.views) * 100)}%</p>
                <p className="text-sm text-gray-600">Conversion</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{job.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary Range</p>
              <p className="font-medium">{job.salary}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Requirements</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Review candidates who applied for this position</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/recruiter/candidates">
              View {job.applications} Applications
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
