'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Heart,
  ExternalLink,
  Clock,
  Star
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface JobMatch {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    size?: string
  }
  location: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract'
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  matchScore: number
  postedAt: string
  applicants?: number
  isRemote?: boolean
  experienceLevel: string
}

interface JobMatchesProps {
  matches: JobMatch[]
}

export function JobMatches({ matches }: JobMatchesProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 75) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-700'
      case 'part-time':
        return 'bg-green-100 text-green-700'
      case 'internship':
        return 'bg-purple-100 text-purple-700'
      case 'contract':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No job matches yet
        </h3>
        <p className="text-gray-600 mb-4">
          Upload more projects to improve your job matching algorithm.
        </p>
        <Button asChild>
          <Link href="/dashboard/student/projects/new">
            Upload Project
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                {/* Company Logo */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {job.company.logo ? (
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        <Link 
                          href={`/dashboard/student/jobs/${job.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 font-medium">{job.company.name}</p>
                    </div>
                    
                    {/* Match Score */}
                    <Badge className={`ml-2 ${getMatchScoreColor(job.matchScore)}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {job.matchScore}% match
                    </Badge>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                      {job.isRemote && ' • Remote'}
                    </span>
                    
                    {job.salary && (
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary.currency}{job.salary.min.toLocaleString()}-{job.salary.max.toLocaleString()}
                      </span>
                    )}
                    
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                    </span>

                    {job.applicants && (
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants} applicants
                      </span>
                    )}
                  </div>

                  {/* Job Type and Experience */}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className={getTypeColor(job.type)}>
                      {job.type.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {job.experienceLevel}
                    </Badge>
                    {job.company.size && (
                      <Badge variant="outline">
                        {job.company.size}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mt-3 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Key Requirements */}
                  {job.requirements.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 4).map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.requirements.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSaveJob(job.id)}
                  className={savedJobs.has(job.id) ? 'text-red-600' : 'text-gray-600'}
                >
                  <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/student/jobs/${job.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button size="sm">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Why This Match */}
            {job.matchScore >= 80 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-900">
                    High Match Score
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your skills in React and Node.js align perfectly with this role's requirements.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Load More */}
      {matches.length >= 3 && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/student/jobs">
              View All Job Matches
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}