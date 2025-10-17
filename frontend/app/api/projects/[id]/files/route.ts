import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/projects/[id]/files - Upload files to a project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

      // TODO: Upload to S3/Cloudflare R2
      // For now, we'll simulate an upload and return a placeholder URL
      // In production, this would be:
      // const fileUrl = await uploadToS3(file)

      // PLACEHOLDER: In production, replace with actual S3/Cloudflare upload
      const fileUrl = `https://placeholder.intransparency.com/files/${projectId}/${Date.now()}-${file.name}`

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
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params

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
    const requestingUserId = request.headers.get('x-user-id')
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
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // TODO: Delete from S3/Cloudflare
    // await deleteFromS3(file.fileUrl)

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
