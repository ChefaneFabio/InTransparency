import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { randomBytes, createHash } from 'crypto'
import { z } from 'zod'

const ALLOWED_TIERS = ['RECRUITER_ENTERPRISE', 'INSTITUTION_ENTERPRISE']

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(['read', 'write', 'export'])).default(['read']),
  expiresInDays: z.number().min(1).max(365).optional(),
})

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true }
    })

    if (!user || !ALLOWED_TIERS.includes(user.subscriptionTier)) {
      return NextResponse.json({
        error: 'API access requires an Enterprise subscription',
        upgradeUrl: '/pricing',
      }, { status: 403 })
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id, revokedAt: null },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('Error listing API keys:', error)
    return NextResponse.json({ error: 'Failed to list API keys' }, { status: 500 })
  }
}

/**
 * POST /api/api-keys
 * Create a new API key
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true }
    })

    if (!user || !ALLOWED_TIERS.includes(user.subscriptionTier)) {
      return NextResponse.json({
        error: 'API access requires an Enterprise subscription',
        upgradeUrl: '/pricing',
      }, { status: 403 })
    }

    const body = await req.json()
    const { name, scopes, expiresInDays } = createKeySchema.parse(body)

    // Limit to 10 active keys per user
    const activeKeyCount = await prisma.apiKey.count({
      where: { userId: session.user.id, revokedAt: null }
    })

    if (activeKeyCount >= 10) {
      return NextResponse.json({
        error: 'Maximum of 10 active API keys allowed. Revoke an existing key first.',
      }, { status: 400 })
    }

    // Generate key: itk_ prefix + 32 random bytes as hex
    const rawKey = randomBytes(32).toString('hex')
    const fullKey = `itk_${rawKey}`
    const keyPrefix = fullKey.substring(0, 12) + '...'
    const keyHash = createHash('sha256').update(fullKey).digest('hex')

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        keyHash,
        keyPrefix,
        scopes,
        expiresAt,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        expiresAt: true,
        createdAt: true,
      }
    })

    // Return the full key ONLY on creation (it's never stored in plaintext)
    return NextResponse.json({
      key: fullKey,
      apiKey,
      message: 'Save this API key securely. It will not be shown again.',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating API key:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
  }
}

/**
 * DELETE /api/api-keys
 * Revoke an API key
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'Missing key ID' }, { status: 400 })
    }

    // Verify ownership
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId: session.user.id, revokedAt: null }
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() }
    })

    return NextResponse.json({ success: true, message: 'API key revoked' })
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 })
  }
}
