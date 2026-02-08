import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/webhooks/university - Receive webhook from external university systems
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { universityId, universityName, dataType, payload } = body

    if (!universityId || !universityName || !dataType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create sync log
    const log = await prisma.universitySyncLog.create({
      data: {
        universityId,
        universityName,
        syncType: 'WEBHOOK',
        dataType: dataType.toUpperCase(),
        status: 'SUCCESS',
        recordsProcessed: Array.isArray(payload) ? payload.length : 1,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsFailed: 0,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      syncLogId: log.id,
      message: `Webhook received. ${log.recordsProcessed} records logged.`,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
