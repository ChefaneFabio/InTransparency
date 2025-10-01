const crypto = require('crypto')
const config = require('../config/environment')

/**
 * Comprehensive logging middleware with security focus
 * Provides structured logging for requests, responses, and security events
 */

class Logger {
  constructor() {
    this.sensitiveFields = new Set([
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'csrf',
      'api_key',
      'access_token',
      'refresh_token'
    ])

    this.sensitiveHeaders = new Set([
      'authorization',
      'cookie',
      'x-api-key',
      'x-access-token',
      'x-csrf-token'
    ])
  }

  // Generate request ID for tracing
  generateRequestId() {
    return crypto.randomBytes(16).toString('hex')
  }

  // Sanitize object by removing sensitive fields
  sanitizeObject(obj, depth = 0) {
    if (depth > 3) return '[Deep Object]' // Prevent infinite recursion

    if (obj === null || obj === undefined) return obj
    if (typeof obj !== 'object') return obj

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, depth + 1))
    }

    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
      const keyLower = key.toLowerCase()

      if (this.sensitiveFields.has(keyLower) || keyLower.includes('password')) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value, depth + 1)
      } else if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500) + '...[TRUNCATED]'
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  // Sanitize headers
  sanitizeHeaders(headers) {
    const sanitized = {}
    for (const [key, value] of Object.entries(headers)) {
      const keyLower = key.toLowerCase()
      if (this.sensitiveHeaders.has(keyLower)) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = value
      }
    }
    return sanitized
  }

  // Get client information
  getClientInfo(req) {
    const forwarded = req.headers['x-forwarded-for']
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.connection.remoteAddress

    return {
      ip,
      userAgent: req.headers['user-agent'] || '',
      origin: req.headers.origin || '',
      referer: req.headers.referer || ''
    }
  }

  // Create base log entry
  createBaseLog(req, type = 'request') {
    const requestId = req.requestId || this.generateRequestId()
    req.requestId = requestId

    return {
      timestamp: new Date().toISOString(),
      requestId,
      type,
      method: req.method,
      url: req.url,
      path: req.path,
      client: this.getClientInfo(req),
      userId: req.user?.id || req.session?.userId || null,
      sessionId: req.sessionId || null
    }
  }

  // Log request
  logRequest(req) {
    if (!this.shouldLog(req)) return

    const logEntry = {
      ...this.createBaseLog(req, 'request'),
      headers: this.sanitizeHeaders(req.headers),
      query: this.sanitizeObject(req.query),
      body: this.sanitizeObject(req.body),
      params: this.sanitizeObject(req.params)
    }

    this.writeLog('request', logEntry)
  }

  // Log response
  logResponse(req, res, responseTime, responseBody = null) {
    if (!this.shouldLog(req)) return

    const logEntry = {
      ...this.createBaseLog(req, 'response'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('content-length') || 0,
      headers: this.sanitizeHeaders(res.getHeaders()),
    }

    // Only log response body for errors or in development
    if (config.isDevelopment() || res.statusCode >= 400) {
      logEntry.body = this.sanitizeObject(responseBody)
    }

    this.writeLog('response', logEntry)
  }

  // Log security events
  logSecurityEvent(type, details, req = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'security',
      event: type,
      details: this.sanitizeObject(details),
      severity: this.getSecuritySeverity(type)
    }

    if (req) {
      logEntry.requestId = req.requestId
      logEntry.client = this.getClientInfo(req)
      logEntry.userId = req.user?.id || req.session?.userId || null
    }

    this.writeLog('security', logEntry)
  }

  // Log performance metrics
  logPerformance(req, metrics) {
    const logEntry = {
      ...this.createBaseLog(req, 'performance'),
      metrics: {
        responseTime: metrics.responseTime,
        dbQueries: metrics.dbQueries || 0,
        dbTime: metrics.dbTime || 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    }

    this.writeLog('performance', logEntry)
  }

  // Log database queries
  logDatabaseQuery(query, duration, req = null) {
    if (!config.isDevelopment()) return // Only log in development

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'database',
      query: this.sanitizeQuery(query),
      duration: `${duration}ms`,
      requestId: req?.requestId || null
    }

    this.writeLog('database', logEntry)
  }

  // Sanitize SQL queries
  sanitizeQuery(query) {
    if (typeof query !== 'string') return query

    // Remove sensitive data patterns
    return query
      .replace(/('([^'\\]|\\.)*')/g, "'[REDACTED]'") // Single quoted strings
      .replace(/("([^"\\]|\\.)*")/g, '"[REDACTED]"') // Double quoted strings
      .replace(/\b\d{13,}\b/g, '[TIMESTAMP]') // Timestamps
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[UUID]') // UUIDs
  }

  // Determine if request should be logged
  shouldLog(req) {
    // Skip health check endpoints
    if (req.path === '/health' || req.path === '/api/health') {
      return false
    }

    // Skip static assets
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return false
    }

    return true
  }

  // Get security event severity
  getSecuritySeverity(eventType) {
    const severityMap = {
      'login_failed': 'medium',
      'login_success': 'low',
      'rate_limit_exceeded': 'medium',
      'suspicious_request': 'high',
      'sql_injection_attempt': 'critical',
      'xss_attempt': 'high',
      'unauthorized_access': 'high',
      'session_hijack': 'critical',
      'password_reset': 'medium',
      'account_locked': 'medium',
      'csrf_detected': 'high'
    }

    return severityMap[eventType] || 'low'
  }

  // Write log to appropriate destination
  writeLog(category, logEntry) {
    const logString = JSON.stringify(logEntry)

    if (config.isDevelopment()) {
      // Console output in development
      console.log(`[${category.toUpperCase()}] ${logString}`)
    } else {
      // In production, you would send to a logging service
      // Examples: Winston, Bunyan, or cloud logging services
      this.writeToFile(category, logString)
    }

    // Send to external monitoring if configured
    this.sendToMonitoring(category, logEntry)
  }

  // Write to log file (production)
  writeToFile(category, logString) {
    const fs = require('fs')
    const path = require('path')

    try {
      const logDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      const logFile = path.join(logDir, `${category}.log`)
      fs.appendFileSync(logFile, logString + '\n')
    } catch (error) {
      console.error('Failed to write log file:', error)
    }
  }

  // Send to external monitoring service
  sendToMonitoring(category, logEntry) {
    // Integration with monitoring services like DataDog, New Relic, etc.
    // This would be configured based on your monitoring setup

    if (category === 'security' && logEntry.severity === 'critical') {
      // Send immediate alerts for critical security events
      this.sendSecurityAlert(logEntry)
    }
  }

  // Send security alerts
  sendSecurityAlert(logEntry) {
    // This would integrate with your alerting system
    console.error('SECURITY ALERT:', logEntry)
  }
}

// Singleton logger instance
const logger = new Logger()

// Request logging middleware
const requestLoggingMiddleware = (req, res, next) => {
  const startTime = Date.now()

  // Log the request
  logger.logRequest(req)

  // Capture response
  const originalSend = res.send
  let responseBody = null

  res.send = function(data) {
    responseBody = data
    return originalSend.call(this, data)
  }

  // Log response when finished
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    logger.logResponse(req, res, responseTime, responseBody)
  })

  next()
}

// Security event logger
const securityLogger = {
  loginFailed: (req, details) => logger.logSecurityEvent('login_failed', details, req),
  loginSuccess: (req, details) => logger.logSecurityEvent('login_success', details, req),
  rateLimitExceeded: (req, details) => logger.logSecurityEvent('rate_limit_exceeded', details, req),
  suspiciousRequest: (req, details) => logger.logSecurityEvent('suspicious_request', details, req),
  sqlInjectionAttempt: (req, details) => logger.logSecurityEvent('sql_injection_attempt', details, req),
  xssAttempt: (req, details) => logger.logSecurityEvent('xss_attempt', details, req),
  unauthorizedAccess: (req, details) => logger.logSecurityEvent('unauthorized_access', details, req),
  sessionHijack: (req, details) => logger.logSecurityEvent('session_hijack', details, req),
  passwordReset: (req, details) => logger.logSecurityEvent('password_reset', details, req),
  accountLocked: (req, details) => logger.logSecurityEvent('account_locked', details, req),
  csrfDetected: (req, details) => logger.logSecurityEvent('csrf_detected', details, req)
}

// Performance logger
const performanceLogger = (req, metrics) => logger.logPerformance(req, metrics)

// Database query logger
const databaseLogger = (query, duration, req) => logger.logDatabaseQuery(query, duration, req)

module.exports = {
  logger,
  requestLoggingMiddleware,
  securityLogger,
  performanceLogger,
  databaseLogger
}