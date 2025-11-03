import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface TokenPayload {
  id: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

/**
 * Extract and verify JWT token from Authorization header
 */
export async function verifyAuth(req: NextRequest): Promise<TokenPayload | null> {
  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (!token) {
      return null
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload

    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Get user ID from request or throw unauthorized error
 */
export async function requireAuth(req: NextRequest): Promise<string> {
  const payload = await verifyAuth(req)

  if (!payload || !payload.id) {
    throw new Error('Unauthorized')
  }

  return payload.id
}
