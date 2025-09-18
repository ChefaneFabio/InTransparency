import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { UniversityService } from '../services/universityService'
import { logger } from '../utils/logger'

// Extend Request interface to include university data
declare global {
  namespace Express {
    interface Request {
      university?: {
        id: string
        name: string
        domain: string
        apiKeyId: string
        permissions: string[]
      }
    }
  }
}

const universityService = new UniversityService()

/**
 * Validate API key for university access
 */
export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.header('X-API-Key') || req.query.api_key as string

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required',
        code: 'MISSING_API_KEY'
      })
    }

    // Hash the provided API key to compare with stored hash
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

    const universityApiKey = await universityService.validateApiKey(hashedKey)

    if (!universityApiKey || !universityApiKey.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive API key',
        code: 'INVALID_API_KEY'
      })
    }

    // Check if API key has expired
    if (universityApiKey.expiresAt && new Date() > universityApiKey.expiresAt) {
      return res.status(401).json({
        success: false,
        error: 'API key has expired',
        code: 'EXPIRED_API_KEY'
      })
    }

    // Add university context to request
    req.university = {
      id: universityApiKey.universityId,
      name: universityApiKey.university.name,
      domain: universityApiKey.university.domain,
      apiKeyId: universityApiKey.id,
      permissions: universityApiKey.permissions || []
    }

    // Log API usage
    await universityService.logApiUsage(universityApiKey.id, {
      endpoint: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })

    next()
  } catch (error: any) {
    logger.error('API key validation error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    })
  }
}

/**
 * Authenticate university using JWT access token
 */
export const authenticateUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required',
        code: 'MISSING_TOKEN'
      })
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token, jwtSecret) as any

    if (decoded.type !== 'university' || !decoded.universityId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type or missing university ID',
        code: 'INVALID_TOKEN'
      })
    }

    // Get university details
    const university = await universityService.getUniversityById(decoded.universityId)

    if (!university || !university.isActive) {
      return res.status(401).json({
        success: false,
        error: 'University not found or inactive',
        code: 'UNIVERSITY_INACTIVE'
      })
    }

    // Add university context to request
    req.university = {
      id: university.id,
      name: university.name,
      domain: university.domain,
      apiKeyId: decoded.apiKeyId || '',
      permissions: decoded.permissions || []
    }

    // Log API usage
    await universityService.logApiUsage(decoded.apiKeyId || '', {
      endpoint: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      tokenUsed: true
    })

    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
        code: 'EXPIRED_TOKEN'
      })
    }

    logger.error('University authentication error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    })
  }
}

/**
 * Check if university has specific permission
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.university) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      })
    }

    if (!req.university.permissions.includes(permission) && !req.university.permissions.includes('admin')) {
      return res.status(403).json({
        success: false,
        error: `Permission '${permission}' required`,
        code: 'INSUFFICIENT_PERMISSIONS'
      })
    }

    next()
  }
}

/**
 * Validate webhook signature for secure webhook delivery
 */
export const validateWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.header('X-InTransparency-Signature')
    const timestamp = req.header('X-InTransparency-Timestamp')
    const body = JSON.stringify(req.body)

    if (!signature || !timestamp) {
      return res.status(401).json({
        success: false,
        error: 'Missing webhook signature or timestamp',
        code: 'MISSING_WEBHOOK_SIGNATURE'
      })
    }

    // Check timestamp to prevent replay attacks (allow 5 minute window)
    const timestampNum = parseInt(timestamp)
    const currentTime = Math.floor(Date.now() / 1000)

    if (Math.abs(currentTime - timestampNum) > 300) {
      return res.status(401).json({
        success: false,
        error: 'Webhook timestamp too old',
        code: 'WEBHOOK_TIMESTAMP_INVALID'
      })
    }

    // Verify signature
    const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret'
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${body}`)
      .digest('hex')

    const providedSignature = signature.replace('sha256=', '')

    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )) {
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature',
        code: 'INVALID_WEBHOOK_SIGNATURE'
      })
    }

    next()
  } catch (error: any) {
    logger.error('Webhook signature validation error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during webhook validation',
      code: 'WEBHOOK_VALIDATION_ERROR'
    })
  }
}

/**
 * Rate limiting by university ID
 */
export const universityRateLimit = (windowMs: number = 900000, maxRequests: number = 1000) => {
  const requestCounts = new Map<string, { count: number; resetTime: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const universityId = req.university?.id

    if (!universityId) {
      return next() // Let authentication middleware handle this
    }

    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [id, data] of requestCounts.entries()) {
      if (data.resetTime < windowStart) {
        requestCounts.delete(id)
      }
    }

    // Get or create request count for this university
    const current = requestCounts.get(universityId) || { count: 0, resetTime: now + windowMs }

    if (current.resetTime < now) {
      // Reset window
      current.count = 1
      current.resetTime = now + windowMs
    } else {
      current.count++
    }

    requestCounts.set(universityId, current)

    // Check if limit exceeded
    if (current.count > maxRequests) {
      const resetTime = Math.ceil((current.resetTime - now) / 1000)

      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTime.toString()
      })

      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        reset_in_seconds: resetTime
      })
    }

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - current.count).toString(),
      'X-RateLimit-Reset': Math.ceil((current.resetTime - now) / 1000).toString()
    })

    next()
  }
}

/**
 * Validate university domain ownership
 */
export const validateDomainOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { domain, verification_code } = req.body

    if (!domain || !verification_code) {
      return res.status(400).json({
        success: false,
        error: 'Domain and verification code are required',
        code: 'MISSING_DOMAIN_VERIFICATION'
      })
    }

    const isValid = await universityService.verifyDomainOwnership(domain, verification_code)

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Domain ownership verification failed',
        code: 'DOMAIN_VERIFICATION_FAILED'
      })
    }

    next()
  } catch (error: any) {
    logger.error('Domain validation error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during domain validation',
      code: 'DOMAIN_VALIDATION_ERROR'
    })
  }
}

/**
 * Audit logging middleware for university actions
 */
export const auditLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    // Override res.json to capture response
    const originalJson = res.json
    res.json = function(body: any) {
      const endTime = Date.now()
      const duration = endTime - startTime

      // Log the action
      universityService.logAuditEvent({
        universityId: req.university?.id || '',
        action,
        endpoint: req.path,
        method: req.method,
        requestBody: req.body,
        responseStatus: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }).catch(error => {
        logger.error('Audit logging error:', error)
      })

      return originalJson.call(this, body)
    }

    next()
  }
}