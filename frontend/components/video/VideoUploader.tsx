'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Loader2
} from 'lucide-react'

interface VideoUploaderProps {
  onVideoUploaded?: (url: string, file: File) => void
  maxSizeMB?: number
  maxDurationSeconds?: number
  className?: string
}

export function VideoUploader({
  onVideoUploaded,
  maxSizeMB = 100, // 100MB max
  maxDurationSeconds = 300, // 5 minutes max
  className = ''
}: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate video file
  const validateVideo = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file size
      const fileSizeMB = file.size / 1024 / 1024
      if (fileSizeMB > maxSizeMB) {
        setError(`Video file is too large. Maximum size is ${maxSizeMB}MB.`)
        resolve(false)
        return
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file.')
        resolve(false)
        return
      }

      // Check duration
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = Math.floor(video.duration)
        setVideoDuration(duration)

        if (duration > maxDurationSeconds) {
          setError(`Video is too long. Maximum duration is ${Math.floor(maxDurationSeconds / 60)} minutes.`)
          resolve(false)
        } else {
          resolve(true)
        }
      }

      video.onerror = () => {
        setError('Unable to read video file. Please try another file.')
        resolve(false)
      }

      video.src = URL.createObjectURL(file)
    })
  }, [maxSizeMB, maxDurationSeconds])

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    const isValid = await validateVideo(file)

    if (isValid) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Handle drag and drop
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]

    if (!file) return

    setError(null)
    const isValid = await validateVideo(file)

    if (isValid) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  // Upload video to server
  const uploadVideo = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('video', selectedFile)
      formData.append('duration', videoDuration.toString())

      // Simulate upload with progress (replace with actual API call)
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          const videoUrl = response.url || previewUrl

          if (onVideoUploaded) {
            onVideoUploaded(videoUrl!, selectedFile)
          }

          setUploading(false)
        } else {
          throw new Error('Upload failed')
        }
      })

      xhr.addEventListener('error', () => {
        throw new Error('Network error during upload')
      })

      // Replace with your actual upload endpoint
      xhr.open('POST', '/api/upload/video')

      // Add auth header if needed
      // const token = localStorage.getItem('token')
      // if (token) {
      //   xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      // }

      xhr.send(formData)

      // For development/demo, simulate upload
      if (process.env.NODE_ENV === 'development') {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          setUploadProgress(i)
        }

        if (onVideoUploaded && previewUrl) {
          onVideoUploaded(previewUrl, selectedFile)
        }

        setUploading(false)
      }

    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload video. Please try again.')
      setUploading(false)
    }
  }

  // Remove selected file
  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setVideoDuration(0)
    setUploadProgress(0)
    setError(null)
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Project Video
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a pre-recorded video explaining your project (max {maxSizeMB}MB, {Math.floor(maxDurationSeconds / 60)} minutes)
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

        {/* Drop Zone */}
        {!selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
          >
            <FileVideo className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Drop your video here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: MP4, MOV, AVI, WebM
            </p>
            <Button variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Select Video File
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Selected File Preview */}
        {selectedFile && previewUrl && (
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative">
              <video
                src={previewUrl}
                controls
                className="w-full aspect-video bg-gray-900 rounded-lg"
              />

              {!uploading && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeFile}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            {/* File Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">File Name</p>
                <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">File Size</p>
                <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Duration</p>
                <p className="text-sm text-gray-600">{formatDuration(videoDuration)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Format</p>
                <p className="text-sm text-gray-600">{selectedFile.type.split('/')[1].toUpperCase()}</p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            {!uploading && (
              <Button
                onClick={uploadVideo}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            )}

            {/* Uploading State */}
            {uploading && (
              <Button disabled className="w-full">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </Button>
            )}
          </div>
        )}

        {/* Accepted Formats */}
        {!selectedFile && (
          <Alert>
            <FileVideo className="h-4 w-4" />
            <AlertDescription>
              <strong>Accepted formats:</strong> MP4, MOV, AVI, WebM, MKV
              <br />
              <strong>Maximum size:</strong> {maxSizeMB}MB
              <br />
              <strong>Maximum duration:</strong> {Math.floor(maxDurationSeconds / 60)} minutes
            </AlertDescription>
          </Alert>
        )}

        {/* Tips */}
        {!selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Video Tips:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Record in landscape mode (16:9 ratio)</li>
              <li>• Ensure good lighting and clear audio</li>
              <li>• Keep it concise (2-3 minutes ideal)</li>
              <li>• Export in MP4 format for best compatibility</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
