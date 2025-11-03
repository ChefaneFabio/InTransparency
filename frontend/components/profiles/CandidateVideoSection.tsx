'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VideoPlayer } from '@/components/ui/video-player'
import { VerificationBadge } from '@/components/verification/VerificationBadge'
import {
  Video,
  Play,
  Clock,
  Eye,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react'

interface ProjectVideo {
  id: string
  projectTitle: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number // in seconds
  views: number
  uploadedAt: string
  verified: boolean
  verificationLevel?: 'university' | 'professor' | 'ai'
  institutionName?: string
}

interface CandidateVideoSectionProps {
  videos: ProjectVideo[]
  candidateName: string
  className?: string
}

export function CandidateVideoSection({
  videos,
  candidateName,
  className = ''
}: CandidateVideoSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<ProjectVideo | null>(
    videos.length > 0 ? videos[0] : null
  )

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 30) return `${diffInDays} days ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hero Badge */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-purple-900">
                {candidateName} has {videos.length} video presentation{videos.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-purple-700">
                See their communication skills and passion for their work
              </p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              3x Higher Response Rate
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Video Player */}
      {selectedVideo && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  {candidateName} Explains: {selectedVideo.projectTitle}
                </CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(selectedVideo.duration)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {selectedVideo.views} views
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(selectedVideo.uploadedAt)}
                  </span>
                  {selectedVideo.verified && selectedVideo.verificationLevel && (
                    <VerificationBadge
                      level={selectedVideo.verificationLevel}
                      institutionName={selectedVideo.institutionName}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VideoPlayer
              src={selectedVideo.videoUrl}
              poster={selectedVideo.thumbnailUrl}
              title={selectedVideo.projectTitle}
              duration={formatDuration(selectedVideo.duration)}
              controls={true}
            />

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Watch this video to:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Hear {candidateName.split(' ')[0]} explain their technical approach</li>
                <li>• Assess their communication and presentation skills</li>
                <li>• Understand their passion and motivation</li>
                <li>• See their personality beyond a written resume</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Playlist (if multiple videos) */}
      {videos.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">More Project Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`
                    w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all
                    ${selectedVideo?.id === video.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.projectTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white font-mono">
                      {formatDuration(video.duration)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm mb-1">{video.projectTitle}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(video.uploadedAt)}</span>
                      <span>•</span>
                      <span>{video.views} views</span>
                      {video.verified && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs h-5">
                            Verified
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Play Indicator */}
                  {selectedVideo?.id !== video.id && (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-900 mb-1">
                Impressed by {candidateName.split(' ')[0]}'s videos?
              </p>
              <p className="text-sm text-green-700">
                Contact them now to schedule an interview. Only €10 to unlock full contact details.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Contact Candidate (€10)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
