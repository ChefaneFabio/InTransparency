const crypto = require('crypto')
const config = require('../config/environment')

/**
 * Advanced session management with Redis
 * Provides secure session handling with automatic cleanup
 */

class SessionManager {
  constructor() {
    this.redis = null
    this.sessions = new Map() // Memory fallback
    this.cleanupInterval = null
  }

  // Initialize with Redis client
  init(redisClient) {
    this.redis = redisClient

    // Start cleanup for memory sessions
    this.startCleanup()

    // Set up Redis event handlers
    if (this.redis) {
      this.redis.on('error', (error) => {
        console.error('Redis session error:', error)
      })

      this.redis.on('connect', () => {
        console.log('Redis session store connected')
      })
    }
  }

  // Generate secure session ID
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex')
  }

  // Generate secure token
  generateSecureToken() {
    return crypto.randomBytes(48).toString('base64url')
  }

  // Hash session ID for storage
  hashSessionId(sessionId) {
    return crypto.createHash('sha256').update(sessionId).digest('hex')
  }

  // Create session data object
  createSessionData(userId, userData = {}) {
    const now = Date.now()
    return {
      userId,
      userData,
      createdAt: now,
      lastAccessedAt: now,
      ipAddress: null,
      userAgent: null,
      isActive: true,
      loginCount: 1
    }
  }

  // Store session
  async createSession(userId, userData = {}, req = null) {
    try {
      const sessionId = this.generateSessionId()
      const sessionData = this.createSessionData(userId, userData)

      // Add request metadata if available
      if (req) {
        sessionData.ipAddress = this.getClientIP(req)
        sessionData.userAgent = req.get('User-Agent') || ''
      }

      const sessionKey = this.getSessionKey(sessionId)
      const expiry = this.getSessionExpiry()

      if (this.redis) {
        await this.redis.setex(
          sessionKey,
          Math.floor(expiry / 1000),
          JSON.stringify(sessionData)
        )
      } else {
        // Memory fallback
        this.sessions.set(sessionKey, {
          ...sessionData,
          expiresAt: Date.now() + expiry
        })
      }

      return {
        sessionId,
        sessionToken: this.generateSecureToken(),
        expiresAt: Date.now() + expiry
      }
    } catch (error) {
      console.error('Session creation error:', error)
      throw new Error('Failed to create session')
    }
  }

  // Get session
  async getSession(sessionId) {
    try {
      const sessionKey = this.getSessionKey(sessionId)

      if (this.redis) {
        const sessionData = await this.redis.get(sessionKey)
        if (sessionData) {
          const data = JSON.parse(sessionData)

          // Update last accessed time
          data.lastAccessedAt = Date.now()
          await this.redis.setex(
            sessionKey,
            Math.floor(this.getSessionExpiry() / 1000),
            JSON.stringify(data)
          )

          return data
        }
      } else {
        // Memory fallback
        const sessionData = this.sessions.get(sessionKey)
        if (sessionData && sessionData.expiresAt > Date.now()) {
          sessionData.lastAccessedAt = Date.now()
          return sessionData
        }
      }

      return null
    } catch (error) {
      console.error('Session retrieval error:', error)
      return null
    }
  }

  // Update session
  async updateSession(sessionId, updates) {
    try {
      const sessionData = await this.getSession(sessionId)
      if (!sessionData) {
        return false
      }

      // Merge updates
      const updatedData = {
        ...sessionData,
        ...updates,
        lastAccessedAt: Date.now()
      }

      const sessionKey = this.getSessionKey(sessionId)
      const expiry = this.getSessionExpiry()

      if (this.redis) {
        await this.redis.setex(
          sessionKey,
          Math.floor(expiry / 1000),
          JSON.stringify(updatedData)
        )
      } else {
        // Memory fallback
        this.sessions.set(sessionKey, {
          ...updatedData,
          expiresAt: Date.now() + expiry
        })
      }

      return true
    } catch (error) {
      console.error('Session update error:', error)
      return false
    }
  }

  // Delete session
  async deleteSession(sessionId) {
    try {
      const sessionKey = this.getSessionKey(sessionId)

      if (this.redis) {
        await this.redis.del(sessionKey)
      } else {
        // Memory fallback
        this.sessions.delete(sessionKey)
      }

      return true
    } catch (error) {
      console.error('Session deletion error:', error)
      return false
    }
  }

  // Delete all sessions for a user
  async deleteUserSessions(userId) {
    try {
      if (this.redis) {
        const pattern = `session:*`
        const keys = await this.redis.keys(pattern)

        for (const key of keys) {
          const sessionData = await this.redis.get(key)
          if (sessionData) {
            const data = JSON.parse(sessionData)
            if (data.userId === userId) {
              await this.redis.del(key)
            }
          }
        }
      } else {
        // Memory fallback
        for (const [key, data] of this.sessions.entries()) {
          if (data.userId === userId) {
            this.sessions.delete(key)
          }
        }
      }

      return true
    } catch (error) {
      console.error('User sessions deletion error:', error)
      return false
    }
  }

  // Get all active sessions for a user
  async getUserSessions(userId) {
    try {
      const sessions = []

      if (this.redis) {
        const pattern = `session:*`
        const keys = await this.redis.keys(pattern)

        for (const key of keys) {
          const sessionData = await this.redis.get(key)
          if (sessionData) {
            const data = JSON.parse(sessionData)
            if (data.userId === userId && data.isActive) {
              sessions.push({
                sessionId: key.replace('session:', ''),
                ...data
              })
            }
          }
        }
      } else {
        // Memory fallback
        for (const [key, data] of this.sessions.entries()) {
          if (data.userId === userId && data.isActive && data.expiresAt > Date.now()) {
            sessions.push({
              sessionId: key.replace('session:', ''),
              ...data
            })
          }
        }
      }

      return sessions
    } catch (error) {
      console.error('Get user sessions error:', error)
      return []
    }
  }

  // Session middleware
  sessionMiddleware() {
    return async (req, res, next) => {
      try {
        // Extract session ID from various sources
        const sessionId = this.extractSessionId(req)

        if (sessionId) {
          const sessionData = await this.getSession(sessionId)

          if (sessionData) {
            // Validate session
            if (this.validateSession(sessionData, req)) {
              req.session = sessionData
              req.sessionId = sessionId

              // Update last accessed time
              await this.updateSession(sessionId, {
                lastAccessedAt: Date.now(),
                ipAddress: this.getClientIP(req)
              })
            } else {
              // Invalid session, clean up
              await this.deleteSession(sessionId)
            }
          }
        }

        next()
      } catch (error) {
        console.error('Session middleware error:', error)
        next()
      }
    }
  }

  // Extract session ID from request
  extractSessionId(req) {
    // Try different sources

    // 1. Authorization header
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Session ')) {
      return authHeader.substring(8)
    }

    // 2. Session header
    if (req.headers['x-session-id']) {
      return req.headers['x-session-id']
    }

    // 3. Cookie (if configured)
    if (req.cookies && req.cookies.sessionId) {
      return req.cookies.sessionId
    }

    return null
  }

  // Validate session
  validateSession(sessionData, req) {
    if (!sessionData.isActive) {
      return false
    }

    // Check IP consistency (optional, can be disabled for mobile users)
    if (config.isProduction() && sessionData.ipAddress) {
      const currentIP = this.getClientIP(req)
      if (sessionData.ipAddress !== currentIP) {
        console.warn('Session IP mismatch:', {
          stored: sessionData.ipAddress,
          current: currentIP
        })
        // In strict mode, invalidate session
        // return false
      }
    }

    // Check user agent consistency
    if (sessionData.userAgent) {
      const currentUA = req.get('User-Agent') || ''
      if (sessionData.userAgent !== currentUA) {
        console.warn('Session User-Agent mismatch')
        // In strict mode, invalidate session
        // return false
      }
    }

    return true
  }

  // Get client IP address
  getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for']
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    return req.connection.remoteAddress || req.socket.remoteAddress
  }

  // Helper methods
  getSessionKey(sessionId) {
    return `session:${this.hashSessionId(sessionId)}`
  }

  getSessionExpiry() {
    // Default 24 hours, configurable
    return 24 * 60 * 60 * 1000
  }

  // Memory cleanup for fallback storage
  startCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, data] of this.sessions.entries()) {
        if (data.expiresAt && data.expiresAt <= now) {
          this.sessions.delete(key)
        }
      }
    }, 5 * 60 * 1000) // Clean every 5 minutes
  }

  // Shutdown
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Export singleton instance
const sessionManager = new SessionManager()

module.exports = {
  sessionManager,
  SessionManager
}