'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FileUploadProps {
  onUpload: (fileUrls: string[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
  maxFileSize?: number // in bytes
  existingFiles?: string[]
}

interface UploadFile {
  file: File
  url?: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

export function FileUpload({
  onUpload,
  acceptedFileTypes = ['image/*'],
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  existingFiles = []
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingFiles)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
      progress: 0
    }))

    if (uploadFiles.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploadFiles(prev => [...prev, ...newFiles])
    
    // Start uploading immediately
    newFiles.forEach((fileObj, index) => {
      uploadFile(fileObj, uploadFiles.length + index)
    })
  }, [uploadFiles.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    multiple: maxFiles > 1
  })

  const uploadFile = async (fileObj: UploadFile, index: number) => {
    try {
      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading' } : f
      ))

      // Simulate upload progress
      const formData = new FormData()
      formData.append('file', fileObj.file)

      // Mock upload with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress } : f
        ))
      }

      // Simulate successful upload
      const mockUrl = URL.createObjectURL(fileObj.file)
      
      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'completed', 
          url: mockUrl,
          progress: 100 
        } : f
      ))

      const newUrls = [...uploadedUrls, mockUrl]
      setUploadedUrls(newUrls)
      onUpload(newUrls)

    } catch (error) {
      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error', 
          error: 'Upload failed. Please try again.'
        } : f
      ))
    }
  }

  const removeFile = (index: number) => {
    const fileToRemove = uploadFiles[index]
    if (fileToRemove.url) {
      const newUrls = uploadedUrls.filter(url => url !== fileToRemove.url)
      setUploadedUrls(newUrls)
      onUpload(newUrls)
    }
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingFile = (url: string) => {
    const newUrls = uploadedUrls.filter(u => u !== url)
    setUploadedUrls(newUrls)
    onUpload(newUrls)
  }

  const retryUpload = (index: number) => {
    const fileObj = uploadFiles[index]
    if (fileObj.status === 'error') {
      uploadFile(fileObj, index)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploadFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploadFiles.length >= maxFiles} />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the files here...</p>
        ) : uploadFiles.length >= maxFiles ? (
          <p className="text-gray-500">Maximum files reached ({maxFiles})</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              {acceptedFileTypes.join(', ')} up to {formatFileSize(maxFileSize)} each
            </p>
            <p className="text-sm text-gray-500">
              Maximum {maxFiles} files
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          {uploadFiles.map((fileObj, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(fileObj.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileObj.file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {fileObj.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {fileObj.status === 'uploading' && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {fileObj.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{formatFileSize(fileObj.file.size)}</span>
                      <span>
                        {fileObj.status === 'completed' && 'Completed'}
                        {fileObj.status === 'uploading' && `${fileObj.progress}%`}
                        {fileObj.status === 'pending' && 'Pending'}
                        {fileObj.status === 'error' && 'Failed'}
                      </span>
                    </div>
                    
                    {fileObj.status === 'uploading' && (
                      <Progress value={fileObj.progress} className="h-2" />
                    )}
                    
                    {fileObj.status === 'error' && (
                      <div className="space-y-2">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {fileObj.error}
                          </AlertDescription>
                        </Alert>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => retryUpload(index)}
                          className="text-xs h-7"
                        >
                          Retry Upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Existing Files</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingFiles.map((url, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingFile(url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {(uploadFiles.length > 0 || existingFiles.length > 0) && (
        <div className="text-xs text-gray-500 text-center">
          {uploadedUrls.length} of {maxFiles} files uploaded
        </div>
      )}
    </div>
  )
}