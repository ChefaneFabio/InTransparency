'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react'

interface VideoPlayerProps {
  src?: string
  poster?: string
  title?: string
  description?: string
  duration?: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
  onEnded?: () => void
  onProgress?: (progress: number) => void
}

export function VideoPlayer({
  src,
  poster,
  title,
  description,
  duration = "2:30",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
  onEnded,
  onProgress
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(1)

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Mock video behavior for demo
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1
        const totalDuration = 150 // 2:30 in seconds
        const newProgress = (newTime / totalDuration) * 100

        setProgress(newProgress)
        onProgress?.(newProgress)

        if (newTime >= totalDuration) {
          setIsPlaying(false)
          setCurrentTime(0)
          setProgress(0)
          onEnded?.()
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, onProgress, onEnded])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = (clickX / rect.width) * 100
    const newTime = (newProgress / 100) * 150 // 2:30 total

    setProgress(newProgress)
    setCurrentTime(newTime)
  }

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(150, currentTime + seconds))
    setCurrentTime(newTime)
    setProgress((newTime / 150) * 100)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`overflow-hidden bg-black ${className}`}>
      <CardContent className="p-0 relative group">
        {/* Video Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Mock Video Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
            {poster ? (
              <img src={poster} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">{title || 'Video Content'}</p>
                  {description && <p className="text-sm mt-2">{description}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlayPause}
          >
            {!isPlaying && (
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                <Play className="h-10 w-10 text-white ml-1" />
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {isPlaying && (
            <div className="absolute top-4 right-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <Badge variant="secondary" className="ml-2 bg-black/50 text-white border-0">
                LIVE
              </Badge>
            </div>
          )}

          {/* Controls Overlay */}
          {controls && (
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(true)}
            >
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {duration}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTime(0)}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        {(title || description) && (
          <div className="p-4 bg-white">
            {title && <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Video Gallery Component
interface VideoGalleryProps {
  videos: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    duration: string
    category: string
  }>
  onVideoSelect?: (videoId: string) => void
}

export function VideoGallery({ videos, onVideoSelect }: VideoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(videos.map(v => v.category)))]
  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <Card
            key={video.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onVideoSelect?.(video.id)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-white ml-0.5" />
                  </div>
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/50 text-white border-0">
                  {video.duration}
                </Badge>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {video.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}