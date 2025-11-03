import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File | null
    const duration = formData.get('duration') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: MP4, WebM, MOV, AVI, MKV' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'mp4'
    const uniqueFilename = `${uuidv4()}.${fileExtension}`

    // In production, upload to S3, Cloudflare R2, or another cloud storage
    // For now, save to local uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos')

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, uniqueFilename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the URL (in production, this would be the cloud storage URL)
    const videoUrl = `/uploads/videos/${uniqueFilename}`

    // TODO: In production, implement:
    // 1. Upload to S3/Cloudflare R2
    // 2. Generate thumbnail from video
    // 3. Transcode to multiple formats (MP4, WebM)
    // 4. Save video metadata to database
    // 5. Set up CDN for video delivery

    /*
    // Example S3 upload (commented out for now):
    import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `videos/${uniqueFilename}`,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read'
    }

    await s3Client.send(new PutObjectCommand(s3Params))
    const videoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/videos/${uniqueFilename}`
    */

    /*
    // Example Cloudflare R2 upload:
    import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

    const r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
      }
    })

    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
      Key: `videos/${uniqueFilename}`,
      Body: buffer,
      ContentType: file.type
    }))

    const videoUrl = `https://videos.yourdomain.com/${uniqueFilename}`
    */

    return NextResponse.json({
      success: true,
      url: videoUrl,
      filename: uniqueFilename,
      size: file.size,
      type: file.type,
      duration: duration ? parseInt(duration) : null
    })

  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}

// Optional: Handle video deletion
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      )
    }

    // TODO: Implement video deletion from storage
    // For S3/R2, use DeleteObjectCommand
    // For local storage, use fs.unlink

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
