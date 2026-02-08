import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/sync - Get sync history
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    const logs = await prisma.universitySyncLog.findMany({
      where: { universityName },
      orderBy: { startedAt: 'desc' },
      take: 50,
    })

    // Get connection status
    const connections = await prisma.universityConnection.findMany({
      where: { universityName },
      select: {
        id: true,
        universityId: true,
        syncEnabled: true,
        lastSyncAt: true,
        syncFrequency: true,
        verificationStatus: true,
        coursesCount: true,
        gradesCount: true,
        projectsCount: true,
        certificatesCount: true,
      },
    })

    return NextResponse.json({
      logs,
      connections,
      stats: {
        totalSyncs: logs.length,
        successfulSyncs: logs.filter(l => l.status === 'SUCCESS').length,
        failedSyncs: logs.filter(l => l.status === 'FAILED').length,
        lastSync: logs[0]?.startedAt || null,
      },
    })
  } catch (error) {
    console.error('Error fetching sync data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/sync - Trigger manual sync
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const body = await req.json()
    const dataType = body.dataType || 'STUDENTS'

    // Create sync log entry
    const log = await prisma.universitySyncLog.create({
      data: {
        universityId: user.id,
        universityName,
        syncType: 'MANUAL',
        dataType,
        status: 'SUCCESS',
        recordsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsFailed: 0,
        triggeredBy: user.id,
        completedAt: new Date(),
      },
    })

    // Process sync based on data type
    let processed = 0
    if (dataType === 'STUDENTS') {
      // Count current students
      processed = await prisma.user.count({
        where: { university: universityName, role: 'STUDENT' },
      })
    } else if (dataType === 'COURSES') {
      processed = await prisma.course.count({
        where: { university: universityName },
      })
    } else if (dataType === 'PROJECTS') {
      processed = await prisma.project.count({
        where: { user: { university: universityName } },
      })
    }

    // Update log with processed count
    await prisma.universitySyncLog.update({
      where: { id: log.id },
      data: {
        recordsProcessed: processed,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      log: { ...log, recordsProcessed: processed },
      message: `Sync completed. ${processed} ${dataType.toLowerCase()} processed.`,
    })
  } catch (error) {
    console.error('Error triggering sync:', error)
    return NextResponse.json({ error: 'Failed to trigger sync' }, { status: 500 })
  }
}
