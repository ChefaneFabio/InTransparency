'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  Circle,
  Square,
  RotateCcw,
  Play,
  Pause,
  Upload,
  AlertCircle,
  CheckCircle2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Clock
} from 'lucide-react'

interface VideoRecorderProps {
  onVideoRecorded?: (blob: Blob, duration: number) => void
  maxDuration?: number // in seconds
  className?: string
}

export function VideoRecorder({
  onVideoRecorded,
  maxDuration = 150, // 2.5 minutes default
  className = ''
}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Recording prompts based on time
  const getRecordingPrompt = (seconds: number): string => {
    if (seconds < 15) return "Introduce your project name and goal"
    if (seconds < 45) return "Explain your approach and technologies used"
    if (seconds < 90) return "Share the results and impact achieved"
    if (seconds < 120) return "Discuss key learnings and challenges overcome"
    if (seconds < 150) return "Wrap up with next steps or future improvements"
    return "You can finish recording now - great job!"
  }

  // Initialize camera and microphone
  const initializeMedia = async () => {
    try {
      setIsInitializing(true)
      setError(null)

      const constraints = {
        video: cameraEnabled ? {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        } : false,
        audio: micEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsInitializing(false)
    } catch (err) {
      console.error('Error accessing media devices:', err)
      setError('Unable to access camera or microphone. Please check permissions.')
      setIsInitializing(false)
    }
  }

  // Start recording
  const startRecording = async () => {
    if (!streamRef.current) {
      await initializeMedia()
      if (!streamRef.current) return
    }

    try {
      chunksRef.current = []

      const options = {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)

        setRecordedBlob(blob)
        setRecordedUrl(url)

        if (onVideoRecorded) {
          onVideoRecorded(blob, duration)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(elapsed)

        // Auto-stop at max duration
        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please try again.')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  // Pause/Resume recording (note: not all browsers support this)
  const togglePause = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  // Reset and start over
  const reset = () => {
    stopRecording()
    setRecordedBlob(null)
    setRecordedUrl(null)
    setDuration(0)
    setError(null)
    initializeMedia()
  }

  // Toggle camera
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraEnabled(videoTrack.enabled)
      }
    }
  }

  // Toggle microphone
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicEnabled(audioTrack.enabled)
      }
    }
  }

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize on mount
  useEffect(() => {
    initializeMedia()

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl)
      }
    }
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Record Your Project Explanation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share a 2-minute video explaining your project. Recruiters are 3x more likely to contact candidates with video explanations.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Preview */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Recording Indicator */}
          {isRecording && !isPaused && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <Badge variant="destructive" className="font-mono">
                REC {formatTime(duration)}
              </Badge>
            </div>
          )}

          {/* Paused Indicator */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                PAUSED
              </Badge>
            </div>
          )}

          {/* Loading */}
          {isInitializing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <p>Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Timer and Progress */}
          {isRecording && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-white text-sm">
                  <span className="font-mono">{formatTime(duration)} / {formatTime(maxDuration)}</span>
                  <Clock className="h-4 w-4" />
                </div>
                <Progress value={(duration / maxDuration) * 100} className="h-2" />
                <p className="text-xs text-white/80">{getRecordingPrompt(duration)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recording Tips */}
        {!isRecording && !recordedBlob && (
          <Alert>
            <Mic className="h-4 w-4" />
            <AlertDescription>
              <strong>Recording Tips:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Find a quiet location with good lighting</li>
                <li>• Look at the camera and speak clearly</li>
                <li>• Keep it concise (aim for 2 minutes)</li>
                <li>• Explain what you built, how, and the impact</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* What to Cover */}
        {!isRecording && !recordedBlob && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What to explain:</h4>
            <ol className="space-y-1 text-sm text-blue-800">
              <li>1. What problem did you solve?</li>
              <li>2. How did you approach it? (technologies, methods)</li>
              <li>3. What results did you achieve?</li>
              <li>4. What did you learn?</li>
            </ol>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          {!isRecording && !recordedBlob && (
            <>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCamera}
                >
                  {cameraEnabled ? (
                    <Camera className="h-4 w-4 mr-2" />
                  ) : (
                    <CameraOff className="h-4 w-4 mr-2" />
                  )}
                  Camera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMic}
                >
                  {micEnabled ? (
                    <Mic className="h-4 w-4 mr-2" />
                  ) : (
                    <MicOff className="h-4 w-4 mr-2" />
                  )}
                  Mic
                </Button>
              </div>

              <Button
                onClick={startRecording}
                disabled={isInitializing || (!cameraEnabled && !micEnabled)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Circle className="h-4 w-4 mr-2 fill-current" />
                Start Recording
              </Button>
            </>
          )}

          {isRecording && (
            <>
              <Button
                variant="outline"
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                onClick={stopRecording}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            </>
          )}

          {recordedBlob && (
            <>
              <Button
                variant="outline"
                onClick={reset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Record Again
              </Button>

              <Button
                onClick={() => onVideoRecorded?.(recordedBlob, duration)}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Use This Video
              </Button>
            </>
          )}
        </div>

        {/* Preview Recorded Video */}
        {recordedUrl && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Preview:</h4>
            <video
              src={recordedUrl}
              controls
              className="w-full aspect-video bg-gray-900 rounded-lg"
            />
            <p className="text-sm text-muted-foreground">
              Duration: {formatTime(duration)} • Size: {(recordedBlob!.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Browser Compatibility Warning */}
        {!navigator.mediaDevices && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your browser doesn't support video recording. Please use Chrome, Firefox, or Edge.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
