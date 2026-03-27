import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { uploadDocument, uploadImage, uploadVideo, VALIDATION_PRESETS } from '@/lib/storage'
import { uploadFile } from '@/lib/storage'
import { deleteFromR2 } from '@/lib/storage'

// POST /api/projects/[id]/files - Upload files to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    // Check if user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate file sizes and types
    const maxFileSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-rar-compressed'
    ]

    const uploadedFiles = []

    for (const file of files) {
      // Validate file size
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 100MB` },
          { status: 400 }
        )
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        )
      }

      // Upload to Cloudflare R2
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const uploadOptions = { folder: `projects/${projectId}`, metadata: { projectId } }

      let uploadResult
      if (file.type.startsWith('image/')) {
        uploadResult = await uploadImage(fileBuffer, file.name, file.type, uploadOptions)
      } else if (file.type.startsWith('video/')) {
        uploadResult = await uploadVideo(fileBuffer, file.name, file.type, uploadOptions)
      } else if (
        file.type === 'application/pdf' ||
        file.type.includes('word') ||
        file.type.includes('excel') ||
        file.type.includes('document') ||
        file.type.includes('spreadsheet')
      ) {
        uploadResult = await uploadDocument(fileBuffer, file.name, file.type, uploadOptions)
      } else {
        uploadResult = await uploadFile(fileBuffer, file.name, file.type, VALIDATION_PRESETS.document, uploadOptions)
      }

      if (!uploadResult.success) {
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadResult.error || 'Unknown error'}` },
          { status: 500 }
        )
      }

      const fileUrl = uploadResult.url

      // Determine file type
      let fileType: 'PDF' | 'IMAGE' | 'VIDEO' | 'CAD' | 'DOCUMENT' | 'ARCHIVE' | 'CODE' | 'OTHER' = 'OTHER'

      if (file.type === 'application/pdf') {
        fileType = 'PDF'
      } else if (file.type.startsWith('image/')) {
        fileType = 'IMAGE'
      } else if (file.type.startsWith('video/')) {
        fileType = 'VIDEO'
      } else if (file.name.endsWith('.dwg') || file.name.endsWith('.dxf') || file.name.endsWith('.sldprt')) {
        fileType = 'CAD'
      } else if (
        file.type.includes('excel') ||
        file.type.includes('powerpoint') ||
        file.type.includes('word') ||
        file.type.includes('document')
      ) {
        fileType = 'DOCUMENT'
      } else if (file.type.includes('zip') || file.type.includes('rar')) {
        fileType = 'ARCHIVE'
      }

      // Create file record in database
      const projectFile = await prisma.projectFile.create({
        data: {
          projectId,
          fileName: file.name,
          fileType,
          fileUrl,
          fileSize: file.size,
          mimeType: file.type
        }
      })

      uploadedFiles.push(projectFile)
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

// GET /api/projects/[id]/files - Get all files for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    // Check if project exists and is accessible
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        userId: true,
        isPublic: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check access
    const getSession = await getServerSession(authOptions)
    const requestingUserId = getSession?.user?.id
    if (!project.isPublic && project.userId !== requestingUserId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get all files for the project
    const files = await prisma.projectFile.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      success: true,
      files
    })

  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/files/[fileId] - Delete a specific file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const deleteSession = await getServerSession(authOptions)
    if (!deleteSession?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = deleteSession.user.id

    // Get fileId from URL
    const fileId = request.nextUrl.searchParams.get('fileId')
    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    // Check if user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get file info before deleting
    const file = await prisma.projectFile.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from R2 — extract key from URL
    try {
      const urlObj = new URL(file.fileUrl)
      const key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
      if (key) await deleteFromR2(key)
    } catch {
      // Non-critical — file may already be deleted from R2
    }

    // Delete from database
    await prisma.projectFile.delete({
      where: { id: fileId }
    })

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
