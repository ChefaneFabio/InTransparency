"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FaCloudUploadAlt, FaFile, FaTimes, FaCheck } from "react-icons/fa"
import { useTranslations } from "next-intl"

export interface FileUploadProps {
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  uploadType: "image" | "video" | "document"
  onUploadComplete?: (urls: string[]) => void
  onUploadError?: (error: string) => void
  folder?: string
  createVariants?: boolean
}

interface UploadedFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  url?: string
  error?: string
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  uploadType,
  onUploadComplete,
  onUploadError,
  folder,
  createVariants = false,
}: FileUploadProps) {
  const t = useTranslations("upload")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Handle file drop/selection
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.slice(0, maxFiles).map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
      }))

      setFiles(newFiles)
    },
    [maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  // Upload files
  const uploadFiles = async () => {
    setIsUploading(true)

    const uploadPromises = files.map(async (uploadedFile, index) => {
      const formData = new FormData()

      // Add file based on upload type
      if (uploadType === "image") {
        formData.append("image", uploadedFile.file)
        if (createVariants) {
          formData.append("createVariants", "true")
        }
      } else if (uploadType === "video") {
        formData.append("video", uploadedFile.file)
      } else if (uploadType === "document") {
        formData.append("document", uploadedFile.file)
      }

      if (folder) {
        formData.append("folder", folder)
      }

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "uploading" as const } : f
        )
      )

      try {
        // Make upload request
        const response = await fetch(`/api/upload/${uploadType}`, {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Upload failed")
        }

        // Update status to success
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "success" as const, url: data.url, progress: 100 }
              : f
          )
        )

        return data.url
      } catch (error: any) {
        // Update status to error
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "error" as const, error: error.message }
              : f
          )
        )

        onUploadError?.(error.message)
        return null
      }
    })

    const urls = await Promise.all(uploadPromises)
    const successUrls = urls.filter((url) => url !== null) as string[]

    setIsUploading(false)

    if (successUrls.length > 0) {
      onUploadComplete?.(successUrls)
    }
  }

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "border-gray-300 dark:border-gray-700 hover:border-cyan-400"}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <FaCloudUploadAlt className="w-12 h-12 text-gray-400" />

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragActive ? t("dropFilesHere") : t("dragAndDrop")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("orClickToSelect")}
            </p>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("maxSize")}: {formatFileSize(maxSize)} •{" "}
            {t("maxFiles")}: {maxFiles}
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {/* File icon */}
              <div className="flex-shrink-0">
                {uploadedFile.status === "success" ? (
                  <FaCheck className="w-5 h-5 text-green-500" />
                ) : uploadedFile.status === "error" ? (
                  <FaTimes className="w-5 h-5 text-red-500" />
                ) : (
                  <FaFile className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.file.size)}
                </p>

                {/* Progress bar */}
                {uploadedFile.status === "uploading" && (
                  <Progress value={uploadedFile.progress} className="mt-2" />
                )}

                {/* Error message */}
                {uploadedFile.status === "error" && (
                  <p className="text-xs text-red-500 mt-1">{uploadedFile.error}</p>
                )}
              </div>

              {/* Remove button */}
              {uploadedFile.status !== "uploading" && (
                <button
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <FaTimes className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <Button
          onClick={uploadFiles}
          disabled={isUploading || files.every((f) => f.status === "success")}
          className="w-full"
        >
          {isUploading ? t("uploading") : t("upload")}
        </Button>
      )}
    </div>
  )
}
