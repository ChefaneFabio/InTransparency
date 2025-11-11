import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { deleteFromR2, getFileMetadata } from '@/lib/storage/r2-client'

/**
 * Delete File API
 *
 * Deletes a file from R2 storage.
 * Requires authentication and ownership verification.
 *
 * DELETE /api/upload/delete?key=path/to/file.ext
 */
export async function DELETE(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Get file key from query params
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'No file key provided' },
        { status: 400 }
      )
    }

    // 3. Get file metadata to check ownership
    const metadata = await getFileMetadata(key)

    if (!metadata) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // 4. Verify ownership (check if userId in metadata matches session user)
    const fileUserId = metadata.metadata?.userid
    const isOwner = fileUserId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this file' },
        { status: 403 }
      )
    }

    // 5. Delete from R2
    await deleteFromR2(key)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      key,
    })
  } catch (error: any) {
    console.error('File deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete file' },
      { status: 500 }
    )
  }
}

/**
 * Batch delete files
 *
 * POST /api/upload/delete
 * Body: { keys: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await req.json()
    const { keys } = body

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: 'Invalid keys array' },
        { status: 400 }
      )
    }

    // 3. Limit batch size
    if (keys.length > 100) {
      return NextResponse.json(
        { error: 'Cannot delete more than 100 files at once' },
        { status: 400 }
      )
    }

    // 4. Delete all files (with ownership check)
    const results = await Promise.allSettled(
      keys.map(async (key) => {
        // Check ownership
        const metadata = await getFileMetadata(key)
        if (!metadata) {
          throw new Error(`File not found: ${key}`)
        }

        const fileUserId = metadata.metadata?.userid
        const isOwner = fileUserId === session.user.id
        const isAdmin = session.user.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
          throw new Error(`Access denied: ${key}`)
        }

        // Delete
        await deleteFromR2(key)
        return key
      })
    )

    // 5. Compile results
    const deleted: string[] = []
    const failed: { key: string; error: string }[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        deleted.push(result.value)
      } else {
        failed.push({
          key: keys[index],
          error: result.reason.message,
        })
      }
    })

    return NextResponse.json({
      success: failed.length === 0,
      deleted: deleted.length,
      failed: failed.length,
      details: {
        deleted,
        failed,
      },
    })
  } catch (error: any) {
    console.error('Batch deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Batch deletion failed' },
      { status: 500 }
    )
  }
}
