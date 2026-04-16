import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { uploadDocument } from '@/lib/storage/upload-helpers'

// GET /api/dashboard/recruiter/documents
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const companyName = user.company || ''
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const where: any = { companyName }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ]
    }

    const documents = await prisma.companyDocument.findMany({
      where,
      include: {
        uploader: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const allDocs = await prisma.companyDocument.findMany({
      where: { companyName },
      select: { category: true, fileSize: true, confidential: true },
    })

    const categoryCounts: Record<string, number> = {}
    let totalSize = 0
    let confidentialCount = 0
    for (const doc of allDocs) {
      categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1
      totalSize += doc.fileSize
      if (doc.confidential) confidentialCount++
    }

    return NextResponse.json({
      documents: documents.map(d => ({
        id: d.id,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize,
        mimeType: d.mimeType,
        category: d.category,
        description: d.description,
        tags: d.tags,
        confidential: d.confidential,
        uploadedBy: [d.uploader.firstName, d.uploader.lastName].filter(Boolean).join(' ') || d.uploader.email,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      })),
      stats: {
        total: allDocs.length,
        totalSize,
        confidential: confidentialCount,
        categories: categoryCounts,
      },
    })
  } catch (error) {
    console.error('Error fetching company documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/recruiter/documents
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const companyName = user.company || ''
    const formData = await req.formData()

    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 })

    const categoryRaw = (formData.get('category') as string) || 'OTHER'
    const validCategories = ['JOB_DESCRIPTION', 'CONTRACT', 'NDA', 'COMPANY_POLICY', 'BRANDING', 'HIRING_REPORT', 'PARTNERSHIP', 'OTHER'] as const
    type CatType = typeof validCategories[number]
    const category: CatType = validCategories.includes(categoryRaw as CatType) ? (categoryRaw as CatType) : 'OTHER'

    const description = (formData.get('description') as string) || ''
    const tagsRaw = (formData.get('tags') as string) || ''
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
    const confidential = formData.get('confidential') === 'true'

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await uploadDocument(buffer, file.name, file.type, {
      folder: `company-docs/${companyName.replace(/\s+/g, '-').toLowerCase()}`,
      metadata: {
        userId: session.user.id,
        companyName,
        category,
        originalName: encodeURIComponent(file.name),
      },
    })

    if (!result.success) return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 400 })

    const doc = await prisma.companyDocument.create({
      data: {
        companyName,
        uploadedBy: session.user.id,
        fileName: file.name,
        fileUrl: result.url,
        fileKey: result.key,
        fileSize: result.size,
        mimeType: result.type,
        category,
        description,
        tags,
        confidential,
      },
    })

    return NextResponse.json({
      success: true,
      document: { id: doc.id, fileName: doc.fileName, fileUrl: doc.fileUrl, fileSize: doc.fileSize, category: doc.category },
    })
  } catch (error) {
    console.error('Error uploading company document:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

// DELETE /api/dashboard/recruiter/documents?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400 })

    const companyName = user.company || ''
    const doc = await prisma.companyDocument.findFirst({ where: { id, companyName } })
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

    await prisma.companyDocument.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
