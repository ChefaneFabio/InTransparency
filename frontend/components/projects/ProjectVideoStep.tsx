'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Info
} from 'lucide-react'
import { VideoRecorder } from '@/components/video/VideoRecorder'
import { VideoUploader } from '@/components/video/VideoUploader'

interface ProjectVideoStepProps {
  onVideoAdded?: (videoUrl: string) => void
  onSkip?: () => void
  onBack?: () => void
  existingVideoUrl?: string
  className?: string
}

export function ProjectVideoStep({
  onVideoAdded,
  onSkip,
  onBack,
  existingVideoUrl,
  className = ''
}: ProjectVideoStepProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideoUrl || null)
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record')

  const handleVideoRecorded = async (blob: Blob, duration: number) => {
    // Convert blob to file
    const file = new File([blob], `project-video-${Date.now()}.webm`, { type: 'video/webm' })

    // Upload to server
    const formData = new FormData()
    formData.append('video', file)
    formData.append('duration', duration.toString())

    try {
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setVideoUrl(data.url)

      if (onVideoAdded) {
        onVideoAdded(data.url)
      }
    } catch (error) {
      console.error('Error uploading video:', error)
    }
  }

  const handleVideoUploaded = (url: string, file: File) => {
    setVideoUrl(url)

    if (onVideoAdded) {
      onVideoAdded(url)
    }
  }

  const handleContinue = () => {
    if (videoUrl && onVideoAdded) {
      onVideoAdded(videoUrl)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Video className="h-6 w-6 text-blue-600" />
                Add Your Project Explanation Video
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Stand out from the crowd! Recruiters are 3x more likely to contact candidates with video explanations.
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Optional but Recommended
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-lg">3x</p>
                <p className="text-sm text-muted-foreground">Higher response rate</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-lg">85%</p>
                <p className="text-sm text-muted-foreground">More profile views</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-lg">2 min</p>
                <p className="text-sm text-muted-foreground">Ideal length</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Why add a video?</strong> Videos let recruiters see your communication skills and passion for your work.
          No competitor platform (LinkedIn, Handshake) offers this feature - it's your secret weapon!
        </AlertDescription>
      </Alert>

      {/* Recording/Upload Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'record' | 'upload')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Record Now
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
          <VideoRecorder
            onVideoRecorded={handleVideoRecorded}
            maxDuration={180} // 3 minutes
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <VideoUploader
            onVideoUploaded={handleVideoUploaded}
            maxSizeMB={100}
            maxDurationSeconds={300}
          />
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      {videoUrl && (
        <Alert className="bg-green-50 border-green-200">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Great job!</strong> Your video has been added. Recruiters will now see your personality and communication skills.
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onSkip}
          >
            Skip for Now
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!videoUrl}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {videoUrl ? 'Continue' : 'Add Video to Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium">What should I talk about?</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>• The problem your project solved</li>
              <li>• Technologies and approach you used</li>
              <li>• Results and impact achieved</li>
              <li>• Key learnings and challenges</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Video tips:</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>• Find a quiet place with good lighting</li>
              <li>• Look at the camera and speak naturally</li>
              <li>• Be enthusiastic - show your passion!</li>
              <li>• Keep it concise (2-3 minutes ideal)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
