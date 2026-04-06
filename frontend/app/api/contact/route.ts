import { NextRequest, NextResponse } from 'next/server'
import { proxyJSON } from '@/lib/backend-proxy'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export const maxDuration = 15

/**
 * POST /api/contact
 * Proxies to Render backend for SMTP email delivery.
 * Falls back to console logging if backend is unavailable.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Get user ID if authenticated
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'anonymous'
    const userRole = (session?.user as any)?.role || 'VISITOR'

    // Try Render backend
    const proxyRes = await proxyJSON('/api/email/contact', body, userId, userRole, 15000)

    if (proxyRes && proxyRes.ok) {
      const data = await proxyRes.json()
      return NextResponse.json(data)
    }

    // Fallback: log to console
    console.log(`[CONTACT FORM] From: ${name} <${email}> | ${body.subject || 'No subject'} | ${body.company || 'No company'}`)
    console.log(`[CONTACT MSG] ${message.slice(0, 500)}`)

    return NextResponse.json({ success: true, method: 'logged' })
  } catch (error: any) {
    console.error('Contact form error:', error?.message)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
