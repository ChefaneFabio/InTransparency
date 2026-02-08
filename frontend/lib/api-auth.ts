import { NextRequest } from 'next/server'
import { createHash } from 'crypto'
import prisma from '@/lib/prisma'

/**
 * Validate an API key from the Authorization header.
 * Returns the user associated with the key, or null if invalid.
 *
 * Usage: Bearer itk_xxxxx in Authorization header
 */
export async function validateApiKey(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer itk_')) {
    return null
  }

  const apiKey = authHeader.replace('Bearer ', '')
  const keyHash = createHash('sha256').update(apiKey).digest('hex')

  const key = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          subscriptionTier: true,
          company: true,
          university: true,
        }
      }
    }
  })

  if (!key) return null
  if (key.revokedAt) return null
  if (key.expiresAt && key.expiresAt < new Date()) return null

  // Update lastUsedAt (fire-and-forget)
  prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() }
  }).catch(() => {}) // ignore errors

  return {
    user: key.user,
    scopes: key.scopes,
    keyId: key.id,
  }
}
